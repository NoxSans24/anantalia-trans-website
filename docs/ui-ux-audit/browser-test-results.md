# Phase 7 & 8 — Real Browser Functional & UX Edge Case Test Results

Pengujian dilakukan menggunakan server lokal `node ./scripts/serve.js` pada `http://127.0.0.1:4173` dan browser Chromium melalui Playwright MCP. Tidak ada pengiriman pesan WhatsApp nyata atau mutasi data produksi yang dilakukan.

---

## 1. Hasil Pengujian Fungsional di Browser Nyata (Phase 7)

| No | Skenario Pengujian | Halaman | Hasil Pengamatan Aktual di Browser | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Pemuatan halaman & pemeriksaan Console Error | Seluruh 5 Halaman | `index.html`, `tentang-kami.html`, `layanan.html`, dan `pusat-bantuan.html` dimuat dengan **0 console error** dan **0 network error**. `armada.html` memiliki **0 JS syntax/runtime error** (hanya log jaringan `502 Bad Gateway` dari proxy `/api/v1/public/rental-types` ketika server backend port 3000 sedang tidak dijalankan). | **PASS** |
| 2 | Navigasi Header Desktop & Status Aktif (`aria-current="page"`) | Seluruh 5 Halaman | Setiap halaman menandai menu aktifnya dengan `aria-current="page"` dan styling `bg-surface-mint text-primary`. | **PASS** |
| 3 | Navigasi Mobile Drawer (`390x844` & `360x800`) | Seluruh 5 Halaman | Klik tombol hamburger membuka `#mobile-navigation`, menampilkan 5 link dengan link aktif tersorot, dan menekan `Escape` menutup drawer serta mengembalikan fokus ke tombol hamburger. | **PASS** |
| 4 | Tombol Scroll-to-Top (`#scrollToTopBtn`) | Seluruh 5 Halaman | Tersembunyi saat `scrollY === 0`, muncul saat digulir ke bawah (`scrollY > 300`), dan mengembalikan posisi gulir ke atas saat diklik. | **PASS** |
| 5 | Filter Tab Layanan & Modal Detail Layanan | `pages/layanan.html` | Klik tab kategori menyaring kartu secara instan dan memperbarui `aria-pressed`. Klik `"Lihat Detail"` membuka `<dialog id="service-detail-modal">`, dan tombol `Escape`/Tutup menutupnya kembali. | **PASS** |
| 6 | Tombol `"Salin Format"` Chat | `pages/layanan.html` | Klik `#copy-template-btn` mengubah label menjadi `"Format Disalin!"` tanpa memunculkan dialog `alert()` yang memblokir halaman. | **PASS** |
| 7 | Katalog Armada, Filter, Search & Modal Detail | `pages/armada.html` | Pencarian `#fleet-search-input`, filter kapasitas, filter transmisi, tab kategori, dan modal `#vehicle-detail-modal` bekerja penuh dan memperbarui `#inventory-counter-text`. | **PASS** |
| 8 | Alur Form Permintaan Booking (`#vehicle-booking-request-form`) | `pages/armada.html` | Klik `"Ajukan Pemesanan"` membuka form untuk unit terkait, menampilkan ringkasan kendaraan, memvalidasi seluruh field wajib, dan menampilkan konfirmasi setelah submit berhasil. | **PASS** |
| 9 | Accordion FAQ (`#faq-accordion-group`) | `pages/pusat-bantuan.html` | Klik pertanyaan membuka panel jawaban terkait dan menutup panel pertanyaan sebelumnya. | **PASS** |
| 10 | Peta Interaktif 22 Titik Area, Zoom/Pan, Filter & Modal Lokasi | `pages/pusat-bantuan.html` | Filter kepulauan, pencarian kota, kontrol zoom (`+`/`-`/reset), daftar 22 area, badge counter, dan modal `#selected-city-modal` berfungsi penuh dan sinkron. | **PASS** |

---

## 2. Hasil Pengujian UX Edge Cases (Phase 8)

| No | Kondisi Edge Case | Halaman / Komponen | Perilaku & Feedback yang Terverifikasi | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Form Booking Kosong Disubmit** | `pages/armada.html` (`#vehicle-booking-request-form`) | Form menahan pengiriman, memfokuskan field pertama yang kosong, menandai `aria-invalid="true"`, dan menampilkan pesan kesalahan dalam bahasa Indonesia. | **PASS** |
| 2 | **Nomor Telepon Tidak Valid** | `pages/armada.html` (`input[name="customerPhone"]`) | Input `"12345"` atau huruf ditolak oleh validasi format nomor telepon dengan pesan error spesifik di bawah field telepon. | **PASS** |
| 3 | **Rentang Tanggal Tidak Valid (Selesai < Mulai)** | `pages/armada.html` (`startDate` & `endDate`) | Memilih tanggal selesai lebih awal dari tanggal mulai ditolak dengan pesan kesalahan validasi rentang tanggal. | **PASS** |
| 4 | **Pencarian Armada Tanpa Hasil** | `pages/armada.html` (`#fleet-search-input`) | Mengetik `"zzzznotfound"` menyembunyikan grid kartu, menampilkan `#fleet-empty-state` (`"Unit Tidak Ditemukan"`), dan menyediakan tombol `"Hapus Filter & Tampilkan Semua"`. | **PASS** |
| 5 | **Pencarian / Filter Peta Tanpa Hasil** | `pages/pusat-bantuan.html` (`#map-search-input`) | Mengetik `"zzzznotfound"` menyembunyikan seluruh pin peta & item daftar, mengubah badge menjadi `"0 titik ilustratif"`, menampilkan pesan `"Tidak ada titik yang cocok dengan pencarian dan wilayah ini."` di atas peta, serta `"Tidak ada area yang cocok dengan filter ini."` di daftar gulir. | **PASS** |
| 6 | **Backend API Armada Tidak Tersedia (`502 Bad Gateway`)** | `pages/armada.html` | Menampilkan state `"Katalog belum tersedia"` dengan penjelasan penyebab dan menyembunyikan tombol `"Hapus Filter & Tampilkan Semua"` (`#empty-state-reset-btn` memiliki `hidden = true` dan `display: none`). | **PASS** |
| 7 | **Gambar Kendaraan / Layanan Gagal Dimuat** | `pages/armada.html` & `pages/layanan.html` | Handler `error` pada elemen gambar otomatis menyembunyikan `<img>` yang gagal dan menampilkan komponen placeholder (`Foto belum tersedia`) tanpa merusak tinggi kartu atau modal. | **PASS** |
| 8 | **Modal Dibuka & Ditutup Berulang Kali** | `layanan.html`, `armada.html`, `pusat-bantuan.html` | Membuka dan menutup modal berulang kali tidak meninggalkan duplikasi event listener, tidak mengunci scroll `body` setelah ditutup, dan selalu mengembalikan fokus ke tombol pemicu. | **PASS** |
| 9 | **Pengguna Membatalkan Booking** | `pages/armada.html` (`.vehicle-booking-cancel`) | Mengklik tombol batal menutup panel form pemesanan dan mereset status pesan error tanpa merusak state filter katalog. | **PASS** |
| 10 | **Klik Tombol Submit Berulang Kali (Double Submit)** | `pages/armada.html` (`.vehicle-booking-submit`) | Selama request pengiriman berlangsung (`isSubmitting`), tombol submit di-set `disabled = true` sehingga mencegah pengiriman ganda. | **PASS** |
| 11 | **Rute / Halaman Tidak Ditemukan (`404`)** | `scripts/serve.js` | Mengakses URL yang tidak ada (mis. `/pages/tidak-ada.html`) mengembalikan status HTTP `404` dengan respons teks `"404 Not Found"`. | **PASS** |
| 12 | **Mobile Menu Terbuka Saat Navigasi / Resize ke Desktop** | `js/site-shell.js` | Mengklik link di dalam `#mobile-navigation` atau memperlebar viewport melewati `1024px` otomatis menutup drawer mobile (`setOpen(false)`). | **PASS** |
| 13 | **Data Dummy Tidak Tersedia di Produksi** | `pages/armada.html` & `js/armada-detail.js` | Sesuai arsitektur keamanan proyek, katalog publik hanya merender unit terverifikasi dari API dan menolak merender `fleet.json` (`isDummy: true`) sebagai penawaran aktual. | **PASS** |
