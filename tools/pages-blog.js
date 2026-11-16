/* Resources, Blog index, Article, Legal, 404 */
window.GEN = window.GEN || {};

/* ================= RESOURCES ================= */
window.GEN.resources = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/resources.html";

  const guides = [
    { t: "Back Pain Education PDF", d: "What most back pain is, what it is not, and how to start moving safely again.", tag: "Back Pain", pages: "8 pages" },
    { t: "Knee Exercise Safety Guide", d: "Which knee exercises are appropriate at which stage, and the warning signs to stop.", tag: "Knee", pages: "6 pages" },
    { t: "Older Adult Mobility Checklist", d: "A simple self-check of strength, balance and daily function for adults over 60.", tag: "Older Adults", pages: "4 pages" },
    { t: "Home Safety Checklist", d: "Room-by-room hazard review for reducing falls risk at home.", tag: "Falls", pages: "5 pages" },
    { t: "Caregiver Stroke Rehabilitation Guide", d: "Safe assistance techniques and practical guidance for families after stroke.", tag: "Stroke", pages: "10 pages" },
    { t: "Desk Ergonomics Checklist", d: "A one-page workstation review you can complete in five minutes.", tag: "Ergonomics", pages: "3 pages" }
  ];

  const cards = guides.map((g, i) => `
    <article class="card reveal" style="gap:.7rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <span class="tag">${esc(g.tag)}</span>
        <span class="tiny muted">${esc(g.pages)}</span>
      </div>
      <h2 class="card__title" style="font-size:var(--fs-base)">${esc(g.t)}</h2>
      <p class="card__body">${esc(g.d)}</p>
      <button class="btn btn--ghost btn--block" type="button" data-request-guide="${esc(g.t)}" style="margin-top:auto">Request this guide</button>
    </article>`).join("");

  const html = `${head({
    title: "Free Physiotherapy Health Resources | VIP Magical Physio Clinic",
    desc: "Free downloadable health guides — back pain education, knee exercise safety, older adult mobility, home safety and caregiver rehabilitation checklists.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Free health resources",
      url: url,
      publisher: { "@id": SITE.domain + "/#clinic" }
    })
  })}
<body>
${header(rel, "resources", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Free resources" }])}

  <section class="section section--tight">
    <div class="shell">
      <div style="max-width:62ch">
        <p class="eyebrow">Free resources</p>
        <h1 class="h-1" style="margin-top:.9rem">Guides worth keeping.</h1>
        <p class="lede" style="margin-top:1.1rem">Practical checklists and explanations, free to request. Consent-based — we send the guide you asked for, and nothing else unless you choose to hear more.</p>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell grid" style="grid-template-columns:1.3fr .7fr;gap:clamp(1.6rem,4vw,3rem);align-items:start">
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">${cards}</div>

      <aside class="panel" style="position:sticky;top:96px;background:var(--c-surface);border:var(--hair);box-shadow:var(--shadow-md)">
        <h2 class="h-3">Request a guide</h2>
        <p class="small muted" style="margin-top:.5rem;margin-bottom:1.1rem;line-height:1.55">Tell us which guide and how to send it. We will deliver it by WhatsApp.</p>

        <form class="form" data-enquiry data-form-kind="guide-request">
          <div class="field">
            <label for="r-name">Name <span class="hint" style="display:inline">(optional)</span></label>
            <input type="text" id="r-name" name="name" autocomplete="name">
          </div>
          <div class="field">
            <label for="r-phone">WhatsApp or mobile</label>
            <input type="tel" id="r-phone" name="phone" required inputmode="tel" placeholder="10-digit mobile number">
            <span class="err">Please enter a valid number.</span>
          </div>
          <div class="field">
            <label for="r-guide">Guide requested</label>
            <select id="r-guide" name="product" required>
              <option value="">Choose a guide…</option>
              ${guides.map((g) => `<option value="${esc(g.t)}">${esc(g.t)}</option>`).join("")}
            </select>
            <span class="err">Please choose a guide.</span>
          </div>
          <div class="field">
            <label class="check">
              <input type="checkbox" name="consent_resource" required>
              <span>Send me this specific resource only. I have read the <a href="privacy-policy.html" style="text-decoration:underline">privacy policy</a>.</span>
            </label>
            <span class="err">Please confirm consent.</span>
          </div>
          <div class="field" style="padding:.8rem;background:var(--c-bg-2);border-radius:var(--radius-sm)">
            <label class="check" style="font-size:var(--fs-xs)">
              <input type="checkbox" name="newsletter" data-label="Yes — join newsletter">
              <span><strong>Optional:</strong> I would also like occasional physiotherapy education emails. You can unsubscribe at any time.</span>
            </label>
          </div>
          <button class="btn btn--primary btn--block" type="submit">Request guide</button>
          <p class="tiny muted" data-form-status aria-live="polite"></p>
        </form>

        <p class="tiny muted" style="margin-top:1rem;line-height:1.5">Note: delivery of these guides is currently manual. Links will be sent by WhatsApp once prepared.</p>
      </aside>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "resources.html", html: html };
};

/* ================= BLOG INDEX ================= */
window.GEN.blog = function (ctx) {
  const { lib, SITE, SERVICES, ARTICLES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/blog.html";

  const cats = ["All", "Back Pain", "Knee Pain", "Stroke", "Older Adults", "Ergonomics", "Post-operative", "Rehabilitation", "Neck Pain", "Getting Started"];

  const cards = ARTICLES.map((a) => `
    <article class="card reveal" data-tags="${esc(a.category)}" style="gap:.55rem">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="tag">${esc(a.category)}</span>
        <span class="tiny muted">${a.readMins} min read</span>
      </div>
      <h2 class="card__title" style="font-size:var(--fs-md)"><a href="blog/${a.slug}.html">${esc(a.title)}</a></h2>
      <p class="card__body">${esc(a.excerpt)}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:.8rem;border-top:var(--hair)">
        <time class="tiny muted" datetime="${a.date}">${new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
        <a class="card__link" href="blog/${a.slug}.html">Read →</a>
      </div>
    </article>`).join("");

  const html = `${head({
    title: "Physiotherapy Articles & Health Education | VIP Magical Physio Clinic",
    desc: "Original, clinically responsible articles on back pain, knee pain, stroke rehabilitation, healthy ageing, posture and post-operative recovery — by Dr. Vipul Ahire.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Physiotherapy education",
      url: url,
      publisher: { "@id": SITE.domain + "/#clinic" },
      blogPost: ARTICLES.map((a) => ({
        "@type": "BlogPosting",
        headline: a.title,
        url: SITE.domain + "/blog/" + a.slug + ".html",
        datePublished: a.date,
        dateModified: a.updated,
        author: { "@type": "Person", name: "Dr. Vipul Ahire" }
      }))
    })
  })}
<body>
${header(rel, "learn", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Articles" }])}

  <section class="section section--tight">
    <div class="shell">
      <div style="max-width:62ch">
        <p class="eyebrow">Health education</p>
        <h1 class="h-1" style="margin-top:.9rem">Understanding the problem is half the treatment.</h1>
        <p class="lede" style="margin-top:1.1rem">Original articles, written for patients rather than clinicians. Every one includes the warning signs that mean you should stop reading and see a doctor.</p>
      </div>

      <div class="panel panel--support" style="margin-top:1.8rem;max-width:76ch">
        <p class="small" style="line-height:1.6"><strong>Editorial note.</strong> These articles are written and reviewed by Dr. Vipul Ahire. They are general education only — not diagnosis, and not a substitute for individual assessment. Publication and review dates are shown on each article.</p>
      </div>

      <div class="chip-row" data-filter-group="#blog-grid" style="margin-top:1.8rem">
        ${cats.map((c, i) => `<button class="chip" data-filter="${c === "All" ? "all" : esc(c)}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(c)}</button>`).join("")}
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell">
      <div class="grid" id="blog-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">${cards}</div>
      <p data-empty style="display:none" class="muted center" style="padding:2rem 0">No articles in this category yet.</p>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell shell--narrow center">
      <h2 class="h-3">Reading is useful. Assessment is better.</h2>
      <p class="lede mx-auto" style="margin-top:.9rem">If an article describes your situation, the next step is a proper examination.</p>
      <div class="btn-row" style="justify-content:center;margin-top:1.5rem">
        <a class="btn btn--primary btn--lg" href="booking.html">Book an appointment</a>
        <a class="btn btn--wa btn--lg" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp enquiry</a>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "blog.html", html: html };
};

/* ================= ARTICLE ================= */
window.GEN.article = function (ctx, a) {
  const { lib, SITE, SERVICES, ARTICLES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock, faqSchema } = lib;
  const rel = "../";
  const url = SITE.domain + "/blog/" + a.slug + ".html";
  const svc = SERVICES.find((s) => s.slug === a.service);

  const bodyHtml = a.body.map((b) => {
    if (b.t === "p") return `<p>${esc(b.v)}</p>`;
    if (b.t === "h2") return `<h2>${esc(b.v)}</h2>`;
    if (b.t === "h3") return `<h3>${esc(b.v)}</h3>`;
    if (b.t === "quote") return `<blockquote>${esc(b.v)}</blockquote>`;
    if (b.t === "note") return `<div class="callout"><span class="callout__label">A note on this article</span>${esc(b.v)}</div>`;
    if (b.t === "ul") return `<ul>${b.v.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    if (b.t === "ol") return `<ol>${b.v.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`;
    return "";
  }).join("");

  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3).map((x) => `
    <a class="card" href="${x.slug}.html">
      <span class="tag">${esc(x.category)}</span>
      <h3 class="card__title" style="font-size:var(--fs-base);margin-top:.4rem">${esc(x.title)}</h3>
      <span class="card__link">Read →</span>
    </a>`).join("");

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: a.title,
        description: a.excerpt,
        url: url,
        datePublished: a.date,
        dateModified: a.updated,
        inLanguage: "en-IN",
        author: { "@type": "Person", name: "Dr. Vipul Ahire", jobTitle: "Physiotherapist", url: SITE.domain + "/about.html" },
        publisher: { "@id": SITE.domain + "/#clinic" },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: a.category,
        wordCount: a.body.reduce((n, b) => n + (Array.isArray(b.v) ? b.v.join(" ") : b.v).split(/\s+/).length, 0)
      },
      ...(a.faqs ? [JSON.parse(faqSchema(a.faqs))] : [])
    ]
  });

  const html = `${head({
    title: `${a.title} | Dr. Vipul Ahire`,
    desc: a.excerpt.slice(0, 158),
    canonical: url,
    rel: rel,
    ogType: "article",
    schema: schema
  })}
<body>
${header(rel, "learn", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [
    { label: "Home", href: "index.html" },
    { label: "Articles", href: "blog.html" },
    { label: a.category, href: "blog.html" },
    { label: a.title }
  ])}

  <article>
    <section class="section section--tight">
      <div class="shell" style="display:grid;grid-template-columns:1fr 300px;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
        <div>
          <span class="tag">${esc(a.category)}</span>
          <h1 class="h-2" style="margin-top:.7rem;max-width:24ch">${esc(a.title)}</h1>
          <p class="lede" style="margin-top:1.1rem">${esc(a.excerpt)}</p>

          <div class="art__meta" style="margin-top:1.4rem;padding-top:1.2rem;border-top:var(--hair)">
            <span>By <strong>Dr. Vipul Ahire (Physio)</strong></span>
            <span aria-hidden="true">·</span>
            <span>Published <time datetime="${a.date}">${new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time></span>
            <span aria-hidden="true">·</span>
            <span>Reviewed <time datetime="${a.updated}">${new Date(a.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time></span>
            <span aria-hidden="true">·</span>
            <span>${a.readMins} min read</span>
          </div>

          <div class="prose" style="margin-top:2rem">${bodyHtml}</div>

          ${a.faqs ? `<div style="margin-top:2.6rem"><h2 class="h-3" style="margin-bottom:1rem">Questions</h2>${faqBlock(a.faqs, a.slug)}</div>` : ""}

          <div class="panel panel--ink" style="margin-top:2.6rem">
            <h2 class="h-3">If this sounds like you</h2>
            <p class="small" style="margin-top:.6rem;opacity:.85;line-height:1.6">Reading helps you understand. An assessment tells you what is actually happening. Both are worth having.</p>
            <div class="btn-row" style="margin-top:1.2rem">
              <a class="btn btn--accent" href="${rel}booking.html">Book an appointment</a>
              <a class="btn btn--ghost" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener" style="color:#fff;border-color:rgba(255,255,255,.35)">WhatsApp</a>
            </div>
          </div>

          <p class="tiny muted" style="margin-top:2rem;padding-top:1.2rem;border-top:var(--hair)">This article is general health education and does not replace individual medical assessment, diagnosis or treatment. Read our <a href="${rel}medical-disclaimer.html" style="text-decoration:underline">full medical disclaimer</a>.</p>

          <div style="margin-top:1.6rem">
            <p class="tiny muted" style="letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:.6rem">Share</p>
            <div class="btn-row">
              <a class="btn btn--ghost" href="https://wa.me/?text=${encodeURIComponent(a.title + " — " + url)}" target="_blank" rel="noopener">WhatsApp</a>
              <a class="btn btn--ghost" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener">Facebook</a>
              <button class="btn btn--ghost" type="button" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent='Link copied'">Copy link</button>
            </div>
          </div>
        </div>

        <aside style="position:sticky;top:96px;display:grid;gap:1rem">
          ${svc ? `<div class="panel">
            <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Related service</p>
            <p class="small" style="margin-top:.6rem"><strong>${esc(svc.title)}</strong></p>
            <p class="tiny muted" style="margin-top:.4rem;line-height:1.5">${esc(svc.card)}</p>
            <a class="card__link" href="${rel}services/${svc.slug}.html" style="margin-top:.7rem;display:block">Read the service page →</a>
          </div>` : ""}
          <div class="panel">
            <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Related reading</p>
            ${related}
          </div>
          <div class="panel panel--support">
            <p class="small"><strong>Free guides</strong></p>
            <p class="tiny muted" style="margin-top:.4rem;line-height:1.5">Downloadable checklists on back pain, knee safety and home hazards.</p>
            <a class="card__link" href="${rel}resources.html" style="margin-top:.6rem;display:block">Browse resources →</a>
          </div>
        </aside>
      </div>
    </section>
  </article>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "blog/" + a.slug + ".html", html: html };
};
