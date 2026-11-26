/* =========================================================
   Penyimpanan daftar pesanan untuk admin.
   - ORDERS_DB_URL kosong  → localStorage (hanya terlihat di browser yang sama)
   - ORDERS_DB_URL terisi  → Firebase Realtime Database lewat REST (terlihat di semua perangkat)
   ========================================================= */
import { ORDERS_DB_URL } from "../config/constants.js";
import { load, save } from "../utils/storage.js";

var KEY = "nuvella_orders";
export var isRemote = !!ORDERS_DB_URL;

function url(code) {
  return ORDERS_DB_URL.replace(/\/+$/, "") + "/orders" + (code ? "/" + encodeURIComponent(code) : "") + ".json";
}
function send(method, u, body) {
  return fetch(u, { method: method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
}

export async function addOrder(order) {
  if (isRemote) { await send("PUT", url(order.code), order); return; }
  var all = load(KEY, []).filter(function (o) { return o.code !== order.code; });
  all.push(order);
  save(KEY, all);
}

export async function listOrders() {
  var all;
  if (isRemote) { var data = await send("GET", url()); all = data ? Object.keys(data).map(function (k) { return data[k]; }) : []; }
  else all = load(KEY, []);
  return all.sort(function (a, b) { return b.createdAt - a.createdAt; });
}

export async function getOrder(code) {
  if (isRemote) return send("GET", url(code));
  return load(KEY, []).filter(function (o) { return o.code === code; })[0] || null;
}

export async function patchOrder(code, patch) {
  if (isRemote) { await send("PATCH", url(code), patch); return; }
  var all = load(KEY, []);
  all.forEach(function (o) { if (o.code === code) Object.assign(o, patch); });
  save(KEY, all);
}

export async function removeOrder(code) {
  if (isRemote) { await send("DELETE", url(code)); return; }
  save(KEY, load(KEY, []).filter(function (o) { return o.code !== code; }));
}
