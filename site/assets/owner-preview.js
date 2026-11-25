const endpoint = '/api/preview/enquiries';
const workspace = document.querySelector('#workspace');
const form = document.querySelector('#sample-form');
const fields = document.querySelector('#sample-fields');
const feedback = document.querySelector('#feedback');
const refresh = document.querySelector('#refresh');
const enquiries = document.querySelector('#enquiries');
const typeNames = { clinic: 'Clinic visit', home: 'Home visit', online: 'Online consultation', followup: 'Follow-up' };
const languageNames = { en: 'English', mr: 'Marathi', hi: 'Hindi' };
const statusNames = { new: 'New', contacted: 'Contacted', closed: 'Closed' };
const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
let pending;

function report(message, error = false) {
  feedback.textContent = message;
  feedback.classList.toggle('error', error);
}

async function request(method, body) {
  const response = await fetch(endpoint, {
    method,
    cache: 'no-store',
    credentials: 'same-origin',
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const messages = {
      401: 'Sign in to the protected Deploy Preview with your Netlify team account.',
      404: 'The inbox is only available on a protected Deploy Preview.',
      409: 'The request changed or its test reference was already used. Refresh the inbox before trying again.',
      503: 'The preview database is unavailable. Try again later.',
    };
    throw new Error(messages[response.status] || 'The inbox could not complete that action. Please try again.');
  }
  return response.json();
}

function item(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

async function load() {
  const { enquiries: rows, hasMore } = await request('GET');
  enquiries.replaceChildren();
  document.querySelector('#count').textContent = hasMore ? 'Showing the latest 50 requests' : `${rows.length} sample requests`;
  document.querySelector('#empty').hidden = rows.length > 0;
  for (const row of rows) {
    const lead = item('li', '', 'lead');
    const details = item('div');
    details.append(item('strong', `${typeNames[row.appointment_type]} · ${languageNames[row.language]}`),
      item('p', `${time.format(new Date(row.created_at))} IST · Ref ${row.id.slice(0, 8)}`),
      item('span', statusNames[row.status], 'status'));
    const actions = item('div', '', 'actions');
    for (const status of row.status === 'new' ? ['contacted', 'closed'] : row.status === 'contacted' ? ['closed'] : []) {
      const button = item('button', status === 'contacted' ? 'Mark contacted' : 'Close request', 'secondary');
      button.type = 'button';
      button.setAttribute('aria-label', `${button.textContent} for reference ${row.id.slice(0, 8)}`);
      button.addEventListener('click', () => run(async () => {
        await request('PATCH', { id: row.id, previous: row.status, status });
        await reload('Sample status updated.');
      }));
      actions.append(button);
    }
    lead.append(details, actions);
    enquiries.append(lead);
  }
  workspace.hidden = false;
}

async function reload(message) {
  try {
    await load();
    report(message);
  } catch {
    report(`${message} Refresh the inbox to see the latest requests.`, true);
  }
}

async function run(action) {
  if (refresh.disabled) return;
  refresh.disabled = true;
  fields.disabled = true;
  enquiries.querySelectorAll('button').forEach(button => { button.disabled = true; });
  report('Working…');
  try {
    await action();
  } catch (error) {
    report(error.message || 'The inbox is unavailable.', true);
  } finally {
    refresh.disabled = false;
    fields.disabled = false;
    enquiries.querySelectorAll('button').forEach(button => { button.disabled = false; });
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const type = data.get('type');
  const language = data.get('language');
  run(async () => {
    if (!pending || pending.type !== type || pending.language !== language) {
      pending = { id: crypto.randomUUID(), type, language, synthetic: true };
    }
    await request('POST', pending);
    pending = null;
    await reload('Sample enquiry saved. No appointment was booked.');
  });
});
refresh.addEventListener('click', () => run(async () => {
  await load();
  report('Inbox is up to date.');
}));
run(async () => {
  await load();
  report('Connected to the preview database.');
});
