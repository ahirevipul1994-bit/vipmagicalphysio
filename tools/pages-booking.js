/* Booking, home visit, online consultation generators */
window.GEN = window.GEN || {};

/* ================= BOOKING ================= */
window.GEN.booking = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs } = lib;
  const rel = "";
  const url = SITE.domain + "/booking.html";

  const html = `${head({
    title: "Book a Physiotherapy Appointment | VIP Magical Physio Clinic, Shirur",
    desc: "Request a physiotherapy appointment in Shirur — clinic visit, home visit, online consultation or follow-up. Requests are confirmed by phone. Call 86248 60808.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Book a physiotherapy appointment",
      url: url,
      isPartOf: { "@id": SITE.domain + "/#website" }
    })
  })}
<body>
${header(rel, "booking", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Book appointment" }])}

  <section class="section section--tight">
    <div class="shell" style="display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">

      <div>
        <p class="eyebrow">Appointment request</p>
        <h1 class="h-1" style="margin-top:.9rem">Request an appointment.</h1>
        <p class="lede" style="margin-top:1.1rem">Fill in what you can and we'll come back to you with a confirmed time. Nothing is confirmed until we speak.</p>

        <div class="callout" style="margin-top:1.6rem">
          <span class="callout__label">How this works</span>
          This form does not book a slot in real time — there is no automated calendar connected. It creates a <strong>request</strong>, which we confirm by phone. Your details are not stored on a server; the form prepares a WhatsApp message for you to send.
        </div>

        <div class="panel" style="margin-top:1.4rem">
          <p class="small" style="font-weight:700;margin-bottom:.6rem">Prefer to talk?</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
            <a class="btn btn--wa" href="${waLink("general")}" data-wa="general" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <p class="tiny muted" style="margin-top:.9rem;line-height:1.55">${esc(SITE.callBefore)}</p>
        </div>

        <div class="panel" style="margin-top:1.2rem">
          <p class="small" style="font-weight:700;margin-bottom:.5rem">What to have ready</p>
          <ul class="tiny" style="color:var(--c-ink-soft);line-height:1.7;padding-left:1.1em">
            <li>Your main symptom and roughly how long it has lasted</li>
            <li>Any recent reports, scans or prescriptions</li>
            <li>A list of your current medications, if you take any</li>
            <li>Whether you prefer clinic, home visit or online</li>
            <li>Two or three times of day that usually suit you</li>
          </ul>
        </div>
      </div>

      <div class="wizard" data-wizard>
        <div class="wizard__bar">
          <div class="wizard__step" data-state="active"><b>1</b><span>Type</span></div>
          <div class="wizard__step" data-state="todo"><b>2</b><span>Date &amp; time</span></div>
          <div class="wizard__step" data-state="todo"><b>3</b><span>Your details</span></div>
          <div class="wizard__step" data-state="todo"><b>4</b><span>Review</span></div>
        </div>

        <form novalidate>
          <div class="wizard__body">

            <!-- STEP 1 -->
            <div class="wizard__pane" data-active="true">
              <h2 class="h-4" style="margin-bottom:.3rem">What kind of appointment?</h2>
              <p class="small muted" style="margin-bottom:1.1rem">Choose the option that fits best. You can change this when we speak.</p>

              <div class="field">
                <div class="radio-cards">
                  <label class="radio-card">
                    <input type="radio" name="type" value="clinic" required checked>
                    <span><strong>Clinic visit</strong><span>In-person assessment and treatment at the clinic in Shirur.</span></span>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="type" value="home">
                    <span><strong>Home visit</strong><span>For patients who cannot travel easily. Coverage confirmed by phone.</span></span>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="type" value="online">
                    <span><strong>Online consultation</strong><span>Video consultation, where remote assessment is appropriate.</span></span>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="type" value="followup">
                    <span><strong>Follow-up appointment</strong><span>For existing patients continuing a rehabilitation programme.</span></span>
                  </label>
                </div>
                <span class="err">Please choose an appointment type.</span>
              </div>

              <div class="field" style="margin-top:1.2rem">
                <div class="radio-cards">
                  <label class="radio-card">
                    <input type="radio" name="patientType" value="new" required checked>
                    <span><strong>New patient</strong><span>First appointment.</span></span>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="patientType" value="existing">
                    <span><strong>Existing patient</strong><span>I have been seen before.</span></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- STEP 2 -->
            <div class="wizard__pane">
              <h2 class="h-4" style="margin-bottom:.3rem">When would suit you?</h2>
              <p class="small muted" style="margin-bottom:1.1rem">This is a <strong>preference</strong>, not a live availability calendar. We will confirm the actual time by phone.</p>

              <div class="field">
                <label for="date">Preferred date</label>
                <input type="date" id="date" name="date" required>
                <span class="hint">Choose a date at least one day ahead.</span>
                <span class="err">Please choose a date.</span>
              </div>

              <div class="field" style="margin-top:1.1rem">
                <span class="label">Preferred time of day</span>
                <input type="hidden" name="time" value="morning">
                <div class="slot-grid">
                  <button type="button" class="slot" data-value="morning" aria-pressed="true">Morning</button>
                  <button type="button" class="slot" data-value="midday" aria-pressed="false">Midday</button>
                  <button type="button" class="slot" data-value="afternoon" aria-pressed="false">Afternoon</button>
                  <button type="button" class="slot" data-value="evening" aria-pressed="false">Evening</button>
                  <button type="button" class="slot" data-value="any" aria-pressed="false">Any time</button>
                </div>
                <span class="hint">We will offer the closest available slot to your preference.</span>
              </div>

              <div class="field" style="margin-top:1.1rem">
                <label for="location">Area or location <span class="hint" style="display:inline">(for home visits)</span></label>
                <input type="text" id="location" name="location" placeholder="e.g. Shirur town, near the bus stand" autocomplete="address-level2">
              </div>
            </div>

            <!-- STEP 3 -->
            <div class="wizard__pane">
              <h2 class="h-4" style="margin-bottom:.3rem">Your details</h2>
              <p class="small muted" style="margin-bottom:1.1rem">We only ask for what we need to arrange the appointment.</p>

              <div class="field">
                <label for="name">Full name</label>
                <input type="text" id="name" name="name" required autocomplete="name">
                <span class="err">Please enter your name.</span>
              </div>

              <div class="field" style="margin-top:1rem">
                <label for="phone">Mobile number</label>
                <input type="tel" id="phone" name="phone" required inputmode="tel" autocomplete="tel" placeholder="10-digit mobile number">
                <span class="hint">Used only to confirm the appointment.</span>
                <span class="err">Please enter a valid 10-digit mobile number.</span>
              </div>

              <div class="field" style="margin-top:1rem">
                <label for="email">Email <span class="hint" style="display:inline">(optional)</span></label>
                <input type="email" id="email" name="email" autocomplete="email">
                <span class="err">Please check the email address.</span>
              </div>

              <div class="field" style="margin-top:1rem">
                <label for="reason">Brief reason <span class="hint" style="display:inline">(optional)</span></label>
                <textarea id="reason" name="reason" rows="3" placeholder="For example: lower back pain for three weeks, worse when sitting."></textarea>
                <span class="hint">Keep it short — we will take a full history at the appointment. Please do not include sensitive medical details here.</span>
              </div>

              <div class="field" style="margin-top:1.3rem">
                <label class="check">
                  <input type="checkbox" name="consent" required>
                  <span>I agree to be contacted about this request, and I understand this is an appointment <strong>request</strong> that will be confirmed by phone. I have read the <a href="privacy-policy.html" style="text-decoration:underline">privacy policy</a>.</span>
                </label>
                <span class="err">Please confirm you agree to be contacted.</span>
              </div>
            </div>

            <!-- STEP 4 -->
            <div class="wizard__pane">
              <h2 class="h-4" style="margin-bottom:.3rem">Review your request</h2>
              <p class="small muted" style="margin-bottom:1.1rem">Check the details, then send. Nothing is confirmed until we speak.</p>

              <dl style="margin:0;border-top:var(--hair)" data-review></dl>

              <div class="callout" style="margin-top:1.3rem">
                <span class="callout__label">Privacy</span>
                This form does not send your details to a server. When you submit, your request is saved only in this browser and a WhatsApp message is prepared for you to review and send yourself.
              </div>

              <button class="btn btn--primary btn--lg btn--block" type="submit" style="margin-top:1.2rem">Send appointment request</button>
            </div>

            <!-- DONE -->
            <div data-wiz-done style="display:none">
              <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:.6rem">
                <span class="pill pill--soon">Status: requested</span>
              </div>
              <h2 class="h-3" style="margin-bottom:.6rem">Your request is ready.</h2>
              <p class="small muted" style="line-height:1.6;margin-bottom:1.1rem">Send it on WhatsApp so we receive it immediately, or call the clinic. We will confirm a time once we have checked availability.</p>

              <div class="btn-row">
                <a class="btn btn--wa btn--lg" data-wiz-wa href="#" target="_blank" rel="noopener">Send on WhatsApp</a>
                <a class="btn btn--ghost btn--lg" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
              </div>

              <details style="margin-top:1.6rem">
                <summary class="small" style="cursor:pointer;font-weight:700">Developer: view request payload</summary>
                <p class="tiny muted" style="margin:.6rem 0">This JSON is the shape a future backend endpoint should accept. It is currently stored in localStorage only.</p>
                <pre data-payload class="mono" style="background:var(--c-bg-2);padding:1rem;border-radius:var(--radius);overflow:auto;font-size:.7rem;line-height:1.5"></pre>
                <button type="button" class="btn btn--ghost" data-copy-payload style="margin-top:.6rem">Copy JSON</button>
              </details>
            </div>

          </div>

          <div class="wizard__foot">
            <button type="button" class="btn btn--ghost" data-wiz-prev style="visibility:hidden">← Back</button>
            <button type="button" class="btn btn--primary" data-wiz-next>Continue →</button>
          </div>
        </form>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell shell--narrow center">
      <h2 class="h-3">What happens after you send</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-top:1.6rem;text-align:left">
        <div><span class="tag">1</span><p class="small" style="margin-top:.4rem"><strong>We receive it</strong><br>Your WhatsApp message arrives directly with the clinic.</p></div>
        <div><span class="tag">2</span><p class="small" style="margin-top:.4rem"><strong>We call you</strong><br>Usually the same working day, to confirm a time and check a few details.</p></div>
        <div><span class="tag">3</span><p class="small" style="margin-top:.4rem"><strong>You're confirmed</strong><br>Only then is the appointment booked. No automated confirmation is implied.</p></div>
      </div>
      <div class="grid" style="grid-template-columns:1fr;margin-top:1.2rem;text-align:left">
        <div><span class="tag">4</span><p class="small" style="margin-top:.4rem"><strong>At the visit</strong><br>Assessment, explanation and a plan you can follow.</p></div>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "booking.html", html: html };
};

/* ================= HOME VISIT ================= */
window.GEN.homeVisit = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock, faqSchema } = lib;
  const rel = "";
  const url = SITE.domain + "/home-visit.html";

  const faqs = [
    { q: "Which areas do you cover for home visits?", a: "Home visits are offered in Shirur and the immediately surrounding areas. Because we do not want to promise coverage we cannot keep, please call or message with your exact location and we will confirm honestly whether we can reach you." },
    { q: "How long does a home visit take?", a: "Similar to a clinic appointment — usually around 45 minutes for a first assessment, including time to look at your home environment and involve family members if appropriate." },
    { q: "Do I need to prepare anything at home?", a: "A clear space about the size of a yoga mat, good lighting, and a firm chair with arms. That is usually enough. If you have a walking aid, keep it nearby." },
    { q: "Is a home visit more expensive?", a: "Home visits carry a travel component, so they are priced differently from clinic appointments. Please call for current charges — we will tell you clearly before you commit." },
    { q: "Can family members be present?", a: "Yes, with the patient's consent, and it is often valuable. Caregivers can learn safe assistance techniques and how to supervise exercises between visits." },
    { q: "What if the patient is recovering from surgery?", a: "Home visits are particularly useful in the first weeks after joint replacement or other surgery, when travel is difficult. We work within your surgeon's protocol and any movement restrictions." }
  ];

  const areas = ["Shirur town", "Areas within Shirur city limits", "Nearby areas — confirmed by phone"];

  const html = `${head({
    title: "Home Visit Physiotherapy in Shirur | Professional Physiotherapy at Your Home",
    desc: "Physiotherapy at home in Shirur for older adults, post-operative patients and anyone who cannot travel. Assessment, rehabilitation and caregiver guidance. Call 86248 60808.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Home visit physiotherapy",
          serviceType: "Physiotherapy home visit",
          provider: { "@id": SITE.domain + "/#clinic" },
          areaServed: { "@type": "City", name: "Shirur" },
          url: url
        },
        JSON.parse(faqSchema(faqs))
      ]
    }),
    image: SITE.domain + "/assets/img/svc-homevisit.jpg"
  })}
<body>
${header(rel, "homevisit", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Home visit physiotherapy" }])}

  <section class="hero" style="padding-block:clamp(1.5rem,3vw,2.5rem) var(--section-y)">
    <div class="shell hero__grid">
      <div class="hero__copy">
        <p class="eyebrow">Home visit physiotherapy</p>
        <h1 style="margin-top:.9rem">Professional physiotherapy<br><em>at your home.</em></h1>
        <p class="hero__sub" style="margin-top:1.1rem">For people who cannot easily travel to a clinic — older adults, patients recovering from surgery or stroke, and families who need guidance on safe assistance at home.</p>
        <div class="btn-row" style="margin-top:1.6rem">
          <a class="btn btn--primary btn--lg" href="#request">Request a home visit<span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--wa btn--lg" href="${waLink("home")}" data-wa="home" target="_blank" rel="noopener">WhatsApp enquiry</a>
        </div>
        <div class="callout" style="margin-top:1.6rem;max-width:46ch">
          <span class="callout__label">Coverage</span>
          Home visits are offered in Shirur and the immediately surrounding areas. Please confirm your location by phone before booking — we will not accept a visit we cannot properly reach.
        </div>
      </div>
      <div class="hero__media">
        <img class="hero__img" src="assets/img/svc-homevisit.jpg" alt="Physiotherapy bag, treatment mat and resistance bands set up in a patient's living room" width="1344" height="896" style="aspect-ratio:4/3.4" fetchpriority="high">
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">Who it suits</p>
          <h2 class="h-2" style="margin-top:.9rem">Rehabilitation where the difficulty actually happens.</h2>
          <p class="lede" style="margin-top:.8rem">A clinic can assess a knee. Only your home can show us the stairs, the bathroom door, the height of your bed. That is the argument for a home visit.</p>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">
        ${[
          ["Older adults", "Where travelling is tiring, painful or requires someone to accompany them."],
          ["Post-operative patients", "The first weeks after joint replacement or fracture surgery, when travel is difficult."],
          ["Stroke rehabilitation", "Where the home environment and caregiver involvement are central to progress."],
          ["Mobility limitations", "When leaving the house is a significant undertaking rather than a short trip."],
          ["Caregiver-supported care", "When family members need to learn safe assistance techniques."],
          ["Home safety concerns", "When stairs, bathroom access or falls risk need assessing in place."]
        ].map(([t, d]) => `<div class="card card--flat"><h3 class="card__title" style="font-size:var(--fs-base)">${t}</h3><p class="card__body">${d}</p></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell" style="display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div class="prose">
        <h2>How a home visit works</h2>
        <p>It follows the same clinical logic as a clinic appointment, adapted to your space.</p>
        <ol>
          <li><strong>Conversation.</strong> History, current difficulties, medications, and what you want to get back to doing.</li>
          <li><strong>Examination.</strong> Movement, strength and function — using your own chair, bed and stairs where relevant.</li>
          <li><strong>Environment review.</strong> Stairs, bathroom access, lighting, flooring and any trip hazards.</li>
          <li><strong>Plan and teaching.</strong> A short programme, demonstrated and practised with you, and with a family member if you wish.</li>
          <li><strong>Review.</strong> A clear point at which we check progress and adjust.</li>
        </ol>

        <h2>What to prepare</h2>
        <ul>
          <li>A clear space roughly the size of a yoga mat</li>
          <li>Good lighting, and a firm chair with arms</li>
          <li>Any walking aid, brace or equipment you already use</li>
          <li>Recent reports or prescriptions, if you have them</li>
          <li>A family member present, if you would like support</li>
          <li>Pets settled in another room</li>
        </ul>

        <h2>Safety at home</h2>
        <p>Home rehabilitation is safe when it is set up properly. We check that the working area is clear, the lighting is adequate and support is within reach before any standing exercise begins. If a task is not safe to practise at home yet, we will say so and work on the components first.</p>

        <div class="callout callout--alert">
          <span class="callout__label">Important</span>
          A home visit is not an emergency service. For chest pain, breathlessness, sudden weakness, difficulty speaking or a suspected fracture, call emergency services or attend a hospital — do not wait for a physiotherapy visit.
        </div>
      </div>

      <aside style="position:sticky;top:96px;display:grid;gap:1rem">
        <div class="panel">
          <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Service area</p>
          <ul style="list-style:none;padding:0;margin:.8rem 0 0;display:grid;gap:.6rem;font-size:var(--fs-sm)">
            ${areas.map((a) => `<li style="display:flex;gap:.6rem;align-items:flex-start"><span class="pulse-dot" style="margin-top:.5em" aria-hidden="true"></span><span>${esc(a)}</span></li>`).join("")}
          </ul>
          <p class="tiny muted" style="margin-top:1rem;line-height:1.55">We do not list specific villages or towns we cannot confirm. Please call with your location.</p>
        </div>
        <div class="panel panel--ink">
          <p class="small"><strong>Coverage check</strong></p>
          <p class="tiny" style="margin-top:.5rem;opacity:.8;line-height:1.55">Message your area and we'll confirm the same day.</p>
          <a class="btn btn--accent btn--block" href="${waLink("home")}" data-wa="home" target="_blank" rel="noopener" style="margin-top:.9rem">WhatsApp your area</a>
        </div>
      </aside>
    </div>
  </section>

  <section class="section" id="request" style="background:var(--c-bg-2)">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div>
        <p class="eyebrow">Request a visit</p>
        <h2 class="h-2" style="margin-top:.9rem">Tell us about the patient and the location.</h2>
        <p class="lede" style="margin-top:1rem">We will confirm coverage and a time by phone. This is a request, not a confirmed booking.</p>
        <div class="callout" style="margin-top:1.4rem">
          <span class="callout__label">Privacy</span>
          This form prepares a WhatsApp message. Nothing is stored on a server and no medical history is collected here.
        </div>
        <div class="btn-row" style="margin-top:1.4rem">
          <a class="btn btn--primary" href="tel:${SITE.phoneIntl}">Call ${SITE.phoneDisplay}</a>
          <a class="btn btn--wa" href="${waLink("home")}" data-wa="home" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>

      <form class="form" data-enquiry data-form-kind="home-visit" style="background:var(--c-surface);border:var(--hair);border-radius:var(--radius-lg);padding:clamp(1.2rem,3vw,2rem);box-shadow:var(--shadow-md)">
        <div class="field">
          <label for="hv-name">Patient or family name</label>
          <input type="text" id="hv-name" name="name" required autocomplete="name">
          <span class="err">Please enter a name.</span>
        </div>
        <div class="field">
          <label for="hv-phone">Mobile number</label>
          <input type="tel" id="hv-phone" name="phone" required inputmode="tel" autocomplete="tel" placeholder="10-digit mobile number">
          <span class="err">Please enter a valid 10-digit number.</span>
        </div>
        <div class="field">
          <label for="hv-area">Area / location</label>
          <input type="text" id="hv-area" name="location" required placeholder="e.g. Shirur town, near the market">
          <span class="hint">We will confirm whether the visit is possible.</span>
          <span class="err">Please tell us the area.</span>
        </div>
        <div class="field">
          <label for="hv-reason">Main difficulty <span class="hint" style="display:inline">(optional)</span></label>
          <textarea id="hv-reason" name="reason" rows="3" placeholder="e.g. Cannot manage stairs after knee replacement; mother is 74 and unsteady."></textarea>
        </div>
        <div class="field">
          <label class="check">
            <input type="checkbox" name="consent" required>
            <span>I agree to be contacted about this request and have read the <a href="privacy-policy.html" style="text-decoration:underline">privacy policy</a>.</span>
          </label>
          <span class="err">Please confirm you agree to be contacted.</span>
        </div>
        <button class="btn btn--primary btn--lg btn--block" type="submit">Request home visit</button>
        <p class="tiny muted" data-form-status aria-live="polite"></p>
      </form>
    </div>
  </section>

  <section class="section">
    <div class="shell shell--narrow">
      <p class="eyebrow">Questions</p>
      <h2 class="h-2" style="margin-top:.9rem;margin-bottom:1.6rem">Home visit FAQs</h2>
      ${faqBlock(faqs, "hv")}
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary btn--lg" href="#request">Request a home visit</a>
        <a class="btn btn--wa btn--lg" href="${waLink("home")}" data-wa="home" target="_blank" rel="noopener">WhatsApp enquiry</a>
      </div>
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "home-visit.html", html: html };
};

/* ================= ONLINE CONSULTATION ================= */
window.GEN.online = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc, waLink, crumbs, faqBlock, faqSchema } = lib;
  const rel = "";
  const url = SITE.domain + "/online-consultation.html";

  const faqs = [
    { q: "Is an online consultation as good as an in-person assessment?", a: "For some problems and for follow-up reviews, it is comparable and far more convenient. For others — particularly where hands-on testing or subtle neurological assessment is needed — it is not a substitute. We will tell you clearly which situation applies to you." },
    { q: "What do I need for the call?", a: "A private space, a stable internet connection, a chair, enough room to take a few steps, and comfortable clothing. Have any reports or scans to hand." },
    { q: "What platform do you use?", a: "A standard video call on a platform that works for both sides, confirmed at the time of booking. You will not need to install anything unusual." },
    { q: "Can I get a prescription from an online consultation?", a: "No. Physiotherapists do not prescribe medication, and a remote consultation cannot issue medical prescriptions. If medication is needed, you will be advised to see a doctor." },
    { q: "Is my information private?", a: "Consultations are not recorded, and medical details are not stored on this website. Please use a private space for the call and avoid sharing sensitive information by email or public messaging." },
    { q: "When would you insist on an in-person visit?", a: "Where the diagnosis depends on hands-on testing, where symptoms are severe or rapidly changing, where neurological signs need examination, or where the problem has not responded to remote guidance." }
  ];

  const steps = [
    ["Choose a consultation type", "Initial assessment, follow-up, or exercise programme review."],
    ["Select a preferred time", "You propose; we confirm. There is no live calendar behind this page."],
    ["Send your details", "Name, mobile, and a short description of the problem."],
    ["Receive confirmation", "We confirm the slot and send joining instructions by phone or WhatsApp."],
    ["Attend the consultation", "Video call, with movement observation and demonstration."],
    ["Receive follow-up guidance", "A written summary with your exercises and review point."]
  ];

  const html = `${head({
    title: "Online Physiotherapy Consultation | Physiotherapy Guidance From Anywhere",
    desc: "Online physiotherapy consultation with Dr. Vipul Ahire — video assessment, exercise guidance and follow-up, with clear limits on what remote care can and cannot do.",
    canonical: url,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Service", name: "Online physiotherapy consultation", serviceType: "Teleconsultation", provider: { "@id": SITE.domain + "/#clinic" }, url: url },
        JSON.parse(faqSchema(faqs))
      ]
    }),
    image: SITE.domain + "/assets/img/svc-online.jpg"
  })}
<body>
${header(rel, "online", SITE, SERVICES)}

<main id="main">
  ${crumbs(rel, [{ label: "Home", href: "index.html" }, { label: "Online consultation" }])}

  <section class="section section--tight">
    <div class="shell" style="display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:center">
      <div>
        <p class="eyebrow">Teleconsultation</p>
        <h1 class="h-1" style="margin-top:.9rem">Physiotherapy guidance<br>from anywhere.</h1>
        <p class="lede" style="margin-top:1.1rem">A structured video consultation for assessment, exercise guidance and follow-up — with honest limits about what can and cannot be assessed on a screen.</p>
        <div class="btn-row" style="margin-top:1.6rem">
          <a class="btn btn--primary btn--lg" href="booking.html?type=online">Request a consultation<span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--wa btn--lg" href="${waLink("online")}" data-wa="online" target="_blank" rel="noopener">WhatsApp enquiry</a>
        </div>
        <div class="callout callout--alert" style="margin-top:1.6rem">
          <span class="callout__label">Not for emergencies</span>
          Online consultation is not a substitute for emergency care or necessary in-person assessment. For chest pain, breathlessness, sudden weakness, facial droop or difficulty speaking, call emergency services.
        </div>
      </div>
      <img src="assets/img/svc-online.jpg" alt="Laptop on a desk showing a physiotherapy video consultation with a resistance band beside it" width="1344" height="896" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-md)">
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell">
      <div class="sec-head">
        <div class="sec-head__text">
          <p class="eyebrow">Who may benefit</p>
          <h2 class="h-2" style="margin-top:.9rem">Good for some things. Honest about the rest.</h2>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:clamp(1.2rem,3vw,2.4rem)">
        <div class="panel" style="background:var(--c-surface)">
          <p class="tag" style="color:var(--c-ok)">Well suited to remote care</p>
          <ul style="margin-top:.9rem;font-size:var(--fs-sm);line-height:1.6;color:var(--c-ink-soft)">
            <li>Follow-up reviews of an existing programme</li>
            <li>Exercise progression and technique correction</li>
            <li>Self-management advice for stable, long-standing problems</li>
            <li>Guidance before deciding whether to travel for assessment</li>
            <li>Continuity while travelling or away from Shirur</li>
            <li>Patients who cannot attend in person for practical reasons</li>
          </ul>
        </div>
        <div class="panel" style="background:var(--c-surface)">
          <p class="tag" style="color:var(--c-alert)">Needs in-person assessment</p>
          <ul style="margin-top:.9rem;font-size:var(--fs-sm);line-height:1.6;color:var(--c-ink-soft)">
            <li>Problems where hands-on testing is needed to diagnose</li>
            <li>Neurological symptoms needing examination</li>
            <li>Severe, rapidly worsening or unexplained pain</li>
            <li>Post-operative reviews requiring wound or swelling assessment</li>
            <li>Suspected fracture, dislocation or significant injury</li>
            <li>Any situation where the video call cannot show us enough</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell" style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.6rem,4vw,3.5rem);align-items:start">
      <div class="prose">
        <h2>How online consultation works</h2>
        ${faqBlock === undefined ? "" : ""}
        <ol>
          ${steps.map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${esc(d)}</li>`).join("")}
        </ol>

        <h2>What to prepare</h2>
        <ul>
          <li>A private room and a stable connection</li>
          <li>Comfortable clothing you can move in</li>
          <li>A chair, and space to take a few steps</li>
          <li>Any reports, scans or prescriptions</li>
          <li>A wall or sturdy furniture within reach for balance tests</li>
          <li>A family member, if you would like support</li>
        </ul>

        <h2>How exercise demonstration works</h2>
        <p>We demonstrate each exercise on camera, then watch you perform it from two angles where the room allows. Most bodyweight and household-object exercises can be taught effectively this way. Where an exercise cannot be performed safely without hands-on setup, we will leave it out and say why.</p>

        <h2>Limitations, stated plainly</h2>
        <p>We cannot palpate tissue, test joint play, assess subtle strength differences by hand, or examine reflexes and sensation reliably. These are real limits, not formalities. When your presentation depends on them, the correct advice is an in-person appointment — and that is what you will get.</p>

        <h2>Consent and privacy</h2>
        <p>Consent is required before a consultation, and is recorded in the booking request. Consultations are not recorded. Medical details are not stored on this website; the booking form prepares a WhatsApp message for you to send. Please avoid sharing sensitive medical information over unsecured channels.</p>
      </div>

      <aside style="display:grid;gap:1rem;position:sticky;top:96px">
          <div class="panel panel--ink">
            <p class="small"><strong>Book an online consultation</strong></p>
            <p class="tiny" style="margin-top:.5rem;opacity:.8;line-height:1.55">Choose the appointment type "Online consultation" in the booking request form.</p>
            <a class="btn btn--accent btn--block" href="booking.html?type=online" style="margin-top:.9rem">Request consultation</a>
            <a class="btn btn--ghost btn--block" href="${waLink("online")}" data-wa="online" target="_blank" rel="noopener" style="margin-top:.5rem;color:#fff;border-color:rgba(255,255,255,.3)">WhatsApp first</a>
          </div>
          <div class="panel">
            <p class="tiny" style="font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft)">Follow-up options</p>
            <ul style="list-style:none;padding:0;margin:.8rem 0 0;display:grid;gap:.7rem;font-size:var(--fs-sm);color:var(--c-ink-soft)">
              <li><strong style="color:var(--c-ink)">Programme review</strong><br>Shorter call to progress exercises.</li>
              <li><strong style="color:var(--c-ink)">Form check</strong><br>Review technique on specific movements.</li>
              <li><strong style="color:var(--c-ink)">Transition to in-person</strong><br>If remote care is not enough.</li>
            </ul>
          </div>
      </aside>
    </div>
  </section>

  <section class="section" style="background:var(--c-bg-2)">
    <div class="shell shell--narrow">
      <p class="eyebrow">Questions</p>
      <h2 class="h-2" style="margin-top:.9rem;margin-bottom:1.6rem">Online consultation FAQs</h2>
      ${faqBlock(faqs, "on")}
    </div>
  </section>
</main>

${footer(rel, SITE, SERVICES)}`;
  return { path: "online-consultation.html", html: html };
};
