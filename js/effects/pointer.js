/* =========================================================
   Efek yang mengikuti kursor/sentuhan: putar kedai 3D, tilt kartu, parallax.
   ========================================================= */
import { $ } from "../utils/dom.js";
import { REDUCE } from "../utils/env.js";

/* Kedai 3D: putar mengikuti kursor / sentuhan */
export function initShopPointer() {
  var scene = $("#shop3d");
  if (!scene) return;
  function move(e) {
    if (REDUCE) return;
    var r = scene.getBoundingClientRect();
    scene.style.setProperty("--sx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    scene.style.setProperty("--sy", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  }
  scene.addEventListener("pointermove", move);
  scene.addEventListener("pointerleave", function () {
    scene.style.setProperty("--sx", 0); scene.style.setProperty("--sy", 0);
  });
}

var TILT_SEL = ".menu-item, .pillar-card, .stat-box, .steps li";
var tiltEl = null;
function resetTilt(el) {
  if (!el) return;
  ["--rx", "--ry", "--mx", "--my"].forEach(function (p) { el.style.removeProperty(p); });
}

export function initTilt() {
  document.addEventListener("pointermove", function (e) {
    if (REDUCE || e.pointerType === "touch") return;
    var el = e.target.closest ? e.target.closest(TILT_SEL) : null;
    if (tiltEl && tiltEl !== el) resetTilt(tiltEl);
    tiltEl = el;
    if (!el) return;
    var r = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", ((px - 0.5) * 14).toFixed(2) + "deg");
    el.style.setProperty("--rx", ((0.5 - py) * 14).toFixed(2) + "deg");
    el.style.setProperty("--mx", (px * 100).toFixed(0) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(0) + "%");
  });
  document.addEventListener("mouseleave", function () { resetTilt(tiltEl); tiltEl = null; });
}

export function initHeroParallax() {
  var hero = $(".hero"), tilt = $(".hero__tilt");
  if (!hero || !tilt) return;
  hero.addEventListener("pointermove", function (e) {
    if (REDUCE || e.pointerType === "touch") return;
    var r = hero.getBoundingClientRect();
    tilt.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    tilt.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  });
  hero.addEventListener("pointerleave", function () {
    tilt.style.setProperty("--px", 0); tilt.style.setProperty("--py", 0);
  });
}
