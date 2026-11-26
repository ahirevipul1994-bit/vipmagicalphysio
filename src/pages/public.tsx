import { Link, useParams } from 'wouter';
import { ArrowRight, ArrowUpRight, Building2, Home as HomeIcon, MonitorSmartphone, Ear, MessageSquareText, Users, Signpost, BookOpen, Lock } from 'lucide-react';
import { services, type EnquiryKind } from '@/lib/business';
import { useI18n, type TKey } from '@/lib/i18n';
import { serviceDetails, education, articles, ebooks, faqs } from '@/lib/content';
import { PageHero, Reveal, ReviewBanner, ContactActions, useSeo, useOwnerContent, useSettings } from '@/components/site';
import { RequestForm } from '@/components/request-form';
import NotFound from '@/pages/not-found';
import { Localized } from '@/components/localized';
import { CommunityLinks, ServiceVideos, WhatsAppAppointment } from '@/components/community';

const founderPortrait = `${import.meta.env.BASE_URL}images/dr-vipul-ahire.webp`;

function OwnerBody({ slug, fallback }: { slug: string; fallback: string[] }) {
  const page = useOwnerContent(slug);
  const paras = page ? page.body.split(/\n{2,}/) : fallback;
  return <Localized><div className="space-y-5 text-lg leading-relaxed">{paras.map((p, i) => <p key={i}>{p}</p>)}</div></Localized>;
}

export function HomePage() {
  const { t } = useI18n();
  useSeo('Physiotherapy in Shirur, Pune', 'Ethical physiotherapy for older adults and caregivers in Shirur, Pune with Dr. Vipul Ahire (Physio). Request clinic, home visit or online consultation.');
  const owner = useOwnerContent('home');
  const ways: [EnquiryKind, TKey, TKey, typeof Building2][] = [['CLINIC', 'clinic', 'clinicBody', Building2], ['HOME_VISIT', 'homeVisit', 'homeBody', HomeIcon], ['ONLINE', 'online', 'onlineBody', MonitorSmartphone]];
  const promises: [TKey, TKey, typeof Ear][] = [['p1', 'p1b', Ear], ['p2', 'p2b', MessageSquareText], ['p3', 'p3b', Users], ['p4', 'p4b', Signpost]];
  return (
    <Localized>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.1fr_1fr] md:pt-16">
          <div>
            <p className="rise text-sm font-semibold uppercase tracking-[0.18em] text-accent">{t('heroKicker')}</p>
            <h1 className="rise font-display mt-4 text-5xl font-semibold leading-[1.02] md:text-7xl" style={{ animationDelay: '90ms' }} data-testid="text-hero-title">{owner?.title || t('heroTitle')}</h1>
            <p className="rise mt-6 max-w-xl text-xl text-muted-foreground" style={{ animationDelay: '180ms' }}>{owner?.body || t('heroBody')}</p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '260ms' }}>
              <Link href="/book" data-testid="link-hero-book" className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-lg font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5">{t('heroCta')}<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/services" data-testid="link-hero-services" className="inline-flex items-center rounded-full border-2 border-primary px-7 py-4 text-lg font-semibold">{t('heroSecondary')}</Link>
            </div>
            <p className="rise mt-6 text-sm text-muted-foreground" style={{ animationDelay: '320ms' }}>Dr. Vipul Ahire (Physio) &middot; English, हिन्दी, मराठी</p>
          </div>
          <div className="rise relative" style={{ animationDelay: '200ms' }}>
            <div className="absolute -inset-4 rounded-[3rem] bg-secondary sway" aria-hidden />
            <img src={founderPortrait} alt="Dr. Vipul Ahire (Physio)" width={800} height={1000} fetchPriority="high" className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover" />
            <p className="relative mt-3 text-sm text-muted-foreground">Dr. Vipul Ahire (Physio)</p>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal><h2 className="font-display text-4xl md:text-5xl">{t('waysTitle')}</h2></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-[1.3fr_1fr_1fr]">
            {ways.map(([k, title, body, Icon], i) => (
              <Reveal key={k} delay={i * 90}>
                <Link href={`/book?kind=${k}`} data-testid={`link-way-${k}`} className={`lift group flex h-full flex-col rounded-3xl p-7 ${i === 0 ? 'bg-accent text-accent-foreground' : 'bg-primary-foreground/10'}`}>
                  <Icon className="h-9 w-9" />
                  <h3 className="font-display mt-6 text-2xl">{t(title)}</h3>
                  <p className="mt-2 opacity-85">{t(body)}</p>
                  <ArrowUpRight className="mt-auto self-end pt-4 h-10 w-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <Reveal><h2 className="font-display text-4xl md:sticky md:top-28 md:text-5xl">{t('promiseTitle')}</h2></Reveal>
          <div className="divide-y divide-border">
            {promises.map(([a, b, Icon], i) => (
              <Reveal key={a} delay={i * 60}><div className="flex gap-5 py-7"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-accent"><Icon /></span><div><h3 className="font-display text-2xl">{t(a)}</h3><p className="mt-1 text-lg text-muted-foreground">{t(b)}</p></div></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-end justify-between gap-4"><h2 className="font-display text-4xl md:text-5xl">{t('services')}</h2><Link href="/services" className="font-semibold text-accent underline-offset-4 hover:underline">{t('allServices')}</Link></div>
          <ol className="mt-10 grid gap-x-10 md:grid-cols-2">
            {services.map((s, i) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`} data-testid={`link-service-${s.slug}`} className="group flex items-baseline gap-5 border-b border-foreground/15 py-6">
                <span className="font-display text-xl text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1"><span className="font-display block text-2xl transition-transform group-hover:translate-x-1">{s.name}</span><span className="mt-1 block text-muted-foreground">{s.description}</span></span>
                <ArrowRight className="h-5 w-5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
              </Link></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="font-display text-4xl md:text-5xl">{t('learnTitle')}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-[1.4fr_1fr]">
          {Object.values(education).map((e, i) => (
            <Reveal key={e.slug} delay={i * 80} className={i === 0 ? 'md:row-span-2' : ''}>
              <Link href={`/education/${e.slug}`} className={`lift flex h-full flex-col rounded-3xl border border-border p-8 ${i === 0 ? 'bg-card' : 'bg-background'}`}>
                <BookOpen className="h-7 w-7 text-accent" />
                <h3 className={`font-display mt-5 ${i === 0 ? 'text-4xl' : 'text-2xl'}`}>{e.title}</h3>
                <p className="mt-2 text-muted-foreground">{e.summary}</p>
                <span className="mt-auto pt-6 font-semibold text-primary">{t('readMore')}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 rounded-[2.5rem] bg-accent p-10 text-accent-foreground md:grid-cols-[1.4fr_1fr] md:p-14">
          <div><h2 className="font-display text-4xl md:text-5xl">{t('book')}</h2><p className="mt-3 text-lg opacity-90">{t('requestNote')}</p></div>
          <div className="flex flex-col items-start justify-center gap-4">
            <Link href="/book" className="rounded-full bg-accent-foreground px-7 py-4 text-lg font-semibold text-accent">{t('heroCta')}</Link>
            <div className="[&_*]:!border-accent-foreground [&_p]:!text-accent-foreground/90"><ContactActions /></div>
          </div>
        </div>
      </section>
      <ServiceVideos limit={2}/>
      <CommunityLinks/>
    </Localized>
  );
}

export function AboutPage() {
  useSeo('About Dr. Vipul Ahire (Physio)', 'Meet the founder of VIP MAGICAL PHYSIO and our ethical, patient-centred care approach in Shirur.');
  const owner = useOwnerContent('about');
  return (<Localized>
    <PageHero kicker="About" title={owner?.title || 'Honest care, at a human pace.'} intro="VIP MAGICAL PHYSIO is led by Dr. Vipul Ahire (Physio) in Shirur, Pune District." />
    <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[220px_1fr]">
      <figure className="max-w-xs md:max-w-none">
        <img src={founderPortrait} alt="Dr. Vipul Ahire (Physio)" width={800} height={1000} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        <figcaption className="mt-3 text-sm text-muted-foreground">Dr. Vipul Ahire (Physio)</figcaption>
      </figure>
      <div>
        <OwnerBody slug="about" fallback={[
          'The practice was set up for people who want to keep doing ordinary, important things: walking to the market, managing stairs, getting up after sitting, caring for grandchildren.',
          'Our approach is simple. We listen, we assess carefully, and we explain what we find in plain language. We set goals with you and your family, not for you.',
          'We will never pressure you into more sessions than you need, and we will tell you honestly if another professional is better placed to help.',
        ]} />
        <p className="mt-8 rounded-2xl bg-secondary p-5 text-sm text-muted-foreground">Professional qualifications and registration details will be published here once verified by the owner.</p>
      </div>
    </section>
  </Localized>);
}

export function ServicesPage() {
  useSeo('Physiotherapy services', 'Orthopaedic, neurological, post-operative, geriatric, home visit and online physiotherapy services in Shirur, Pune.');
  return (<Localized>
    <PageHero kicker="Services" title="Six ways we can help you move." intro="Every plan starts with an individual assessment. Nothing here is a promise of a specific result." />
    <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2">
      {services.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 2) * 80}>
          <Link href={`/services/${s.slug}`} data-testid={`card-service-${s.slug}`} className="lift group flex h-full flex-col rounded-3xl border border-border bg-card p-8">
            <span className="font-display text-accent">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="font-display mt-3 text-3xl">{s.name}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{s.description}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-primary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </Reveal>
      ))}
    </section>
  </Localized>);
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const s = services.find(x => x.slug === slug);
  const d = slug ? serviceDetails[slug] : undefined;
  useSeo(s?.name ?? 'Service', s?.description ?? 'Physiotherapy service');
  const owner = useOwnerContent(`service-${slug}`);
  if (!s || !d) return <NotFound />;
  const kind: EnquiryKind = slug === 'home-visit-physiotherapy' ? 'HOME_VISIT' : slug === 'online-consultation' ? 'ONLINE' : 'CLINIC';
  return (<Localized>
    <PageHero kicker="Service" title={owner?.title || s.name} intro={owner?.body || s.description} />
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2">
      <div><h2 className="font-display text-3xl">Who it may help</h2><ul className="mt-5 space-y-3 text-lg">{d.forWhom.map(x => <li key={x} className="flex gap-3"><span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />{x}</li>)}</ul></div>
      <div><h2 className="font-display text-3xl">How we approach it</h2><ol className="mt-5 space-y-4 text-lg">{d.approach.map((x, i) => <li key={x} className="flex gap-4"><span className="font-display text-2xl text-accent">{i + 1}</span>{x}</li>)}</ol></div>
      <p className="rounded-2xl bg-secondary p-6 text-lg md:col-span-2">{d.note}</p>
      <div className="space-y-6 md:col-span-2"><h2 className="font-display mb-6 text-3xl">Request this service</h2><WhatsAppAppointment/><RequestForm defaultKind={kind} defaultService={s.slug} /></div>
    </section>
    <ServiceVideos service={slug}/>
  </Localized>);
}

export function EducationPage({ topic }: { topic: string }) {
  const { t } = useI18n();
  const e = education[topic]!;
  useSeo(e.title, e.summary);
  const owner = useOwnerContent(`education-${topic}`);
  const tabs: [string, TKey][] = [['pain', 'pain'], ['exercise', 'exercise'], ['healthy-ageing', 'ageing']];
  return (<Localized>
    <PageHero kicker="General education" title={owner?.title || e.title} intro={e.summary} />
    <section className="mx-auto max-w-3xl px-5 py-12">
      <nav className="mb-10 flex flex-wrap gap-2" aria-label="Topics">{tabs.map(([s, k]) => <Link key={s} href={`/education/${s}`} className={`rounded-full px-4 py-2 ${s === topic ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{t(k)}</Link>)}</nav>
      <OwnerBody slug={`education-${topic}`} fallback={e.body} />
      <p className="mt-10 border-l-4 border-accent pl-4 text-muted-foreground">This information is general and not individual advice. Please seek an assessment for guidance specific to you.</p>
    </section>
  </Localized>);
}

export function BlogPage() {
  useSeo('Articles', 'Practical, general movement articles for older adults and caregivers.');
  return (<Localized>
    <PageHero kicker="Articles" title="Notes for everyday movement." intro="Short, general guides. These are educational pieces, not personal advice." />
    <section className="mx-auto max-w-4xl space-y-6 px-5 py-14">
      {articles.map(a => (
        <Reveal key={a.slug}><article id={a.slug} className="rounded-3xl border border-border bg-card p-8" data-testid={`card-article-${a.slug}`}>
          <h2 className="font-display text-3xl">{a.title}</h2><p className="mt-2 text-muted-foreground">{a.summary}</p>
          <div className="mt-5 space-y-3 text-lg">{a.body.map(p => <p key={p}>{p}</p>)}</div>
        </article></Reveal>
      ))}
    </section>
  </Localized>);
}

export function EbooksPage() {
  useSeo('eBooks (coming later)', 'Planned plain-language guides. Not yet available.');
  return (<Localized>
    <PageHero kicker="eBooks" title="Guides in preparation." intro="These titles are planned and not yet available. There is no checkout or payment on this website." />
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-3">
      {ebooks.map((b, i) => (
        <div key={b.title} className="flex flex-col rounded-3xl border border-border bg-card p-6" data-testid={`card-ebook-${i}`}>
          <div className={`grid aspect-[3/4] place-items-center rounded-2xl p-6 text-center ${['bg-primary text-primary-foreground', 'bg-accent text-accent-foreground', 'bg-secondary'][i]}`}><span className="font-display text-3xl">{b.title}</span></div>
          <p className="mt-4 flex-1 text-muted-foreground">{b.blurb}</p>
          <span className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-muted px-4 py-2 text-sm font-medium"><Lock className="h-4 w-4" />Not yet available</span>
        </div>
      ))}
    </section>
  </Localized>);
}

export function FaqsPage() {
  useSeo('Frequently asked questions', 'Answers about requests, home visits, referrals and online consultations.');
  return (<Localized>
    <PageHero kicker="FAQs" title="Questions, answered plainly." />
    <section className="mx-auto max-w-3xl px-5 py-12">
      {faqs.map((f, i) => (
        <details key={i} className="group border-b border-border py-5" data-testid={`faq-${i}`}>
          <summary className="font-display flex cursor-pointer list-none items-center justify-between text-2xl">{f.q}<span className="ml-4 text-accent transition-transform group-open:rotate-45">+</span></summary>
          <p className="mt-3 text-lg text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </section>
  </Localized>);
}

export function ContactPage() {
  useSeo('Contact', 'Send a general question or request to VIP MAGICAL PHYSIO, Shirur.');
  const { data } = useSettings();
  return (<Localized>
    <PageHero kicker="Contact" title="Ask us anything." intro={data?.location} />
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.6fr]">
      <div className="space-y-4"><h2 className="font-display text-2xl">Direct contact</h2><ContactActions />{data?.email && <a href={`mailto:${data.email}`} className="block underline">{data.email}</a>}<p className="text-muted-foreground">Hours: {data?.hours}</p></div>
      <div className="space-y-6"><WhatsAppAppointment/><RequestForm defaultKind="GENERAL" /></div>
    </section>
    <CommunityLinks/>
  </Localized>);
}

export function BookPage() {
  useSeo('Request an appointment', 'Request a clinic, home visit or online physiotherapy appointment. Requests are confirmed personally.');
  const k = new URLSearchParams(window.location.search).get('kind');
  const kind: EnquiryKind = k === 'CLINIC' || k === 'HOME_VISIT' || k === 'ONLINE' ? k : 'CLINIC';
  return (<Localized>
    <PageHero kicker="Request" title="Request an appointment." intro="Tell us a little about what you need. We will contact you to confirm a time. Submitting this form does not confirm an appointment." />
    <section className="mx-auto max-w-4xl space-y-6 px-5 py-14"><WhatsAppAppointment/><RequestForm defaultKind={kind} /></section>
  </Localized>);
}

export function VideosPage() {
  useSeo('Videos', 'Service-related videos and playlists from our channel. General education only; individual results vary.');
  return <Localized><PageHero kicker="Videos" title="Learn with Dr. Vipul Ahire." intro="Service-related videos and playlists from our channel. General education only; individual results vary."/><ServiceVideos/><CommunityLinks/></Localized>;
}

const policies: Record<string, { title: string; body: string[] }> = {
  privacy: { title: 'Privacy policy', body: ['We collect the details you submit in request forms (name, phone, optional email, request type, service, preferred date, locality and a short message) to respond to your request.', 'Please do not submit medical records or detailed health information through this website.', 'Data is stored with our hosting and database providers. We do not sell personal information.', 'You may ask us to access or correct your details using the contact methods published on this site.', 'YouTube is contacted only when you load a video or follow a link. YouTube’s privacy and cookie policies then apply.', 'Following Google, Instagram or WhatsApp links opens a third-party service governed by its own privacy policy. WhatsApp appointment requests are not stored by this website.'] },
  terms: { title: 'Terms of use', body: ['Website content is general information and is not a substitute for individual assessment or medical advice.', 'Submitting a form is a request only. Appointments are confirmed personally.', 'In an emergency, contact local emergency services.'] },
  refund: { title: 'Refund policy', body: ['No online payments are taken on this website.', 'Any refund terms for in-person services will be published here after owner review.'] },
};
export function PolicyPage({ name }: { name: 'privacy' | 'terms' | 'refund' }) {
  const p = policies[name]!;
  useSeo(p.title, `${p.title} for VIP MAGICAL PHYSIO (draft).`);
  return (<Localized>
    <PageHero kicker="Policy draft" title={p.title} />
    <section className="mx-auto max-w-3xl px-5 py-12"><ReviewBanner>This text is a starting draft and must be reviewed before being relied on.</ReviewBanner><OwnerBody slug={name} fallback={p.body} /></section>
  </Localized>);
}
