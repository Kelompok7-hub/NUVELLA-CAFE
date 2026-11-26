/* =========================================================
   Tabel jam operasional dan label "Buka sekarang".
   ========================================================= */
import { HOURS } from "../data/hours.js";
import { $ } from "../utils/dom.js";
import { pad } from "../utils/format.js";

/* ---------- Jam operasional ---------- */
export function renderHours() {
  var today = new Date().getDay();
  var order7 = [1, 2, 3, 4, 5, 6, 0];
  $("#hoursTable tbody").innerHTML = order7.map(function (i) {
    var h = HOURS[i];
    return '<tr class="' + (i === today ? "is-today" : "") + '"><td>' + h.day + '</td><td>' + pad(h.open) + ".00–" + h.close + '.00</td></tr>';
  }).join("");

  var now = new Date();
  var h = HOURS[today];
  var mins = now.getHours() * 60 + now.getMinutes();
  var open = mins >= h.open * 60 && mins < h.close * 60;
  var el = $("#openNow");
  if (open) {
    el.textContent = "Buka sekarang · sampai " + h.close + ".00";
    el.hidden = false;
    el.classList.remove("is-closed");
  } else {
    el.textContent = "";
    el.hidden = true;
  }
}
