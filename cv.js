// Header takes the colour of the chapter under it; entrances; the technique filter; photo drift.
(function () {
  var bar = document.querySelector('.bar');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  var colours = {
    paper: ['#f3f5ef', '#0a0a0a'], green: ['#00b87a', '#0a0a0a'],
    black: ['#0d0f0e', '#00d68f'], yellow: ['#fde047', '#0a0a0a']
  };
  function paintBar() {
    var y = bar.offsetHeight / 2;
    for (var i = chapters.length - 1; i >= 0; i--) {
      var r = chapters[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        var c = colours[chapters[i].dataset.chapter];
        bar.style.setProperty('--bar-bg', c[0]);
        bar.style.setProperty('--bar-ink', c[1]);
        bar.dataset.on = chapters[i].dataset.chapter;
        return;
      }
    }
  }
  var drift = Array.prototype.slice.call(document.querySelectorAll('.drift'));
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onScroll() {
    paintBar();
    if (still) return;
    drift.forEach(function (img) {
      var r = img.getBoundingClientRect();
      var p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
      img.style.transform = 'scale(1.08) translateY(' + (p * 3).toFixed(2) + '%)';
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Entrances: content is visible without script; with it, parts rise in once.
  var rise = document.querySelectorAll('.rise');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    rise.forEach(function (el) { io.observe(el); });
  } else {
    rise.forEach(function (el) { el.classList.add('in'); });
  }

  // Technique filter on the work ledger
  var filter = document.querySelector('.filter');
  var ledger = document.querySelector('.ledger');
  var note = document.querySelector('.filter-note');
  if (filter && ledger) {
    filter.hidden = false;
    var items = Array.prototype.slice.call(ledger.children);
    var label = document.documentElement.lang === 'nl'
      ? function (n, t) { return n + ' rollen met ' + t + '. Klik opnieuw om alles te tonen.'; }
      : function (n, t) { return n + ' roles with ' + t + '. Click again to show all.'; };
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var on = btn.getAttribute('aria-pressed') !== 'true';
      filter.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      var count = 0;
      items.forEach(function (li) {
        var hit = on && (' ' + li.dataset.tags + ' ').indexOf(' ' + btn.dataset.tag + ' ') > -1;
        li.classList.toggle('match', hit);
        if (hit) count++;
      });
      ledger.classList.toggle('filtering', on);
      if (on) btn.setAttribute('aria-pressed', 'true');
      note.textContent = on ? label(count, btn.textContent) : '';
    });
  }
})();
