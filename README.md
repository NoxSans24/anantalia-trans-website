# ANANTALIA TRANS

Situs statis ANANTALIA TRANS menggunakan ekspor Google Stitch yang tersedia. Beranda memakai ekspor `beranda_anantalia_trans` sebagai `index.html`. Sumber Stitch asli dipertahankan di folder masing-masing.

## Teknologi

- HTML statis
- Tailwind CSS melalui CDN
- CSS kustom lokal di `css/`
- JavaScript vanilla; konfigurasi Tailwind di `js/tailwind-config.js`, shell navigasi dan tombol kembali ke atas di `js/site-shell.js`, serta interaksi modal Pusat Bantuan di `js/pusat-bantuan.js`
- Font Manrope dan Material Symbols melalui Google Fonts

Tidak ada framework, paket, atau proses build lokal. Tailwind CDN, Google Fonts, foto referensi Wikimedia Commons, dan gambar Googleusercontent memerlukan koneksi internet.

## Halaman dan aset

- `index.html`: Beranda
- `pages/tentang-kami.html`: Tentang Kami
- `pages/layanan.html`: Layanan
- `pages/armada.html`: Armada
- `pages/pusat-bantuan.html`: Pusat Bantuan, diadaptasi dari ekspor Stitch yang ditemukan di `pusat_bantuan_cabang_kami_state_modal_detail_cabang_koordinasi_jemput_anantalia/`
- `fleet (1).json`: sumber armada terbaru, berisi 63 model dummy dalam 7 kategori. Nama, kategori, deskripsi, spesifikasi, harga, fasilitas, dan status pada katalog serta modal detail telah diselaraskan dengan file ini. Dua puluh foto referensi Commons yang sebelumnya dipilih tetap dipakai sebagai media prototipe untuk model yang cocok; entri lainnya mengikuti placeholder di data. Sumber, kredit, dan lisensi foto tersedia di modal detail. Foto Commons bukan dokumentasi unit milik ANANTALIA TRANS. Tarif, spesifikasi, fasilitas, dan status merupakan data dummy.
- `css/main.css`, `css/armada.css`: CSS lokal
- `js/tailwind-config.js`, `js/site-shell.js`, `js/pusat-bantuan.js`: konfigurasi dan interaksi bersama/khusus halaman
- `js/armada-detail.js`: mengisi modal Lihat Detail dari data katalog pada kartu Armada
- `logo.png`: logo resmi root, dipakai semua lima halaman kerja dan dipertahankan
- `assets/indonesia-silhouette.svg`: siluet peta lokal pada Pusat Bantuan, diwarnai Sage `#A3B8A1` dan Teal `#079F9A`; pin area kota tetap dirender terpisah agar dapat difilter dan dipilih
- Folder ekspor Stitch termasuk `code.html` dan `screen.png`: sumber asli dipertahankan
- `docs/`: arsitektur, inventaris, kemajuan, dan catatan pemeriksaan

Semua tautan navigasi Bantuan mengarah ke halaman Pusat Bantuan lokal. Label Syarat & Ketentuan dan Kebijakan Privasi ditampilkan sebagai teks biasa pada lima halaman sampai URL dan konten resmi tersedia; tidak ada tautan `href="#"` mati atau konten legal rekaan.

## Menjalankan dan memvalidasi

Buka `index.html` di browser atau sajikan root sebagai situs statis. Jalankan pemeriksaan statis dengan:

`powershell -NoProfile -ExecutionPolicy Bypass -File tests/validate.ps1`

Hasil aktual dan batas pemeriksaan browser dicatat di `docs/visual-validation.md`.

