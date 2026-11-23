/* Static renderer for condition pages (EN/MR/HI).
   Usage (Node):  node site/tools/build.js     — writes /{lang}/conditions/**, services-index.js, sitemap.xml
   Pure function: renderAll(COND, opts) -> { [path]: html }  (no DOM, no deps) */
(function (root) {
  const SITE = 'https://vipmagicalphysio.com';
  const LANGS = ['en', 'mr', 'hi'];
  const HREFLANG = { en: 'en-IN', mr: 'mr-IN', hi: 'hi-IN' };
  const LNAME = { en: 'EN', mr: 'मरा', hi: 'हि' };
  const PHONE = '918624860808';
  const FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Public+Sans:wght@400..700&family=Mukta:wght@400;500;600&family=Tiro+Devanagari+Marathi&family=Tiro+Devanagari+Hindi&display=swap';
  const EBOOK = {
    'back-pain-education': 'Back Pain Education', 'caregiver-rehabilitation': 'Caregiver Rehabilitation',
    'healthy-ageing-after-45': 'Healthy Ageing After 45', 'healthy-lifestyle-after-injury': 'Healthy Lifestyle After Injury',
    'knee-health': 'Knee Health', 'mobility-and-exercise': 'Mobility & Exercise', 'posture-and-ergonomics': 'Posture & Ergonomics',
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const li = (arr) => arr.map(x => `<li>${esc(x)}</li>`).join('');
  const url = (lang, slug) => `/${lang}/conditions/${slug ? slug + '/' : ''}`;

  function chrome(L, lang, P, altPaths, inner, waText) {
    const wa = `https://wa.me/${PHONE}?text=${encodeURIComponent(waText)}`;
    const langLinks = LANGS.map(l => `<a href="${altPaths[l]}" hreflang="${HREFLANG[l]}" lang="${l}"${l === lang ? ' aria-current="true"' : ''}>${LNAME[l]}</a>`).join('');
    return `
<a class="skip" href="#main">Skip to main content</a>
<div class="utility"><div class="shell"><span class="utility__note">${esc(L.cta_p.split('.')[0])}.</span><div class="utility__r"><a href="tel:+${PHONE}" data-track="call">${esc(L.call)}</a><a href="${wa}" target="_blank" rel="noopener" data-track="whatsapp">${esc(L.wa)}</a></div></div></div>
<header class="head"><div class="shell">
  <a class="brand" href="/${lang}/" aria-label="VIP Magical Physio Clinic"><span class="brand__mark" aria-hidden="true">V</span><span><span class="brand__name">VIP Magical Physio Clinic</span><span class="brand__sub">Dr. Vipul Ahire (Physio) · Shirur</span></span></a>
  <nav class="nav" aria-label="Primary"><a href="${url(lang)}">${esc(L.conds)}</a><a href="${url(lang, 'home-visit-physiotherapy')}">${esc(L.v_home)}</a><a href="${url(lang, 'online-physiotherapy-consultation')}">${esc(L.v_online)}</a><a href="/${lang}/#find">${esc(L.home)}</a></nav>
  <div class="lang" role="group" aria-label="Language">${langLinks}</div>
  <a class="btn btn--wine" href="/${lang}/#book" data-track="book_cta">${esc(L.book)}</a>
</div></header>
<main id="main">${inner}</main>
<footer class="foot"><div class="shell">
  <p style="max-width:70ch">${esc(L.disc)}</p>
  <div class="foot__base"><span>© ${new Date().getFullYear()} VIP Magical Physio Clinic · Shirur, Maharashtra · <a href="tel:+${PHONE}">+91 86248 60808</a></span><span><a href="/privacy-policy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/medical-disclaimer">Medical disclaimer</a> · <a href="/refund-policy">Refunds</a></span></div>
</div></footer>
<nav class="mbar" aria-label="Quick actions"><a class="c" href="tel:+${PHONE}" data-track="call">${esc(L.call.split(' ')[0])}</a><a class="w" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp">${esc(L.wa)}</a><a class="b" href="/${lang}/#book" data-track="book_cta">${esc(L.book.split(' ')[0])}</a></nav>
<a class="wa-float" href="${wa}" target="_blank" rel="noopener" data-track="whatsapp">${esc(L.wa)}</a>
<script>document.addEventListener('click',function(e){var a=e.target.closest('[data-track]');if(a){(window.dataLayer=window.dataLayer||[]).push({event:'cta_click',cta:a.getAttribute('data-track'),page_type:'condition'});}});</script>`;
  }

  function head({ lang, P, title, desc, canonical, alts, ld, indexable, ogImage }) {
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'}">
<meta name="theme-color" content="#7A1F2B">
<link rel="canonical" href="${SITE}${canonical}">
${LANGS.map(l => `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${SITE}${alts[l]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}${alts.en}">
<meta property="og:type" content="article"><meta property="og:site_name" content="VIP Magical Physio Clinic">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${canonical}"><meta property="og:image" content="${SITE}/assets/img/${ogImage || 'hero-hands.jpg'}">
<meta property="og:locale" content="${{ en: 'en_IN', mr: 'mr_IN', hi: 'hi_IN' }[lang]}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${P}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${P}assets/home.css"><link rel="stylesheet" href="${P}assets/cond.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body>`;
  }

  function conditionPage(COND, lang, item, enItem, opts) {
    const L = COND[lang].labels, P = '../../../';
    const reviewed = !!enItem.reviewed;
    const indexable = reviewed || !opts.requireReview;
    const alts = Object.fromEntries(LANGS.map(l => [l, url(l, item.slug)]));
    const byslug = Object.fromEntries(COND[lang].items.map(i => [i.slug, i]));
    const title = `${item.title} | Dr. Vipul Ahire — VIP Magical Physio`;
    const desc = `${item.short} ${item.intro.split('. ')[0]}.`.slice(0, 158);
    const ytq = `https://www.youtube.com/@drvipulahireofficial/search?query=${encodeURIComponent(enItem.vid || enItem.name)}`;
    const ld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'MedicalWebPage', '@id': SITE + alts[lang] + '#page', url: SITE + alts[lang], name: item.title, description: desc, inLanguage: HREFLANG[lang],
        about: { '@type': 'MedicalCondition', name: enItem.name }, audience: { '@type': 'PeopleAudience', audienceType: 'Patient' },
        author: { '@id': SITE + '/#vipul' }, publisher: { '@id': SITE + '/#clinic' }, dateModified: opts.date,
        ...(reviewed ? { reviewedBy: { '@id': SITE + '/#vipul' }, lastReviewed: opts.date } : {}) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: L.home, item: `${SITE}/${lang}/` },
        { '@type': 'ListItem', position: 2, name: L.conds, item: SITE + url(lang) },
        { '@type': 'ListItem', position: 3, name: item.name, item: SITE + alts[lang] }] },
      { '@type': 'FAQPage', mainEntity: item.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': ['MedicalClinic', 'LocalBusiness'], '@id': SITE + '/#clinic', name: 'VIP Magical Physio Clinic', telephone: '+918624860808', url: SITE,
        address: { '@type': 'PostalAddress', addressLocality: 'Shirur', addressRegion: 'Maharashtra', addressCountry: 'IN' } },
      { '@type': 'Person', '@id': SITE + '/#vipul', name: 'Dr. Vipul Ahire', jobTitle: 'Physiotherapist' },
    ] };
    const book = `/${lang}/?service=${item.slug}#book`;
    const isHome = item.slug === 'home-visit-physiotherapy', isOnline = item.slug === 'online-physiotherapy-consultation';
    const inner = `
<nav class="crumbs shell" aria-label="Breadcrumb"><ol><li><a href="/${lang}/">${esc(L.home)}</a></li><li><a href="${url(lang)}">${esc(L.conds)}</a></li><li aria-current="page">${esc(item.name)}</li></ol></nav>
<section class="c-hero" data-screen-label="Condition hero"><div class="shell">
  <div>
    <span class="eyebrow">${esc(L.conds)} · Shirur</span>
    <h1>${esc(item.title)}</h1>
    <p class="c-hook">${esc(item.hook)}</p>
    <p class="c-intro">${esc(item.intro)}</p>
    <div class="c-ctas">
      <a class="btn btn--wine" href="${book}" data-track="book_cta">${esc(L.book)} <span class="arr" aria-hidden="true">→</span></a>
      ${isOnline ? '' : `<a class="btn btn--line" href="/${lang}/?type=home_visit&service=${item.slug}#book" data-track="home_visit_cta">${esc(L.home_visit)}</a>`}
      ${isHome ? '' : `<a class="btn btn--soft" href="/${lang}/?type=online&service=${item.slug}#book" data-track="online_cta">${esc(L.online)}</a>`}
    </div>
    <p class="byline">${esc(L.author)} · ${esc(L.updated)} ${opts.date}</p>
    <div class="review-flag ${reviewed ? 'review-ok' : ''}">${esc(reviewed ? L.reviewed : L.pending)}</div>
  </div>
  <aside class="glance" aria-label="${esc(L.glance)}">
    <h2>${esc(L.glance)}</h2>
    <h3>${esc(L.who)}</h3><p>${esc(item.who)}</p>
    <h3>${esc(L.visit)}</h3>
    <div class="ways-mini"><span>${esc(L.v_clinic)}</span><span>${esc(L.v_home)}</span><span>${esc(L.v_online)}</span></div>
    <a class="btn btn--wine" href="${book}" data-track="book_cta">${esc(L.book)}</a>
    <a class="btn btn--line" href="tel:+${PHONE}" data-track="call">${esc(L.call)}</a>
  </aside>
</div></section>

<section class="c-sec"><div class="shell two">
  <div><h2>${esc(L.sym_t)}</h2><ul class="ticks">${li(item.sym)}</ul></div>
  <div><h2>${esc(L.cause_t)}</h2><ul class="ticks ticks--sage">${li(item.cause)}</ul></div>
</div></section>

<section class="c-sec" style="border:0;padding-top:0"><div class="shell">
  <div class="redbox" role="note"><h2>${esc(L.red_t)}</h2><p>${esc(L.red_urgent)}</p><ul class="ticks">${li(item.red)}</ul>
  <a class="em" href="tel:108">108 · Emergency</a></div>
</div></section>

<section class="c-sec"><div class="shell"><h2>${esc(L.assess_t)}</h2><ol class="nums">${li(item.assess)}</ol></div></section>

<section class="c-sec"><div class="shell"><h2>${esc(L.plan_t)}</h2>
  <div class="road">${item.plan.map(([h, p], i) => `<div class="phase"><b>${i + 1}</b><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
  <p class="road-note">${esc(L.plan_note)}</p>
</div></section>

<section class="c-sec"><div class="shell two">
  <div><h2>${esc(L.ex_t)}</h2><ul class="ticks ticks--sage">${li(item.ex)}</ul><p class="safe">${esc(L.ex_safe)}</p></div>
  <div><h2>${esc(L.myth_t)}</h2><div class="myth"><div class="m"><small>${esc(L.myth)}</small><p>${esc(item.myth[0])}</p></div><div class="f"><small>${esc(L.fact)}</small><p>${esc(item.myth[1])}</p></div></div></div>
</div></section>

<section class="c-sec"><div class="shell"><h2>${esc(L.faq_t)}</h2>
  <div class="faq">${item.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>

<section class="c-sec"><div class="shell learn2">
  <div class="lcard lcard--dark"><h3>${esc(L.vid_t)}</h3><p>${esc(L.vid_p)}</p><a class="btn btn--onwine" href="${ytq}" target="_blank" rel="noopener" data-track="youtube">${esc(L.vid_btn)}</a></div>
  <div class="lcard"><h3>${esc(L.ebook_t)}</h3><p><b>${esc(EBOOK[enItem.book] || '')}</b> — ${esc(L.ebook_p)}</p><a class="btn btn--line" href="/ebooks/${enItem.book}">${esc(L.ebook_btn)}</a></div>
</div></section>

<section class="c-sec"><div class="shell"><h2>${esc(L.rel_t)}</h2>
  <div class="rel">${(enItem.rel || []).map(s => byslug[s]).filter(Boolean).map(r => `<a href="${url(lang, r.slug)}"><b>${esc(r.name)}</b><span>${esc(r.short)}</span></a>`).join('')}</div>
</div></section>

<section class="c-sec" style="border:0"><div class="shell">
  <div class="c-cta"><div><h2>${esc(L.cta_t)}</h2><p>${esc(L.cta_p)}</p></div>
  <div class="acts"><a class="btn btn--onwine" href="${book}" data-track="book_cta">${esc(L.book)}</a><a class="btn btn--linewhite" href="https://wa.me/${PHONE}?text=${encodeURIComponent(L.wa_msg + item.name)}" target="_blank" rel="noopener" data-track="whatsapp">${esc(L.wa)}</a></div></div>
</div></section>`;
    return head({ lang, P, title, desc, canonical: alts[lang], alts, ld, indexable }) + chrome(L, lang, P, alts, inner, L.wa_msg + item.name) + '\n</body>\n</html>\n';
  }

  function hubPage(COND, lang, opts) {
    const L = COND[lang].labels, P = '../../';
    const alts = Object.fromEntries(LANGS.map(l => [l, url(l)]));
    const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: L.hub_t, url: SITE + alts[lang], inLanguage: HREFLANG[lang],
      hasPart: COND[lang].items.map(i => ({ '@type': 'MedicalWebPage', name: i.title, url: SITE + url(lang, i.slug) })) };
    const inner = `
<nav class="crumbs shell" aria-label="Breadcrumb"><ol><li><a href="/${lang}/">${esc(L.home)}</a></li><li aria-current="page">${esc(L.conds)}</li></ol></nav>
<section class="c-hero"><div class="shell" style="grid-template-columns:1fr"><div>
  <span class="eyebrow">VIP Magical Physio · Shirur</span><h1>${esc(L.hub_t)}</h1><p class="c-intro">${esc(L.hub_p)}</p>
</div></div></section>
<section class="c-sec" style="border:0;padding-top:0"><div class="shell"><div class="hub">
${COND[lang].items.map(i => `<a href="${url(lang, i.slug)}"><b>${esc(i.name)}</b><i>${esc(i.hook)}</i><span>${esc(i.short)}</span></a>`).join('\n')}
</div></div></section>`;
    return head({ lang, P, title: `${L.hub_t} | VIP Magical Physio Clinic, Shirur`, desc: L.hub_p.slice(0, 158), canonical: alts[lang], alts, ld, indexable: true })
      + chrome(L, lang, P, alts, inner, L.wa_msg) + '\n</body>\n</html>\n';
  }

  function servicesIndex(COND) {
    const out = {};
    COND.en.items.forEach((en, idx) => {
      out[en.slug] = Object.fromEntries(LANGS.map(l => { const it = COND[l].items.find(x => x.slug === en.slug) || en; return [l, { n: it.name, s: it.short }]; }));
    });
    return `/* generated by tools/build — do not edit */\nwindow.VIP_SERVICES=${JSON.stringify(out)};\n`;
  }

  function sitemap(COND, legacy, opts) {
    const rows = [];
    const add = (loc, alts, pri) => rows.push(`  <url><loc>${SITE}${loc}</loc><lastmod>${opts.date}</lastmod><priority>${pri}</priority>${alts ? LANGS.map(l => `<xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${SITE}${alts[l]}"/>`).join('') : ''}</url>`);
    const homeAlts = { en: '/en/', mr: '/mr/', hi: '/hi/' };
    LANGS.forEach(l => add(`/${l}/`, homeAlts, '1.0'));
    const hubAlts = Object.fromEntries(LANGS.map(l => [l, url(l)]));
    LANGS.forEach(l => add(url(l), hubAlts, '0.9'));
    COND.en.items.forEach(en => {
      if (opts.requireReview && !en.reviewed) return; // unreviewed medical pages stay out of the index
      const a = Object.fromEntries(LANGS.map(l => [l, url(l, en.slug)]));
      LANGS.forEach(l => add(a[l], a, '0.8'));
    });
    legacy.forEach(p => add(p, null, '0.6'));
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
  }

  function renderAll(COND, opts) {
    const files = {};
    LANGS.forEach(lang => {
      files[`${lang}/conditions/index.html`] = hubPage(COND, lang, opts);
      COND.en.items.forEach(en => {
        const item = COND[lang].items.find(x => x.slug === en.slug);
        if (!item) throw new Error(`Missing ${lang} translation for ${en.slug}`);
        files[`${lang}/conditions/${en.slug}/index.html`] = conditionPage(COND, lang, item, en, opts);
      });
    });
    files['assets/services-index.js'] = servicesIndex(COND);
    files['sitemap.xml'] = sitemap(COND, opts.legacy || [], opts);
    return files;
  }

  const api = { renderAll, LANGS };
  if (typeof module !== 'undefined') module.exports = api; else root.VIP_RENDER = api;
})(typeof window !== 'undefined' ? window : globalThis);
