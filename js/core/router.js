/* =========================================================
   Router berbasis hash (#/menu, #/keranjang, ...) + animasi pindah halaman.
   ========================================================= */
import { state } from "../state/store.js";
import { $, $all } from "../utils/dom.js";
import { REDUCE } from "../utils/env.js";

/* Halaman mendaftarkan diri di sini (lihat main.js), jadi router tidak perlu
   mengenal modul fitur satu per satu. */
var pageHooks = {};
var routeListeners = [];
export function registerPage(page, hooks) { pageHooks[page] = hooks; }
export function onRoute(fn) { routeListeners.push(fn); }

/* ---------- Router + animasi pindah halaman ---------- */
var PAGES = ["beranda", "tentang", "menu", "cake-studio", "keranjang", "reservasi", "faq", "admin"];

export function navigate(path) {
  try { if (location.hash !== "#" + path) location.hash = path; } catch (e) {}
  route(path);
}

function switchPage(page) {
  clearTimeout(state.leaveTimer);
  var pages = $all(".page");
  pages.forEach(function (p) { p.classList.remove("is-leaving"); });

  var next = $('[data-page="' + page + '"]');
  var prev = null;
  pages.forEach(function (p) { if (!p.hidden && p !== next) prev = prev || p; });

  pages.forEach(function (p) {
    if (p !== next && p !== prev) { p.hidden = true; p.classList.remove("is-entering"); }
  });

  var first = state.lastPage === null;
  var dir = state.lastPage && PAGES.indexOf(page) < PAGES.indexOf(state.lastPage) ? -1 : 1;
  state.lastPage = page;

  function enter() {
    next.style.setProperty("--dir", dir);
    next.hidden = false;
    next.classList.remove("is-entering");
    void next.offsetWidth;
    next.classList.add("is-entering");
    var hooks = pageHooks[page]; if (hooks && hooks.onEnter) hooks.onEnter();
    setTimeout(function () { next.classList.remove("is-entering"); }, 1000);
  }

  if (!prev) { if (next.hidden || first) enter(); return; }

  if (REDUCE) { prev.hidden = true; enter(); return; }
  prev.style.setProperty("--dir", dir);
  prev.classList.add("is-leaving");
  var wipe = $("#wipe");
  if (wipe) { wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go"); }
  state.leaveTimer = setTimeout(function () {
    prev.hidden = true;
    prev.classList.remove("is-leaving", "is-entering");
    enter();
  }, 420);
}

export function route(pathArg) {
  var path = (pathArg || location.hash.replace(/^#/, "") || "/beranda").replace(/^\//, "");
  var parts = path.split("/");
  var page = parts[0];
  if (page === "pesan" || page === "status") page = "keranjang";
  if (PAGES.indexOf(page) < 0) page = "beranda";


  $all("[data-nav]").forEach(function (a) {
    var on = a.getAttribute("data-nav") === page;
    a.classList.toggle("is-active", on);
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });

  var titles = {
    beranda: "Pesan dulu, ambil tanpa antre",
    tentang: "Tentang Kami",
    menu: "Menu",
    "cake-studio": "Cake Studio",
    keranjang: "Keranjang & Status Pesanan",
    reservasi: "Reservasi Meja & Acara",
    faq: "Apa yang Bisa Kami Bantu?",
    admin: "Admin Pesanan"
  };
  document.title = titles[page] + " — Nuvella Caffe";

  routeListeners.forEach(function (fn) { fn(page); });
  var hooks = pageHooks[page];
  if (hooks && hooks.render) hooks.render(parts);

  switchPage(page);
  window.scrollTo(0, 0);
}

export function initRouter() {
  /* Tangkap semua tautan internal agar URL tetap rapi */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!a) return;
    e.preventDefault();
    navigate(a.getAttribute("href").slice(1));
  });
  window.addEventListener("hashchange", function () { route(); });
}
