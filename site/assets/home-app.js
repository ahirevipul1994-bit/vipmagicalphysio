/* VIP MAGICAL PHYSIO — Phase 1 front-end
   - EN/MR/HI switching (persisted, URL-aware: /en/ /mr/ /hi/ or ?lang=)
   - 4-step booking wizard prepares a WhatsApp message for visitors to review and send.
   - Analytics: dataLayer events only, never PII. */
(() => {
  const D = window.VIP_I18N;
  const WA = '918624860808';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (event, params = {}) => { (window.dataLayer = window.dataLayer || []).push({ event, ...params }); };

  // ---------- Language ----------
  const pathLang = (location.pathname.match(/^\/(en|mr|hi)(\/|$)/) || [])[1];
  const qLang = new URLSearchParams(location.search).get('lang');
  let storedLang;
  try { storedLang = localStorage.getItem('vip_lang'); } catch {}
  let lang = [qLang, pathLang, storedLang].find(value => Object.hasOwn(D, value)) || 'en';
  const t = (k) => (D[lang][k] ?? D.en[k] ?? k);

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('meta_title');
    $$('[data-i]').forEach(el => {
      const v = t(el.dataset.i);
      if (el.hasAttribute('data-html')) el.innerHTML = v; else el.textContent = v;
    });
    $$('[data-ph]').forEach(el => el.placeholder = t(el.dataset.ph));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    renderConds(); renderServices(); renderSlots();
    if (step === 4) renderSummary();
    const nb = $('#nextBtn span'); if (nb) nb.textContent = step === 4 ? t('send') : t('next');
    const pl = $('#plang'); if (pl && !pl.dataset.touched) pl.value = lang;
    if (!result.hidden) showResult(false);
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => {
    lang = b.dataset.lang;
    try { localStorage.setItem('vip_lang', lang); } catch {}
    const url = new URL(location.href);
    url.pathname = `/${lang}/`;
    url.searchParams.delete('lang');
    history.replaceState(null, '', url);
    applyLang(); track('language_switch', { language: lang });
  }));

  // ---------- Conditions ----------
  // Featured on homepage (i18n keys) → full list comes from generated services-index.js (all 18, 3 languages)
  const CONDS = [
    ['c_back', 'back-pain-physiotherapy'], ['c_neck', 'neck-pain-physiotherapy'], ['c_knee', 'knee-pain-physiotherapy'],
    ['c_shoulder', 'shoulder-pain-physiotherapy'], ['c_stroke', 'stroke-rehabilitation'], ['c_postop', 'post-operative-rehabilitation'],
    ['c_geri', 'geriatric-physiotherapy'], ['c_posture', 'posture-correction'],
  ];
  const SVC = window.VIP_SERVICES || {};
  const qp = new URLSearchParams(location.search);
  var pendingService = qp.get('service') || '';
  const condHref = slug => SVC[slug]?.published === true
    ? `/${lang}/conditions/${slug}/`
    : `/services/${slug === 'posture-correction' ? 'posture-correction-ergonomics' : slug}.html`;
  function renderConds() {
    const el = $('#conds'); if (!el) return;
    el.innerHTML = CONDS.map(([k, slug]) =>
      `<a class="cond" href="${condHref(slug)}"><h3>${t(k)}</h3><span class="go">${t('learn')}</span></a>`).join('');
    document.querySelectorAll('[data-href-conds]').forEach(a => a.href = `/${lang}/conditions/`);
  }

  // ---------- Booking wizard ----------
  const form = $('#bookForm');
  form.addEventListener('submit', event => event.preventDefault());
  let step = 1, slot = null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

  function renderServices() {
    const s = $('#service'); if (!s) return; const v = s.value;
    const list = Object.keys(SVC).length
      ? Object.entries(SVC).map(([slug, L]) => [slug, (L[lang] || L.en).n])
      : CONDS.map(([k, slug]) => [slug, t(k)]);
    s.innerHTML = `<option value="">${t('f_choose')}</option>` + list.map(([slug, n]) => `<option value="${slug}">${n}</option>`).join('') + `<option value="other">${t('svc_other')}</option>`;
    s.value = v || pendingService || '';
  }
  const DEFAULT_SLOTS = ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'];
  function renderSlots() {
    const box = $('#slots'); if (!box) return;
    const disabled = !dateEl.value || !dateEl.validity.valid;
    box.innerHTML = DEFAULT_SLOTS.map(s => `<button type="button" class="slot" data-s="${s}" aria-pressed="${slot === s}" ${disabled ? 'disabled' : ''}>${s}</button>`).join('');
  }
  $('#slots')?.addEventListener('click', e => {
    const b = e.target.closest('.slot'); if (!b || b.disabled) return;
    slot = b.dataset.s; renderSlots(); $('#g-slot').classList.remove('bad');
  });
  const dateEl = $('#date');
  if (dateEl) {
    const min = new Date(today); min.setDate(min.getDate() + 1);
    const max = new Date(today); max.setDate(max.getDate() + 45);
    dateEl.min = iso(min); dateEl.max = iso(max);
    dateEl.addEventListener('change', () => { slot = null; renderSlots(); });
  }
  const typeVal = () => $('input[name=type]:checked')?.value;

  function syncType() {
    const v = typeVal();
    $('#f-areaText').hidden = v !== 'home_visit';
    $('#areaNote').hidden = v !== 'home_visit';
    $('#onlineNote').hidden = v !== 'online';
    $('#g-type').classList.remove('bad');
  }
  $$('input[name=type]').forEach(r => r.addEventListener('change', syncType));
  $('#plang')?.addEventListener('change', e => e.target.dataset.touched = '1');

  // deep-link buttons preselect a type
  $$('[data-type]').forEach(a => a.addEventListener('click', () => {
    if (result.hidden === false) resetForm();
    const r = $(`input[name=type][value="${a.dataset.type}"]`); if (r) { r.checked = true; syncType(); }
    closeDrawer();
  }));

  const setBad = (id, bad) => { const el = $('#' + id); el?.classList.toggle('bad', bad); el?.querySelector('input,select,textarea')?.setAttribute('aria-invalid', String(bad)); return bad; };

  function validate(n) {
    let bad = false;
    if (n === 1) {
      bad = setBad('g-type', !typeVal()) | bad;
      bad = setBad('f-service', !$('#service').value) | bad;
      if (typeVal() === 'home_visit') {
        bad = setBad('f-areaText', $('#areaText').value.trim().length < 2) | bad;
      }
    }
    if (n === 2) bad = setBad('g-slot', !(dateEl.value && dateEl.validity.valid && slot)) | bad;
    if (n === 3) {
      bad = setBad('f-name', $('#name').value.trim().length < 2) | bad;
      bad = setBad('f-age', !$('#age').value) | bad;
      bad = setBad('c-1', !$('#c1').checked) | bad;
      bad = setBad('c-2', !$('#c2').checked) | bad;
    }
    if (bad) form.querySelector('.bad input, .bad select, .bad textarea')?.focus();
    return !bad;
  }

  const typeLabel = { clinic_opd: 't_clinic', home_visit: 't_home', online: 't_online', follow_up: 't_follow' };
  function renderSummary() {
    const svc = $('#service');
    const rows = [
      ['sum_type', t(typeLabel[typeVal()])],
      ['sum_service', svc.options[svc.selectedIndex]?.text],
      typeVal() === 'home_visit' ? ['sum_area', $('#areaText').value] : null,
      ['sum_when', `${$('#date').value} · ${slot}`],
      ['sum_name', $('#name').value.trim()],
    ].filter(Boolean);
    $('#summary').innerHTML = rows.map(([k, v]) => `<dt>${t(k)}</dt><dd>${escapeHtml(v || '—')}</dd>`).join('');
  }
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let booted = false;
  function show(n) {
    step = n;
    $$('.fstep').forEach(f => f.hidden = +f.dataset.step !== n);
    $$('.form__steps span').forEach((s, i) => s.classList.toggle('on', i < n));
    $('#prevBtn').style.visibility = n === 1 ? 'hidden' : 'visible';
    $('#nextBtn span').textContent = n === 4 ? t('send') : t('next');
    if (n === 4) renderSummary();
    form.querySelector(`.fstep[data-step="${n}"] h3`)?.setAttribute('tabindex', '-1');
    if (booted) form.querySelector(`.fstep[data-step="${n}"] h3`)?.focus({ preventScroll: true });
    booted = true;
  }
  $('#prevBtn')?.addEventListener('click', () => show(Math.max(1, step - 1)));
  $('#nextBtn')?.addEventListener('click', () => {
    if (step < 4) { if (validate(step)) show(step + 1); }
    else submit();
  });

  const result = $('#result');
  function showResult(focus = true) {
    $$('.fstep').forEach(f => f.hidden = true);
    $('#formNav').hidden = true;
    result.hidden = false;
    result.innerHTML = `<div class="notice notice--info"><b>${t('off_t')}</b></div><p class="hint">${t('off_p')}</p><a class="btn btn--sage" target="_blank" rel="noopener" href="${waText()}" data-track="whatsapp_booking">${t('off_btn')}</a> <button type="button" class="btn btn--line" id="retry">${t('back')}</button>`;
    if (focus) result.focus();
    $('#retry')?.addEventListener('click', () => { result.hidden = true; $('#formNav').hidden = false; show(4); });
  }
  function resetForm() { form.reset(); slot = null; result.hidden = true; $('#formNav').hidden = false; syncType(); renderSlots(); show(1); }

  function waText() {
    const service = $('#service');
    const preferredLanguage = $('#plang');
    const lines = [
      'Hello Dr. Vipul, appointment request:',
      `Type: ${D.en[typeLabel[typeVal()]]}`,
      `Reason: ${service.options[service.selectedIndex]?.text}`,
      typeVal() === 'home_visit' ? `Locality: ${$('#areaText').value.trim()}` : '',
      `Preferred: ${dateEl.value} ${slot} IST`,
      `Name: ${$('#name').value.trim()}`,
      `Age group: ${$('#age').value}`,
      `Preferred language: ${preferredLanguage.options[preferredLanguage.selectedIndex]?.text}`,
    ].filter(Boolean);
    return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function submit() {
    if (form.elements.namedItem('website').value) return;
    showResult();
  }

  // ---------- Click tracking (no PII) ----------
  document.addEventListener('click', e => { const a = e.target.closest('[data-track]'); if (a) track('cta_click', { cta: a.dataset.track }); });

  // ---------- Drawer ----------
  const drawer = $('#drawer'), mb = $('.menu-btn');
  function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); mb.setAttribute('aria-expanded', 'false'); }
  mb.addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); mb.setAttribute('aria-expanded', 'true'); $('.drawer__close').focus(); });
  $('.drawer__close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', e => { if (e.target === drawer || e.target.closest('a')) closeDrawer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // ---------- Reveal ----------
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // ---------- Deep links: ?service=slug&type=home_visit#book ----------
  applyLang(); show(1);
  const requestedType = $$('input[name=type]').find(input => input.value === qp.get('type'));
  if (requestedType) requestedType.checked = true;
  syncType();
  form.hidden = false;
})();
