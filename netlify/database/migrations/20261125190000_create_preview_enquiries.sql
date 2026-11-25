CREATE TABLE vip_preview_enquiries (
  id uuid PRIMARY KEY,
  appointment_type text NOT NULL CHECK (appointment_type IN ('clinic', 'home', 'online', 'followup')),
  language text NOT NULL CHECK (language IN ('en', 'mr', 'hi')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vip_preview_enquiries_created_idx ON vip_preview_enquiries (created_at DESC, id DESC);

CREATE TABLE vip_preview_enquiry_activity (
  activity_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  enquiry_id uuid NOT NULL REFERENCES vip_preview_enquiries (id) ON DELETE CASCADE,
  previous_status text NOT NULL,
  new_status text NOT NULL,
  actor_id text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((previous_status = 'new' AND new_status IN ('contacted', 'closed'))
      OR (previous_status = 'contacted' AND new_status = 'closed'))
);

CREATE INDEX vip_preview_enquiry_activity_enquiry_idx ON vip_preview_enquiry_activity (enquiry_id);
