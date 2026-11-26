/* =========================================================
   Hitung estimasi harga kue.
   ========================================================= */
import { CK, ckFind } from "../../data/cake-options.js";

export function cakeTotal(st) {
  var sz = ckFind(CK.sizes, st.size), sh = ckFind(CK.shapes, st.shape), sp = ckFind(CK.sponges, st.sponge), spr = ckFind(CK.sprinkles, st.sprinkle);
  var t = sz.price + ckFind(CK.tiers, st.tier).add + sh.add + sp.add + spr.add + (st.text && st.text.trim() ? 5000 : 0);
  st.toppings.forEach(function (id) { t += ckFind(CK.toppings, id).add; });
  return t;
}
