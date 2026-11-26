/* =========================================================
   Deteksi preferensi pengguna (kurangi animasi).
   ========================================================= */

export const REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
