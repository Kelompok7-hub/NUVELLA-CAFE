/* =========================================================
   Alur pesan kue: Order Summary → gambar PNG → WhatsApp admin.
   ========================================================= */
import { CK_WA } from "../../config/constants.js";
import { toast } from "../../core/toast.js";
import { CK, ckFind } from "../../data/cake-options.js";
import { cakeMeta, ck } from "../../state/cake.js";
import { $, $all, esc } from "../../utils/dom.js";
import { rupiah } from "../../utils/format.js";
import { save } from "../../utils/storage.js";
import { cakeTotal } from "./pricing.js";
import { renderCake } from "./studio.js";
import { cakeSVG } from "./svg.js";

var ckBlob = null, ckBusy = 0, ckQueue = [], ckRefFile = null, ckRefUrl = "", ckLastWaUrl = "";

function ckColorName(hex) {
  var h = String(hex).toLowerCase();
  for (var i = 0; i < CK.creams.length; i++) if (CK.creams[i].color === h) return CK.creams[i].name;
  return h.toUpperCase();
}
function ckTgl() { var p = ck.date.split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : "-"; }

function ckRows() {
  var sz = ckFind(CK.sizes, ck.size), sh = ckFind(CK.shapes, ck.shape), sp = ckFind(CK.sponges, ck.sponge), spr = ckFind(CK.sprinkles, ck.sprinkle);
  var tops = ck.toppings.length ? ck.toppings.map(function (id) { return ckFind(CK.toppings, id).name; }).join(", ") : "Tanpa";
  return [
    ["Nama pemesan", ck.name.trim() || "-"],
    ["Ukuran kue", sz.name + " " + sz.cm + " cm (" + sz.serve + ")"],
    ["Rasa kue", sp.name],
    ["Warna & tema", "Krim " + ckColorName(ck.cream) + (ck.theme.trim() ? " · Tema: " + ck.theme.trim() : "")],
    ["Tulisan pada kue", ck.text.trim() ? "“" + ck.text.trim() + "”" : "Tanpa"],
    ["Tanggal pengambilan", ck.date ? ckTgl() : "-"],
    ["Bentuk · Tingkat", sh.name + " · " + ckFind(CK.tiers, ck.tier).name],
    ["Sprinkle", spr.name],
    ["Topping", tops],
    ["Foto referensi", ckRefFile ? "Ada (dilampirkan di chat)" : "Tanpa"],
    ["Estimasi harga", rupiah(cakeTotal(ck))]
  ];
}

function ckWrap(ctx, text, maxW) {
  var words = String(text).split(" "), lines = [], cur = "", i, t;
  for (i = 0; i < words.length; i++) {
    t = cur ? cur + " " + words[i] : words[i];
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

/* render desain kue + ringkasan menjadi gambar PNG */
function ckMakeImage() {
  ckBusy++;
  var W = 800, SVGH = 720;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + SVGH + '" viewBox="0 0 400 360">' + cakeSVG() + "</svg>";
  var img = new Image();
  function done() { ckBusy--; if (!ckBusy) { var q = ckQueue; ckQueue = []; q.forEach(function (f) { f(); }); } }
  img.onload = function () {
    try {
      var rows = ckRows(), cv = document.createElement("canvas"), ctx = cv.getContext("2d"), LX = 48, VX = 296, maxW = W - VX - 48, LH = 32;
      ctx.font = "500 22px Arial, sans-serif";
      var total = 0, wrapped = rows.map(function (r) { var l = ckWrap(ctx, r[1], maxW); total += l.length; return l; });
      var footH = 36 + total * LH + rows.length * 8 + 28;
      cv.width = W; cv.height = 96 + SVGH + footH;
      ctx.fillStyle = "#fffdfa"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.textAlign = "center"; ctx.fillStyle = "#3d2a1f"; ctx.font = "italic 600 44px Georgia, serif"; ctx.fillText("Nuvella Caffe", W / 2, 56);
      ctx.fillStyle = "#6e625a"; ctx.font = "500 20px Arial, sans-serif"; ctx.fillText("Custom Cake · Cake Studio", W / 2, 84);
      ctx.drawImage(img, 0, 96, W, SVGH);
      var y = 96 + SVGH + 16;
      ctx.strokeStyle = "#e6ddd3"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LX, y); ctx.lineTo(W - LX, y); ctx.stroke();
      y += 20; ctx.textAlign = "left";
      rows.forEach(function (r, i) {
        y += 24;
        ctx.fillStyle = "#6e625a"; ctx.font = "500 22px Arial, sans-serif"; ctx.fillText(r[0], LX, y);
        ctx.fillStyle = i === rows.length - 1 ? "#3d2a1f" : "#2a211c"; ctx.font = (i === rows.length - 1 ? "700" : "500") + " 22px Arial, sans-serif";
        wrapped[i].forEach(function (ln, k) { ctx.fillText(ln, VX, y + k * LH); });
        y += (wrapped[i].length - 1) * LH + LH - 24 + 8;
      });
      cv.toBlob(function (b) {
        ckBlob = b;
        var im = $("#mdDesign"); if (im) im.src = cv.toDataURL("image/png");
        done();
      }, "image/png");
    } catch (e) { done(); }
  };
  img.onerror = done;
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function ckBuildMessage() {
  var sz = ckFind(CK.sizes, ck.size), sh = ckFind(CK.shapes, ck.shape), sp = ckFind(CK.sponges, ck.sponge), spr = ckFind(CK.sprinkles, ck.sprinkle);
  var tops = ck.toppings.length ? ck.toppings.map(function (id) { return ckFind(CK.toppings, id).name; }).join(", ") : "Tanpa";
  return [
    "Halo Nuvella Caffe, saya mau pesan *Custom Cake* dari Cake Studio.",
    "",
    "*Order Summary*",
    "- Nama pemesan: " + ck.name.trim(),
    "- Ukuran kue: " + sz.name + " " + sz.cm + " cm (" + sz.serve + ")",
    "- Rasa kue: " + sp.name,
    "- Warna dan tema: Krim " + ckColorName(ck.cream) + (ck.theme.trim() ? ", tema " + ck.theme.trim() : ""),
    "- Tulisan pada kue: " + (ck.text.trim() ? '"' + ck.text.trim() + '"' : "Tanpa"),
    "- Tanggal pengambilan: " + ckTgl(),
    "- Foto referensi: " + (ckRefFile ? "Ada (saya lampirkan di chat ini)" : "Tanpa"),
    "",
    "Detail desain: " + sh.name + ", " + ckFind(CK.tiers, ck.tier).name + ", sprinkle " + spr.name + ", topping " + tops + ".",
    "Budget: " + rupiah(ck.budget) + " | Estimasi: " + rupiah(cakeTotal(ck)),
    "",
    "Gambar desain kue saya lampirkan di chat ini. Mohon konfirmasi ketersediaan dan harga akhirnya ya. Terima kasih 🙏"
  ].join("\n");
}

function ckSetFlow(now) {
  $all("#ckFlow li").forEach(function (li, i) {
    li.classList.toggle("is-done", i < now);
    li.classList.toggle("is-now", i === now);
  });
}

function ckRefreshModal() {
  $("#mdItems").innerHTML = ckRows().map(function (r) { return "<li><span>" + esc(r[0]) + "</span><span>" + esc(r[1]) + "</span></li>"; }).join("");
  $("#mdTotal").textContent = rupiah(cakeTotal(ck));
  ckMakeImage();
}

function ckModalError(msg, el) {
  var e = $("#mdError");
  e.textContent = msg || ""; e.hidden = !msg;
  if (msg && el) el.focus();
}

function ckValidate() {
  if (!ck.name.trim()) { ckModalError("Isi nama pemesan dulu ya.", $("#mdName")); return false; }
  if (!ck.date) { ckModalError("Pilih tanggal pengambilan dulu ya.", $("#mdDate")); return false; }
  if (ck.date < cakeMeta.minDate) { ckModalError("Tanggal pengambilan minimal besok.", $("#mdDate")); return false; }
  ckModalError("");
  return true;
}

function ckDownload() {
  if (!ckBlob) return;
  var a = document.createElement("a"), slug = (ck.name.trim() || "pesanan").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "pesanan";
  a.href = URL.createObjectURL(ckBlob); a.download = "custom-cake-nuvella-" + slug + ".png";
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

function ckOpenModal() {
  var m = $("#ckModal");
  $("#mdName").value = ck.name; $("#mdTheme").value = ck.theme; $("#mdText").value = ck.text;
  $("#mdDate").min = cakeMeta.minDate; $("#mdDate").value = ck.date;
  $("#mdForm").hidden = false; $("#mdDone").hidden = true;
  ckModalError(""); ckSetFlow(1);
  ckRefreshModal();
  m.hidden = false;
  document.documentElement.classList.add("ck-lock");
  setTimeout(function () { try { $("#mdName").focus(); } catch (e) {} }, 60);
}
function ckCloseModal() {
  $("#ckModal").hidden = true;
  document.documentElement.classList.remove("ck-lock");
}

function ckSend() {
  if (!ckValidate()) return;
  function go() {
    var url = "https://wa.me/" + CK_WA + "?text=" + encodeURIComponent(ckBuildMessage());
    ckLastWaUrl = url;
    ckDownload();                                   /* gambar desain tersimpan, tinggal dilampirkan */
    window.open(url, "_blank", "noopener");        /* WhatsApp admin terbuka dengan ringkasan pesanan */
    $("#mdReopen").href = url;
    $("#mdForm").hidden = true; $("#mdDone").hidden = false;
    ckSetFlow(3);
    var box = $(".ckmodal__box"); if (box) box.scrollTop = 0;
  }
  if (ckBusy) ckQueue.push(go); else go();
}

function ckShare() {
  if (!ckValidate()) return;
  function go() {
    if (!ckBlob) return;
    var files = [new File([ckBlob], "custom-cake-nuvella.png", { type: "image/png" })];
    if (ckRefFile) files.push(ckRefFile);
    var data = { files: files, text: ckBuildMessage() };
    if (navigator.canShare && navigator.canShare({ files: files })) {
      navigator.share(data).then(function () { ckSetFlow(3); toast("Pilih WhatsApp lalu kontak admin ya."); }).catch(function () {});
    } else { toast("Perangkat ini belum mendukung bagikan gambar. Pakai tombol Kirim ke WhatsApp Admin."); }
  }
  if (ckBusy) ckQueue.push(go); else go();
}

export function initCakeOrder() {
  $("#ckOrder").addEventListener("click", ckOpenModal);
  $("#ckModalClose").addEventListener("click", ckCloseModal);
  $("#mdBack").addEventListener("click", ckCloseModal);
  $("#mdFinish").addEventListener("click", ckCloseModal);
  $("#ckModal").addEventListener("click", function (e) { if (e.target === this) ckCloseModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#ckModal").hidden) ckCloseModal(); });

  $("#mdName").addEventListener("input", function (e) { ck.name = e.target.value; save("nuvella_cake", ck); ckModalError(""); ckRefreshModal(); });
  $("#mdTheme").addEventListener("input", function (e) { ck.theme = e.target.value; save("nuvella_cake", ck); ckRefreshModal(); });
  $("#mdText").addEventListener("input", function (e) {
    ck.text = e.target.value; $("#ckText").value = ck.text;
    renderCake(); ckRefreshModal();
  });
  $("#mdDate").addEventListener("change", function (e) { ck.date = e.target.value; save("nuvella_cake", ck); ckModalError(""); ckRefreshModal(); });

  $("#mdRef").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    if (ckRefUrl) { URL.revokeObjectURL(ckRefUrl); ckRefUrl = ""; }
    if (!f || !/^image\//.test(f.type)) { ckRefFile = null; $("#mdRefBox").hidden = true; if (f) toast("Pilih file gambar ya."); ckRefreshModal(); return; }
    ckRefFile = f; ckRefUrl = URL.createObjectURL(f);
    $("#mdRefImg").src = ckRefUrl; $("#mdRefBox").hidden = false;
    ckRefreshModal();
  });
  $("#mdRefClear").addEventListener("click", function () {
    ckRefFile = null; $("#mdRef").value = "";
    if (ckRefUrl) { URL.revokeObjectURL(ckRefUrl); ckRefUrl = ""; }
    $("#mdRefBox").hidden = true; ckRefreshModal();
  });

  $("#mdSend").addEventListener("click", ckSend);
  $("#mdSave").addEventListener("click", function () { if (ckBusy) ckQueue.push(ckDownload); else ckDownload(); toast("Gambar desain disimpan."); });
  try {
    if (navigator.canShare && navigator.canShare({ files: [new File([""], "a.png", { type: "image/png" })] })) {
      $("#mdShare").hidden = false; $("#mdShare").addEventListener("click", ckShare);
    }
  } catch (e) {}
}
