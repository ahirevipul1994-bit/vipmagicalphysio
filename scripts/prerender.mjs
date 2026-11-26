import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve('dist/public');
const site = 'https://vipmagicalphysio.com';
const pages = [
  ['/', 'Physiotherapy in Shirur', 'Physiotherapy with Dr. Vipul Ahire (Physio) in Shirur, Pune. Request clinic care, a home visit or an online consultation.'],
  ['/about','About Dr. Vipul Ahire (Physio)','Learn about VIP Magical Physio and its approach to accessible, ethical physiotherapy in Shirur.'],
  ['/services','Physiotherapy services','Explore orthopaedic, neurological, post-operative and geriatric physiotherapy, home visits and online consultations.'],
  ['/services/orthopaedic-physiotherapy','Orthopaedic physiotherapy','Individual assessment and movement-focused support for joint, muscle and back concerns in Shirur.'],
  ['/services/neurological-rehabilitation','Neurological rehabilitation','Goal-led rehabilitation for movement, balance and everyday independence, alongside your medical team.'],
  ['/services/post-operative-rehabilitation','Post-operative rehabilitation','A gradual return to everyday movement following assessment and the advice of your surgical team.'],
  ['/services/geriatric-physiotherapy','Geriatric physiotherapy','Support for strength, balance and confident movement as you age. Progress and needs are individual.'],
  ['/services/home-visit-physiotherapy','Home visit physiotherapy in Shirur','Request physiotherapy at home in Shirur. Availability and timing are confirmed personally after your request.'],
  ['/services/online-consultation','Online physiotherapy consultation','Discuss your movement goals remotely where clinically appropriate. An in-person assessment may be recommended.'],
  ['/education/pain','Understanding pain','Pain is a personal experience. Learning about movement and seeking individual professional assessment can help you understand your options.'],
  ['/education/exercise','Exercise education','Choose movement appropriate to your ability. Start gradually, seek professional guidance and stop if activity causes concerning symptoms.'],
  ['/education/healthy-ageing','Healthy ageing','Practical education about strength, balance and everyday movement for older adults and their caregivers.'],
  ['/blog','Movement and wellbeing education','Read general education about everyday movement and rehabilitation. Educational content is not a diagnosis or personal treatment plan.'],
  ['/videos','Physiotherapy videos and playlists','Watch service-related videos from Dr. Vipul Ahire’s verified public channel playlists. Educational information only; individual results vary.'],
  ['/ebooks','Educational e-books','Digital guides are not yet available to buy. No payment or checkout is enabled in this release.'],
  ['/faqs','Frequently asked questions','Find out how appointment requests, home visits and online consultation enquiries work at VIP Magical Physio.'],
  ['/contact','Contact VIP Magical Physio','Send an administrative enquiry about physiotherapy in Shirur. Do not share medical records or sensitive clinical information in website forms.'],
  ['/book','Request an appointment','Request clinic care, a home visit or an online consultation. A request is not a confirmed appointment.'],
  ['/privacy','Privacy policy draft','Draft for owner and legal review. Requests collect administrative contact details and consent, not clinical records.'],
  ['/terms','Terms draft','Draft for owner and legal review. Website education is not a substitute for an individual professional assessment.'],
  ['/refund','Refund policy draft','Draft for owner and legal review. Digital payments are not enabled; ask about terms before paying for services.'],
];
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shell=await readFile(path.join(output,'index.html'),'utf8');
for(const [route,title,description] of pages){
  const url=site+(route==='/'?'':route);
  let html=shell.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)} | VIP MAGICAL PHYSIO</title>`)
    .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(description)}">`)
    .replace(/<meta property="og:title"[^>]*>/,`<meta property="og:title" content="${escape(title)} | VIP MAGICAL PHYSIO">`)
    .replace(/<meta property="og:description"[^>]*>/,`<meta property="og:description" content="${escape(description)}">`);
  html=html.replace('</head>',`<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"><meta name="twitter:card" content="summary_large_image"><meta property="og:image" content="${escape(site)}/images/hero-movement.jpg"></head>`);
  // A factual static fallback is available without JS; React replaces it on mount.
  html=html.replace('<div id="root"></div>',`<div id="root"><main style="max-width:760px;margin:60px auto;padding:24px;font:20px/1.7 sans-serif;color:#19483f"><p>VIP MAGICAL PHYSIO · Shirur, Pune</p><h1>${escape(title)}</h1><p>${escape(description)}</p><p>Dr. Vipul Ahire (Physio) · English, Hindi and Marathi</p><nav><a href="/">Home</a> · <a href="/services">Services</a> · <a href="/book">Request an appointment</a> · <a href="/privacy">Privacy</a></nav><p>Enable JavaScript to use request forms and language switching. If you have urgent medical concerns, seek local medical assistance rather than using this form.</p></main></div>`);
  const dir=route==='/'?output:path.join(output,route);
  await mkdir(dir,{recursive:true}); await writeFile(path.join(dir,'index.html'),html);
}
await writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([r])=>`<url><loc>${escape(site+(r==='/'?'':r))}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${site}/sitemap.xml\n`);
const admin=path.join(output,'admin'); await mkdir(admin,{recursive:true});
const noindex=shell.replace(/<meta name="robots"[^>]*>/,'').replace('</head>','<meta name="robots" content="noindex,nofollow"></head>');
await writeFile(path.join(admin,'index.html'),noindex);
await writeFile(path.join(output,'404.html'),noindex.replace('<div id="root"></div>','<div id="root"><main><h1>Page not found</h1><a href="/">Back to the VIP Magical Physio home page</a></main></div>'));
console.log(`Generated ${pages.length} static route summaries and metadata; intended site ${site} (not a deployment verification).`);
