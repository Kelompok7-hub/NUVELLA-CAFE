/* =========================================================
   Efek animasi di atas foto menu (uap, taburan, gelembung, kilau).
   ========================================================= */
import { $all } from "../utils/dom.js";

/* ---------- Efek animasi pada gambar (taburan, uap, gelembung, kilau) ---------- */
var FX_COUNT = { pistachio: 0, choco: 0, steam: 4, bubble: 9, sparkle: 7 };
var FX_COLORS = {
  pistachio: ["#7a9a3c", "#a3c15a", "#5d7a2e", "#c4d98a"],
  choco: ["#4a2c1a", "#6b3f26", "#2f1a0f"]
};

function fxHTML(type, big) {
  var n = FX_COUNT[type];
  if (!n) return "";
  var html = '<div class="fx fx--' + type + (big ? " fx--big" : "") + '" aria-hidden="true">';
  for (var i = 0; i < n; i++) {
    var x = type === "steam" ? (big ? 36 + i * 12 : 32 + i * 16) : Math.round(6 + (88 / n) * i + (i % 2) * 5);
    var y = 8 + ((i * 37) % 70);
    var d = ((i * 0.43) % 2.6).toFixed(2);
    var s = (type === "steam" ? 2.4 : 1.8 + (i % 3) * 0.5).toFixed(1);
    var colors = FX_COLORS[type];
    var c = colors ? colors[i % colors.length] : "#fff";
    html += '<i style="--x:' + x + '%;--y:' + y + '%;--d:' + d + 's;--s:' + s + 's;--c:' + c + '"></i>';
  }
  return html + "</div>";
}

export function mountHeroFx() {
  $all("[data-fx]").forEach(function (el) {
    el.outerHTML = fxHTML(el.getAttribute("data-fx"), el.hasAttribute("data-big"));
  });
}
