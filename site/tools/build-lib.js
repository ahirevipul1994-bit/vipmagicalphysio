/* Shared build helpers (Node + in-browser test runner) */
(function (root) {
  const SITE = 'https://vipmagicalphysio.com';
  const LEGACY = ['/about', '/contact', '/faq', '/resources', '/videos', '/blog', '/ebooks', '/booking', '/home-visit', '/online-consultation', '/services',
    '/privacy-policy', '/terms', '/medical-disclaimer', '/refund-policy',
    '/blog/back-pain-when-to-consult-a-physiotherapist', '/blog/knee-pain-understanding-movement-and-rehabilitation',
    '/blog/stroke-rehabilitation-what-families-should-know', '/blog/safe-exercise-for-older-adults', '/blog/balance-training-and-fall-prevention',
    '/blog/posture-myths-and-practical-advice', '/blog/physiotherapy-after-knee-replacement', '/blog/home-exercise-programme-common-mistakes',
    '/blog/neck-pain-and-smartphone-use', '/blog/understanding-physiotherapy-assessment',
    '/services/back-pain-physiotherapy', '/services/neck-pain-physiotherapy', '/services/knee-pain-physiotherapy',
    '/services/shoulder-pain-physiotherapy', '/services/stroke-rehabilitation', '/services/orthopaedic-rehabilitation',
    '/services/post-operative-rehabilitation', '/services/geriatric-physiotherapy', '/services/balance-and-fall-prevention',
    '/services/home-visit-physiotherapy', '/services/online-physiotherapy-consultation', '/services/posture-correction-ergonomics'].map(route => `${route}.html`);
  const DESC = {
    en: 'Assessment-led physiotherapy and rehabilitation in Shirur, Pune District. Clinic OPD, home visits and online consultation with Dr. Vipul Ahire (Physio). Call 86248 60808.',
    mr: 'शिरूर, पुणे जिल्हा येथे तपासणी-आधारित फिजिओथेरपी व पुनर्वसन. क्लिनिक OPD, घरी भेट आणि ऑनलाइन सल्ला — डॉ. विपुल अहिरे (फिजिओ). फोन 86248 60808.',
    hi: 'शिरूर, पुणे ज़िले में जाँच-आधारित फिजियोथेरेपी और पुनर्वास। क्लिनिक OPD, घर पर विज़िट और ऑनलाइन परामर्श — डॉ. विपुल अहिरे (फिजियो)। कॉल 86248 60808।',
  };
  const LOC = { en: 'en_IN', mr: 'mr_IN', hi: 'hi_IN' };

  function buildLangHomes(src, I18N) {
    const out = {};
    ['en', 'mr', 'hi'].forEach(l => {
      let h = src
        .replace('<html lang="en">', `<html lang="${l}">`)
        .replace(/<title>[^<]*<\/title>/, `<title>${I18N[l].meta_title}</title>`)
        .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${DESC[l]}">`)
        .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${SITE}/${l}/">`)
        .replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${LOC[l]}">`)
        .replace(/(href|src)="assets\//g, '$1="../assets/')
        .replace(/href="\/en\/conditions\/"/g, `href="/${l}/conditions/"`);
      out[`${l}/index.html`] = h;
    });
    return out;
  }
  const api = { buildLangHomes, LEGACY };
  if (typeof module !== 'undefined') module.exports = api; else root.VIP_BUILDLIB = api;
})(typeof window !== 'undefined' ? window : globalThis);
