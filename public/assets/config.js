/* =========================================================
   VIP MAGICAL PHYSIO — RUNTIME CONFIG
   This is the single file to edit when switching integrations on.
   Nothing here is a secret. Never put server keys in this file.
   ========================================================= */
window.PX_CONFIG = {

  /* ---------- ANALYTICS ----------
     Paste your GA4 Measurement ID to switch tracking on.
     Found in GA4 → Admin → Data streams → your stream → "Measurement ID".
     Leave "" and the site runs with zero third-party scripts
     (a local, private event log still records activity on this device). */
  analytics: {
    ga4Id: "",              // e.g. "G-XXXXXXXXXX"
    debug: false
  },

  /* ---------- CRM / LEAD CAPTURE ----------
     Paste your Google Apps Script Web App URL (deployment guide in DEPLOY.md).
     While empty, every enquiry is still captured locally and can be
     exported to CSV from /admin.html — nothing is lost. */
  crm: {
    endpoint: "",           // e.g. "https://script.google.com/macros/s/AKfy.../exec"
    autoPost: true
  },

  /* ---------- GOOGLE BUSINESS PROFILE / REVIEWS ----------
     Reviews must come from a real, verified profile. This block never
     invents a rating — if placeId/rating are empty, the site shows an
     honest "reviews live on Google" panel instead of fake stars. */
  gbp: {
    placeId: "",            // e.g. "ChIJ..." from the Place ID Finder
    profileUrl: "",         // e.g. "https://g.page/r/.../review"
    rating: null,           // REAL rating only, e.g. 4.8
    reviewCount: null,      // REAL count only, e.g. 27
    lastSynced: ""          // ISO date you last checked the real numbers
  }
};
