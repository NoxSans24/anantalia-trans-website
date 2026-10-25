# Arsitektur Saat Ini

## Halaman

`index.html` menggunakan ekspor Beranda. `pages/tentang-kami.html`, `pages/layanan.html`, dan `pages/armada.html` memakai ekspor Stitch sesuai namanya. `pages/pusat-bantuan.html` diadaptasi dari `pusat_bantuan_cabang_kami_state_modal_detail_cabang_koordinasi_jemput_anantalia/code.html`; ekspor `code.html` dan `screen.png` tetap di folder sumber.

## CSS dan JavaScript

`css/main.css` memuat gaya kustom bersama Beranda, Tentang Kami, Layanan, dan Pusat Bantuan. `css/armada.css` memuat gaya khusus Armada. Utilitas Tailwind dihasilkan oleh CDN.

`js/tailwind-config.js` memuat konfigurasi Tailwind bersama setelah CDN. `js/site-shell.js` membentuk menu mobile dari tautan desktop, mengelola status ARIA, Escape/klik luar/breakpoint, dan tombol kembali ke atas. Setiap halaman memuat tepat satu shell. `js/pusat-bantuan.js` mengelola modal detail cabang: buka/tutup, Escape, klik backdrop, pengembalian fokus, serta penahanan fokus Tab. Perilaku ekspor lain yang berbeda tetap berada di halamannya.

## Aset dan dependensi eksternal

Semua lima halaman kerja memakai `logo.png` resmi di root: halaman root memakai `logo.png`, sedangkan halaman `pages/` memakai `../logo.png`. File logo dan ekspor Stitch asli dipertahankan. Font dan sebagian gambar tetap menggunakan layanan eksternal sebagaimana ekspor; pemuatan visualnya bergantung koneksi.

`serene_transit/DESIGN.md` dipertahankan sebagai catatan design system sumber dan bukan stylesheet yang dimuat langsung.

## Navigasi dan tautan legal

Navigasi lokal Beranda, Tentang Kami, Layanan, Armada, dan Pusat Bantuan tersedia di semua halaman. Path dari `index.html` dan `pages/` disesuaikan dengan lokasinya. Label Syarat & Ketentuan dan Kebijakan Privasi ditampilkan sebagai teks non-interaktif hingga URL resmi tersedia. Tidak ada tautan `href="#"` atau isi legal yang direka.

## Pemeliharaan

- Pertahankan ekspor Stitch sumber dan `logo.png`.
- Perbarui URL legal hanya setelah tujuan resmi diberikan.
- Jalankan `tests/validate.ps1` setelah perubahan.
- Lakukan pemeriksaan visual saat Tailwind CDN dapat dimuat; validasi statis dan interaksi DOM saja tidak membuktikan kesetaraan visual.

