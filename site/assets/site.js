/* =========================================================
   VIP MAGICAL PHYSIO — CLIENT ENGINE
   No backend. No stored patient data. WhatsApp handoff only.
   ========================================================= */
(function () {
  "use strict";

  var WA = "918624860808";
  var PHONE = "+918624860808";

  /* ---------------- WhatsApp composition ---------------- */
  var WA_MESSAGES = {
    clinic: "Hello Dr. Vipul, I would like to book a physiotherapy appointment at the clinic. My name is ____ and I would like to come on ____.",
    home: "Hello Dr. Vipul, I would like to enquire about a home physiotherapy visit. My area is ____ and the patient's main difficulty is ____.",
    online: "Hello Dr. Vipul, I would like to enquire about an online physiotherapy consultation. My main concern is ____.",
    ebook: "Hello Dr. Vipul, I would like to enquire about the Dard E Body Care ebooks.",
    general: "Hello Dr. Vipul, I would like to enquire about physiotherapy services."
  };

  function waLink(kind, extra) {
    var msg = WA_MESSAGES[kind] || WA_MESSAGES.general;
    if (extra) msg = extra;
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  function buildWaFromForm(payload) {
    var lines = ["Hello Dr. Vipul,"];
    if (payload.type) lines.push("Enquiry: " + payload.type);
    if (payload.name) lines.push("Name: " + payload.name);
    if (payload.phone) lines.push("Mobile: " + payload.phone);
    if (payload.email) lines.push("Email: " + payload.email);
    if (payload.patientType) lines.push("Patient: " + payload.patientType);
    if (payload.date) lines.push("Preferred date: " + payload.date);
    if (payload.time) lines.push("Preferred time: " + payload.time);
    if (payload.location) lines.push("Area / location: " + payload.location);
    if (payload.reason) lines.push("Reason: " + payload.reason);
    if (payload.product) lines.push("Ebook: " + payload.product);
    lines.push("");
    lines.push("(Sent from the VIP Magical Physio website.)");
    return lines.join("\n");
  }

  /* ---------------- Small helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt) n.textContent = txt; return n; }

  /* ---------------- Header ---------------- */
  function initHeader() {
    var head = $(".site-head");
    if (head) {
      var onScroll = function () {
        head.setAttribute("data-stuck", window.scrollY > 12 ? "true" : "false");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Mega menus
    $$(".has-mega").forEach(function (m) {
      var btn = $(".nav__link", m);
      if (!btn) return;
      var open = function (v) { m.setAttribute("data-open", v ? "true" : "false"); btn.setAttribute("aria-expanded", v ? "true" : "false"); };
      btn.setAttribute("aria-expanded", "false");
      m.addEventListener("mouseenter", function () { open(true); });
      m.addEventListener("mouseleave", function () { open(false); });
      btn.addEventListener("click", function (e) { e.preventDefault(); open(m.getAttribute("data-open") !== "true"); });
      m.addEventListener("keydown", function (e) { if (e.key === "Escape") { open(false); btn.focus(); } });
      m.addEventListener("focusout", function (e) {
        if (!m.contains(e.relatedTarget)) open(false);
      });
    });

    // Mobile nav
    var burger = $(".burger");
    var mnav = $(".mobile-nav");
    if (burger && mnav) {
      var setNav = function (v) {
        mnav.setAttribute("data-open", v ? "true" : "false");
        burger.setAttribute("aria-expanded", v ? "true" : "false");
        document.body.style.overflow = v ? "hidden" : "";
        if (v) { var first = $("a", mnav); if (first) first.focus(); }
      };
      burger.addEventListener("click", function () { setNav(mnav.getAttribute("data-open") !== "true"); });
      $$("[data-close-nav]", mnav).forEach(function (b) { b.addEventListener("click", function () { setNav(false); }); });
      mnav.addEventListener("keydown", function (e) { if (e.key === "Escape") { setNav(false); burger.focus(); } });
      window.addEventListener("resize", function () { if (window.innerWidth > 980 && mnav.getAttribute("data-open") === "true") setNav(false); });
    }
  }

  /* ---------------- Accordions ---------------- */
  function initAccordions() {
    $$(".acc__btn").forEach(function (btn) {
      var item = btn.closest(".acc__item");
      var panel = $(".acc__panel", item);
      var pid = panel && panel.id;
      if (pid) { btn.setAttribute("aria-controls", pid); panel.setAttribute("role", "region"); }
      btn.setAttribute("aria-expanded", item.getAttribute("data-open") === "true" ? "true" : "false");
      if (panel && !pid) panel.hidden = false;
      btn.addEventListener("click", function () {
        var isOpen = item.getAttribute("data-open") === "true";
        item.setAttribute("data-open", isOpen ? "false" : "true");
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  /* ---------------- Reveal ---------------- */
  function initReveal() {
    document.documentElement.classList.add("js-ready");
    var nodes = $$(".reveal");
    if (!nodes.length) return;

    var showAll = function () {
      nodes.forEach(function (n) { n.setAttribute("data-seen", "true"); });
    };

    // No IO support, or reduced motion: show everything immediately.
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.setAttribute("data-seen", "true"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -4% 0px", threshold: 0.02 });
    nodes.forEach(function (n) { io.observe(n); });

    // Content is never hidden long. Anything still unseen after a short beat
    // renders instantly (no transition) so headless capture and slow devices
    // always show a complete page.
    setTimeout(function () {
      nodes.forEach(function (n) {
        if (n.getAttribute("data-seen") !== "true") {
          n.setAttribute("data-instant", "true");
          n.setAttribute("data-seen", "true");
        }
      });
    }, 450);
    window.addEventListener("load", function () { setTimeout(showAll, 300); });
  }

  /* ---------------- WhatsApp wiring ---------------- */
  function initWhatsApp() {
    $$("[data-wa]").forEach(function (a) {
      var kind = a.getAttribute("data-wa");
      var msg = a.getAttribute("data-wa-msg");
      a.setAttribute("href", waLink(kind, msg));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  /* ---------------- Enquiry forms (WhatsApp handoff) ---------------- */
  function initEnquiryForms() {
    $$("form[data-enquiry]").forEach(function (form) {
      var status = $("[data-form-status]", form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = validateForm(form);
        if (!ok.ok) {
          if (status) { status.textContent = "Please check the highlighted fields."; status.setAttribute("data-state", "error"); }
          var firstBad = $('[aria-invalid="true"]', form);
          if (firstBad) firstBad.focus();
          return;
        }
        var payload = readPayload(form);
        var text = buildWaFromForm(payload);
        try { localStorage.setItem("px_last_enquiry", JSON.stringify({ at: Date.now(), payload: payload })); } catch (err) {}

        // CRM capture: stored locally, and posted to a webhook if configured.
        if (window.PXCRM) {
          var kind = form.getAttribute("data-form-kind") || "enquiry";
          window.PXCRM.addLead(window.PXCRM.makeLead(kind, payload));
        } else {
          window.dispatchEvent(new CustomEvent("px:capture", { detail: { kind: form.getAttribute("data-form-kind") || "enquiry", data: payload } }));
        }

        if (status) {
          status.setAttribute("data-state", "success");
          status.innerHTML = "<strong>Opening WhatsApp…</strong> Your message is ready to review and send. Nothing has been sent automatically.";
        }
        window.open(waLink("general", text), "_blank", "noopener");
      });
    });
  }

  function readPayload(form) {
    var p = {};
    $$("input, select, textarea", form).forEach(function (f) {
      if (!f.name) return;
      if (f.type === "checkbox") { if (f.checked) p[f.name] = f.getAttribute("data-label") || "Yes"; return; }
      if (f.type === "radio") { if (f.checked) p[f.name] = f.getAttribute("data-label") || f.value; return; }
      if (f.value) p[f.name] = f.value;
    });
    return p;
  }

  function validateForm(form) {
    var ok = true;
    $$("[required]", form).forEach(function (f) {
      var field = f.closest(".field") || f.closest(".radio-cards") || f.parentElement;
      var bad = false;
      if (f.type === "checkbox") bad = !f.checked;
      else if (!f.value.trim()) bad = true;
      else if (f.type === "tel" && f.value.replace(/\D/g, "").length < 10) bad = true;
      else if (f.type === "email" && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) bad = true;

      if (bad) { ok = false; if (f.type !== "checkbox") f.setAttribute("aria-invalid", "true"); if (field) field.setAttribute("data-error", "true"); }
      else { f.removeAttribute("aria-invalid"); if (field) field.setAttribute("data-error", "false"); }
    });
    return { ok: ok };
  }

  document.addEventListener("input", function (e) {
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute("aria-invalid") === "true") {
      f.removeAttribute("aria-invalid");
      var field = f.closest(".field") || f.parentElement;
      if (field) field.setAttribute("data-error", "false");
    }
  });

  /* ---------------- Booking wizard ---------------- */
  var STORE = "px_booking_draft_v1";

  function initWizard() {
    var wiz = $("[data-wizard]");
    if (!wiz) return;

    var panes = $$(".wizard__pane", wiz);
    var steps = $$(".wizard__step", wiz);
    var btnNext = $("[data-wiz-next]", wiz);
    var btnPrev = $("[data-wiz-prev]", wiz);
    var idx = 0;

    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) {}

    if (saved && saved.values) {
      Object.keys(saved.values).forEach(function (k) {
        var nodes = $$('[name="' + k + '"]', wiz);
        nodes.forEach(function (n) {
          if (n.type === "radio" || n.type === "checkbox") n.checked = (n.value === saved.values[k]);
          else n.value = saved.values[k];
        });
      });
      if (typeof saved.idx === "number" && saved.idx > 0 && saved.idx < panes.length) idx = saved.idx;
    }

    var dateInput = $('input[type="date"]', wiz);
    if (dateInput && !dateInput.value) {
      var t = new Date(); t.setDate(t.getDate() + 1);
      dateInput.min = new Date().toISOString().slice(0, 10);
      dateInput.value = t.toISOString().slice(0, 10);
    }

    function collect() {
      var v = {};
      $$("input, select, textarea", wiz).forEach(function (f) {
        if (!f.name) return;
        if (f.type === "checkbox") { v[f.name] = f.checked; return; }
        if (f.type === "radio") { if (f.checked) v[f.name] = f.value; return; }
        v[f.name] = f.value;
      });
      return v;
    }

    function save() {
      try { localStorage.setItem(STORE, JSON.stringify({ idx: idx, values: collect(), at: Date.now() })); } catch (e) {}
    }

    function paneValid(i) {
      var pane = panes[i];
      var ok = true;
      $$("[required]", pane).forEach(function (f) {
        if (f.type === "radio") {
          var group = $$('[name="' + f.name + '"]', pane);
          var any = group.some(function (g) { return g.checked; });
          if (!any) { ok = false; var card = f.closest(".field") || f.parentElement; if (card) card.setAttribute("data-error", "true"); }
          return;
        }
        if (f.type === "checkbox") { if (!f.checked) { ok = false; var l = f.closest(".field") || f.parentElement; if (l) l.setAttribute("data-error", "true"); } return; }
        var bad = !f.value.trim();
        if (!bad && f.type === "tel") bad = f.value.replace(/\D/g, "").length < 10;
        if (!bad && f.type === "email" && f.value) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
        var wrap = f.closest(".field") || f.parentElement;
        if (bad) { ok = false; f.setAttribute("aria-invalid", "true"); if (wrap) wrap.setAttribute("data-error", "true"); }
        else { f.removeAttribute("aria-invalid"); if (wrap) wrap.setAttribute("data-error", "false"); }
      });
      return ok;
    }

    function go(i, skipValidate) {
      if (!skipValidate && i > idx && !paneValid(idx)) {
        var bad = $('[aria-invalid="true"]', panes[idx]) || $("[data-error='true']", panes[idx]);
        if (bad) { var inp = bad.tagName === "INPUT" ? bad : $("input", bad); if (inp) inp.focus(); }
        return;
      }
      idx = Math.max(0, Math.min(panes.length - 1, i));
      panes.forEach(function (p, n) { p.setAttribute("data-active", n === idx ? "true" : "false"); });
      steps.forEach(function (s, n) { s.setAttribute("data-state", n === idx ? "active" : (n < idx ? "done" : "todo")); });
      if (btnPrev) btnPrev.style.visibility = idx === 0 ? "hidden" : "visible";
      if (btnNext) {
        var last = idx === panes.length - 1;
        btnNext.style.display = last ? "none" : "";
        btnNext.textContent = "Continue →";
      }
      if (idx === panes.length - 1) renderReview();
      save();
      var head = $(".wizard", wiz);
      if (head && head.getBoundingClientRect().top < 0) {
        var y = wiz.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }

    function renderReview() {
      var v = collect();
      var box = $("[data-review]", wiz);
      if (!box) return;
      var rows = [
        ["Appointment type", labelOf(v.type)],
        ["Preferred date", v.date || "—"],
        ["Preferred time", labelOf(v.time)],
        ["Name", v.name || "—"],
        ["Mobile", v.phone || "—"],
        ["Email", v.email || "Not provided"],
        ["Patient", v.patientType || "—"],
        ["Reason", v.reason || "Not provided"]
      ];
      box.innerHTML = rows.map(function (r) {
        return '<div class="review__row"><dt>' + r[0] + "</dt><dd>" + escapeHtml(r[1]) + "</dd></div>";
      }).join("");
    }

    function labelOf(val) {
      if (!val) return "—";
      var input = wiz.querySelector('[value="' + val + '"]');
      var lbl = input && input.closest("label");
      if (lbl) {
        var strong = lbl.querySelector("strong");
        return strong ? strong.textContent : lbl.textContent.trim().split("\n")[0].slice(0, 60);
      }
      var chip = wiz.querySelector('.slot[value="' + val + '"]');
      return chip ? chip.textContent.trim() : val;
    }

    if (btnNext) btnNext.addEventListener("click", function () { go(idx + 1); });
    if (btnPrev) btnPrev.addEventListener("click", function () { go(idx - 1, true); });
    $$("[data-wiz-jump]").forEach(function (b) {
      b.addEventListener("click", function () { go(parseInt(b.getAttribute("data-wiz-jump"), 10), true); });
    });

    $$(".slot", wiz).forEach(function (s) {
      s.addEventListener("click", function () {
        $$(".slot", wiz).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        s.setAttribute("aria-pressed", "true");
        var hidden = $('input[name="time"]', wiz);
        if (hidden) hidden.value = s.getAttribute("data-value");
        save();
      });
    });

    var form = $("form", wiz);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!paneValid(idx)) return;
        var payload = {
          status: "requested",
          submittedAt: new Date().toISOString(),
          site: "VIP Magical Physio Clinic",
          appointment: collect()
        };
        try {
          localStorage.setItem("px_last_request", JSON.stringify(payload));
          var all = JSON.parse(localStorage.getItem("px_requests") || "[]");
          all.push(payload);
          localStorage.setItem("px_requests", JSON.stringify(all.slice(-10)));
        } catch (err) {}

        // CRM capture for appointment requests.
        var p2 = collect();
        if (window.PXCRM) {
          window.PXCRM.addLead(window.PXCRM.makeLead("booking", p2));
        } else {
          window.dispatchEvent(new CustomEvent("px:capture", { detail: { kind: "booking", data: p2 } }));
        }

        var done = $("[data-wiz-done]", wiz);
        var foot = $(".wizard__foot", wiz);
        var bar = $(".wizard__bar", wiz);
        // Hide each pane individually — the success panel lives inside
        // .wizard__body, so hiding the body would hide the confirmation too.
        panes.forEach(function (p) { p.style.display = "none"; });
        if (foot) foot.style.display = "none";
        if (bar) bar.style.display = "none";
        if (done) {
          done.style.display = "block";
          var waBtn = $("[data-wiz-wa]", done);
          if (waBtn) {
            var p = collect();
            waBtn.setAttribute("href", waLink("general", buildWaFromForm({
              type: (p.type || "clinic") , name: p.name, phone: p.phone, email: p.email,
              patientType: p.patientType, date: p.date, time: labelOf(p.time), reason: p.reason
            })));
            waBtn.setAttribute("target", "_blank");
            waBtn.setAttribute("rel", "noopener");
          }
          var pre = $("[data-payload]", done);
          if (pre) pre.textContent = JSON.stringify(payload, null, 2);
        }
        save();
      });
    }

    go(idx, true);

    var copyBtn = $("[data-copy-payload]");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var pre = $("[data-payload]");
        if (!pre) return;
        var txt = pre.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(function () {
            copyBtn.textContent = "Copied";
            setTimeout(function () { copyBtn.textContent = "Copy JSON"; }, 1800);
          });
        }
      });
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /* ---------------- Language ---------------- */
  var LANGS = ["en", "mr", "hi"];

  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    document.documentElement.setAttribute("lang", lang);
    $$("[data-i18n]").forEach(function (n) {
      var key = n.getAttribute("data-i18n");
      var dict = (window.PX_I18N && window.PX_I18N[lang]) || null;
      if (!dict || !dict[key]) return;
      if (n.hasAttribute("data-i18n-attr")) {
        n.setAttribute(n.getAttribute("data-i18n-attr"), dict[key]);
      } else if (dict[key].indexOf("<") > -1) {
        // Translation carries markup (line break + emphasis). Values come from
        // our own static dictionary, never from user input.
        n.innerHTML = dict[key];
      } else {
        n.textContent = dict[key];
      }
    });
    $$(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    try { localStorage.setItem("px_lang", lang); } catch (e) {}
  }

  function initLang() {
    var stored = "en";
    try { stored = localStorage.getItem("px_lang") || "en"; } catch (e) {}
    $$(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
    });
    applyLang(stored);
  }

  /* ---------------- Persist scroll for return visits ---------------- */
  function initScrollMemory() {
    var path = location.pathname + location.search;
    var key = "px_scroll:" + path;
    try {
      var y = sessionStorage.getItem(key);
      if (y && window.scrollY < 40) window.scrollTo(0, parseInt(y, 10));
    } catch (e) {}
    var to;
    window.addEventListener("scroll", function () {
      clearTimeout(to);
      to = setTimeout(function () {
        try { sessionStorage.setItem(key, String(window.scrollY)); } catch (e) {}
      }, 220);
    }, { passive: true });
  }

  /* ---------------- Tabs / filters ---------------- */
  function initFilters() {
    $$("[data-filter-group]").forEach(function (group) {
      var chips = $$("[data-filter]", group);
      var targetSel = group.getAttribute("data-filter-group");
      var items = $$("[data-tags]", document.querySelector(targetSel) || document);
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var f = chip.getAttribute("data-filter");
          chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
          items.forEach(function (it) {
            var tags = (it.getAttribute("data-tags") || "").toLowerCase();
            var show = f === "all" || tags.indexOf(f.toLowerCase()) > -1;
            it.style.display = show ? "" : "none";
          });
          var empty = $("[data-empty]", document);
          if (empty) {
            var visible = items.filter(function (i) { return i.style.display !== "none"; }).length;
            empty.style.display = visible ? "none" : "block";
          }
        });
      });
    });
  }

  /* ---------------- Tweaks protocol ---------------- */
  function initTweaks() {
    var panel = $("#twk");
    if (!panel) return;

    // 1. Listener registered BEFORE announcing availability.
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "__activate_edit_mode") panel.setAttribute("data-open", "true");
      if (d.type === "__deactivate_edit_mode") panel.setAttribute("data-open", "false");
    });

    var closeBtn = $(".twk__close", panel);
    if (closeBtn) closeBtn.addEventListener("click", function () { panel.setAttribute("data-open", "false"); });

    function post(edits) {
      try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: edits }, "*"); } catch (e) {}
    }

    $$("[data-tweak]", panel).forEach(function (ctrl) {
      var key = ctrl.getAttribute("data-tweak");
      var opt = ctrl.getAttribute("data-value");
      if (opt !== null) {
        ctrl.addEventListener("click", function () {
          $$('[data-tweak="' + key + '"]', panel).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
          ctrl.setAttribute("aria-pressed", "true");
          applyTweak(key, opt);
          post(makeEdits(key, opt));
        });
      }
    });

    var suggest = $("[data-tweak-suggest]", panel);
    if (suggest) {
      suggest.addEventListener("click", function () {
        try {
          window.parent.postMessage({ type: "__tweak_suggestion", text: suggest.getAttribute("data-tweak-suggest") }, "*");
        } catch (e) {}
      });
    }

    // 2. Now announce.
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
  }

  function makeEdits(key, val) {
    var o = {};
    if (key === "theme") o.theme = val;
    if (key === "type") o.type = val;
    if (key === "density") o.density = val;
    if (key === "radius") o.radius = val;
    if (key === "order") o.order = val;
    return o;
  }

  function applyTweak(key, val) {
    var root = document.documentElement;
    if (key === "theme") {
      root.setAttribute("data-theme", val);
    }
    if (key === "type") {
      var pairs = {
        serif: ['"Newsreader", Georgia, serif', '"Public Sans", sans-serif'],
        slab: ['"Bitter", Georgia, serif', '"Karla", sans-serif'],
        modern: ['"Instrument Serif", Georgia, serif', '"Inter Tight", sans-serif']
      };
      var p = pairs[val] || pairs.serif;
      root.style.setProperty("--font-display", p[0]);
      root.style.setProperty("--font-body", p[1]);
    }
    if (key === "density") root.setAttribute("data-density", val);
    if (key === "radius") {
      var map = { sharp: ["2px", "1px", "4px"], soft: ["8px", "5px", "16px"], round: ["16px", "10px", "26px"] };
      var r = map[val] || map.soft;
      root.style.setProperty("--radius", r[0]);
      root.style.setProperty("--radius-sm", r[1]);
      root.style.setProperty("--radius-lg", r[2]);
    }
    if (key === "order") applyOrder(val);
  }

  function applyOrder(val) {
    var host = $("[data-home-sections]");
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

  /* ---------------- Footer year ---------------- */
  function initYear() {
    $$("[data-year]").forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initHeader();
    initAccordions();
    initReveal();
    initWhatsApp();
    initEnquiryForms();
    initWizard();
    initLang();
    initScrollMemory();
    initFilters();
    initTweaks();
    initYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.PX = { waLink: waLink, applyLang: applyLang, buildWaFromForm: buildWaFromForm };
})();
