import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
export const settings = pgTable('clinic_settings', {
  id: integer('id').primaryKey(), upiId: text('upi_id').notNull().default(''),
  payeeName: text('payee_name').notNull().default(''), googleReviewsUrl: text('google_reviews_url').notNull().default(''),
});
export const doctors = pgTable('consultation_doctors', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().unique(), name: text('name').notNull(),
  specialty: text('specialty').notNull(), qualification: text('qualification').notNull(),
  registration: text('registration').notNull(), bio: text('bio').notNull(), languages: text('languages').notNull(),
  feePaise: integer('fee_paise').notNull(), clinicShareBps: integer('clinic_share_bps').notNull(),
  termsAccepted: boolean('terms_accepted').notNull(), status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const appointments = pgTable('consultation_appointments', {
  id: text('id').primaryKey(), patientId: text('patient_id').notNull(), patientName: text('patient_name').notNull(),
  phone: text('phone').notNull(), doctorId: text('doctor_id').notNull().references(() => doctors.id),
  preferredAt: text('preferred_at').notNull(), scheduledAt: text('scheduled_at'),
  feePaise: integer('fee_paise').notNull(), clinicSharePaise: integer('clinic_share_paise').notNull(),
  status: text('status').notNull().default('requested'), paymentStatus: text('payment_status').notNull().default('unpaid'),
  paymentReference: text('payment_reference').unique(), meetingUrl: text('meeting_url'),
  settlementStatus: text('settlement_status').notNull().default('pending'), settlementReference: text('settlement_reference'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
