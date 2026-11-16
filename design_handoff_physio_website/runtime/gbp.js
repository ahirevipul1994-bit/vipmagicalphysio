/* =========================================================
   GOOGLE BUSINESS PROFILE — reviews & profile link
   Never invents a rating. If no real data is configured,
   it renders an honest "read reviews on Google" panel.
   ========================================================= */
(function () {
  "use strict";

  function cfg() { return (window.PX_CONFIG || {}).gbp || {}; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /* Build a review/profile URL that always works even without a place ID. */
  function profileUrl() {
    var c = cfg();
    if (c.profileUrl) return c.profileUrl;
    if (c.placeId) return "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(c.placeId);
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("VIP Magical Physio Clinic Shirur Pune");
  }

  function stars(rating) {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      var filled = rating >= i - 0.25;
      out += '<span class="star" aria-hidden="true" data-on="' + (filled ? "true" : "false") + '">★</span>';
    }
    return out;
  }

  function render(el) {
    var c = cfg();
    var hasReal = typeof c.rating === "number" && c.rating > 0 && c.reviewCount > 0;
    var url = profileUrl();

    if (hasReal) {
      el.innerHTML =
        '<div class="gbp gbp--verified">' +
          '<div class="gbp__head">' +
            '<span class="gbp__logo" aria-hidden="true">G</span>' +
            '<div><strong>' + c.rating.toFixed(1) + ' / 5</strong>' +
            '<span class="tiny muted" style="display:block">' + c.reviewCount + ' Google reviews</span></div>' +
          '</div>' +
          '<div class="gbp__stars" role="img" aria-label="Rated ' + c.rating.toFixed(1) + ' out of 5 on Google">' + stars(c.rating) + '</div>' +
          '<div class="btn-row" style="margin-top:.9rem">' +
            '<a class="btn btn--primary" href="' + esc(url) + '" target="_blank" rel="noopener" data-postrack="gbp">Read reviews on Google</a>' +
            '<a class="btn btn--ghost" href="' + esc(url) + '" target="_blank" rel="noopener">Leave a review</a>' +
          '</div>' +
          (c.lastSynced ? '<p class="tiny muted" style="margin-top:.7rem">Rating last checked ' + esc(c.lastSynced) + '.</p>' : "") +
        '</div>';
      return;
    }

    // No verified data yet — honest state, still fully actionable.
    el.innerHTML =
      '<div class="gbp">' +
        '<div class="gbp__head">' +
          '<span class="gbp__logo" aria-hidden="true">G</span>' +
          '<div><strong>Reviews on Google</strong>' +
          '<span class="tiny muted" style="display:block">Verified patients, verified platform</span></div>' +
        '</div>' +
        '<p class="small muted" style="margin-top:.8rem;line-height:1.6">' +
          'Patient reviews are published on our Google Business Profile, not copied onto this website. ' +
          'That way every review is tied to a real Google account and cannot be edited by us.' +
        '</p>' +
        '<div class="btn-row" style="margin-top:.9rem">' +
          '<a class="btn btn--primary" href="' + esc(url) + '" target="_blank" rel="noopener" data-postrack="gbp">View our Google profile</a>' +
          '<a class="btn btn--ghost" href="' + esc(url) + '" target="_blank" rel="noopener">Leave a review</a>' +
        '</div>' +
        '<p class="tiny muted" style="margin-top:.7rem">We do not display a star rating until it is pulled from our verified profile.</p>' +
      '</div>';
  }

  function boot() {
    document.querySelectorAll("[data-gbp]").forEach(render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.PXGBP = { url: profileUrl, renderAll: boot };
})();
