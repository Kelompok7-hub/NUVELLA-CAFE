/* =========================================================
   Menggambar kue sebagai SVG (bentuk, krim, sprinkle, topping).
   ========================================================= */
import { CK, ckFind } from "../../data/cake-options.js";
import { ck } from "../../state/cake.js";
import { luminance, shade } from "../../utils/color.js";
import { esc } from "../../utils/dom.js";

/* bentuk hati dari kurva parametrik (dipakai untuk gambar & uji titik) */
var HEART = (function () {
  var pts = [], k = 8.2, minY = 1e9, maxY = -1e9, i, t, x, y;
  for (i = 0; i < 120; i++) {
    t = i / 120 * Math.PI * 2;
    x = 16 * Math.pow(Math.sin(t), 3) * k;
    y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k;
    pts.push([x, y]); if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  var cy = (minY + maxY) / 2;
  pts = pts.map(function (p) { return [p[0], p[1] - cy]; });
  return { pts: pts, d: "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L") + "Z" };
})();

function inPoly(x, y, pts) {
  var inside = false;
  for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inShape(id, x, y) {
  if (id === "bulat") return x * x + y * y <= 128 * 128;
  if (id === "kotak") return Math.abs(x) <= 118 && Math.abs(y) <= 118;
  if (id === "hati") return inPoly(x, y, HEART.pts);
  if (x * x + y * y <= 96 * 96) return true;
  for (var i = 0; i < 8; i++) {
    var a = i * Math.PI / 4, dx = x - Math.cos(a) * 88, dy = y - Math.sin(a) * 88;
    if (dx * dx + dy * dy <= 46 * 46) return true;
  }
  return false;
}
export function shapeEl(id) {
  if (id === "bulat") return '<circle r="128"/>';
  if (id === "kotak") return '<rect x="-118" y="-118" width="236" height="236" rx="28"/>';
  if (id === "hati") return '<path d="' + HEART.d + '"/>';
  var s = '<circle r="96"/>';
  for (var i = 0; i < 8; i++) {
    var a = i * Math.PI / 4;
    s += '<circle cx="' + (Math.cos(a) * 88).toFixed(1) + '" cy="' + (Math.sin(a) * 88).toFixed(1) + '" r="46"/>';
  }
  return s;
}
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function sprinklesSVG(spr, shapeId) {
  if (!spr || !spr.colors.length) return "";
  var r = rng(11), out = "", placed = 0, tries = 0;
  while (placed < 95 && tries < 3000) {
    tries++;
    var x = (r() * 2 - 1) * 132, y = (r() * 2 - 1) * 132;
    if (!inShape(shapeId, x / 0.8, y / 0.8)) continue;
    placed++;
    var col = spr.colors[Math.floor(r() * spr.colors.length)], rot = Math.floor(r() * 180);
    var tf = 'transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + rot + ')"';
    if (spr.kind === "bar") out += '<rect x="-6" y="-2" width="12" height="4" rx="2" fill="' + col + '" ' + tf + "/>";
    else if (spr.kind === "star") out += '<path d="M0 -6.5 L1.9 -2 L6.5 -1.7 L3 1.3 L4.1 6 L0 3.5 L-4.1 6 L-3 1.3 L-6.5 -1.7 L-1.9 -2Z" fill="' + col + '" ' + tf + "/>";
    else if (spr.kind === "heart") out += '<path d="M0 4.5 C-7 0 -7 -5.5 -2.8 -5.5 C-1.2 -5.5 0 -4.4 0 -3.2 C0 -4.4 1.2 -5.5 2.8 -5.5 C7 -5.5 7 0 0 4.5Z" fill="' + col + '" ' + tf + "/>";
    else out += '<g ' + tf + '><circle r="3.6" fill="' + col + '" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/><circle cx="-1.1" cy="-1.1" r="1" fill="#fff" opacity="0.8"/></g>';
  }
  return out;
}

function toppingSVG(kind, x, y, rot) {
  var inner;
  if (kind === "stroberi") {
    inner = '<path d="M0 10 C-10 4 -10 -7 -3 -8 C-1 -8.5 1 -8.5 3 -8 C10 -7 10 4 0 10Z" fill="#e63946"/><path d="M-5 -8 L0 -13 L5 -8 L0 -5.5Z" fill="#4f8a3c"/><g fill="#ffe3a3"><circle cx="-3" cy="-1" r="0.9"/><circle cx="3" cy="-1" r="0.9"/><circle cx="0" cy="2" r="0.9"/><circle cx="-2" cy="5" r="0.9"/><circle cx="2.5" cy="4.5" r="0.9"/></g>';
  } else if (kind === "ceri") {
    inner = '<path d="M0 -8 Q4 -17 10 -18" fill="none" stroke="#4f772d" stroke-width="2.2" stroke-linecap="round"/><circle r="8.5" fill="#c1121f"/><circle cx="-2.8" cy="-2.8" r="2.4" fill="#fff" opacity="0.55"/>';
  } else if (kind === "blueberry") {
    inner = '<circle r="7.5" fill="#4361b0"/><circle cx="-2.4" cy="-2.6" r="2" fill="#fff" opacity="0.45"/><path d="M-2.2 -4.5 L0 -6.6 L2.2 -4.5 L1.3 -2.8 L-1.3 -2.8Z" fill="#2b3a7a"/>';
  } else if (kind === "mawar") {
    inner = '<path d="M-8 4 Q-14 0 -9 -5 Q-6 0 -8 4Z" fill="#6fae64"/><path d="M8 4 Q14 0 9 -5 Q6 0 8 4Z" fill="#6fae64"/><circle r="8" fill="#f6a6c1" stroke="#e58aac" stroke-width="1"/><path d="M0 -5 C4 -5 5.6 -1 2.8 .8 C.4 2.4 -3.2 1.2 -3 -1.8 C-2.8 -3.8 .8 -3.8 1.3 -1.6" fill="none" stroke="#d9668f" stroke-width="1.3" stroke-linecap="round"/><circle cx="-2.6" cy="-3.4" r="1.4" fill="#fff" opacity="0.55"/>';
  } else if (kind === "macaron") {
    inner = '<ellipse cy="3.6" rx="9" ry="5.2" fill="#f2a0b8"/><rect x="-8.6" y="-1.4" width="17.2" height="3.6" rx="1.8" fill="#fff3e3"/><ellipse cy="-3" rx="9" ry="5.4" fill="#f7b6c8"/><path d="M-6.5 -5.5 Q0 -9.5 6.5 -5.5" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.55" stroke-linecap="round"/>';
  } else if (kind === "lilin") {
    inner = '<rect x="-2.8" y="-12" width="5.6" height="22" rx="1.6" fill="#8ecae6"/><path d="M-2.8 -6 L2.8 -9.5 M-2.8 0 L2.8 -3.5 M-2.8 6 L2.8 2.5" stroke="#fff" stroke-width="1.7"/><path d="M0 -13 C-4.4 -18.5 -1.8 -22 0 -25.5 C1.8 -22 4.4 -18.5 0 -13Z" fill="#ffb703"/><path d="M0 -14 C-2 -17 -.9 -19.2 0 -20.8 C.9 -19.2 2 -17 0 -14Z" fill="#ffe08a"/>';
  } else if (kind === "mint") {
    inner = '<g transform="rotate(-35)"><path d="M0 9 C-9 3 -8 -8 0 -12 C8 -8 9 3 0 9Z" fill="#5fae6a"/><path d="M0 9 L0 -9" stroke="#3f8750" stroke-width="1.2"/></g><g transform="rotate(35)"><path d="M0 9 C-9 3 -8 -8 0 -12 C8 -8 9 3 0 9Z" fill="#74c07e"/><path d="M0 9 L0 -9" stroke="#3f8750" stroke-width="1.2"/></g>';
  } else if (kind === "kupu") {
    inner = '<path d="M0 0 C-4 -12 -15 -11 -13 -3 C-12 3 -5 3 0 0Z" fill="#ff9cc2" stroke="#e86b9f" stroke-width="0.8"/><path d="M0 0 C4 -12 15 -11 13 -3 C12 3 5 3 0 0Z" fill="#ff9cc2" stroke="#e86b9f" stroke-width="0.8"/><path d="M0 1 C-3 8 -10 10 -8.5 5 C-7.5 2 -3 2 0 1Z" fill="#ffc2d9"/><path d="M0 1 C3 8 10 10 8.5 5 C7.5 2 3 2 0 1Z" fill="#ffc2d9"/><circle cx="-8" cy="-5" r="1.6" fill="#fff" opacity="0.8"/><circle cx="8" cy="-5" r="1.6" fill="#fff" opacity="0.8"/><rect x="-1" y="-6" width="2" height="13" rx="1" fill="#6b3b4f"/><path d="M0 -6 Q-3 -11 -5 -10 M0 -6 Q3 -11 5 -10" stroke="#6b3b4f" fill="none" stroke-width="0.9" stroke-linecap="round"/>';
  } else if (kind === "oreo") {
    inner = '<circle r="8.4" fill="#2b1b14"/><circle r="5.4" fill="none" stroke="#4a3329" stroke-width="1"/><path d="M-3.4 -1 Q0 -4.4 3.4 -1 M-3.4 2.4 Q0 -1 3.4 2.4" stroke="#4a3329" fill="none" stroke-linecap="round"/><path d="M-8 0 A8 8 0 0 1 0 -8" fill="none" stroke="#fff" stroke-width="1" opacity="0.3"/>';
  } else {
    inner = "";
    for (var i = 0; i < 6; i++) inner += '<ellipse cx="0" cy="-7" rx="4.6" ry="6.6" fill="#fffaf5" stroke="#f1cfdc" stroke-width="0.8" transform="rotate(' + (i * 60) + ')"/>';
    inner += '<circle r="4" fill="#ffc15e"/><circle cx="-1.2" cy="-1.2" r="1.2" fill="#fff" opacity="0.6"/>';
  }
  return '<g transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + rot + ') scale(1.55)">' + inner + "</g>";
}

function toppingsRing(shapeId, kinds) {
  if (!kinds.length) return "";
  var out = "", n = Math.min(14, 8 + kinds.length * 2), i, a, t, L, r = rng(5);
  for (i = 0; i < n; i++) {
    a = i / n * Math.PI * 2 - Math.PI / 2;
    L = 0;
    for (t = 20; t <= 170; t += 2) {
      if (inShape(shapeId, Math.cos(a) * t / 0.9, Math.sin(a) * t / 0.9)) L = t; else break;
    }
    var d = L * 0.76;
    var kd = kinds[i % kinds.length], rt = Math.floor(r() * 50 - 25);
    out += toppingSVG(kd, Math.cos(a) * d, Math.sin(a) * d, kd === "lilin" ? 0 : rt);
  }
  return out;
}

/* batas tepi bentuk kue pada sudut a (sama dengan cara toppingsRing) */
function ckEdge(shapeId, a) {
  var L = 0, t;
  for (t = 20; t <= 170; t += 2) {
    if (inShape(shapeId, Math.cos(a) * t / 0.9, Math.sin(a) * t / 0.9)) L = t; else break;
  }
  return L;
}

/* rosette krim di sepanjang tepi atas kue */
function rosettesSVG(shapeId, cream) {
  var out = "", n = 24, c1 = shade(cream, 0.14), c2 = shade(cream, -0.18), i, a, d;
  for (i = 0; i < n; i++) {
    a = i / n * Math.PI * 2;
    d = ckEdge(shapeId, a) * 0.93;
    out += '<g transform="translate(' + (Math.cos(a) * d).toFixed(1) + " " + (Math.sin(a) * d).toFixed(1) + ')">' +
      '<circle r="7" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="1"/>' +
      '<path d="M0 -4.2 C3 -4.2 4.4 -1 2.2 .6 C.4 2 -2.6 1 -2.4 -1.4 C-2.2 -3 .6 -3 1 -1.4" fill="none" stroke="' + c2 + '" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="-2" cy="-2.6" r="1.3" fill="#fff" opacity="0.55"/></g>';
  }
  return out;
}

/* daun hijau di sela-sela topping */
function leavesSVG(shapeId, count) {
  var out = "", n = Math.min(14, 8 + count * 2), i, a, d;
  for (i = 0; i < n; i++) {
    a = (i + 0.5) / n * Math.PI * 2 - Math.PI / 2;
    d = ckEdge(shapeId, a) * 0.76;
    out += '<g transform="translate(' + (Math.cos(a) * d).toFixed(1) + " " + (Math.sin(a) * d).toFixed(1) + ") rotate(" + (a * 180 / Math.PI).toFixed(0) + ')">' +
      '<path d="M-4 0 C2 -6 11 -5 13 0 C11 5 2 6 -4 0Z" fill="#74b86a" stroke="#4f8a46" stroke-width="0.8"/><path d="M-2 0 L11 0" stroke="#4f8a46" stroke-width="0.8"/></g>';
  }
  return out;
}

/* mutiara emas di bagian tengah (hanya jika tidak ada tulisan) */
function goldPearlsSVG(shapeId) {
  var out = "", n = 10, i, a, d;
  for (i = 0; i < n; i++) {
    a = i / n * Math.PI * 2 + 0.3;
    d = ckEdge(shapeId, a) * 0.46;
    out += '<g transform="translate(' + (Math.cos(a) * d).toFixed(1) + " " + (Math.sin(a) * d).toFixed(1) + ')"><circle r="3.6" fill="#f2c14e" stroke="#c8962a" stroke-width="0.8"/><circle cx="-1.1" cy="-1.2" r="1.1" fill="#fff" opacity="0.8"/></g>';
  }
  out += '<path d="M0 -9 L2.4 -2.6 L9 0 L2.4 2.6 L0 9 L-2.4 2.6 L-9 0 L-2.4 -2.6Z" fill="#f2c14e" stroke="#c8962a" stroke-width="0.8"/>';
  return out;
}

/* kilau, hati mungil, dan mutiara di piring */
function plateDecorSVG(cream) {
  var out = "", n = 14, i, a, x, y, pc = shade(cream, -0.12);
  for (i = 0; i < n; i++) {
    a = i / n * Math.PI * 2 + 0.2;
    x = 200 + Math.cos(a) * 150; y = 180 + Math.sin(a) * 150;
    if (i % 3 === 0) out += '<path transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ')" d="M0 -6.5 Q0 0 6.5 0 Q0 0 0 6.5 Q0 0 -6.5 0 Q0 0 0 -6.5Z" fill="#f2c14e"/>';
    else if (i % 3 === 1) out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.8" fill="' + pc + '" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/>';
    else out += '<path transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ') scale(0.8)" d="M0 4.5 C-7 0 -7 -5.5 -2.8 -5.5 C-1.2 -5.5 0 -4.4 0 -3.2 C0 -4.4 1.2 -5.5 2.8 -5.5 C7 -5.5 7 0 0 4.5Z" fill="#ff8fb3"/>';
  }
  return out;
}

export function cakeSVG() {
  var sh = ck.shape, sz = ckFind(CK.sizes, ck.size), sp = ckFind(CK.sponges, ck.sponge), spr = ckFind(CK.sprinkles, ck.sprinkle);
  var cream = ck.cream, creamEdge = shade(cream, -0.1), pearl = shade(cream, -0.07), spDark = shade(sp.color, -0.2);
  var txt = (ck.text || "").trim();
  var s = '<circle cx="200" cy="180" r="160" fill="#ffffff" stroke="#eadfd2" stroke-width="3"/><circle cx="200" cy="180" r="140" fill="none" stroke="#f3e9dd" stroke-width="2"/>';
  s += plateDecorSVG(cream);
  s += '<g class="cake-pop"><g transform="translate(200 172) scale(' + sz.s + ')">';
  s += '<g transform="translate(7 22)" fill="rgba(61,42,31,0.14)">' + shapeEl(sh) + "</g>";
  s += '<g transform="translate(0 13)" fill="' + spDark + '">' + shapeEl(sh) + "</g>";
  s += '<g fill="' + sp.color + '" stroke="' + spDark + '" stroke-width="2">' + shapeEl(sh) + "</g>";
  s += '<g transform="scale(0.93)">';
  s += '<g fill="none" stroke="' + pearl + '" stroke-width="15" stroke-linecap="round" stroke-dasharray="0.1 19">' + shapeEl(sh) + "</g>";
  s += '<g fill="' + cream + '" stroke="' + creamEdge + '" stroke-width="1.5">' + shapeEl(sh) + "</g></g>";
  s += '<g transform="scale(0.72)" fill="' + shade(cream, 0.28) + '">' + shapeEl(sh) + "</g>";
  s += rosettesSVG(sh, cream);
  s += sprinklesSVG(spr, sh);
  if (!txt) s += goldPearlsSVG(sh);
  if (ck.toppings.length) s += leavesSVG(sh, ck.toppings.length);
  s += toppingsRing(sh, ck.toppings);
  if (txt) {
    var fs = Math.min(34, 340 / Math.max(txt.length, 1));
    var tc = luminance(cream) > 0.6 ? "#4a2c1a" : "#ffffff";
    s += '<text x="0" y="' + (fs * 0.32).toFixed(1) + '" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-weight="600" font-size="' + fs.toFixed(1) + '" fill="' + tc + '" stroke="' + cream + '" stroke-width="5" paint-order="stroke" stroke-linejoin="round">' + esc(txt) + "</text>";
  }
  s += "</g></g>";
  return s;
}
