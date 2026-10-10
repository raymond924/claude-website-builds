/* Lindani Farm: on-page demo features.
   Booking concierge, availability checker, booking request, book-direct note
   and language switcher. Runs entirely in the browser: no backend, no
   API keys. All content comes from lodge-data.js (window.LODGE). */
(function () {
  'use strict';
  var D = window.LODGE;
  if (!D) return;

  /* ---------- small helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;            // only ever used with text from lodge-data.js
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  var money = (function () {
    var f;
    try { f = new Intl.NumberFormat(D.currency.locale, { style: 'currency', currency: D.currency.code, maximumFractionDigits: 0 }); }
    catch (e) { f = { format: function (n) { return 'R ' + Math.round(n); } }; }
    return function (n) { return f.format(Math.round(n)); };
  })();
  function fill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  var store = {
    get: function (area, key) { try { var v = window[area].getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (area, key, val) { try { window[area].setItem(key, JSON.stringify(val)); } catch (e) {} }
  };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 0;
  function nid(p) { return (p || 'f') + '-' + (++uid); }

  /* ---------- dates (YYYY-MM-DD strings, UTC maths so time zones never shift a day) ---------- */
  function toMs(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function toStr(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function addDays(s, n) { return toStr(toMs(s) + n * 864e5); }
  function nightsBetween(a, b) { return Math.round((toMs(b) - toMs(a)) / 864e5); }
  function today() { var d = new Date(); return toStr(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }
  function fmtDate(s) {
    try { return new Date(toMs(s)).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); }
    catch (e) { return s; }
  }
  function weekday(s) { return new Date(toMs(s)).getUTCDay(); }

  /* ---------- rates and availability ---------- */
  function seasonMultiplier(dateStr) {
    var md = dateStr.slice(5);
    for (var i = 0; i < D.seasons.length; i++) {
      var s = D.seasons[i];
      var inside = s.from <= s.to ? (md >= s.from && md <= s.to) : (md >= s.from || md <= s.to);
      if (inside) return s.multiplier;
    }
    return 1;
  }
  function stayPrice(room, from, to) {
    var total = 0, n = nightsBetween(from, to);
    for (var i = 0; i < n; i++) total += room.rate * seasonMultiplier(addDays(from, i));
    return Math.round(total);
  }
  function isFree(roomId, from, to) {
    return !D.booked.some(function (b) { return b.room === roomId && from < b.to && to > b.from; });
  }
  function freeRooms(from, to) { return D.rooms.filter(function (r) { return isFree(r.id, from, to); }); }
  // Cheapest set of free studios that fits the party (four studios = 15 combinations, so try them all).
  function bestCombo(rooms, adults, kids, from, to) {
    var best = null;
    for (var mask = 1; mask < (1 << rooms.length); mask++) {
      var set = rooms.filter(function (r, i) { return mask & (1 << i); });
      var maxA = set.reduce(function (a, r) { return a + r.maxAdults; }, 0);
      var beds = set.reduce(function (a, r) { return a + r.sleeps; }, 0);
      if (maxA < adults || beds < adults + kids) continue;
      var price = set.reduce(function (a, r) { return a + stayPrice(r, from, to); }, 0);
      if (!best || set.length < best.rooms.length || (set.length === best.rooms.length && price < best.price)) best = { rooms: set, price: price };
    }
    return best;
  }
  function otaSaving(direct) {
    var c = (D.booking.otaCommissionPercent || 0) / 100;
    return c > 0 && c < 1 ? Math.round(direct / (1 - c) - direct) : 0;
  }
  function validStay(from, to) {
    if (!from || !to) return 'Choose an arrival and a departure date.';
    if (from < today()) return 'Arrival can\'t be in the past.';
    var n = nightsBetween(from, to);
    if (n < 1) return 'Departure needs to be after arrival.';
    if (n < D.booking.minNights) return 'The minimum stay is ' + D.booking.minNights + ' nights.';
    if (n > D.booking.maxNights) return 'For stays longer than ' + D.booking.maxNights + ' nights, please contact us directly.';
    return '';
  }

  /* ---------- date range picker ----------
     Replaces each pair of native date inputs with two buttons that open one
     calendar. The native inputs stay in the form (hidden) and keep the values,
     so every form reads its dates exactly as before. */
  var picker = (function () {
    var DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var pairs = [], st = null, pop, backdrop, monthsEl, hintEl, sumEl, doneBtn;
    var MAXD = 540;
    function fullNight(d) { return D.rooms.every(function (r) { return !isFree(r.id, d, addDays(d, 1)); }); }
    function firstFullAfter(from) {
      for (var i = 1; i <= D.booking.maxNights; i++) { var n = addDays(from, i); if (fullNight(n)) return n; }
      return addDays(from, D.booking.maxNights);
    }
    function monthStart(d) { return d.slice(0, 8) + '01'; }
    function addMonths(m, k) { var y = +m.slice(0, 4), mo = +m.slice(5, 7) - 1 + k; y += Math.floor(mo / 12); mo = ((mo % 12) + 12) % 12; return y + '-' + String(mo + 1).padStart(2, '0') + '-01'; }
    function monthName(m) { try { return new Date(toMs(m)).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric', timeZone: 'UTC' }); } catch (e) { return m.slice(0, 7); } }
    function longDate(d) { try { return new Date(toMs(d)).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); } catch (e) { return d; } }
    function wide() { return window.innerWidth >= 760; }
    function asStart(d) { return d < today() || d > addDays(today(), MAXD) || fullNight(d); }
    function disabled(d) {
      if (st.step === 'to' && st.from && d > st.from) return d < addDays(st.from, Math.max(1, D.booking.minNights)) || d > firstFullAfter(st.from);
      return asStart(d);
    }
    function svgIcon() {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'dp-ico');
      s.innerHTML = '<rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.5"/>';
      return s;
    }
    function attach(a, b) {
      if (!a || !b || a._dp) return;
      var pair = { a: a, b: b, btns: {} };
      [['from', a], ['to', b]].forEach(function (x) {
        var which = x[0], input = x[1];
        var lab = input.labels && input.labels[0] ? input.labels[0].textContent.replace('*', '').trim() : (which === 'from' ? 'Arrive' : 'Leave');
        var btn = el('button', { type: 'button', class: 'dp-trigger' }, [el('span', { class: 'dp-val' }), svgIcon()]);
        btn._lab = lab;
        btn.addEventListener('click', function () { open(pair, which, btn); });
        input.classList.add('dp-native'); input.setAttribute('tabindex', '-1'); input.setAttribute('aria-hidden', 'true');
        input.addEventListener('focus', function () { btn.focus(); });
        input.after(btn);
        input._dp = pair; pair.btns[which] = btn;
      });
      pairs.push(pair); sync(pair);
    }
    function sync(pair) {
      [['from', pair.a], ['to', pair.b]].forEach(function (x) {
        var btn = pair.btns[x[0]], v = x[1].value;
        $('.dp-val', btn).textContent = v ? fmtDate(v) : 'Add date';
        btn.classList.toggle('is-empty', !v);
        btn.setAttribute('aria-label', btn._lab + ': ' + (v ? longDate(v) : 'not chosen') + '. Open calendar');
      });
    }
    function syncAll() { pairs = pairs.filter(function (p) { return document.body.contains(p.a); }); pairs.forEach(sync); }

    function build() {
      backdrop = el('div', { class: 'dp-backdrop', hidden: true, onclick: function () { close(true); } });
      hintEl = el('p', { class: 'dp-hint', 'aria-live': 'polite' });
      monthsEl = el('div', { class: 'dp-months' });
      sumEl = el('p', { class: 'dp-sum' });
      doneBtn = el('button', { type: 'button', class: 'fx-btn fx-btn-book', text: 'Done', onclick: function () { close(true); } });
      pop = el('div', { class: 'dp-pop', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Choose your dates', hidden: true }, [
        el('div', { class: 'dp-top' }, [
          el('button', { type: 'button', class: 'dp-nav', 'aria-label': 'Previous month', html: '&#8249;', onclick: function () { shift(-1); } }),
          hintEl,
          el('button', { type: 'button', class: 'dp-nav', 'aria-label': 'Next month', html: '&#8250;', onclick: function () { shift(1); } })
        ]),
        monthsEl,
        el('p', { class: 'dp-legend' }, [el('span', { class: 'dp-key', 'aria-hidden': 'true', text: '12' }), ' Fully booked' + (D.showDemoNotice ? ' · sample calendar' : '')]),
        el('div', { class: 'dp-foot' }, [sumEl, el('div', { class: 'dp-foot-btns' }, [
          el('button', { type: 'button', class: 'fx-btn fx-btn-ghost', text: 'Clear', onclick: function () { st.from = ''; st.to = ''; st.step = 'from'; render(); } }),
          doneBtn])])
      ]);
      pop.addEventListener('keydown', onKey);
      monthsEl.addEventListener('mouseover', function (e) {
        var d = e.target.closest('[data-d]');
        if (st && st.step === 'to' && st.from && d) { st.hover = d.getAttribute('data-d'); paint(); }
      });
      monthsEl.addEventListener('mouseleave', function () { if (st) { st.hover = ''; paint(); } });
      document.body.appendChild(backdrop); document.body.appendChild(pop);
      window.addEventListener('resize', function () { if (st) { render(); place(); } });
      window.addEventListener('scroll', function () { if (st && wide()) place(); }, { passive: true });
      document.addEventListener('mousedown', function (e) {
        if (st && wide() && !pop.contains(e.target) && !e.target.closest('.dp-trigger')) close(true);
      });
    }
    function open(pair, which, btn) {
      if (!pop) build();
      var a = pair.a.value, b = pair.b.value;
      st = { pair: pair, btn: btn, from: a, to: b, step: which === 'to' && a ? 'to' : 'from', hover: '' };
      var focus = (which === 'to' && b) ? b : (a || today());
      st.view = monthStart(focus < today() ? today() : focus);
      st.focus = focus < today() ? today() : focus;
      pop.hidden = false; backdrop.hidden = wide();
      document.documentElement.classList.toggle('dp-lock', !wide());
      render(); place(); focusDay();
    }
    function close(commitPartial) {
      if (!st) return;
      var s0 = st; st = null;
      if (commitPartial !== false) commit(s0);
      pop.hidden = true; backdrop.hidden = true; document.documentElement.classList.remove('dp-lock');
      s0.btn.focus();
    }
    function commit(s0) {
      var p = s0.pair;
      if (p.a.value !== s0.from) { p.a.value = s0.from; p.a.dispatchEvent(new Event('change', { bubbles: true })); p.a.dispatchEvent(new Event('input', { bubbles: true })); }
      if (s0.to || !s0.from) { if (p.b.value !== s0.to) { p.b.value = s0.to; p.b.dispatchEvent(new Event('change', { bubbles: true })); p.b.dispatchEvent(new Event('input', { bubbles: true })); } }
      syncAll();
    }
    function place() {
      if (!wide()) { pop.style.cssText = ''; pop.classList.add('dp-sheet'); return; }
      pop.classList.remove('dp-sheet');
      var r = st.btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
      var left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
      var top = r.bottom + 8;
      if (top + h > window.innerHeight - 8 && r.top - h - 8 > 8) top = r.top - h - 8;
      if (top + h > window.innerHeight - 8) top = Math.max(8, window.innerHeight - h - 8);
      pop.style.left = left + 'px'; pop.style.top = top + 'px';
    }
    function shift(k) { st.view = addMonths(st.view, k); st.focus = addMonths(st.focus.slice(0, 8) + '01', k); render(); }
    function render() {
      var n = wide() ? 2 : 1;
      monthsEl.innerHTML = '';
      monthsEl.style.gridTemplateColumns = 'repeat(' + n + ',minmax(0,1fr))';
      for (var k = 0; k < n; k++) {
        var m = addMonths(st.view, k), days = el('div', { class: 'dp-days' });
        DAY.forEach(function (d) { days.appendChild(el('span', { class: 'dp-dow', 'aria-hidden': 'true', text: d.slice(0, 2) })); });
        var lead = (weekday(m) + 6) % 7;
        for (var i = 0; i < lead; i++) days.appendChild(el('span', { class: 'dp-pad' }));
        for (var d = m; d.slice(0, 7) === m.slice(0, 7); d = addDays(d, 1)) {
          days.appendChild(el('button', { type: 'button', class: 'dp-day', 'data-d': d, tabindex: '-1', text: String(+d.slice(8)),
            onclick: (function (dd) { return function () { pick(dd); }; })(d) }));
        }
        monthsEl.appendChild(el('div', { class: 'dp-month' }, [el('p', { class: 'dp-mname', text: monthName(m) }), days]));
      }
      var first = st.view, last = addMonths(st.view, n);
      if (st.focus < first || st.focus >= last) st.focus = first < today() ? today() : first;
      $$('.dp-nav', pop)[0].disabled = st.view <= monthStart(today());
      paint();
    }
    function paint() {
      var lo = st.from, hi = st.to || (st.step === 'to' && st.hover > st.from ? st.hover : '');
      $$('.dp-day', monthsEl).forEach(function (b) {
        var d = b.getAttribute('data-d'), full = fullNight(d), dis = disabled(d);
        b.disabled = dis;
        b.classList.toggle('is-full', full);
        b.classList.toggle('is-today', d === today());
        b.classList.toggle('is-start', d === lo);
        b.classList.toggle('is-end', !!hi && d === hi);
        b.classList.toggle('in-range', !!(lo && hi && d > lo && d < hi));
        b.setAttribute('tabindex', d === st.focus ? '0' : '-1');
        b.setAttribute('aria-pressed', d === lo || d === st.to ? 'true' : 'false');
        b.setAttribute('aria-label', longDate(d) + (full ? ', fully booked' : '') + (d === lo ? ', arrival' : '') + (d === st.to ? ', departure' : '') + (dis && !full ? ', not available' : ''));
      });
      var nights = st.from && st.to ? nightsBetween(st.from, st.to) : 0;
      hintEl.textContent = st.step === 'from' || !st.from ? 'Choose your arrival date' : 'Now choose your departure date' + (D.booking.minNights > 1 ? ' (minimum ' + D.booking.minNights + ' nights)' : '');
      sumEl.textContent = st.from ? fmtDate(st.from) + ' → ' + (st.to ? fmtDate(st.to) + ' · ' + nights + ' night' + (nights > 1 ? 's' : '') : '…') : 'No dates chosen';
      doneBtn.textContent = st.from && !st.to ? 'Done (arrival only)' : 'Done';
    }
    function focusDay() {
      var b = $('.dp-day[data-d="' + st.focus + '"]', monthsEl);
      if (b) b.focus({ preventScroll: true });
    }
    function pick(d) {
      if (st.step === 'to' && st.from && d > st.from) {
        st.to = d; st.focus = d; paint();
        setTimeout(function () { close(true); }, reduceMotion ? 0 : 220);
      } else {
        st.from = d; st.to = ''; st.step = 'to'; st.focus = d; st.hover = ''; paint(); focusDay();
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(false); return; }
      if (e.key === 'Tab') {
        var f = $$('button:not([disabled])', pop).filter(function (b) { return !b.classList.contains('dp-day') || b.getAttribute('tabindex') === '0'; });
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        return;
      }
      if (!e.target.classList.contains('dp-day')) return;
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      var d = st.focus;
      if (step) d = addDays(d, step);
      else if (e.key === 'PageUp') d = addMonths(monthStart(d), -1).slice(0, 8) + d.slice(8);
      else if (e.key === 'PageDown') d = addMonths(monthStart(d), 1).slice(0, 8) + d.slice(8);
      else if (e.key === 'Home') d = addDays(d, -((weekday(d) + 6) % 7));
      else if (e.key === 'End') d = addDays(d, 6 - ((weekday(d) + 6) % 7));
      else return;
      e.preventDefault();
      if (d < today()) d = today();
      var n = wide() ? 2 : 1;
      if (monthStart(d) < st.view) st.view = monthStart(d);
      if (monthStart(d) >= addMonths(st.view, n)) st.view = addMonths(monthStart(d), 1 - n);
      st.focus = d;
      if (!$('.dp-day[data-d="' + d + '"]', monthsEl)) render(); else paint();
      if (st.step === 'to' && st.from) { st.hover = d; paint(); }
      focusDay();
    }
    return { attach: attach, syncAll: syncAll };
  })();

  function nextOpenings(q) {
    var n = nightsBetween(q.from, q.to), found = [];
    for (var i = 1; i <= 60 && found.length < 2; i++) {
      var a = addDays(q.from, i), b = addDays(a, n);
      if (bestCombo(freeRooms(a, b), q.adults, q.kids, a, b)) { found.push(a); i += n; }
    }
    return found.map(function (a) { return { from: a, to: addDays(a, n) }; });
  }

  /* ---------- language ---------- */
  var LANGS = { en: 'EN', de: 'DE', nl: 'NL', af: 'AF' };
  var NAMES = { en: 'English', de: 'Deutsch', nl: 'Nederlands', af: 'Afrikaans' };
  var lang = store.get('localStorage', 'lindani-lang');
  if (!D.i18n[lang]) lang = 'en';
  function t(key, vars) {
    var s = (D.i18n[lang] && D.i18n[lang][key]) || D.i18n.en[key] || key;
    return vars ? fill(s, vars) : s;
  }
  function applyLang() {
    document.documentElement.lang = lang === 'en' ? 'en-ZA' : lang;
    $$('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    $$('[data-i18n-html]').forEach(function (n) { n.innerHTML = t(n.getAttribute('data-i18n-html')); });
    $$('[data-i18n-label]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-label'))); });
    $$('select[data-lang]').forEach(function (s) { s.value = lang; });
    renderNudges();
    if (chat.built) chat.relabel();
  }
  function initLang() {
    $$('select[data-lang]').forEach(function (s) {
      s.innerHTML = '';
      Object.keys(LANGS).forEach(function (k) { if (D.i18n[k]) s.appendChild(el('option', { value: k, text: LANGS[k] + ' · ' + NAMES[k] })); });
      s.value = lang;
      s.addEventListener('change', function () {
        lang = s.value; store.set('localStorage', 'lindani-lang', lang); applyLang();
      });
    });
    applyLang();
  }

  /* ---------- book-direct note ---------- */
  function nudgeText(amount) { return t('nudge', { amount: money(amount), ota: D.booking.otaName }); }
  // Only shown when there's a real saving to name
  function nudgeEl(amount) { return amount > 0 ? el('p', { class: 'nudge', text: nudgeText(amount) }) : document.createTextNode(''); }
  function renderNudges() {
    $$('[data-nudge]').forEach(function (n) {
      var kind = n.getAttribute('data-nudge');
      if (kind === 'example') {
        // Example: two nights in the cheapest studio at the base rate
        var r = D.rooms.slice().sort(function (a, b) { return a.rate - b.rate; })[0];
        var direct = r.rate * D.booking.minNights;
        n.textContent = nudgeText(otaSaving(direct)) + ' (Example: ' + D.booking.minNights + ' nights in ' + r.name + ', ' +
          money(direct) + ' direct vs about ' + money(direct + otaSaving(direct)) + '.)';
      }
    });
  }

  /* ---------- rates table ---------- */
  function renderRates() {
    var box = $('#rates-list');
    if (!box) return;
    box.innerHTML = '';
    D.rooms.forEach(function (r) {
      box.appendChild(el('div', { class: 'rate-row' }, [
        el('div', { class: 'rate-main' }, [
          el('b', { text: r.name }),
          el('span', { text: r.bed + ' · sleeps ' + r.sleeps + (r.sleeps > r.maxAdults ? ' (' + r.maxAdults + ' adults + ' + (r.sleeps - r.maxAdults) + ' children)' : '') })
        ]),
        el('div', { class: 'rate-price' }, [el('b', { text: money(r.rate) }), el('span', { text: 'per night' })])
      ]));
    });
    var seasons = D.seasons.map(function (s) {
      var pct = Math.round((s.multiplier - 1) * 100);
      return s.name + ' ' + (pct > 0 ? '+' : '') + pct + '%';
    }).join(' · ');
    if (seasons) box.appendChild(el('p', { class: 'rate-foot', text: 'Seasonal rates: ' + seasons + '. Minimum stay ' + D.booking.minNights + ' nights.' }));
  }

  /* ---------- sharing a request or plan with the lodge ---------- */
  function waLink(text) { return 'https://wa.me/' + D.contact.whatsapp + '?text=' + encodeURIComponent(text); }
  function mailLink(subject, body) {
    return 'mailto:' + (D.contact.email || '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  function shareButtons(subject, text, status) {
    var copyBtn = el('button', { type: 'button', class: 'fx-btn fx-btn-ghost', text: 'Copy text' });
    copyBtn.addEventListener('click', function () {
      var done = function () { status.textContent = 'Copied. Paste it into WhatsApp or an email to ' + D.contact.phoneDisplay + '.'; };
      try {
        navigator.clipboard.writeText(text).then(done, function () { selectFallback(); });
      } catch (e) { selectFallback(); }
      function selectFallback() {
        var ta = el('textarea', { class: 'fx-copy', readonly: true, 'aria-label': 'Request text' }); ta.value = text;
        status.textContent = 'Select the text below and copy it:'; status.after(ta); ta.focus(); ta.select();
      }
    });
    var row = el('div', { class: 'fx-share' }, [
      el('a', { class: 'fx-btn fx-btn-wa', href: waLink(text), target: '_blank', rel: 'noopener' }, ['Send on WhatsApp']),
      el('a', { class: 'fx-btn fx-btn-ghost', href: mailLink(subject, text) }, ['Send by email']),
      copyBtn
    ]);
    return row;
  }

  /* =====================================================================
     BOOKING CONCIERGE (chat widget)
     ===================================================================== */
  var chat = (function () {
    var KEY = 'lindani-concierge-v1';
    var S = store.get('sessionStorage', KEY) || { open: false, msgs: [] };
    var api = { built: false };
    var root, panel, log, input, qrRow, launcher, titleEl, closeBtn, sendBtn;

    function save() { store.set('sessionStorage', KEY, { open: S.open, msgs: S.msgs.slice(-60) }); }

    /* --- text matching: keywords, phrases, and small typos --- */
    function norm(s) { return (' ' + String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9&\- ]+/g, ' ').replace(/\s+/g, ' ') + ' '); }
    function lev(a, b) {
      if (Math.abs(a.length - b.length) > 2) return 9;
      var prev = [], cur, i, j;
      for (j = 0; j <= b.length; j++) prev[j] = j;
      for (i = 1; i <= a.length; i++) {
        cur = [i];
        for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
      }
      return prev[b.length];
    }
    function match(text) {
      var n = norm(text), tokens = n.trim().split(' ');
      var scored = D.concierge.intents.map(function (it) {
        var s = 0;
        it.keywords.forEach(function (kw) {
          kw = kw.toLowerCase();
          if (kw.length > 4 && kw.slice(-1) === 's') kw = kw.slice(0, -1);   // "birds" also matches "bird…" 
          if (kw.indexOf(' ') >= 0) { if (n.indexOf(' ' + kw + ' ') >= 0) s += 3; return; }
          var best = 0;
          tokens.forEach(function (tk) {
            if (tk.length > 4 && tk.slice(-1) === 's') tk = tk.slice(0, -1);
            if (tk === kw) best = Math.max(best, 2);
            else if (kw.length >= 4 && (tk.indexOf(kw) === 0 || kw.indexOf(tk) === 0) && tk.length >= 4) best = Math.max(best, 1.5);
            else if (tk.length >= 4 && kw.length >= 4) {
              var d = lev(tk, kw);
              if (d <= (kw.length >= 7 ? 2 : 1)) best = Math.max(best, 1);
            }
          });
          s += best;
        });
        return { it: it, s: s };
      }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
      return scored;
    }
    function answerVars() {
      return {
        phone: D.contact.phoneDisplay, checkIn: D.booking.checkIn, checkOut: D.booking.checkOut, minNights: D.booking.minNights,
        area: D.contact.area, kids: D.policies.kids, pets: D.policies.pets, meals: D.meals, cancellation: D.policies.cancellation,
        payment: D.policies.payment, smoking: D.policies.smoking
      };
    }
    function intentById(id) { return D.concierge.intents.filter(function (i) { return i.id === id; })[0]; }

    /* --- message rendering --- */
    function bubble(from, kids, cls) {
      var b = el('div', { class: 'fx-msg fx-' + from + (cls ? ' ' + cls : '') }, kids);
      log.appendChild(b);
      requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; });
      return b;
    }
    function textNode(s) { return el('p', { class: 'fx-text', text: s }); }
    function actionsRow(list) {
      return el('div', { class: 'fx-actions' }, list.map(function (a) {
        if (a.href) return el('a', { class: 'fx-chip', href: a.href, target: a.href.charAt(0) === '#' ? null : '_blank', rel: 'noopener', text: a.label,
          onclick: a.href.charAt(0) === '#' ? function () { if (window.innerWidth < 760) setOpen(false); } : null });
        return el('button', { type: 'button', class: 'fx-chip', text: a.label, onclick: function () { userSays(a.label, a.intent); } });
      }));
    }
    // Every message is stored as data and re-drawn from data, so the chat survives a page reload.
    function draw(m) {
      switch (m.kind) {
        case 'rooms': return bubble('bot', [textNode(m.text), roomsList(), actionsRow([{ label: t('qr_dates'), intent: 'dates' }, { label: t('qr_book'), intent: 'book' }])]);
        case 'dateForm': return bubble('bot', [textNode(m.text), dateForm(m)], 'fx-wide');
        case 'dateResult': return bubble('bot', dateResult(m), 'fx-wide');
        case 'bookForm': return bubble('bot', [textNode(m.text), bookForm(m)], 'fx-wide');
        case 'bookSummary': return bubble('bot', bookSummary(m), 'fx-wide');
        case 'actions': return bubble('bot', [textNode(m.text), actionsRow(m.actions)]);
        default: return bubble(m.from, [textNode(m.text)]);
      }
    }
    function push(m, quiet) {
      S.msgs.push(m); save();
      if (quiet || reduceMotion) return draw(m);
      var dots = bubble('bot', [el('span', { class: 'fx-typing', 'aria-label': 'Typing' }, [el('i'), el('i'), el('i')])]);
      setTimeout(function () { dots.remove(); draw(m); }, 380);
    }
    function removeKind(kind) {
      S.msgs = S.msgs.filter(function (m) { return m.kind !== kind; });
      $$('.fx-form[data-kind="' + kind + '"]', log).forEach(function (f) { f.closest('.fx-msg').remove(); });
    }

    function roomsList() {
      return el('ul', { class: 'fx-rooms' }, D.rooms.map(function (r) {
        return el('li', null, [el('b', { text: r.name }), el('span', { text: r.blurb + ' ' + r.bed + ', sleeps ' + r.sleeps + '.' }),
          el('em', { text: 'from ' + money(r.rate) + ' / night' })]);
      }));
    }

    /* --- date checker --- */
    function field(label, input) {
      var id = input.id || (input.id = nid('fx'));
      return el('div', { class: 'fx-field' }, [el('label', { for: id, text: label }), input]);
    }
    function numSelect(name, min, max, val) {
      var s = el('select', { name: name });
      for (var i = min; i <= max; i++) s.appendChild(el('option', { value: i, text: String(i), selected: i === val }));
      return s;
    }
    function dateForm(m) {
      var v = m.values || {};
      var t0 = today();
      var inp = el('input', { type: 'date', name: 'from', required: true, min: t0, value: v.from || '' });
      var out = el('input', { type: 'date', name: 'to', required: true, min: addDays(t0, 1), value: v.to || '' });
      inp.addEventListener('change', function () { if (inp.value) { out.min = addDays(inp.value, 1); if (!out.value || out.value <= inp.value) out.value = addDays(inp.value, D.booking.minNights); } });
      var err = el('p', { class: 'fx-err', role: 'alert' });
      var f = el('form', { class: 'fx-form', 'data-kind': 'dateForm', novalidate: true }, [
        el('div', { class: 'fx-grid' }, [field('Arrive', inp), field('Leave', out), field('Adults', numSelect('adults', 1, 8, v.adults || 2)), field('Children', numSelect('kids', 0, 6, v.kids || 0))]),
        err,
        el('button', { type: 'submit', class: 'fx-btn fx-btn-book', text: 'Check availability' })
      ]);
      picker.attach(inp, out);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = { from: inp.value, to: out.value, adults: +f.elements.adults.value, kids: +f.elements.kids.value };
        var msg = validStay(q.from, q.to);
        if (msg) { err.textContent = msg; return; }
        removeKind('dateForm');
        push({ from: 'me', text: fmtDate(q.from) + ' – ' + fmtDate(q.to) + ', ' + q.adults + ' adult' + (q.adults > 1 ? 's' : '') + (q.kids ? ', ' + q.kids + ' child' + (q.kids > 1 ? 'ren' : '') : '') }, true);
        push({ from: 'bot', kind: 'dateResult', q: q });
      });
      return f;
    }
    function dateResult(m) {
      var q = m.q, n = nightsBetween(q.from, q.to), party = q.adults + q.kids;
      var free = freeRooms(q.from, q.to);
      var single = free.filter(function (r) { return r.maxAdults >= q.adults && r.sleeps >= party; });
      var kids = [];
      if (single.length) {
        kids.push(textNode('Good news! ' + (single.length === 1 ? 'One studio is' : single.length + ' studios are') + ' free for ' + n + ' nights:'));
        kids.push(el('ul', { class: 'fx-rooms' }, single.map(function (r) {
          var p = stayPrice(r, q.from, q.to);
          return el('li', null, [el('b', { text: r.name + ': ' + money(p) }), el('span', { text: r.bed + '. ' + money(Math.round(p / n)) + ' per night on average.' }),
            el('button', { type: 'button', class: 'fx-chip', text: 'Request ' + r.name, onclick: function () { startBooking({ from: q.from, to: q.to, adults: q.adults, kids: q.kids, room: r.id }); } })]);
        })));
        var cheapest = Math.min.apply(null, single.map(function (r) { return stayPrice(r, q.from, q.to); }));
        kids.push(nudgeEl(otaSaving(cheapest)));
      } else {
        var combo = bestCombo(free, q.adults, q.kids, q.from, q.to);
        if (combo) {
          kids.push(textNode('No single studio fits ' + party + ' guests, but this combination is free: ' + combo.rooms.map(function (r) { return r.name; }).join(' + ') + ', ' + money(combo.price) + ' for ' + n + ' nights.'));
          kids.push(nudgeEl(otaSaving(combo.price)));
          kids.push(actionsRow([{ label: 'Request these studios', intent: 'book' }]));
          S.lastQuery = { from: q.from, to: q.to, adults: q.adults, kids: q.kids, room: combo.rooms.map(function (r) { return r.id; }).join('+') };
        } else {
          kids.push(textNode('Sorry, those dates are full for ' + party + ' guest' + (party > 1 ? 's' : '') + '.'));
          var alt = nextOpenings(q);
          if (alt.length) {
            kids.push(textNode('The next openings for the same length of stay:'));
            kids.push(el('div', { class: 'fx-actions' }, alt.map(function (a) {
              return el('button', { type: 'button', class: 'fx-chip', text: fmtDate(a.from) + ' – ' + fmtDate(a.to),
                onclick: function () { push({ from: 'me', text: fmtDate(a.from) + ' – ' + fmtDate(a.to) }, true); push({ from: 'bot', kind: 'dateResult', q: { from: a.from, to: a.to, adults: q.adults, kids: q.kids } }); } });
            })));
          }
          kids.push(actionsRow([{ label: 'Try other dates', intent: 'dates' }, { label: 'Ask on WhatsApp', href: waLink('Hello Lindani Farm, do you have space from ' + fmtDate(q.from) + ' to ' + fmtDate(q.to) + ' for ' + party + ' guests?') }]));
        }
      }
      kids.push(el('p', { class: 'fx-small', text: 'Sample calendar and rates. The lodge confirms availability.' }));
      return kids;
    }

    /* --- booking request --- */
    function startBooking(prefill) {
      push({ from: 'bot', kind: 'bookForm', text: fill(intentById('book').answer, answerVars()), values: prefill || S.lastQuery || {} });
    }
    function bookForm(m) {
      var v = m.values || {}, t0 = today();
      var name = el('input', { name: 'name', autocomplete: 'name', required: true, value: v.name || '' });
      var email = el('input', { name: 'email', type: 'email', autocomplete: 'email', required: true, value: v.email || '' });
      var phone = el('input', { name: 'phone', type: 'tel', autocomplete: 'tel', required: true, value: v.phone || '' });
      var from = el('input', { name: 'from', type: 'date', required: true, min: t0, value: v.from || '' });
      var to = el('input', { name: 'to', type: 'date', required: true, min: addDays(t0, 1), value: v.to || '' });
      from.addEventListener('change', function () { if (from.value) { to.min = addDays(from.value, 1); if (!to.value || to.value <= from.value) to.value = addDays(from.value, D.booking.minNights); } });
      var room = el('select', { name: 'room' }, [el('option', { value: '', text: 'Not sure yet, please suggest' })].concat(
        D.rooms.map(function (r) { return el('option', { value: r.id, text: r.name + ' (sleeps ' + r.sleeps + ')', selected: v.room === r.id }); })));
      if (v.room && v.room.indexOf('+') > 0) room.appendChild(el('option', { value: v.room, selected: true, text: v.room.split('+').map(function (id) { return D.rooms.filter(function (r) { return r.id === id; })[0].name; }).join(' + ') }));
      var notes = el('textarea', { name: 'notes', rows: 2, placeholder: 'Arrival time, celebrations, questions…' });
      notes.value = v.notes || '';
      var err = el('p', { class: 'fx-err', role: 'alert' });
      var f = el('form', { class: 'fx-form', 'data-kind': 'bookForm', novalidate: true }, [
        el('div', { class: 'fx-grid' }, [
          field('Full name', name), field('Email', email), field('Phone / WhatsApp', phone), field('Studio', room),
          field('Arrive', from), field('Leave', to), field('Adults', numSelect('adults', 1, 8, v.adults || 2)), field('Children', numSelect('kids', 0, 6, v.kids || 0))
        ]),
        field('Notes (optional)', notes),
        err,
        el('button', { type: 'submit', class: 'fx-btn fx-btn-book', text: 'Review my request' })
      ]);
      picker.attach(from, to);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var r = {
          name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim(), from: from.value, to: to.value,
          adults: +f.elements.adults.value, kids: +f.elements.kids.value, room: room.value, notes: notes.value.trim()
        };
        var bad = !r.name ? [name, 'Add your name.'] :
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email) ? [email, 'Add a valid email address.'] :
          r.phone.replace(/\D/g, '').length < 9 ? [phone, 'Add a phone number we can WhatsApp.'] : null;
        var dateMsg = validStay(r.from, r.to);
        if (!bad && dateMsg) bad = [from, dateMsg];
        if (!bad && r.room && r.room.indexOf('+') < 0) {
          var rm = D.rooms.filter(function (x) { return x.id === r.room; })[0];
          if (rm.maxAdults < r.adults || rm.sleeps < r.adults + r.kids) bad = [room, rm.name + ' sleeps ' + rm.sleeps + '. Pick another studio or leave it to us.'];
          else if (!isFree(rm.id, r.from, r.to)) bad = [room, rm.name + ' looks booked for those dates. Try another studio or other dates.'];
        }
        $$('[aria-invalid]', f).forEach(function (x) { x.removeAttribute('aria-invalid'); });
        if (bad) { err.textContent = bad[1]; bad[0].setAttribute('aria-invalid', 'true'); bad[0].focus(); return; }
        removeKind('bookForm');
        push({ from: 'me', text: 'Review my booking request' }, true);
        push({ from: 'bot', kind: 'bookSummary', r: r });
      });
      return f;
    }
    function roomNames(id) {
      if (!id) return 'Not chosen (please suggest)';
      return id.split('+').map(function (x) { var r = D.rooms.filter(function (y) { return y.id === x; })[0]; return r ? r.name : x; }).join(' + ');
    }
    function requestText(r, est) {
      return [
        'BOOKING REQUEST (not yet confirmed), sent from the Lindani Farm website',
        'Name: ' + r.name, 'Email: ' + r.email, 'Phone: ' + r.phone,
        'Dates: ' + fmtDate(r.from) + ' to ' + fmtDate(r.to) + ' (' + nightsBetween(r.from, r.to) + ' nights)',
        'Guests: ' + r.adults + ' adult' + (r.adults > 1 ? 's' : '') + (r.kids ? ', ' + r.kids + ' child' + (r.kids > 1 ? 'ren' : '') : ''),
        'Studio: ' + roomNames(r.room),
        est ? 'Website estimate: ' + money(est) : null,
        r.notes ? 'Notes: ' + r.notes : null,
        '', 'Please confirm availability and how to pay the deposit. Thank you!'
      ].filter(function (x) { return x !== null; }).join('\n');
    }
    function bookSummary(m) {
      var r = m.r, n = nightsBetween(r.from, r.to), est = 0;
      if (r.room) r.room.split('+').forEach(function (id) { var rm = D.rooms.filter(function (x) { return x.id === id; })[0]; if (rm) est += stayPrice(rm, r.from, r.to); });
      var dl = el('dl', { class: 'fx-summary' }, [
        ['Name', r.name], ['Email', r.email], ['Phone', r.phone],
        ['Dates', fmtDate(r.from) + ' – ' + fmtDate(r.to) + ' (' + n + ' nights)'],
        ['Guests', r.adults + ' adult' + (r.adults > 1 ? 's' : '') + (r.kids ? ', ' + r.kids + ' child' + (r.kids > 1 ? 'ren' : '') : '')],
        ['Studio', roomNames(r.room)], est ? ['Estimate', money(est)] : null, r.notes ? ['Notes', r.notes] : null
      ].filter(Boolean).map(function (p) { return el('div', null, [el('dt', { text: p[0] }), el('dd', { text: p[1] })]); }));
      var status = el('p', { class: 'fx-small', role: 'status' });
      var out = [
        el('p', { class: 'fx-badge', text: 'Booking request · not a confirmed booking' }),
        textNode('Here\'s your request. Send it to the farm on WhatsApp or by email, and they\'ll confirm availability and the deposit.'),
        dl
      ];
      if (est) out.push(nudgeEl(otaSaving(est)));
      out.push(shareButtons('Booking request: ' + fmtDate(r.from) + ' to ' + fmtDate(r.to), requestText(r, est), status));
      if (!D.contact.email) out.push(el('p', { class: 'fx-small', text: 'The lodge email isn\'t set yet (placeholder), so the email opens without an address.' }));
      out.push(status);
      out.push(actionsRow([{ label: 'Edit request', intent: 'book' }]));
      return out;
    }

    /* --- responding --- */
    function runIntent(it) {
      var vars = answerVars();
      switch (it.action) {
        case 'rooms': return push({ from: 'bot', kind: 'rooms', text: fill(it.answer, vars) });
        case 'dates': return push({ from: 'bot', kind: 'dateForm', text: fill(it.answer, vars), values: S.lastQuery || {} });
        case 'book': return startBooking();
        case 'activities':
          return push({ from: 'bot', kind: 'actions', text: fill(it.answer, vars),
            actions: [{ label: t('qr_dates'), intent: 'dates' }, { label: 'Ask about activities on WhatsApp', href: waLink('Hello Lindani Farm, what can we do during our stay?') }] });
        case 'directions':
          var acts = [{ label: 'WhatsApp for directions', href: waLink('Hello Lindani Farm, could you send me directions to the farm?') }];
          if (D.contact.mapsLink) acts.unshift({ label: 'Open map', href: D.contact.mapsLink });
          return push({ from: 'bot', kind: 'actions', text: D.directions, actions: acts });
        case 'contact': return push({ from: 'bot', kind: 'actions', text: fill(it.answer, vars), actions: [{ label: 'WhatsApp the farm', href: waLink('Hello Lindani Farm, ') }] });
        default: return push({ from: 'bot', text: fill(it.answer, vars) });
      }
    }
    function respond(text) {
      var found = match(text);
      var top = found[0];
      if (top && (top.s >= 2 || (top.s >= 1 && (!found[1] || found[1].s < top.s)))) return runIntent(top.it);
      var opts = found.slice(0, 3).map(function (x) { return { label: labelFor(x.it.id), intent: x.it.id }; });
      if (!opts.length) opts = quickReplies().slice(0, 4);
      opts.push({ label: 'Ask on WhatsApp', href: waLink('Hello Lindani Farm, ' + text) });
      push({ from: 'bot', kind: 'actions', text: D.concierge.fallback, actions: opts });
    }
    function labelFor(id) {
      var map = { rooms: 'qr_rooms', activities: 'qr_activities', dates: 'qr_dates', directions: 'qr_directions', kidspets: 'qr_kids', kids: 'qr_kids', pets: 'qr_kids', book: 'qr_book' };
      return map[id] ? t(map[id]) : id.charAt(0).toUpperCase() + id.slice(1);
    }
    function quickReplies() {
      return [['qr_rooms', 'rooms'], ['qr_activities', 'activities'], ['qr_dates', 'dates'], ['qr_directions', 'directions'], ['qr_kids', 'kidspets'], ['qr_book', 'book']]
        .map(function (q) { return { label: t(q[0]), intent: q[1] }; });
    }
    function userSays(text, intentId) {
      push({ from: 'me', text: text }, true);
      var it = intentId && intentById(intentId);
      if (it) runIntent(it); else respond(text);
    }

    /* --- the widget shell --- */
    function build() {
      if (api.built) return;
      api.built = true;
      titleEl = el('h2', { id: 'fx-chat-title', class: 'fx-title' });
      closeBtn = el('button', { type: 'button', class: 'fx-close', onclick: function () { setOpen(false); } }, [
        svg('M6 6l12 12M18 6L6 18')]);
      log = el('div', { class: 'fx-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions', tabindex: '0', 'aria-label': 'Conversation' });
      qrRow = el('div', { class: 'fx-qr', role: 'group', 'aria-label': 'Suggested questions' });
      input = el('input', { type: 'text', id: 'fx-input', autocomplete: 'off', enterkeyhint: 'send' });
      sendBtn = el('button', { type: 'submit', class: 'fx-send' }, [svg('M4 12h16M13 5l7 7-7 7')]);
      var inLabel = el('label', { for: 'fx-input', class: 'fx-sr', text: 'Your question' });
      var form = el('form', { class: 'fx-input' }, [inLabel, input, sendBtn]);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        userSays(v);
      });
      panel = el('div', { class: 'fx-panel', id: 'fx-panel', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'fx-chat-title', hidden: true }, [
        el('div', { class: 'fx-head' }, [
          el('span', { class: 'fx-avatar', 'aria-hidden': 'true', text: 'L' }),
          el('div', null, [titleEl, el('p', { class: 'fx-sub', text: D.showDemoNotice ? 'Demo · sample rates and calendar' : 'Usually replies instantly' })]),
          closeBtn
        ]),
        log, qrRow, form
      ]);
      root.appendChild(panel);
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });
      api.relabel();
      if (!S.msgs.length) S.msgs.push({ from: 'bot', kind: 'greeting' });
      S.msgs.forEach(function (m) { m.kind === 'greeting' ? drawGreeting() : draw(m); });
      save();
    }
    function drawGreeting() { bubble('bot', [el('p', { class: 'fx-text fx-greeting', text: t('chat_greeting') })]); }
    api.relabel = function () {
      if (launcher) { $('.fx-launch-label', launcher).textContent = t('chat_open'); launcher.setAttribute('aria-label', t('chat_open')); }
      if (!titleEl) return;
      titleEl.textContent = t('chat_title');
      closeBtn.setAttribute('aria-label', t('chat_close'));
      sendBtn.setAttribute('aria-label', t('chat_send'));
      input.placeholder = t('chat_placeholder');
      $$('.fx-greeting', log).forEach(function (g) { g.textContent = t('chat_greeting'); });
      qrRow.innerHTML = '';
      quickReplies().forEach(function (q) { qrRow.appendChild(el('button', { type: 'button', class: 'fx-chip', text: q.label, onclick: function () { userSays(q.label, q.intent); } })); });
    };
    function svg(d) {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '1.6');
      s.appendChild(p); return s;
    }
    function setOpen(open, intent) {
      if (open) build();
      S.open = open; save();
      panel.hidden = !open;
      launcher.setAttribute('aria-expanded', open);
      root.classList.toggle('is-open', open);
      if (open) {
        log.scrollTop = log.scrollHeight;
        if (intent) userSays(labelFor(intent), intent);
        if (window.innerWidth >= 760) input.focus();
        else closeBtn.focus();
      } else launcher.focus();
    }
    api.open = function (intent) { setOpen(true, intent); };
    api.book = function (prefill) { setOpen(true); startBooking(prefill); };

    root = el('div', { class: 'fx-chat', id: 'fx-chat' });
    launcher = el('button', { type: 'button', class: 'fx-launch', 'aria-expanded': 'false', 'aria-controls': 'fx-panel' }, [
      svg('M4 5h16v11H9l-5 4z'), el('span', { class: 'fx-launch-label' })]);
    launcher.addEventListener('click', function () { setOpen(!(panel && !panel.hidden)); });
    root.appendChild(launcher);
    document.body.appendChild(root);
    api.relabel();
    if (S.open) setOpen(true);
    return api;
  })();

  /* =====================================================================
     AVAILABILITY CHECKER (the "Plan your stay here" form under the hero)
     ===================================================================== */
  (function () {
    var form = $('#qform'), out = $('#avail-out');
    if (!form || !out) return;
    var f = form.elements, t0 = today();
    f.from.min = t0; f.to.min = addDays(t0, 1);
    // Default to the next weekend at least three days away, so the form shows a real example
    var fri = addDays(t0, ((5 - weekday(t0) + 7) % 7) || 7);
    if (nightsBetween(t0, fri) < 3) fri = addDays(fri, 7);
    f.from.value = fri; f.to.value = addDays(fri, D.booking.minNights);
    picker.attach(f.from, f.to);
    f.from.addEventListener('change', function () {
      if (!f.from.value) return;
      f.to.min = addDays(f.from.value, 1);
      if (!f.to.value || f.to.value <= f.from.value) f.to.value = addDays(f.from.value, D.booking.minNights);
      picker.syncAll();
    });
    function setErr(input, msg) {
      var id = input.id + '-err', box = document.getElementById(id);
      if (!msg) { if (box) box.remove(); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); return; }
      if (!box) { box = el('p', { class: 'err', id: id }); input.parentNode.appendChild(box); }
      box.textContent = msg; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', id);
    }
    function card(name, sub, total, nights, btnLabel, prefill) {
      return el('li', { class: 'avail-card' }, [
        el('div', null, [el('b', { class: 'avail-name', text: name }), el('span', { class: 'avail-sub', text: sub })]),
        el('div', { class: 'avail-price' }, [el('b', { text: money(total) }), el('span', { text: 'for ' + nights + ' night' + (nights > 1 ? 's' : '') + ' · about ' + money(total / nights) + ' a night' })]),
        el('button', { type: 'button', class: 'btn btn-book avail-btn', text: btnLabel, onclick: function () { chat.book(prefill); } })
      ]);
    }
    function run(q) {
      out.innerHTML = '';
      var n = nightsBetween(q.from, q.to), party = q.adults + q.kids;
      var free = freeRooms(q.from, q.to);
      var fit = free.filter(function (r) { return r.maxAdults >= q.adults && r.sleeps >= party; });
      var head = fmtDate(q.from) + ' – ' + fmtDate(q.to) + ' · ' + n + ' night' + (n > 1 ? 's' : '') + ' · ' + party + ' guest' + (party > 1 ? 's' : '');
      var base = { from: q.from, to: q.to, adults: q.adults, kids: q.kids };
      if (fit.length) {
        out.appendChild(el('div', { class: 'avail-top' }, [el('h3', { class: 'avail-title', text: (fit.length === 1 ? 'One studio is' : fit.length + ' studios are') + ' free' }),
          D.showDemoNotice ? el('span', { class: 'tag', text: '( Sample calendar )' }) : null]));
        out.appendChild(el('p', { class: 'avail-meta', text: head }));
        out.appendChild(el('ul', { class: 'avail-list' }, fit.map(function (r) {
          return card(r.name, r.bed + ' · sleeps ' + r.sleeps, stayPrice(r, q.from, q.to), n, 'Request ' + r.name,
            Object.assign({ room: r.id }, base));
        })));
        out.appendChild(nudgeEl(otaSaving(Math.min.apply(null, fit.map(function (r) { return stayPrice(r, q.from, q.to); })))));
      } else {
        var combo = bestCombo(free, q.adults, q.kids, q.from, q.to);
        if (combo) {
          out.appendChild(el('h3', { class: 'avail-title', text: 'Free if you take ' + combo.rooms.length + ' studios' }));
          out.appendChild(el('p', { class: 'avail-meta', text: head + '. No single studio sleeps ' + party + '.' }));
          out.appendChild(el('ul', { class: 'avail-list' }, [card(combo.rooms.map(function (r) { return r.name; }).join(' + '),
            combo.rooms.map(function (r) { return r.bed; }).join(' · '), combo.price, n, 'Request these studios',
            Object.assign({ room: combo.rooms.map(function (r) { return r.id; }).join('+') }, base))]));
          out.appendChild(nudgeEl(otaSaving(combo.price)));
        } else {
          out.appendChild(el('h3', { class: 'avail-title', text: 'Those dates are full' }));
          out.appendChild(el('p', { class: 'avail-meta', text: head }));
          var alt = nextOpenings(q);
          if (alt.length) {
            out.appendChild(el('p', { class: 'avail-meta', text: 'The next free dates for the same length of stay:' }));
            out.appendChild(el('div', { class: 'fx-actions' }, alt.map(function (a) {
              return el('button', { type: 'button', class: 'fx-chip', text: fmtDate(a.from) + ' – ' + fmtDate(a.to), onclick: function () {
                f.from.value = a.from; f.to.value = a.to; picker.syncAll(); run({ from: a.from, to: a.to, adults: q.adults, kids: q.kids });
              } });
            })));
          }
          out.appendChild(el('p', { class: 'avail-meta' }, [el('a', { href: waLink('Hello Lindani Farm, do you have space from ' + fmtDate(q.from) + ' to ' + fmtDate(q.to) + ' for ' + party + ' guests?'), target: '_blank', rel: 'noopener', class: 'avail-link', text: 'Ask the farm on WhatsApp' })]));
        }
      }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = { from: f.from.value, to: f.to.value, adults: +f.adults.value, kids: +f.kids.value };
      setErr(f.from, ''); setErr(f.to, '');
      var msg = validStay(q.from, q.to);
      if (msg) {
        var target = !q.from || q.from < today() ? f.from : f.to;
        setErr(target, msg); target.focus(); out.innerHTML = ''; return;
      }
      run(q);
    });
    // Show real results straight away for the default weekend
    run({ from: f.from.value, to: f.to.value, adults: +f.adults.value, kids: +f.kids.value });
  })();

  /* ---------- closing enquiry form: hand the enquiry to the farm ---------- */
  (function () {
    var form = $('#eform');
    if (!form) return;
    var box = el('div', { class: 'enq-send', hidden: true, 'aria-live': 'polite' });
    form.appendChild(box);
    document.addEventListener('lindani:enquiry', function (e) {
      var r = e.detail, n = r.from && r.to ? nightsBetween(r.from, r.to) : 0;
      var text = [
        'ENQUIRY from the Lindani Farm website',
        'Name: ' + r.name, 'Contact: ' + r.contact,
        'Dates: ' + fmtDate(r.from) + ' to ' + fmtDate(r.to) + (n ? ' (' + n + ' night' + (n > 1 ? 's' : '') + ')' : ''),
        'Guests: ' + r.adults + ' adult' + (r.adults > 1 ? 's' : '') + (r.kids ? ', ' + r.kids + ' child' + (r.kids > 1 ? 'ren' : '') : ''),
        r.message ? 'Message: ' + r.message : null,
        '', 'Please let me know about availability. Thank you!'
      ].filter(function (x) { return x !== null; }).join('\n');
      var status = el('p', { class: 'fx-small', role: 'status' });
      box.innerHTML = '';
      box.appendChild(el('p', { text: 'Thanks, ' + r.name.split(' ')[0] + '. Send your enquiry to the farm:' }));
      box.appendChild(shareButtons('Enquiry: ' + fmtDate(r.from) + ' to ' + fmtDate(r.to), text, status));
      box.appendChild(status);
      box.hidden = false;
      $('a', box).focus();
    });
  })();

  /* ---------- footer contact from the data file ---------- */
  (function () {
    var em = $('#f-email');
    if (em && D.contact.email) { em.href = 'mailto:' + D.contact.email; em.textContent = D.contact.email; em.hidden = false; }
  })();

  // Any element with data-open-chat="<intent>" opens the concierge at that step
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open-chat]');
    if (!b) return;
    e.preventDefault();
    chat.open(b.getAttribute('data-open-chat') || null);
  });

  picker.attach($('#e-in'), $('#e-out'));
  renderRates();
  initLang();
})();
