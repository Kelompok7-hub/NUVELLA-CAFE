/* =========================================================
   Semua suara: file .wav, bunyi sukses, pop, klik, dan salam maskot (Web Audio).
   ========================================================= */
import { SFX_FILE } from "../config/constants.js";

/* ---------- Suara sukses pesanan (Web Audio, tanpa file) ---------- */
export let audioCtx = null;
export function unlockAudio() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (e) {}
}
/* Suara file .wav (taruh file di folder yang sama dengan index.html). Jika file tidak ada, pakai suara bawaan. */
var sfxEl = null;
export function playWav(fallback) {
  try {
    if (!sfxEl) { sfxEl = new Audio(SFX_FILE); sfxEl.preload = "auto"; }
    sfxEl.currentTime = 0;
    var p = sfxEl.play();
    if (p && p.catch) p.catch(function () { if (fallback) fallback(); });
  } catch (e) { if (fallback) fallback(); }
}
export function playSuccessSound() {
  try {
    unlockAudio();
    var ctx = audioCtx;
    if (!ctx) return;
    var t0 = ctx.currentTime + 0.05;
    var master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    /* gema lembut */
    var delay = ctx.createDelay(); delay.delayTime.value = 0.24;
    var fb = ctx.createGain(); fb.gain.value = 0.32;
    var wet = ctx.createGain(); wet.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    function bell(freq, start, dur, vol) {
      [[1, 1], [2.01, 0.35], [2.76, 0.18], [5.4, 0.07]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq * p[0];
        g.gain.setValueAtTime(0.0001, t0 + start);
        g.gain.exponentialRampToValueAtTime(vol * p[1], t0 + start + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur / p[0] * (p[0] > 1 ? 1.4 : 1));
        o.connect(g); g.connect(master); g.connect(delay);
        o.start(t0 + start); o.stop(t0 + start + dur + 0.2);
      });
    }
    /* arpeggio naik C mayor 7: ting-ting-ting-TING */
    bell(659.25, 0.00, 1.1, 0.22);   // E5
    bell(783.99, 0.11, 1.1, 0.22);   // G5
    bell(987.77, 0.22, 1.2, 0.22);   // B5
    bell(1318.5, 0.36, 1.8, 0.28);   // E6
    bell(2093.0, 0.52, 1.4, 0.10);   // C7 kilau
  } catch (e) {}
}

/* ---------- Suara maskot & tombol Klik (Web Audio, tanpa file) ---------- */
function tone(freq, start, dur, vol, type, slideTo) {
  var ctx = audioCtx; if (!ctx) return;
  var t0 = ctx.currentTime + 0.02 + start;
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type || "sine";
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur * 0.8);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
export function playPop() {
  try {
    unlockAudio(); if (!audioCtx) return;
    tone(420, 0, 0.14, 0.22, "sine", 900);
    tone(1180, 0.09, 0.2, 0.12, "triangle", 1560);
  } catch (e) {}
}
export function playKlik() {
  try {
    unlockAudio(); if (!audioCtx) return;
    tone(880, 0, 0.09, 0.16, "square", 660);
    tone(1318.5, 0.07, 0.5, 0.2, "sine");
    tone(1760, 0.15, 0.55, 0.16, "sine");
    tone(2637, 0.24, 0.7, 0.08, "sine");
  } catch (e) {}
}

/* Salam suara maskot: lonceng ceria + ucapan "Selamat datang" */
export function playWelcome() {
  try {
    unlockAudio(); if (!audioCtx) return;
    tone(784, 0, 0.22, 0.2, "sine");
    tone(988, 0.12, 0.26, 0.2, "sine");
    tone(1318.5, 0.26, 0.7, 0.22, "sine");
    tone(2093, 0.4, 0.6, 0.08, "triangle");
  } catch (e) {}
  try {
    if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
      var u = new SpeechSynthesisUtterance("Selamat datang di Nuvella Caffe!");
      u.lang = "id-ID"; u.rate = 1; u.pitch = 1.35; u.volume = 1;
      setTimeout(function () {
        try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (e) {}
      }, 600);
    }
  } catch (e) {}
}
