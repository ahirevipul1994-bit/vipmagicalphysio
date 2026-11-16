/* =========================================================
   BUILD RUNNER — runs in run_script (node-like sandbox)
   ========================================================= */
(async function () {
  const OUT = [];

  // Load modules by evaluating their source in this scope.
  async function load(path) {
    const src = await readFile(path);
    return src;
  }

  // ---- evaluate lib ----
  const libSrc = await load("tools/lib.js");
  const libMod = { exports: {} };
  new Function("module", "exports", libSrc)(libMod, libMod.exports);
  const lib = libMod.exports;

  // ---- evaluate data ----
  const dataSrc = await load("assets/data.js");
  const sandboxWindow = {};
  new Function("window", dataSrc)(sandboxWindow);
  const { SITE, SERVICES } = sandboxWindow.PX_DATA;

  // ---- evaluate content ----
  const contentSrc = await load("assets/content.js");
  new Function("window", contentSrc)(sandboxWindow);
  const { ARTICLES } = sandboxWindow.PX_CONTENT;

  const ctx = { lib, SITE, SERVICES, ARTICLES };

  // ---- evaluate page generators ----
  const genWindow = {};
  const genFiles = [
    "tools/pages-home.js",
    "tools/pages-service.js",
    "tools/pages-booking.js",
    "tools/pages-store.js",
    "tools/pages-misc.js",
    "tools/pages-blog.js",
    "tools/pages-legal.js",
    "tools/pages-admin.js"
  ];
  for (const f of genFiles) {
    const src = await load(f);
    new Function("window", src)(genWindow);
  }
  const GEN = genWindow.GEN;
  const EBOOKS = genWindow.EBOOKS;

  const results = [];

  // ---- pages ----
  const push = (r) => { if (r && r.path) results.push(r); };

  push(GEN.home(ctx));
  push(GEN.servicesIndex(ctx));
  SERVICES.forEach((s) => push(GEN.servicePage(ctx, s)));
  push(GEN.booking(ctx));
  push(GEN.homeVisit(ctx));
  push(GEN.online(ctx));
  push(GEN.ebooks(ctx));
  EBOOKS.forEach((b) => push(GEN.ebookDetail(ctx, b)));
  push(GEN.about(ctx));
  push(GEN.contact(ctx));
  push(GEN.faq(ctx));
  push(GEN.videos(ctx));
  push(GEN.resources(ctx));
  push(GEN.blog(ctx));
  ARTICLES.forEach((a) => push(GEN.article(ctx, a)));
  GEN.legal(ctx).forEach(push);
  push(GEN.notFound(ctx));
  push(GEN.admin(ctx));

  // ---- write ----
  let bytes = 0;
  for (const r of results) {
    await saveFile(r.path, r.html);
    bytes += r.html.length;
  }

  // ---- sitemap ----
  const urls = [
    { loc: "/", pri: "1.0", freq: "weekly" },
    { loc: "/services.html", pri: "0.9", freq: "monthly" },
    { loc: "/booking.html", pri: "0.9", freq: "monthly" },
    { loc: "/home-visit.html", pri: "0.9", freq: "monthly" },
    { loc: "/online-consultation.html", pri: "0.8", freq: "monthly" },
    { loc: "/about.html", pri: "0.8", freq: "yearly" },
    { loc: "/contact.html", pri: "0.8", freq: "yearly" },
    { loc: "/ebooks.html", pri: "0.7", freq: "monthly" },
    { loc: "/blog.html", pri: "0.7", freq: "weekly" },
    { loc: "/videos.html", pri: "0.7", freq: "weekly" },
    { loc: "/faq.html", pri: "0.6", freq: "monthly" },
    { loc: "/resources.html", pri: "0.6", freq: "monthly" }
  ].concat(
    SERVICES.map((s) => ({ loc: "/services/" + s.slug + ".html", pri: "0.8", freq: "monthly" })),
    ARTICLES.map((a) => ({ loc: "/blog/" + a.slug + ".html", pri: "0.6", freq: "yearly", mod: a.updated })),
    [
      { loc: "/privacy-policy.html", pri: "0.3", freq: "yearly" },
      { loc: "/terms.html", pri: "0.3", freq: "yearly" },
      { loc: "/medical-disclaimer.html", pri: "0.3", freq: "yearly" },
      { loc: "/refund-policy.html", pri: "0.3", freq: "yearly" }
    ]
  );

  const today = "2026-11-16";
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE.domain}${u.loc}</loc>
    <lastmod>${u.mod || today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join("\n")}
</urlset>
`;
  await saveFile("sitemap.xml", sitemap);

  const robots = `# robots.txt — VIP Magical Physio Clinic
User-agent: *
Allow: /

# Private lead console — never indexed.
Disallow: /admin.html

# Draft ebook detail pages are excluded from search until the store is live.
Disallow: /ebooks/

Sitemap: ${SITE.domain}/sitemap.xml
`;
  await saveFile("robots.txt", robots);

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0B2239"/>
  <path d="M18 44V20h7.6l6.4 13.6L38.4 20H46v24h-6.6V31.4L34.4 44h-4.8l-5-12.6V44H18z" fill="#FBFAF7"/>
  <circle cx="32" cy="50.5" r="2.6" fill="#0B6E63"/>
</svg>`;
  await saveFile("assets/favicon.svg", favicon);

  log("Pages written: " + results.length);
  log("Total bytes: " + Math.round(bytes / 1024) + " KB");
  log("Sitemap URLs: " + urls.length);
  log("Sample paths: " + results.slice(0, 6).map((r) => r.path).join(", "));
})();
