/* Services index, Contact, FAQ, Videos, Resources, Blog, Article, Legal, 404 */
window.GEN = window.GEN || {};

/* ================= SERVICES INDEX ================= */
window.GEN.servicesIndex = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/services.html";

  const cards = SERVICES.map((s) => `
    <article class="card card--media reveal">
      <a href="services/${s.slug}.html" tabindex="-1" aria-hidden="true">
        <img src="${s.image}" alt="${esc(s.imageAlt)}" loading="lazy" width="672" height="420">
      </a>
      <div class="card__inner">
        <h2 class="card__title"><a href="services/${s.slug}.html">${esc(s.title)}</a></h2>
        <p class="card__body">${esc(s.card)}</p>
        <p class="card__who"><b>Who it may help:</b> ${esc(s.who)}</p>
        <a class="card__link" href="services/${s.slug}.html">Learn more <span aria-hidden="true">→</span></a>
      </div>
    </article>`).join("");

  const html = `${head({
    title: "Physiotherapy Services in Shirur | VIP Magical Physio Clinic",
    desc: "Twelve physiotherapy services in Shirur, Pune District — back, neck, knee and shoulder pain, stroke and orthopaedic rehabilitation, geriatric care, balance, home visits and online consultation.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Physiotherapy services",
      url: url,
      publisher: { "@id": SITE.domain + "/#clinic" },
      hasPart: SERVICES.map((s) => ({
        "@type": "Service",
        name: s.title,
        url: SITE.domain + "/services/" + s.slug + ".html",
        description: s.card
      }))
    })
  })}
<body>
${header(rel, "services", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Services" }])}

  <section class="section section--tight">
    <div class="shell">
      <div style="max-width:64ch">
        <p class="eyebrow">Physiotherapy services</p>
        <h1 class="h-1" style="margin-top:.9rem">Twelve services, one standard of assessment.</h1>
        <p class="lede" style="margin-top:1.1rem">Every condition is assessed individually. The pages below explain what each problem means, what an assessment involves, and — where relevant — when you should see a doctor instead of a physiotherapist.</p>
      </div>
      <div class="btn-row" style="margin-top:1.6rem">
        <a class="btn btn--primary btn--lg" href="booking.html">Book an appointment<span class="btn__arrow" aria-hidden="true">→</span></a>
        <a class="btn btn--wa btn--lg" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell">
      <div class="services-grid">${cards}</div>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell shell--narrow center">
      <h2 class="h-3">Not sure which service you need?</h2>
      <p class="lede mx-auto" style="margin-top:.9rem">That is normal, and it is what the assessment is for. A short phone conversation usually points you in the right direction.</p>
      <div class="btn-row" style="justify-content:center;margin-top:1.5rem">
        <a class="btn btn--primary btn--lg" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
        <a class="btn btn--ghost btn--lg" href="booking.html">Request an appointment</a>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "services.html", html: html };
};

/* ================= CONTACT ================= */
window.GEN.contact = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/contact.html";

  const html = `${head({
    title: "Contact & Clinic Location | VIP Magical Physio Clinic, Shirur",
    desc: "Contact VIP Magical Physio Clinic in Shirur, Pune District. Call 86248 60808, WhatsApp, or request an appointment. Please call before visiting.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: url,
      mainEntity: { "@id": SITE.domain + "/#clinic" }
    })
  })}
<body>
${header(rel, "contact", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Contact" }])}

  <section class="section section--tight">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div>
        <p class="eyebrow">Contact</p>
        <h1 class="h-1" style="margin-top:.9rem">Talk to the clinic.</h1>
        <p class="lede" style="margin-top:1.1rem">The quickest route is a phone call or a WhatsApp message. Appointments are confirmed by phone after we check availability, so please call before visiting.</p>

        <div style="display:grid;gap:1rem;margin-top:2rem">
          <a href="tel:${SITE.phoneIntl}" class="card" style="flex-direction:row;align-items:center;gap:1.2rem;text-decoration:none">
            <span style="width:48px;height:48px;border-radius:50%;background:var(--c-primary);color:var(--c-on-primary);display:grid;place-items:center;flex:none;font-size:1.2rem" aria-hidden="true">☎</span>
            <span><span class="tiny muted" style="display:block;letter-spacing:.1em;text-transform:uppercase">Phone</span><strong style="font-family:var(--font-display);font-size:1.4rem;letter-spacing:-.01em">${SITE.phoneDisplay}</strong></span>
          </a>
          <a href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener" class="card" style="flex-direction:row;align-items:center;gap:1.2rem;text-decoration:none">
            <span style="width:48px;height:48px;border-radius:50%;background:#1E7D5A;color:#fff;display:grid;place-items:center;flex:none;font-size:1.1rem" aria-hidden="true">✆</span>
            <span><span class="tiny muted" style="display:block;letter-spacing:.1em;text-transform:uppercase">WhatsApp</span><strong style="font-family:var(--font-display);font-size:1.4rem;letter-spacing:-.01em">Message the clinic</strong></span>
          </a>
        </div>

        <div class="panel" style="margin-top:1.6rem">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Clinic address</p>
          <p class="small" style="margin-top:.6rem;line-height:1.65">
            ${esc(SITE.addressLine1)}<br>
            ${esc(SITE.addressLine2)}
          </p>
          <p class="tiny muted" style="margin-top:.7rem">The full street address will be published here once confirmed. Please call for directions in the meantime.</p>

          <hr class="divider" style="margin-block:1.1rem">

          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Working hours</p>
          <p class="small" style="margin-top:.6rem">${esc(SITE.hours)}</p>
          <p class="tiny muted" style="margin-top:.7rem">Hours will be published once confirmed. Please call ahead.</p>
        </div>

        <div class="panel panel--ink" style="margin-top:1.2rem">
          <p class="small"><strong>Please call before visiting.</strong></p>
          <p class="tiny" style="margin-top:.5rem;opacity:.82;line-height:1.6">The clinic runs on appointment, not walk-in, basis. A call takes a minute and saves you a wasted journey.</p>
          <a class="btn btn--accent btn--block" href="tel:${SITE.phoneIntl}" style="margin-top:.9rem">Call ${SITE.phoneDisplay}</a>
        </div>
      </div>

      <div>
        <div style="border:var(--hair);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);background:var(--c-bg-2)">
          <div style="aspect-ratio:4/3;display:grid;place-items:center;padding:2rem;text-align:center;background:repeating-linear-gradient(45deg,var(--c-bg-2) 0 12px,var(--c-bg) 12px 24px)">
            <div>
              <p class="mono" style="color:var(--c-ink-soft)">[ GOOGLE MAPS EMBED ]</p>
              <p class="small muted" style="margin-top:.7rem;max-width:32ch">Add the clinic's Google Maps embed here once the full address is confirmed. Use the official Google Business Profile place ID so the map matches your listing.</p>
              <a class="btn btn--ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}" target="_blank" rel="noopener" style="margin-top:1rem">Open in Google Maps</a>
            </div>
          </div>
        </div>

        <div class="panel" style="margin-top:1.2rem">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Service area</p>
          <p class="small" style="margin-top:.6rem;line-height:1.65">Clinic appointments in Shirur, Pune District. Home visits in Shirur and immediately surrounding areas, confirmed by phone. Online consultations available across India where remote assessment is appropriate.</p>
        </div>

        <div class="panel" style="margin-top:1.2rem">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Reviews &amp; profile</p>
          <div data-gbp class="gbp--compact" style="margin-top:.8rem;padding:0;border:0"></div>
        </div>

        <div class="panel" style="margin-top:1.2rem">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Follow</p>
          <div class="btn-row" style="margin-top:.7rem">
            <a class="btn btn--ghost" href="${SITE.youtube}" target="_blank" rel="noopener">YouTube</a>
            <a class="btn btn--ghost" href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div>
        <p class="eyebrow">Send an enquiry</p>
        <h2 class="h-2" style="margin-top:.9rem">Prefer to write first?</h2>
        <p class="lede" style="margin-top:1rem">Send a short message and we will respond. This form prepares a WhatsApp message — nothing is stored on a server and no medical history is collected.</p>
        <p class="tiny muted" style="margin-top:1.2rem;line-height:1.6">Please do not send detailed medical information, reports or images through this form. Those are better discussed directly at an appointment.</p>
      </div>

      <form class="form" data-enquiry data-form-kind="contact" style="background:var(--c-surface);border:var(--hair);border-radius:var(--radius-lg);padding:clamp(1.2rem,3vw,2rem);box-shadow:var(--shadow-md)">
        <div class="field">
          <label for="c-name">Your name</label>
          <input type="text" id="c-name" name="name" required autocomplete="name">
          <span class="err">Please enter your name.</span>
        </div>
        <div class="field">
          <label for="c-phone">Mobile number</label>
          <input type="tel" id="c-phone" name="phone" required inputmode="tel" autocomplete="tel" placeholder="10-digit mobile number">
          <span class="err">Please enter a valid number.</span>
        </div>
        <div class="field">
          <label for="c-type">Enquiry type</label>
          <select id="c-type" name="type" required>
            <option value="">Choose…</option>
            <option value="Clinic appointment">Clinic appointment</option>
            <option value="Home visit">Home visit</option>
            <option value="Online consultation">Online consultation</option>
            <option value="Ebook enquiry">Ebook enquiry</option>
            <option value="General enquiry">General enquiry</option>
          </select>
          <span class="err">Please choose an enquiry type.</span>
        </div>
        <div class="field">
          <label for="c-msg">Message <span class="hint" style="display:inline">(optional)</span></label>
          <textarea id="c-msg" name="reason" rows="3" placeholder="A short note about what you need."></textarea>
        </div>
        <div class="field">
          <label class="check">
            <input type="checkbox" name="consent" required>
            <span>I agree to be contacted about this enquiry and have read the <a href="privacy-policy.html" style="text-decoration:underline">privacy policy</a>.</span>
          </label>
          <span class="err">Please confirm consent.</span>
        </div>
        <button class="btn btn--primary btn--lg btn--block" type="submit">Prepare WhatsApp message</button>
        <p class="tiny muted" data-form-status aria-live="polite"></p>
      </form>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "contact.html", html: html };
};

/* ================= FAQ ================= */
window.GEN.faq = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock, faqSchema } = lib;
  const rel = "";
  const url = SITE.domain + "/faq.html";

  const groups = [
    { id: "physio", title: "Physiotherapy", items: [
      { q: "What does a physiotherapist actually do?", a: "A physiotherapist assesses movement, strength and function, then designs and teaches a rehabilitation programme. Treatment is mostly active — exercise, movement retraining and education — supported where appropriate by hands-on techniques." },
      { q: "Do I need a doctor's referral to see a physiotherapist?", a: "In most cases, no. You can book directly. If your situation needs medical assessment first, we will tell you and help you get it." },
      { q: "How long does a first appointment take?", a: "Usually around 45 minutes, to allow time for history, examination and explaining the plan." },
      { q: "How many sessions will I need?", a: "It depends on the problem and how you progress. We do not pre-sell fixed packages. Most programmes involve a small number of appointments spread out, with independent work in between." },
      { q: "Will treatment hurt?", a: "Some techniques may be uncomfortable briefly. Exercises often produce mild soreness afterwards, which is normal. Sharp pain is not necessary for progress and should be reported." }
    ]},
    { id: "home", title: "Home visits", items: [
      { q: "Which areas do you cover?", a: "Shirur and the immediately surrounding areas. Please call with your location so we can confirm honestly rather than over-promise." },
      { q: "Who are home visits suitable for?", a: "Older adults, post-operative patients, stroke survivors, and anyone for whom travelling to a clinic is difficult or impractical." },
      { q: "What do I need at home?", a: "A clear space about the size of a mat, good lighting, and a firm chair with arms. That is usually sufficient." },
      { q: "Can family members join?", a: "Yes, with the patient's consent. It is often valuable for caregivers to learn safe assistance." }
    ]},
    { id: "online", title: "Online consultation", items: [
      { q: "Is it as good as in person?", a: "For follow-ups and exercise guidance, often comparable. For problems needing hands-on or neurological examination, it is not a substitute — and we will say so." },
      { q: "What platform is used?", a: "A standard video call, confirmed at booking. Nothing unusual to install." },
      { q: "Can I get medication prescribed?", a: "No. Physiotherapists do not prescribe medication. If medication is needed, you will be advised to see a doctor." },
      { q: "What if the connection drops?", a: "We will attempt to reconnect and, if it fails, reschedule the remaining time. You will not lose the consultation." }
    ]},
    { id: "booking", title: "Appointment booking", items: [
      { q: "Is my appointment confirmed when I submit the form?", a: "No. The form creates a request. It is confirmed only after we speak and check availability. This is deliberate — we do not operate a live automated calendar." },
      { q: "Can I walk in without an appointment?", a: "Please do not. The clinic runs on an appointment basis. Call ahead and we will give you a confirmed time." },
      { q: "How quickly will you respond?", a: "Usually the same working day. If you have not heard back within a working day, please call directly." },
      { q: "Can I reschedule?", a: "Yes, with reasonable notice. Call or message and we will find another time." }
    ]},
    { id: "rehab", title: "Rehabilitation", items: [
      { q: "How long does rehabilitation take?", a: "It varies widely by condition, severity and consistency. Anyone offering a precise number of weeks is guessing. We set review points and adjust based on actual progress." },
      { q: "What if I stop improving?", a: "We reassess. A plateau usually means the programme needs changing, not that progress is over." },
      { q: "Do I have to do exercises at home?", a: "Yes, in nearly every case. Appointments set the plan; the work between them is what produces change." },
      { q: "Can physiotherapy help long-standing problems?", a: "Often, yes — though improvement is usually gradual and measured in function rather than dramatic pain relief." }
    ]},
    { id: "ebook", title: "Ebook purchase", items: [
      { q: "Can I buy an ebook on the website?", a: "Not yet. Online payment is not connected, and the site says so rather than showing a checkout that does not work. Orders are handled by direct enquiry for now." },
      { q: "How do I order?", a: "Send a WhatsApp or use the enquiry form on the ebooks page. We will confirm availability and share a payment link when the title is released." },
      { q: "What format?", a: "PDF, readable on phone, tablet and computer." }
    ]},
    { id: "pay", title: "Payments", items: [
      { q: "How do I pay for appointments?", a: "In person at the clinic. Please call for current charges — they will be stated clearly before treatment begins." },
      { q: "Is online payment available?", a: "Not currently. Payment gateway integration is planned; until it is live and tested, no card details can be accepted on this site." },
      { q: "Do you accept insurance?", a: "Please call to discuss. Reimbursement arrangements vary and we will tell you honestly what is possible." }
    ]},
    { id: "download", title: "Digital downloads", items: [
      { q: "How are paid files delivered?", a: "By a unique, time-limited download link sent after payment is confirmed — not a public file path." },
      { q: "What if the download fails?", a: "Contact us and we will reissue the link. If a file is faulty, we will replace or refund it." },
      { q: "Can I share the file?", a: "The licence is for personal use. Please do not redistribute paid material — it is a small practice, and it matters." }
    ]}
  ];

  const allFaqs = groups.reduce((a, g) => a.concat(g.items), []);

  const html = `${head({
    title: "Frequently Asked Questions | VIP Magical Physio Clinic, Shirur",
    desc: "Answers about physiotherapy, home visits, online consultation, appointment booking, rehabilitation, ebook purchase, payments and digital downloads.",
    canonical: url,
    schema: faqSchema(allFaqs)
  })}
<body>
${header(rel, "faq", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "FAQ" }])}

  <section class="section section--tight">
    <div class="shell">
      <div style="max-width:60ch">
        <p class="eyebrow">Questions</p>
        <h1 class="h-1" style="margin-top:.9rem">Frequently asked questions.</h1>
        <p class="lede" style="margin-top:1.1rem">Straight answers, including the ones about what we cannot currently do.</p>
      </div>

      <div class="chip-row" style="margin-top:1.6rem">
        ${groups.map((g, i) => `<a class="chip" href="#${g.id}" ${i === 0 ? 'data-active="true"' : ""}>${esc(g.title)}</a>`).join("")}
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell shell--narrow">
      ${groups.map((g) => `
        <div id="${g.id}" style="margin-bottom:2.6rem">
          <h2 class="h-3" style="margin-bottom:1rem">${esc(g.title)}</h2>
          ${faqBlock(g.items, "faq-" + g.id)}
        </div>`).join("")}

      <div class="panel panel--ink" style="margin-top:2rem">
        <h2 class="h-3">Still unanswered?</h2>
        <p class="small" style="margin-top:.6rem;opacity:.85;line-height:1.6">Call the clinic and ask directly. A short conversation is usually faster than another page of reading.</p>
        <div class="btn-row" style="margin-top:1.2rem">
          <a class="btn btn--accent" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
          <a class="btn btn--ghost" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener" style="color:#fff;border-color:rgba(255,255,255,.35)">WhatsApp</a>
        </div>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "faq.html", html: html };
};

/* ================= VIDEOS ================= */
window.GEN.videos = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/videos.html";

  const cats = ["Back Pain", "Knee Pain", "Neck Pain", "Stroke", "Post-operative", "Older Adults", "Home Exercises", "Ergonomics", "Healthy Lifestyle", "Marathi", "Hindi"];

  const videos = [
    { t: "Understanding back pain: what actually helps", cat: "Back Pain", d: "5:42", desc: "Why most back pain is not structural damage, and what the evidence says about movement versus rest." },
    { t: "Three safe knee exercises for older adults", cat: "Knee Pain", d: "7:10", desc: "Quadriceps sets, supported sit-to-stand and step practice — demonstrated slowly, with safety notes." },
    { t: "Stroke rehabilitation: a guide for families", cat: "Stroke", d: "9:05", desc: "What recovery involves, how to assist safely, and why doing less for the patient can help them more." },
    { t: "Balance training at home", cat: "Older Adults", d: "6:18", desc: "Supported single-leg standing and heel-to-toe walking, with progression and safety guidance." },
    { t: "Desk setup for neck and shoulder comfort", cat: "Ergonomics", d: "4:55", desc: "Practical workstation adjustments, and why position variety matters more than one perfect posture." },
    { t: "Exercises after knee replacement: weeks 1–6", cat: "Post-operative", d: "8:32", desc: "Early range and strength work within surgical limits, plus swelling management." },
    { t: "Neck pain and smartphone use", cat: "Neck Pain", d: "5:04", desc: "What sustained positions do to the neck, and simple changes that reduce accumulated strain." },
    { t: "A two-minute movement break", cat: "Home Exercises", d: "2:20", desc: "A short routine for anyone who sits for long periods. No equipment required." },
    { t: "दुखणे समजून घ्या: पाठदुखी", cat: "Marathi", d: "6:44", desc: "Marathi-language explanation of common back pain and what helps." },
    { t: "घुटने का दर्द: व्यायाम और सावधानियाँ", cat: "Hindi", d: "7:02", desc: "Hindi-language guidance on knee pain exercises and precautions." },
    { t: "Walking for health after 50", cat: "Healthy Lifestyle", d: "4:12", desc: "How to build walking tolerance gradually, and what to do when it flares." },
    { t: "Shoulder pain: when to seek help", cat: "Healthy Lifestyle", d: "5:38", desc: "Distinguishing stiffness from weakness, and the warning signs that need medical review." }
  ];

  const cards = videos.map((v) => `
    <article class="vid reveal" data-tags="${esc(v.cat)}">
      <a href="${SITE.youtube}" target="_blank" rel="noopener" class="vid__thumb" style="background:linear-gradient(135deg,var(--c-primary),var(--c-support))" aria-label="Watch ${esc(v.t)} on YouTube">
        <span class="vid__play" aria-hidden="true"></span>
        <span class="vid__dur">${esc(v.d)}</span>
      </a>
      <div class="vid__meta">
        <span class="tag">${esc(v.cat)}</span>
        <h3>${esc(v.t)}</h3>
        <p class="tiny muted" style="line-height:1.55">${esc(v.desc)}</p>
        <a class="card__link" href="${SITE.youtube}" target="_blank" rel="noopener" style="margin-top:auto;padding-top:.6rem">Watch on YouTube →</a>
      </div>
    </article>`).join("");

  const html = `${head({
    title: "Physiotherapy Video Library | Dr. Vipul Ahire — Dard E Body Care",
    desc: "Free physiotherapy education videos in English, Marathi and Hindi — back pain, knee pain, stroke rehabilitation, balance, ergonomics and home exercises.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Physiotherapy video library",
      url: url,
      publisher: { "@id": SITE.domain + "/#clinic" }
    })
  })}
<body>
${header(rel, "videos", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Videos" }])}

  <section class="section section--tight">
    <div class="shell">
      <div style="display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(1.4rem,4vw,3rem);align-items:end">
        <div>
          <p class="eyebrow">Video library</p>
          <h1 class="h-1" style="margin-top:.9rem">Physiotherapy, explained out loud.</h1>
          <p class="lede" style="margin-top:1.1rem">Free education videos in English, Marathi and Hindi — the same explanations given in the clinic, made available to anyone.</p>
        </div>
        <div class="panel panel--ink">
          <p class="small"><strong>Subscribe on YouTube</strong></p>
          <p class="tiny" style="margin-top:.4rem;opacity:.8">New videos on pain, rehabilitation and healthy ageing.</p>
          <a class="btn btn--accent btn--block" href="${SITE.youtube}" target="_blank" rel="noopener" style="margin-top:.8rem">Dr. Vipul Ahire — Dard E Body Care</a>
        </div>
      </div>

      <div class="callout" style="margin-top:1.8rem;max-width:78ch">
        <span class="callout__label">About these listings</span>
        Videos open on the official YouTube channel. Titles and durations below are placeholders describing planned content — they will be replaced with live video IDs once the library is mapped to specific uploads. Nothing is downloaded or re-hosted here.
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell">
      <div class="chip-row" data-filter-group="#video-grid" style="margin-bottom:1.6rem">
        <button class="chip" data-filter="all" aria-pressed="true">All</button>
        ${cats.map((c) => `<button class="chip" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}
      </div>
      <div class="grid" id="video-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${cards}</div>
      <p data-empty style="display:none" class="muted center" style="padding:2rem 0">No videos in this category yet.</p>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell shell--narrow center">
      <h2 class="h-3">Prefer a proper assessment?</h2>
      <p class="lede mx-auto" style="margin-top:.9rem">Videos are general education. Your specific problem deserves an examination.</p>
      <div class="btn-row" style="justify-content:center;margin-top:1.5rem">
        <a class="btn btn--primary btn--lg" href="booking.html">Book an appointment</a>
        <a class="btn btn--wa btn--lg" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "videos.html", html: html };
};
