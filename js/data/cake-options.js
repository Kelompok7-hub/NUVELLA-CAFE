/* =========================================================
   Pilihan Cake Studio: bentuk, ukuran, rasa, krim, sprinkle, topping.
   ========================================================= */

export const CK = {
  shapes: [
    { id: "bulat", name: "Bulat", add: 0 },
    { id: "kotak", name: "Kotak", add: 10000 },
    { id: "hati", name: "Hati", add: 25000 },
    { id: "bunga", name: "Bunga", add: 35000 }
  ],
  tiers: [
    { id: "1", name: "1 Tingkat", n: 1, add: 0, serve: "Klasik" },
    { id: "2", name: "2 Tingkat", n: 2, add: 90000, serve: "Lebih megah" },
    { id: "3", name: "3 Tingkat", n: 3, add: 170000, serve: "Untuk acara besar" }
  ],
  photos: {
    "1": ["https://commons.wikimedia.org/wiki/Special:FilePath/Chocolate_Cheesecake.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Mille_crepe_cake.jpg?width=700"],
    "2": ["https://commons.wikimedia.org/wiki/Special:FilePath/Two_tier_wedding_cake.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Wedding_cake.jpg?width=700"],
    "3": ["https://commons.wikimedia.org/wiki/Special:FilePath/Wedding_cake_3_tiers.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Wedding_cake.jpg?width=700"]
  },
  sizes: [
    { id: "mini", name: "Mini", cm: 10, serve: "2–3 porsi", price: 65000, s: 0.52 },
    { id: "kecil", name: "Kecil", cm: 14, serve: "6–8 porsi", price: 120000, s: 0.68 },
    { id: "sedang", name: "Sedang", cm: 18, serve: "10–12 porsi", price: 185000, s: 0.84 },
    { id: "besar", name: "Besar", cm: 22, serve: "16–20 porsi", price: 260000, s: 1.0 }
  ],
  sponges: [
    { id: "vanila", name: "Vanila", color: "#f1d9a6", add: 0 },
    { id: "cokelat", name: "Cokelat", color: "#6a3f27", add: 5000 },
    { id: "redvelvet", name: "Red Velvet", color: "#a82a35", add: 15000 },
    { id: "matcha", name: "Matcha", color: "#9bb36f", add: 12000 },
    { id: "taro", name: "Taro", color: "#b79ad6", add: 12000 }
  ],
  creams: [
    { name: "Krim Putih", color: "#fff4e6" }, { name: "Pink Sakura", color: "#f8c0d2" },
    { name: "Lavender", color: "#d3c1f0" }, { name: "Mint", color: "#c3e8d6" },
    { name: "Peach", color: "#ffd2b3" }, { name: "Butter", color: "#fbe39b" },
    { name: "Biru Langit", color: "#bfdff3" }, { name: "Cokelat", color: "#7b4a31" }
  ],
  sprinkles: [
    { id: "none", name: "Tanpa", add: 0, colors: [] },
    { id: "rainbow", name: "Pelangi", add: 5000, kind: "bar", colors: ["#ff6b8b", "#ffb703", "#4cc9f0", "#7bd389", "#b388ff"] },
    { id: "pastel", name: "Pastel", add: 5000, kind: "bar", colors: ["#ffc8dd", "#bde0fe", "#caffbf", "#fdffb6", "#e4c1f9"] },
    { id: "choco", name: "Cokelat", add: 5000, kind: "bar", colors: ["#4a2c1a", "#6b3f26", "#3a1c0e"] },
    { id: "star", name: "Bintang Emas", add: 10000, kind: "star", colors: ["#f2b705", "#ffd166", "#ffe9a8"] },
    { id: "heart", name: "Hati Mungil", add: 10000, kind: "heart", colors: ["#ff7aa2", "#ffb3c8", "#ff4d79"] },
    { id: "pearl", name: "Mutiara", add: 12000, kind: "pearl", colors: ["#ffffff", "#f6e7c1", "#e9d8ff"] }
  ],
  toppings: [
    { id: "stroberi", name: "Stroberi", add: 15000 },
    { id: "ceri", name: "Ceri", add: 10000 },
    { id: "blueberry", name: "Blueberry", add: 12000 },
    { id: "bunga", name: "Bunga Edible", add: 8000 },
    { id: "mawar", name: "Mawar Krim", add: 12000 },
    { id: "macaron", name: "Macaron", add: 15000 },
    { id: "lilin", name: "Lilin Ulang Tahun", add: 5000 },
    { id: "mint", name: "Daun Mint", add: 5000 },
    { id: "kupu", name: "Kupu-kupu Fondant", add: 10000 },
    { id: "oreo", name: "Oreo", add: 8000 }
  ]
};

export function ckFind(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }
