/* =========================================================
   TWEAKS PANEL + PROTOCOL
   Rendered into every page. Hidden unless Tweaks is on.
   ========================================================= */
(function () {
  "use strict";

  var TWEAK_DEFAULTS = {
    "theme": "a",
    "type": "serif",
    "density": "normal",
    "radius": "soft",
    "order": "trust"
  };

  var LABELS = {
    theme: { a: "Clinical Calm", b: "Warm Editorial" },
    type: { serif: "Serif", slab: "Slab", modern: "Modern" },
    density: { compact: "Compact", normal: "Normal", roomy: "Roomy" },
    radius: { sharp: "Sharp", soft: "Soft", round: "Round" },
    order: { trust: "Services", conversion: "Trust first", story: "Story first" }
  };

  function build() {
    var panel = document.createElement("div");
    panel.className = "twk";
    panel.id = "twk";
    panel.setAttribute("data-open", "false");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Tweaks");

    function group(key, opts) {
      return '<div class="twk__group"><span>' + key.charAt(0).toUpperCase() + key.slice(1) + '</span><div class="twk__opts">' +
        opts.map(function (o) {
          return '<button type="button" class="twk__opt" data-tweak="' + key + '" data-value="' + o +
            '" aria-pressed="' + (TWEAK_DEFAULTS[key] === o ? "true" : "false") + '">' + LABELS[key][o] + '</button>';
        }).join("") + '</div></div>';
    }

    panel.innerHTML =
      '<div class="twk__head"><strong>Tweaks</strong><button class="twk__close" type="button" aria-label="Close tweaks">✕</button></div>' +
      '<div class="twk__body">' +
        group("theme", ["a", "b"]) +
        group("type", ["serif", "slab", "modern"]) +
        group("radius", ["sharp", "soft", "round"]) +
        group("density", ["compact", "normal", "roomy"]) +
        group("order", ["trust", "conversion", "story"]) +
        '<div class="twk__note">Direction A is the safe, clinical build. Direction B is warmer and more editorial — same structure, different voice. Section order only affects the homepage on this page load.</div>' +
      '</div>';

    document.body.appendChild(panel);

    // --- protocol: listener FIRST ---
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "__activate_edit_mode") panel.setAttribute("data-open", "true");
      if (d.type === "__deactivate_edit_mode") panel.setAttribute("data-open", "false");
    });

    panel.querySelector(".twk__close").addEventListener("click", function () {
      panel.setAttribute("data-open", "false");
    });

    // --- apply + persist ---
    function post(key, val) {
      var edits = {};
      edits[key] = val;
      try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: edits }, "*"); } catch (err) {}
    }

    Array.prototype.forEach.call(panel.querySelectorAll("[data-tweak]"), function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-tweak");
        var val = btn.getAttribute("data-value");
        Array.prototype.forEach.call(panel.querySelectorAll('[data-tweak="' + key + '"]'), function (o) {
          o.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        apply(key, val);
        post(key, val);
      });
    });

    // Drag to move
    var head = panel.querySelector(".twk__head");
    var dragging = false, ox = 0, oy = 0;
    head.addEventListener("mousedown", function (e) {
      if (e.target.closest(".twk__close")) return;
      dragging = true;
      var r = panel.getBoundingClientRect();
      ox = e.clientX - r.left; oy = e.clientY - r.top;
      panel.style.left = r.left + "px"; panel.style.top = r.top + "px";
      panel.style.right = "auto"; panel.style.bottom = "auto";
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      panel.style.left = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, e.clientX - ox)) + "px";
      panel.style.top = Math.max(8, Math.min(window.innerHeight - 80, e.clientY - oy)) + "px";
    });
    window.addEventListener("mouseup", function () { dragging = false; });

    // --- announce ---
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (err) {}
  }

  function apply(key, val) {
    var root = document.documentElement;
    var body = document.body;

    if (key === "theme") {
      root.setAttribute("data-theme", val);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", val === "b" ? "#8A3B2C" : "#0B2239");
      return;
    }

    if (key === "type") {
      var pairs = {
        serif: ['"Newsreader", Georgia, serif', '"Public Sans", sans-serif'],
        slab: ['"Bitter", Georgia, serif', '"Karla", sans-serif'],
        modern: ['"Newsreader", Georgia, serif', '"Public Sans", sans-serif']
      };
      var p = pairs[val] || pairs.serif;
      root.style.setProperty("--font-display", p[0]);
      root.style.setProperty("--font-body", p[1]);
      if (val === "modern") {
        root.style.setProperty("--display-weight", "300");
        root.style.setProperty("--display-tracking", "-0.035em");
      } else if (val === "slab") {
        root.style.setProperty("--display-weight", "600");
        root.style.setProperty("--display-tracking", "-0.028em");
      } else {
        root.style.setProperty("--display-weight", "400");
        root.style.setProperty("--display-tracking", "-0.022em");
      }
      return;
    }

    if (key === "density") { root.setAttribute("data-density", val); return; }

    if (key === "radius") {
      var map = {
        sharp: ["2px", "1px", "4px"],
        soft: ["6px", "4px", "14px"],
        round: ["16px", "10px", "26px"]
      };
      var r = map[val] || map.soft;
      root.style.setProperty("--radius", r[0]);
      root.style.setProperty("--radius-sm", r[1]);
      root.style.setProperty("--radius-lg", r[2]);
      return;
    }

    if (key === "order") {
      var host = document.querySelector("[data-home-sections]");
      if (!host) return;
      var order = {
        trust: ["services", "trust", "education", "ebooks"],
        conversion: ["trust", "services", "ebooks", "education"],
        story: ["education", "services", "trust", "ebooks"]
      }[val] || ["services", "trust", "education", "ebooks"];
      order.forEach(function (id) {
        var sec = host.querySelector('[data-section="' + id + '"]');
        if (sec) host.appendChild(sec);
      });
    }
  }

  // Restore persisted tweaks if the host injected them
  function restore() {
    try {
      var saved = window.__TWEAKS__ || null;
      if (!saved) return;
      Object.keys(saved).forEach(function (k) {
        if (TWEAK_DEFAULTS.hasOwnProperty(k)) {
          apply(k, saved[k]);
          var btn = document.querySelector('#twk [data-tweak="' + k + '"][data-value="' + saved[k] + '"]');
          if (btn) {
            Array.prototype.forEach.call(document.querySelectorAll('#twk [data-tweak="' + k + '"]'), function (o) { o.setAttribute("aria-pressed", "false"); });
            btn.setAttribute("aria-pressed", "true");
          }
        }
      });
    } catch (e) {}
  }

  function boot() { build(); restore(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
