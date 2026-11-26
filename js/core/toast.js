/* =========================================================
   Notifikasi kecil di layar.
   ========================================================= */
import { $, $all, esc } from "../utils/dom.js";
import { ICON_CHECK } from "../utils/icons.js";

/* ---------- Notifikasi ---------- */
export function toast(text, actionLabel, action) {
  var el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.innerHTML = ICON_CHECK + '<span class="toast__text">' + esc(text) + '</span>' +
    (actionLabel ? '<button type="button" class="toast__action">' + actionLabel + '</button>' : "");
  if (action) el.querySelector(".toast__action").addEventListener("click", function () { action(); dismiss(); });
  $("#toasts").appendChild(el);
  var all = $all(".toast"); if (all.length > 3) all[0].remove();
  var t = setTimeout(dismiss, 2800);
  function dismiss() { clearTimeout(t); el.classList.add("is-leaving"); setTimeout(function () { el.remove(); }, 180); }
}
