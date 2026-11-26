/* =========================================================
   Konversi & pencahayaan warna (dipakai Cake Studio).
   ========================================================= */

function hexToRgb(h) {
  h = String(h).replace("#", "");
  if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
  var n = parseInt(h, 16); if (isNaN(n)) n = 0xf4e3c3;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function shade(hex, amt) {
  var c = hexToRgb(hex);
  var t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return "rgb(" + c.map(function (v) { return Math.round((t - v) * p + v); }).join(",") + ")";
}
export function luminance(hex) { var c = hexToRgb(hex); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
