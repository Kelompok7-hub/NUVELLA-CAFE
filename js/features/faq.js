/* =========================================================
   Halaman FAQ (accordion).
   ========================================================= */
import { FAQ } from "../data/faq.js";
import { $ } from "../utils/dom.js";
import { ICON_PLUS_SM } from "../utils/icons.js";

export function initFaq() {
  /* ---------- FAQ (accordion) ---------- */
  $("#faqList").innerHTML = FAQ.map(function (g, gi) {
    return '<div class="faq__group"><h2>' + g.topic + '</h2>' + g.items.map(function (q, qi) {
      var id = "faq-" + gi + "-" + qi;
      return '<div class="acc"><button type="button" class="acc__btn" aria-expanded="false" aria-controls="' + id + '">' +
        '<span>' + q[0] + '</span>' + ICON_PLUS_SM + '</button>' +
        '<div class="acc__panel" id="' + id + '" role="region"><div><p>' + q[1] + '</p></div></div></div>';
    }).join("") + '</div>';
  }).join("");

  $("#faqList").addEventListener("click", function (e) {
    var btn = e.target.closest(".acc__btn");
    if (!btn) return;
    var acc = btn.parentElement;
    var open = !acc.classList.contains("is-open");
    acc.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open);
  });
}
