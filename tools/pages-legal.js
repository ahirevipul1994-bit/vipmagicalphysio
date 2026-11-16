/* Legal pages, 404 */
window.GEN = window.GEN || {};

function legalPage(ctx, opts) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/" + opts.slug + ".html";

  const html = `${head({
    title: opts.title + " | VIP Magical Physio Clinic",
    desc: opts.desc,
    canonical: url,
    schema: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: opts.title, url: url, isPartOf: { "@id": SITE.domain + "/#website" } })
  })}
<body>
${header(rel, "", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: opts.title }])}
  <section class="section section--tight">
    <div class="shell shell--narrow">
      <p class="eyebrow">${esc(opts.eyebrow || "Legal")}</p>
      <h1 class="h-2" style="margin-top:.9rem">${esc(opts.title)}</h1>
      <p class="small muted" style="margin-top:.8rem">Last updated: ${opts.updated}</p>
      <div class="prose" style="margin-top:2rem">${opts.body}</div>
      <div class="panel" style="margin-top:2.4rem">
        <p class="small"><strong>Questions about this policy?</strong></p>
        <p class="small muted" style="margin-top:.4rem">Call ${SITE.phoneDisplay} or <a href="${waLink("general")}" target="_blank" rel="noopener" style="text-decoration:underline">message the clinic on WhatsApp</a>.</p>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: opts.slug + ".html", html: html };
}

window.GEN.legal = function (ctx) {
  const out = [];

  out.push(legalPage(ctx, {
    slug: "privacy-policy",
    eyebrow: "Privacy",
    title: "Privacy policy",
    desc: "How VIP Magical Physio Clinic handles personal information submitted through this website.",
    updated: "November 2026",
    body: `
      <h2>What this policy covers</h2>
      <p>This policy explains what happens to information you provide through this website. It applies to the website only, not to records created during clinical care.</p>

      <h2>What we collect</h2>
      <p>This website is deliberately built to collect as little as possible:</p>
      <ul>
        <li><strong>Enquiry and appointment forms.</strong> Name, mobile number, optional email, appointment preferences, and an optional short reason for your visit. These are <strong>not transmitted to a server by this website</strong> as built. The form composes a WhatsApp message that you review and send yourself from your own device.</li>
        <li><strong>Local browser storage.</strong> Your appointment request draft, language preference, captured enquiry record and scroll position may be saved in your own browser so you do not lose them on refresh. This stays on your device. You can clear it at any time from the <a href="admin.html">lead console</a> or your browser settings.</li>
        <li><strong>CRM records, where enabled.</strong> If the clinic has connected a CRM endpoint, enquiry details are also sent to a private, access-controlled records system (a Google Sheet accessible only to the clinic). This is used solely to respond to your enquiry. It is never published or sold.</li>
        <li><strong>Analytics, only with consent.</strong> If you choose "Allow analytics", Google Analytics 4 records anonymised usage — pages viewed, buttons clicked, whether an enquiry form was submitted. IP addresses are anonymised. No health information is sent. If you decline, no Google script is loaded at all.</li>
        <li><strong>Third-party services.</strong> Fonts are loaded from Google Fonts. WhatsApp, YouTube, Instagram and Google Maps are linked, not embedded with tracking.</li>
      </ul>

      <h2>What we do not collect</h2>
      <ul>
        <li>We do not ask for detailed medical history, reports or images through this website.</li>
        <li>We do not store patient information in publicly accessible spreadsheets.</li>
        <li>We do not sell or rent personal information.</li>
        <li>We do not run advertising or retargeting pixels.</li>
        <li>We do not load analytics scripts before you consent.</li>
      </ul>

      <h2>Cookies and consent</h2>
      <p>This site sets no advertising cookies and no tracking cookies before consent. Your analytics choice is stored in your browser, not on a server. You can change your choice at any time by clearing this site's data in your browser settings, after which the consent banner will appear again.</p>

      <h2>How information is used</h2>
      <p>Information you send by phone or WhatsApp is used to respond to your enquiry and arrange appointments. Clinical records created during care are handled separately and confidentially, in line with professional obligations.</p>

      <h2>Consent</h2>
      <p>Forms on this site require an explicit consent checkbox before submission. Optional newsletter signup is separate and never pre-selected. You can withdraw consent at any time by contacting the clinic.</p>

      <h2>Retention</h2>
      <p>Website enquiries are kept only as long as needed to respond and follow up. Clinical records are retained in accordance with applicable professional and legal requirements.</p>

      <h2>Your rights</h2>
      <p>You may ask what information we hold about you, request correction, or request deletion where legally possible. Contact the clinic to make a request.</p>

      <h2>Security</h2>
      <p>This site is served over HTTPS. Because forms hand off to WhatsApp rather than a server, there is no web database of enquiries to breach. Messages sent by WhatsApp are governed by WhatsApp's own security and privacy terms.</p>

      <h2>Children</h2>
      <p>Enquiries for patients under 18 should be made by a parent or guardian.</p>

      <h2>Changes</h2>
      <p>This policy may be updated as services change — for example when payment or booking integrations are connected. The update date above will change accordingly.</p>
    `
  }));

  out.push(legalPage(ctx, {
    slug: "terms",
    eyebrow: "Terms",
    title: "Terms and conditions",
    desc: "Terms governing use of the VIP Magical Physio Clinic website and its enquiry, booking and ebook features.",
    updated: "November 2026",
    body: `
      <h2>Use of this website</h2>
      <p>This website provides information about physiotherapy services and general health education. By using it, you agree to these terms. If you do not agree, please do not use the site.</p>

      <h2>Not medical advice</h2>
      <p>Content here is general education, not diagnosis or treatment for your individual situation. Do not delay seeking professional advice because of something you read on this site. In an emergency, contact emergency services.</p>

      <h2>Appointments are requests</h2>
      <p>Submitting the appointment form creates a <strong>request</strong>. It does not confirm an appointment, reserve a time slot, or create a clinical relationship. An appointment exists only once the clinic has confirmed it by phone.</p>

      <h2>Fees</h2>
      <p>Fees are stated by the clinic before treatment begins. The website does not currently display or process appointment payments.</p>

      <h2>Ebooks and digital products</h2>
      <p>Ebooks listed on this site are not yet available for online purchase. When they become available, purchases will be subject to the terms presented at checkout, the refund policy, and a personal-use licence. Redistribution of paid files is not permitted.</p>

      <h2>Intellectual property</h2>
      <p>Original text, layout and design on this site belong to VIP Magical Physio Clinic. Embedded or linked YouTube videos remain the property of their creator and are not re-hosted here.</p>

      <h2>Accuracy</h2>
      <p>We aim for accuracy and review clinical content periodically. Health information changes, and we do not warrant that every statement is current or complete. Report errors to the clinic.</p>

      <h2>Third-party links</h2>
      <p>Links to YouTube, Instagram, Google Maps and payment providers are provided for convenience. We are not responsible for their content or practices.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, the clinic is not liable for loss arising from reliance on general information on this website. Nothing in these terms limits liability that cannot lawfully be limited.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, with jurisdiction in Pune District, Maharashtra.</p>
    `
  }));

  out.push(legalPage(ctx, {
    slug: "medical-disclaimer",
    eyebrow: "Disclaimer",
    title: "Medical disclaimer",
    desc: "Important information about the limits of the health education content on this website.",
    updated: "November 2026",
    body: `
      <h2>General education only</h2>
      <p>All content on this website — including service pages, articles, video descriptions and freely available guides — is general health education. It is written for a broad audience and cannot account for your individual history, examination findings or circumstances.</p>

      <h2>Not a substitute for assessment</h2>
      <p>Nothing on this site constitutes medical advice, diagnosis, or a treatment plan for you personally. Exercises described are examples, not prescriptions. Starting an exercise programme without assessment carries risk, particularly after surgery, injury or with an underlying medical condition.</p>

      <h2>No guaranteed outcomes</h2>
      <p>Physiotherapy does not cure every condition. Recovery varies between individuals, and no timeline or outcome on this site should be read as a promise. Where the site states that improvement is possible, it means possible — not certain.</p>

      <h2>When to seek urgent care</h2>
      <p>Contact emergency services or attend a hospital immediately for: chest pain or pressure; sudden breathlessness; sudden weakness or numbness, facial droop, or difficulty speaking; loss of consciousness; severe headache with fever or neck stiffness; a fall with head injury; loss of bladder or bowel control with back pain; or sudden inability to bear weight after injury.</p>

      <h2>Online consultation limits</h2>
      <p>A remote consultation cannot replace hands-on examination. Where your presentation requires in-person assessment, you will be advised to attend — and that advice should be followed.</p>

      <h2>Individual variation</h2>
      <p>Two people with the same diagnosis may need entirely different programmes. This is why the site repeatedly directs you to an assessment rather than a generic exercise list.</p>

      <h2>Content review</h2>
      <p>Clinical content is written and reviewed by Dr. Vipul Ahire (Physio). Review dates are shown on articles. Content is not automatically generated and published without professional review.</p>
    `
  }));

  out.push(legalPage(ctx, {
    slug: "refund-policy",
    eyebrow: "Policy",
    title: "Refund policy",
    desc: "Refund terms for physiotherapy appointments and Dard E Body Care digital products.",
    updated: "November 2026",
    body: `
      <h2>Appointments</h2>
      <p>Please give reasonable notice if you need to cancel or reschedule. Where an appointment is cancelled with sufficient notice, any advance paid will be adjusted to a future appointment or refunded. Where a patient does not attend without notice, the clinic may retain any advance paid to cover the reserved time.</p>
      <p>Charges for treatment already provided are not refundable.</p>

      <h2>Digital products (ebooks)</h2>
      <p>Ebooks are digital downloads delivered immediately on purchase. Because of this:</p>
      <ul>
        <li>Refunds are generally not available once a file has been downloaded and accessed.</li>
        <li>If a file is corrupted, incomplete or not as described, we will replace it or refund it in full.</li>
        <li>If you were charged in error, or charged twice, the duplicate will be refunded.</li>
        <li>If you purchased the wrong title and have not downloaded it, contact us — we will usually exchange it.</li>
      </ul>

      <h2>How to request a refund</h2>
      <p>Call ${ctx.SITE.phoneDisplay} or message the clinic with your order details and the reason for the request. Please do not send card or bank details by message.</p>

      <h2>Processing time</h2>
      <p>Approved refunds are processed through the original payment method. Timelines depend on the payment provider and your bank.</p>

      <h2>Current status</h2>
      <p>Online payment is not yet connected to this website, so no purchases can currently be completed here. This policy will apply once the store is live and will be linked at checkout.</p>
    `
  }));

  return out;
};

window.GEN.notFound = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, waLink } = lib;
  const rel = "";

  const html = `${head({
    title: "Page not found | VIP Magical Physio Clinic",
    desc: "That page could not be found.",
    noindex: true
  })}
<body>
${header(rel, "", SITE, SERVICES)}
<main id="main">
  <section class="section">
    <div class="shell shell--narrow center" style="padding-block:4rem">
      <p class="eyebrow" style="justify-content:center">Error 404</p>
      <h1 class="h-1" style="margin-top:1rem">This page has moved on.</h1>
      <p class="lede mx-auto" style="margin-top:1rem">Like a stiff joint, it needs a different approach. Try one of these instead.</p>
      <div class="btn-row" style="justify-content:center;margin-top:1.8rem">
        <a class="btn btn--primary btn--lg" href="index.html">Go to homepage</a>
        <a class="btn btn--ghost btn--lg" href="services.html">All services</a>
        <a class="btn btn--wa btn--lg" href="${waLink("general")}" target="_blank" rel="noopener">WhatsApp</a>
      </div>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:3rem;text-align:left">
        ${SERVICES.slice(0, 4).map((s) => `<a class="card" href="services/${s.slug}.html"><h2 class="card__title" style="font-size:var(--fs-base)">${s.title}</h2><span class="card__link">Read more →</span></a>`).join("")}
      </div>
    </div>
  </section>
</main>
${footer(rel, SITE, SERVICES)}`;
  return { path: "404.html", html: html };
};
