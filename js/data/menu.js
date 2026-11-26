/* =========================================================
   Data menu, kategori, dan urutan foto cadangan.
   ========================================================= */
import { FOTO_DIR } from "../config/constants.js";

export const CATEGORIES = [
  { id: "signature", name: "Signature" },
  { id: "cheesecake", name: "Cheesecake" },
  { id: "mille-crepe", name: "Mille Crepe" },
  { id: "pastry", name: "Pastry" },
  { id: "coffe", name: "Coffe" },
  { id: "non-coffe", name: "Non Coffe" }
];

/* fx = jenis animasi pada gambar: pistachio | choco | steam | bubble | sparkle
   Foto: assets/foto/<id>.jpg  (nama file = id menu). */
function foto(id) { return FOTO_DIR + id + ".jpg"; }

export const MENU = [
  /* Signature (3 menu pertama ini juga tampil di "Menu Rekomendasi" beranda) */
  { id: "ice-cream-brownies", cat: "signature", fx: "steam", name: "Ice Cream Brownies", desc: "Brownies hangat dengan satu scoop vanilla", price: 20000, img: foto("ice-cream-brownies") },
  { id: "pour-tiramisu", cat: "signature", fx: "choco", name: "Pour Tiramisu", desc: "Tiramisu dengan espresso yang dituang di meja", price: 35000, img: foto("pour-tiramisu") },
  { id: "choco-pistachio", cat: "signature", fx: "pistachio", name: "Choco Pistachio", desc: "Cokelat pekat dan krim pistachio", price: 35000, img: foto("choco-pistachio") },

  /* Cheesecake */
  { id: "matcha-cheesecake", cat: "cheesecake", fx: "sparkle", name: "Matcha Cheesecake", desc: "Matcha Uji, lembut dan tidak terlalu manis", price: 25000, img: foto("matcha-cheesecake") },
  { id: "red-velvet-cheesecake", cat: "cheesecake", fx: "sparkle", name: "Red Velvet Cheesecake", desc: "Red velvet berlapis cream cheese", price: 25000, img: foto("red-velvet-cheesecake") },
  { id: "choco-cheesecake", cat: "cheesecake", fx: "choco", name: "Choco Cheesecake", desc: "Dark chocolate di atas cheesecake klasik", price: 25000, img: foto("choco-cheesecake") },

  /* Mille Crepe */
  { id: "strawberry-cheese", cat: "mille-crepe", fx: "sparkle", name: "Strawberry Cheese", desc: "Lapisan crepe, krim keju, dan stroberi", price: 16000, img: foto("strawberry-cheese") },
  { id: "banana-caramel", cat: "mille-crepe", fx: "sparkle", name: "Banana Caramel", desc: "Pisang dan saus karamel asin", price: 16000, img: foto("banana-caramel") },
  { id: "blueberry-cream", cat: "mille-crepe", fx: "sparkle", name: "Blueberry Cream", desc: "Krim segar dan selai blueberry", price: 16000, img: foto("blueberry-cream") },

  /* Pastry */
  { id: "butter-croissant", cat: "pastry", fx: "steam", name: "Butter Croissant", desc: "Mentega Prancis, renyah berlapis", price: 21000, img: foto("butter-croissant") },
  { id: "pain-au-chocolat", cat: "pastry", fx: "choco", name: "Pain au Chocolat", desc: "Croissant dengan dua batang cokelat", price: 16000, img: foto("pain-au-chocolat") },
  { id: "pistachio-cromboloni", cat: "pastry", fx: "pistachio", name: "Pistachio Cromboloni", desc: "Croissant bundar isi krim pistachio", price: 18000, img: foto("pistachio-cromboloni") },

  /* Coffe */
  { id: "americano", cat: "coffe", fx: "steam", name: "Americano", desc: "Espresso dan air, panas atau dingin", price: 18000, img: foto("americano") },
  { id: "salted-caramel-latte", cat: "coffe", fx: "steam", name: "Salted Caramel Latte", desc: "Latte dengan karamel asin", price: 18000, img: foto("salted-caramel-latte") },
  { id: "cappuccino", cat: "coffe", fx: "steam", name: "Cappuccino", desc: "Espresso dengan foam susu tebal", price: 18000, img: foto("cappuccino") },

  /* Non Coffe */
  { id: "matcha-latte", cat: "non-coffe", fx: "steam", name: "Matcha Latte", desc: "Matcha dan susu segar", price: 19000, img: foto("matcha-latte") },
  { id: "strawberry-matcha", cat: "non-coffe", fx: "bubble", name: "Strawberry Matcha", desc: "Matcha di atas susu stroberi", price: 19000, img: foto("strawberry-matcha") },
  { id: "orange-squash", cat: "non-coffe", fx: "bubble", name: "Orange Squash", desc: "Jeruk peras dan soda", price: 15000, img: foto("orange-squash") }
];

/* Foto menu: assets/foto/<id>.jpg */
export function imgChain(item) { return [item.img || foto(item.id)]; }

export function findItem(id) { for (var i = 0; i < MENU.length; i++) if (MENU[i].id === id) return MENU[i]; return null; }
