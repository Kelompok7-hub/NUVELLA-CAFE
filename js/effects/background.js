/* =========================================================
   Latar bergerak dan serpihan kue yang melayang.
   ========================================================= */
import { treatPiece } from "./treats.js";
import { $ } from "../utils/dom.js";
import { REDUCE } from "../utils/env.js";
import { rnd } from "../utils/format.js";

/* ---------- Efek 3D: latar, tilt kartu, parallax hero, judul per kata ---------- */
export function buildBackground() {
  var bg = $("#bgScene");
  if (!bg) return;
  var html = '<span class="blob blob--1"></span><span class="blob blob--2"></span><span class="blob blob--3"></span>';
  bg.innerHTML = html;
}

/* Serpihan lembut melayang di latar semua halaman */
export function mountAmbient() {
  if (REDUCE || document.querySelector(".ambient")) return;
  var box = document.createElement("div");
  box.className = "ambient";
  box.setAttribute("aria-hidden", "true");
  var n = window.innerWidth < 640 ? 9 : 16;
  for (var i = 0; i < n; i++) {
    var el = document.createElement("span");
    var dur = rnd(16, 30);
    el.style.setProperty("--x", rnd(0, 96).toFixed(1) + "%");
    el.style.setProperty("--sz", rnd(18, 34).toFixed(0) + "px");
    el.style.setProperty("--dur", dur.toFixed(1) + "s");
    el.style.setProperty("--delay", (-rnd(0, dur)).toFixed(1) + "s");
    el.style.setProperty("--sway", rnd(20, 60).toFixed(0) + "px");
    el.innerHTML = treatPiece(i + 1);
    box.appendChild(el);
  }
  document.body.appendChild(box);
}
