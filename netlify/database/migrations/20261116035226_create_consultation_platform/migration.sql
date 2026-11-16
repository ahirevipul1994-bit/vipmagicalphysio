CREATE TABLE "consultation_appointments" (
	"id" text PRIMARY KEY,
	"patient_id" text NOT NULL,
	"patient_name" text NOT NULL,
	"phone" text NOT NULL,
	"doctor_id" text NOT NULL,
	"preferred_at" text NOT NULL,
	"scheduled_at" text,
	"fee_paise" integer NOT NULL,
	"clinic_share_paise" integer NOT NULL,
	"status" text DEFAULT 'requested' NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"payment_reference" text UNIQUE,
	"meeting_url" text,
	"settlement_status" text DEFAULT 'pending' NOT NULL,
	"settlement_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultation_doctors" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"specialty" text NOT NULL,
	"qualification" text NOT NULL,
	"registration" text NOT NULL,
	"bio" text NOT NULL,
	"languages" text NOT NULL,
	"fee_paise" integer NOT NULL,
	"clinic_share_bps" integer NOT NULL,
	"terms_accepted" boolean NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinic_settings" (
	"id" integer PRIMARY KEY,
	"upi_id" text DEFAULT '' NOT NULL,
	"payee_name" text DEFAULT '' NOT NULL,
	"google_reviews_url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consultation_appointments" ADD CONSTRAINT "consultation_appointments_HDCDXGcZemZt_fkey" FOREIGN KEY ("doctor_id") REFERENCES "consultation_doctors"("id");