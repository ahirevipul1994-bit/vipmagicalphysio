/* Homepage generator */
window.GEN = window.GEN || {};

window.GEN.home = function (ctx) {
  const { lib, SITE, SERVICES, ARTICLES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;

  const rel = "";
  const canonical = SITE.domain + "/";

  const orgSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalClinic", "LocalBusiness"],
        "@id": SITE.domain + "/#clinic",
        name: "VIP Magical Physio Clinic",
        description: "Physiotherapy, rehabilitation and movement care in Shirur, Pune District, Maharashtra.",
        url: SITE.domain,
        telephone: SITE.phoneIntl,
        image: SITE.domain + "/assets/img/hero-hands.jpg",
        priceRange: "₹₹",
        medicalSpecialty: "Physiotherapy",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.addressLine1,
          addressLocality: SITE.locality,
          addressRegion: SITE.region,
          postalCode: SITE.postalCode,
          addressCountry: SITE.country
        },
        areaServed: [
          { "@type": "City", name: "Shirur" },
          { "@type": "AdministrativeArea", name: "Pune District" }
        ],
        availableService: SERVICES.map((s) => ({ "@type": "MedicalTherapy", name: s.title })),
        sameAs: [SITE.youtube, SITE.instagram]
      },
      {
        "@type": "Person",
        "@id": SITE.domain + "/#vipul",
        name: "Dr. Vipul Ahire",
        jobTitle: "Physiotherapist",
        description: "Physiotherapist with approximately six years of clinical experience, practising in Shirur, Pune District.",
        worksFor: { "@id": SITE.domain + "/#clinic" },
        sameAs: [SITE.youtube, SITE.instagram]
      },
      {
        "@type": "WebSite",
        "@id": SITE.domain + "/#website",
        url: SITE.domain,
        name: "VIP Magical Physio Clinic",
        publisher: { "@id": SITE.domain + "/#clinic" },
        inLanguage: ["en-IN", "mr-IN", "hi-IN"]
      }
    ]
  });

  const serviceCards = SERVICES.map((s) => `
    <article class="card card--media reveal">
      <a href="services/${s.slug}.html" tabindex="-1" aria-hidden="true">
        <img src="${s.image}" alt="${esc(s.imageAlt)}" loading="lazy" width="672" height="420">
      </a>
      <div class="card__inner">
        <h3 class="card__title"><a href="services/${s.slug}.html">${esc(s.title)}</a></h3>
        <p class="card__body">${esc(s.card)}</p>
        <p class="card__who"><b>Who it may help:</b> ${esc(s.who)}</p>
        <a class="card__link" href="services/${s.slug}.html">Learn more <span aria-hidden="true">→</span></a>
      </div>
    </article>`).join("");

  const featuredArticles = ARTICLES.slice(0, 4).map((a) => `
    <article class="art">
      <div class="art__body">
        <div class="art__meta">
          <span class="tag">${esc(a.category)}</span>
          <span aria-hidden="true">·</span>
          <time datetime="${a.date}">${new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
          <span aria-hidden="true">·</span>
          <span>${a.readMins} min read</span>
        </div>
        <h3><a href="blog/${a.slug}.html">${esc(a.title)}</a></h3>
        <p>${esc(a.excerpt)}</p>
      </div>
    </article>`).join("");

  const VIDEO_PLACEHOLDERS = [
    { t: "Understanding back pain: what actually helps", d: "5:42", tag: "Back Pain" },
    { t: "Three safe knee exercises for older adults", d: "7:10", tag: "Knee Pain" },
    { t: "Stroke rehabilitation: a guide for families", d: "9:05", tag: "Stroke" }
  ];

  const videoCards = VIDEO_PLACEHOLDERS.map((v) => `
    <a class="vid reveal" href="${SITE.youtube}" target="_blank" rel="noopener">
      <div class="vid__thumb" style="background:linear-gradient(135deg,var(--c-primary),var(--c-support))">
        <span class="vid__play" aria-hidden="true"></span>
        <span class="vid__dur">${esc(v.d)}</span>
      </div>
      <div class="vid__meta">
        <span class="tag">${esc(v.tag)}</span>
        <h3>${esc(v.t)}</h3>
        <span class="tiny muted">Watch on YouTube →</span>
      </div>
    </a>`).join("");

  const html = `${head({
    title: "Physiotherapy in Shirur | Dr. Vipul Ahire — VIP Magical Physio Clinic",
    desc: "Professional physiotherapy, rehabilitation and movement care in Shirur, Pune District. Back pain, knee pain, stroke and post-operative rehab, home visits and online consultation. Call 86248 60808.",
    canonical: canonical,
    schema: orgSchema,
    image: SITE.domain + "/assets/img/hero-hands.jpg"
  })}
<body>
${header(rel, "home", SITE, SERVICES)}

<main id="main">

  <!-- ============ HERO ============ -->
  <section class="hero" data-screen-label="01 Hero">
    <div class="shell hero__grid">
      <div class="hero__copy">
        <p class="eyebrow" style="margin-bottom:1rem" data-i18n="hero.eyebrow">Physiotherapy · Shirur, Pune District</p>
        <h1 data-i18n="hero.title">Move better.<br><em>Live better.</em></h1>
        <p class="hero__sub" data-i18n="hero.sub">Professional physiotherapy, rehabilitation and movement care in Shirur. Understand your pain, improve your movement, and build confidence in the activities that make up your day.</p>
        <div class="hero__serve">
          <span class="pulse-dot" aria-hidden="true"></span>
          <span>Clinic visits, home visits and online consultation</span>
        </div>
        <div class="btn-row" style="margin-top:1.6rem">
          <a class="btn btn--primary btn--lg" href="booking.html">Book physiotherapy appointment<span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--wa btn--lg" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
        </div>
        <div class="btn-row" style="margin-top:.9rem">
          <a class="btn btn--quiet" href="home-visit.html">Explore home visit services →</a>
        </div>

        <div class="hero__stats">
          <div class="hero__stat"><b>6 yrs</b><span>Clinical physiotherapy experience</span></div>
          <div class="hero__stat"><b>1:1</b><span>Individual assessment, every visit</span></div>
          <div class="hero__stat"><b>3</b><span>Ways to be seen — clinic, home, online</span></div>
        </div>
      </div>

      <div class="hero__media">
        <img class="hero__img" src="assets/img/hero-hands.jpg" alt="Physiotherapist guiding an older adult's arm through a rehabilitation exercise in a clinic" width="1728" height="2304" fetchpriority="high">
        <div class="hero__badge">
          <strong>Dr. Vipul Ahire</strong>
          <span>(Physio) · Assessment-led, exercise and education-based rehabilitation</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ STRIP ============ -->
  <div class="strip" aria-hidden="true">
    <div class="strip__track">
      ${Array(2).fill(["Back &amp; neck pain", "Knee rehabilitation", "Stroke recovery", "Post-operative care", "Balance &amp; falls", "Home physiotherapy", "Geriatric care", "Online consultation"]).flat().map((t) => `<span class="strip__item">${t}</span>`).join("")}
    </div>
  </div>

  <!-- ============ TRUST ============ -->
  <section class="section" data-screen-label="02 Trust">
    <div class="shell">
      <div class="grid" style="grid-template-columns:1fr 1.15fr;gap:clamp(1.5rem,5vw,4rem);align-items:start">
        <div class="reveal">
          <p class="eyebrow">Who you'll be seeing</p>
          <h2 class="h-2" style="margin-top:.9rem">Care that starts with listening, not a template.</h2>
          <p class="lede" style="margin-top:1rem">Dr. Vipul Ahire is a physiotherapist with approximately six years of clinical experience, practising in Shirur. His approach is straightforward: assess properly, explain clearly, and build a plan that fits the life the patient actually lives.</p>
          <div class="panel panel--support" style="margin-top:1.6rem">
            <p class="small" style="line-height:1.6"><strong>A note on what we don't claim.</strong> We don't publish invented ratings, borrowed testimonials, or recovery statistics we can't verify. What we can offer is an honest assessment, a clear explanation, and a plan that is reviewed and adjusted.</p>
          </div>
        </div>

        <div class="trust-list reveal">
          <div class="trust-item">
            <span class="trust-item__num" aria-hidden="true">1</span>
            <div><h4>Individual assessment</h4><p>Every patient is examined, not categorised. The plan follows the findings.</p></div>
          </div>
          <div class="trust-item">
            <span class="trust-item__num" aria-hidden="true">2</span>
            <div><h4>Patient-centred</h4><p>Goals are set around your day — stairs, work, walking, caring for family.</p></div>
          </div>
          <div class="trust-item">
            <span class="trust-item__num" aria-hidden="true">3</span>
            <div><h4>Rehabilitation-focused</h4><p>The aim is function and independence, not endless appointments.</p></div>
          </div>
          <div class="trust-item">
            <span class="trust-item__num" aria-hidden="true">4</span>
            <div><h4>Exercise and education</h4><p>Active treatment, with the reasoning explained so you can self-manage.</p></div>
          </div>
          <div class="trust-item">
            <span class="trust-item__num" aria-hidden="true">5</span>
            <div><h4>Honest about limits</h4><p>If your problem needs medical or surgical review, we say so and refer.</p></div>
          </div>
          <div class="trust-item">
            <span class="trust-item__num" aria-hidden="true">6</span>
            <div><h4>Family included</h4><p>With consent, caregivers are taught how to assist safely between visits.</p></div>
          </div>
        </div>

        <div style="grid-column:1/-1;margin-top:1rem" class="reveal">
          <div data-gbp></div>
        </div>
      </div>
    </div>
  </section>

  <div data-home-sections>

  <!-- ============ SERVICES ============ -->
  <section class="section" data-section="services" data-screen-label="03 Services" style="background:var(--c-bg-2)">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">Physiotherapy services</p>
          <h2 class="h-2" style="margin-top:.9rem">The problems people most often bring to us.</h2>
          <p class="lede" style="margin-top:.8rem">Each service page explains what the condition means, what an assessment involves, and — importantly — when you should see a doctor instead.</p>
        </div>
        <a class="btn btn--ghost" href="services.html">All 12 services →</a>
      </div>
      <div class="services-grid">${serviceCards}</div>
    </div>
  </section>

  <!-- ============ HOW IT WORKS ============ -->
  <section class="section" data-section="trust" data-screen-label="04 How it works">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">What to expect</p>
          <h2 class="h-2" style="margin-top:.9rem">How treatment actually works here.</h2>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        <div class="card card--flat reveal">
          <span class="tag">Step one</span>
          <h3 class="card__title" style="margin-top:.5rem">Assessment</h3>
          <p class="card__body">A conversation about your history and daily demands, followed by examination of movement, strength and function. Roughly 45 minutes. You leave with an explanation, not just a diagnosis.</p>
        </div>
        <div class="card card--flat reveal">
          <span class="tag">Step two</span>
          <h3 class="card__title" style="margin-top:.5rem">Your plan</h3>
          <p class="card__body">Two or three specific things to work on, with the reasoning explained. Exercises are chosen for your current capacity and taught until you can do them correctly alone.</p>
        </div>
        <div class="card card--flat reveal">
          <span class="tag">Step three</span>
          <h3 class="card__title" style="margin-top:.5rem">Review</h3>
          <p class="card__body">Progress is checked against real tasks — stairs, walking distance, sleep — and the programme is adjusted. If it isn't working, we change it rather than repeat it.</p>
        </div>
        <div class="card card--flat reveal">
          <span class="tag">When needed</span>
          <h3 class="card__title" style="margin-top:.5rem">Referral</h3>
          <p class="card__body">Some problems need imaging, medication or surgery. Physiotherapy is not the answer to everything, and recognising that early is part of good care.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ EDUCATION ============ -->
  <section class="section" data-section="education" data-screen-label="05 Learn" style="background:var(--c-bg-2)">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">Patient education</p>
          <h2 class="h-2" style="margin-top:.9rem">Understand your body before you treat it.</h2>
          <p class="lede" style="margin-top:.8rem">Free articles and videos, in English and Marathi, written to answer the questions people actually ask in the clinic.</p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns:1.1fr .9fr;gap:clamp(1.4rem,4vw,3rem);align-items:start">
        <div>
          <h3 class="h-4" style="margin-bottom:1rem">Latest articles</h3>
          ${featuredArticles}
          <a class="btn btn--ghost" href="blog.html" style="margin-top:1.4rem">Read all articles →</a>
        </div>
        <div>
          <h3 class="h-4" style="margin-bottom:1rem">From the YouTube channel</h3>
          <div class="grid" style="gap:1rem">${videoCards}</div>
          <a class="btn btn--ghost" href="videos.html" style="margin-top:1.2rem">Video library →</a>
          <div class="panel" style="margin-top:1.4rem">
            <p class="small" style="line-height:1.6"><strong>Free guides.</strong> Downloadable checklists on back pain, knee safety, home fall hazards and desk setup — no payment, consent-based signup only.</p>
            <a class="card__link" href="resources.html" style="margin-top:.7rem">Browse free resources →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ EBOOKS ============ -->
  <section class="section" data-section="ebooks" data-screen-label="06 Ebooks">
    <div class="shell">
      <div class="grid" style="grid-template-columns:.95fr 1.05fr;gap:clamp(1.6rem,5vw,3.5rem);align-items:center">
        <div class="reveal">
          <p class="eyebrow">Dard E Body Care</p>
          <h2 class="h-2" style="margin-top:.9rem">Health guides you can keep.</h2>
          <p class="lede" style="margin-top:1rem">Practical, plain-language ebooks on back pain, knee health, healthy ageing after 45, and caregiver support — written for patients and families, not for clinicians.</p>
          <div class="callout" style="margin-top:1.5rem">
            <span class="callout__label">Current status</span>
            The ebook store is being prepared. Titles are listed for preview, and purchases are handled by enquiry until online payment is connected. No payment is taken on this website.
          </div>
          <div class="btn-row" style="margin-top:1.4rem">
            <a class="btn btn--primary" href="ebooks.html">Explore health ebooks<span class="btn__arrow" aria-hidden="true">→</span></a>
            <a class="btn btn--wa" href="${waLink("ebook")}" data-wa="ebook" target="_blank" rel="noopener">Ask about ebooks</a>
          </div>
        </div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem">
          ${["Back Pain Education", "Knee Health", "Healthy Ageing After 45", "Caregiver Rehabilitation"]
            .map((t, i) => `
            <div class="product__cover" style="aspect-ratio:3/4;border-radius:var(--radius);${i % 2 ? "background:var(--c-support)" : "background:var(--c-primary)"}">
              <div class="product__cover-inner">
                <span class="tiny" style="letter-spacing:.14em;text-transform:uppercase;opacity:.8">Dard E Body Care</span>
                <span style="font-family:var(--font-display);font-size:clamp(1rem,2.1vw,1.4rem);line-height:1.15;letter-spacing:-.02em">${esc(t)}</span>
                <span class="tiny" style="opacity:.75">Coming soon</span>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </div>
  </section>

  </div><!-- /home sections -->

  <!-- ============ APPOINTMENT ============ -->
  <section class="section" data-screen-label="07 Book">
    <div class="shell">
      <div class="panel panel--ink" style="padding:clamp(1.8rem,5vw,4rem)">
        <div class="grid" style="grid-template-columns:1.15fr .85fr;gap:clamp(1.5rem,4vw,3rem);align-items:center">
          <div>
            <p class="eyebrow" style="color:var(--c-accent)">Appointments</p>
            <h2 class="h-1" style="margin-top:1rem">Call before you come.</h2>
            <p class="lede" style="margin-top:1rem;color:rgba(255,255,255,.8);max-width:46ch">Appointments are confirmed by phone after we check availability. Please call ${SITE.phoneDisplay} before visiting the clinic — we would rather give you a confirmed time than have you wait.</p>
            <div class="btn-row" style="margin-top:1.6rem">
              <a class="btn btn--accent btn--lg" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
              <a class="btn btn--ghost btn--lg" href="booking.html" style="color:#fff;border-color:rgba(255,255,255,.35)">Request an appointment</a>
            </div>
          </div>
          <div style="display:grid;gap:.8rem">
            <div style="border:1px solid rgba(255,255,255,.2);border-radius:var(--radius);padding:1.1rem">
              <span class="tiny" style="opacity:.6;letter-spacing:.1em;text-transform:uppercase">Clinic visit</span>
              <p style="margin-top:.35rem;font-size:var(--fs-sm)">In-person assessment and treatment in Shirur.</p>
            </div>
            <div style="border:1px solid rgba(255,255,255,.2);border-radius:var(--radius);padding:1.1rem">
              <span class="tiny" style="opacity:.6;letter-spacing:.1em;text-transform:uppercase">Home visit</span>
              <p style="margin-top:.35rem;font-size:var(--fs-sm)">For patients who cannot travel easily. Coverage confirmed by phone.</p>
            </div>
            <div style="border:1px solid rgba(255,255,255,.2);border-radius:var(--radius);padding:1.1rem">
              <span class="tiny" style="opacity:.6;letter-spacing:.1em;text-transform:uppercase">Online</span>
              <p style="margin-top:.35rem;font-size:var(--fs-sm)">Video consultation where remote assessment is appropriate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "index.html", html: html };
};
