# Handoff: VIP Magical Physio Clinic — Website Platform

**Feature folder:** `design_handoff_physio_website/`
**Owner:** Dr. Vipul Ahire (Physio) · Shirur, Pune District, Maharashtra, India
**Prepared:** 16 November 2026
**Fidelity: HIGH-FIDELITY (hifi)** — final colours, typography, spacing and interactions. Recreate pixel-accurately.

---

## 1. Overview

A complete, production-intent marketing and lead-generation website for a single-practitioner physiotherapy clinic. 47 pre-rendered pages. It is not a brochure — it is a patient acquisition and education platform with four commercial jobs:

1. **Convert** — appointment requests, home-visit enquiries, online consultations
2. **Rank** — local SEO for "physiotherapist in Shirur" + Pune District
3. **Educate** — 12 service pages, 10 articles, a video library, free guides
4. **Sell later** — a digital ebook store (currently honest about not being live)

**Core constraint that shaped every decision:** the audience is Marathi/Hindi-speaking Indian patients aged 30–76, many with limited English and limited digital confidence. Large type, 52px tap targets, plain language, WhatsApp-first contact, and no manipulative urgency.

**Second core constraint:** no fabricated trust. No invented star ratings, no fake testimonials, no "guaranteed recovery", no implied payments. Where an integration is not live, the UI says so in plain words. **Preserve this.** It is the brand positioning, not a placeholder to be "fixed".

---

## 2. About the design files

> **The files in this bundle are design references created in HTML — prototypes showing intended look and behaviour. They are not production code to copy directly.**

The task is to **recreate these designs in your target codebase's existing environment** (React/Next, Vue/Nuxt, Astro, SwiftUI, Flutter, or whatever the project already uses), using its established patterns, component library and routing — or, if no environment exists yet, choose the most appropriate framework and implement there.

Specifically, do **not** ship the HTML as-is. Instead:

- Port the CSS custom properties in `design-system/tokens.css` into your theming layer (CSS vars, Tailwind config, or a theme object).
- Rebuild the components described in §5 as your framework's components.
- Re-implement the content model in §7 as structured data or CMS entries.
- Keep the runtime JS in `runtime/` as behavioural **specification** — read it to understand logic, do not import it into a React app wholesale.

### Recommended target stack (if none exists)
**Next.js (App Router) + TypeScript + CSS Modules or Tailwind.** Rationale: 47 content pages need static generation for SEO and Core Web Vitals; the site is content-heavy but low-interactivity; SSG keeps the whole thing deployable to any static host and keeps the clinical content crawlable server-side.

### Critical architectural note: pre-rendering is non-negotiable
Every page must ship **complete HTML in the initial response**. The originals are generated at build time (`tools/build.js`) precisely so that all 47 pages are crawlable and instant. Do not convert this to a client-rendered SPA — you would lose the entire SEO foundation and the local-search strategy with it.

---

## 3. Fidelity

**High-fidelity.** Colours, type scales, spacing, radii, shadows and interaction timings are final and documented to the pixel in §5 and §8. Copy is final except for items flagged `[ADD ...]` (§10).

Deviations are only acceptable where the target codebase's platform demands them (e.g. a native gesture replacing a hover state on mobile).

---

## 4. Design direction — two built themes

The design ships **two complete visual directions sharing one component layer**. Both are fully implemented; the user hasn't picked one yet.

| | **A — "Clinical Calm"** (default) | **B — "Warm Editorial"** |
|---|---|---|
| Intent | Safe, authoritative, institutional confidence | Distinctive, memorable, warmer |
| Ink | `#0B2239` navy | `#1C1512` near-black brown |
| Primary | `#0B2239` navy | `#8A3B2C` terracotta |
| Support/accent | `#0B6E63` teal | `#2F5D4E` deep green |
| Accent 2 | `#B96F16` marigold | `#C4881F` gold |
| Page bg | `#FBFAF7` warm paper | `#F6F0E4` cream |
| Surface | `#FFFFFF` | `#FDFAF2` |
| Display font | Newsreader (serif, 400) | Bitter (slab, 600) |
| Body font | Public Sans | Karla |
| Radius scale | 6 / 4 / 14px | 3 / 2 / 8px |
| Signature detail | Sharp corners, hairline rules, restrained | Full round brand mark, arched hero image, tighter tracking |

Implementation: theme is selected via `data-theme="a"` or `data-theme="b"` on `<html>`, with all values as CSS custom properties. A `Tweaks` panel (see §6.9) toggles it live. **Pick one direction for production** — do not ship a theme switcher to patients.

---

## 5. Screens / views

Layout is built on a `1240px` max shell with fluid gutters `clamp(1.15rem, 4vw, 2.75rem)`. Sections use vertical rhythm `clamp(3.5rem, 6vw, 7rem)`.

### 5.1 Global header (all pages)

Two stacked bars.

**Utility bar** — `background: var(--c-primary)`, text `var(--c-on-primary)`, `font-size: 13px`, min-height `42px`, letter-spacing `0.01em`.
- Left: "Please call before visiting — appointments are booked in advance."
- Right: phone link, WhatsApp link, clinic area. Right links: opacity `.9`, hover `1` + underline.
- Below 980px the left text hides and the row centres.

**Main bar** — sticky `top: 0`, `z-index: 90`, background `color-mix(in srgb, var(--c-bg) 88%, transparent)`, `backdrop-filter: saturate(1.4) blur(14px)`, `border-bottom: 1px solid var(--c-line)`. Min-height `78px`. On scroll `>12px`, `data-stuck="true"` adds `box-shadow: 0 8px 26px -20px rgba(0,0,0,.4)`.

- **Brand** — mark `42×42px`, `background: var(--c-primary)`, radius `var(--radius)`, letter "V" in display font 1.05rem/600. Text stack: "VIP Magical Physio" (display 1.06rem, tracking `-0.02em`) over "DR. VIPUL AHIRE · SHIRUR" (11px, uppercase, tracking `0.13em`, `var(--c-ink-soft)`). Gap `0.7rem`.
- **Nav** — links 15px/600, colour `var(--c-ink-2)`, padding `.6rem .7rem`, radius `var(--radius-sm)`. Hover: `var(--c-primary)` text + `var(--c-bg-2)` bg. Active page: 2px `var(--c-support)` underline inset `.7rem` from each side, positioned `.28rem` from bottom.
- **Services mega-menu** — opens on hover and on click, `760px` wide (`min(760px, 90vw)`), centred, `top: calc(100% + 6px)`, surface bg, radius `var(--radius-lg)`, `box-shadow: var(--shadow-lg)`, padding `1.5rem`, 2-column grid. Enter animation `pop .18s` from `opacity:0; translateY(-6px)`. Closes on `Escape` and on focus-out.
- **Language switch** — pill container `border: 1px solid var(--c-line)`, three buttons EN / मराठी / हिन्दी, `.38rem .6rem` padding, 12px/700. Active: `var(--c-primary)` bg, `var(--c-on-primary)` text, min-height `34px`.
- **Primary CTA** — "Book appointment", see §5.2.
- **Burger** — hidden ≥980px. `46×46px`, hairline border, three 20×2px bars. Open state rotates bars into an X (`translateY(7px) rotate(45deg)` / middle `opacity:0` / `translateY(-7px) rotate(-45deg)`), `.22s var(--ease)`.

### 5.2 Buttons (`.btn`)

```
min-height: 52px (var(--tap)); padding: .85rem 1.6rem;
border-radius: 999px; font: 700 15px/1 var(--font-body);
border: 1.5px solid transparent; cursor: pointer;
transition: transform .18s var(--ease), box-shadow .22s var(--ease),
            background-color .18s, color .18s;
```
- Hover: `translateY(-1.5px)` + `var(--shadow-md)`.
- Active: `translateY(0)` + `var(--shadow-sm)`.
- `.btn__arrow` child shifts `translateX(3px)` on hover.
- **Variants:** `--primary` (primary bg / on-primary text) · `--accent` (support bg, white) · `--wa` (`#1E7D5A` bg, white — WhatsApp green, used only for WhatsApp) · `--ghost` (transparent, 1px `var(--c-line)` border) · `--quiet` (text link, 44px min, underline `0.25em` offset) · `--lg` (60px min, 17px text, `1rem 2.1rem`) · `--block` (100% width).
- Disabled: `opacity: .45`, no transform/shadow.

### 5.3 Homepage — `/` (`reference-pages/01-home.html`)

Ten stacked sections. Order is user-tweakable (§6.9) but default is as listed.

**(1) Hero** — 2-col grid `1.08fr / .92fr`, gap `clamp(1.6rem, 4vw, 3.6rem)`, vertically centred, padding-block `clamp(2.6rem, 5vw, 5.2rem)` → `var(--section-y)`.
- Eyebrow: "PHYSIOTHERAPY · SHIRUR, PUNE DISTRICT" — 13px/700, uppercase, tracking `0.16em`, `var(--c-support)`, with a 26×1px rule before it at `opacity:.55`.
- H1: `clamp(2.9rem, 1.4rem + 6vw, 5.6rem)`, `line-height: .98`, tracking `-0.03em`. Two lines: "Move better." / *"Live better."* — second line in `<em>`, italic, `var(--c-support)`.
- Sub: 1.1875rem, `var(--c-ink-soft)`, max `44ch`, line-height `1.55`.
- Liveness row: 7px `var(--c-ok)` dot with a `pulse 2.6s` ring animation + "Clinic visits, home visits and online consultation", 15px.
- CTA row: primary "Book physiotherapy appointment →" + `--wa` "WhatsApp enquiry". Below: a `--quiet` "Explore home visit services →".
- Stats strip: 3 items across, `border-top: 1px solid var(--c-line)`, padding-top `1.5rem`. Value in display font 1.65rem; label 13px `var(--c-ink-soft)` max `18ch`. Content: "6 yrs / Clinical physiotherapy experience", "1:1 / Individual assessment, every visit", "3 / Ways to be seen — clinic, home, online".
- Hero image: `aspect-ratio: 4/5`, `object-fit: cover`, radius `var(--radius-lg)`, `var(--shadow-lg)`. **Theme B** changes it to `aspect-ratio: 3/4.2` with `border-radius: 200px 200px var(--radius-lg) var(--radius-lg)` (arch).
- Floating badge over image, bottom-left offset `-14px`: surface bg, hairline, padding `.85rem 1.1rem`, `var(--shadow-md)`, max `250px`. Content: **"Dr. Vipul Ahire"** (display 1.5rem) / "(Physio) · Assessment-led, exercise and education-based rehabilitation" (13px).
- **Below 980px:** grid collapses to 1 col; image moves to `order: -1`, `max-width: 480px`, `aspect-ratio: 16/11`; badge moves bottom-right.

**(2) Marquee strip** — `background: var(--c-primary)`, padding-block `1.05rem`. Infinite horizontal scroll `slide 42s linear infinite` translating `-50%`; content duplicated twice for a seamless loop. Items: 13px/700 uppercase, tracking `0.14em`, `opacity:.92`, separated by `✳` at `.55` opacity. 8 service phrases. `aria-hidden="true"`.

**(3) Trust** — 2-col `1fr / 1.15fr`. Left: eyebrow "WHO YOU'LL BE SEEING", H2 "Care that starts with listening, not a template.", lede about Dr. Vipul, then a `panel--support` box with the anti-fabrication note. Right: `trust-list`, `auto-fit minmax(220px,1fr)`, 6 numbered items — number is a 28px circle, `1.5px solid` current colour, display font. **Full copy for all 6 is in `content/data.js` and `01-home.html`.**

**(4) Services** — `background: var(--c-bg-2)`. Section header left (eyebrow + H2 + lede) with a `--ghost` "All 12 services →" button right-aligned to the baseline. Grid `repeat(auto-fill, minmax(276px, 1fr))`, gap `1rem`. **12 cards**, each: 16:10 image (`object-fit: cover`, scales to `1.035` over `.5s` on card hover), then inner padding `1.5rem` containing title (display 1.3125rem), 2-line body, a `card__who` line prefixed **"Who it may help:"** with `border-top` hairline, and a "Learn more →" link in `var(--c-support)` that widens its gap on hover. Card lifts `translateY(-3px)` + `var(--shadow-md)` on hover.

**(5) How it works** — 4 `card--flat` columns, `auto-fit minmax(240px,1fr)`. Each is borderless with a `2px solid var(--c-ink)` top border, no radius, padding `1rem 0`. Tag ("STEP ONE") + title + body. Copy: Assessment / Your plan / Review / Referral.

**(6) Learn** — `background: var(--c-bg-2)`. 2-col `1.1fr / .9fr`. Left: 4 article rows (`.art`) — each with meta line (category tag, date, "N min read" separated by `·`), title 1.1875rem/700, excerpt 13px. Right: 3 video cards with a 16:9 thumb placeholder (`linear-gradient(135deg, var(--c-primary), var(--c-support))`), 54px white circular play button whose triangle is a CSS border trick, a duration pill bottom-right, and a "Watch on YouTube →" link. Below: a panel for free guides.

**(7) Ebooks** — 2-col, text left / 2×2 cover grid right. Covers are *typographic* (no images): `aspect-ratio: 3/4`, `background: var(--c-primary)` alternating with `var(--c-support)`, an inset `1px solid rgba(255,255,255,.4)` frame, and a `repeating-linear-gradient` diagonal texture overlay. Inside: "DARD E BODY CARE" micro-label, title in display font, "Coming soon". Includes the honest store-status callout.

**(8) Appointment band** — full `panel--ink`: primary bg, padding `clamp(1.8rem, 5vw, 4rem)`, radius `var(--radius-lg)`. 2-col: left has eyebrow in `var(--c-accent)`, H1-scale "Call before you come.", lede, and two CTAs (accent "Call 86248 60808" + ghost outlined in `rgba(255,255,255,.35)`). Right: three stacked bordered tiles for Clinic visit / Home visit / Online, each `1px solid rgba(255,255,255,.2)`.

**(9) Footer** — see §5.14.

### 5.4 Service detail — `/services/back-pain-physiotherapy` (`02-service-detail.html`)

Template for all 12 service pages. Structure, in order:

1. **Breadcrumb** — 13px, `·`-free, `/` separators, current page `var(--c-ink)` 600.
2. **Page hero** (`phero`) — `background: linear-gradient(180deg, var(--c-bg-2), var(--c-bg))`, `border-bottom` hairline. 2-col `1.25fr / .75fr`, bottom-aligned. Eyebrow "PHYSIOTHERAPY SERVICE", H1 `clamp(2.5rem, 1.5rem + 4.3vw, 4.4rem)` at `line-height: 1.02`, lede, CTA row, then a **meta row** (`border-top` hairline, 4 items) reading Clinic / Home visits / Online / Reviewed date. Right: 16:10 image, radius `var(--radius-lg)`, `var(--shadow-md)`.
3. **Body** — 2-col `1fr / 320px`, gap `clamp(1.6rem, 4vw, 3.5rem)`. Main column is `.prose` (max `66ch`).
   - **Opens with a red-flag callout** (`callout--alert`): `border-left: 3px solid var(--c-alert)`, `background: var(--c-alert-soft)`, label "SEEK MEDICAL CARE FIRST IF" in 13px/700 uppercase. **This is the most important element on the page and must come first** — it is the credibility signal.
   - Then H2 sections: What this means · Common functional difficulties · When physiotherapy assessment may help · What an assessment may include · General rehabilitation principles · Exercises and education · a `callout` for Safety precautions · Warning signs requiring medical evaluation (in an alert callout) · FAQ accordion · Next steps CTA row · a small "reviewed by" footnote.
   - **Sticky sidebar** (`top: 96px`): "On this page" jump nav (the red-flag link is coloured `var(--c-alert)`), an ink panel with "Not sure if physiotherapy is right for you?" + call button, and a related-reading panel.
4. **Related services** — `background: var(--c-bg-2)`, 3 cards.

### 5.5 Booking wizard — `/booking` (`03-booking-wizard.html`)

**The most complex component. Read `runtime/site.js` → `initWizard()` for exact logic.**

Layout: 2-col `0.9fr / 1.1fr`. Left is persuasion + expectation-setting; right is the wizard.

- Left: eyebrow, H1 "Request an appointment.", lede, a `callout` explaining **the form does not book in real time**, a "Prefer to talk?" panel with call + WhatsApp, and a "What to have ready" panel (5 bullets).
- Wizard shell: surface bg, hairline, radius `var(--radius-lg)`, `var(--shadow-md)`, `overflow: hidden`.
  - **Step bar** — `background: var(--c-bg-2)`, padding `.5rem`, 4 equal steps. Each: 21px circular numeral + label. States: `todo` (soft ink) / `active` (`var(--c-primary)` text, surface bg, `var(--shadow-sm)`) / `done` (`var(--c-ok)`, numeral becomes a filled check). Below 720px labels hide, numerals enlarge to 24px.
  - **Panes** — 4, only the active one is `display: block` with a `fadeUp .28s` entry.
    - **Step 1 Type** — two `radio-cards` groups. Card: `1.5px solid var(--c-line)`, radius `var(--radius)`, padding `.9rem 1rem`, min-height `60px`, 20px native radio accent-primary. `:has(input:checked)` → border primary + `inset 0 0 0 1px var(--c-primary)` + bg `var(--c-bg-2)`. Options: Clinic visit / Home visit / Online consultation / Follow-up; then New patient / Existing patient.
    - **Step 2 Date & time** — `<input type="date">` with `min` = tomorrow, default = tomorrow. Time preference is a **hidden input plus 5 buttons** (Morning / Midday / Afternoon / Evening / Any time) in a `repeat(auto-fill, minmax(96px,1fr))` grid. Buttons `aria-pressed="true"` → primary bg. Plus an optional "Area or location" text input (for home visits).
    - **Step 3 Details** — Full name (required), Mobile (required, tel, min 10 digits), Email (optional), Brief reason (optional textarea with a note not to include sensitive medical detail), and a **required consent checkbox** with a link to the privacy policy.
    - **Step 4 Review** — a `<dl>` populated at runtime with 8 rows (type, date, time, name, mobile, email, patient type, reason) + a privacy callout + the submit button.
  - **Footer** — "← Back" (hidden on step 1 via `visibility`) and "Continue →". **On the final step the Continue button hides entirely** (`display: none`) because the pane contains its own submit.
  - **Validation** — advancing runs `paneValid(idx)`: any `[required]` empty → `aria-invalid="true"` on the input, `data-error="true"` on the `.field` wrapper, `.err` message revealed, focus moves to the first invalid input. Radio groups require at least one checked. Phone must have ≥10 digits. Email is regex-checked only when non-empty. Typing into an invalid field clears the error immediately.
  - **Success state** — hiding each pane individually (not the body!), plus the step bar and footer, then revealing `[data-wiz-done]`. Shows a `pill--soon` reading **"Status: requested"**, H3 "Your request is ready.", an explanatory paragraph, then "Send on WhatsApp" (`--wa`, href built from the payload) and "Call 86248 60808" (`--ghost`), and a `<details>` disclosure titled "Developer: view request payload" containing pretty-printed JSON and a Copy JSON button.
- Below the wizard: a 3-up "What happens after you send" explainer (We receive it / We call you / You're confirmed) plus a full-width 4th step (At the visit).

**Never** show a "confirmed" state. The only status vocabulary is `REQUESTED`.

### 5.6 Home visit landing — `/home-visit` (`04-home-visit-landing.html`)

Hero 2-col with image `aspect-ratio: 4/3.4`; headline uses `<em>` on "at your home."; a coverage callout sits under the CTAs. Then: a 6-card "who it suits" grid (`card--flat`), a 2-col body (prose + sticky sidebar) covering "How a home visit works" (5-step ordered list), "What to prepare" (6 bullets) and "Safety at home", with an **emergency-not-a-home-visit** alert callout. Then an `id="request"` section: 2-col, persuasion left, enquiry form right (name, mobile, area — required; reason; consent). Then a 6-item FAQ.

### 5.7 Online consultation — `/online-consultation` (`05-online-consultation.html`)

Hero 2-col with a red-flag "Not for emergencies" callout. Then a notable pattern: **two opposed panels side by side** — "Well suited to remote care" (green tag, 6 bullets) vs "Needs in-person assessment" (alert tag, 6 bullets). This honest-limits pairing is the centrepiece; keep it. Then a 6-step "how it works" ordered list, "What to prepare", "How exercise demonstration works", "Limitations, stated plainly", "Consent and privacy", and a sticky aside with booking + follow-up options. Then 6 FAQs.

### 5.8 Ebook store — `/ebooks` (`06-ebook-store.html`)

- Intro + a **prominent honest status callout**: the store is not processing payments.
- Grid `auto-fill minmax(240px,1fr)` of 7 products. Each: typographic cover (3/4, primary bg, inset frame, diagonal texture) → meta block with category tag, title (display), description, a footer row with a `pill--soon` "Launching soon" + page count, and a "View details" ghost button.
- Then 2-col: "How delivery will work when live" (5-step list) + "What we won't do" callout on the left; a "Register interest" form on the right (name optional, mobile required, title select required, consent required).
- Then 6 FAQs + links to refund policy and terms.
- Detail pages (`/ebooks/[slug]`) are 2-col cover + detail, and are **`noindex`** until the store is live.

### 5.9 About — `/about` (`07-about.html`)

Hero 2-col: bio left, clinic still-life image right with a "~6 years" floating badge and a caption noting it is an illustrative detail, not a patient. Then "Philosophy" 2-col with a substantial **"Why Patient Education Matters in Physiotherapy"** subsection (4 paragraphs). Then a 6-card approach grid. Then 2-col: "Professional background" (with an explicit note that degrees/registrations are withheld until verifiable) and "Clinic mission" + "Commitment to ethical practice" (6 bullets). Centred closing CTA.

### 5.10 Contact — `/contact` (`08-contact.html`)

2-col. Left: H1 "Talk to the clinic.", lede, two large tappable contact cards (phone + WhatsApp, each with a 48px circular icon), an address panel with `[ADD CLINIC ADDRESS]` and `[ADD CLINIC HOURS]` placeholders, and an ink "Please call before visiting" panel. Right: a **Maps placeholder** — 4:3 box with `repeating-linear-gradient(45deg, ...)` hatching, monospace `[ GOOGLE MAPS EMBED ]` label, explanatory text, and an "Open in Google Maps" button — plus a service-area panel, a `[data-gbp]` **reviews panel** (§6.8), and a follow panel. Then a 2-col enquiry form section.

### 5.11 FAQ — `/faq` (`09-faq.html`)

Intro, a chip row of 8 category anchors, then 8 grouped accordions (Physiotherapy, Home visits, Online consultation, Appointment booking, Rehabilitation, Ebook purchase, Payments, Digital downloads) — 3–5 questions each. Ends with an ink "Still unanswered?" panel.

### 5.12 Blog index + article (`10-blog-index.html`, `11-article.html`)

**Index:** intro + editorial-note panel, 10 filter chips (`data-filter-group`), card grid `auto-fill minmax(280px,1fr)`. Filtering hides `[data-tags]` cards whose tag doesn't match and reveals a `[data-empty]` message when zero match.

**Article:** breadcrumb, category tag, H2-scale title (max `24ch`), lede, byline row (author / published / reviewed / read time), prose body, optional FAQ block, an ink "If this sounds like you" CTA panel, disclaimer footnote, a share row (WhatsApp / Facebook / Copy link), and a sticky aside with related service, related reading and free guides.

### 5.13 Videos & resources (`12-video-library.html`, `13-resources.html`)

**Videos:** intro 2-col with a YouTube subscribe ink panel, an honesty callout that titles are placeholders, 11 filter chips, and a 12-card grid. Cards are `<a>` to the channel with a gradient thumb + play button + duration.
**Resources:** 6 guide cards each with a "Request this guide" button, plus a sticky request form aside (name optional, WhatsApp required, guide select required, consent required, **optional separate newsletter opt-in**).

### 5.14 Footer (all pages)

`background: var(--c-primary)`, text `var(--c-on-primary)`, `margin-top: 5rem`. Links at `opacity:.82`, hover `1` + underline.

- 4-col grid `1.5fr 1fr 1fr 1.2fr`, gap `2rem`, padding-block `4rem` → `2.5rem`.
- Col 1: brand mark inverted (on-primary bg, primary text) + promise line + "Educational brand: **Dard E Body Care**".
- Col 2 "Services": 5 service links + "All services →".
- Col 3 "Clinic": 6 links.
- Col 4 "Contact": phone in display font 1.35rem, address, hours, then WhatsApp + YouTube buttons, then YouTube/Instagram text links.
- **Medical disclaimer** paragraph, `opacity:.62`, max `80ch`, separator above.
- Legal bar: `border-top: 1px solid rgba(255,255,255,.16)`, 13px at `opacity:.72`, © line left, 5 legal links right.
- Below 1080px → 3 cols with contact spanning; below 720px → 2 cols; below 460px → 1 col.

### 5.15 Floating actions & sticky mobile bar

- `.float` — fixed bottom-right, `z-index: 100`, column, `gap: .6rem`, aligned end. Two pills: WhatsApp (`#1E7D5A`, shadow `0 12px 30px -10px rgba(30,125,90,.6)`) and Call (primary). Each `54px` min-height, `999px` radius, icon + label. **Hidden below 720px** (replaced by the sticky bar) and **hidden entirely on pages containing a wizard or form** (`body:has(...)`) so they never cover inputs.
- `.sticky-bar` — fixed bottom, hidden ≥720px. Surface with `blur(12px)`, hairline top, two equal buttons (WhatsApp / Book appointment), padding accounts for `env(safe-area-inset-bottom)`. Body gets `padding-bottom: 68px`.

---

## 6. Interactions & behaviour

### 6.1 Easing & motion
Single easing curve: `--ease: cubic-bezier(.22,.61,.36,1)`.
- Button: `transform .18s`, `box-shadow .22s`.
- Card hover lift: `translateY(-3px)`, `.24s`.
- Card image zoom: `scale(1.035)`, `.5s`.
- Accordion: `grid-template-rows 0fr → 1fr`, `.3s` (the modern height-less technique — do not use max-height).
- Reveal on scroll: `opacity 0→1`, `translateY(14px)→0`, `.45s`.
- `prefers-reduced-motion: reduce` → all durations forced to `.001ms`, reveals render immediately, smooth scroll disabled.

### 6.2 Scroll reveal — with a hard safety net
Elements marked `.reveal` start hidden **only after** JS confirms support (`html.js-ready` class). An `IntersectionObserver` (`rootMargin: 0px 0px -4% 0px`, `threshold: 0.02`) reveals them. **Two guarantees you must replicate:**
1. If `IntersectionObserver` is missing or reduced-motion is on → reveal everything immediately.
2. A `450ms` timer force-reveals anything still unseen using a no-transition class, plus a `load`-event sweep.

Rationale: on a medical site, content invisible because of a JS failure is a critical bug, not a cosmetic one. Do not implement reveal in a way that can strand content at `opacity: 0`.

### 6.3 Accordion
`aria-expanded` on the button, `aria-controls` → panel id, panel `role="region"` + `aria-labelledby`. Open via `data-open="true"` on `.acc__item`. The `+`/`−` indicator is two 1.6px pseudo-element bars; the vertical one rotates 90°→0° when open. First item opens by default.

### 6.4 Forms — WhatsApp handoff (the core pattern)
**No backend for enquiries.** On valid submit:
1. `readPayload(form)` collects all named fields (checkbox/radio map to their `data-label`).
2. `buildWaFromForm(payload)` composes a human-readable, line-per-field message.
3. Save a copy to `localStorage` (`px_last_enquiry`).
4. Pass to CRM capture (§7.3).
5. Set the status node text to "Opening WhatsApp… Your message is ready to review and send. Nothing has been sent automatically."
6. `window.open("https://wa.me/918624860808?text=" + encodeURIComponent(msg), "_blank", "noopener")`.

Prefilled messages are intent-specific (`clinic`, `home`, `online`, `ebook`, `general`) and contain `____` blanks for the patient to complete — deliberately short and friendly.

**If you move to a real backend**, keep the WhatsApp path as a fallback; it is what makes the site work with zero infrastructure.

### 6.5 Booking wizard state
- Persisted to `localStorage` key `px_booking_draft_v1` as `{ idx, values, at }` on every navigation and every input change.
- On load, restores field values and the current step index (if 1..n-1).
- Submitted requests append to `px_requests` (last 10 kept).
- Payload contract (§7.3) is the integration point.

### 6.6 Language switching
`applyLang(lang)` sets `<html lang>`, swaps every `[data-i18n]` node from `window.PX_I18N[lang]`, and persists to `px_lang`. If the dictionary value contains `<`, it is written via `innerHTML` (values are trusted static strings, enabling `<br>` and `<em>` in headlines); otherwise `textContent`. `data-i18n-attr="placeholder"` writes to an attribute instead.

**Scope is interface strings only** — nav, CTAs, form labels, key headings. Clinical body copy stays English pending clinician-reviewed translation. Preserve that boundary.

### 6.7 Devanagari typography (must not be skipped)
`html[lang="mr"]`/`[lang="hi"]` need different display metrics than Latin:
- Hero H1: `clamp(1.95rem, 1rem + 4.2vw, 3.75rem)`, `line-height: 1.16`, `letter-spacing: 0`, `text-wrap: balance`.
- `.h-1`/`.h-2`: `letter-spacing: 0`, `line-height: 1.24`.
- `<em>` rendered `font-style: normal` (Devanagari has no italic tradition).
- Body `line-height: 1.7`.

Without this, compounded words orphan onto their own line at display sizes. Verified fix: a 2-line headline measuring 124px = 2 × 61.9px line-height.

### 6.8 Google Business Profile panel (`[data-gbp]`, `runtime/gbp.js`)
Renders one of two states:
- **Verified:** real `rating` + `reviewCount` from config → stars (`.gbp__stars .star[data-on]`), `X.X / 5`, "N Google reviews", "Read reviews on Google" + "Leave a review", and a last-checked date.
- **Unverified (current):** **no star elements at all.** An honest panel explaining reviews live on the verified Google profile and cannot be edited by the clinic, plus "View our Google profile" + "Leave a review".

**Do not add a static star rating.** Do not seed a rating value. The empty state is the correct state until real data exists.

### 6.9 Tweaks panel (design-time only — remove for production)
Floating 306px panel, hidden until the host sends `{type:"__activate_edit_mode"}`. Controls: theme (A/B), type pairing, radius, density, homepage section order. Proxies changes to the parent via `postMessage({type:"__edit_mode_set_keys", edits})`. Announce availability with `__edit_mode_available` **only after** the message listener is bound. Includes drag-to-move.

Also used for section reordering: `[data-home-sections]` contains 4 `[data-section]` children (`services`, `trust`, `education`, `ebooks`) which are appended in the chosen order. Implement this as simple declarative ordering in your framework.

### 6.10 Consent-gated analytics (`runtime/analytics.js`)
- GA4 loads **only** if `px_consent_v1.analytics === true`. Before consent, `gtag('consent','default',{analytics_storage:'denied'})` is set and **no Google script is requested**.
- Banner appears ~900ms after load if no stored choice; slides up `translateY(102%) → 0`, `.34s`.
- Two actions: "No thanks" / "Allow analytics" (with `--primary`). Choosing writes consent, removes the bar, and either loads GA or updates consent to denied.
- Every event is **also** written to a private local ring buffer (`px_events`, max 400) so behaviour is visible before GA exists.

Tracked events: `page_view`, `booking_cta_click`, `booking_request`, `lead_capture`, `form_submit`, `whatsapp_click` (by intent), `call_click`, `outbound_click` (youtube/instagram/google_business), `consent_granted`.

### 6.11 Responsive breakpoints
`1080px` footer 3-col · `980px` nav → burger, hero stacks, utility left hides · `860px` consent stacks · `720px` sticky bar replaces float, body padding, hero type clamps, wizard labels hide, footer 2-col · `460px` single-column footer, full-width buttons.

---

## 7. State management & data

### 7.1 Content model (source of truth: `content/data.js`)
`SITE` object: name, doctor, experience ("approximately 6 years"), phone `8624860808` / display `86248 60808` / intl `+918624860808`, whatsapp `918624860808`, address lines, locality Shirur, region Maharashtra, postal `412208`, hours, domain, YouTube/Instagram URLs, brand `Dard E Body Care`, plus copy strings (`bookingNote`, `callBefore`, `mapsQuery`).

`SERVICES` — 12 objects. Schema per service:
```
slug, title, h1, card (1-sentence summary), who, metaTitle, metaDesc,
image, imageAlt,
meaning[] (paragraphs), difficulties[], whenToAssess[], assessment[],
principles[], exercises[], safety[], redFlags[], faqs[{q,a}],
relatedArticle (article slug)
```
Preserve this shape — it drives the service template and the FAQ/MedicalWebPage schema.

`ARTICLES` (`content/content.js`) — 10 objects: `slug, title, category, excerpt, date, updated, readMins, service, body[{t,v}], faqs[]` where block `t` ∈ `p | h2 | h3 | ul | ol | quote | note`.

`window.EBOOKS` — 7 objects: `slug, title, sub, cat, pages, status, desc, contents[]`.

`window.PX_I18N` — `{ en, mr, hi }` flat key → string maps.

### 7.2 Runtime state
- Booking draft (`px_booking_draft_v1`) — `{ idx, values }`
- Booking history (`px_requests`) — last 10 payloads
- Leads (`px_leads`) — array of lead objects, cap 500
- CRM retry queue (`px_crm_queue`) — ids pending upload
- Consent (`px_consent_v1`) — `{ analytics, at, v }`
- Language (`px_lang`), scroll memory (`sessionStorage` `px_scroll:<path>`)
- Analytics ring buffer (`px_events`)

Use your framework's state for in-session wizard state; use `localStorage` only for the resume-after-refresh behaviour, which is a genuine user need (older users abandon long forms and return).

### 7.3 Lead payload contract (integration point)
```json
{
  "id": "px-1731691200000-a1b2c",
  "status": "REQUESTED",
  "kind": "booking | enquiry | home-visit | contact | guide-request | ebook-enquiry",
  "createdAt": "ISO-8601",
  "source": "/booking.html",
  "referrer": "https://...",
  "consent": true,
  "data": {
    "type": "clinic | home | online | followup",
    "patientType": "new | existing",
    "date": "YYYY-MM-DD",
    "time": "morning | midday | afternoon | evening | any",
    "location": "string",
    "name": "string", "phone": "string", "email": "string",
    "reason": "string", "product": "string"
  }
}
```
Posts to `config.crm.endpoint` with `mode: "no-cors"`, `Content-Type: text/plain` (avoids an Apps Script preflight). Failures stay queued and remain exportable as CSV. §"CRM" in `ops/DEPLOY.md` has the full Apps Script implementation.

### 7.4 Data fetching
None required. The only network calls are: Google Fonts, and GA4 *after consent*. Everything else is static. **Do not add** client-side content fetching to the page shell — it would break the SEO model.

---

## 8. Design tokens

Full definitions in `design-system/tokens.css`. Key values (Direction A):

**Colour** — ink `#0B2239` · ink-2 `#17364F` · ink-soft `#485F73` · bg `#FBFAF7` · bg-2 `#F1EFE8` · surface `#FFFFFF` · line `#DCD7CC` · line-soft `#EAE6DC` · primary `#0B2239` · on-primary `#FFFFFF` · support `#0B6E63` · support-soft `#E2EFEC` · accent `#B96F16` · accent-soft `#F7EAD6` · alert `#9A2B1E` · alert-soft `#F8E6E2` · ok `#1F6B4A` · WhatsApp `#1E7D5A`.

**Type scale** (fluid, body floor 17px for the 45–76 audience):
`micro .75` · `xs .8125` · `sm .9375` · `base 1.0625` · `md 1.1875` · `lg 1.3125` · `xl clamp(1.5, ...)` · `2xl clamp(1.95, ...)` · `3xl clamp(2.5, ...→4.4)` · `4xl clamp(2.9, ...→5.6)` rem.
Line heights: tight `1.06` · snug `1.22` · body `1.62`. Measures: `66ch` body, `52ch` lede.

**Spacing** — 4pt base: `.25 .5 .75 1 1.5 2 2.5 3.25 4 5 6.5 8` rem.
Shell `1240px`; gutter `clamp(1.15rem, 4vw, 2.75rem)`; section rhythm `clamp(3.5rem, 6vw, 7rem)`.

**Radius** — `6 / 4 / 14px` + pill `999px` (Direction A) · `3 / 2 / 8px` (Direction B).

**Shadows** — sm `0 1px 2px rgba(11,34,57,.06), 0 1px 1px rgba(11,34,57,.04)` · md `0 10px 30px -12px rgba(11,34,57,.22), 0 2px 6px rgba(11,34,57,.05)` · lg `0 30px 70px -34px rgba(11,34,57,.34)`.

**Tap target** `52px` (`--tap`) — do not reduce.

**Density variants** — `compact` halves section rhythm and tightens body line-height to `1.52`; `roomy` expands section rhythm.

---

## 9. Assets

- **12 AI-generated illustrative photographs** in `assets/img/` — hands-and-movement framing, warm Indian clinic settings, **no faces by design**. Files: `hero-hands.jpg`, `svc-back.jpg`, `svc-knee.jpg`, `svc-shoulder.jpg`, `svc-stroke.jpg`, `svc-ortho.jpg`, `svc-postop.jpg`, `svc-geriatric.jpg`, `svc-balance.jpg`, `svc-homevisit.jpg`, `svc-online.jpg`, `svc-neck.jpg`, `clinic-detail.jpg`.
  - These are **illustrative, not real patients**. Keep the existing captions/disclosure. Replace with real clinic photography when available — but never present a stock or generated image as a real patient.
- **Icons** — two inline SVGs only (WhatsApp glyph, phone glyph), embedded in the footer markup. No icon font, no sprite.
- **Favicon** — `assets/favicon.svg`, a navy rounded square with a white "M"-like mark and a teal dot.
- **Fonts** — Google Fonts: Newsreader, Public Sans, Bitter, Karla. Load via one `<link>` with preconnect. Consider self-hosting for performance and to avoid a third-party request before consent.
- **Video** — none embedded. Cards link out to the YouTube channel. Do not re-host YouTube content.

---

## 10. Placeholders to resolve before production

Search for these strings:

| Placeholder | Where | Needed |
|---|---|---|
| `[ADD CLINIC ADDRESS]` | `content/data.js` → `SITE.addressLine1` | Full street address |
| `[ADD CLINIC HOURS]` | `content/data.js` → `SITE.hours` | Opening hours |
| `[ GOOGLE MAPS EMBED ]` | Contact page | Real `<iframe>` + place ID |
| Domain `https://vipmagicalphysio.com` | `SITE.domain` | Confirm real domain |
| `SITE.geo.lat/lng` | empty | Coordinates for LocalBusiness schema |
| Video titles/durations | Videos page | Real YouTube IDs |
| Dr. Vipul portrait | About page | Real photograph (currently a clinic still-life) |
| `gbp.rating / reviewCount` | `runtime/config.js` | **Only** real observed values |
| `analytics.ga4Id`, `crm.endpoint` | `runtime/config.js` | Your account IDs |

---

## 11. Accessibility requirements (non-negotiable)

These are a design requirement for a 30–76 year old audience, not a nice-to-have:

- Body text never below `17px`; tap targets never below `52px` (`44px` absolute floor).
- Contrast: all body text meets WCAG AA against its surface. `--c-ink-soft` on `--c-bg` is the lightest pair in use — verify if you change the palette.
- Visible focus: `outline: 3px solid var(--c-support); outline-offset: 3px` on `:focus-visible`. Never remove focus rings.
- Semantic landmarks: `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`; a skip link that becomes visible on focus.
- All disclosures carry `aria-expanded` + `aria-controls`; the mobile drawer traps Escape and restores focus to the burger.
- Form errors: inline message + `aria-invalid="true"` + `aria-describedby`, and focus moves to the first invalid field.
- Status regions use `aria-live="polite"`.
- `prefers-reduced-motion` disables all motion.
- Icons are `aria-hidden`; icon-only buttons have `aria-label`.

---

## 12. Files in this bundle

```
design_handoff_physio_website/
├── README.md                        ← this document
├── design-system/
│   ├── tokens.css                   ← all design tokens, both themes
│   ├── site.css                     ← full component layer (~900 lines)
│   └── extras.css                   ← consent bar, GBP panel, admin table
├── reference-pages/                 ← 14 hi-fi reference screens
│   ├── 01-home.html
│   ├── 02-service-detail.html
│   ├── 03-booking-wizard.html       ← most complex component
│   ├── 04-home-visit-landing.html
│   ├── 05-online-consultation.html
│   ├── 06-ebook-store.html
│   ├── 07-about.html
│   ├── 08-contact.html
│   ├── 09-faq.html
│   ├── 10-blog-index.html
│   ├── 11-article.html
│   ├── 12-video-library.html
│   ├── 13-resources.html
│   └── 14-lead-console.html
├── runtime/                         ← behavioural specification
│   ├── site.js                      ← nav, wizard, forms, i18n, filters, reveal
│   ├── analytics.js                 ← consent gate + GA4 + local event log
│   ├── crm.js                       ← lead capture, CSV export, retry queue
│   ├── gbp.js                       ← reviews panel (2 states)
│   ├── tweaks.js                    ← design-time panel (strip in prod)
│   └── config.js                    ← integration switches
├── content/
│   ├── data.js                      ← SITE + 12 SERVICES (copy is final)
│   ├── content.js                   ← 10 ARTICLES
│   └── i18n.js                      ← en / mr / hi interface strings
└── ops/
    ├── DEPLOY.md                    ← deployment + integrations, step by step
    ├── BUILD-NOTES.md               ← build system, known limitations
    ├── robots.txt
    └── sitemap.xml
```

### A note on the reference pages
They live at a different path depth from the originals, so their relative asset links (`../assets/...`) will not resolve when opened in isolation. Read them as **markup and CSS references**; the stylesheets in `design-system/` are the authoritative source for values. To view one rendering correctly, place it alongside an `assets/` folder, or just read the class structure alongside `site.css`.

---

## 13. Build order (suggested)

1. **Tokens + base layer** — port `tokens.css`, then the typography/button/layout primitives from `site.css`.
2. **Chrome** — header (incl. mega-menu + mobile drawer), footer, floating CTAs. These appear on all 47 pages; get them right once.
3. **Homepage** — validates the type scale, hero and card system.
4. **Service template** — one component, 12 pages from data. Includes the red-flag callout, which must come first in the body.
5. **Booking wizard** — the highest-risk component. Test validation, resume-from-draft, and the REQUESTED success state.
6. **Remaining templates** — home visit, online, ebooks, about, contact, FAQ, blog index, article, videos, resources.
7. **Legal + 404 + admin.**
8. **Integrations** — consent gate → CRM webhook → GA4 → GBP. Follow `ops/DEPLOY.md`.
9. **SEO pass** — verify every page has unique title/description/H1, canonical, OG tags, breadcrumbs, and valid JSON-LD (MedicalClinic, Person, WebSite, Service, MedicalWebPage, FAQPage, BlogPosting, Book, BreadcrumbList).
10. **QA** — accessibility audit with a screen reader, Lighthouse mobile, real-device testing on a mid-range Android, and the go-live checklist in `ops/DEPLOY.md` §5.

---

## 14. Three things not to "improve"

1. **Don't add fake social proof.** No invented ratings, no stock-photo "testimonials", no "5000+ happy patients". The absence is deliberate and is the brand's credibility.
2. **Don't invent a payment flow.** The ebook store states plainly that payments are not connected. Ship Razorpay properly (server-side order creation, signature verification, signed download URLs) or leave the honest copy.
3. **Don't let the wizard imply confirmation.** The only status is `REQUESTED`, confirmed by phone. This is operationally true — the clinic genuinely has no automated calendar — and it protects patients from turning up to a slot that doesn't exist.
