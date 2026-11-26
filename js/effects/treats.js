/* =========================================================
   Hujan bunga/kue dan serbuk saat berpindah halaman.
   ========================================================= */
import { flowerSVG } from "./flowers.js";
import { state } from "../state/store.js";
import { REDUCE } from "../utils/env.js";
import { rnd } from "../utils/format.js";

/* ---------- Serbuk kue + hujan bunga/kue saat pindah navigasi ---------- */
var TP_FLOWER = [["#fff4e6", "#b9824a"], ["#f1d4a8", "#6b3f26"], ["#e0b47a", "#3d2a1f"], ["#c98f50", "#fff4e6"], ["#fbe9c7", "#8a5a3c"]];
var TP_GLAZE = ["#6b3f26", "#c98f50", "#f1dab2", "#8a5a3c"];
var TP_MAC = ["#c98f50", "#f1dab2", "#8a5a3c", "#e0b47a", "#5a3b2a"];
var TP_CRUMB = ["#c98f50", "#e0b47a", "#8a5a3c", "#d9a466", "#f1dab2", "#5a3b2a"];

function tpCookie() {
  return '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#d9a465"/><circle cx="24" cy="24" r="20" fill="none" stroke="#b9824a" stroke-width="2"/>' +
    '<circle cx="16" cy="17" r="3.2" fill="#4a2c1a"/><circle cx="30" cy="15" r="2.7" fill="#4a2c1a"/><circle cx="31" cy="29" r="3.4" fill="#4a2c1a"/><circle cx="17" cy="31" r="2.7" fill="#4a2c1a"/><circle cx="24" cy="24" r="2.2" fill="#6b3f26"/>' +
    '<ellipse cx="17" cy="12" rx="8" ry="3.5" fill="#fff" opacity=".2"/></svg>';
}
function tpDonut(i) {
  var g = TP_GLAZE[i % TP_GLAZE.length];
  return '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#d9a465"/><circle cx="24" cy="24" r="21" fill="none" stroke="#b9824a" stroke-width="1.5"/>' +
    '<path d="M24 7c9 0 17 7 17 17 0 4-1 6-3 8-1-3-4-4-6-3-2-3-5-3-7-1-2-2-5-2-7 0-2-1-5 0-6 3-2-2-3-4-3-8C7 14 15 7 24 7z" fill="' + g + '"/>' +
    '<circle cx="24" cy="24" r="5.5" fill="#f1dab2"/><circle cx="24" cy="24" r="5.5" fill="none" stroke="#b9824a" stroke-width="1.2"/>' +
    '<g stroke-linecap="round" stroke-width="2.2"><path d="M14 16l2 1" stroke="#fff4e6"/><path d="M30 12l2 2" stroke="#f5d27a"/><path d="M36 22l-1 2" stroke="#fff4e6"/><path d="M13 25l2-1" stroke="#f5d27a"/><path d="M33 31l-2-1" stroke="#fff4e6"/><path d="M20 12l1 2" stroke="#f5d27a"/></g>' +
    '<ellipse cx="17" cy="13" rx="6" ry="2.6" fill="#fff" opacity=".25"/></svg>';
}
function tpMacaron(i) {
  var c = TP_MAC[i % TP_MAC.length];
  return '<svg viewBox="0 0 48 48"><path d="M7 24a17 12 0 0 1 34 0z" fill="' + c + '"/><rect x="8" y="23" width="32" height="5" rx="2.5" fill="#fff4e6"/>' +
    '<path d="M7 28a17 12 0 0 0 34 0z" fill="' + c + '"/><path d="M9 24h30M10 29h28" stroke="rgba(0,0,0,.14)" stroke-width="1.2"/><ellipse cx="17" cy="16" rx="6" ry="2.6" fill="#fff" opacity=".28"/></svg>';
}
function tpCroissant() {
  return '<svg viewBox="0 0 48 48"><path d="M3 33c2-13 11-21 21-21s19 8 21 21c-4-2-8-3-11-2-2-5-6-8-10-8s-8 3-10 8c-3-1-7 0-11 2z" fill="#d9a465"/>' +
    '<path d="M15 22l4 9M24 19v12M33 22l-4 9M9 28l5 3M39 28l-5 3" stroke="#a9733e" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
    '<path d="M10 24c4-6 9-9 14-9" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".3"/></svg>';
}
function tpBean() {
  return '<svg viewBox="0 0 48 48"><g transform="rotate(28 24 24)"><ellipse cx="24" cy="24" rx="13" ry="19" fill="#6b3f26"/><ellipse cx="24" cy="24" rx="13" ry="19" fill="none" stroke="#4a2c1a" stroke-width="1.5"/>' +
    '<path d="M24 6c-7 11 7 25 0 36" fill="none" stroke="#3a1c0e" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="18" cy="15" rx="3.2" ry="6" fill="#fff" opacity=".18"/></g></svg>';
}
function tpCupcake(i) {
  var f = ["#f6e0b8", "#8a5a3c", "#c98f50", "#fbe9c7"][i % 4], l = ["#b9824a", "#6b3f26", "#d9a466", "#8a5a3c"][i % 4];
  return '<svg viewBox="0 0 48 48"><path d="M10 27h28l-4 17H14z" fill="' + l + '"/><path d="M17 27l2 17M24 27v17M31 27l-2 17" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>' +
    '<path d="M8 28c-2-6 3-9 6-9 0-6 5-10 10-10s10 4 10 10c3 0 8 3 6 9z" fill="' + f + '"/><path d="M14 19c1 3 4 4 6 3M26 14c1 3 4 4 7 3" stroke="rgba(0,0,0,.12)" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    '<circle cx="24" cy="9" r="3.4" fill="#4a2c1a"/><ellipse cx="17" cy="16" rx="5" ry="2.4" fill="#fff" opacity=".3"/></svg>';
}
function tpSparkle() {
  return '<svg viewBox="0 0 48 48"><path d="M24 3l5.5 15.5L45 24l-15.5 5.5L24 45l-5.5-15.5L3 24l15.5-5.5z" fill="#f5c66a"/><path d="M24 11l3 10 10 3-10 3-3 10-3-10-10-3 10-3z" fill="#fff4cf"/></svg>';
}
function tpSlice() {
  return '<svg viewBox="0 0 48 48"><path d="M4 32L44 22v14L4 40z" fill="#f1dab2"/><path d="M4 32L44 22v5L4 36z" fill="#8a5a3c"/><path d="M4 32Q24 12 44 22L4 32z" fill="#fff4e6"/><circle cx="25" cy="17.5" r="3.8" fill="#a23a2a"/><ellipse cx="24" cy="16" rx="1.4" ry=".9" fill="#fff" opacity=".6"/></svg>';
}
function tpCrumb(c) {
  return '<svg viewBox="0 0 24 24"><path d="M4 13c-1-5 4-9 9-8 5 1 7 5 6 9-1 4-5 6-9 6-3-1-5-3-6-7z" fill="' + c + '"/><ellipse cx="10" cy="9" rx="4" ry="2" fill="#fff" opacity=".25"/></svg>';
}
var TP_KINDS = ["flower", "cookie", "donut", "macaron", "croissant", "bean", "cupcake", "sparkle", "slice", "flower", "crumb", "macaron"];
export function treatPiece(i) {
  var k = TP_KINDS[i % TP_KINDS.length], v = Math.floor(i / TP_KINDS.length) + i;
  switch (k) {
    case "flower": var c = TP_FLOWER[v % TP_FLOWER.length]; return flowerSVG(c[0], c[1], v % 2 ? 5 : 6);
    case "cookie": return tpCookie();
    case "donut": return tpDonut(v);
    case "macaron": return tpMacaron(v);
    case "croissant": return tpCroissant();
    case "bean": return tpBean();
    case "cupcake": return tpCupcake(v);
    case "sparkle": return tpSparkle();
    case "slice": return tpSlice();
    default: return tpCrumb(TP_CRUMB[v % TP_CRUMB.length]);
  }
}

function treatShow(x, y) {
  if (REDUCE) return;
  var layer = document.createElement("div");
  layer.className = "treat-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  var small = window.innerWidth < 640, i, el;

  /* cincin hangat + kilau di titik yang ditekan */
  var ring = document.createElement("span");
  ring.className = "treat-ring";
  ring.style.left = x + "px"; ring.style.top = y + "px";
  layer.appendChild(ring);

  /* serbuk kue & kue mungil muncrat membentuk busur (pakai gravitasi) */
  var nb = small ? 22 : 34;
  for (i = 0; i < nb; i++) {
    el = document.createElement("span");
    el.className = "burst-p";
    var sz = i % 5 === 0 ? rnd(30, 46) : rnd(9, 20);
    el.style.width = el.style.height = sz.toFixed(0) + "px";
    el.style.left = (x - sz / 2) + "px"; el.style.top = (y - sz / 2) + "px";
    el.innerHTML = i % 5 === 0 ? treatPiece(i + 3) : tpCrumb(TP_CRUMB[i % TP_CRUMB.length]);
    layer.appendChild(el);
    if (el.animate) {
      var vx = rnd(-330, 330), vy = rnd(-640, -300), g = 1250, T = rnd(1.1, 1.7), rot = rnd(-420, 420), fr = [];
      for (var s = 0; s <= 10; s++) {
        var t = T * s / 10;
        fr.push({ transform: "translate(" + (vx * t).toFixed(0) + "px," + (vy * t + 0.5 * g * t * t).toFixed(0) + "px) rotate(" + (rot * s / 10).toFixed(0) + "deg) scale(" + (s === 0 ? 0.3 : 1) + ")", opacity: s < 8 ? 1 : (1 - (s - 7) / 3) });
      }
      el.animate(fr, { duration: T * 1000, easing: "linear", fill: "both" });
    }
  }

  /* hujan bunga & kue: lapisan jauh (kecil, pelan) dan dekat (besar, cepat) */
  var n = small ? 24 : 44;
  for (i = 0; i < n; i++) {
    el = document.createElement("span");
    var near = i % 3 === 0, far = i % 3 === 1;
    el.className = "rainp" + (near ? " rainp--near" : far ? " rainp--far" : "");
    el.style.setProperty("--x", rnd(-2, 98).toFixed(1) + "%");
    el.style.setProperty("--sz", (near ? rnd(54, 78) : far ? rnd(18, 28) : rnd(32, 48)).toFixed(0) + "px");
    el.style.setProperty("--dur", (near ? rnd(2.1, 2.9) : far ? rnd(3.6, 4.6) : rnd(2.8, 3.8)).toFixed(2) + "s");
    el.style.setProperty("--delay", rnd(0, 1.2).toFixed(2) + "s");
    el.style.setProperty("--sway", rnd(-90, 90).toFixed(0) + "px");
    el.style.setProperty("--spin", rnd(-260, 260).toFixed(0) + "deg");
    el.innerHTML = treatPiece(i);
    layer.appendChild(el);
  }

  /* kilau emas berkelip */
  for (i = 0; i < (small ? 10 : 18); i++) {
    el = document.createElement("span");
    el.className = "twinkle";
    el.style.setProperty("--x", rnd(3, 96).toFixed(1) + "%");
    el.style.setProperty("--y", rnd(6, 90).toFixed(1) + "%");
    el.style.setProperty("--sz", rnd(12, 26).toFixed(0) + "px");
    el.style.setProperty("--delay", rnd(0.1, 2.4).toFixed(2) + "s");
    el.innerHTML = tpSparkle();
    layer.appendChild(el);
  }
  setTimeout(function () { layer.remove(); }, 6000);
}

export function initTreats() {
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!a) return;
    var target = a.getAttribute("href").slice(2).split("/")[0];
    if (target === "pesan" || target === "status") target = "keranjang";
    if (target === state.lastPage) return;
    var r = a.getBoundingClientRect();
    treatShow(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
  }, true);
}
