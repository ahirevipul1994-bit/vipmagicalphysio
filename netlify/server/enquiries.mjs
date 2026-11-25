const types = new Set(['clinic', 'home', 'online', 'followup']);
const languages = new Set(['en', 'mr', 'hi']);
const transitions = { new: ['contacted', 'closed'], contacted: ['closed'] };
const uuid = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const validId = value => typeof value === 'string' && uuid.test(value);

function respond(status, body) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}

async function readBody(request) {
  if (!request.body || request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let body = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    const payload = JSON.parse(body + decoder.decode());
    return payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export function createEnquiryHandler(getSql) {
  return async (request, context) => {
    if (context?.deploy?.context !== 'deploy-preview') return respond(404, { error: 'not_available' });
    const actor = context.user?.id;
    if (typeof actor !== 'string' || !actor) return respond(401, { error: 'team_login_required' });

    const { origin } = new URL(request.url);
    if (request.method !== 'GET' && request.headers.get('origin') !== origin) {
      return respond(403, { error: 'origin_not_allowed' });
    }

    try {
      if (request.method === 'GET') {
        const sql = getSql();
        const rows = await sql`
          SELECT id, appointment_type, language, status, created_at
          FROM vip_preview_enquiries ORDER BY created_at DESC, id DESC LIMIT 51`;
        return respond(200, { enquiries: rows.slice(0, 50), hasMore: rows.length > 50 });
      }

      if (request.method === 'POST') {
        const body = await readBody(request);
        if (!body || Object.keys(body).length !== 4 || !validId(body.id) || body.synthetic !== true ||
          !types.has(body.type) || !languages.has(body.language)) return respond(400, { error: 'invalid_request' });

        const sql = getSql();
        const [row] = await sql`
          INSERT INTO vip_preview_enquiries (id, appointment_type, language, created_by)
          VALUES (${body.id}, ${body.type}, ${body.language}, ${actor})
          ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
            WHERE vip_preview_enquiries.appointment_type = EXCLUDED.appointment_type
              AND vip_preview_enquiries.language = EXCLUDED.language
              AND vip_preview_enquiries.created_by = EXCLUDED.created_by
          RETURNING id`;
        return row ? respond(200, { id: row.id }) : respond(409, { error: 'request_conflict' });
      }

      if (request.method === 'PATCH') {
        const body = await readBody(request);
        if (!body || Object.keys(body).length !== 3 || !validId(body.id) || typeof body.previous !== 'string' ||
          !Object.hasOwn(transitions, body.previous) || !transitions[body.previous].includes(body.status)) {
          return respond(400, { error: 'invalid_transition' });
        }

        const sql = getSql();
        const [row] = await sql`
          WITH changed AS (
            UPDATE vip_preview_enquiries SET status = ${body.status}
            WHERE id = ${body.id} AND status = ${body.previous} RETURNING id, status
          )
          INSERT INTO vip_preview_enquiry_activity (enquiry_id, previous_status, new_status, actor_id)
          SELECT id, ${body.previous}, status, ${actor} FROM changed RETURNING enquiry_id`;
        return row ? respond(200, { id: row.enquiry_id }) : respond(409, { error: 'request_conflict' });
      }

      return respond(405, { error: 'method_not_allowed' });
    } catch {
      console.error('Preview enquiry database operation failed');
      return respond(503, { error: 'inbox_unavailable' });
    }
  };
}
