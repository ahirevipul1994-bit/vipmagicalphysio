/* Service page generator — 12 SEO pages */
window.GEN = window.GEN || {};

window.GEN.servicePage = function (ctx, svc) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock, faqSchema, breadcrumbSchema } = lib;
  const rel = "../";
  const url = SITE.domain + "/services/" + svc.slug + ".html";

  const bcItems = [
    { label: "Home", url: SITE.domain + "/" },
    { label: "Services", url: SITE.domain + "/services.html" },
    { label: svc.title, url: url }
  ];

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": url + "#page",
        name: svc.metaTitle,
        description: svc.metaDesc,
        url: url,
        inLanguage: "en-IN",
        about: { "@type": "MedicalCondition", name: svc.title.replace(" Physiotherapy", "") },
        publisher: { "@id": SITE.domain + "/#clinic" },
        lastReviewed: "2026-11-01",
        reviewedBy: { "@type": "Person", name: "Dr. Vipul Ahire", jobTitle: "Physiotherapist" }
      },
      JSON.parse(faqSchema(svc.faqs)),
      JSON.parse(breadcrumbSchema(bcItems))
    ]
  });

  const li = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const ol = (arr) => `<ol>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`;

  const others = SERVICES.filter((s) => s.slug !== svc.slug).slice(0, 3).map((s) => `
    <a class="card" href="${s.slug}.html">
      <h3 class="card__title" style="font-size:var(--fs-base)">${esc(s.title)}</h3>
      <p class="card__body">${esc(s.card)}</p>
      <span class="card__link">Read more →</span>
    </a>`).join("");

  const html = `${head({
    title: svc.metaTitle,
    desc: svc.metaDesc,
    canonical: url,
    rel: rel,
    ogType: "article",
    schema: schema,
    image: SITE.domain + "/" + svc.image
  })}
<body>
${header(rel, "services", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [
    { label: "Home", href: "index.html" },
    { label: "Services", href: "services.html" },
    { label: svc.title }
  ])}

  <section class="phero">
    <div class="shell phero__inner">
      <div>
        <p class="eyebrow">Physiotherapy service</p>
        <h1 style="margin-top:.9rem">${esc(svc.h1)}</h1>
        <p class="lede" style="margin-top:1.1rem">${esc(svc.card)}</p>
        <div class="btn-row" style="margin-top:1.6rem">
          <a class="btn btn--primary btn--lg" href="${rel}booking.html?service=${svc.slug}">Book an assessment<span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--wa btn--lg" href="${waLink("general", `Hello Dr. Vipul, I would like to enquire about ${svc.title.toLowerCase()} physiotherapy in Shirur.`)}" target="_blank" rel="noopener">WhatsApp enquiry</a>
        </div>
        <div class="phero__meta">
          <div><b>Clinic</b>Shirur, Pune District</div>
          <div><b>Home visits</b>By arrangement</div>
          <div><b>Online</b>Where appropriate</div>
          <div><b>Reviewed</b>November 2026</div>
        </div>
      </div>
      <div>
        <img src="${rel}${svc.image}" alt="${esc(svc.imageAlt)}" width="1344" height="896" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-md)">
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell" style="display:grid;grid-template-columns:1fr 320px;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div class="prose">

        <div class="callout callout--alert" style="margin-bottom:2rem">
          <span class="callout__label">Seek medical care first if</span>
          ${svc.redFlags.slice(0, 3).join(" · ")}. These need medical assessment, not a routine physiotherapy appointment.
        </div>

        <h2 id="meaning">What this means</h2>
        ${svc.meaning.map((p) => `<p>${esc(p)}</p>`).join("")}

        <h2 id="difficulties">Common functional difficulties</h2>
        <p>People describe this problem in terms of what they can no longer do, which is usually more useful than a pain score:</p>
        ${li(svc.difficulties)}

        <h2 id="when">When physiotherapy assessment may help</h2>
        ${li(svc.whenToAssess)}

        <h2 id="assessment">What an assessment may include</h2>
        ${li(svc.assessment)}

        <h2 id="principles">General rehabilitation principles</h2>
        ${li(svc.principles)}

        <h2 id="exercises">Exercises and education</h2>
        <p>These are examples of the kind of work involved — not a prescription. The right exercises, dose and progression depend on your assessment.</p>
        ${li(svc.exercises)}

        <div class="callout" style="margin-block:2rem">
          <span class="callout__label">Safety precautions</span>
          ${li(svc.safety)}
        </div>

        <h2 id="redflags">Warning signs requiring medical evaluation</h2>
        <p>These are uncommon, but they matter more than any exercise on this page. If any apply, seek medical assessment promptly.</p>
        <div class="callout callout--alert">${li(svc.redFlags)}</div>

        <h2 id="faq">Frequently asked questions</h2>
        ${faqBlock(svc.faqs, svc.slug)}

        <h2 id="next">Next steps</h2>
        <p>If any of this sounds like your situation, an assessment is the sensible next step. You will leave with an explanation in plain language and a plan you can actually follow.</p>
        <div class="btn-row" style="margin-top:1.4rem">
          <a class="btn btn--primary btn--lg" href="${rel}booking.html?service=${svc.slug}">Book an appointment</a>
          <a class="btn btn--wa btn--lg" href="${waLink("general", `Hello Dr. Vipul, I would like to enquire about ${svc.title.toLowerCase()}.`)}" target="_blank" rel="noopener">WhatsApp enquiry</a>
          <a class="btn btn--ghost btn--lg" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
        </div>

        <p class="tiny muted" style="margin-top:2rem;padding-top:1.2rem;border-top:var(--hair)">
          This page is general health education and does not replace individual medical assessment. Content reviewed by Dr. Vipul Ahire (Physio), November 2026.
        </p>
      </div>

      <aside style="position:sticky;top:96px;display:grid;gap:1rem">
        <div class="panel" style="padding:1.3rem">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">On this page</p>
          <nav style="display:grid;gap:.45rem;margin-top:.8rem;font-size:var(--fs-sm)">
            <a href="#meaning" style="text-decoration:none">What this means</a>
            <a href="#difficulties" style="text-decoration:none">Common difficulties</a>
            <a href="#when" style="text-decoration:none">When to seek help</a>
            <a href="#assessment" style="text-decoration:none">What assessment involves</a>
            <a href="#principles" style="text-decoration:none">Rehab principles</a>
            <a href="#redflags" style="text-decoration:none;color:var(--c-alert)">Warning signs</a>
            <a href="#faq" style="text-decoration:none">FAQs</a>
          </nav>
        </div>
        <div class="panel panel--ink" style="padding:1.3rem">
          <p class="small" style="line-height:1.55"><strong>Not sure if physiotherapy is right for you?</strong></p>
          <p class="tiny" style="margin-top:.5rem;opacity:.8;line-height:1.55">A short phone conversation usually settles it. If we're not the right service, we'll say so.</p>
          <a class="btn btn--accent btn--block" href="tel:${SITE.phoneIntl}" style="margin-top:.9rem">Call ${SITE.phoneDisplay}</a>
        </div>
        <div class="panel" style="padding:1.3rem">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Related reading</p>
          <a class="card__link" href="${rel}blog/${svc.relatedArticle}.html" style="margin-top:.7rem;display:block">Read the related article →</a>
          <a class="card__link" href="${rel}videos.html" style="margin-top:.6rem;display:block">Watch related videos →</a>
          <a class="card__link" href="${rel}resources.html" style="margin-top:.6rem;display:block">Free downloadable guides →</a>
        </div>
      </aside>
    </div>
  </section>

  <section class="section section--tight" style="background:var(--c-bg-2)">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">Other services</p>
          <h2 class="h-3" style="margin-top:.7rem">Related physiotherapy services</h2>
        </div>
        <a class="btn btn--ghost" href="${rel}services.html">All services →</a>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${others}</div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "services/" + svc.slug + ".html", html: html };
};
