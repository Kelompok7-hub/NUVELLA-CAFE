/* =========================================================
   Judul per kata dan kartu yang muncul saat di-scroll.
   ========================================================= */
import { $all } from "../utils/dom.js";
import { REDUCE } from "../utils/env.js";

export function splitWords() {
  $all(".display, .page-title").forEach(function (h) {
    var k = 0;
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var s = document.createElement("span");
        s.className = "w"; s.style.setProperty("--k", k++); s.textContent = part;
        frag.appendChild(s);
      });
      h.replaceChild(frag, n);
    });
  });
}

export function initReveal() {
  if (REDUCE || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  $all(".steps li, .pillar-card, .stat-box").forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--rd", (i % 4) * 90 + "ms");
    io.observe(el);
  });
}
