/* =========================================================
   Maskot Novella di beranda (suara, lompat, bunga).
   ========================================================= */
import { playPop, playWelcome, unlockAudio } from "../core/audio.js";
import { FLOWER_COLORS, flowerSVG } from "../effects/flowers.js";
import { $ } from "../utils/dom.js";
import { REDUCE } from "../utils/env.js";
import { rnd } from "../utils/format.js";

export function burstFlowers() {
  var wrap = $("#mascotWrap");
  if (!wrap || REDUCE) return;
  for (var i = 0; i < 16; i++) {
    var el = document.createElement("span");
    var a = (i / 16) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(110, 230);
    var c = FLOWER_COLORS[i % FLOWER_COLORS.length];
    el.className = "burst";
    el.style.setProperty("--sz", rnd(22, 38).toFixed(0) + "px");
    el.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
    el.style.setProperty("--dy", (Math.sin(a) * d * 0.8 - 40).toFixed(0) + "px");
    el.style.setProperty("--r", rnd(-300, 300).toFixed(0) + "deg");
    el.innerHTML = flowerSVG(c[0], c[1], 5);
    wrap.appendChild(el);
    (function (node) { setTimeout(function () { node.remove(); }, 1300); })(el);
  }
}

/* ---------- Maskot Novella di beranda (suara + lompat + bunga) ---------- */
export function initHomeMascot() {
  var mascot = $("#mascot"), bubble = $("#bubbleText");
  if (!mascot) return;
  var tapped = 0;
  var lines = ["Hai, aku <b>Novella</b>! ☕", "Hehe, geli! 😆", "Wuih! Bunga-bunga untukmu 🌼", "Yuk pesan kopi favoritmu! ☕"];
  mascot.addEventListener("click", function () {
    unlockAudio();
    if (tapped === 0) playWelcome(); else playPop();
    burstFlowers();
    mascot.classList.remove("is-jump"); void mascot.offsetWidth; mascot.classList.add("is-jump");
    setTimeout(function () { mascot.classList.remove("is-jump"); }, 760);
    if (bubble) bubble.innerHTML = lines[tapped % lines.length];
    var bub = $("#bubble"); if (bub) { bub.classList.remove("pop"); void bub.offsetWidth; bub.classList.add("pop"); }
    tapped++;
  });
}
