import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptInvite, AUTH_EVENTS, getUser, handleAuthCallback, onAuthChange, type User } from '@netlify/identity';
import { LayoutDashboard, Inbox, CalendarDays, IndianRupee, FileText, Settings, ScrollText, LogOut, Download, Search } from 'lucide-react';
import {
  isOwner, signIn, signOut, requestPasswordReset, changePassword, listEnquiries, updateEnquiry,
  listAppointments, saveAppointment, listFinance, addFinance, listContent, saveContent, getSettings, saveSettings, listAudit, downloadCsv,
  services, type Appointment, type AppointmentStatus, type EnquiryKind, type EnquiryStatus, type Language, type BusinessSettings, type ContentPage, type Enquiry,
} from '@/lib/business';
import { Mark, useSeo, LangSwitch } from '@/components/site';
import { Localized } from '@/components/localized';

const TZ = 'Asia/Kolkata';
const fmt = (iso: string | null | undefined) => iso ? new Intl.DateTimeFormat('en-IN', { timeZone: TZ, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '-';
const toUtc = (local: string) => new Date(`${local}:00+05:30`).toISOString();
const toLocal = (iso: string) => new Date(new Date(iso).getTime() + 330 * 60000).toISOString().slice(0, 16);
const inr = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p / 100);
const inp = 'w-full rounded-lg border border-input bg-card px-3 py-2';
const btn = 'rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50';

type AuthState = { status: 'loading' | 'out' | 'owner' | 'notOwner' | 'unavailable'; email?: string; recovery: boolean; invite?: string; error?: string };
const AuthCtx = createContext<AuthState>({ status: 'loading', recovery: false });

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ status: 'loading', recovery: false });
  useEffect(() => {
    let generation = 0;
    let previousUser = '';
    let active = true;
    let recovery = false;
    let initialising = true;
    async function sync(user: User | null) {
      const current = ++generation;
      if (previousUser !== (user?.id ?? '')) queryClient.clear();
      previousUser = user?.id ?? '';
      if (!user) { setState({ status: 'out', recovery: false }); return; }
      try {
        const owner = await isOwner();
        if (current === generation) setState({ status: owner ? 'owner' : 'notOwner', email: user.email, recovery });
      } catch {
        if (current === generation) setState({ status: 'unavailable', recovery });
      }
    }
    const unsubscribe = onAuthChange((event, user) => {
      if (initialising) return;
      if (event === AUTH_EVENTS.RECOVERY) recovery = true;
      if (event === AUTH_EVENTS.LOGOUT || event === AUTH_EVENTS.USER_UPDATED) recovery = false;
      void sync(user);
    });
    async function initialise() {
      try {
        const callback = await handleAuthCallback();
        const user = callback?.user ?? await getUser();
        if (!active) return;
        initialising = false;
        if (callback?.type === 'invite') {
          setState({ status: 'out', recovery: false, invite: callback.token });
          return;
        }
        recovery = callback?.type === 'recovery';
        await sync(user);
      } catch {
        if (!active) return;
        initialising = false;
        setState({ status: 'out', recovery: false, error: 'This account link could not be opened. Request a new link and try again.' });
      }
    }
    void initialise();
    return () => { active = false; generation++; unsubscribe(); };
  }, [queryClient]);
  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <Localized><section className="rounded-2xl border border-border bg-card p-5 md:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl">{title}</h2>{action}</div>{children}</section></Localized>;
}
function Skel() { return <div className="space-y-3" data-testid="status-loading">{[0, 1, 2].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}</div>; }
function Err({ error, retry }: { error: unknown; retry: () => void }) {
  return <Localized><div role="alert" className="rounded-xl bg-destructive/10 p-4 text-destructive">{(error as Error)?.message} <button className="ml-2 underline" onClick={retry}>Retry</button></div></Localized>;
}
function Empty({ text }: { text: string }) { return <Localized><div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">{text}</div></Localized>; }

function OwnerUnavailable() {
  return (
    <Localized><div className="mx-auto max-w-xl px-5 py-20" data-testid="status-admin-not-configured">
      <LangSwitch/>
      <Mark className="h-12 w-12" />
      <h1 className="font-display mt-6 text-4xl">Owner area temporarily unavailable</h1>
      <p className="mt-3 text-lg text-muted-foreground">Your access could not be verified. Reload the page to try again.</p>
      <Link href="/" className="mt-6 inline-block underline">Back to website</Link>
    </div></Localized>
  );
}

function Login() {
  const auth = useContext(AuthCtx);
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [mode, setMode] = useState<'in' | 'reset'>('in');
  const m = useMutation({ mutationFn: () => mode === 'in' ? signIn(email, pw).then(() => undefined) : requestPasswordReset(email) });
  return (
    <Localized><div className="grid min-h-[100dvh] md:grid-cols-2">
      <div className="absolute right-5 top-5"><LangSwitch/></div>
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground md:flex">
        <Mark className="h-12 w-12" /><p className="font-display text-5xl leading-tight">Owner workspace.<br /><span className="text-accent">Quietly organised.</span></p>
        <p className="opacity-70">Sign out when you’re done, especially on a shared device.</p>
      </div>
      <form className="mx-auto flex w-full max-w-sm flex-col justify-center gap-4 p-8" onSubmit={(e: FormEvent) => { e.preventDefault(); m.mutate(); }}>
        <h1 className="font-display text-4xl">{mode === 'in' ? 'Sign in' : 'Reset password'}</h1>
        {auth.error && <p role="alert" className="text-destructive">{auth.error}</p>}
        <label>Email<input className={inp} type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" data-testid="input-admin-email" /></label>
        {mode === 'in' && <label>Password<input className={inp} type="password" required value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" data-testid="input-admin-password" /></label>}
        {m.isError && <p role="alert" className="text-destructive">{(m.error as Error).message}</p>}
        {m.isSuccess && mode === 'reset' && <p className="text-primary">If that address belongs to an account, a reset link has been sent.</p>}
        <button className={btn + ' py-3'} disabled={m.isPending} data-testid="button-admin-signin">{m.isPending ? 'Please wait...' : mode === 'in' ? 'Sign in' : 'Send reset link'}</button>
        <button type="button" className="text-sm underline" onClick={() => { setMode(mode === 'in' ? 'reset' : 'in'); m.reset(); }}>{mode === 'in' ? 'Forgot password?' : 'Back to sign in'}</button>
        <p className="text-xs text-muted-foreground">There is no public registration. Owner accounts are created by the administrator.</p>
      </form>
    </div></Localized>
  );
}

const nav = [['/admin', 'Overview', LayoutDashboard], ['/admin/enquiries', 'Enquiries', Inbox], ['/admin/appointments', 'Appointments', CalendarDays], ['/admin/finance', 'Finance', IndianRupee], ['/admin/content', 'Content', FileText], ['/admin/settings', 'Settings', Settings], ['/admin/audit', 'Audit', ScrollText]] as const;

export function AdminPage() {
  const auth = useContext(AuthCtx);
  const [loc] = useLocation();
  useSeo('Owner area', 'Private owner workspace.');
  useEffect(() => { let m = document.querySelector('meta[name="robots"]'); m?.setAttribute('content', 'noindex'); return () => m?.setAttribute('content', 'index, follow'); }, []);
  if (auth.invite || auth.recovery || loc === '/admin/reset') return <ResetPage />;
  if (auth.status === 'loading') return <div className="p-10"><Skel /></div>;
  if (auth.status === 'unavailable') return <OwnerUnavailable />;
  if (auth.status === 'out') return <Login />;
  if (auth.status === 'notOwner') return (
    <Localized><div className="mx-auto max-w-md p-12 text-center"><h1 className="font-display text-3xl">Not authorised</h1><p className="mt-2 text-muted-foreground">{auth.email} is signed in but is not the owner account.</p><button className={btn + ' mt-6'} onClick={() => signOut()}>Sign out</button></div></Localized>
  );
  const page = loc.replace(/\/$/, '');
  return (
    <Localized><div className="min-h-[100dvh] md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-sidebar p-4 text-sidebar-foreground md:sticky md:top-0 md:h-[100dvh]">
        <Link href="/" className="flex items-center gap-2 px-2 py-3"><Mark className="h-9 w-9" /><span className="font-display">VIP Owner</span></Link>
        <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col">
          {nav.map(([h, l, Icon]) => <Link key={h} href={h} data-testid={`link-admin-${l.toLowerCase()}`} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${page === h ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'}`}><Icon className="h-4 w-4" />{l}</Link>)}
        </nav>
        <div className="mt-6 hidden border-t border-sidebar-border pt-4 text-sm md:block"><p className="truncate opacity-70">{auth.email}</p>
          <Link href="/admin/reset" className="mt-2 block opacity-80 hover:opacity-100">Change password</Link>
          <button onClick={() => signOut()} className="mt-2 flex items-center gap-2 opacity-80 hover:opacity-100" data-testid="button-signout"><LogOut className="h-4 w-4" />Sign out</button></div>
      </aside>
      <main className="space-y-6 p-5 md:p-8">
        <LangSwitch/>
        {page === '/admin' && <Overview />}
        {page === '/admin/enquiries' && <Enquiries />}
        {page === '/admin/appointments' && <Appointments />}
        {page === '/admin/finance' && <Finance />}
        {page === '/admin/content' && <Content />}
        {page === '/admin/settings' && <SettingsView />}
        {page === '/admin/audit' && <Audit />}
        <button onClick={() => signOut()} className="text-sm underline md:hidden">Sign out</button>
      </main>
    </div></Localized>
  );
}

function ResetPage() {
  const auth = useContext(AuthCtx);
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const m = useMutation({ mutationFn: async () => {
    if (pw !== pw2) throw new Error('Passwords do not match.');
    if (pw.length < 12) throw new Error('Use at least 12 characters.');
    if (auth.invite) await acceptInvite(auth.invite, pw);
    else await changePassword(pw);
  } });
  return (
    <Localized><div className="mx-auto max-w-sm px-6 py-20">
      <LangSwitch/>
      <h1 className="font-display text-4xl">Set a new password</h1>
      {auth.status === 'loading' ? <Skel /> : auth.status === 'out' && !auth.invite ? <p className="mt-4 text-muted-foreground">Open the reset link from your email, or <Link href="/admin" className="underline">sign in</Link> first. The link may have expired.</p> : (
        <form className="mt-6 space-y-4" onSubmit={e => { e.preventDefault(); m.mutate(); }}>
          <label className="block">New password (12+ characters)<input className={inp} type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="new-password" data-testid="input-new-password" /></label>
          <label className="block">Repeat<input className={inp} type="password" value={pw2} onChange={e => setPw2(e.target.value)} autoComplete="new-password" /></label>
          {m.isError && <p className="text-destructive">{(m.error as Error).message}</p>}
          {m.isSuccess && <p className="text-primary">Password updated. <Link href="/admin" className="underline">Go to overview</Link></p>}
          <button className={btn} disabled={m.isPending}>Update password</button>
        </form>)}
    </div></Localized>
  );
}

const useEnq = () => useQuery({ queryKey: ['enquiries'], queryFn: listEnquiries });
const useAppts = () => useQuery({ queryKey: ['appointments'], queryFn: listAppointments });
const useFin = () => useQuery({ queryKey: ['finance'], queryFn: listFinance });

function Overview() {
  const e = useEnq(), a = useAppts(), f = useFin();
  const now = Date.now();
  const stats = [
    ['New enquiries', e.data?.filter(x => x.status === 'NEW').length],
    ['Follow-ups due', e.data?.filter(x => x.follow_up_at && new Date(x.follow_up_at).getTime() <= now && x.status !== 'CLOSED').length],
    ['Upcoming appointments', a.data?.filter(x => new Date(x.starts_at).getTime() > now && !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(x.status)).length],
    ['Net recorded (INR)', f.data ? inr(f.data.reduce((s, r) => s + (r.kind === 'PAYMENT' ? r.amount_paise : -r.amount_paise), 0)) : undefined],
  ] as const;
  const err = e.error || a.error || f.error;
  return (<Localized>
    <h1 className="font-display text-4xl">Overview</h1>
    <p className="text-sm text-muted-foreground">Metrics cover up to the latest 1,000 records per module. Financial totals are manually recorded, not gateway-verified collections.</p>
    {err && <Err error={err} retry={() => { e.refetch(); a.refetch(); f.refetch(); }} />}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(([l, v], i) => <div key={l} className={`rounded-2xl p-5 ${i === 0 ? 'bg-accent text-accent-foreground' : 'border border-border bg-card'}`} data-testid={`stat-${i}`}><p className="text-sm opacity-80">{l}</p><p className="font-display mt-2 text-4xl">{v ?? <span className="inline-block h-9 w-16 animate-pulse rounded bg-muted" />}</p></div>)}
    </div>
    <Panel title="Latest enquiries">{e.isLoading ? <Skel /> : !e.data?.length ? <Empty text="No enquiries yet." /> : <ul className="divide-y divide-border">{e.data.slice(0, 6).map(x => <li key={x.id} className="flex justify-between gap-3 py-3"><span>{x.name} <span className="text-muted-foreground">&middot; {x.kind}</span></span><span className="text-sm text-muted-foreground">{fmt(x.created_at)}</span></li>)}</ul>}</Panel>
  </Localized>);
}

const ENQ_STATUSES: EnquiryStatus[] = ['NEW', 'CONTACTED', 'APPOINTMENT_REQUESTED', 'CLOSED'];
function Enquiries() {
  const qc = useQueryClient(); const q = useEnq();
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [kind, setKind] = useState('');
  const rows = useMemo(() => (q.data ?? []).filter(x => (!status || x.status === status) && (!kind || x.kind === kind) && (!search || `${x.name} ${x.phone} ${x.locality ?? ''} ${x.service}`.toLowerCase().includes(search.toLowerCase()))), [q.data, search, status, kind]);
  const m = useMutation({ mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateEnquiry>[1] }) => updateEnquiry(id, patch), onSuccess: () => qc.invalidateQueries({ queryKey: ['enquiries'] }) });
  return (<Localized>
    <h1 className="font-display text-4xl">Enquiries</h1>
    <Panel title={`${rows.length} shown`} action={<button className={btn + ' flex items-center gap-2'} disabled={!q.data?.length} onClick={() => downloadCsv(q.data ?? [], 'enquiries.csv')} data-testid="button-export-enquiries"><Download className="h-4 w-4" />CSV</button>}>
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" /><input className={inp + ' pl-9'} placeholder="Search name, phone, locality" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" /></label>
        <select className={inp + ' w-auto'} value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option>{ENQ_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        <select className={inp + ' w-auto'} value={kind} onChange={e => setKind(e.target.value)}><option value="">All types</option>{['GENERAL', 'CLINIC', 'HOME_VISIT', 'ONLINE'].map(s => <option key={s}>{s}</option>)}</select>
      </div>
      {m.isError && <p className="mb-3 text-destructive">{(m.error as Error).message}</p>}
      {q.isLoading ? <Skel /> : q.error ? <Err error={q.error} retry={q.refetch} /> : !rows.length ? <Empty text="No enquiries match." /> : (
        <div className="space-y-3">{rows.map(x => <EnquiryRow key={x.id} x={x} onSave={patch => m.mutate({ id: x.id, patch })} saving={m.isPending} />)}</div>)}
    </Panel>
  </Localized>);
}
function EnquiryRow({ x, onSave, saving }: { x: Enquiry; onSave: (p: Parameters<typeof updateEnquiry>[1]) => void; saving: boolean }) {
  const [next, setNext] = useState(x.next_action ?? ''); const [fu, setFu] = useState(x.follow_up_at ? toLocal(x.follow_up_at) : '');
  return (
    <Localized><div className="grid gap-3 rounded-xl border border-border p-4 lg:grid-cols-[1.3fr_1fr]" data-testid={`row-enquiry-${x.id}`}>
      <div><p className="font-semibold">{x.name} <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs">{x.kind}</span></p>
        <p className="text-sm text-muted-foreground">{x.phone}{x.email ? ` · ${x.email}` : ''} · {x.service} · {x.locality || 'no locality'} · pref {x.preferred_date || '-'} · {x.language}</p>
        {x.message && <p className="mt-1 text-sm">{x.message}</p>}<p className="mt-1 text-xs text-muted-foreground">Received {fmt(x.created_at)} · {x.source}</p></div>
      <div className="flex flex-wrap items-end gap-2">
        <select className={inp + ' w-auto'} value={x.status} onChange={e => onSave({ status: e.target.value as EnquiryStatus })} disabled={saving} data-testid={`select-status-${x.id}`}>{ENQ_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        <input className={inp + ' flex-1'} placeholder="Next action" value={next} onChange={e => setNext(e.target.value)} />
        <input className={inp + ' w-auto'} type="datetime-local" value={fu} onChange={e => setFu(e.target.value)} aria-label="Follow-up (IST)" />
        <button className={btn} disabled={saving} onClick={() => onSave({ next_action: next, follow_up_at: fu ? toUtc(fu) : null })}>Save</button>
      </div>
    </div></Localized>
  );
}

const APPT_STATUSES: AppointmentStatus[] = ['REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
type Draft = { id?: string; enquiry_id: string; start: string; end: string; kind: EnquiryKind; status: AppointmentStatus; notes: string };
const blank: Draft = { enquiry_id: '', start: '', end: '', kind: 'CLINIC', status: 'REQUESTED', notes: '' };
function Appointments() {
  const qc = useQueryClient(); const a = useAppts(); const e = useEnq();
  const [d, setD] = useState<Draft>(blank); const [err, setErr] = useState(''); const [homeOnly, setHomeOnly] = useState(false);
  const m = useMutation({ mutationFn: ({ input, id }: { input: Omit<Appointment, 'id' | 'created_at'>; id?: string }) => saveAppointment(input, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['appointments'] }); setD(blank); } });
  const enqName = (id: string) => e.data?.find(x => x.id === id)?.name ?? 'Unknown enquiry';
  function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!d.enquiry_id || !d.start || !d.end) return setErr('Enquiry, start and end are required.');
    const s = toUtc(d.start), en = toUtc(d.end);
    if (new Date(en) <= new Date(s)) return setErr('End must be after start.');
    setErr(''); m.mutate({ id: d.id, input: { enquiry_id: d.enquiry_id, starts_at: s, ends_at: en, kind: d.kind, status: d.status, notes: d.notes.slice(0, 1000) } });
  }
  const quick = (x: Appointment, status: AppointmentStatus) => m.mutate({ id: x.id, input: { enquiry_id: x.enquiry_id, starts_at: x.starts_at, ends_at: x.ends_at, kind: x.kind, status, notes: x.notes } });
  const rows = (a.data ?? []).filter(x => !homeOnly || x.kind === 'HOME_VISIT');
  return (<Localized>
    <h1 className="font-display text-4xl">Appointments</h1>
    <Panel title={d.id ? 'Edit / reschedule' : 'New appointment'}>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
        <label className="md:col-span-3">From enquiry<select className={inp} value={d.enquiry_id} onChange={ev => { const q = e.data?.find(x => x.id === ev.target.value); setD({ ...d, enquiry_id: ev.target.value, kind: q && q.kind !== 'GENERAL' ? q.kind : d.kind }); }} data-testid="select-enquiry">
          <option value="">Choose enquiry</option>{e.data?.map(x => <option key={x.id} value={x.id}>{x.name} · {x.kind} · {x.phone}</option>)}</select></label>
        <label>Start (IST)<input className={inp} type="datetime-local" value={d.start} onChange={ev => setD({ ...d, start: ev.target.value })} data-testid="input-start" /></label>
        <label>End (IST)<input className={inp} type="datetime-local" value={d.end} onChange={ev => setD({ ...d, end: ev.target.value })} data-testid="input-end" /></label>
        <label>Type<select className={inp} value={d.kind} onChange={ev => setD({ ...d, kind: ev.target.value as EnquiryKind })}>{['CLINIC', 'HOME_VISIT', 'ONLINE', 'GENERAL'].map(k => <option key={k}>{k}</option>)}</select></label>
        <label>Status<select className={inp} value={d.status} onChange={ev => setD({ ...d, status: ev.target.value as AppointmentStatus })}>{APPT_STATUSES.map(k => <option key={k}>{k}</option>)}</select></label>
        <label className="md:col-span-2">Admin notes (no clinical detail)<input className={inp} value={d.notes} onChange={ev => setD({ ...d, notes: ev.target.value })} maxLength={1000} /></label>
        {(err || m.error) && <p className="text-destructive md:col-span-3">{err || (m.error as Error).message}</p>}
        <div className="flex gap-2 md:col-span-3"><button className={btn} disabled={m.isPending} data-testid="button-save-appointment">{m.isPending ? 'Saving...' : 'Save appointment'}</button>{d.id && <button type="button" className="underline" onClick={() => setD(blank)}>Cancel edit</button>}</div>
      </form>
    </Panel>
    <Panel title="Schedule" action={<div className="flex items-center gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={homeOnly} onChange={ev => setHomeOnly(ev.target.checked)} data-testid="checkbox-home-only" />Home visits only</label><button className={btn + ' flex items-center gap-2'} disabled={!a.data?.length} onClick={() => downloadCsv(a.data ?? [], 'appointments.csv')}><Download className="h-4 w-4" />CSV</button></div>}>
      {a.isLoading ? <Skel /> : a.error ? <Err error={a.error} retry={a.refetch} /> : !rows.length ? <Empty text="No appointments." /> : (
        <ul className="divide-y divide-border">{rows.map(x => (
          <li key={x.id} className="flex flex-wrap items-center gap-3 py-3" data-testid={`row-appointment-${x.id}`}>
            <div className="flex-1"><p className="font-semibold">{fmt(x.starts_at)} <span className="text-muted-foreground">to {fmt(x.ends_at)}</span></p><p className="text-sm text-muted-foreground">{enqName(x.enquiry_id)} · {x.kind} · {x.notes}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${x.status === 'CONFIRMED' ? 'bg-primary text-primary-foreground' : x.status === 'CANCELLED' ? 'bg-destructive/15 text-destructive' : 'bg-secondary'}`}>{x.status}</span>
            <button className="text-sm underline" onClick={() => setD({ id: x.id, enquiry_id: x.enquiry_id, start: toLocal(x.starts_at), end: toLocal(x.ends_at), kind: x.kind, status: x.status === 'CONFIRMED' ? 'RESCHEDULED' : x.status, notes: x.notes })}>Edit / reschedule</button>
            {x.status !== 'CONFIRMED' && x.status !== 'CANCELLED' && <button className="text-sm underline" onClick={() => quick(x, 'CONFIRMED')}>Confirm</button>}
            {x.status !== 'CANCELLED' ? <button className="text-sm text-destructive underline" onClick={() => quick(x, 'CANCELLED')}>Cancel</button> : <button className="text-sm underline" onClick={() => quick(x, 'REQUESTED')}>Restore</button>}
          </li>))}</ul>)}
    </Panel>
  </Localized>);
}

function Finance() {
  const qc = useQueryClient(); const f = useFin();
  const [kind, setKind] = useState<'PAYMENT' | 'EXPENSE'>('PAYMENT'); const [amt, setAmt] = useState(''); const [desc, setDesc] = useState(''); const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [err, setErr] = useState('');
  const m = useMutation({ mutationFn: addFinance, onSuccess: () => { qc.invalidateQueries({ queryKey: ['finance'] }); setAmt(''); setDesc(''); } });
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\d+(\.\d{1,2})?$/.test(amt) || Number(amt) <= 0) return setErr('Enter a positive rupee amount, up to 2 decimals.');
    if (!desc.trim()) return setErr('Description is required.');
    setErr(''); const [r, p = ''] = amt.split('.');
    m.mutate({ kind, amount_paise: Number(r) * 100 + Number(p.padEnd(2, '0')), description: desc.trim().slice(0, 300), occurred_at: toUtc(`${date}T12:00`) });
  }
  const totals = (f.data ?? []).reduce((t, r) => ({ ...t, [r.kind]: t[r.kind] + r.amount_paise }), { PAYMENT: 0, EXPENSE: 0 });
  return (<Localized>
    <h1 className="font-display text-4xl">Finance</h1>
    <div className="grid gap-4 sm:grid-cols-3">{[['Payments', totals.PAYMENT], ['Expenses', totals.EXPENSE], ['Net', totals.PAYMENT - totals.EXPENSE]].map(([l, v]) => <div key={l} className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display mt-1 text-3xl">{inr(v as number)}</p></div>)}</div>
    <Panel title="Record entry">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-[auto_150px_1fr_170px_auto] md:items-end">
        <div className="flex rounded-full bg-secondary p-1">{(['PAYMENT', 'EXPENSE'] as const).map(k => <button type="button" key={k} onClick={() => setKind(k)} className={`rounded-full px-3 py-1.5 text-sm ${kind === k ? 'bg-primary text-primary-foreground' : ''}`}>{k}</button>)}</div>
        <label>Amount (INR)<input className={inp} inputMode="decimal" value={amt} onChange={e => setAmt(e.target.value)} data-testid="input-amount" /></label>
        <label>Description<input className={inp} value={desc} onChange={e => setDesc(e.target.value)} data-testid="input-description" /></label>
        <label>Date<input className={inp} type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <button className={btn} disabled={m.isPending} data-testid="button-add-finance">Add</button>
      </form>
      {(err || m.error) && <p className="mt-2 text-destructive">{err || (m.error as Error).message}</p>}
    </Panel>
    <Panel title="Records" action={<button className={btn + ' flex items-center gap-2'} disabled={!f.data?.length} onClick={() => downloadCsv((f.data ?? []).map(r => ({ ...r, amount_inr: (r.amount_paise / 100).toFixed(2) })), 'finance.csv')}><Download className="h-4 w-4" />CSV</button>}>
      {f.isLoading ? <Skel /> : f.error ? <Err error={f.error} retry={f.refetch} /> : !f.data?.length ? <Empty text="No records yet." /> : (
        <ul className="divide-y divide-border">{f.data.map(r => <li key={r.id} className="flex justify-between gap-3 py-3"><span>{r.description} <span className="text-sm text-muted-foreground">· {fmt(r.occurred_at)}</span></span><span className={`font-mono ${r.kind === 'EXPENSE' ? 'text-destructive' : 'text-primary'}`}>{r.kind === 'EXPENSE' ? '-' : '+'}{inr(r.amount_paise)}</span></li>)}</ul>)}
    </Panel>
  </Localized>);
}

const SLUGS = ['home', 'about', 'privacy', 'terms', 'refund', 'education-pain', 'education-exercise', 'education-healthy-ageing', ...services.map(s => `service-${s.slug}`)];
function Content() {
  const qc = useQueryClient(); const q = useQuery({ queryKey: ['content-all'], queryFn: () => listContent() });
  const [slug, setSlug] = useState('home'); const [lang, setLang] = useState<Language>('en');
  const existing = q.data?.find(p => p.slug === slug && p.language === lang);
  const [page, setPage] = useState<ContentPage>({ slug, language: lang, title: '', body: '', published: false });
  useEffect(() => { setPage(existing ?? { slug, language: lang, title: '', body: '', published: false }); }, [slug, lang, q.dataUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps
  const m = useMutation({ mutationFn: saveContent, onSuccess: () => { qc.invalidateQueries({ queryKey: ['content-all'] }); qc.invalidateQueries({ queryKey: ['content'] }); } });
  return (<Localized>
    <h1 className="font-display text-4xl">Content</h1>
    <Panel title="Edit page content">
      <p className="mb-4 text-sm text-muted-foreground">Published entries override the built-in English text on the public site for that language. Separate paragraphs with a blank line. For "home", the title and body replace the hero headline and intro.</p>
      {q.error && <Err error={q.error} retry={q.refetch} />}
      <div className="grid gap-3 md:grid-cols-2">
        <select className={inp} value={slug} onChange={e => setSlug(e.target.value)} data-testid="select-content-slug">{SLUGS.map(s => <option key={s}>{s}</option>)}</select>
        <select className={inp} value={lang} onChange={e => setLang(e.target.value as Language)}><option value="en">English</option><option value="hi">Hindi</option><option value="mr">Marathi</option></select>
        <input className={inp + ' md:col-span-2'} placeholder="Title" value={page.title} onChange={e => setPage({ ...page, title: e.target.value })} data-testid="input-content-title" />
        <textarea className={inp + ' min-h-56 md:col-span-2'} placeholder="Body" value={page.body} onChange={e => setPage({ ...page, body: e.target.value })} data-testid="input-content-body" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={page.published} onChange={e => setPage({ ...page, published: e.target.checked })} />Published</label>
        <div className="flex items-center justify-end gap-3">{m.isSuccess && <span className="text-sm text-primary">Saved</span>}{m.isError && <span className="text-sm text-destructive">{(m.error as Error).message}</span>}<button className={btn} disabled={m.isPending} onClick={() => m.mutate({ ...page, slug, language: lang })} data-testid="button-save-content">Save</button></div>
      </div>
    </Panel>
  </Localized>);
}

function SettingsView() {
  const qc = useQueryClient(); const q = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const [s, setS] = useState<BusinessSettings | null>(null);
  useEffect(() => { if (q.data && !s) setS(q.data); }, [q.data, s]);
  const m = useMutation({ mutationFn: saveSettings, onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }) });
  const fields: [keyof BusinessSettings, string][] = [['name', 'Business name'], ['founder', 'Founder'], ['location', 'Location'], ['address', 'Address'], ['phone', 'Phone'], ['whatsapp', 'WhatsApp number (with country code)'], ['email', 'Email'], ['hours', 'Hours'], ['announcement', 'Announcement banner'],['google','Google Business Profile link'],['youtube','YouTube channel link'],['instagram','Instagram profile link']];
  const integrations = [['Netlify Database', q.isSuccess], ['Netlify Identity', true], ['Public phone published', Boolean(q.data?.phone)], ['WhatsApp published', Boolean(q.data?.whatsapp)], ['Contact email published', Boolean(q.data?.email)]] as const;
  return (<Localized>
    <h1 className="font-display text-4xl">Settings</h1>
    <Panel title="Integration status">
      <ul className="grid gap-2 md:grid-cols-2">{integrations.map(([l, ok]) => <li key={l} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${ok ? 'bg-primary' : 'bg-accent'}`} />{l}: <strong>{ok ? 'configured' : 'missing'}</strong></li>)}</ul>
    </Panel>
    <Panel title="Business details">
      {q.error ? <Err error={q.error} retry={q.refetch} /> : q.isLoading || !s ? <Skel /> : (
        <form className="grid gap-3 md:grid-cols-2" onSubmit={e => { e.preventDefault(); m.mutate(s); }}>
          {fields.map(([k, l]) => <label key={k}>{l}<input className={inp} value={(s[k] as string) ?? ''} onChange={e => setS({ ...s, [k]: e.target.value })} data-testid={`input-setting-${k}`} /></label>)}
          <div className="flex items-center gap-3 md:col-span-2"><button className={btn} disabled={m.isPending} data-testid="button-save-settings">Save settings</button>{m.isSuccess && <span className="text-primary">Saved</span>}{m.isError && <span className="text-destructive">{(m.error as Error).message}</span>}</div>
        </form>)}
    </Panel>
  </Localized>);
}

function Audit() {
  const q = useQuery({ queryKey: ['audit'], queryFn: listAudit });
  return (<Localized>
    <h1 className="font-display text-4xl">Audit log</h1>
    <Panel title="Latest 100 events">{q.isLoading ? <Skel /> : q.error ? <Err error={q.error} retry={q.refetch} /> : !q.data?.length ? <Empty text="No audit events recorded." /> : (
      <ul className="divide-y divide-border font-mono text-sm">{q.data.map(r => <li key={r.id} className="flex justify-between gap-3 py-2"><span>{r.action} · {r.entity}</span><span className="text-muted-foreground">{fmt(r.created_at)}</span></li>)}</ul>)}</Panel>
  </Localized>);
}
