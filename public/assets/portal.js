const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const mode = $('[data-portal]')?.dataset.portal;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((value || 0) / 100);
const date = value => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Awaiting confirmation';
const id = new URLSearchParams(location.search).get('appointment');
let sdkPromise, me, publicData, appointmentRows = [], authMode = 'login', inviteToken;
const sdk = () => sdkPromise ||= import('https://esm.sh/@netlify/identity@2.0.1?bundle');
function message(value, error = false) {
  const el = $('#portal-message');
  if (!el) return;
  el.hidden = !value; el.textContent = value; el.dataset.error = String(error);
  if (value) el.focus({ preventScroll: false });
}
async function api(path, body) {
  const res = await fetch('/api' + path, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', headers: body === undefined ? {} : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  let data;
  try { data = await res.json(); } catch { throw new Error('The service is unavailable. Please retry or call 86248 60808.'); }
  if (!res.ok) { const error = new Error(data.error || 'Unable to complete this request.'); error.status = res.status; throw error; }
  return data;
}
const button = (text, action, value = '', extra = '') => `<button type="button" class="btn btn--ghost" data-action="${action}" data-id="${esc(value)}" ${extra}>${text}</button>`;
const empty = (title, text, link = '', label = '') => `<div class="portal-empty"><h3>${title}</h3><p>${text}</p>${link ? `<a class="btn btn--primary" href="${link}">${label}</a>` : ''}</div>`;
async function run(element, operation) {
  const btn = element?.matches('button') ? element : element?.querySelector('button[type=submit]');
  if (btn) btn.disabled = true;
  message('');
  try { await operation(); } catch (error) {
    if (error.status === 401) message('Your session has expired. Sign in again to continue.', true);
    else message(error.message || 'Please retry or call the clinic.', true);
  } finally { if (btn) btn.disabled = false; }
}
function renderDoctors() {
  const query = $('#doctor-search').value.trim().toLowerCase();
  const specialty = $('#specialty-filter').value;
  const list = publicData.doctors.filter(d => (!specialty || d.specialty === specialty) && `${d.name} ${d.specialty} ${d.bio}`.toLowerCase().includes(query));
  $('#doctor-list').innerHTML = list.length ? list.map(d => `<article class="portal-card doctor-card"><div class="doctor-avatar" aria-hidden="true">${esc(d.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join(''))}</div><div><span class="portal-pill">Clinic-approved profile</span><h3 style="margin-top:.65rem">${esc(d.name)}</h3><p>${esc(d.specialty)} · ${esc(d.qualification)}</p><p class="portal-small">Registration: ${esc(d.registration)}</p><p style="margin:1rem 0">${esc(d.bio)}</p><div class="portal-meta"><span>Speaks ${esc(d.languages)}</span><span>Online · By appointment</span></div></div><div><p class="portal-price">${money(d.feePaise)}</p><p class="portal-small">per consultation</p><a class="btn btn--support" style="margin-top:1rem" href="consultation-booking.html?doctor=${encodeURIComponent(d.id)}">Request consultation</a></div></article>`).join('') : empty(publicData.doctors.length ? 'No matching doctors' : 'Our online network is opening.', publicData.doctors.length ? 'Try another name or specialty.' : 'Doctor profiles appear after the clinic reviews and approves their credentials. You can still request physiotherapy with Dr. Vipul Ahire through the clinic booking page.', publicData.doctors.length ? '' : 'booking.html', 'Request physiotherapy');
}
async function session() {
  try {
    await (await sdk()).getUser();
    me = await api('/me');
    return true;
  } catch (error) {
    $('#sign-in-prompt').hidden = false;
    const login = $('#sign-in-prompt a');
    if (login) login.href = 'login.html?next=' + encodeURIComponent(location.pathname + location.search);
    if (error.status && error.status !== 401) throw error;
    if (['payment', 'confirmation'].includes(mode)) $(`#${mode}-content`).innerHTML = '';
    return false;
  }
}
function ownAppointment() { return appointmentRows.find(a => a.id === id); }
function appointmentCard(a) {
  const staff = mode === 'staff', doctor = mode === 'doctor';
  const doctorShare = a.feePaise - a.clinicSharePaise;
  let actions = '';
  if (!staff && !doctor && a.status === 'requested' && a.paymentStatus === 'unpaid') actions += `<a class="btn btn--support" href="payment.html?appointment=${encodeURIComponent(a.id)}">View &amp; pay</a>`;
  if (!staff && !doctor && a.status === 'requested') actions += button('Cancel request', 'cancel', a.id);
  if (a.meetingUrl && a.status === 'confirmed') actions += `<a class="btn btn--support" href="${esc(a.meetingUrl)}" target="_blank" rel="noopener noreferrer">Join consultation</a>`;
  if (doctor && a.status === 'confirmed' && a.paymentStatus === 'verified') actions += button('Mark consultation completed', 'complete', a.id);
  let tools = '';
  if (staff) {
    if (a.paymentStatus === 'submitted') tools += `<form class="portal-form" data-task="verify" data-id="${esc(a.id)}"><label class="portal-check"><input type="checkbox" required><span>I checked the clinic’s bank statement and confirmed receipt of ${money(a.feePaise)} against this reference.</span></label><div class="portal-actions"><button class="btn btn--support" type="submit">Verify payment received</button>${button('Reject payment reference', 'reject-payment', a.id)}</div></form>`;
    if (a.status === 'requested' && a.paymentStatus === 'verified') tools += `<form class="portal-form" data-task="confirm" data-id="${esc(a.id)}"><label>Confirmed date &amp; time<input type="datetime-local" name="scheduledAt" required></label><label>Private video meeting link<input type="url" name="meetingUrl" placeholder="https://meet.google.com/…" required></label><button type="submit" class="btn btn--support">Confirm appointment &amp; share link</button></form>`;
    if (['requested', 'confirmed'].includes(a.status)) actions += button('Cancel appointment', 'staff-cancel', a.id);
    if (a.status === 'cancelled' && a.paymentStatus === 'verified' && a.settlementStatus === 'pending') tools += `<form class="portal-form" data-task="refund" data-id="${esc(a.id)}"><label class="portal-check"><input type="checkbox" required><span>I have sent the full refund through the original payment method.</span></label><button type="submit" class="btn btn--ghost">Record refund sent</button></form>`;
    if (a.status === 'completed' && a.paymentStatus === 'verified' && a.settlementStatus === 'pending') tools += `<form class="portal-form" data-task="settle" data-id="${esc(a.id)}"><label>Doctor payout transaction reference<input name="reference" required maxlength="80"></label><label class="portal-check"><input type="checkbox" required><span>I already transferred ${money(doctorShare)} to the doctor.</span></label><button type="submit" class="btn btn--primary">Record doctor payout</button></form>`;
  }
  return `<article class="portal-card"><div class="portal-table-head"><h3>${esc(a.doctor.name)}</h3><span class="portal-pill">${esc(a.status)}</span></div><p>${esc(a.doctor.specialty)}${staff || doctor ? ` · Patient: ${esc(a.patientName)} · ${esc(a.phone)}` : ''}</p><div class="portal-meta"><span>Preferred: ${date(a.preferredAt)}</span><span>Confirmed: ${date(a.scheduledAt)}</span></div><p><strong>${money(a.feePaise)}</strong> · Payment: ${esc(a.paymentStatus)}${a.paymentReference ? ` · Reference: <code>${esc(a.paymentReference)}</code>` : ''}</p>${staff || doctor ? `<div class="portal-ledger"><div>Consultation fee<strong>${money(a.feePaise)}</strong></div><div>Clinic share<strong>${money(a.clinicSharePaise)}</strong></div><div>Doctor share<strong>${money(doctorShare)}</strong></div></div><p class="portal-small">Payout: ${esc(a.settlementStatus)}${a.settlementReference ? ` · ${esc(a.settlementReference)}` : ''}</p>` : ''}<p class="portal-small">Booking ID: <code>${esc(a.id)}</code></p>${a.status === 'cancelled' && ['submitted', 'verified'].includes(a.paymentStatus) ? '<p class="portal-note">If you transferred funds, contact the clinic to arrange payment review or a refund. Cancellation does not automatically refund a transfer.</p>' : ''}<div class="portal-actions">${actions}</div>${tools ? `<details><summary>Manage appointment</summary><div class="portal-list">${tools}</div></details>` : ''}</article>`;
}
function renderAppointments() {
  const filter = $('#appointment-filter').value;
  const list = appointmentRows.filter(a => !filter || a.status === filter);
  $('#appointments').innerHTML = list.length ? list.map(appointmentCard).join('') : empty('No consultations to show.', filter ? 'Try another status filter.' : 'Consultation requests appear here when they are submitted.', mode === 'patient' ? 'doctors.html' : '', 'Find a doctor');
}
function renderStats() {
  const active = appointmentRows.filter(a => ['requested', 'confirmed'].includes(a.status)).length;
  const earned = appointmentRows.filter(a => a.status === 'completed' && a.paymentStatus === 'verified');
  let stats = [[active, 'Active consultation requests'], [appointmentRows.filter(a => a.status === 'completed').length, 'Completed consultations'], [appointmentRows.filter(a => a.paymentStatus === 'submitted').length, 'Payments awaiting verification']];
  if (mode === 'doctor') stats = [[active, 'Active consultations'], [money(earned.reduce((sum, a) => sum + a.feePaise - a.clinicSharePaise, 0)), 'Doctor earnings · completed & paid'], [money(earned.filter(a => a.settlementStatus === 'pending').reduce((sum, a) => sum + a.feePaise - a.clinicSharePaise, 0)), 'Awaiting manual payout']];
  if (mode === 'staff') stats = [[active, 'Active consultations'], [money(earned.reduce((sum, a) => sum + a.clinicSharePaise, 0)), 'Clinic share · completed & paid'], [money(earned.filter(a => a.settlementStatus === 'pending').reduce((sum, a) => sum + a.feePaise - a.clinicSharePaise, 0)), 'Doctor payouts pending']];
  $('#dashboard-stats').innerHTML = stats.map(([value, label]) => `<div class="portal-stat"><strong>${value}</strong><span>${label}</span></div>`).join('');
}
async function refreshDashboard() {
  const response = await api('/appointments?view=' + mode);
  appointmentRows = response.appointments;
  renderStats(); renderAppointments();
  if (mode === 'staff') {
    const data = await api('/staff/doctors');
    $('#applications').innerHTML = data.doctors.length ? data.doctors.map(d => `<article class="portal-card"><div class="portal-table-head"><h3>${esc(d.name)}</h3><span class="portal-pill">${esc(d.status)}</span></div><p>${esc(d.specialty)} · ${esc(d.qualification)}</p><p>Registration: ${esc(d.registration)}</p><p>${esc(d.bio)}</p><p>Languages: ${esc(d.languages)}</p><p>Fee: ${money(d.feePaise)} · Proposed clinic share: ${d.clinicShareBps / 100}% · Doctor share: ${money(d.feePaise - Math.round(d.feePaise * d.clinicShareBps / 10000))}</p>${d.status === 'pending' ? `<form class="portal-form" data-task="approve-doctor" data-id="${esc(d.id)}"><label class="portal-check"><input type="checkbox" required><span>I verified this clinician’s credentials and accept the proposed fee and clinic share.</span></label><div class="portal-actions"><button class="btn btn--support" type="submit">Approve &amp; publish profile</button>${button('Reject application', 'reject-doctor', d.id)}</div></form>` : ''}</article>`).join('') : empty('No doctor applications yet.', 'Doctors can apply through the partner page.', 'doctor-partners.html', 'View partner application');
  }
}
async function dashboard() {
  if (!(await session())) return;
  if (mode === 'staff' && !me.staff) { message('Clinic staff access is required. Ask the site owner to assign your account the admin or staff role in Netlify Identity, then sign out and sign in again.', true); return; }
  $('#dashboard-content').hidden = false;
  $('#account-name').textContent = 'Signed in as ' + me.name;
  $('#appointment-filter').addEventListener('change', renderAppointments);
  $('#staff-view-link').hidden = !me.staff;
  if (mode === 'staff') {
    $('#staff-tools').hidden = false;
    publicData = await api('/public');
    for (const [key, value] of Object.entries(publicData.settings)) if ($('#settings-form').elements[key]) $('#settings-form').elements[key].value = value;
  }
  if (mode === 'doctor') {
    const data = await api('/doctor');
    if (data.doctor?.status !== 'approved') {
      $('#doctor-profile-status').innerHTML = empty(data.doctor ? 'Application: ' + esc(data.doctor.status) : 'Join the clinician network.', 'An approved profile is required to receive online consultation requests.', 'doctor-partners.html', 'View application');
      $('#appointments').innerHTML = empty('No assigned consultations.', 'Approved clinicians see their assigned appointments here.');
      return;
    }
  }
  await refreshDashboard();
}
async function booking() {
  publicData = await api('/public');
  if (!publicData.doctors.length) {
    $('#booking-doctor').innerHTML = 'Online doctor profiles are not yet available. <a href="booking.html">Request physiotherapy with the clinic</a> or call 86248 60808.';
    return;
  }
  $('#booking-doctor-select').innerHTML += publicData.doctors.map(d => `<option value="${esc(d.id)}">${esc(d.name)} · ${esc(d.specialty)} · ${money(d.feePaise)}</option>`).join('');
  $('#booking-doctor-select').value = new URLSearchParams(location.search).get('doctor') || '';
  $('#booking-doctor').textContent = 'Select a clinician to see their consultation fee. Your preferred time is subject to confirmation.';
  $('#booking-doctor-select').addEventListener('change', () => {
    const doctor = publicData.doctors.find(d => d.id === $('#booking-doctor-select').value);
    $('#booking-doctor').textContent = doctor ? `${doctor.name} · ${doctor.specialty} · ${money(doctor.feePaise)} per consultation` : 'Choose an approved doctor.';
  });
  $('#booking-doctor-select').dispatchEvent(new Event('change'));
  if (await session()) { $('#consultation-form').hidden = false; $('#consultation-form').elements.patientName.value = me.name || ''; }
}
async function partner() {
  if (!(await session())) return;
  const { doctor } = await api('/doctor');
  if (doctor) $('#partner-status').innerHTML = empty('Application: ' + esc(doctor.status), doctor.status === 'approved' ? 'Your profile is published. Visit your doctor dashboard for appointments and payouts.' : 'The clinic reviews your credentials and proposed terms before publishing your profile.', doctor.status === 'approved' ? 'doctor-dashboard.html' : '', 'Open doctor dashboard');
  if (!doctor || doctor.status === 'rejected') {
    $('#doctor-form').hidden = false;
    if (doctor) {
      for (const key of ['name', 'specialty', 'qualification', 'registration', 'bio', 'languages']) $('#doctor-form').elements[key].value = doctor[key];
      $('#doctor-form').elements.fee.value = doctor.feePaise / 100;
      $('#doctor-form').elements.clinicShare.value = doctor.clinicShareBps / 100;
    }
  }
}
async function payment() {
  if (!(await session())) return;
  [publicData, { appointments: appointmentRows }] = await Promise.all([api('/public'), api('/appointments')]);
  const a = ownAppointment();
  if (!a) { $('#payment-content').innerHTML = empty('Choose a consultation first.', 'Open a consultation from your dashboard to view its payment details.', 'dashboard.html', 'My dashboard'); return; }
  const config = publicData.settings;
  let next = '';
  if (a.paymentStatus === 'unpaid' && a.status === 'requested') {
    if (config.upiId) {
      const upi = 'upi://pay?' + new URLSearchParams({ pa: config.upiId, pn: config.payeeName || 'VIP Magical Physio Clinic', am: (a.feePaise / 100).toFixed(2), cu: 'INR', tn: 'Consultation ' + a.id });
      next = `<div class="portal-note"><p><strong>Clinic consultation payment</strong></p>${config.payeeName ? `<p>Recipient name: <strong>${esc(config.payeeName)}</strong></p>` : '<p>The bank-registered recipient name appears in your UPI app. Contact the clinic if you do not recognise it.</p>'}<p>UPI ID: <code>${esc(config.upiId)}</code></p><p>Confirm the payment address in your UPI app before authorising the transfer.</p></div><div class="portal-actions"><a class="btn btn--support" href="${esc(upi)}">Open UPI app · ${money(a.feePaise)}</a>${button('Copy UPI ID', 'copy-upi')}</div><p class="portal-small" style="margin-top:1rem">On a desktop, use your phone’s UPI app and enter the UPI ID and exact amount above.</p><form id="payment-reference-form" class="portal-form" style="margin-top:1.5rem"><label>UPI transaction reference<input name="reference" required pattern="[A-Za-z0-9]{8,30}" minlength="8" maxlength="30" placeholder="Reference from your payment app"></label><label class="portal-check"><input type="checkbox" required><span>My UPI app shows this transfer as successful. I understand the clinic verifies receipt before confirming payment.</span></label><button type="submit" class="btn btn--primary">Submit reference for verification</button></form>`;
    } else next = empty('Payment instructions are being prepared.', 'The clinic has not added its UPI details yet. Call 86248 60808 before sending money. Your consultation request remains in your dashboard.', 'dashboard.html', 'Back to dashboard');
  } else next = `<div class="portal-note">Payment status: <strong>${esc(a.paymentStatus)}</strong>. ${a.paymentStatus === 'submitted' ? 'Your reference is awaiting verification by the clinic.' : 'Check your dashboard for appointment updates.'}</div><a href="dashboard.html" class="btn btn--primary">My dashboard</a>`;
  $('#payment-content').innerHTML = `<article class="portal-card"><span class="portal-kicker">Consultation summary</span><h2>${esc(a.doctor.name)}</h2><p>${esc(a.doctor.specialty)}</p><p class="portal-price">${money(a.feePaise)}</p><p class="portal-small">Booking ID: <code>${esc(a.id)}</code></p>${next}<p class="portal-small">By paying, you accept the <a href="consultation-terms.html">consultation terms</a> and <a href="refund-policy.html">refund policy</a>.</p></article>`;
}
async function confirmation() {
  if (!(await session())) return;
  appointmentRows = (await api('/appointments')).appointments;
  const a = ownAppointment();
  $('#confirmation-content').innerHTML = a ? `<div class="portal-note"><strong>${a.status === 'confirmed' ? 'Appointment confirmed.' : a.status === 'requested' ? 'Your request has been received.' : 'Appointment: ' + esc(a.status)}</strong> ${a.status === 'requested' ? 'Your preferred time is not yet reserved. Complete payment if instructed, then check your dashboard for clinic confirmation.' : ''}</div>${appointmentCard(a)}<div class="portal-actions" style="margin-top:1.2rem"><a href="dashboard.html" class="btn btn--primary">Open my dashboard</a><a href="patient-guide.html" class="btn btn--ghost">Prepare for your consultation</a></div>` : empty('No request selected.', 'Your submitted consultation requests are available in your dashboard.', 'dashboard.html', 'My dashboard');
}
async function reviews() {
  let config;
  try { config = (await api('/public')).settings; } catch { config = {}; }
  const url = config.googleReviewsUrl || window.PX_CONFIG?.gbp?.profileUrl;
  $('#review-links').innerHTML = url ? `<div class="portal-actions"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="btn btn--support">Read or leave a review on Google</a></div>` : `<div class="portal-note">The clinic’s direct Google profile link has not been added yet. Search for the clinic on Maps and confirm the business details before leaving a review.</div><a class="btn btn--primary" href="https://www.google.com/maps/search/?api=1&amp;query=VIP%20Magical%20Physio%20Clinic%20Shirur%20Pune" target="_blank" rel="noopener noreferrer">Find the clinic on Google Maps</a>`;
}
function setAuthMode(value) {
  authMode = value;
  const isNew = value === 'signup', passwordOnly = ['reset', 'invite'].includes(value), recovery = value === 'recovery';
  $('#auth-title').textContent = ({ login: 'Sign in', signup: 'Create your account', recovery: 'Reset your password', reset: 'Choose a new password', invite: 'Accept your invitation' })[value];
  $('#auth-name-label').hidden = !isNew; $('#auth-form').elements.name.required = isNew;
  $('#auth-email-label').hidden = passwordOnly; $('#auth-form').elements.email.required = !passwordOnly;
  $('#auth-password-label').hidden = recovery; $('#auth-form').elements.password.required = !recovery;
  $('#auth-form').elements.password.minLength = value === 'login' ? 1 : 10;
  $('#auth-form').elements.password.autocomplete = value === 'login' ? 'current-password' : 'new-password';
  $('#auth-submit').textContent = ({ login: 'Sign in', signup: 'Create account', recovery: 'Send reset email', reset: 'Save new password', invite: 'Set password & accept' })[value];
}
function afterLogin() {
  const next = new URLSearchParams(location.search).get('next');
  const allowed = ['dashboard.html', 'staff-dashboard.html', 'doctor-dashboard.html', 'doctor-partners.html', 'consultation-booking.html', 'payment.html', 'appointment-confirmation.html'];
  let target = 'dashboard.html';
  if (next) { const parsed = new URL(next, location.origin); if (parsed.origin === location.origin && allowed.includes(parsed.pathname.replace(/^\//, ''))) target = parsed.pathname + parsed.search; }
  location.assign(target);
}
async function loginPage() {
  setAuthMode('login');
  try {
    const callback = await (await sdk()).handleAuthCallback();
    if (callback?.type === 'recovery') { setAuthMode('reset'); message('Choose a new password for your account.'); }
    else if (callback?.type === 'invite') { inviteToken = callback.token; setAuthMode('invite'); }
    else if (callback?.user) { message('Your account is confirmed. Opening your dashboard…'); afterLogin(); }
  } catch { message('This account link could not be processed. Try signing in or request a new password reset email.', true); }
}
document.addEventListener('input', event => {
  if (event.target.closest('#doctor-form')) {
    const f = $('#doctor-form').elements, fee = Math.round(Number(f.fee.value) * 100), share = Math.round(Number(f.clinicShare.value) * 100);
    if (f.fee.value && f.clinicShare.value && fee > 0 && share >= 0 && share <= 10000) $('#split-preview').textContent = `Per consultation: clinic ${money(Math.round(fee * share / 10000))} · you ${money(fee - Math.round(fee * share / 10000))}. These terms require clinic approval.`;
  }
});
document.addEventListener('click', event => {
  const btn = event.target.closest('button');
  if (!btn) return;
  if (btn.dataset.authMode) { setAuthMode(btn.dataset.authMode); message(''); return; }
  if (btn.id === 'logout') { run(btn, async () => { await (await sdk()).logout(); location.assign('login.html'); }); return; }
  if (btn.id === 'refresh-dashboard') { run(btn, refreshDashboard); return; }
  const { action, id: rowId } = btn.dataset;
  if (!action) return;
  run(btn, async () => {
    if (action === 'copy-upi') { await navigator.clipboard.writeText(publicData.settings.upiId); message('UPI ID copied. Confirm the recipient in your payment app before paying.'); return; }
    if (action === 'retry') { location.reload(); return; }
    if (action === 'cancel' || action === 'complete') { await api(`/appointments/${encodeURIComponent(rowId)}/${action}`, {}); }
    else if (action === 'reject-doctor') await api('/staff/doctors/' + encodeURIComponent(rowId), { status: 'rejected' });
    else if (action === 'reject-payment' || action === 'staff-cancel') await api('/staff/appointments/' + encodeURIComponent(rowId), { action: action === 'staff-cancel' ? 'cancel' : action });
    if (['patient', 'staff', 'doctor'].includes(mode)) await refreshDashboard();
    else if (mode === 'confirmation') await confirmation();
    message('Update saved.');
  });
});
document.addEventListener('submit', event => {
  const form = event.target;
  if (!form.matches('.portal-form')) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  run(form, async () => {
    if (form.id === 'auth-form') {
      const identity = await sdk();
      try {
        if (authMode === 'signup') {
          const user = await identity.signup(values.email, values.password, { full_name: values.name });
          if (user.emailVerified) afterLogin();
          else { message('Check your email to confirm your account, then sign in.'); setAuthMode('login'); }
        } else if (authMode === 'recovery') { await identity.requestPasswordRecovery(values.email); message('If this email has an account, a password reset link is on its way.'); }
        else if (authMode === 'reset') { await identity.updateUser({ password: values.password }); afterLogin(); }
        else if (authMode === 'invite') { await identity.acceptInvite(inviteToken, values.password); afterLogin(); }
        else { await identity.login(values.email, values.password); afterLogin(); }
      } catch (error) { throw new Error(error.status === 401 ? 'Check your email and password, and confirm your email before signing in.' : error.status === 422 ? 'Check your details and use a password with at least 10 characters.' : 'Account access is unavailable. Retry, use a fresh account link, or contact the clinic.'); }
    } else if (form.id === 'consultation-form') {
      const data = await api('/appointments', { ...values, preferredAt: new Date(values.preferredAt).toISOString(), consent: form.elements.consent.checked });
      location.assign('appointment-confirmation.html?appointment=' + encodeURIComponent(data.appointment.id));
    } else if (form.id === 'doctor-form') {
      await api('/doctor', { ...values, feePaise: Math.round(Number(values.fee) * 100), clinicShareBps: Math.round(Number(values.clinicShare) * 100), termsAccepted: form.elements.termsAccepted.checked });
      form.hidden = true; await partner(); message('Your application is saved for clinic review.');
    } else if (form.id === 'payment-reference-form') {
      await api('/appointments/' + encodeURIComponent(id) + '/payment', { reference: values.reference });
      await payment(); message('Reference submitted. The clinic verifies receipt before confirming your payment.');
    } else if (form.id === 'settings-form') {
      await api('/staff/settings', values); message('Clinic payment and Google review settings saved.');
    } else if (form.dataset.task) {
      const task = form.dataset.task, rowId = form.dataset.id;
      if (task === 'approve-doctor') await api('/staff/doctors/' + encodeURIComponent(rowId), { status: 'approved' });
      else await api('/staff/appointments/' + encodeURIComponent(rowId), { ...values, action: task, ...(task === 'confirm' ? { scheduledAt: new Date(values.scheduledAt).toISOString() } : {}) });
      await refreshDashboard(); message('Update saved.');
    }
  });
});
async function boot() {
  if (mode === 'doctors') {
    publicData = await api('/public');
    $('#specialty-filter').innerHTML += [...new Set(publicData.doctors.map(d => d.specialty))].sort().map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
    $('#doctor-search').addEventListener('input', renderDoctors); $('#specialty-filter').addEventListener('change', renderDoctors); renderDoctors();
  } else if (['patient', 'staff', 'doctor'].includes(mode)) await dashboard();
  else if (mode === 'book') await booking();
  else if (mode === 'partner') await partner();
  else if (mode === 'payment') await payment();
  else if (mode === 'confirmation') await confirmation();
  else if (mode === 'reviews') await reviews();
  else if (mode === 'login') await loginPage();
}
boot().catch(error => {
  message(error.message || 'The service is unavailable. Please retry or call the clinic.', true);
  $$('.portal-loading').forEach(el => { el.outerHTML = empty('Unable to load right now.', 'Please retry or call 86248 60808 for help.') + button('Retry', 'retry'); });
});
