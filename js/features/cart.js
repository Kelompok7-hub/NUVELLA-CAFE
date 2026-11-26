/* =========================================================
   Badge keranjang, halaman Keranjang, dan tombol +/- jumlah.
   ========================================================= */
import { on } from "../core/events.js";
import { renderSlots, updateWaLink } from "./checkout.js";
import { paintStatus } from "./order-status.js";
import { cartCount, cartLines, cartTotal } from "../state/cart.js";
import { state } from "../state/store.js";
import { $, esc } from "../utils/dom.js";
import { rupiah } from "../utils/format.js";
import { save } from "../utils/storage.js";

/* ---------- Keranjang (badge) ---------- */
export function updateCartUI(bump) {
  var count = cartCount();
  var badge = $("#cartCount");
  badge.textContent = count;
  badge.hidden = count === 0;
  $("#cartOpen").setAttribute("aria-label", "Buka keranjang, " + count + " item");
  if (bump) {
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    var btn = $("#cartOpen");
    btn.classList.remove("wiggle"); void btn.offsetWidth; btn.classList.add("wiggle");
  }
  var pg = $('[data-page="keranjang"]');
  if (pg && !pg.hidden) renderCartPage();
}

/* ---------- Halaman Keranjang (isi keranjang + status) ---------- */
export function renderCartPage() {
  var lines = cartLines();
  var hasOrder = !!state.order;

  $("#cartEmptyPage").hidden = lines.length > 0 || hasOrder;
  $("#cartBody").hidden = lines.length === 0;
  $("#statusBody").hidden = !hasOrder;

  $("#cartItems").innerHTML = lines.map(function (l) {
    return '<li class="cart-line">' +
      '<img class="cart-line__img" src="' + l.item.img + '" alt="' + esc(l.item.name) + '" loading="lazy" />' +
      '<div><p class="cart-line__name">' + esc(l.item.name) + '</p><p class="cart-line__price">' + rupiah(l.item.price) + '</p></div>' +
      '<p class="cart-line__total">' + rupiah(l.item.price * l.qty) + '</p>' +
      '<span></span>' +
      '<div class="qty"><button type="button" data-dec="' + l.item.id + '" aria-label="Kurangi ' + esc(l.item.name) + '">−</button>' +
      '<span>' + l.qty + '</span>' +
      '<button type="button" data-inc="' + l.item.id + '" aria-label="Tambah ' + esc(l.item.name) + '">+</button></div>' +
      '</li>';
  }).join("");

  $("#summaryItems").innerHTML = lines.map(function (l) {
    return '<li><span>' + l.qty + '× ' + esc(l.item.name) + '</span><span>' + rupiah(l.item.price * l.qty) + '</span></li>';
  }).join("");
  $("#summaryTotal").textContent = rupiah(cartTotal());

  if (lines.length) {
    if (!$("#slots").children.length) renderSlots();
    updateWaLink();
  }

  clearInterval(state.statusTimer);
  if (hasOrder) {
    paintStatus();
    if (!state.order.done) state.statusTimer = setInterval(paintStatus, 1000);
  }
}

export function initCart() {
  $("#cartItems").addEventListener("click", function (e) {
    var inc = e.target.closest("[data-inc]");
    var dec = e.target.closest("[data-dec]");
    if (inc) state.cart[inc.getAttribute("data-inc")]++;
    if (dec) {
      var id = dec.getAttribute("data-dec");
      state.cart[id]--;
      if (state.cart[id] <= 0) delete state.cart[id];
    }
    if (inc || dec) { save("nuvella_cart", state.cart); updateCartUI(false); }
  });

  /* modul lain (checkout, status) memberi tahu lewat pesan, bukan impor langsung */
  on("cart:changed", function () { updateCartUI(false); });
  on("cart:render", renderCartPage);
}
