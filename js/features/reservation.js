/* =========================================================
   Reservasi meja & acara, dikirim ke WhatsApp admin.
   ========================================================= */
import { WA_NUMBER } from "../config/constants.js";
import { toast } from "../core/toast.js";
import { $, esc } from "../utils/dom.js";
import { pad } from "../utils/format.js";

/* ---------- Reservasi (Langsung ke WhatsApp Admin) ---------- */
function initReservationDate() {
  var dateInput = $("#resDate");
  if (dateInput && !dateInput.value) {
    var tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    dateInput.value = tomorrow.getFullYear() + "-" + pad(tomorrow.getMonth() + 1) + "-" + pad(tomorrow.getDate());
  }
}

function buildReservationWaUrl() {
  var name = $("#resName").value.trim() || "-";
  var phone = $("#resPhone").value.trim() || "-";
  var date = $("#resDate").value || "-";
  var time = $("#resTime").value || "-";
  var pax = $("#resPax").value || "-";
  var area = $("#resArea").value || "-";
  var note = $("#resNote").value.trim();

  var msg = "Halo Admin Nuvella Caffe, saya ingin melakukan reservasi:\n" +
    "- Nama: " + name + "\n" +
    "- No. HP: " + phone + "\n" +
    "- Tanggal: " + date + "\n" +
    "- Jam: " + time + "\n" +
    "- Jumlah Orang: " + pax + " orang\n" +
    "- Area: " + area +
    (note ? "\n- Catatan: " + note : "");
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
}

export function renderReservation() {
  initReservationDate();
  var rows = [
    ["Nama", $("#resName").value.trim() || "—"],
    ["Nomor HP", $("#resPhone").value.trim() || "—"],
    ["Tanggal", $("#resDate").value || "—"],
    ["Jam", $("#resTime").value || "—"],
    ["Jumlah Tamu", ($("#resPax").value || "0") + " orang"],
    ["Area", $("#resArea").value || "—"]
  ];
  if ($("#resNote").value.trim()) rows.push(["Catatan", $("#resNote").value.trim()]);
  $("#resSummaryItems").innerHTML = rows.map(function (r) {
    return '<li><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></li>';
  }).join("");
  $("#waReserveDirect").href = buildReservationWaUrl();
}

function validateReservation() {
  var nameVal = $("#resName").value.trim();
  var phoneVal = $("#resPhone").value.trim();
  var dateVal = $("#resDate").value;
  var paxVal = Number($("#resPax").value);

  var okName = nameVal.length >= 2;
  $("#resNameError").textContent = okName ? "" : "Isi nama pemesan minimal 2 huruf.";
  $("#resNameError").hidden = okName;
  if (okName) $("#resName").removeAttribute("aria-invalid"); else $("#resName").setAttribute("aria-invalid", "true");

  var okPhone = /^08[0-9]{8,11}$/.test(phoneVal);
  $("#resPhoneError").textContent = okPhone ? "" : "Masukkan nomor HP aktif 10–13 angka yang diawali 08.";
  $("#resPhoneError").hidden = okPhone;
  if (okPhone) $("#resPhone").removeAttribute("aria-invalid"); else $("#resPhone").setAttribute("aria-invalid", "true");

  var okDate = !!dateVal;
  $("#resDateError").textContent = okDate ? "" : "Pilih tanggal reservasi.";
  $("#resDateError").hidden = okDate;

  var okPax = paxVal >= 1 && paxVal <= 20;
  $("#resPaxError").textContent = okPax ? "" : "Jumlah tamu antara 1 sampai 20 orang.";
  $("#resPaxError").hidden = okPax;

  if (!okName) { $("#resName").focus(); return false; }
  if (!okPhone) { $("#resPhone").focus(); return false; }
  if (!okDate) { $("#resDate").focus(); return false; }
  if (!okPax) { $("#resPax").focus(); return false; }
  return true;
}

export function initReservation() {
  ["#resName", "#resPhone", "#resDate", "#resTime", "#resPax", "#resArea", "#resNote"].forEach(function (sel) {
    var el = $(sel);
    if (el) { el.addEventListener("input", renderReservation); el.addEventListener("change", renderReservation); }
  });

  $("#reservationForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateReservation()) return;
    var waUrl = buildReservationWaUrl();
    toast("Mengarahkan reservasi ke WhatsApp Admin...");
    var win = window.open(waUrl, "_blank", "noopener");
    if (!win) window.location.href = waUrl;
  });
}
