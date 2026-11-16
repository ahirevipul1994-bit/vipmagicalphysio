export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
export const ensure = (condition, status, message) => { if (!condition) throw new HttpError(status, message); };
export function text(value, label, max = 200) {
  ensure(typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max, 400, `Enter a valid ${label}.`);
  return value.trim();
}
export function integer(value, label, min, max) {
  ensure(Number.isInteger(value) && value >= min && value <= max, 400, `Enter a valid ${label}.`);
  return value;
}
export function split(feePaise, clinicShareBps) {
  integer(feePaise, 'fee', 100, 10000000);
  integer(clinicShareBps, 'clinic share', 0, 10000);
  const clinicSharePaise = Math.round(feePaise * clinicShareBps / 10000);
  return { feePaise, clinicSharePaise, doctorSharePaise: feePaise - clinicSharePaise };
}
export const isStaff = user => Array.isArray(user?.app_metadata?.roles) && user.app_metadata.roles.some(role => ['admin', 'staff'].includes(role));
export function meetingLink(value) {
  const url = new URL(text(value, 'meeting link', 1000));
  ensure(url.protocol === 'https:' && !url.username && !url.password && ['meet.google.com', 'zoom.us', 'teams.microsoft.com', 'teams.live.com'].some(h => url.hostname === h || url.hostname.endsWith('.' + h)), 400, 'Use a Google Meet, Zoom or Microsoft Teams HTTPS meeting link.');
  return url.href;
}
export function futureDate(value) {
  const date = new Date(value);
  ensure(Number.isFinite(date.getTime()) && date.getTime() > Date.now() && date.getTime() < Date.now() + 90 * 86400000, 400, 'Choose a future date within 90 days.');
  return date.toISOString();
}
export function googleUrl(value) {
  if (!value) return '';
  const url = new URL(value);
  ensure(url.protocol === 'https:' && ['google.com', 'google.co.in', 'g.page', 'maps.app.goo.gl', 'goo.gl'].some(h => url.hostname === h || url.hostname.endsWith('.' + h)), 400, 'Enter your Google Maps or Google reviews HTTPS link.');
  return url.href;
}

export function staffChanges(current, body) {
  let changes;
    switch (body.action) {
      case 'verify': ensure(current.paymentStatus === 'submitted', 409, 'A submitted reference is required.'); changes = { paymentStatus: 'verified' }; break;
      case 'reject-payment': ensure(current.paymentStatus === 'submitted', 409, 'A submitted reference is required.'); changes = { paymentStatus: 'unpaid', paymentReference: null }; break;
      case 'confirm':
        ensure(current.status === 'requested' && current.paymentStatus === 'verified', 409, 'Verify payment before confirming a request.');
        changes = { status: 'confirmed', scheduledAt: futureDate(body.scheduledAt), meetingUrl: meetingLink(body.meetingUrl) }; break;
      case 'cancel': ensure(['requested', 'confirmed'].includes(current.status), 409, 'This appointment cannot be cancelled.'); changes = { status: 'cancelled' }; break;
      case 'refund': ensure(current.status === 'cancelled' && current.paymentStatus === 'verified' && current.settlementStatus === 'pending', 409, 'Only cancelled, verified payments awaiting settlement can be marked refunded.'); changes = { paymentStatus: 'refunded' }; break;
      case 'settle':
        ensure(current.status === 'completed' && current.paymentStatus === 'verified' && current.settlementStatus === 'pending', 409, 'Only completed, paid consultations can be settled once.');
        changes = { settlementStatus: 'paid', settlementReference: text(body.reference, 'payout transaction reference', 80) }; break;
      default: ensure(false, 400, 'Unknown action.');
    }
  return changes;
}
