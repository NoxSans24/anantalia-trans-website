# Arsitektur Saat Ini

## Halaman dan shared UI

Situs memiliki lima halaman HTML di root dan `pages/`: Beranda (`index.html`), Tentang Kami, Layanan, Armada, dan Pusat Bantuan. Semua memakai `logo.png` lokal, font Manrope, satu impor Material Symbols, Tailwind lokal hasil kompilasi, dan CSS/JavaScript khusus halaman bila diperlukan. `js/site-shell.js` membentuk menu mobile dari tautan navigasi desktop serta mengelola status ARIA, Escape, klik luar, breakpoint, dan tombol kembali ke atas.

## CSS

`css/tailwind.input.css` berisi direktif Tailwind. `js/tailwind-config.js` menjadi konfigurasi CLI dengan sumber pemindaian halaman HTML dan JavaScript serta plugin forms. `css/tailwind.generated.css` adalah output lokal yang dimuat semua halaman sebelum stylesheet custom. `css/main.css`, `css/armada.css`, `css/layanan.css`, dan `css/pusat-bantuan.css` memegang aturan komponen dan tampilan yang tidak berasal dari utility Tailwind. Tidak ada halaman yang memuat runtime/CDN Tailwind.

Setiap halaman memuat satu URL stylesheet Material Symbols, bukan beberapa variasi yang berulang. Google Fonts tetap eksternal.

## Katalog armada

`fleet.json` merupakan sumber tunggal 63 entri dengan 63 ID unik. JSON mencakup kategori, uraian, tarif dan spesifikasi dummy, fitur, ketentuan, gambar, teks alternatif, pencarian gambar, serta metadata sumber/kredit/lisensi yang tersedia. `pages/armada.html` berisi shell filter, status kosong, dan dialog detail; tidak lagi menyimpan kartu armada. `js/armada-detail.js` mengambil JSON via HTTP, membentuk kategori dan kartu, mengelola pencarian/filter/reset/status kosong, membuka detail, dan menampilkan metadata gambar. Interaksi detail mempertahankan tombol WhatsApp yang sudah ada dan menandai datanya sebagai dummy.

Katalog memerlukan server HTTP karena browser tidak mengizinkan pembacaan JSON dengan `fetch()` dari halaman `file://`.

## Halaman Layanan dan Bantuan

`js/layanan-detail.js` mengisi dialog detail dari kartu Layanan; filter kategori berada pada controller inline halaman Layanan. `js/pusat-bantuan.js` mengelola FAQ dan scroll reveal. Controller peta Bantuan masih inline: filter area, pencarian, zoom/pan, daftar lokasi, dan dialog detail. Kota/pin pada peta merupakan ilustrasi antarmuka, bukan cakupan atau alamat pool yang diverifikasi.

## Aset dan dependensi eksternal

`assets/indonesia-silhouette.svg` dan `assets/placeholder-vehicle.svg` adalah aset lokal. Logo lokal dipertahankan. Font, sebagian ilustrasi/thumbnail, dan foto referensi Wikimedia Commons memakai URL eksternal dan dapat gagal dimuat tanpa internet. Dua puluh record mempertahankan metadata referensi Commons yang sebelumnya ada pada kartu HTML. Materi tersebut bukan bukti armada aktual ANANTALIA TRANS.

`serene_transit/DESIGN.md`, `desain.md`, dan kit ZIP yang ada di root merupakan dokumentasi/aset sumber; semuanya tidak dimuat langsung sebagai kode halaman. `desain.md` dan laporan audit terdahulu dipertahankan apa adanya.

## Build, serve, dan QA

- `npm run build:css` menghasilkan stylesheet Tailwind lokal.
- `npm run watch:css` memantau perubahan utility class.
- `npm run serve` menyajikan situs di `127.0.0.1:4173`.
- `npm run test:stabilization` memeriksa 63 ID, satu sumber JSON, referensi stylesheet, impor Material Symbols, cakupan class terkompilasi, state dan breakpoint.
- `tests/validate.ps1` memeriksa path/fragmen lokal, judul, ID unik, shell/logo, CSS yang seimbang, dan sintaks JavaScript inline.

## Batas fakta bisnis

Nomor telepon/WhatsApp lama dipertahankan dengan label perlu konfirmasi, tetapi tidak diverifikasi sebagai milik/pengelola resmi. Legalitas, nama badan usaha, alamat, jam layanan, kebijakan, tarif aktual, cakupan, kondisi armada, dan layanan harus dikonfirmasi pemilik. Tautan legal tidak diaktifkan sampai URL resmi tersedia.
