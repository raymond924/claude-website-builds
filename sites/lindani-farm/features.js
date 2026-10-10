/* Lindani Farm: on-page demo features.
   Booking concierge, date checker, booking request, trip planner, book-direct
   note and language switcher. Runs entirely in the browser: no backend, no
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
  function nudgeText(amount) {
    if (amount) return t('nudge', { amount: money(amount), ota: D.booking.otaName });
    // Direct = agent price × (1 − commission), so the saving is the commission share of the agent's price
    return t('nudge_generic', { ota: D.booking.otaName, pct: Math.round(D.booking.otaCommissionPercent) });
  }
  function nudgeEl(amount) { return el('p', { class: 'nudge', text: nudgeText(amount) }); }
  function renderNudges() {
    $$('[data-nudge]').forEach(function (n) {
      var kind = n.getAttribute('data-nudge');
      if (kind === 'example') {
        // Example: two nights in the cheapest studio at the base rate
        var r = D.rooms.slice().sort(function (a, b) { return a.rate - b.rate; })[0];
        var direct = r.rate * D.booking.minNights;
        n.textContent = nudgeText(otaSaving(direct)) + ' (Example: ' + D.booking.minNights + ' nights in ' + r.name + ', ' +
          money(direct) + ' direct vs about ' + money(direct + otaSaving(direct)) + '.)';
      } else n.textContent = nudgeText(0);
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
     TRIP PLANNER
     ===================================================================== */
  var planner = (function () {
    var form = $('#planner-form');
    if (!form) return null;
    var out = $('#planner-out');
    var SLOTS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

    function build(opts) {
      var nights = nightsBetween(opts.from, opts.to);
      var days = [], used = {}, budget = D.budgets.filter(function (b) { return b.id === opts.budget; })[0] || D.budgets[1];
      var people = opts.adults + opts.kids;
      function cost(a) { return a.priceAdult * opts.adults + a.priceChild * opts.kids; }
      function allowed(a, date) {
        if (opts.kids && !a.kids) return false;
        if (a.days && a.days.indexOf(weekday(date)) < 0) return false;
        return true;
      }
      var covered = {};
      function score(a) {
        var s = 0;
        a.interests.forEach(function (i) {
          if (opts.interests.indexOf(i) >= 0) s += covered[i] ? 2 : 5;   // favour interests the plan hasn't covered yet
        });
        if (used[a.id]) s -= 6;
        if (a.where === 'farm') s += 0.5;
        return s;
      }
      function cover(a) { a.interests.forEach(function (i) { covered[i] = 1; }); }
      function pick(slot, date, spent) {
        var cap = budget.perPersonPerDay * people - spent;
        var list = D.activities.filter(function (a) {
          return a.when === slot && allowed(a, date) && cost(a) <= cap && score(a) > 0;
        }).sort(function (a, b) { return score(b) - score(a) || cost(a) - cost(b); });
        return list[0] || null;
      }
      function filler(slot, date) {
        return D.activities.filter(function (a) { return a.when === slot && a.filler && allowed(a, date); })[0] || null;
      }
      for (var i = 0; i <= nights; i++) {
        var date = addDays(opts.from, i), items = [], spent = 0;
        var first = i === 0, last = i === nights;
        if (first) items.push({ slot: 'Afternoon', text: 'Arrive from ' + D.booking.checkIn + ' and settle into your studio', price: 0 });
        if (last) items.push({ slot: 'Morning', text: 'Slow breakfast on the patio, check out by ' + D.booking.checkOut, price: 0 });
        var slots = first ? ['evening'] : last ? [] : ['morning', 'afternoon', 'evening'];
        if (!first && !last) {
          // A full-day outing replaces morning and afternoon when it scores best
          var full = D.activities.filter(function (a) {
            return a.when === 'fullday' && allowed(a, date) && !used[a.id] && score(a) >= 3 && cost(a) <= budget.perPersonPerDay * people;
          }).sort(function (a, b) { return score(b) - score(a); })[0];
          var morning = pick('morning', date, 0);
          if (full && (!morning || score(full) >= score(morning))) {
            items.push({ slot: 'All day', act: full, price: cost(full) }); used[full.id] = 1; spent += cost(full); cover(full);
            slots = ['evening'];
          }
        }
        slots.forEach(function (slot) {
          var a = pick(slot, date, spent) || filler(slot, date);
          if (!a) return;
          items.push({ slot: SLOTS[slot], act: a, price: cost(a) });
          used[a.id] = 1; spent += cost(a); cover(a);
        });
        days.push({ date: date, items: items, spent: spent });
      }
      var acts = days.reduce(function (s, d) { return s + d.spent; }, 0);
      var combo = bestCombo(freeRooms(opts.from, opts.to), opts.adults, opts.kids, opts.from, opts.to);
      return { opts: opts, nights: nights, days: days, acts: acts, combo: combo };
    }

    function planText(p) {
      var o = p.opts, lines = [];
      lines.push('Hello Lindani Farm, here is the trip plan I made on your website:');
      lines.push(fmtDate(o.from) + ' to ' + fmtDate(o.to) + ' (' + p.nights + ' nights), ' + o.adults + ' adult' + (o.adults > 1 ? 's' : '') +
        (o.kids ? ', ' + o.kids + ' child' + (o.kids > 1 ? 'ren' : '') : ''));
      if (p.combo) lines.push('Studio' + (p.combo.rooms.length > 1 ? 's' : '') + ': ' + p.combo.rooms.map(function (r) { return r.name; }).join(', ') + ' (estimate ' + money(p.combo.price) + ')');
      p.days.forEach(function (d, i) {
        lines.push('');
        lines.push('Day ' + (i + 1) + ', ' + fmtDate(d.date) + ':');
        d.items.forEach(function (it) { lines.push('- ' + it.slot + ': ' + (it.act ? it.act.name : it.text)); });
      });
      lines.push('');
      lines.push('Estimated total: ' + money((p.combo ? p.combo.price : 0) + p.acts) + '. Could you let me know availability?');
      return lines.join('\n');
    }

    function render(p) {
      out.innerHTML = '';
      var o = p.opts;
      var head = el('div', { class: 'plan-head' }, [
        el('h3', { text: p.nights + ' night' + (p.nights > 1 ? 's' : '') + ' at Lindani' }),
        el('p', { text: fmtDate(o.from) + ' – ' + fmtDate(o.to) + ' · ' + o.adults + ' adult' + (o.adults > 1 ? 's' : '') +
          (o.kids ? ' · ' + o.kids + ' child' + (o.kids > 1 ? 'ren' : '') : '') })
      ]);
      out.appendChild(head);
      var ol = el('ol', { class: 'plan-days' });
      p.days.forEach(function (d, i) {
        var ul = el('ul', { class: 'plan-items' });
        d.items.forEach(function (it) {
          ul.appendChild(el('li', null, [
            el('span', { class: 'plan-slot', text: it.slot }),
            el('span', { class: 'plan-what' }, [
              el('b', { text: it.act ? it.act.name : it.text }),
              it.act ? el('small', { text: (it.act.where === 'farm' ? 'On the farm' : 'Nearby') + ' · ' + it.act.note }) : null
            ]),
            el('span', { class: 'plan-price', text: it.price ? money(it.price) : (it.act ? 'Free' : '') })
          ]));
        });
        ol.appendChild(el('li', { class: 'plan-day' }, [el('h4', null, [el('span', { text: 'Day ' + (i + 1) }), ' ' + fmtDate(d.date)]), ul]));
      });
      out.appendChild(ol);

      var stay = p.combo ? p.combo.price : 0;
      var rows = [];
      if (p.combo) rows.push(['Accommodation: ' + p.combo.rooms.map(function (r) { return r.name; }).join(' + ') + ', ' + p.nights + ' nights', money(stay)]);
      rows.push(['Activities (estimate)', money(p.acts)]);
      rows.push(['Estimated total', money(stay + p.acts)]);
      var dl = el('dl', { class: 'plan-total' });
      rows.forEach(function (r, i) {
        dl.appendChild(el('div', { class: i === rows.length - 1 ? 'is-total' : null }, [el('dt', { text: r[0] }), el('dd', { text: r[1] })]));
      });
      out.appendChild(dl);
      if (!p.combo) out.appendChild(el('p', { class: 'fx-warn', text: 'No studio combination is free for all those dates and guests. Send the plan anyway and we\'ll suggest alternatives.' }));
      else out.appendChild(nudgeEl(otaSaving(stay)));
      out.appendChild(el('p', { class: 'fx-small', text: 'Estimates from sample prices. The lodge confirms the final quote.' }));
      var status = el('p', { class: 'fx-small', role: 'status' });
      var sendTitle = el('p', { class: 'plan-send-title', 'data-i18n': 'planner_send', text: t('planner_send') });
      out.appendChild(sendTitle);
      out.appendChild(shareButtons('Trip plan: ' + fmtDate(o.from) + ' to ' + fmtDate(o.to), planText(p), status));
      out.appendChild(status);
    }

    function read() {
      var f = form.elements;
      return {
        from: f['p-from'].value, to: f['p-to'].value,
        adults: +f['p-adults'].value || 1, kids: +f['p-kids'].value || 0,
        interests: $$('input[name="p-int"]:checked', form).map(function (i) { return i.value; }),
        budget: (form.querySelector('input[name="p-budget"]:checked') || {}).value || 'comfort'
      };
    }
    function init() {
      var ints = $('#p-interests'), buds = $('#p-budgets');
      D.interests.forEach(function (it, i) {
        var id = 'p-int-' + it.id;
        ints.appendChild(el('span', { class: 'chip' }, [
          el('input', { type: 'checkbox', id: id, name: 'p-int', value: it.id, checked: it.id === 'farm' || it.id === 'relax' }),
          el('label', { for: id, text: it.label })
        ]));
      });
      D.budgets.forEach(function (b) {
        var id = 'p-bud-' + b.id;
        buds.appendChild(el('span', { class: 'chip' }, [
          el('input', { type: 'radio', id: id, name: 'p-budget', value: b.id, checked: b.id === 'comfort' }),
          el('label', { for: id, text: b.label })
        ]));
      });
      // Sensible defaults so the planner shows a working example straight away
      var t0 = today(), dow = weekday(t0), friday = addDays(t0, ((5 - dow + 7) % 7) || 7);
      form.elements['p-from'].value = addDays(friday, 14);
      form.elements['p-to'].value = addDays(friday, 16);
      form.elements['p-from'].min = t0; form.elements['p-to'].min = addDays(t0, 1);
      form.elements['p-from'].addEventListener('change', function () {
        var v = form.elements['p-from'].value;
        if (v) { form.elements['p-to'].min = addDays(v, 1); if (form.elements['p-to'].value <= v) form.elements['p-to'].value = addDays(v, D.booking.minNights); }
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var o = read(), err = $('#planner-err');
        var msg = validStay(o.from, o.to);
        if (!msg && !o.interests.length) msg = 'Pick at least one interest.';
        if (!msg && nightsBetween(o.from, o.to) > 14) msg = 'The planner covers up to 14 nights. For longer stays, ask us directly.';
        err.textContent = msg;
        if (msg) { err.focus(); return; }
        render(build(o));
        if (e.submitter) out.focus({ preventScroll: true });
        if (window.innerWidth < 900) out.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
      render(build(read()));
    }
    init();
    return { build: build };
  })();

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
        case 'rooms': return bubble('bot', [textNode(m.text), roomsList(), nudgeEl(0), actionsRow([{ label: t('qr_dates'), intent: 'dates' }, { label: t('qr_book'), intent: 'book' }])]);
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
    function nextOpenings(q) {
      var n = nightsBetween(q.from, q.to), found = [];
      for (var i = 1; i <= 60 && found.length < 2; i++) {
        var a = addDays(q.from, i), b = addDays(a, n);
        if (bestCombo(freeRooms(a, b), q.adults, q.kids, a, b)) { found.push(a); i += n; }
      }
      return found.map(function (a) { return { from: a, to: addDays(a, n) }; });
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
            actions: [{ label: 'Plan my days', href: '#planner' }, { label: t('qr_dates'), intent: 'dates' }] });
        case 'directions':
          var acts = [{ label: 'WhatsApp for directions', href: waLink('Hello Lindani Farm, could you send me directions to the farm?') }];
          if (D.contact.mapsLink) acts.unshift({ label: 'Open map', href: D.contact.mapsLink });
          return push({ from: 'bot', kind: 'actions', text: D.directions, actions: acts });
        case 'planner': return push({ from: 'bot', kind: 'actions', text: fill(it.answer, vars), actions: [{ label: 'Open the trip planner', href: '#planner' }] });
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

  // Any element with data-open-chat="<intent>" opens the concierge at that step
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open-chat]');
    if (!b) return;
    e.preventDefault();
    chat.open(b.getAttribute('data-open-chat') || null);
  });

  renderRates();
  initLang();
})();
