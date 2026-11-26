/* =========================================================
   Form pesanan: jam ambil, validasi nama & HP, konfirmasi, link WhatsApp.
   ========================================================= */
import { WA_NUMBER } from "../config/constants.js";
import { playSuccessSound, playWav, unlockAudio } from "../core/audio.js";
import { emit } from "../core/events.js";
import { toast } from "../core/toast.js";
import { HOURS } from "../data/hours.js";
import { cartLines, cartTotal } from "../state/cart.js";
import { addOrder } from "../state/orders.js";
import { state } from "../state/store.js";
import { $, $all } from "../utils/dom.js";
import { clock, rupiah } from "../utils/format.js";
import { save } from "../utils/storage.js";

/* ---------- Jam ambil ---------- */
function buildSlots() {
  var now = new Date();
  var slots = [];
  var d = new Date(now.getTime() + 15 * 60000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  var guard = 0;
  while (slots.length < 8 && guard < 400) {
    guard++;
    var h = HOURS[d.getDay()];
    var mins = d.getHours() * 60 + d.getMinutes();
    if (mins >= h.open * 60 && mins <= h.close * 60 - 15) {
      var isToday = d.toDateString() === now.toDateString();
      slots.push({ value: d.toISOString(), label: (isToday ? "" : "Besok ") + clock(d) });
    }
    d = new Date(d.getTime() + 15 * 60000);
  }
  if (slots.length && slots[0].label.indexOf("Besok") === -1 && new Date(slots[0].value) - now < 35 * 60000) {
    slots[0].label = "Secepatnya · " + slots[0].label;
  }
  return slots;
}

export function renderSlots() {
  var slots = buildSlots();
  if (!state.selectedSlot || !slots.some(function (s) { return s.value === state.selectedSlot.value; })) state.selectedSlot = slots[0] || null;
  $("#slots").innerHTML = slots.map(function (s) {
    return '<button type="button" class="slot" data-slot="' + s.value + '" data-label="' + s.label + '" aria-pressed="' + (state.selectedSlot && s.value === state.selectedSlot.value) + '">' + s.label + '</button>';
  }).join("");
}

export function updateWaLink() {
  var lines = cartLines().map(function (l) { return "- " + l.qty + "x " + l.item.name + " (" + rupiah(l.item.price * l.qty) + ")"; });
  var text = "Halo Nuvella Caffe, saya ingin pesan:\n" + lines.join("\n") +
    "\nTotal: " + rupiah(cartTotal()) +
    "\nNama: " + ($("#name").value.trim() || "-") +
    "\nNo. HP: " + ($("#phone").value.trim() || "-") +
    "\nJam ambil: " + (state.selectedSlot ? state.selectedSlot.label : "-") +
    ($("#note").value.trim() ? "\nCatatan: " + $("#note").value.trim() : "");
  $("#waOrder").href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
}

/* Validasi nomor HP: hanya angka */
function validatePhone(showEmpty) {
  var input = $("#phone");
  var v = input.value.trim();
  var title = "", fix = "";
  if (!v) {
    if (showEmpty) { title = "Nomor HP belum diisi."; fix = "Ketik nomor HP aktif yang hanya berisi angka, contoh: 085755183802."; }
  } else if (/[^0-9]/.test(v)) {
    title = "Nomor HP hanya boleh berisi angka.";
    fix = "Cara memperbaiki: hapus huruf, spasi, atau simbol (seperti + - ( ) .) lalu tulis angkanya saja. Contoh: ubah +62 857-5518-3802 menjadi 085755183802.";
  } else if (v.length < 10 || v.length > 13) {
    title = v.length < 10 ? "Nomor HP terlalu pendek." : "Nomor HP terlalu panjang.";
    fix = "Cara memperbaiki: nomor HP Indonesia berisi 10–13 angka dan diawali 08. Sekarang ada " + v.length + " angka.";
  } else if (v.indexOf("08") !== 0) {
    title = "Nomor HP harus diawali 08.";
    fix = "Cara memperbaiki: jika diawali 62, ganti 62 dengan 0. Contoh: 6285755183802 menjadi 085755183802.";
  }
  var box = $("#phoneError");
  if (title) {
    $("#phoneErrorTitle").textContent = title;
    $("#phoneErrorFix").textContent = fix;
    box.hidden = false;
    input.setAttribute("aria-invalid", "true");
    $("#phoneHint").hidden = true;
    return false;
  }
  box.hidden = true;
  input.removeAttribute("aria-invalid");
  $("#phoneHint").hidden = false;
  return !!v;
}

function validateName(show) {
  var ok = $("#name").value.trim().length >= 2;
  var err = $("#nameError");
  if (!ok && show) { err.textContent = "Isi nama minimal 2 huruf agar barista bisa memanggilmu."; err.hidden = false; $("#name").setAttribute("aria-invalid", "true"); }
  if (ok) { err.hidden = true; $("#name").removeAttribute("aria-invalid"); }
  return ok;
}

export function initCheckout() {
  $("#slots").addEventListener("click", function (e) {
    var b = e.target.closest("[data-slot]");
    if (!b) return;
    state.selectedSlot = { value: b.getAttribute("data-slot"), label: b.getAttribute("data-label") };
    $all(".slot").forEach(function (s) { s.setAttribute("aria-pressed", s === b); });
    $("#slotError").hidden = true;
    updateWaLink();
  });

  ["#name", "#phone", "#note"].forEach(function (s) { $(s).addEventListener("input", updateWaLink); });

  $("#phone").addEventListener("input", function () { validatePhone(false); });
  $("#phone").addEventListener("blur", function () { if ($("#phone").value) validatePhone(true); });
  $("#name").addEventListener("input", function () { validateName(false); });

  $("#orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var okName = validateName(true);
    var okPhone = validatePhone(true);
    var okSlot = !!state.selectedSlot;
    $("#slotError").hidden = okSlot;
    if (!okName) { $("#name").focus(); return; }
    if (!okPhone) { $("#phone").focus(); return; }
    if (!okSlot) return;

    unlockAudio();
    var btn = $("#submitOrder");
    btn.classList.add("is-loading");
    btn.disabled = true;
    setTimeout(function () {
      state.order = {
        code: "NV-" + Math.floor(1000 + Math.random() * 9000),
        name: $("#name").value.trim(),
        phone: $("#phone").value.trim(),
        pickup: state.selectedSlot.label.replace("Secepatnya · ", ""),
        lines: cartLines().map(function (l) { return { name: l.item.name, qty: l.qty, price: l.item.price }; }),
        total: cartTotal(),
        note: $("#note").value.trim(),
        createdAt: Date.now(),
        status: 0,
        done: false
      };
      save("nuvella_order", state.order);
      addOrder(state.order).catch(function () { toast("Pesanan tersimpan di perangkatmu, tapi belum terkirim ke admin. Gunakan tombol WhatsApp."); });
      state.cart = {}; save("nuvella_cart", state.cart);
      btn.classList.remove("is-loading");
      btn.disabled = false;
      $("#orderForm").reset();
      state.selectedSlot = null;
      $("#slots").innerHTML = "";
      emit("cart:changed");
      playWav(playSuccessSound);
      toast("Pesanan " + state.order.code + " berhasil dibuat");
      window.scrollTo(0, 0);
    }, 900);
  });
}
