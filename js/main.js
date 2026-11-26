/* =========================================================
   Titik masuk: menghubungkan semua modul dan menyalakan aplikasi.
   ========================================================= */
import { initRouter, registerPage, route } from "./core/router.js";
import { buildBackground, mountAmbient } from "./effects/background.js";
import { buildCafe, restartCafe } from "./effects/cafe-3d.js";
import { mountHeroFx } from "./effects/image-fx.js";
import { initHeroParallax, initShopPointer, initTilt } from "./effects/pointer.js";
import { initReveal, splitWords } from "./effects/reveal.js";
import { initTreats } from "./effects/treats.js";
import { initAdmin, renderAdmin } from "./features/admin.js";
import { initCart, renderCartPage, updateCartUI } from "./features/cart.js";
import { initCheckout } from "./features/checkout.js";
import { initFaq } from "./features/faq.js";
import { renderHours } from "./features/hours.js";
import { initIntro } from "./features/intro.js";
import { initHomeMascot } from "./features/mascot.js";
import { initMenu, showMenuPage } from "./features/menu.js";
import { initOrderStatus } from "./features/order-status.js";
import { initReservation, renderReservation } from "./features/reservation.js";
import { state } from "./state/store.js";
import { initCakeOrder } from "./features/cake-studio/order.js";
import { initCakeStudio, renderCake } from "./features/cake-studio/studio.js";

/* Halaman → apa yang dijalankan saat halaman dibuka */
registerPage("menu", { render: showMenuPage });
registerPage("cake-studio", { render: function () { renderCake(); } });
registerPage("keranjang", { render: renderCartPage });
registerPage("reservasi", { render: renderReservation });
registerPage("admin", { render: renderAdmin });
registerPage("tentang", { onEnter: restartCafe });

/* Pasang event listener per fitur */
initRouter();
initMenu();
initCart();
initCheckout();
initOrderStatus();
initReservation();
initAdmin();
initFaq();
initTreats();
initShopPointer();
initTilt();
initHeroParallax();

/* Bangun tampilan awal */
mountHeroFx();
buildBackground();
mountAmbient();
buildCafe();
splitWords();
initReveal();
renderHours();
renderReservation();
updateCartUI(false);
initCakeStudio();
initCakeOrder();
initHomeMascot();

initIntro();
if (!state.introActive) route();
