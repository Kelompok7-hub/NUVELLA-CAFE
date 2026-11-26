/* =========================================================
   State aplikasi bersama (satu objek, supaya bisa diubah dari modul mana pun).
   ========================================================= */
import { load } from "../utils/storage.js";

export const state = {
  cart: load("nuvella_cart", {}),
  order: load("nuvella_order", null),
  activeCat: "signature",
  selectedSlot: null,
  statusTimer: null,
  leaveTimer: null,
  lastPage: null,
  introActive: false
};
