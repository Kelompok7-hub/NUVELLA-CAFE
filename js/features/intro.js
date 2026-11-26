/* =========================================================
   Intro maskot (aktif bila ada elemen #splash di HTML).
   ========================================================= */
import { audioCtx, playKlik, playPop, playWelcome, unlockAudio } from "../core/audio.js";
import { route } from "../core/router.js";
import { beanSVG, FLOWER_COLORS, flowerSVG } from "../effects/flowers.js";
import { burstFlowers } from "./mascot.js";
import { state } from "../state/store.js";
import { $ } from "../utils/dom.js";
import { REDUCE } from "../utils/env.js";
import { rnd } from "../utils/format.js";

function mountIntroDecor() {
  var rain = $("#splashRain"), garden = $("#splashGarden");
  if (!rain || !garden || REDUCE) return;
  var small = window.innerWidth < 640;

  var n = small ? 18 : 30, i, el, dur, c;
  for (i = 0; i < n; i++) {
    el = document.createElement("span");
    var bean = i % 4 === 3;
    dur = rnd(10, 18);
    el.className = "drop";
    el.style.setProperty("--x", rnd(0, 96).toFixed(1) + "%");
    el.style.setProperty("--sz", (bean ? rnd(14, 24) : rnd(20, 40)).toFixed(0) + "px");
    el.style.setProperty("--dur", dur.toFixed(1) + "s");
    el.style.setProperty("--delay", (-rnd(0, dur)).toFixed(1) + "s");
    el.style.setProperty("--sway", rnd(18, 56).toFixed(0) + "px");
    el.style.setProperty("--spin", rnd(5, 11).toFixed(1) + "s");
    c = FLOWER_COLORS[i % FLOWER_COLORS.length];
    el.innerHTML = bean ? beanSVG() : flowerSVG(c[0], c[1], i % 2 ? 5 : 6);
    rain.appendChild(el);
  }

  var g = small ? 7 : 12;
  for (i = 0; i < g; i++) {
    el = document.createElement("span");
    el.className = "sprout";
    var sz = rnd(30, 46);
    c = FLOWER_COLORS[(i * 3) % FLOWER_COLORS.length];
    el.style.setProperty("--x", ((i + 0.5) / g * 100 + rnd(-3, 3)).toFixed(1) + "%");
    el.style.setProperty("--sz", sz.toFixed(0) + "px");
    el.style.setProperty("--h", rnd(46, 108).toFixed(0) + "px");
    el.style.setProperty("--gd", (0.15 * i).toFixed(2) + "s");
    el.innerHTML = '<i class="stem"></i>' + flowerSVG(c[0], c[1], 5 + (i % 2));
    garden.appendChild(el);
  }
}

export function initIntro() {
  var splash = $("#splash");
  if (!splash) return;
  /* tautan langsung ke halaman lain: lewati intro */
  if (/^#\/(?!beranda)/.test(location.hash)) { splash.hidden = true; return; }

  state.introActive = true;
  document.documentElement.classList.add("intro-lock");
  mountIntroDecor();

  var mascot = $("#mascot"), go = $("#splashGo"), hint = $("#splashHint"), bubble = $("#bubbleText");
  var tapped = 0;
  var lines = [
    "Yeay! Aku <b>Novella</b>, yuk masuk! 🌸",
    "Hehe, geli! Klik tombolnya ya ☕",
    "Wuih! Bunga-bunga untukmu 🌼"
  ];

  /* Browser memblokir suara sebelum ada sentuhan: coba putar langsung, kalau diblokir putar saat sentuhan pertama */
  var welcomeAt = 0;
  function welcome() { if (welcomeAt) return; welcomeAt = Date.now(); playWelcome(); }
  unlockAudio();
  if (audioCtx && audioCtx.state === "running") welcome();
  ["pointerdown", "touchstart", "keydown", "click"].forEach(function (ev) {
    document.addEventListener(ev, function once() {
      document.removeEventListener(ev, once, true);
      if (state.introActive) welcome();
    }, true);
  });

  mascot.addEventListener("click", function () {
    if (Date.now() - welcomeAt > 900) playPop();
    burstFlowers();
    mascot.classList.add("is-happy");
    mascot.classList.remove("is-jump"); void mascot.offsetWidth; mascot.classList.add("is-jump");
    setTimeout(function () { mascot.classList.remove("is-jump"); }, 760);
    bubble.innerHTML = lines[tapped % lines.length];
    tapped++;
    var bub = $("#bubble"); bub.classList.remove("pop"); void bub.offsetWidth; bub.classList.add("pop");
    if (go.hidden) {
      hint.hidden = true;
      go.hidden = false;
      go.classList.add("is-show");
    }
  });

  go.addEventListener("click", function () {
    playKlik();
    enterSite();
  });
}

function enterSite() {
  var splash = $("#splash");
  if (!splash || splash.classList.contains("is-leaving")) return;
  splash.classList.add("is-leaving");
  document.documentElement.classList.remove("intro-lock");
  try { history.replaceState(null, "", "#/beranda"); } catch (e) {}
  setTimeout(function () { state.introActive = false; route("/beranda"); }, REDUCE ? 0 : 380);
  setTimeout(function () { splash.hidden = true; }, REDUCE ? 0 : 950);
}
