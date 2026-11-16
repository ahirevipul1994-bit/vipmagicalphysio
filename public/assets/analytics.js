/* =========================================================
   ANALYTICS — consent-gated GA4 + private local event log
   No third-party script loads until the visitor opts in.
   ========================================================= */
(function () {
  "use strict";

  var CFG = (window.PX_CONFIG || {}).analytics || {};
  var ID = String(CFG.ga4Id || "").trim();
  var KEY = "px_consent_v1";
  var gaLoaded = false;

  /* ---------- consent ---------- */
  function readConsent() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function writeConsent(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function analyticsAllowed() {
    var c = readConsent();
    return !!(c && c.analytics === true);
  }

  /* ---------- gtag shim ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analyticsAllowed() ? "granted" : "denied"
  });

  function loadGA() {
    if (gaLoaded || !ID) return;
    gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("config", ID, { anonymize_ip: true, send_page_view: true });
  }

  /* ---------- tracking ---------- */
  var MAX_EVENTS = 400;

  function track(name, params) {
    params = params || {};
    params.page = location.pathname;
    params.ts = Date.now();

    // Always keep a private, on-device log. This means the clinic can see
    // real activity before GA4 is even switched on.
    try {
      var log = JSON.parse(localStorage.getItem("px_events") || "[]");
      log.push({ e: name, p: params });
      if (log.length > MAX_EVENTS) log = log.slice(-MAX_EVENTS);
      localStorage.setItem("px_events", JSON.stringify(log));
    } catch (e) {}

    if (window.dataLayer) {
      var payload = { event: name };
      Object.keys(params).forEach(function (k) { payload[k] = params[k]; });
      window.dataLayer.push(payload);
    }
  }
  window.pxTrack = track;

  /* ---------- consent UI ---------- */
  function buildBar() {
    if (document.querySelector(".consent")) return;
    var bar = document.createElement("div");
    bar.className = "consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Analytics consent");
    bar.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text"><strong>Optional analytics.</strong> ' +
        'We would like to measure which pages help people most. This uses Google Analytics and is off until you say yes. ' +
        'It never records health information, and the site works fully without it. ' +
        '<a href="privacy-policy.html">Privacy policy</a></p>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--ghost" data-consent="deny">No thanks</button>' +
          '<button type="button" class="btn btn--primary" data-consent="allow">Allow analytics</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.setAttribute("data-open", "true"); });
  }

  function closeBar() {
    var bar = document.querySelector(".consent");
    if (bar) {
      bar.setAttribute("data-open", "false");
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 300);
    }
  }

  function handleChoice(allow) {
    writeConsent({ analytics: allow, at: new Date().toISOString(), v: 1 });
    if (allow) {
      loadGA();
      track("consent_granted", {});
    } else {
      gtag("consent", "update", { analytics_storage: "denied" });
    }
    closeBar();
  }

  /* ---------- wiring ---------- */
  function wire() {
    document.addEventListener("click", function (e) {
      var c = e.target.closest("[data-consent]");
      if (c) {
        handleChoice(c.getAttribute("data-consent") === "allow");
        return;
      }
      if (e.target.closest("[data-consent-open]")) {
        e.preventDefault();
        buildBar();
        return;
      }

      var link = e.target.closest("a");
      if (link) {
        var href = link.getAttribute("href") || "";
        if (href.indexOf("tel:") === 0) {
          track("call_click", { location: link.getAttribute("data-postrack") || "inline" });
        } else if (link.hasAttribute("data-wa") || href.indexOf("wa.me") > -1) {
          track("whatsapp_click", { kind: link.getAttribute("data-wa") || "general" });
        } else if (/youtube\.com|youtu\.be/.test(href)) {
          track("outbound_click", { network: "youtube" });
        } else if (/instagram\.com/.test(href)) {
          track("outbound_click", { network: "instagram" });
        } else if (/google\.com\/maps|g\.page|search\.google\.com\/local/.test(href)) {
          track("outbound_click", { network: "google_business" });
        } else if (href.indexOf("booking.html") > -1) {
          track("booking_cta_click", {});
        }
      }
    }, true);

    document.addEventListener("submit", function (e) {
      var f = e.target;
      if (f && f.matches && f.matches("form[data-enquiry]")) {
        track("form_submit", { form: f.getAttribute("data-form-name") || "enquiry" });
      }
    }, true);

    // Lead events dispatched by site.js
    window.addEventListener("px:lead", function (e) {
      var d = (e.detail || {});
      track(d.kind === "booking" ? "booking_request" : "lead_capture", {
        kind: d.kind || "enquiry",
        type: (d.appointment && d.appointment.type) || d.type || ""
      });
    });
  }

  function boot() {
    wire();
    var c = readConsent();
    if (!c) {
      setTimeout(buildBar, 900);
    } else if (c.analytics) {
      loadGA();
    }
    track("page_view", { title: document.title });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
