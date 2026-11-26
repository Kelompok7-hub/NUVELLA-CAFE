/* =========================================================
   Halaman Admin (#/admin): login, daftar pesanan pelanggan, ubah status, hapus.
   ========================================================= */
import { ADMIN_EMAIL, ADMIN_PASS_HASH } from "../config/constants.js";
import { onRoute } from "../core/router.js";
import { toast } from "../core/toast.js";
import { isRemote, listOrders, patchOrder, removeOrder } from "../state/orders.js";
import { $, $all, esc } from "../utils/dom.js";
import { rupiah } from "../utils/format.js";

var SESSION_KEY = "nuvella_admin";
var STAGES = ["Diterima", "Disiapkan", "Siap diambil", "Selesai"];
var filter = "all";
var orders = [];
var knownCodes = null;
var timer = null;
var failCount = 0;

function loggedIn() { try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; } }
function setLoggedIn(on) { try { on ? sessionStorage.setItem(SESSION_KEY, "1") : sessionStorage.removeItem(SESSION_KEY); } catch (e) {} }

async function sha256(text) {
  var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

function waLink(phone) { return "https://wa.me/" + String(phone).replace(/^0/, "62"); }
function when(ts) {
  return new Date(ts).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function paintFilters() {
  var tabs = [{ id: "all", name: "Semua", n: orders.length }].concat(STAGES.map(function (name, i) {
    return { id: String(i), name: name, n: orders.filter(function (o) { return (o.status || 0) === i; }).length };
  }));
  $("#adminFilters").innerHTML = tabs.map(function (t) {
    return '<button type="button" class="tab" data-filter="' + t.id + '" aria-selected="' + (t.id === filter) + '">' + t.name + ' (' + t.n + ')</button>';
  }).join("");
}

function card(o) {
  var st = o.status || 0;
  var lines = (o.lines || []).map(function (l) {
    return '<li><span>' + l.qty + '× ' + esc(l.name) + '</span><span>' + rupiah(l.price * l.qty) + '</span></li>';
  }).join("");
  var btns = STAGES.map(function (name, i) {
    return '<button type="button" class="btn btn--secondary adm-stage" data-set="' + i + '" data-code="' + esc(o.code) + '" aria-pressed="' + (i === st) + '">' + name + '</button>';
  }).join("");
  return '<li class="adm-card adm-card--s' + st + '">' +
    '<div class="adm-card__head"><strong class="adm-card__code">' + esc(o.code) + '</strong><span class="adm-badge adm-badge--s' + st + '">' + STAGES[st] + '</span><small>' + when(o.createdAt) + '</small></div>' +
    '<div class="adm-card__meta">' +
      '<p><b>Nama</b> ' + esc(o.name) + '</p>' +
      '<p><b>HP</b> <a href="' + waLink(o.phone) + '" target="_blank" rel="noopener">' + esc(o.phone) + '</a></p>' +
      '<p><b>Jam ambil</b> ' + esc(o.pickup) + '</p>' +
      (o.note ? '<p><b>Catatan</b> ' + esc(o.note) + '</p>' : '') +
    '</div>' +
    '<ul class="summary__items">' + lines + '</ul>' +
    '<div class="summary__total"><span>Total</span><strong>' + rupiah(o.total) + '</strong></div>' +
    '<div class="adm-stages" role="group" aria-label="Ubah status ' + esc(o.code) + '">' + btns + '</div>' +
    '<button type="button" class="adm-del" data-del="' + esc(o.code) + '">Hapus pesanan</button>' +
  '</li>';
}

function paintOrders() {
  paintFilters();
  var list = orders.filter(function (o) { return filter === "all" || String(o.status || 0) === filter; });
  $("#adminList").innerHTML = list.map(card).join("");
  $("#adminEmpty").hidden = list.length > 0;
}

async function refresh() {
  if (!loggedIn()) return;
  try {
    orders = await listOrders();
    $("#adminMsg").hidden = true;
    var codes = orders.map(function (o) { return o.code; });
    if (knownCodes) {
      var fresh = codes.filter(function (c) { return knownCodes.indexOf(c) < 0; });
      if (fresh.length) toast("Pesanan baru masuk: " + fresh.join(", "));
    }
    knownCodes = codes;
    paintOrders();
  } catch (e) {
    $("#adminMsg").textContent = "Tidak bisa mengambil pesanan. Periksa koneksi atau alamat database.";
    $("#adminMsg").hidden = false;
  }
}

export function renderAdmin() {
  var on = loggedIn();
  $("#adminLogin").hidden = on;
  $("#adminPanel").hidden = !on;
  clearInterval(timer);
  if (on) {
    $("#adminMode").textContent = isRemote
      ? "Terhubung ke database online: pesanan dari semua perangkat masuk ke sini."
      : "Mode lokal: hanya pesanan yang dibuat di browser ini yang tampil. Isi ORDERS_DB_URL di js/config/constants.js agar pesanan dari HP pelanggan juga masuk.";
    knownCodes = null;
    refresh();
    timer = setInterval(refresh, 5000);
  }
}

export function initAdmin() {
  onRoute(function (page) { if (page !== "admin") clearInterval(timer); });

  $("#adminForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    var err = $("#adminError");
    err.hidden = true;
    if (!window.crypto || !crypto.subtle) {
      err.textContent = "Login admin butuh https atau localhost.";
      err.hidden = false;
      return;
    }
    var email = $("#adminEmail").value.trim().toLowerCase();
    var hash = await sha256(email + ":" + $("#adminPass").value);
    if (email === ADMIN_EMAIL.toLowerCase() && hash === ADMIN_PASS_HASH) {
      failCount = 0;
      setLoggedIn(true);
      $("#adminPass").value = "";
      renderAdmin();
      return;
    }
    failCount++;
    err.textContent = "Email atau kata sandi salah.";
    err.hidden = false;
    var btn = $("#adminForm button[type=submit]");
    btn.disabled = true;
    setTimeout(function () { btn.disabled = false; }, Math.min(failCount, 5) * 1000);
  });

  $("#adminLogout").addEventListener("click", function () {
    setLoggedIn(false);
    renderAdmin();
  });
  $("#adminRefresh").addEventListener("click", refresh);

  $("#adminFilters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.getAttribute("data-filter");
    paintOrders();
  });

  $("#adminList").addEventListener("click", async function (e) {
    var set = e.target.closest("[data-set]");
    var del = e.target.closest("[data-del]");
    try {
      if (set) {
        await patchOrder(set.getAttribute("data-code"), { status: Number(set.getAttribute("data-set")) });
        toast("Status " + set.getAttribute("data-code") + ": " + STAGES[Number(set.getAttribute("data-set"))]);
        refresh();
      } else if (del) {
        var code = del.getAttribute("data-del");
        if (!confirm("Hapus pesanan " + code + "? Tindakan ini tidak bisa dibatalkan.")) return;
        await removeOrder(code);
        refresh();
      }
    } catch (err) {
      toast("Gagal menyimpan perubahan. Coba lagi.");
    }
  });
}
