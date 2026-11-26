/* =========================================================
   Status pesanan (Diterima → Disiapkan → Siap diambil → Selesai).
   ========================================================= */
import { WA_NUMBER } from "../config/constants.js";
import { emit } from "../core/events.js";
import { onRoute } from "../core/router.js";
import { getOrder, patchOrder } from "../state/orders.js";
import { state } from "../state/store.js";
import { $, $all, esc } from "../utils/dom.js";
import { rupiah } from "../utils/format.js";
import { save } from "../utils/storage.js";

/* ---------- Status pesanan (bagian dari halaman Keranjang) ---------- */
var STAGES = [
  { title: "Pesanan diterima", sub: "Barista sudah menerima pesananmu." },
  { title: "Sedang disiapkan", sub: "Coffe dan dessertmu sedang dibuat." },
  { title: "Siap diambil", sub: "Datang ke meja pickup dan sebutkan kodemu." },
  { title: "Selesai", sub: "Terima kasih sudah memesan di Nuvella Caffe." }
];

function currentStage() {
  if (!state.order) return -1;
  if (state.order.done) return 3;
  return state.order.status || 0;   // status diatur admin (halaman #/admin)
}

/* Ambil status terbaru dari admin */
async function syncStatus() {
  if (!state.order || state.order.done) return;
  try {
    var remote = await getOrder(state.order.code);
    if (!remote || remote.status === undefined || remote.status === state.order.status) return;
    state.order.status = remote.status;
    save("nuvella_order", state.order);
    paintStatus();
  } catch (e) {}
}

export function paintStatus() {
  if (!state.order) { clearInterval(state.statusTimer); return; }
  var stage = currentStage();
  $("#statusCode").textContent = state.order.code;
  $("#statusHeadline").textContent = STAGES[stage].title;
  $("#statusSub").textContent = stage === 3 ? STAGES[3].sub : "Ambil pukul " + state.order.pickup + " atas nama " + state.order.name + ". " + STAGES[stage].sub;
  $all("#timeline li").forEach(function (li) {
    var i = Number(li.getAttribute("data-step"));
    li.classList.toggle("is-done", i < stage || stage === 3);
    li.classList.toggle("is-current", i === stage && stage !== 3);
  });
  $("#statusItems").innerHTML = state.order.lines.map(function (l) {
    return '<li><span>' + l.qty + '× ' + esc(l.name) + '</span><span>' + rupiah(l.price * l.qty) + '</span></li>';
  }).join("");
  $("#statusTotal").textContent = rupiah(state.order.total);
  $("#markDone").hidden = stage !== 2;
  $("#clearStatus").hidden = stage !== 3;
  $("#waStatus").href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent("Halo Nuvella Caffe, saya ingin menanyakan pesanan " + state.order.code + " atas nama " + state.order.name + ".");
  if (stage === 3) clearInterval(state.statusTimer);
}

export function initOrderStatus() {
  $("#markDone").addEventListener("click", function () {
    state.order.done = true; state.order.status = 3; save("nuvella_order", state.order); paintStatus();
    patchOrder(state.order.code, { status: 3 }).catch(function () {});
  });
  $("#clearStatus").addEventListener("click", function () {
    state.order = null; save("nuvella_order", null); emit("cart:render");
  });
  /* hentikan pembaruan status saat meninggalkan halaman Keranjang */
  onRoute(function (page) { if (page !== "keranjang") clearInterval(state.statusTimer); });
  setInterval(syncStatus, 4000);
  window.addEventListener("storage", syncStatus);
}
