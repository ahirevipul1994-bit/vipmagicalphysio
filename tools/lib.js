/* =========================================================
   VIP MAGICAL PHYSIO — BUILD LIBRARY
   Shared chrome: head, header, footer, floating CTAs.
   Used by tools/build.js (Node/run_script), never shipped.
   ========================================================= */

const esc = (s) => String(s == null ? "" : s)  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const attr = (s) => esc(s);

/* Cache-busting build stamp. Bump per build so a deploy invalidates
   cached CSS/JS instead of serving stale assets. */
const BUILD = "20261116e";

function waLink(kind, msg) {
  const base = "https://wa.me/918624860808?text=";
  const M = {
    clinic: "Hello Dr. Vipul, I would like to book a physiotherapy appointment at the clinic. My name is ____ and I would like to come on ____.",
    home: "Hello Dr. Vipul, I would like to enquire about a home physiotherapy visit. My area is ____ and the patient's main difficulty is ____.",
    online: "Hello Dr. Vipul, I would like to enquire about an online physiotherapy consultation. My main concern is ____.",
    ebook: "Hello Dr. Vipul, I would like to enquire about the Dard E Body Care ebooks.",
    general: "Hello Dr. Vipul, I would like to enquire about physiotherapy services."
  };
  return base + encodeURIComponent(msg || M[kind] || M.general);
}

/* ---------------- HEAD ---------------- */
function head(opts) {
  const {
    title, desc, rel = "", canonical = "", ogType = "website",
    schema = "", extraHead = "", image = "assets/img/hero-hands.jpg",
    noindex = false, lang = "en"
  } = opts;

  return `<!DOCTYPE html>
<html lang="${lang}" data-theme="a">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
<meta name="author" content="Dr. Vipul Ahire (Physio)">
<meta name="theme-color" content="#0B2239">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
${canonical ? `<link rel="canonical" href="${attr(canonical)}">` : ""}

<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="VIP Magical Physio Clinic">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:image" content="${attr(image)}">
${canonical ? `<meta property="og:url" content="${attr(canonical)}">` : ""}
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(desc)}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&family=Public+Sans:wght@300..800&family=Bitter:wght@400..700&family=Karla:wght@300..700&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://www.googletagmanager.com">${""}
<link rel="stylesheet" href="${rel}assets/tokens.css?v=${BUILD}">
<link rel="stylesheet" href="${rel}assets/site.css?v=${BUILD}">
<link rel="stylesheet" href="${rel}assets/extras.css?v=${BUILD}">
<link rel="icon" href="${rel}assets/favicon.svg" type="image/svg+xml">
${schema ? `<script type="application/ld+json">${schema}</script>` : ""}
${extraHead}
</head>`;
}

/* ---------------- HEADER ---------------- */
function header(rel, active, SITE, SERVICES) {
  const nav = (label, href, key) =>
    `<a class="nav__link" href="${rel}${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;

  const megaItems = SERVICES.map((s) => `
    <a class="mega__item" href="${rel}services/${s.slug}.html">
      <span class="mega__dot" aria-hidden="true"></span>
      <span><strong>${esc(s.title)}</strong><span>${esc(s.card.split(".")[0])}.</span></span>
    </a>`).join("");

  return `<a class="skip" href="#main">Skip to main content</a>

<div class="utility">
  <div class="shell utility__row">
    <div class="utility__left">
      <span class="utility__note">Please call before visiting — appointments are booked in advance.</span>
    </div>
    <div class="utility__right">
      <a href="${rel}dashboard.html">My dashboard</a>
      <a href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
      <a href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp</a>
      <span class="utility__note">${SITE.locality}, ${SITE.region}</span>
    </div>
  </div>
</div>

<header class="site-head">
  <div class="shell site-head__row">
    <a class="brand" href="${rel}index.html" aria-label="VIP Magical Physio Clinic — home">
      <span class="brand__mark" aria-hidden="true">V</span>
      <span class="brand__text">
        <span class="brand__name">VIP Magical Physio</span>
        <span class="brand__sub">Dr. Vipul Ahire · Shirur</span>
      </span>
    </a>

    <nav class="nav" aria-label="Primary">
      ${nav("Home", "index.html", "home")}
      ${nav("About", "about.html", "about")}
      <div class="has-mega">
        <a class="nav__link" href="${rel}services.html"${active === "services" ? ' aria-current="page"' : ""}>Services <span aria-hidden="true">▾</span></a>
        <div class="mega">
          <div class="mega__grid">
            <div class="mega__head">
              <strong class="small">Physiotherapy services</strong>
              <a class="card__link" href="${rel}services.html">All services →</a>
            </div>
            ${megaItems}
          </div>
        </div>
      </div>
      ${nav("Home Visits", "home-visit.html", "homevisit")}
      ${nav("Online", "online-consultation.html", "online")}
      ${nav("Ebooks", "ebooks.html", "ebooks")}
      ${nav("Learn", "blog.html", "learn")}
    </nav>

    <div class="head__actions">
      <div class="lang" role="group" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="true">EN</button>
        <button type="button" data-lang="mr" aria-pressed="false">मराठी</button>
        <button type="button" data-lang="hi" aria-pressed="false">हिन्दी</button>
      </div>
      <a class="btn btn--primary" href="${rel}booking.html">Book appointment</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav" id="mobile-nav" data-open="false">
  <div class="mobile-nav__top">
    <span class="brand">
      <span class="brand__mark" aria-hidden="true">V</span>
      <span class="brand__text"><span class="brand__name">VIP Magical Physio</span></span>
    </span>
    <button class="btn btn--ghost" type="button" data-close-nav>Close</button>
  </div>
  <ul class="mobile-nav__list">
    <li><a href="${rel}index.html">Home</a></li>
    <li><a href="${rel}about.html">About Dr. Vipul</a></li>
    <li><a href="${rel}services.html">Services</a></li>
    <li><a href="${rel}home-visit.html">Home visits</a></li>
    <li><a href="${rel}online-consultation.html">Online consultation</a></li>
    <li><a href="${rel}ebooks.html">Ebooks</a></li>
    <li><a href="${rel}videos.html">Videos</a></li>
    <li><a href="${rel}blog.html">Articles</a></li>
    <li><a href="${rel}resources.html">Free guides</a></li>
    <li><a href="${rel}faq.html">FAQ</a></li>
<li><a href="${rel}doctors.html">Find an online doctor</a></li><li><a href="${rel}reviews.html">Patient reviews</a></li><li><a href="${rel}patient-guide.html">Patient guide</a></li><li><a href="${rel}doctor-partners.html">For doctors</a></li>
    <li><a href="${rel}contact.html">Contact</a></li>
  </ul>
  <div class="mobile-nav__cta">
    <a class="btn btn--primary btn--lg btn--block" href="${rel}booking.html">Book appointment</a>
    <a class="btn btn--wa btn--block" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
    <a class="btn btn--ghost btn--block" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
  </div>
</div>`;
}

/* ---------------- FOOTER ---------------- */
function footer(rel, SITE, SERVICES) {
  const svc = SERVICES.slice(0, 5).map(
    (s) => `<li><a href="${rel}services/${s.slug}.html">${esc(s.title)}</a></li>`
  ).join("");

  return `<footer class="site-foot">
  <div class="shell">
    <div class="foot__top">
      <div class="foot__brand">
        <span class="brand">
          <span class="brand__mark" aria-hidden="true">V</span>
          <span class="brand__text">
            <span class="brand__name">VIP Magical Physio</span>
            <span class="brand__sub">Dr. Vipul Ahire (Physio)</span>
          </span>
        </span>
        <p class="small" style="margin-top:1.1rem;max-width:34ch;opacity:.8;line-height:1.6">
          Helping people understand pain, improve movement and rebuild confidence in everyday life.
        </p>
        <p class="tiny" style="margin-top:1.2rem;opacity:.72">
          Educational brand: <strong style="opacity:.95">Dard E Body Care</strong>
        </p>
      </div>

      <div class="foot">
        <h4>Services</h4>
        <ul>${svc}<li><a href="${rel}services.html">All services →</a></li></ul>
      </div>

      <div class="foot">
        <h4>Clinic</h4>
        <ul>
          <li><a href="${rel}about.html">About Dr. Vipul</a></li>
          <li><a href="${rel}booking.html">Book an appointment</a></li>
          <li><a href="${rel}home-visit.html">Home visits</a></li>
          <li><a href="${rel}online-consultation.html">Online consultation</a></li>
          <li><a href="${rel}contact.html">Contact &amp; location</a></li>
          <li><a href="${rel}faq.html">FAQ</a></li>
<li><a href="${rel}doctors.html">Find an online doctor</a></li><li><a href="${rel}reviews.html">Patient reviews</a></li><li><a href="${rel}patient-guide.html">Patient guide</a></li><li><a href="${rel}doctor-partners.html">For doctors</a></li>
        </ul>
      </div>

      <div class="foot foot__contact-col">
        <h4>Contact</h4>
        <div class="foot__contact">
          <div>
            <strong><a href="tel:${SITE.phoneIntl}">${SITE.phoneDisplay}</a></strong>
            <span class="tiny" style="opacity:.72">Call or WhatsApp</span>
          </div>
          <div class="tiny" style="line-height:1.6;opacity:.82">
            ${esc(SITE.addressLine1)}<br>
            ${esc(SITE.addressLine2)}
          </div>
          <div class="tiny" style="opacity:.82">${esc(SITE.hours)}</div>
          <div class="btn-row" style="margin-top:.5rem">
            <a class="btn btn--wa" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener" style="min-height:46px;padding:.6rem 1.1rem">WhatsApp</a>
            <a class="btn btn--ghost" href="${SITE.youtube}" target="_blank" rel="noopener" style="min-height:46px;padding:.6rem 1.1rem;border-color:rgba(255,255,255,.3);color:inherit">YouTube</a>
          </div>
          <div class="tiny" style="opacity:.72;display:flex;gap:1rem;flex-wrap:wrap">
            <a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube channel</a>
            <a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </div>
    </div>

    <p class="foot__disclaimer">
      <strong>Medical disclaimer:</strong> Content on this website is general health education and does not replace individual medical assessment, diagnosis or treatment. Physiotherapy is not appropriate for every condition, and outcomes vary between individuals. If you have severe or sudden symptoms, seek urgent medical care. In an emergency, call your local emergency number.
    </p>

    <div class="foot__legal">
      <span>© <span data-year>2026</span> VIP Magical Physio Clinic · Dr. Vipul Ahire (Physio), ${esc(SITE.locality)}, ${esc(SITE.region)}</span>
      <span class="foot__legal-links">
        <a href="${rel}privacy-policy.html">Privacy</a>
        <a href="${rel}terms.html">Terms</a>
        <a href="${rel}medical-disclaimer.html">Medical disclaimer</a>
        <a href="${rel}refund-policy.html">Refund policy</a>
        <a href="${rel}contact.html">Contact</a>
      </span>
    </div>
  </div>
</footer>

<div class="float">
  <a class="fab" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener" aria-label="Enquire on WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.6-.7c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.5 2.6 1 3.1.8 3.7.8.5 0 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.3 4.7 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 15 3.6 13.5 3.6 12 3.6 7.4 7.4 3.6 12 3.6S20.4 7.4 20.4 12 16.6 20.2 12 20.2z"/></svg>
    <span>WhatsApp</span>
  </a>
  <a class="fab fab--call" href="tel:${SITE.phoneIntl}" aria-label="Call the clinic">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
    <span>Call</span>
  </a>
</div>

<div class="sticky-bar">
  <a class="btn btn--wa" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp</a>
  <a class="btn btn--primary" href="${rel}booking.html">Book appointment</a>
</div>

<script src="${rel}assets/config.js?v=${BUILD}"></script>
<script src="${rel}assets/data.js?v=${BUILD}"></script>
<script src="${rel}assets/i18n.js?v=${BUILD}"></script>
<script src="${rel}assets/crm.js?v=${BUILD}"></script>
<script src="${rel}assets/gbp.js?v=${BUILD}"></script>
<script src="${rel}assets/analytics.js?v=${BUILD}"></script>
<script src="${rel}assets/site.js?v=${BUILD}"></script>
<script src="${rel}assets/tweaks.js?v=${BUILD}"></script>
</body>
</html>`;
}

/* ---------------- Shared blocks ---------------- */
function crumbs(rel, items) {
  const parts = items.map((it, i) => {
    if (i === items.length - 1) return `<span aria-current="page">${esc(it.label)}</span>`;
    return `<a href="${rel}${it.href}">${esc(it.label)}</a><span aria-hidden="true">/</span>`;
  }).join("");
  return `<nav class="crumbs" aria-label="Breadcrumb">${parts}</nav>`;
}

function ctas(rel, SITE, primaryLabel) {
  return `<div class="btn-row">
    <a class="btn btn--primary btn--lg" href="${rel}booking.html">${primaryLabel || "Book appointment"}<span class="btn__arrow" aria-hidden="true">→</span></a>
    <a class="btn btn--wa btn--lg" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
  </div>`;
}

function faqBlock(faqs, idPrefix) {
  return `<div class="acc">
    ${faqs.map((f, i) => `
      <div class="acc__item" data-open="${i === 0 ? "true" : "false"}">
        <h3 style="margin:0">
          <button class="acc__btn" type="button" id="${idPrefix}-q${i}" aria-controls="${idPrefix}-a${i}" aria-expanded="${i === 0 ? "true" : "false"}">
            <span>${esc(f.q)}</span>
            <span class="acc__sign" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="acc__panel" id="${idPrefix}-a${i}" role="region" aria-labelledby="${idPrefix}-q${i}">
          <div><p>${esc(f.a)}</p></div>
        </div>
      </div>`).join("")}
  </div>`;
}

function faqSchema(faqs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  });
}

function breadcrumbSchema(items) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: it.url
    }))
  });
}

module.exports = {
  esc, attr, waLink, head, header, footer,
  crumbs, ctas, faqBlock, faqSchema, breadcrumbSchema
};
