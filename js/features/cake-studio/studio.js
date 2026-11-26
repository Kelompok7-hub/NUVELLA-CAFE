/* =========================================================
   Panel pilihan Cake Studio, pratinjau kue, budget, dan "sesuaikan otomatis".
   ========================================================= */
import { toast } from "../../core/toast.js";
import { CK, ckFind } from "../../data/cake-options.js";
import { cakeMeta, ck } from "../../state/cake.js";
import { $, esc } from "../../utils/dom.js";
import { pad, rupiah, short } from "../../utils/format.js";
import { save } from "../../utils/storage.js";
import { cakeTotal } from "./pricing.js";
import { cakeSVG, shapeEl } from "./svg.js";

function shapeIcon(id) {
  return '<svg class="ico" viewBox="-150 -150 300 300" aria-hidden="true"><g fill="currentColor">' + shapeEl(id) + "</g></svg>";
}

function renderCkOptions() {
  $("#ckShapes").innerHTML = CK.shapes.map(function (o) {
    return '<button type="button" class="opt" data-k="shape" data-v="' + o.id + '" aria-pressed="' + (ck.shape === o.id) + '">' + shapeIcon(o.id) + o.name + (o.add ? " <small>+" + short(o.add) + "</small>" : "") + "</button>";
  }).join("");
  $("#ckSizes").innerHTML = CK.sizes.map(function (o) {
    return '<button type="button" class="opt opt--card" data-k="size" data-v="' + o.id + '" aria-pressed="' + (ck.size === o.id) + '"><strong>' + o.name + " · " + o.cm + ' cm</strong><small>' + o.serve + " · " + rupiah(o.price) + "</small></button>";
  }).join("");
  $("#ckTiers").innerHTML = CK.tiers.map(function (o) {
    return '<button type="button" class="opt opt--card" data-k="tier" data-v="' + o.id + '" aria-pressed="' + (ck.tier === o.id) + '"><strong>' + o.name + '</strong><small>' + o.serve + (o.add ? " · +" + rupiah(o.add) : "") + "</small></button>";
  }).join("");
  $("#ckSponges").innerHTML = CK.sponges.map(function (o) {
    return '<button type="button" class="opt" data-k="sponge" data-v="' + o.id + '" aria-pressed="' + (ck.sponge === o.id) + '"><span class="dot" style="--c:' + o.color + '"></span>' + o.name + (o.add ? " <small>+" + short(o.add) + "</small>" : "") + "</button>";
  }).join("");
  $("#ckCreams").innerHTML = CK.creams.map(function (o) {
    return '<button type="button" class="swatch" data-k="cream" data-v="' + o.color + '" style="--c:' + o.color + '" aria-label="' + o.name + '" title="' + o.name + '" aria-pressed="' + (ck.cream.toLowerCase() === o.color) + '"></button>';
  }).join("");
  $("#ckSprinkles").innerHTML = CK.sprinkles.map(function (o) {
    var dots = o.colors.length ? '<span class="dots">' + o.colors.slice(0, 4).map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join("") + "</span>" : "";
    return '<button type="button" class="opt" data-k="sprinkle" data-v="' + o.id + '" aria-pressed="' + (ck.sprinkle === o.id) + '">' + dots + o.name + (o.add ? " <small>+" + short(o.add) + "</small>" : "") + "</button>";
  }).join("");
  $("#ckToppings").innerHTML = CK.toppings.map(function (o) {
    return '<button type="button" class="opt" data-k="topping" data-v="' + o.id + '" aria-pressed="' + (ck.toppings.indexOf(o.id) >= 0) + '">' + o.name + " <small>+" + short(o.add) + "</small></button>";
  }).join("");
}

function renderBudget() {
  var total = cakeTotal(ck), over = total > ck.budget;
  $("#ckBudgetVal").textContent = rupiah(ck.budget);
  var pill = $("#ckPill");
  pill.classList.toggle("is-over", over);
  pill.textContent = over ? "Lewat " + rupiah(total - ck.budget) : "Pas! Sisa " + rupiah(ck.budget - total);
  $("#ckMeterBox").classList.toggle("is-over", over);
  $("#ckMeter").style.width = Math.min(100, Math.round(total / ck.budget * 100)) + "%";
}

function showCakePhoto() {
  /* foto stok dimatikan agar desain buatan pengguna (lengkap dengan hiasan) yang tampil */
  var img0 = $("#cakePhoto"), svg0 = $("#cakeSvg");
  if (img0) img0.hidden = true;
  if (svg0) svg0.style.display = "";
  return;
  var img = $("#cakePhoto"), svg = $("#cakeSvg");
  if (!img) return;
  var list = CK.photos[ck.tier] || CK.photos["1"], idx = 0;
  img.onload = function () { img.hidden = false; svg.style.display = "none"; };
  img.onerror = function () {
    idx++;
    if (idx < list.length) img.src = list[idx];
    else { img.hidden = true; svg.style.display = ""; }
  };
  if (img.getAttribute("data-tier") !== ck.tier) { img.setAttribute("data-tier", ck.tier); img.src = list[0]; }
}

export function renderCake(replay) {
  var sz = ckFind(CK.sizes, ck.size), sh = ckFind(CK.shapes, ck.shape), sp = ckFind(CK.sponges, ck.sponge), spr = ckFind(CK.sprinkles, ck.sprinkle);
  var total = cakeTotal(ck);
  $("#cakeSvg").innerHTML = cakeSVG();
  showCakePhoto();
  $("#ckBadge").textContent = ckFind(CK.tiers, ck.tier).name + " · " + sh.name + " · " + sz.name + " " + sz.cm + " cm";
  $("#ckTotal").textContent = rupiah(total);
  $("#ckTotal2").textContent = rupiah(total);

  var rows = [
    ["Bentuk", sh.name + (sh.add ? " (+" + rupiah(sh.add) + ")" : "")],
    ["Tingkat", ckFind(CK.tiers, ck.tier).name + (ckFind(CK.tiers, ck.tier).add ? " (+" + rupiah(ckFind(CK.tiers, ck.tier).add) + ")" : "")],
    ["Ukuran", sz.name + " " + sz.cm + " cm (" + rupiah(sz.price) + ")"],
    ["Rasa kue", sp.name + (sp.add ? " (+" + rupiah(sp.add) + ")" : "")],
    ["Warna krim", ck.cream.toUpperCase()],
    ["Sprinkle", spr.name + (spr.add ? " (+" + rupiah(spr.add) + ")" : "")],
    ["Topping", ck.toppings.length ? ck.toppings.map(function (id) { return ckFind(CK.toppings, id).name; }).join(", ") : "Tanpa"],
    ["Tulisan", ck.text.trim() ? "“" + esc(ck.text.trim()) + "” (+" + rupiah(5000) + ")" : "Tanpa"]
  ];
  $("#ckItems").innerHTML = rows.map(function (r) { return "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>"; }).join("");
  renderBudget();
  save("nuvella_cake", ck);
}

function ckFit() {
  var sizes = CK.sizes.slice().reverse(), i, st = JSON.parse(JSON.stringify(ck)), steps = [
    function () {},
    function () { st.toppings = []; st.tier = "1"; },
    function () { st.sprinkle = "none"; },
    function () { st.shape = "bulat"; st.text = ""; }
  ], msg = "";
  for (var k = 0; k < steps.length; k++) {
    steps[k]();
    for (i = 0; i < sizes.length; i++) {
      st.size = sizes[i].id;
      if (cakeTotal(st) <= ck.budget) {
        Object.assign(ck, st);
        msg = k === 0 ? "Pas! Ukuran " + sizes[i].name + " muat di budgetmu." : "Desain disesuaikan: ukuran " + sizes[i].name + " dan beberapa tambahan dikurangi.";
        renderCkOptions(); $("#ckText").value = ck.text; renderCake();
        toast(msg);
        return;
      }
    }
  }
  Object.assign(ck, st, { size: "mini" });
  renderCkOptions(); $("#ckText").value = ck.text; renderCake();
  toast("Budget terlalu kecil untuk kue ini. Naikkan budget sedikit ya.");
}

export function initCakeStudio() {
  renderCkOptions();
  $("#ckBudget").value = ck.budget;
  $("#ckText").value = ck.text;
  $("#ckCream").value = /^#[0-9a-f]{6}$/i.test(ck.cream) ? ck.cream : "#f4e3c3";
  var d = new Date(); d.setDate(d.getDate() + 1);
  cakeMeta.minDate = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  if (ck.date && ck.date < cakeMeta.minDate) ck.date = "";
  renderCake();

  $("#studioPanel").addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-k]");
    if (!b) return;
    var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
    if (k === "topping") {
      var ix = ck.toppings.indexOf(v);
      if (ix >= 0) ck.toppings.splice(ix, 1); else ck.toppings.push(v);
    } else if (k === "cream") {
      ck.cream = v; $("#ckCream").value = v;
    } else { ck[k] = v; }
    renderCkOptions(); renderCake();
  });
  $("#ckCream").addEventListener("input", function (e) { ck.cream = e.target.value; renderCkOptions(); renderCake(); });
  $("#ckText").addEventListener("input", function (e) { ck.text = e.target.value; renderCake(); });
  $("#ckBudget").addEventListener("input", function (e) { ck.budget = parseInt(e.target.value, 10) || 150000; renderBudget(); save("nuvella_cake", ck); });
  $("#ckFit").addEventListener("click", ckFit);

}
