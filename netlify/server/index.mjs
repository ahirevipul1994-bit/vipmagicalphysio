import { getDatabase } from '@netlify/database';
import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { z } from 'zod';

export const config = { path: '/api/*' };

const language = z.enum(['en', 'hi', 'mr']);
const kind = z.enum(['GENERAL', 'CLINIC', 'HOME_VISIT', 'ONLINE']);
const enquiryStatus = z.enum(['NEW', 'CONTACTED', 'APPOINTMENT_REQUESTED', 'CLOSED']);
const appointmentStatus = z.enum(['REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']);
const text = (max) => z.string().trim().max(max);
const timestamp = z.iso.datetime({ offset: true });
const istDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
const secureLink = z.union([z.literal(''), z.url({ protocol: /^https$/ }).max(2048)]).optional();
const enquiryInput = z.object({
  name: text(100).min(2),
  phone: text(21).regex(/^\+?[0-9 ()-]{10,20}$/).refine((phone) => /^\d{10,15}$/.test(phone.replace(/\D/g, ''))),
  email: z.email().max(160).optional(),
  kind,
  service: z.enum(['not-sure', 'orthopaedic-physiotherapy', 'neurological-rehabilitation', 'post-operative-rehabilitation', 'geriatric-physiotherapy', 'home-visit-physiotherapy', 'online-consultation']),
  preferred_date: z.iso.date().refine((date) => date >= istDate.format(new Date())).optional(),
  locality: text(120).optional(),
  message: text(500).optional(),
  consent: z.literal(true),
  language,
  idempotency_key: z.uuid(),
  website: z.literal('').optional(),
  source: text(200).optional(),
}).refine((input) => input.kind !== 'HOME_VISIT' || Boolean(input.locality));
const enquiryUpdate = z.object({
  id: z.uuid(), status: enquiryStatus.optional(), next_action: text(1000).optional(), follow_up_at: timestamp.nullable().optional(),
}).refine(({ status, next_action, follow_up_at }) => status !== undefined || next_action !== undefined || follow_up_at !== undefined);
const appointmentInput = z.object({
  id: z.uuid().optional(), enquiry_id: z.uuid(), starts_at: timestamp, ends_at: timestamp, kind, status: appointmentStatus, notes: text(1000),
}).refine(({ starts_at, ends_at }) => Date.parse(ends_at) > Date.parse(starts_at));
const contentInput = z.object({
  slug: z.string().regex(/^[a-z0-9/-]{1,100}$/), language, title: text(200).min(1), body: text(50000), published: z.boolean(),
});
const settingsInput = z.object({
  name: text(120).min(1), founder: text(120).min(1), location: text(200), phone: text(25).regex(/^[+0-9 ()-]*$/),
  whatsapp: text(25).regex(/^[+0-9 ()-]*$/), email: z.union([z.literal(''), z.email().max(160)]), hours: text(200),
  announcement: text(500), languages: z.array(text(50)).max(10), address: text(300), google: secureLink, youtube: secureLink, instagram: secureLink,
});
const financeInput = z.object({
  kind: z.enum(['PAYMENT', 'EXPENSE']), amount_paise: z.number().int().min(1).max(10000000000), description: text(500).min(1), occurred_at: timestamp,
});

const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (data, status = 200, extraHeaders = {}) => Response.json(data, { status, headers: { ...headers, ...extraHeaders } });
const empty = () => new Response(null, { status: 204, headers });

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function validatedBody(request, schema, maxBytes = 8192) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json' || !request.body) {
    throw new RequestError(415, 'Send a JSON request.');
  }
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new RequestError(413, 'This request is too large.');
    }
    body += decoder.decode(value, { stream: true });
  }
  let data;
  try { data = JSON.parse(body + decoder.decode()); }
  catch { throw new RequestError(400, 'The request body is not valid JSON.'); }
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new RequestError(400, 'Check the information entered and try again.');
  return parsed.data;
}

let database;
function pool() {
  database ??= getDatabase().pool;
  return database;
}

async function writeAs(user, statement, values) {
  const client = await pool().connect();
  try {
    await client.query('begin');
    await client.query("select set_config('vip_physio.actor', $1, true)", [user.id]);
    const result = await client.query(statement, values);
    if (!result.rowCount) throw new RequestError(404, 'This record no longer exists.');
    await client.query('commit');
    return empty();
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

const routes = new Set(['settings', 'content', 'owner', 'enquiries', 'appointments', 'finance', 'audit']);
const ownerRoles = new Set(['owner', 'admin']);

export default async function handler(request, context) {
  const url = new URL(request.url);
  const resource = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
  const method = request.method;
  const route = `${method} ${resource}`;
  if (!routes.has(resource)) return json({ error: 'Not found.' }, 404);
  try {
    if (method !== 'GET') verifyRequestOrigin(request);

    if (route === 'GET settings') {
      const { rows } = await pool().query('select value from vip_physio.business_settings where id = 1');
      return json(rows[0]?.value ?? {});
    }
    if (route === 'GET content' && url.searchParams.has('language')) {
      const selected = language.safeParse(url.searchParams.get('language'));
      if (!selected.success) throw new RequestError(400, 'Choose a supported language.');
      const { rows } = await pool().query('select slug, language, title, body, published from vip_physio.content_pages where language = $1 and published', [selected.data]);
      return json(rows);
    }
    if (route === 'POST enquiries') {
      const data = await validatedBody(request, enquiryInput);
      if (!context.ip) throw new RequestError(503, 'Online requests are temporarily unavailable. Please call or use WhatsApp.');
      const { rows } = await pool().query('select vip_physio.submit_enquiry($1::jsonb, $2) as reference', [JSON.stringify(data), context.ip]);
      if (!rows[0]?.reference) return json({ error: 'Too many requests today. Please call or use WhatsApp, or try again tomorrow.' }, 429);
      return json({ reference: rows[0].reference }, 201);
    }

    const user = await getUser();
    const owner = user?.roles?.some((role) => ownerRoles.has(role)) ?? false;
    if (route === 'GET owner') return json({ owner });
    if (!user) throw new RequestError(401, 'Please sign in to continue.');
    if (!owner) throw new RequestError(403, 'Owner access is required.');

    switch (route) {
      case 'GET enquiries':
        return json((await pool().query(`select id, created_at, name, phone, email, kind, service,
          preferred_date::text, locality, message, consent, language, source, status, next_action, follow_up_at
          from vip_physio.enquiries order by created_at desc limit 1000`)).rows);
      case 'PATCH enquiries': {
        const data = await validatedBody(request, enquiryUpdate);
        return await writeAs(user, `update vip_physio.enquiries set status = coalesce($2, status),
          next_action = coalesce($3, next_action), follow_up_at = case when $4::boolean then $5::timestamptz else follow_up_at end where id = $1`,
        [data.id, data.status ?? null, data.next_action ?? null, data.follow_up_at !== undefined, data.follow_up_at ?? null]);
      }
      case 'GET appointments':
        return json((await pool().query('select * from vip_physio.appointments order by starts_at limit 1000')).rows);
      case 'PUT appointments': {
        const data = await validatedBody(request, appointmentInput);
        const values = [data.enquiry_id, data.starts_at, data.ends_at, data.kind, data.status, data.notes];
        return data.id
          ? await writeAs(user, 'update vip_physio.appointments set enquiry_id = $1, starts_at = $2, ends_at = $3, kind = $4, status = $5, notes = $6 where id = $7', [...values, data.id])
          : await writeAs(user, 'insert into vip_physio.appointments (enquiry_id, starts_at, ends_at, kind, status, notes) values ($1, $2, $3, $4, $5, $6)', values);
      }
      case 'GET content':
        return json((await pool().query('select slug, language, title, body, published from vip_physio.content_pages order by slug, language')).rows);
      case 'PUT content': {
        const data = await validatedBody(request, contentInput, 320000);
        return await writeAs(user, `insert into vip_physio.content_pages (slug, language, title, body, published) values ($1, $2, $3, $4, $5)
          on conflict (slug, language) do update set title = excluded.title, body = excluded.body, published = excluded.published`,
        [data.slug, data.language, data.title, data.body, data.published]);
      }
      case 'PUT settings': {
        const data = await validatedBody(request, settingsInput, 16384);
        return await writeAs(user, 'update vip_physio.business_settings set value = $1::jsonb where id = 1', [JSON.stringify(data)]);
      }
      case 'GET finance':
        return json((await pool().query(`select id, kind, amount_paise::double precision, description, occurred_at, created_at
          from vip_physio.finance_records order by occurred_at desc limit 1000`)).rows);
      case 'POST finance': {
        const data = await validatedBody(request, financeInput);
        return await writeAs(user, 'insert into vip_physio.finance_records (kind, amount_paise, description, occurred_at) values ($1, $2, $3, $4)',
          [data.kind, data.amount_paise, data.description, data.occurred_at]);
      }
      case 'GET audit':
        return json((await pool().query('select id, action, entity, created_at from vip_physio.audit_logs order by created_at desc limit 100')).rows);
      default:
        return json({ error: 'Method not allowed.' }, 405);
    }
  } catch (error) {
    if (error instanceof RequestError) return json({ error: error.message }, error.status);
    if (error?.status === 403) return json({ error: 'This request did not come from the website.' }, 403);
    if (error?.code === '23P01') return json({ error: 'This appointment overlaps an existing confirmed booking.' }, 409);
    if (error?.code === '23503') return json({ error: 'The linked enquiry no longer exists.' }, 409);
    return json({ error: 'This service is temporarily unavailable. Please try again.' }, 503);
  }
}
