/* =========================================================
   Pembantu DOM.
   ========================================================= */

export function $(sel) { return document.querySelector(sel); }
export function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
export function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
