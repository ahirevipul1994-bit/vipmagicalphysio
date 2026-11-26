import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Menu, X, Phone, MessageCircle, Info } from 'lucide-react';
import { defaultSettings, getSettings, listContent, type Language } from '@/lib/business';
import { useI18n, type TKey } from '@/lib/i18n';
import { Localized } from '@/components/localized';
import { CommunityLinks, whatsappUrl } from '@/components/community';
import { translate } from '@/lib/translations';

export function useSettings() {
  const settings = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  return { ...settings, data: settings.data ?? defaultSettings };
}
/** Owner-edited published content for a slug; null when not configured or absent. */
export function useOwnerContent(slug: string) {
  const { lang } = useI18n();
  const q = useQuery({ queryKey: ['content', lang], queryFn: () => listContent(lang as Language), retry: false });
  return q.data?.find(p => p.slug === slug && p.published) ?? null;
}

export function useSeo(title: string, description: string) {
  const {lang}=useI18n();
  useEffect(() => {
    const localizedTitle=translate(title,lang), localizedDescription=translate(description,lang);
    document.title = `${localizedTitle} | VIP MAGICAL PHYSIO`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', localizedDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${localizedTitle} | VIP MAGICAL PHYSIO`);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', localizedDescription);
  }, [title, description,lang]);
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const navKeys: [string, TKey][] = [['/about', 'about'], ['/services', 'services'], ['/education/pain', 'education'], ['/videos','videos'], ['/blog', 'blog'], ['/faqs', 'faqs'], ['/contact', 'contact']];

export function Mark({ className = '' }: { className?: string }) {
  return (
    <img src={`${import.meta.env.BASE_URL}images/website-logo.webp`} alt="" aria-hidden="true" width={320} height={320} className={`shrink-0 object-contain ${className}`} />
  );
}

export function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t('language')} className="flex rounded-full bg-secondary p-1 text-sm">
      {(['en', 'hi', 'mr'] as Language[]).map(l => (
        <button key={l} data-testid={`button-lang-${l}`} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 transition-colors ${lang === l ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground hover:bg-background'}`}>
          {l === 'en' ? 'EN' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();
  useEffect(() => setOpen(false), [loc]);
  return (
    <Localized><header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
        <Link href="/" data-testid="link-home" className="flex items-center gap-2.5">
          <Mark className="h-10 w-10" />
          <span className="leading-tight"><span className="font-display block text-lg font-semibold">VIP MAGICAL PHYSIO</span><span className="block text-xs text-muted-foreground">Shirur, Pune</span></span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Main">
          {navKeys.map(([h, k]) => (
            <Link key={h} href={h} data-testid={`link-nav-${k}`} className={`rounded-full px-3 py-2 text-[15px] transition-colors hover:bg-secondary ${loc.startsWith(h.split('/').slice(0, 2).join('/')) ? 'text-accent font-semibold' : ''}`}>{t(k)}</Link>
          ))}
        </nav>
        <div className="ml-auto hidden lg:ml-2 lg:block"><LangSwitch /></div>
        <Link href="/book" data-testid="link-book" className="hidden rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 md:inline-block">{t('book')}</Link>
        <button className="ml-auto rounded-full p-2 xl:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open} data-testid="button-menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 xl:hidden">
          <nav className="flex flex-col py-3 text-lg" aria-label="Mobile">
            {navKeys.map(([h, k]) => <Link key={h} href={h} className="border-b border-border/60 py-3">{t(k)}</Link>)}
            <Link href="/ebooks" className="border-b border-border/60 py-3">{t('ebooks')}</Link>
            <Link href="/book" className="mt-4 rounded-full bg-accent py-3 text-center font-semibold text-accent-foreground">{t('book')}</Link>
          </nav>
          <LangSwitch />
        </div>
      )}
    </header></Localized>
  );
}

export function ContactActions({ compact = false }: { compact?: boolean }) {
  const { t,lang } = useI18n();
  const { data } = useSettings();
  const phone = data?.phone?.trim(); const wa = data?.whatsapp?.replace(/[^\d]/g, '');
  if (!phone && !wa) return <p className="flex items-start gap-2 text-sm text-muted-foreground" data-testid="text-contact-unavailable"><Info className="mt-0.5 h-4 w-4 shrink-0" />{t('callUnavailable')}</p>;
  return (
    <div className={`flex flex-wrap gap-3 ${compact ? '' : 'mt-2'}`}>
      {phone && <a href={`tel:${phone.replace(/\s/g, '')}`} data-testid="link-call" className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 font-medium"><Phone className="h-4 w-4" />{t('call')} {phone}</a>}
      {wa && <a href={whatsappUrl(wa,lang)} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp" className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 font-medium"><MessageCircle className="h-4 w-4" />{t('whatsapp')}</a>}
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const { data } = useSettings();
  return (
    <Localized><footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">Movement, at your pace.</p>
          <p className="mt-3 max-w-sm opacity-80">{data?.founder ?? 'Dr. Vipul Ahire (Physio)'} &middot; {data?.location ?? 'Shirur, Pune District, Maharashtra'}</p>
          <p className="mt-1 opacity-80">{data?.hours}</p>
          {data?.address && <p className="mt-1 opacity-80">{data.address}</p>}
          {data?.email && <a className="mt-1 block underline" href={`mailto:${data.email}`}>{data.email}</a>}
          <div className="mt-5 [&_a]:border-current"><ContactActions compact/></div>
        </div>
        <div className="flex flex-col gap-2">
          {([['/services', 'services'], ['/education/exercise', 'exercise'], ['/education/healthy-ageing', 'ageing'], ['/ebooks', 'ebooks'], ['/book', 'book']] as [string, TKey][]).map(([h, k]) => <Link key={h} href={h} className="opacity-85 hover:opacity-100">{t(k)}</Link>)}
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/privacy" className="opacity-85 hover:opacity-100">{t('privacy')}</Link>
          <Link href="/terms" className="opacity-85 hover:opacity-100">{t('terms')}</Link>
          <Link href="/refund" className="opacity-85 hover:opacity-100">{t('refund')}</Link>
          <Link href="/admin" data-testid="link-owner" className="mt-4 text-sm opacity-60 hover:opacity-100">{t('owner')}</Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-8"><CommunityLinks compact/></div>
      <p className="border-t border-primary-foreground/15 px-5 py-5 text-center text-sm opacity-70">General information only, not a substitute for individual assessment. In an emergency, contact local emergency services.</p>
    </footer></Localized>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { data } = useSettings();
  return (
    <Localized><div className="min-h-[100dvh]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-accent focus:p-3">Skip to content</a>
      {data?.announcement && <div className="bg-accent px-5 py-2 text-center text-sm text-accent-foreground" data-testid="text-announcement">{data.announcement}</div>}
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div></Localized>
  );
}

export function PageHero({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-secondary" />
      <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-24">
        <p className="rise text-sm font-semibold uppercase tracking-[0.18em] text-accent">{kicker}</p>
        <h1 className="rise font-display mt-3 text-4xl font-semibold leading-[1.05] md:text-6xl" style={{ animationDelay: '80ms' }}>{title}</h1>
        {intro && <p className="rise mt-5 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: '160ms' }}>{intro}</p>}
      </div>
    </section>
  );
}

export function ReviewBanner({ children }: { children: ReactNode }) {
  return <Localized><div className="mb-8 rounded-2xl border-2 border-dashed border-accent/60 bg-accent/5 p-5 text-[15px]" data-testid="text-review-required"><strong>Draft. Owner and legal review required.</strong> {children}</div></Localized>;
}
