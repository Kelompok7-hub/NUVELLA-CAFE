/* =========================================================
   Hitungan isi keranjang (tanpa DOM).
   ========================================================= */
import { findItem } from "../data/menu.js";
import { state } from "./store.js";

export function cartLines() {
  return Object.keys(state.cart).map(function (id) { return { item: findItem(id), qty: state.cart[id] }; }).filter(function (l) { return l.item && l.qty > 0; });
}
export function cartTotal() { return cartLines().reduce(function (s, l) { return s + l.item.price * l.qty; }, 0); }
export function cartCount() { return cartLines().reduce(function (s, l) { return s + l.qty; }, 0); }
