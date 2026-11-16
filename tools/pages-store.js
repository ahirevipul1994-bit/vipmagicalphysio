/* Ebooks, About, Contact, FAQ, Videos, Resources, Blog index, Article */
window.GEN = window.GEN || {};

window.EBOOKS = [
  { slug: "back-pain-education", title: "Back Pain: What Actually Helps", sub: "Understanding pain, load and recovery", cat: "Pain Education", pages: "42 pages", status: "soon",
    desc: "A plain-language guide to why most back pain is not structural damage, what the evidence says about rest versus movement, and how to build a plan you can keep.",
    contents: ["Why scans often don't explain pain", "The role of load and tolerance", "A graded return-to-activity plan", "Flare-up management", "Warning signs that need a doctor"] },
  { slug: "knee-health", title: "Knee Health & Strength", sub: "For pain, stiffness and ageing joints", cat: "Joint Health", pages: "38 pages", status: "soon",
    desc: "Why quadriceps strength matters more than most people expect, how to progress safely, and what to do about stairs, squatting and swelling.",
    contents: ["Understanding knee joint changes", "Strength before everything else", "Stair and squat progressions", "Managing swelling", "When to see a surgeon"] },
  { slug: "healthy-ageing-after-45", title: "Healthy Ageing After 45", sub: "Strength, balance and independence", cat: "Healthy Ageing", pages: "54 pages", status: "soon",
    desc: "A practical guide to maintaining strength and balance through your fifties, sixties and beyond — including exercise that works and myths that don't.",
    contents: ["What changes with age, and what doesn't have to", "Strength training at any age", "Balance and falls prevention", "Home safety checklist", "Sleep, nutrition and recovery basics"] },
  { slug: "caregiver-rehabilitation", title: "Caregiver's Guide to Rehabilitation", sub: "Supporting recovery at home", cat: "Caregiver Support", pages: "46 pages", status: "soon",
    desc: "For family members supporting someone through stroke or post-operative recovery — how to assist safely, encourage independence, and avoid injury to yourself.",
    contents: ["Safe transfer techniques", "Supporting the affected arm", "Encouraging independence, not dependence", "Protecting your own back", "When to call for help"] },
  { slug: "mobility-and-exercise", title: "Mobility & Daily Exercise", sub: "A routine you will actually keep", cat: "Movement", pages: "32 pages", status: "soon",
    desc: "A short, sustainable daily movement routine for adults who sit for long periods, with clear progressions and no equipment required.",
    contents: ["The two-minute movement break", "Mobility for hips, spine and shoulders", "Building a weekly habit", "Progressions and regressions", "What to do when something hurts"] },
  { slug: "posture-and-ergonomics", title: "Posture, Desks & Screens", sub: "Practical ergonomics without the myths", cat: "Ergonomics", pages: "28 pages", status: "soon",
    desc: "Evidence-informed guidance on workstation setup, phone use and posture — including why the idea of one 'correct' posture is not supported by research.",
    contents: ["What the research actually says", "Setting up a desk properly", "Phone and laptop habits", "Movement breaks that work", "When discomfort means something more"] },
  { slug: "healthy-lifestyle-after-injury", title: "Returning to Activity After Injury", sub: "A staged approach", cat: "Rehabilitation", pages: "36 pages", status: "soon",
    desc: "How to return to walking, gym, sport or physical work after an injury without the cycle of overdoing it and starting again.",
    contents: ["Healing timelines explained", "Criteria, not calendars", "Load progression principles", "Recognising a flare versus a setback", "Building long-term resilience"] }
];

/* ================= EBOOK STORE ================= */
window.GEN.ebooks = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock, faqSchema } = lib;
  const EBOOKS = window.EBOOKS;
  const rel = "";
  const url = SITE.domain + "/ebooks.html";

  const faqs = [
    { q: "Can I buy an ebook on this website right now?", a: "Not yet. Online payment is not connected, and we will not pretend otherwise. You can register interest or order by WhatsApp, and we will send a payment link and the file manually once the title is available." },
    { q: "How will I receive the ebook?", a: "Once payment is completed, you will receive a download link by WhatsApp or email, along with an order confirmation. Files are not publicly accessible." },
    { q: "What format are the ebooks?", a: "PDF, readable on phones, tablets and computers. A larger-print version is planned for the healthy ageing titles." },
    { q: "Are the ebooks a substitute for treatment?", a: "No. They are general education, written to help you understand a condition and manage sensibly. They cannot assess your individual situation and do not replace a clinical appointment." },
    { q: "What is the refund policy?", a: "Because these are digital downloads delivered immediately, refunds are limited once the file has been accessed. If a file is faulty or you were charged in error, contact us and we will resolve it. Full details are in the refund policy." },
    { q: "Will you email me marketing messages?", a: "Only if you explicitly opt in. Registering interest for a specific title does not sign you up for anything else." }
  ];

  const cards = EBOOKS.map((b) => `
    <article class="product reveal">
      <div class="product__cover">
        <div class="product__cover-inner">
          <span class="tiny" style="letter-spacing:.16em;text-transform:uppercase;opacity:.78">Dard E Body Care</span>
          <span style="font-family:var(--font-display);font-size:clamp(1.15rem,2.2vw,1.6rem);line-height:1.12;letter-spacing:-.02em">${esc(b.title)}</span>
          <span class="tiny" style="opacity:.75">${esc(b.sub)}</span>
        </div>
      </div>
      <div class="product__meta">
        <span class="tag">${esc(b.cat)}</span>
        <h3>${esc(b.title)}</h3>
        <p class="tiny muted" style="line-height:1.55">${esc(b.desc)}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:.8rem;border-top:var(--hair)">
          <span class="pill pill--soon">Launching soon</span>
          <span class="tiny muted">${esc(b.pages)}</span>
        </div>
        <a class="btn btn--ghost btn--block" href="ebooks/${b.slug}.html" style="margin-top:.7rem">View details</a>
      </div>
    </article>`).join("");

  const html = `${head({
    title: "Health Ebooks | Dard E Body Care by Dr. Vipul Ahire",
    desc: "Practical physiotherapy ebooks on back pain, knee health, healthy ageing and caregiver support. Currently launching soon — order by WhatsApp, no online payment connected yet.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: "Dard E Body Care health ebooks",
          url: url,
          publisher: { "@id": SITE.domain + "/#clinic" }
        },
        ...EBOOKS.map((b) => ({
          "@type": "Book",
          name: b.title,
          bookFormat: "https://schema.org/EBook",
          numberOfPages: parseInt(b.pages, 10),
          description: b.desc,
          author: { "@type": "Person", name: "Dr. Vipul Ahire" },
          publisher: { "@type": "Organization", name: "Dard E Body Care" }
        })),
        JSON.parse(faqSchema(faqs))
      ]
    })
  })}
<body>
${header(rel, "ebooks", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Ebooks" }])}

  <section class="section section--tight">
    <div class="shell">
      <div style="max-width:62ch">
        <p class="eyebrow">Dard E Body Care · Digital guides</p>
        <h1 class="h-1" style="margin-top:.9rem">Health guides you can keep.</h1>
        <p class="lede" style="margin-top:1.1rem">Plain-language ebooks for patients and families — written to explain conditions honestly, without miracle claims or intimidating jargon.</p>
      </div>

      <div class="callout" style="margin-top:1.8rem;max-width:76ch">
        <span class="callout__label">Store status — please read</span>
        The ebook store is <strong>not yet processing payments</strong>. No online payment gateway is connected to this website, so nothing can be purchased here today. Titles are previewed below, and orders are handled by direct enquiry until the store goes live. We would rather tell you this plainly than show a checkout that does not work.
      </div>

      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));margin-top:2.2rem">${cards}</div>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div class="prose">
        <h2>How delivery will work when live</h2>
        <ol>
          <li><strong>Payment</strong> through a secure gateway (Razorpay or similar, subject to account approval).</li>
          <li><strong>Order confirmation</strong> shown immediately and sent by email.</li>
          <li><strong>Secure download link</strong> — time-limited and unique to your order, not a public file path.</li>
          <li><strong>Optional newsletter signup</strong>, offered separately with explicit consent.</li>
          <li><strong>Support</strong> if the link fails or the file is faulty.</li>
        </ol>

        <h2>Until then</h2>
        <p>Send us a message naming the title you are interested in. We will tell you when it is available, share a payment link at that point, and send the file manually — with a confirmation you can keep.</p>

        <div class="callout">
          <span class="callout__label">What we won't do</span>
          We will not take payment through an untested checkout, and we will not email files to unverified addresses. If a payment link looks unfamiliar, verify it by calling the clinic number published on this site.
        </div>
      </div>

      <div class="panel" style="background:var(--c-surface)">
        <h2 class="h-3">Register interest</h2>
        <p class="small muted" style="margin-top:.5rem;margin-bottom:1.2rem">Tell us which title you want and how to reach you. Consent-based; nothing else is sent.</p>

        <form class="form" data-enquiry data-form-kind="ebook-enquiry">
          <div class="field">
            <label for="eb-name">Name <span class="hint" style="display:inline">(optional)</span></label>
            <input type="text" id="eb-name" name="name" autocomplete="name">
          </div>
          <div class="field">
            <label for="eb-phone">Mobile or WhatsApp</label>
            <input type="tel" id="eb-phone" name="phone" required inputmode="tel" placeholder="10-digit mobile number">
            <span class="err">Please enter a valid number.</span>
          </div>
          <div class="field">
            <label for="eb-product">Which ebook?</label>
            <select id="eb-product" name="product" required>
              <option value="">Choose a title…</option>
              ${EBOOKS.map((b) => `<option value="${esc(b.title)}">${esc(b.title)}</option>`).join("")}
              <option value="All titles">All titles / general enquiry</option>
            </select>
            <span class="err">Please choose a title.</span>
          </div>
          <div class="field">
            <label class="check">
              <input type="checkbox" name="consent" required>
              <span>I agree to be contacted about this specific ebook. I have read the <a href="privacy-policy.html" style="text-decoration:underline">privacy policy</a>.</span>
            </label>
            <span class="err">Please confirm consent.</span>
          </div>
          <button class="btn btn--primary btn--block" type="submit">Send enquiry</button>
          <p class="tiny muted" data-form-status aria-live="polite"></p>
        </form>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell shell--narrow">
      <p class="eyebrow">Questions</p>
      <h2 class="h-2" style="margin-top:.9rem;margin-bottom:1.6rem">Ebook FAQs</h2>
      ${faqBlock(faqs, "eb")}
      <p class="tiny muted" style="margin-top:1.6rem">See also our <a href="refund-policy.html" style="text-decoration:underline">refund policy</a> and <a href="terms.html" style="text-decoration:underline">terms of use</a>.</p>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "ebooks.html", html: html };
};

/* ================= EBOOK DETAIL ================= */
window.GEN.ebookDetail = function (ctx, b) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "../";
  const url = SITE.domain + "/ebooks/" + b.slug + ".html";

  const html = `${head({
    title: `${b.title} — Ebook Preview | Dard E Body Care`,
    desc: `${b.desc} Currently launching soon — order by WhatsApp. No online payment connected.`,
    canonical: url,
    rel: rel,
    ogType: "book",
    noindex: true,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Book",
      name: b.title,
      bookFormat: "https://schema.org/EBook",
      numberOfPages: parseInt(b.pages, 10),
      description: b.desc,
      author: { "@type": "Person", name: "Dr. Vipul Ahire" },
      publisher: { "@type": "Organization", name: "Dard E Body Care" }
    })
  })}
<body>
${header(rel, "ebooks", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Ebooks", href: "ebooks.html" }, { label: b.title }])}

  <section class="section section--tight">
    <div class="shell" style="display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div class="product__cover" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-lg)">
        <div class="product__cover-inner">
          <span class="tiny" style="letter-spacing:.16em;text-transform:uppercase;opacity:.78">Dard E Body Care</span>
          <span style="font-family:var(--font-display);font-size:clamp(1.4rem,3vw,2.2rem);line-height:1.1;letter-spacing:-.02em">${esc(b.title)}</span>
          <span class="tiny" style="opacity:.75">${esc(b.sub)}</span>
        </div>
      </div>

      <div>
        <span class="tag">${esc(b.cat)}</span>
        <h1 class="h-2" style="margin-top:.7rem">${esc(b.title)}</h1>
        <p class="lede" style="margin-top:1rem">${esc(b.desc)}</p>

        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-top:1.4rem;padding-top:1.2rem;border-top:var(--hair)">
          <div><span class="tiny muted" style="display:block">Format</span><strong class="small">PDF</strong></div>
          <div><span class="tiny muted" style="display:block">Length</span><strong class="small">${esc(b.pages)}</strong></div>
          <div><span class="tiny muted" style="display:block">Language</span><strong class="small">English</strong></div>
          <div><span class="tiny muted" style="display:block">Status</span><span class="pill pill--soon">Launching soon</span></div>
        </div>

        <div class="callout" style="margin-top:1.5rem">
          <span class="callout__label">Not yet on sale online</span>
          Online payment is not connected. Register your interest or order by WhatsApp, and we will send a payment link when the title is released.
        </div>

        <div class="btn-row" style="margin-top:1.4rem">
          <a class="btn btn--wa btn--lg" href="${waLink("ebook", `Hello Dr. Vipul, I would like to enquire about the ebook "${b.title}" from Dard E Body Care.`)}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
          <a class="btn btn--ghost btn--lg" href="${rel}ebooks.html">All ebooks</a>
        </div>

        <h2 class="h-4" style="margin-top:2.2rem">What's inside</h2>
        <ul class="prose" style="margin-top:.8rem;font-size:var(--fs-sm);color:var(--c-ink-soft)">
          ${b.contents.map((c) => `<li>${esc(c)}</li>`).join("")}
        </ul>

        <p class="tiny muted" style="margin-top:1.8rem;padding-top:1.2rem;border-top:var(--hair)">General health education. Not a substitute for individual assessment. Read our <a href="${rel}medical-disclaimer.html" style="text-decoration:underline">medical disclaimer</a>.</p>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "ebooks/" + b.slug + ".html", html: html };
};

/* ================= ABOUT ================= */
window.GEN.about = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock } = lib;
  const rel = "";
  const url = SITE.domain + "/about.html";

  const html = `${head({
    title: "About Dr. Vipul Ahire (Physio) | VIP Magical Physio Clinic, Shirur",
    desc: "Dr. Vipul Ahire is a physiotherapist with approximately six years of clinical experience in Shirur, Pune District. His approach, philosophy and commitment to ethical practice.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Dr. Vipul Ahire",
      jobTitle: "Physiotherapist",
      description: "Physiotherapist with approximately six years of clinical experience, practising in Shirur, Pune District, Maharashtra.",
      url: url,
      worksFor: { "@id": SITE.domain + "/#clinic" },
      sameAs: [SITE.youtube, SITE.instagram],
      knowsAbout: ["Musculoskeletal physiotherapy", "Neurological rehabilitation", "Geriatric physiotherapy", "Post-operative rehabilitation"]
    }),
    image: SITE.domain + "/assets/img/clinic-detail.jpg"
  })}
<body>
${header(rel, "about", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "About" }])}

  <section class="section section--tight">
    <div class="shell" style="display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(1.6rem,5vw,4rem);align-items:center">
      <div>
        <p class="eyebrow">About the physiotherapist</p>
        <h1 class="h-1" style="margin-top:.9rem">Dr. Vipul Ahire<br><span class="muted" style="font-size:.5em;letter-spacing:0">(Physio)</span></h1>
        <p class="lede" style="margin-top:1.2rem">Physiotherapist, educator and the person behind Dard E Body Care — practising in Shirur, Pune District, with approximately six years of clinical experience.</p>
        <p class="small muted" style="margin-top:1rem;max-width:52ch;line-height:1.65">His work sits at an intersection that matters in a place like Shirur: the clinical reasoning of a rehabilitation practice, and the plain-language explanation that makes it usable at home. Most of what changes a patient's trajectory happens between appointments, and that only works if they understand why they are doing what they are doing.</p>

        <div class="btn-row" style="margin-top:1.6rem">
          <a class="btn btn--primary btn--lg" href="booking.html">Book an appointment<span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--wa btn--lg" href="${SITE.youtube}" target="_blank" rel="noopener">Watch on YouTube</a>
        </div>
      </div>

      <div>
        <div style="position:relative">
          <img src="assets/img/clinic-detail.jpg" alt="Consultation desk with notebook, goniometer and folded towel in the clinic" width="960" height="1280" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-lg)">
          <div class="hero__badge" style="left:-16px;bottom:24px;max-width:250px">
            <strong>~6 years</strong>
            <span>Clinical physiotherapy experience</span>
          </div>
        </div>
        <p class="tiny muted" style="margin-top:.8rem">A portrait of Dr. Vipul will be added here. This image is an illustrative clinic detail, not a photograph of a patient.</p>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(1.6rem,5vw,4rem);align-items:start">
      <div>
        <p class="eyebrow">Philosophy</p>
        <h2 class="h-2" style="margin-top:.9rem">Rehabilitation is teaching, not just treating.</h2>
      </div>
      <div class="prose">
        <p>There is a version of physiotherapy that consists of doing things to a patient twice a week and hoping. It is comfortable for everyone and it rarely works. The version practised here is less comfortable and more effective: assess carefully, explain honestly, teach the patient to do the work themselves, and then get out of the way.</p>
        <p>That means appointments are partly education. It means exercises are explained with reasons rather than instructions. And it means being willing to say "this is not improving the way I expected, let's reconsider" rather than continuing on momentum.</p>

        <h2>Why patient education matters in physiotherapy</h2>
        <p>Most musculoskeletal recovery is not decided in the clinic. It is decided in the hours a patient spends at home, at work, and asleep — the sitting, the lifting, the walking, the choices about whether to move or to rest. A physiotherapist who cannot influence those hours has limited reach.</p>
        <p>Education is how that influence happens. When someone understands why their back hurts, they stop fearing it. When they know why a knee must be loaded to strengthen, they stop avoiding stairs. When a family understands that stroke recovery requires effortful practice, they stop doing everything for the patient. Understanding changes behaviour, and behaviour changes outcomes.</p>
        <p>It also protects patients from bad advice. The internet is full of confident claims about posture, inflammation and miracle exercises. A patient who understands the reasoning can tell the difference between a useful principle and a sales pitch.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">Approach</p>
          <h2 class="h-2" style="margin-top:.9rem">How the clinic works.</h2>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">
        ${[
          ["Assessment first", "Every patient is examined. No protocol is applied before we know what we are dealing with."],
          ["Exercise-based", "Active treatment is the core. Passive measures support it; they do not replace it."],
          ["Function as the measure", "Progress is judged by what you can do — stairs, walking, sleep — not only by pain scores."],
          ["Honest about limits", "Physiotherapy is not appropriate for every condition. When it isn't, we say so and refer."],
          ["Family included", "With consent, caregivers are taught to assist safely and supervise between visits."],
          ["No manufactured trust", "No invented testimonials, ratings or statistics. The work has to speak for itself."]
        ].map(([t, d]) => `<div class="card card--flat"><h3 class="card__title" style="font-size:var(--fs-base)">${t}</h3><p class="card__body">${d}</p></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div class="prose">
        <h2>Professional background</h2>
        <p>Dr. Vipul Ahire is a qualified physiotherapist with approximately six years of clinical experience across musculoskeletal, orthopaedic, neurological and geriatric rehabilitation. His practice covers in-clinic assessment and treatment, home visits for patients who cannot travel, and online consultations where remote assessment is appropriate.</p>
        <p>Alongside clinical work, he produces patient education content under the Dard E Body Care brand — in Marathi, Hindi and English — for an audience that often has better access to health claims than to health explanation.</p>

        <div class="callout" style="margin-top:1.6rem">
          <span class="callout__label">A note on credentials</span>
          This page does not list degrees, registration numbers, memberships or hospital affiliations, because those details should be published only when they can be verified and stated precisely. They will be added here once confirmed, rather than approximated.
        </div>
      </div>

      <div class="prose">
        <h2>Clinic mission</h2>
        <p>To provide rehabilitation in Shirur that is clinically sound, honestly explained, and usable by the people who need it — including older adults, patients recovering from surgery or stroke, and the families who support them.</p>
        <p>The longer-term aim is to build a scalable education practice alongside the clinic: guides, videos and programmes that extend good rehabilitation reasoning beyond the patients who can physically attend.</p>

        <h2>Commitment to ethical practice</h2>
        <ul>
          <li>No guaranteed outcomes or fixed recovery timelines</li>
          <li>No claims that physiotherapy cures conditions it cannot cure</li>
          <li>Clear referral when medical or surgical assessment is needed</li>
          <li>Consent before involving family members in care</li>
          <li>Minimal collection of personal data, and no sale of it</li>
          <li>Transparent pricing, stated before treatment begins</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell shell--narrow center">
      <h2 class="h-2">Come and be assessed properly.</h2>
      <p class="lede mx-auto" style="margin-top:1rem">Whether it is a knee that has been troubling you for months or a parent who is unsteady on their feet, the first step is the same.</p>
      <div class="btn-row" style="justify-content:center;margin-top:1.8rem">
        <a class="btn btn--primary btn--lg" href="booking.html">Book an appointment</a>
        <a class="btn btn--wa btn--lg" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
        <a class="btn btn--ghost btn--lg" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "about.html", html: html };
};
