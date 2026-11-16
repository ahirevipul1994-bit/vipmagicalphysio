# DEPLOY.md — VIP Magical Physio Clinic

Everything needed to take this site live, plus the two integrations that need your accounts: **analytics** and **CRM**.

---

## 0. Finalise in 5 minutes

### Fill in the real clinic details
Open `assets/data.js` → `SITE` and replace:

| Field | Currently | Replace with |
|---|---|---|
| `addressLine1` | `[ADD CLINIC ADDRESS]` | full street address |
| `hours` | `[ADD CLINIC HOURS]` | e.g. `Mon–Sat, 10:00–20:00` |
| `domain` | `https://vipmagicalphysio.com` | your real domain |
| `geo.lat` / `geo.lng` | `""` | clinic coordinates (for LocalBusiness schema) |
| `email` | `""` | optional email |

Then re-run the build (or edit the generated HTML). Bump `BUILD` in `tools/lib.js` each deploy.

### Then deploy
The site is plain static HTML — no server needed.

1. **Netlify / Vercel / Cloudflare Pages:** drag the whole folder in. Done.
2. **cPanel / shared hosting:** upload all files to `public_html`.
3. Point DNS at the host, enable HTTPS (free via Let's Encrypt).
4. Submit `sitemap.xml` in Google Search Console.

> `assets/config.js` is public. Never put API secrets or a Razorpay `key_secret` in it.

---

## 1. Analytics — switching on GA4

Everything is already wired. It is **consent-gated**: no Google script loads until the visitor clicks "Allow analytics".

1. Create a GA4 property at analytics.google.com.
2. Admin → Data streams → Web → copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Open `assets/config.js`:

```js
analytics: { ga4Id: "G-XXXXXXXXXX", debug: false }
```

4. Deploy. Visit the site, accept the banner, confirm the hit appears in GA4 → Realtime.

**Events already tracked** (no extra setup):

| Event | Fires when |
|---|---|
| `page_view` | Every page |
| `booking_cta_click` | Any link to the booking page |
| `booking_request` | Appointment request submitted |
| `lead_capture` | Any enquiry form submitted |
| `whatsapp_click` | WhatsApp button, tagged by intent (`clinic`, `home`, `online`, `ebook`) |
| `call_click` | Any `tel:` link |
| `outbound_click` | YouTube / Instagram / Google Maps |
| `consent_granted` | Visitor allows analytics |

**Also:** every event is written to a private on-device log, so you can see real behaviour in `/admin.html` **before** GA4 is even connected.

### Recommended GA4 conversions
Mark `booking_request` and `lead_capture` as key events. Add `whatsapp_click` as a secondary conversion.

---

## 2. CRM — Google Sheets as your lead database

No server needed. Leads land in a private Sheet you own.

### Step 1 — Create the Sheet
New Google Sheet. Rename the tab to `Leads`. Add this header row in row 1:

```
id | createdAt | status | kind | source | name | phone | email | type | date | time | location | reason | product
```

### Step 2 — Add the script
Extensions → Apps Script. Paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    var lead  = JSON.parse(e.postData.contents);
    var d     = lead.data || {};

    sheet.appendRow([
      lead.id, lead.createdAt, lead.status, lead.kind, lead.source,
      d.name || '', d.phone || '', d.email || '',
      d.type || '', d.date || '', d.time || '', d.location || '',
      d.reason || '', d.product || ''
    ]);

    // Optional: email yourself on every new lead
    // MailApp.sendEmail('you@example.com', 'New physio enquiry',
    //   (d.name || 'Someone') + ' — ' + (d.phone || '') + '\n' + (d.reason || ''));

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3 — Deploy
Deploy → New deployment → type **Web app** → Execute as **Me** → Who has access **Anyone**. Copy the `/exec` URL.

### Step 4 — Connect
In `assets/config.js`:

```js
crm: { endpoint: "https://script.google.com/macros/s/AKfy.../exec", autoPost: true }
```

Deploy. Submit a test enquiry → a row appears in your Sheet within seconds.

> **Privacy:** the Sheet must stay private. Never publish it to the web, never share it publicly. Leads are personal data.

### If a lead fails to send
It is never lost. It queues in the browser queue (`px_crm_queue`) and remains visible in `/admin.html`, where you can export CSV. Retry by resubmitting once the endpoint is fixed.

---

## 3. Google Business Profile — reviews

This is the single highest-leverage thing for "physiotherapist in Shirur" rankings.

1. Create/claim the profile at business.google.com. Category: **Physical therapist**.
2. Use the **exact** name, address and phone from `assets/data.js` — character for character. Inconsistent NAP is the most common local-SEO own-goal.
3. Get your **Place ID** from the Place ID Finder. Get your review link (Profile → Share → Ask for reviews).
4. Add them to `assets/config.js`:

```js
gbp: {
  placeId: "ChIJ...",
  profileUrl: "https://g.page/r/.../review",
  rating: null,      // ← only after you can see a REAL rating
  reviewCount: null, // ← only a REAL count
  lastSynced: ""
}
```

### How reviews behave

- **Until you set a real rating**, the site shows an honest panel: *"Patient reviews are published on our Google Business Profile, not copied onto this website… We do not display a star rating until it is pulled from our verified profile."* It links straight to Google.
- **Once you set a real rating and count**, it renders the stars, the count, "Read reviews" and "Leave a review".

Why it works this way: a self-declared star rating with no source is a fabricated trust signal — the exact thing that would sink a clinical brand, and something Google's review-snippet policies penalise. Sending reviewers to Google instead builds the asset that actually ranks you locally.

### Getting reviews (the ethical way)
Ask patients after a genuinely good outcome. Send the Google review link on WhatsApp. **Never** offer discounts or gifts for reviews, never write them yourself, never filter out unhappy patients. Google detects all three, and it is not worth the risk to a healthcare brand.

---

## 4. Razorpay (later — store is currently honest about not being live)

1. Create a merchant account, complete KYC.
2. Front end may hold **only** `key_id`. `key_secret` lives server-side, always.
3. Server creates the order → Checkout opens → verify the signature server-side → *then* issue the download.
4. Paid PDFs must be served by **time-limited signed URLs**, never a public path.
5. Only after end-to-end testing: change the ebook copy, and remove `Disallow: /ebooks/` from `robots.txt`.

Do not take money through an untested checkout. The current copy is deliberately honest — keep it that way until step 5.

---

## 5. Go-live QA

- [ ] Real address, hours, domain filled in
- [ ] HTTPS active; no mixed content
- [ ] Test on a real phone, not just a resized window
- [ ] Submit booking wizard end to end → confirmation appears → WhatsApp message arrives
- [ ] Submit enquiry form → lead appears in `/admin.html` → export CSV works
- [ ] Accept consent banner → verify GA4 Realtime hit
- [ ] Click WhatsApp, Call, YouTube, Maps → confirm they open correctly
- [ ] `/admin.html` loads and is **not** indexed (also protected by `robots.txt` + `noindex`)
- [ ] Add a real portrait of Dr. Vipul on `about.html`
- [ ] Replace placeholder video titles with real YouTube IDs
- [ ] Embed the real Google Map on `contact.html`
- [ ] Test the 404 page
- [ ] Validate schema at validator.schema.org
- [ ] Run Lighthouse on mobile; check contrast

---

## 6. What still needs a human

| Item | Why it can't be automated |
|---|---|
| Clinic address, hours, coordinates | Only you know them |
| Google Business Profile verification | Requires postcard/phone verification |
| Dr. Vipul's real portrait | Needs a real photograph |
| Real YouTube video IDs | Needs the actual channel data |
| Real rating / review count | Must be observed, never invented |
| Marathi/Hindi body copy | Needs clinical review before translation |
| GST / clinic registration details | Legal specifics |
