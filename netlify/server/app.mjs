import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { eq, and, desc, lte } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { appointments, doctors, settings } from '../../db/schema.ts';
import { ensure, text, integer, split, isStaff, futureDate, googleUrl, staffChanges } from './policies.mjs';

export async function authenticate(request) {
  const match = (request.headers.get('cookie') || '').match(/(?:^|;\s*)nf_jwt=([^;]+)/);
  if (!match) return null;
  // Validate the cookie with the clinic's Identity service. Never trust decoded JWT claims alone.
  const response = await fetch('https://vipmagicalphysio.netlify.app/.netlify/identity/user', {
    headers: { Authorization: `Bearer ${decodeURIComponent(match[1])}` }, signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user.id && user.confirmed_at ? user : null;
}
const publicDoctor = { id: doctors.id, name: doctors.name, specialty: doctors.specialty, qualification: doctors.qualification, registration: doctors.registration, bio: doctors.bio, languages: doctors.languages, feePaise: doctors.feePaise };
export function createApp(db, auth = authenticate) {
  const app = new Hono();
  app.use('/api/*', async (c, next) => {
    c.header('Cache-Control', 'no-store'); c.header('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD'].includes(c.req.method)) {
      const origin = c.req.header('origin');
      ensure(origin && origin === new URL(c.req.url).origin, 403, 'Please submit this request from the clinic website.');
      ensure(c.req.header('content-type')?.includes('application/json'), 415, 'JSON content is required.');
    }
    await next();
  });
  app.use('/api/*', bodyLimit({ maxSize: 16000, onError: c => c.json({ error: 'Request is too large.' }, 413) }));
  app.get('/api/public', async c => {
    const [config] = await db.select().from(settings).where(eq(settings.id, 1));
    const list = await db.select(publicDoctor).from(doctors).where(eq(doctors.status, 'approved')).orderBy(doctors.name);
    return c.json({ doctors: list, settings: config || { upiId: '', payeeName: '', googleReviewsUrl: '' } });
  });
  app.use('/api/*', async (c, next) => {
    const user = await auth(c.req.raw);
    ensure(user, 401, 'Please sign in to continue.');
    c.set('user', user); c.set('staff', isStaff(user));
    await next();
  });
  app.get('/api/me', c => c.json({ id: c.get('user').id, name: c.get('user').user_metadata?.full_name || c.get('user').email, staff: c.get('staff') }));
  app.get('/api/doctor', async c => {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, c.get('user').id));
    return c.json({ doctor: doctor || null });
  });
  app.post('/api/doctor', async c => {
    const body = await c.req.json();
    ensure(body.termsAccepted === true, 400, 'Accept the doctor partnership terms.');
    const input = {
      name: text(body.name, 'name', 100), specialty: text(body.specialty, 'specialty', 100),
      qualification: text(body.qualification, 'qualifications', 200), registration: text(body.registration, 'registration number', 150),
      bio: text(body.bio, 'profile summary', 1000), languages: text(body.languages, 'languages', 120),
      feePaise: integer(body.feePaise, 'consultation fee', 100, 10000000),
      clinicShareBps: integer(body.clinicShareBps, 'proposed clinic share', 0, 10000), termsAccepted: true,
    };
    const [existing] = await db.select().from(doctors).where(eq(doctors.userId, c.get('user').id));
    ensure(!existing || existing.status === 'rejected', 409, 'Your application is already submitted. Contact the clinic to change your profile or terms.');
    const [doctor] = existing
      ? await db.update(doctors).set({ ...input, status: 'pending' }).where(eq(doctors.id, existing.id)).returning()
      : await db.insert(doctors).values({ ...input, id: randomUUID(), userId: c.get('user').id }).returning();
    return c.json({ doctor }, 201);
  });
  app.get('/api/appointments', async c => {
    let filter = eq(appointments.patientId, c.get('user').id);
    if (c.req.query('view') === 'staff') { ensure(c.get('staff'), 403, 'Clinic staff access is required.'); filter = undefined; }
    if (c.req.query('view') === 'doctor') {
      const [doctor] = await db.select().from(doctors).where(and(eq(doctors.userId, c.get('user').id), eq(doctors.status, 'approved')));
      ensure(doctor, 403, 'An approved doctor account is required.'); filter = eq(appointments.doctorId, doctor.id);
    }
    const rows = await db.select({ appointment: appointments, doctor: publicDoctor }).from(appointments).innerJoin(doctors, eq(appointments.doctorId, doctors.id)).where(filter).orderBy(desc(appointments.createdAt));
    return c.json({ appointments: rows.map(({ appointment, doctor }) => ({ ...appointment, doctor })) });
  });
  app.post('/api/appointments', async c => {
    const body = await c.req.json();
    ensure(body.consent === true, 400, 'Please consent to appointment coordination.');
    const [doctor] = await db.select().from(doctors).where(and(eq(doctors.id, text(body.doctorId, 'doctor')), eq(doctors.status, 'approved')));
    ensure(doctor, 409, 'This doctor is not available for booking.');
    ensure(doctor.userId !== c.get('user').id, 400, 'You cannot book a consultation with yourself.');
    const phone = text(body.phone, 'phone number', 18);
    ensure(/^\+?[0-9 ()-]{10,18}$/.test(phone) && phone.replace(/\D/g, '').length >= 10, 400, 'Enter a valid phone number.');
    const { feePaise, clinicSharePaise } = split(doctor.feePaise, doctor.clinicShareBps);
    const [appointment] = await db.insert(appointments).values({ id: randomUUID(), patientId: c.get('user').id, patientName: text(body.patientName, 'patient name', 100), phone, doctorId: doctor.id, preferredAt: futureDate(body.preferredAt), feePaise, clinicSharePaise }).returning();
    return c.json({ appointment }, 201);
  });
  app.post('/api/appointments/:id/payment', async c => {
    const body = await c.req.json();
    const [config] = await db.select().from(settings).where(eq(settings.id, 1));
    ensure(config?.upiId, 409, 'Please contact the clinic for payment instructions.');
    const reference = text(body.reference, 'UPI transaction reference', 30).toUpperCase();
    ensure(/^[A-Z0-9]{8,30}$/.test(reference), 400, 'Enter the 8–30 character UPI reference from your payment app.');
    const [appointment] = await db.update(appointments).set({ paymentReference: reference, paymentStatus: 'submitted' }).where(and(eq(appointments.id, c.req.param('id')), eq(appointments.patientId, c.get('user').id), eq(appointments.paymentStatus, 'unpaid'), eq(appointments.status, 'requested'))).returning();
    ensure(appointment, 409, 'This appointment is unavailable or its payment has already been submitted.');
    return c.json({ appointment });
  });
  app.post('/api/appointments/:id/cancel', async c => {
    const [appointment] = await db.update(appointments).set({ status: 'cancelled' }).where(and(eq(appointments.id, c.req.param('id')), eq(appointments.patientId, c.get('user').id), eq(appointments.status, 'requested'))).returning();
    ensure(appointment, 409, 'Only an unconfirmed request can be cancelled here. Contact the clinic for confirmed appointments.');
    return c.json({ appointment });
  });
  app.post('/api/appointments/:id/complete', async c => {
    const [doctor] = await db.select().from(doctors).where(and(eq(doctors.userId, c.get('user').id), eq(doctors.status, 'approved')));
    ensure(doctor, 403, 'An approved doctor account is required.');
    const [appointment] = await db.update(appointments).set({ status: 'completed' }).where(and(eq(appointments.id, c.req.param('id')), eq(appointments.doctorId, doctor.id), eq(appointments.status, 'confirmed'), eq(appointments.paymentStatus, 'verified'), lte(appointments.scheduledAt, new Date().toISOString()))).returning();
    ensure(appointment, 409, 'Only a confirmed, paid consultation whose scheduled time has passed can be completed.');
    return c.json({ appointment });
  });
  app.use('/api/staff/*', async (c, next) => { ensure(c.get('staff'), 403, 'Clinic staff access is required.'); await next(); });
  app.get('/api/staff/doctors', async c => c.json({ doctors: await db.select().from(doctors).orderBy(desc(doctors.createdAt)) }));
  app.post('/api/staff/doctors/:id', async c => {
    const body = await c.req.json();
    ensure(['approved', 'rejected'].includes(body.status), 400, 'Choose approve or reject.');
    const [doctor] = await db.update(doctors).set({ status: body.status }).where(and(eq(doctors.id, c.req.param('id')), eq(doctors.status, 'pending'))).returning();
    ensure(doctor, 409, 'This application has already been reviewed.'); return c.json({ doctor });
  });
  app.post('/api/staff/settings', async c => {
    const body = await c.req.json();
    const upiId = String(body.upiId || '').trim();
    ensure(!upiId || /^[a-zA-Z0-9._-]{2,200}@[a-zA-Z0-9.-]{2,80}$/.test(upiId), 400, 'Enter a valid UPI ID.');
    const payeeName = upiId && body.payeeName?.trim() ? text(body.payeeName, 'UPI payee name', 100) : '';
    const values = { id: 1, upiId, payeeName, googleReviewsUrl: googleUrl(body.googleReviewsUrl) };
    await db.insert(settings).values(values).onConflictDoUpdate({ target: settings.id, set: values });
    return c.json({ saved: true });
  });
  app.post('/api/staff/appointments/:id', async c => {
    const body = await c.req.json();
    const [current] = await db.select().from(appointments).where(eq(appointments.id, c.req.param('id')));
    ensure(current, 404, 'Appointment not found.');
    const changes = staffChanges(current, body);
    const [appointment] = await db.update(appointments).set(changes).where(and(eq(appointments.id, current.id), eq(appointments.status, current.status), eq(appointments.paymentStatus, current.paymentStatus), eq(appointments.settlementStatus, current.settlementStatus))).returning();
    ensure(appointment, 409, 'This appointment changed. Refresh and try again.');
    return c.json({ appointment });
  });
  app.notFound(c => c.json({ error: 'Page not found.' }, 404));
  app.onError((error, c) => {
    if (error.status) return c.json({ error: error.message }, error.status);
    if (error instanceof SyntaxError || error instanceof TypeError) return c.json({ error: 'Please check the submitted information.' }, 400);
    if (error.code === '23505' || error.cause?.code === '23505') return c.json({ error: 'This record or payment reference has already been submitted.' }, 409);
    return c.json({ error: 'The service is temporarily unavailable. Please retry or call 86248 60808.' }, 503);
  });
  return app;
}
