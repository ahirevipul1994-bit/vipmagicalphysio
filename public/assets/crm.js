/* =========================================================
   CRM — lead capture, local queue, CSV export, admin console
   Works with zero backend. Upgrades to Google Sheets
   the moment a webhook URL is added to assets/config.js.
   ========================================================= */
(function () {
  "use strict";

  var CFG = (window.PX_CONFIG || {}).crm || {};
  var ENDPOINT = String(CFG.endpoint || "").trim();
  var QUEUE_KEY = "px_crm_queue";
  var LEADS_KEY = "px_leads";

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------- Lead object ---------- */
  function makeLead(kind, data) {
    return {
      id: "px-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      status: "REQUESTED",
      kind: kind,                       // booking | enquiry | guide | ebook | contact
      createdAt: new Date().toISOString(),
      source: location.pathname,
      referrer: document.referrer || "direct",
      consent: true,
      data: data || {}
    };
  }

  function saveLead(lead) {
    var leads = read(LEADS_KEY, []);
    leads.push(lead);
    if (leads.length > 500) leads = leads.slice(-500);
    write(LEADS_KEY, leads);

    if (ENDPOINT) {
      postToCRM(lead);
    } else {
      var q = read(QUEUE_KEY, []);
      q.push(lead.id);
      write(QUEUE_KEY, q);
    }
    window.dispatchEvent(new CustomEvent("px:lead", { detail: lead }));
    return lead;
  }

  function postToCRM(lead) {
    if (!ENDPOINT || !CFG.autoPost) return Promise.resolve(false);
    // text/plain avoids a CORS preflight against Apps Script.
    return fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(lead)
    }).then(function () {
      var q = read(QUEUE_KEY, []);
      write(QUEUE_KEY, q.filter(function (id) { return id !== lead.id; }));
      return true;
    }).catch(function () { return false; });
  }

  /* ---------- CSV ---------- */
  function toCSV(rows) {
    if (!rows.length) return "";
    var cols = ["id", "createdAt", "status", "kind", "source", "name", "phone", "email", "type", "date", "time", "location", "reason", "product"];
    var head = cols.join(",");
    var body = rows.map(function (r) {
      var d = r.data || {};
      return cols.map(function (c) {
        var v;
        if (c === "id" || c === "createdAt" || c === "status" || c === "kind" || c === "source") v = r[c];
        else v = d[c];
        if (v == null) v = "";
        v = String(v).replace(/"/g, '""');
        return '"' + v + '"';
      }).join(",");
    }).join("\n");
    return head + "\n" + body + "\n";
  }

  window.PXCRM = {
    addLead: saveLead,
    makeLead: makeLead,
    getAll: function () { return read(LEADS_KEY, []); },
    clear: function () { write(LEADS_KEY, []); write(QUEUE_KEY, []); },
    exportCSV: function () {
      var rows = read(LEADS_KEY, []);
      if (!rows.length) return null;
      var blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "vip-magical-physio-leads-" + new Date().toISOString().slice(0, 10) + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      return rows.length;
    },
    endpointConfigured: !!ENDPOINT,
    pendingCount: function () { return read(QUEUE_KEY, []).length; }
  };

  /* ---------- Auto-capture from site forms ---------- */
  function boot() {
    window.addEventListener("px:capture", function (e) {
      var d = e.detail || {};
      saveLead(d.kind || "enquiry", d.data || {});
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
