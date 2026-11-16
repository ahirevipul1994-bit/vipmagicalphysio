-- Configure the clinic-provided public payment address; preserve existing name and reviews.
INSERT INTO "clinic_settings" ("id", "upi_id", "payee_name", "google_reviews_url")
VALUES (1, '8624860808@ibl', '', '')
ON CONFLICT ("id") DO UPDATE SET "upi_id" = EXCLUDED."upi_id";
