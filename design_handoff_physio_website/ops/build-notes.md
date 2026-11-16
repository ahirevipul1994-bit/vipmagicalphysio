# VIP Magical Physio Clinic — build notes & deployment checklist

**Site:** 46 pages, pre-rendered static HTML. No framework, no build step required to host.
**Built:** 16 November 2026 · asset stamp `20261116a`

---

## 1. What is live and working

| Feature | Status | Notes |
|---|---|---|
| All 46 pages, responsive | ✅ Working | Mobile-first, 320px → 4K |
| Navigation, mega-menu, mobile drawer | ✅ Working | Keyboard + Esc + focus-out close |
| Language switcher (EN / मराठी / हिन्दी) | ✅ Working | UI strings only — see §5 |
| Booking request wizard (4 steps) | ✅ Working | Saves draft to localStorage, produces a `REQUESTED` payload |
| Enquiry forms → WhatsApp handoff | ✅ Working | Composes message, opens WhatsApp. **No server, no stored data.** |
| Free-guide request form | ✅ Working | Same WhatsApp mechanism |
| Ebook interest form | ✅ Working | Same WhatsApp mechanism |
| WhatsApp floating button + sticky mobile bar | ✅ Working | Prefilled messages per intent |
| Tweaks panel (theme / type / radius / density / section order) | ✅ Working | Themes A + B fully built |
| SEO: titles, descriptions, canonicals, OG, breadcrumbs, sitemap, robots | ✅ Working | 38 URLs in sitemap |
| JSON-LD: MedicalClinic, Person, WebSite, Service, MedicalWebPage, FAQPage, BlogPosting, Book, BreadcrumbList | ✅ Working | No fake reviews, ratings or credentials |
| 404 page | ✅ Working | |

## 2. What is deliberately NOT live

Stated honestly on the site, not faked:

- **Online payments** — no gateway connected. `/ebooks.html` says so in a visible callout. No card fields anywhere.
- **Live appointment availability** — no calendar. Every outcome is labelled `REQUESTED`, confirmed by phone.
- **Ebook delivery** — no files, no download links. Interest capture only.
- **YouTube video IDs** — cards link to the channel. Titles are placeholders.
- **Google Maps embed** — visible placeholder box with a working maps search link.
- **Analytics** — no GA4/GTM/GA script. Recommended to add only with consent banner.

## 3. Fill these before going live

All in `assets/data.js` → `SITE`:

```
addressLine1 : "[ADD CLINIC ADDRESS]"   ← replace
hours        : "[ADD CLINIC HOURS]"     ← replace
email        : ""                        ← add if you want email contact
geo.lat/lng  : ""                        ← add for LocalBusiness geo schema
domain       : "https://vipmagicalphysio.com"  ← confirm real domain
```

Also:
1. `tools/lib.js` → replace the Google Maps placeholder block in `pages-misc.js` (`GEN.contact`) with a real `<iframe>` once the address is confirmed.
2. Add Dr. Vipul's portrait to `assets/img/` and swap `clinic-detail.jpg` on `about.html`.
3. Replace the 12 YouTube placeholder titles in `tools/pages-misc.js` (`GEN.videos`) with real video IDs.

## 4. Rebuilding

Pages are generated. Edit content in `assets/data.js` / `assets/content.js`, or layout in `tools/pages-*.js`, then:

- Re-run `tools/build.js` in the sandbox (same method used to build), **or**
- Edit generated HTML directly for one-off changes.

Bump `BUILD` in `tools/lib.js` on every deploy so cached CSS/JS is invalidated.

## 5. Translation policy

The language switcher translates **interface strings only** (nav, CTAs, form labels, headings) via `assets/i18n.js`. Clinical body copy stays in English.

**This is intentional.** Machine-translating medical terminology into Marathi and Hindi is a clinical liability. Before switching a language to full body-copy translation, have Dr. Vipul review every string. The architecture is ready: add `data-i18n` attributes and dictionary keys, then serve `/mr/` and `/hi/` variants via build config.

## 6. Wiring real integrations later

### 6a. Appointment backend (Google Sheets + Calendar)
The wizard already emits the right payload. Locate it under "Developer: view request payload" on the confirmation screen.

```json
{ "status": "requested", "submittedAt": "ISO", "site": "...",
  "appointment": { "type": "clinic|home|online|followup", "date": "YYYY-MM-DD",
                   "time": "morning|midday|afternoon|evening|any",
                   "name": "", "phone": "", "email": "", "reason": "" } }
```

Steps: Apps Script web app (`doPost`) → append row to a **private** sheet → Calendar event → email confirmation. In `assets/site.js`, `initWizard`'s submit handler, `fetch()` that endpoint *in addition to* opening WhatsApp. Keep the WhatsApp path as fallback.

### 6b. Razorpay
1. Merchant account + KYC. 2. Never put `key_secret` in front-end code — only `key_id`. 3. Create order server-side, open Checkout server-side-verified. 4. Serve paid PDFs via **time-limited signed URLs**, never a public path. 5. Add `/api/verify-payment` webhook handler. 6. Only then change the store copy from "Launching soon" to purchasable, and remove `Disallow: /ebooks/` from `robots.txt`.

> Do not take payments through an untested checkout. The current copy is honest deliberately — keep it that way until §6b step 6.

## 7. Local SEO — next actions off-site

The site is technically ready. Local ranking depends on work outside the HTML:

1. **Google Business Profile** — claim/verify, choose a primary category (`Physical therapist`), add the exact NAP from `SITE`, upload real clinic photos, set hours.
2. **NAP consistency** — the same name, address, phone on Practo, Justdial, Facebook, Instagram bio, YouTube About.
3. **Reviews** — ask real patients after good outcomes. Never incentivise. Never write them yourself. The site currently contains **zero** reviews by design; add a widget only from a real source.
4. **Search Console + GA4** — verify, submit `sitemap.xml`, then add GA4 with consent.
5. **Location pages** — do not create fake area pages for villages the clinic can't serve. Add real ones only as coverage genuinely expands.

## 8. Accessibility notes

- Body text floor 17px; tap targets ≥ 50px; contrast checked against navy/teal on cream.
- Skip link, landmark regions, visible focus rings, `aria-expanded` on all disclosures.
- Form errors are inline + `aria-invalid` + focus moves to first error.
- `prefers-reduced-motion` disables all transitions and reveals.
- Reveal animations have a hard fallback: content can never remain invisible if JS fails.

## 9. Known limitations

- Forms depend on WhatsApp being installed/available; the phone number is always shown as a fallback.
- `:has()` is used to hide floating CTAs over forms — supported in all current browsers, degrades harmlessly.
- Ebook detail pages are `noindex` until the store is live.
- No cookie banner, because no tracking cookies are set. Add one *with* analytics, not before.
