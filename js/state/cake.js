/* =========================================================
   State desain kue yang sedang dibuat (disimpan di localStorage).
   ========================================================= */
import { load } from "../utils/storage.js";

var CK_DEFAULT = { shape: "bulat", size: "kecil", tier: "1", sponge: "vanila", cream: "#f4e3c3", sprinkle: "rainbow", toppings: ["stroberi"], text: "", budget: 150000, name: "", date: "", theme: "" };
export const ck = (function () {
  var s = load("nuvella_cake", null) || {}, o = {};
  Object.keys(CK_DEFAULT).forEach(function (k) { o[k] = s[k] !== undefined ? s[k] : CK_DEFAULT[k]; });
  if (!Array.isArray(o.toppings)) o.toppings = [];
  return o;
})();

export const cakeMeta = { minDate: "" };   // tanggal minimal pengambilan (besok)
