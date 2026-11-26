/* =========================================================
   SVG bunga & biji kopi (dipakai maskot, intro, dan hujan kue).
   ========================================================= */

export function flowerSVG(petal, center, n) {
  n = n || 5;
  var s = '<svg viewBox="0 0 40 40" aria-hidden="true">';
  for (var i = 0; i < n; i++) {
    s += '<ellipse cx="20" cy="10" rx="6.5" ry="9" fill="' + petal + '" transform="rotate(' + (360 / n * i) + ' 20 20)"/>';
  }
  return s + '<circle cx="20" cy="20" r="5.6" fill="' + center + '"/><circle cx="18.4" cy="18.4" r="1.7" fill="#fff" opacity="0.65"/></svg>';
}
export function beanSVG() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(30 12 12)"><ellipse cx="12" cy="12" rx="6.5" ry="10" fill="#6b3f26"/><path d="M12 2.5C9 8 15 16 12 21.5" fill="none" stroke="#3a1c0e" stroke-width="1.6" stroke-linecap="round"/></g></svg>';
}
export const FLOWER_COLORS = [
  ["#fff4e6", "#b9824a"], ["#f1d4a8", "#6b3f26"], ["#e0b47a", "#3d2a1f"],
  ["#c98f50", "#fff4e6"], ["#fbe9c7", "#8a5a3c"], ["#d9a466", "#4a2c1a"], ["#f6e0b8", "#a9784f"]
];
