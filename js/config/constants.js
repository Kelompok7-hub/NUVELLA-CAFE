/* =========================================================
   Konstanta global: nomor WhatsApp dan lokasi aset.
   ========================================================= */

export const WA_NUMBER = "6285755183802";      // admin utama: pesanan & reservasi
export const CK_WA = "6285792304941";          // admin Cake Studio
/* Akun admin (halaman #/admin). Password TIDAK disimpan di sini, hanya hash SHA-256 dari "email:password". */
export const ADMIN_EMAIL = "nuvellacaffe@gmail.com";
export const ADMIN_PASS_HASH = "80b03f81112ff388f93fe2503df1406f4f0ecefc6edbac89cb36597f24bbf001";
/* Alamat Firebase Realtime Database supaya admin bisa melihat pesanan dari HP/perangkat pelanggan lain.
   Contoh: "https://nama-proyek-default-rtdb.asia-southeast1.firebasedatabase.app"
   Kosong = pesanan hanya tersimpan di browser yang sama (mode lokal). */
export const ORDERS_DB_URL = "";
export const FOTO_DIR = "assets/foto/";        // foto menu buatan sendiri: assets/foto/<id-menu>.jpg
export const SFX_FILE = "assets/audio/sound.wav";  // suara "tambah ke keranjang"
