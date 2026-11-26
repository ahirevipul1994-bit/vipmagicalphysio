import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { submitEnquiry, services, type EnquiryInput, type EnquiryKind } from '@/lib/business';
import { useI18n } from '@/lib/i18n';
import { Localized } from '@/components/localized';

const field = 'w-full rounded-xl border border-input bg-card px-4 py-3 text-base transition-shadow focus:shadow-[0_0_0_4px_hsl(var(--ring)/0.18)] focus:outline-none';

function sourceFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const parts = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].map(k => p.get(k) ? `${k}=${p.get(k)}` : '').filter(Boolean);
  return (parts.join('&') || 'website').slice(0, 200);
}

export function RequestForm({ defaultKind = 'GENERAL', defaultService = '' }: { defaultKind?: EnquiryKind; defaultService?: string }) {
  const { t, lang } = useI18n();
  const [kind, setKind] = useState<EnquiryKind>(defaultKind);
  const [values, setValues] = useState({ name: '', phone: '', email: '', service: defaultService, preferred_date: '', locality: '', message: '', website: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const idem = useRef<string>(crypto.randomUUID());
  const source = useMemo(sourceFromUrl, []);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

  const m = useMutation({
    mutationFn: (input: EnquiryInput) => submitEnquiry(input),
    onSuccess: () => { idem.current = crypto.randomUUID(); },
  });

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues(v => ({ ...v, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (values.name.trim().length < 2) errs.name = t('required');
    if (!/^\+?[0-9 ()-]{10,20}$/.test(values.phone.trim()) || !/^\d{10,15}$/.test(values.phone.replace(/\D/g, ''))) errs.phone = t('required');
    if (kind === 'HOME_VISIT' && !values.locality.trim()) errs.locality = t('required');
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errs.email = 'Check the email address';
    if (!consent) errs.consent = t('required');
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const input = {
      name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim() || undefined, kind,
      service: values.service || 'not-sure', preferred_date: values.preferred_date || undefined,
      locality: values.locality.trim() || undefined, message: values.message.trim().slice(0, 500) || undefined,
      consent, language: lang, idempotency_key: idem.current, website: values.website, source,
    };
    m.mutate(input);
  }

  if (m.isSuccess) return (
    <Localized><div className="rise rounded-3xl border border-border bg-card p-8 text-center" data-testid="status-submitted">
      <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
      <h2 className="font-display mt-4 text-3xl">{t('successTitle')}</h2>
      <p className="mt-3 text-muted-foreground">{t('successBody')}</p>
      <p className="mt-5 inline-block rounded-xl bg-secondary px-5 py-3 font-mono text-lg" data-testid="text-reference">{m.data}</p>
    </div></Localized>
  );

  const kinds: [EnquiryKind, string][] = [['GENERAL', t('general')], ['CLINIC', t('clinic')], ['HOME_VISIT', t('homeVisit')], ['ONLINE', t('online')]];

  return (
    <Localized><form onSubmit={submit} noValidate className="space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8" data-testid="form-request">
      <fieldset disabled={m.isPending} className="space-y-5 disabled:opacity-70">
        <div>
          <legend className="mb-2 font-medium">{t('kind')}</legend>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {kinds.map(([k, l]) => (
              <button type="button" key={k} onClick={() => setKind(k)} aria-pressed={kind === k} data-testid={`button-kind-${k}`}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${kind === k ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:border-primary'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block"><span className="mb-1.5 block font-medium">{t('name')} *</span>
            <input className={field} value={values.name} onChange={set('name')} autoComplete="name" maxLength={100} data-testid="input-name" aria-invalid={!!errors.name} />
            {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}</label>
          <label className="block"><span className="mb-1.5 block font-medium">{t('phone')} *</span>
            <input className={field} value={values.phone} onChange={set('phone')} type="tel" autoComplete="tel" inputMode="tel" maxLength={20} data-testid="input-phone" aria-invalid={!!errors.phone} />
            {errors.phone && <span className="text-sm text-destructive">{errors.phone}</span>}</label>
          <label className="block"><span className="mb-1.5 block font-medium">{t('email')}</span>
            <input className={field} value={values.email} onChange={set('email')} type="email" autoComplete="email" maxLength={160} data-testid="input-email" />
            {errors.email && <span className="text-sm text-destructive">{errors.email}</span>}</label>
          <label className="block"><span className="mb-1.5 block font-medium">{t('service')}</span>
            <select className={field} value={values.service} onChange={set('service')} data-testid="select-service">
              <option value="">{t('notSure')}</option>
              {services.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select></label>
          <label className="block"><span className="mb-1.5 block font-medium">{t('date')}</span>
            <input className={field} type="date" min={today} value={values.preferred_date} onChange={set('preferred_date')} data-testid="input-date" /></label>
          <label className="block"><span className="mb-1.5 block font-medium">{kind === 'HOME_VISIT' ? <><Localized>Locality (required)</Localized> *</> : t('locality')}</span>
            <input className={field} value={values.locality} onChange={set('locality')} maxLength={120} placeholder="Shirur" data-testid="input-locality" /></label>
          {errors.locality && <p role="alert" className="text-sm text-destructive">{errors.locality}</p>}
        </div>
        <label className="block"><span className="mb-1.5 block font-medium">{t('message')}</span>
          <textarea className={`${field} min-h-24`} value={values.message} onChange={set('message')} maxLength={500} data-testid="input-message" />
          <span className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{t('noClinical')}</span></label>
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[hsl(var(--primary))]" checked={consent} onChange={e => setConsent(e.target.checked)} data-testid="checkbox-consent" />
          <span>{t('consent')} <Link href="/privacy" className="underline">{t('privacy')}</Link> *{errors.consent && <span className="block text-sm text-destructive">{errors.consent}</span>}</span>
        </label>
      </fieldset>
      {m.isError && <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-destructive" data-testid="status-error">{(m.error as Error).message} Your details are still here; please try again.</p>}
      <p className="text-sm font-medium text-primary">{t('requestNote')}</p>
      <button type="submit" disabled={m.isPending} data-testid="button-submit"
        className="w-full rounded-full bg-accent px-6 py-4 text-lg font-semibold text-accent-foreground transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto">
        {m.isPending ? t('sending') : t('submit')}
      </button>
    </form></Localized>
  );
}
