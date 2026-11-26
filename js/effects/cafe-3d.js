/* =========================================================
   Kedai 3D (CSS) untuk halaman Tentang Kami.
   ========================================================= */
import { $ } from "../utils/dom.js";

/* ---------- Kedai realistis: tur masuk kafe (3D CSS, tanpa gambar kartun) ---------- */
export function buildCafe() {
  var cam = $("#cafeCam");
  if (!cam) return;
  var o = [];
  function pl(cls, cx, cy, cz, w, hh, rot, inner, st) {
    o.push('<div class="p ' + cls + '" style="width:' + w + 'px;height:' + hh + 'px;left:' + (-w / 2) + 'px;top:' + (-hh / 2) + 'px;transform:translate3d(' + cx + 'px,' + cy + 'px,' + cz + 'px) ' + (rot || "") + ";" + (st || "") + '">' + (inner || "") + "</div>");
  }
  function fc(k, cls, w, hh, tr) {
    return '<i class="fc fc-' + k + " " + cls + '" style="width:' + w + "px;height:" + hh + "px;left:" + (-w / 2) + "px;top:" + (-hh / 2) + "px;transform:" + tr + '"></i>';
  }
  function box(cls, cx, cy, cz, w, hh, d, topCls) {
    o.push('<div class="bx" style="transform:translate3d(' + cx + "px," + cy + "px," + cz + 'px)">' +
      fc("f", cls, w, hh, "translateZ(" + d / 2 + "px)") +
      fc("b", cls, w, hh, "rotateY(180deg) translateZ(" + d / 2 + "px)") +
      fc("s", cls, d, hh, "rotateY(90deg) translateZ(" + w / 2 + "px)") +
      fc("s2", cls, d, hh, "rotateY(-90deg) translateZ(" + w / 2 + "px)") +
      fc("t", topCls || cls, w, d, "rotateX(90deg) translateZ(" + hh / 2 + "px)") + "</div>");
  }
  var FL = 130, CE = -170;

  /* ===== Eksterior ===== */
  pl("ground", 0, 131, -100, 3600, 2400, "rotateX(90deg)");
  pl("nb", -760, -60, 0, 820, 380, "");
  pl("nb", 760, -60, 0, 820, 380, "");
  pl("fac ff", 0, -160, 0, 700, 160, "");
  pl("sign ff", 0, -165, 3, 380, 76, "", "<b>Nuvella<small>CAFFE</small></b>");
  pl("glow ff", -170, -206, 8, 70, 70, "");
  pl("glow ff", 170, -206, 8, 70, 70, "");
  [-335, -87.5, 87.5, 335].forEach(function (x) { pl("fac ff", x, 25, 0, x === -87.5 || x === 87.5 ? 45 : 30, 210, ""); });
  [-215, 215].forEach(function (x) {
    pl("bulk ff", x, 110, 0, 210, 40, "");
    pl("win ff", x, 5, 1, 210, 170, "", x < 0 ? "<span>COFFEE · DESSERT</span>" : "<span>PESAN · AMBIL</span>");
    pl("awn ff", x, -92, 28, 230, 74, "rotateX(62deg)");
    pl("awnv ff", x, -68, 61, 230, 14, "");
  });
  o.push('<div class="dg dgl" style="transform:translate3d(-65px,25px,1px)"><div class="leaf ff" style="left:0;top:-105px"><span class="hdl" style="right:6px"></span><b class="opn">OPEN</b></div></div>');
  o.push('<div class="dg dgr" style="transform:translate3d(65px,25px,1px)"><div class="leaf ff" style="left:-65px;top:-105px"><span class="hdl" style="left:6px"></span></div></div>');

  /* ===== Ruang dalam ===== */
  pl("floor", 0, FL, -500, 700, 1000, "rotateX(90deg)");
  pl("ceil", 0, CE, -500, 700, 1000, "rotateX(-90deg)");
  pl("wall wl", -350, -20, -500, 1000, 300, "rotateY(90deg)");
  pl("wall wr", 350, -20, -500, 1000, 300, "rotateY(-90deg)");
  pl("wall wb", 0, -20, -1000, 700, 300, "");

  [-270, -455, -640].forEach(function (z) {
    pl("swin", -348, -35, z, 120, 110, "rotateY(90deg)");
    pl("swin", 348, -35, z, 120, 110, "rotateY(-90deg)");
  });
  [-360, -550, -730].forEach(function (z) {
    pl("glow", -345, -50, z, 44, 60, "rotateY(90deg)");
    pl("glow", 345, -50, z, 44, 60, "rotateY(-90deg)");
  });

  /* bar belakang + mesin espresso + rak */
  box("m-wood", 0, 90, -965, 520, 80, 50, "m-marble");
  box("m-steel", 105, 20, -965, 130, 60, 50);
  box("m-dark", 105, -12, -965, 130, 4, 52);
  [75, 105, 135].forEach(function (x) { box("m-dark", x, 28, -938, 14, 8, 10); });
  box("m-dark", -40, 26, -970, 34, 48, 34);
  pl("mug", -140, 42, -962, 12, 14, "");
  pl("mug", -120, 42, -962, 12, 14, "");
  pl("mug", -100, 42, -962, 12, 14, "");
  pl("menu", 0, -95, -998, 270, 92, "",
    "<em>MENU</em><u><span>Americano</span><span>18</span></u><u><span>Matcha Latte</span><span>19</span></u><u><span>Cappuccino</span><span>18</span></u><u><span>Pour Tiramisu</span><span>35</span></u><u><span>Salted Caramel</span><span>18</span></u><u><span>Pistachio</span><span>18</span></u>");
  pl("neon", 0, -152, -998, 260, 36, "", "Nuvella Caffe");
  [-215, 215].forEach(function (x) {
    pl("shelf", x, -30, -990, 140, 5, "");
    pl("shelf", x, -80, -990, 140, 5, "");
    [-50, -25, 0, 25, 50].forEach(function (d, i) {
      pl(i % 2 ? "mug" : "jar", x + d, -41, -988, 14, i % 2 ? 12 : 20, "");
      pl(i % 2 ? "jar" : "mug", x + d, -91, -988, 14, i % 2 ? 20 : 12, "");
    });
  });

  /* meja kasir */
  box("m-slat", 0, 82.5, -780, 360, 95, 80, "m-marble");
  pl("led", 0, 122, -739, 340, 3, "");
  box("m-dark", -45, 28, -775, 14, 14, 10);
  pl("pos", -45, 12, -772, 52, 36, "rotateX(-10deg)", "<i></i><i></i><i></i>");
  box("m-glass", -135, 9, -778, 110, 52, 50);
  box("m-wood", -135, 33, -778, 110, 4, 50);
  pl("pastry", -160, 26, -775, 22, 13, "");
  pl("slice", -135, 24, -775, 22, 18, "");
  pl("slice g", -110, 24, -775, 22, 18, "");
  pl("pastry", -150, 8, -775, 20, 12, "");
  pl("slice", -122, 6, -775, 22, 18, "");
  pl("cup", 70, 27, -770, 16, 16, "", '<b class="stm" style="position:absolute;left:3px;top:-26px;width:10px;height:24px"></b>');
  pl("mug", 105, 25, -770, 14, 20, "");
  pl("mug", 125, 25, -770, 14, 20, "");
  pl("mug", 145, 25, -770, 14, 20, "");

  /* meja & kursi pengunjung (kiri-kanan) */
  function chair(cx, cz, dir) {
    pl("shd", cx, FL - 0.8, cz, 60, 60, "rotateX(90deg)");
    pl("chleg", cx, 109, cz + dir * 16, 34, 40, "");
    pl("chleg", cx, 109, cz - dir * 16, 34, 40, "");
    box("m-leather", cx, 89.5, cz, 38, 5, 38);
    box("m-leather", cx, 68, cz - dir * 18, 38, 38, 4);
  }
  function table(tx, tz) {
    pl("shd", tx, FL - 0.8, tz, 130, 130, "rotateX(90deg)");
    pl("tb", tx, FL - 1, tz, 40, 40, "rotateX(90deg)");
    pl("tl", tx, 95, tz, 8, 70, "");
    pl("tl", tx, 95, tz, 8, 70, "rotateY(90deg)");
    pl("te", tx, 62, tz, 84, 84, "rotateX(90deg)");
    pl("tt", tx, 59, tz, 84, 84, "rotateX(90deg)");
    pl("cup", tx + 10, 53, tz + 4, 14, 12, "", '<b class="stm" style="position:absolute;left:2px;top:-24px;width:10px;height:22px"></b>');
    chair(tx, tz - 58, 1);
    chair(tx, tz + 58, -1);
  }
  [-270, -455, -640].forEach(function (z) { table(-235, z); table(235, z); });

  /* lampu gantung & genangan cahaya */
  function lamp(x, z) {
    pl("cord", x, -135, z, 2, 70, "");
    pl("shade", x, -98, z, 36, 22, "");
    pl("glow", x, -84, z, 100, 100, "");
    pl("pool", x, FL - 1.2, z, 280, 280, "rotateX(90deg)");
  }
  [-270, -455, -640].forEach(function (z) { lamp(-235, z); lamp(235, z); });
  lamp(0, -220); lamp(0, -470); lamp(-110, -700); lamp(110, -700);

  cam.innerHTML = o.join("");
}

export function restartCafe() {
  var s = $("#shop3d");
  if (!s) return;
  s.classList.remove("run"); void s.offsetWidth; s.classList.add("run");
}
