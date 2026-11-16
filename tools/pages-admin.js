/* Admin / lead console generator */
window.GEN = window.GEN || {};

window.GEN.admin = function (ctx) {
  const { lib, SITE, SERVICES } = ctx;
  const { head, header, footer, esc } = lib;
  const rel = "";
  const url = SITE.domain + "/admin.html";

  const html = `${head({
    title: "Lead console | VIP Magical Physio Clinic",
    desc: "Private lead and analytics console.",
    canonical: url,
    noindex: true
  })}
<body class="admin-page">
${header(rel, "", SITE, SERVICES)}

<main id="main">
  <section class="section section--tight">
    <div class="shell">
      <p class="eyebrow">Private · not indexed</p>
      <h1 class="h-2" style="margin-top:.9rem">Lead console</h1>
      <p class="lede" style="margin-top:1rem">Everything captured on this device: appointment requests, enquiry forms, guide and ebook interest. Use this to export leads or verify the capture pipeline before connecting a backend.</p>

      <div class="callout" style="margin-top:1.6rem;max-width:80ch">
        <span class="callout__label">How this works — read once</span>
        Forms on this site do not post to a server. Each enquiry is stored in <strong>this browser's local storage</strong> and simultaneously handed to WhatsApp for you to send. That means leads are captured and never lost, but they live per-device. To pool them across devices, add a Google Apps Script webhook URL to <code>assets/config.js</code> (§ CRM) — then every lead also posts to your private Sheet.
      </div>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-top:2rem" id="stat-grid">
        <div class="card card--flat"><span class="tag">Leads</span><p class="h-2" style="margin-top:.4rem" id="stat-leads">0</p></div>
        <div class="card card--flat"><span class="tag">Bookings</span><p class="h-2" style="margin-top:.4rem" id="stat-bookings">0</p></div>
        <div class="card card--flat"><span class="tag">Enquiries</span><p class="h-2" style="margin-top:.4rem" id="stat-enq">0</p></div>
        <div class="card card--flat"><span class="tag">Tracked events</span><p class="h-2" style="margin-top:.4rem" id="stat-events">0</p></div>
      </div>

      <div class="panel" style="margin-top:1.4rem" id="status-panel"></div>

      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:2.4rem">
        <h2 class="h-3">Captured leads</h2>
        <div class="btn-row">
          <button class="btn btn--primary" type="button" id="btn-export">Export CSV</button>
          <button class="btn btn--ghost" type="button" id="btn-refresh">Refresh</button>
          <button class="btn btn--ghost" type="button" id="btn-clear">Clear local data</button>
        </div>
      </div>

      <div class="table-wrap" style="margin-top:1rem">
        <table>
          <thead>
            <tr><th>When</th><th>Kind</th><th>Name</th><th>Phone</th><th>Type / product</th><th>Preference</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody id="lead-body">
            <tr><td colspan="8" class="muted small" style="padding:2rem;text-align:center">No leads captured on this device yet.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 class="h-3" style="margin-top:2.8rem">Recent tracked events</h2>
      <p class="small muted" style="margin-top:.4rem">A private log of clicks and submissions. This exists even before GA4 is connected, so you can see real behaviour immediately.</p>
      <div class="table-wrap" style="margin-top:1rem">
        <table>
          <thead><tr><th>Time</th><th>Event</th><th>Page</th><th>Detail</th></tr></thead>
          <tbody id="event-body">
            <tr><td colspan="4" class="muted small" style="padding:2rem;text-align:center">No events recorded yet.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 class="h-3" style="margin-top:2.8rem">Integration status</h2>
      <div class="table-wrap" style="margin-top:1rem">
        <table>
          <thead><tr><th>Integration</th><th>State</th><th>What to do</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>GA4 analytics</strong></td>
              <td><span class="pill pill--off" id="st-ga">Not configured</span></td>
              <td class="small muted">Add your Measurement ID to <code>assets/config.js</code>. Tracking is consent-gated.</td>
            </tr>
            <tr>
              <td><strong>CRM webhook</strong></td>
              <td><span class="pill pill--off" id="st-crm">Not configured</span></td>
              <td class="small muted">Add your Apps Script URL to <code>assets/config.js</code>. Leads post automatically once set.</td>
            </tr>
            <tr>
              <td><strong>Google Business Profile</strong></td>
              <td><span class="pill pill--off" id="st-gbp">Not configured</span></td>
              <td class="small muted">Add your place ID and, only if verified, your real rating and count.</td>
            </tr>
            <tr>
              <td><strong>Payments</strong></td>
              <td><span class="pill pill--off">Not connected</span></td>
              <td class="small muted">See DEPLOY.md § Razorpay. Store copy stays honest until this is live.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</main>

<script>
(function(){
  function el(id){return document.getElementById(id);}
  function fmt(t){try{return new Date(t).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});}catch(e){return t;}}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k)||"null")||f;}catch(e){return f;}}

  function paint(){
    var leads = (window.PXCRM ? window.PXCRM.getAll() : read("px_leads", []));
    var events = read("px_events", []);

    el("stat-leads").textContent = leads.length;
    el("stat-bookings").textContent = leads.filter(function(l){return l.kind==="booking";}).length;
    el("stat-enq").textContent = leads.filter(function(l){return l.kind==="enquiry"||l.kind==="contact"||l.kind==="home-visit"||l.kind==="online";}).length;
    el("stat-events").textContent = events.length;

    var body = el("lead-body");
    if(!leads.length){
      body.innerHTML = '<tr><td colspan="8" class="muted small" style="padding:2rem;text-align:center">No leads captured on this device yet. Submit the booking form or an enquiry form to test the pipeline.</td></tr>';
    } else {
      body.innerHTML = leads.slice().reverse().map(function(l){
        var d = l.data || {};
        var pref = [d.date, d.time, d.location].filter(Boolean).join(" · ");
        return '<tr>' +
          '<td class="tiny">' + fmt(l.createdAt) + '</td>' +
          '<td><span class="pill pill--' + (l.kind==="booking"?"soon":"ok") + '">' + l.kind + '</span></td>' +
          '<td class="small">' + (d.name || "—") + '</td>' +
          '<td class="small mono">' + (d.phone || "—") + '</td>' +
          '<td class="tiny">' + (d.product || d.type || d.form || "—") + '</td>' +
          '<td class="tiny">' + (pref || "—") + '</td>' +
          '<td class="tiny" style="max-width:220px">' + (d.reason || "—") + '</td>' +
          '<td><span class="pill pill--soon">' + l.status + '</span></td>' +
        '</tr>';
      }).join("");
    }

    var eb = el("event-body");
    if(!events.length){
      eb.innerHTML = '<tr><td colspan="4" class="muted small" style="padding:2rem;text-align:center">No events recorded yet.</td></tr>';
    } else {
      eb.innerHTML = events.slice(-40).reverse().map(function(ev){
        var p = ev.p || {};
        var detail = Object.keys(p).filter(function(k){return k!=="ts"&&k!=="page"&&k!=="title";})
          .map(function(k){return k+"="+p[k];}).join(", ");
        return '<tr><td class="tiny">' + fmt(p.ts) + '</td><td class="small"><strong>' + ev.e + '</strong></td><td class="tiny mono">' + (p.page||"—") + '</td><td class="tiny">' + (detail||"—") + '</td></tr>';
      }).join("");
    }

    var cfg = window.PX_CONFIG || {};
    var ga = (cfg.analytics && cfg.analytics.ga4Id) || "";
    var crm = (cfg.crm && cfg.crm.endpoint) || "";
    var gbp = (cfg.gbp && cfg.gbp.placeId) || "";
    if(ga){ el("st-ga").className="pill pill--ok"; el("st-ga").textContent="Configured"; }
    if(crm){ el("st-crm").className="pill pill--ok"; el("st-crm").textContent="Configured"; }
    if(gbp){ el("st-gbp").className="pill pill--ok"; el("st-gbp").textContent="Configured"; }

    el("status-panel").innerHTML =
      '<p class="small" style="line-height:1.7"><strong>Pipeline status.</strong> ' +
      'Local capture: <span class="pill pill--ok">Active</span> · ' +
      'WhatsApp handoff: <span class="pill pill--ok">Active</span> · ' +
      'CRM webhook: <span class="pill pill--' + (crm?"ok":"off") + '">' + (crm?"Connected":"Local only") + '</span> · ' +
      'GA4: <span class="pill pill--' + (ga?"ok":"off") + '">' + (ga?"Connected":"Off") + '</span></p>';
  }

  document.addEventListener("DOMContentLoaded", function(){
    paint();
    el("btn-refresh").addEventListener("click", paint);
    el("btn-export").addEventListener("click", function(){
      var n = window.PXCRM ? window.PXCRM.exportCSV() : 0;
      if(!n){ alert("No leads to export yet."); }
    });
    el("btn-clear").addEventListener("click", function(){
      if(confirm("Delete all locally stored leads and events on this device? This cannot be undone.")){
        if(window.PXCRM) window.PXCRM.clear();
        localStorage.removeItem("px_events");
        localStorage.removeItem("px_last_request");
        localStorage.removeItem("px_requests");
        paint();
      }
    });
  });
})();
</script>

${footer(rel, SITE, SERVICES)}`;
  return { path: "admin.html", html: html };
};
