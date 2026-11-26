/* =========================================================
   Format angka, waktu, dan angka acak.
   ========================================================= */

export function rupiah(n) { return "Rp" + n.toLocaleString("id-ID"); }
export function short(n) { return n / 1000 + "k"; }
export function pad(n) { return (n < 10 ? "0" : "") + n; }
export function clock(d) { return pad(d.getHours()) + "." + pad(d.getMinutes()); }

export function rnd(a, b) { return a + Math.random() * (b - a); }
