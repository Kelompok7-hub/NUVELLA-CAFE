/* =========================================================
   Halaman Menu: tab kategori, kartu menu, tombol tambah, dan rekomendasi di beranda.
   ========================================================= */
import { playWav } from "../core/audio.js";
import { navigate } from "../core/router.js";
import { toast } from "../core/toast.js";
import { CATEGORIES, findItem, imgChain, MENU } from "../data/menu.js";
import { updateCartUI } from "./cart.js";
import { state } from "../state/store.js";
import { $, esc } from "../utils/dom.js";
import { short } from "../utils/format.js";
import { ICON_PLUS } from "../utils/icons.js";
import { save } from "../utils/storage.js";

/* ---------- Menu & Foto Produk ---------- */
function itemRow(item, i) {
  var ware = (item.cat === "coffe" || item.cat === "non-coffe") ? "glass" : "plate";
  return '<li class="menu-item menu-item--' + ware + '" style="--i:' + i + '">' +
    '<div class="menu-item__thumb">' +
      '<div class="menu-item__imgwrap"><img class="menu-item__img" src="' + imgChain(item)[0] + '" data-fb="' + imgChain(item).slice(1).join("|") + '" alt="' + esc(item.name) + '" loading="lazy" /></div>' +
    '</div>' +
    '<div class="menu-item__info"><p class="menu-item__name">' + esc(item.name) + '</p><p class="menu-item__desc">' + esc(item.desc) + '</p></div>' +
    '<span class="menu-item__price">' + short(item.price) + '</span>' +
    '<button type="button" class="add-btn" data-add="' + item.id + '" aria-label="Tambah ' + esc(item.name) + ' ke keranjang">' +
    ICON_PLUS + '<span class="spinner" aria-hidden="true"></span></button>' +
    '</li>';
}

function renderTabs() {
  $("#menuTabs").innerHTML = CATEGORIES.map(function (c) {
    return '<button type="button" role="tab" class="tab" data-cat="' + c.id + '" aria-selected="' + (c.id === state.activeCat) + '">' + c.name + '</button>';
  }).join("");
}

/* Jumlah menu per kategori yang ditampilkan (halaman Menu dan Rekomendasi beranda = 3 item). */
var PER_CATEGORY = 3;
function visibleItems(cat) {
  return MENU.filter(function (m) { return m.cat === cat; }).slice(0, PER_CATEGORY);
}

function renderMenu() {
  renderTabs();
  $("#menuList").innerHTML = visibleItems(state.activeCat).map(itemRow).join("");
}

/** Halaman Menu: pilih kategori dari URL (#/menu/pastry) lalu tampilkan. */
export function showMenuPage(parts) {
  if (parts[1]) {
    var catSlug = parts[1] === "kopi" ? "coffe" : (parts[1] === "non-kopi" ? "non-coffe" : parts[1]);
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === catSlug) state.activeCat = catSlug;
  }
  renderMenu();
}

export function initMenu() {
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (!t || t.tagName !== "IMG" || !t.classList.contains("menu-item__img")) return;
    var q = (t.getAttribute("data-fb") || "").split("|").filter(Boolean);
    if (!q.length) return;
    t.setAttribute("data-fb", q.slice(1).join("|"));
    t.src = q[0];
  }, true);

  $("#menuTabs").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    navigate("/menu/" + btn.getAttribute("data-cat"));
  });

  /* Tambah ke keranjang: loading → notifikasi */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-add]");
    if (!btn || btn.classList.contains("is-loading")) return;
    var item = findItem(btn.getAttribute("data-add"));
    btn.classList.add("is-loading");
    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    setTimeout(function () {
      state.cart[item.id] = (state.cart[item.id] || 0) + 1;
      save("nuvella_cart", state.cart);
      btn.classList.remove("is-loading");
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
      updateCartUI(true);
      playWav();
      toast(item.name + " ditambahkan ke keranjang", "Lihat", function () { navigate("/keranjang"); });
    }, 550);
  });

  /* ---------- Beranda: signature ---------- */
  /* Gambar menu rekomendasi: foto asli, bingkai piring yang seragam */
  var favoritesEl = $("#favoritesList");
  if (favoritesEl) {
    favoritesEl.innerHTML = visibleItems("signature").map(itemRow).join("");
  }
}
