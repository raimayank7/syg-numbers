var NUMW={"h":["शून्य","एक","दो","तीन","चार","पाँच","छह","सात","आठ","नौ","दस","ग्यारह","बारह","तेरह","चौदह","पंद्रह","सोलह","सत्रह","अठारह","उन्नीस","बीस","इक्कीस","बाईस","तेईस","चौबीस","पच्चीस","छब्बीस","सत्ताईस","अट्ठाईस","उनतीस","तीस","इकतीस","बत्तीस","तैंतीस","चौंतीस","पैंतीस","छत्तीस","सैंतीस","अड़तीस","उनतालीस","चालीस","इकतालीस","बयालीस","तैंतालीस","चौवालीस","पैंतालीस","छियालीस","सैंतालीस","अड़तालीस","उनचास","पचास","इक्यावन","बावन","तिरपन","चौवन","पचपन","छप्पन","सत्तावन","अट्ठावन","उनसठ","साठ","इकसठ","बासठ","तिरसठ","चौंसठ","पैंसठ","छियासठ","सड़सठ","अड़सठ","उनहत्तर","सत्तर","इकहत्तर","बहत्तर","तिहत्तर","चौहत्तर","पचहत्तर","छिहत्तर","सतहत्तर","अठहत्तर","उन्यासी","अस्सी","इक्यासी","बयासी","तिरासी","चौरासी","पचासी","छियासी","सत्तासी","अट्ठासी","नवासी","नब्बे","इक्यानवे","बानवे","तिरानवे","चौरानवे","पंचानवे","छियानवे","सत्तानवे","अट्ठानवे","निन्यानवे"]};
/* numbers.shareyourgroup.com: number to words (Indian and international English, Hindi), commas, place values, Roman numerals.
   Pure functions first (checked by the build with Node against Python and num2words). The Hindi words are added by the build as NUMW. */
(function () {
  'use strict';
  var N = {}, W = (typeof NUMW !== 'undefined') ? NUMW : null;
  var ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
  var TENS = ' ten twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');
  N.setWords = function (w) { W = w; };
  function two(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); }
  function three(n, and) { var h = Math.floor(n / 100), r = n % 100, s = []; if (h) s.push(ONES[h] + ' hundred'); if (r) s.push((h && and ? 'and ' : '') + two(r)); return s.join(' '); }
  N.MAX = 999999999999999;
  /* Indian system: thousand, lakh, crore; above that the crores are counted the same way ("one lakh crore") */
  N.indian = function (n, and) {
    if (n === 0) return 'zero';
    var cr = Math.floor(n / 1e7), rest = n % 1e7, lk = Math.floor(rest / 1e5), th = Math.floor(rest % 1e5 / 1000), u = rest % 1000, s = [];
    if (cr) s.push(N.indian(cr, and) + ' crore');
    if (lk) s.push(two(lk) + ' lakh');
    if (th) s.push(two(th) + ' thousand');
    if (u) s.push((and && s.length && u < 100 ? 'and ' : '') + three(u, and));
    return s.join(' ');
  };
  N.intl = function (n, and) {
    if (n === 0) return 'zero';
    var names = ['', ' thousand', ' million', ' billion', ' trillion'], s = [], i = 0, g = [];
    while (n > 0) { g.push(n % 1000); n = Math.floor(n / 1000); }
    for (i = g.length - 1; i >= 0; i--) if (g[i]) s.push((and && i === 0 && s.length && g[i] < 100 ? 'and ' : '') + three(g[i], and) + names[i]);
    return s.join(' ');
  };
  N.hindi = function (n) {
    if (n === 0) return W.h[0];
    var out = [], units = [[1e13, 'नील'], [1e11, 'खरब'], [1e9, 'अरब'], [1e7, 'करोड़'], [1e5, 'लाख'], [1e3, 'हज़ार']];
    units.forEach(function (u) { var c = Math.floor(n / u[0]); n = n % u[0]; if (c) out.push(W.h[c], u[1]); });
    var h = Math.floor(n / 100), r = n % 100; if (h) out.push(W.h[h], 'सौ'); if (r) out.push(W.h[r]);
    return out.join(' ');
  };
  N.commaIN = function (n) { var s = String(n); if (s.length <= 3) return s; var last = s.slice(-3), rest = s.slice(0, -3); return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last; };
  N.commaINTL = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  N.deva = function (s) { return String(s).replace(/\d/g, function (c) { return '०१२३४५६७८९'[+c]; }); };
  var RV = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  N.roman = function (n) { if (n < 1 || n > 3999 || n % 1) return ''; var s = ''; RV.forEach(function (r) { while (n >= r[0]) { s += r[1]; n -= r[0]; } }); return s; };
  /* strict: only the standard form of 1 to 3999 is accepted; otherwise 0 */
  N.unroman = function (s) { s = String(s).toUpperCase().replace(/\s/g, ''); if (!/^[IVXLCDM]+$/.test(s)) return 0; var v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }, t = 0; for (var i = 0; i < s.length; i++) { var a = v[s[i]], b = v[s[i + 1]] || 0; t += a < b ? -a : a; } return N.roman(t) === s ? t : 0; };
  var PIN = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Lakhs', 'Ten lakhs', 'Crores', 'Ten crores', 'Hundred crores (arab)', 'Thousand crores (ten arab)', 'Ten thousand crores (kharab)', 'Lakh crores (ten kharab)', 'Ten lakh crores (neel)', 'Crore crores (ten neel)'];
  var PIT = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands', 'Hundred thousands', 'Millions', 'Ten millions', 'Hundred millions', 'Billions', 'Ten billions', 'Hundred billions', 'Trillions', 'Ten trillions', 'Hundred trillions'];
  /* place values: [digit, place name, value] from the left */
  N.places = function (n, sys) { var s = String(n), names = sys === 'intl' ? PIT : PIN, out = []; for (var i = 0; i < s.length; i++) { var p = s.length - 1 - i; out.push([+s[i], names[p], +s[i] * Math.pow(10, p)]); } return out; };
  N.title = function (s) { return s.replace(/(^|[\s-])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); }).replace(/\bAnd\b/g, 'and'); };
  N.cheque = function (rupees, paise) { var s = 'Rupees ' + N.title(N.indian(rupees, false)); if (paise) s += ' and ' + N.title(two(paise)) + ' Paise'; return s + ' Only'; };
  if (typeof module !== 'undefined') { module.exports = N; return; }

  var d = document, $ = function (s) { return d.querySelector(s); }, esc = SYG.esc;
  function row(label, val, lang, cls) { return '<div class="nrow"><dt>' + label + '</dt><dd' + (lang ? ' lang="' + lang + '"' : '') + (cls ? ' class="' + cls + '"' : '') + '>' + esc(val) + '</dd><button class="btn sm ghost" type="button" data-copy="' + esc(val) + '">Copy</button></div>'; }

  var f = $('#nw-form');
  if (f) {
    var run = function () {
      var raw = $('#nw-n').value.replace(/[,\s₹]/g, ''), out = $('#nw-out'), m = /^(\d{1,15})(?:\.(\d{1,2}))?$/.exec(raw);
      if (!m) { out.innerHTML = '<p class="note">Type a whole number of up to 15 digits. For a cheque amount you may add paise, for example 1250.50.</p>'; return; }
      var n = +m[1], p = m[2] ? +(m[2] + '0').slice(0, 2) : 0, and = $('#nw-and').checked;
      var h = '<div class="result rise"><h2>' + N.commaIN(n) + '</h2><dl class="nlist">' +
        row('In words (Indian system)', N.indian(n, and)) + row('In words (international system)', N.intl(n, and)) + row('हिंदी में', N.hindi(n), 'hi', 'hi') +
        row('With Indian commas', N.commaIN(n), '', 'mono') + row('With international commas', N.commaINTL(n), '', 'mono') + row('In Hindi numerals', N.deva(N.commaIN(n)), 'hi', 'mono') +
        (n >= 1 && n <= 3999 ? row('Roman numeral', N.roman(n), '', 'mono') : '') + row('On a cheque', N.cheque(n, p)) + '</dl></div>';
      if (n > 9) {
        var pl = N.places(n, 'in'), pi = N.places(n, 'intl');
        h += '<div class="work"><h3>Place value of each digit</h3><div class="tbl"><table><thead><tr><th>Digit</th><th>Indian place</th><th>International place</th><th>Value</th></tr></thead><tbody>' +
          pl.map(function (r, i) { return '<tr><td class="mono">' + r[0] + '</td><td>' + r[1] + '</td><td>' + pi[i][1] + '</td><td class="mono">' + N.commaIN(r[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
          '<h3>Expanded form</h3><p class="mono wrapok">' + pl.filter(function (r) { return r[0]; }).map(function (r) { return N.commaIN(r[2]); }).join(' + ') + '</p></div>';
      }
      out.innerHTML = h;
    };
    f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    $('#nw-and').addEventListener('change', function () { if ($('#nw-out').innerHTML) run(); });
    d.addEventListener('click', function (e) { var b = e.target.closest('[data-try]'); if (b && $('#nw-n')) { $('#nw-n').value = b.getAttribute('data-try'); run(); } });
    var q = /[?&]n=(\d{1,15})/.exec(location.search); if (q) { $('#nw-n').value = q[1]; run(); }
  }

  var rf = $('#rn-form');
  if (rf) {
    var go = function () {
      var raw = $('#rn-n').value.trim(), out = $('#rn-out'), n, r;
      if (/^\d+$/.test(raw)) { n = +raw; r = N.roman(n); if (!r) { out.innerHTML = '<p class="note">Roman numerals in their usual form cover 1 to 3999. There is no Roman numeral for zero.</p>'; return; } }
      else { n = N.unroman(raw); r = raw.toUpperCase().replace(/\s/g, ''); if (!n) { out.innerHTML = '<p class="note">That is not a correctly written Roman numeral. Use only I, V, X, L, C, D and M, with no letter more than three times in a row. For example XLII or MMXXVI.</p>'; return; } }
      var parts = [], x = n, tbl = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
      tbl.forEach(function (t) { var c = 0; while (x >= t[0]) { x -= t[0]; c++; } if (c) parts.push([t[1].repeat(c), t[0] * c]); });
      out.innerHTML = '<div class="result rise"><h2>' + n + ' = ' + r + '</h2><p class="big">' + r + '</p><p>' + esc(N.indian(n, true)) + '</p><h3>How it is built</h3><p class="mono wrapok">' +
        parts.map(function (p) { return p[0] + ' = ' + p[1]; }).join(' &nbsp;·&nbsp; ') + '</p><p class="mono wrapok">' + parts.map(function (p) { return p[1]; }).join(' + ') + ' = ' + n + '</p>' +
        '<div class="acts"><button class="btn sm" type="button" data-copy="' + r + '">Copy ' + r + '</button><button class="btn sm ghost" type="button" data-copy="' + n + ' = ' + r + '">Copy both</button></div></div>';
    };
    rf.addEventListener('submit', function (e) { e.preventDefault(); go(); });
    d.addEventListener('click', function (e) { var b = e.target.closest('[data-rtry]'); if (b) { $('#rn-n').value = b.getAttribute('data-rtry'); go(); } });
  }

  /* filter a long list */
  var fl = $('[data-filter]');
  if (fl) fl.addEventListener('input', function () { var q = fl.value.trim().toLowerCase(), n = 0; [].forEach.call(d.querySelectorAll('[data-q]'), function (el) { var ok = !q || el.getAttribute('data-q').indexOf(q) > -1; el.hidden = !ok; if (ok) n++; }); var none = $('[data-none]'); if (none) none.hidden = n > 0; });
})();
