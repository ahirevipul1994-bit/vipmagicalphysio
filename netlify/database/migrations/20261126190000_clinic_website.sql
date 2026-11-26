create schema vip_physio;
revoke all on schema vip_physio from public;

create table vip_physio.business_settings (
  id integer primary key check (id = 1),
  value jsonb not null check (jsonb_typeof(value) = 'object'),
  updated_at timestamptz not null default now()
);
insert into vip_physio.business_settings (id, value) values (1, '{}');

create table vip_physio.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null,
  email text not null default '',
  kind text not null check (kind in ('GENERAL','CLINIC','HOME_VISIT','ONLINE')),
  service text not null,
  preferred_date date,
  locality text not null default '',
  message text not null default '',
  consent boolean not null check (consent),
  consent_version text not null default 'administrative-request-1',
  language text not null check (language in ('en','hi','mr')),
  source text not null default '',
  status text not null default 'NEW' check (status in ('NEW','CONTACTED','APPOINTMENT_REQUESTED','CLOSED')),
  next_action text not null default '',
  follow_up_at timestamptz,
  idempotency_key uuid not null unique
);
create index vip_physio_enquiries_created on vip_physio.enquiries (created_at desc);

create table vip_physio.appointments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references vip_physio.enquiries(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  kind text not null check (kind in ('GENERAL','CLINIC','HOME_VISIT','ONLINE')),
  status text not null check (status in ('REQUESTED','PENDING_CONFIRMATION','CONFIRMED','RESCHEDULED','CANCELLED','COMPLETED','NO_SHOW')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  exclude using gist (tstzrange(starts_at, ends_at, '[)') with &&) where (status in ('CONFIRMED','RESCHEDULED'))
);

create table vip_physio.content_pages (
  slug text not null,
  language text not null check (language in ('en','hi','mr')),
  title text not null,
  body text not null,
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (slug, language)
);

create table vip_physio.finance_records (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('PAYMENT','EXPENSE')),
  amount_paise bigint not null check (amount_paise between 1 and 10000000000),
  description text not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table vip_physio.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text,
  action text not null,
  entity text not null,
  created_at timestamptz not null default now()
);

create function vip_physio.audit_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  insert into vip_physio.audit_logs (actor, action, entity)
  values (nullif(current_setting('vip_physio.actor', true), ''), TG_OP, TG_TABLE_NAME);
  if TG_TABLE_NAME in ('business_settings','content_pages') then
    new.updated_at = now();
  end if;
  return new;
end;
$$;

create trigger audit_enquiry before insert or update on vip_physio.enquiries for each row execute function vip_physio.audit_change();
create trigger audit_appointment before insert or update on vip_physio.appointments for each row execute function vip_physio.audit_change();
create trigger audit_finance before insert on vip_physio.finance_records for each row execute function vip_physio.audit_change();
create trigger audit_settings before update on vip_physio.business_settings for each row execute function vip_physio.audit_change();
create trigger audit_content before insert or update on vip_physio.content_pages for each row execute function vip_physio.audit_change();

create table vip_physio.submission_salt (value uuid not null default gen_random_uuid());
insert into vip_physio.submission_salt default values;

create table vip_physio.submission_limits (
  fingerprint text not null,
  day date not null,
  submissions integer not null,
  primary key (fingerprint, day)
);

create function vip_physio.submit_enquiry(payload jsonb, client_ip text) returns uuid
language plpgsql set search_path = '' as $$
declare
  submission_key uuid := (payload->>'idempotency_key')::uuid;
  today date := (now() at time zone 'Asia/Kolkata')::date;
  ip_fingerprint text;
  phone_fingerprint text;
  reference uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(submission_key::text, 0));
  select id into reference from vip_physio.enquiries where idempotency_key = submission_key;
  if reference is not null then return reference; end if;

  select encode(sha256(convert_to('ip:' || client_ip || value::text, 'UTF8')), 'hex'),
         encode(sha256(convert_to('phone:' || regexp_replace(payload->>'phone', '[^0-9]', '', 'g') || value::text, 'UTF8')), 'hex')
  into ip_fingerprint, phone_fingerprint from vip_physio.submission_salt;

  delete from vip_physio.submission_limits where day < today - 1;
  insert into vip_physio.submission_limits (fingerprint, day, submissions)
  values (ip_fingerprint, today, 1), (phone_fingerprint, today, 1)
  on conflict (fingerprint, day) do update set submissions = vip_physio.submission_limits.submissions + 1;

  if exists (select 1 from vip_physio.submission_limits where day = today and
    ((fingerprint = ip_fingerprint and submissions > 25) or (fingerprint = phone_fingerprint and submissions > 5))) then
    return null;
  end if;

  insert into vip_physio.enquiries (name, phone, email, kind, service, preferred_date, locality, message, consent, language, source, idempotency_key)
  values (payload->>'name', payload->>'phone', coalesce(payload->>'email', ''), payload->>'kind', payload->>'service',
    (payload->>'preferred_date')::date, coalesce(payload->>'locality', ''), coalesce(payload->>'message', ''),
    (payload->>'consent')::boolean, payload->>'language', coalesce(payload->>'source', ''), submission_key)
  returning id into reference;
  return reference;
end;
$$;
