/* =========================================================
   Pesan antar-modul sederhana (menghindari modul saling mengimpor).
   ========================================================= */

var handlers = {};
export function on(name, fn) { (handlers[name] = handlers[name] || []).push(fn); }
export function emit(name, data) { (handlers[name] || []).forEach(function (fn) { fn(data); }); }
