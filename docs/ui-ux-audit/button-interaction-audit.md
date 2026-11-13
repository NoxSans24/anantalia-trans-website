# Phase 4 — Complete Button & Interaction Audit

Seluruh tombol dan elemen interaktif pada 5 halaman publik telah diinspeksi kode HTML/JS-nya dan diuji langsung menggunakan browser automation (Playwright).

## 1. Komponen Shell Bersama (Seluruh 5 Halaman)

| Halaman | Nama Tombol / Elemen | Lokasi Komponen | Fungsi yang Diharapkan | Implementasi Aktual | Hasil Pengujian Browser | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| Semua (5 Halaman) | Logo & Nama Brand (`a[data-path="beranda"]`) | Header Kiri | Navigasi ke Beranda (`index.html`). | `<a href="./index.html">` / `../index.html`. | Mengarah ke Beranda dengan tepat. | **PASS** |
| Semua (5 Halaman) | 5 Link Navigasi Utama (`Beranda`, `Tentang Kami`, `Layanan`, `Armada`, `Pusat Bantuan`) | Header `<nav data-site-navigation="true">` | Navigasi antarhalaman & menandai halaman aktif (`aria-current="page"`). | `<a data-path="..." href="...">` dengan `aria-current="page"` pada halaman aktif. | Seluruh link berpindah halaman dengan benar dan menandai halaman aktif. | **PASS** |
| Semua (5 Halaman) | Tombol Hamburger (`[data-mobile-nav-toggle]`) | Header Kanan (Viewport `< 1024px`) | Membuka/menutup drawer `#mobile-navigation`, mengubah `aria-expanded`, dan menutup saat tekan `Escape` atau klik di luar. | Dikelola oleh `js/site-shell.js` (`setOpen`). | Drawer terbuka (`aria-expanded="true"`), menampilkan 5 link dengan status aktif yang sesuai, dan tertutup saat tekan `Escape` dengan fokus kembali ke tombol toggle. | **PASS** |
| Semua (5 Halaman) | Tombol Kembali ke Atas (`#scrollToTopBtn`) | Floating Kanan Bawah | Muncul saat halaman digulir `> 300px` dan menggulir halus ke puncak halaman saat diklik. | `window.addEventListener('scroll')` & `window.scrollTo({ top: 0, behavior: 'smooth' })` di `js/site-shell.js`. | Saat digulir ke `Y=600`, tombol tampil (`opacity-100`); saat diklik, halaman kembali ke `Y=0`. | **PASS** |
| Semua (5 Halaman) | 5 Link Navigasi Cepat Footer | Footer Kolom Tengah | Navigasi ke masing-masing halaman publik. | `<a data-path="..." href="...">`. | Seluruh 25 tautan footer lintas 5 halaman mengarah ke halaman tujuan yang benar (`200 OK`). | **PASS** |
| Semua (5 Halaman) | Tombol/Tautan WhatsApp (`a[href*="wa.me"]`) | Header, Hero, Kartu, Modal, Floating FAB | Menghubungi WhatsApp jika nomor resmi tersedia; disembunyikan jika nomor masih placeholder. | `js/site-shell.js` memberi `link.hidden = true` & menghapus `href`; `css/main.css` menerapkan `[hidden] { display: none !important; }`. | Seluruh 30 tautan placeholder tersembunyi rapat (`display: none`) sehingga tidak ada tombol mati di layar. | **BLOCKED (Safely Hidden)** |

---

## 2. Beranda (`index.html`)

| Nama Tombol / Elemen | Lokasi Komponen | Fungsi yang Diharapkan | Implementasi Aktual | Hasil Pengujian Browser | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `"Lihat Pilihan Armada"` | Hero Section CTA | Menggulir halaman ke seksi `#armada-unggulan`. | `<a href="#armada-unggulan">`. | Menggulir halus ke seksi Pilihan Armada. | **PASS** |
| `"Lihat Katalog Armada"` | Header Seksi `#armada-unggulan` | Membuka halaman katalog lengkap `pages/armada.html`. | `<a href="./pages/armada.html">`. | Berpindah ke `pages/armada.html`. | **PASS** |
| `"Pelajari Selengkapnya Tentang Kami"` | Seksi Profil Singkat Perusahaan | Membuka halaman `pages/tentang-kami.html`. | `<a href="./pages/tentang-kami.html">`. | Berpindah ke `pages/tentang-kami.html`. | **PASS** |

---

## 3. Tentang Kami (`pages/tentang-kami.html`)

| Nama Tombol / Elemen | Lokasi Komponen | Fungsi yang Diharapkan | Implementasi Aktual | Hasil Pengujian Browser | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| Breadcrumb `"Beranda"` | Hero Atas Kiri | Kembali ke halaman `index.html`. | `<a data-path="beranda" href="../index.html">`. | Berpindah ke `index.html`. | **PASS** |

---

## 4. Layanan (`pages/layanan.html`)

| Nama Tombol / Elemen | Lokasi Komponen | Fungsi yang Diharapkan | Implementasi Aktual | Hasil Pengujian Browser | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| 5 Tombol Filter Tab (`.service-tab-btn`) | `#service-filter-container` | Menyaring kartu layanan (`all`, `rental`, `airport`, `bus`, `corporate`) dan memperbarui `aria-pressed`. | `onclick="filterServices('<kategori>', this)"`. | Klik `"Rental Mobil"` menampilkan 1 kartu (`data-category="rental"`) dan mengeset `aria-pressed="true"`; klik `"Semua Layanan (4)"` menampilkan kembali 4 kartu. | **PASS** |
| 4 Tombol `"Lihat Detail"` (`[data-service-detail-trigger]`) | Kartu Layanan 1–4 | Membuka `<dialog id="service-detail-modal">` dengan detail layanan terkait. | Dikelola oleh `js/layanan-detail.js` (`openModal(card, trigger)`). | Membuka dialog modal dengan judul, foto, deskripsi, dan daftar fasilitas yang sesuai dengan kartu yang diklik. | **PASS** |
| Tombol Tutup Modal (`[data-close-service-modal]`) | Header & Footer `#service-detail-modal` | Menutup modal detail layanan dan mengembalikan fokus ke tombol pemicu. | `closeModal()` di `js/layanan-detail.js` + listener `Escape` dan klik backdrop. | Menutup modal dengan bersih baik melalui tombol `X`, tombol `Tutup`, maupun tombol `Escape`. | **PASS** |
| Tombol `"Salin Format"` (`#copy-template-btn`) | Kotak Template Chat WhatsApp | Menyalin teks format reservasi ke clipboard dan menampilkan konfirmasi inline tanpa memblokir halaman. | `onclick="copyBookingTemplate(this)"` memperbarui `[data-copy-label]` menjadi `"Format Disalin!"` selama 2,5 detik. | Saat diklik, teks tombol langsung berubah menjadi `"Format Disalin!"` tanpa memunculkan dialog `alert()` yang memblokir. | **PASS** |

---

## 5. Armada (`pages/armada.html`)

| Nama Tombol / Elemen | Lokasi Komponen | Fungsi yang Diharapkan | Implementasi Aktual | Hasil Pengujian Browser | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| Input Pencarian (`#fleet-search-input`) & Tombol Hapus (`#clear-search-btn`) | Panel Filter Atas | Menyaring kartu kendaraan secara instan berdasarkan kata kunci dan mereset pencarian saat `#clear-search-btn` diklik. | Listener `input` & `click` di `js/armada-detail.js`. | Mengetik `"Innova"` menyaring kartu yang cocok; mengetik `"zzzznotfound"` menampilkan `#fleet-empty-state`; klik `#clear-search-btn` mengembalikan seluruh kartu. | **PASS** |
| Dropdown `#fleet-capacity-filter` & `#fleet-transmission-filter` | `#fleet-filter-panel` | Menyaring unit berdasarkan kapasitas kursi dan jenis transmisi. | Listener `change` di `js/armada-detail.js`. | Menyaring daftar unit secara akurat sesuai opsi yang dipilih. | **PASS** |
| Tab Kategori (`.category-filter-btn`) | `[data-fleet-categories]` | Menyaring unit berdasarkan kategori kendaraan (`Semua`, `MPV`, `SUV`, `Minibus`, `Bus`, dll.). | Dibuat dinamis oleh `js/armada-detail.js` dengan `aria-selected` dan navigasi panah keyboard. | Mengubah kategori aktif dan menyaring kartu di `#fleet-cards-container`. | **PASS** |
| Tombol `"Hapus Filter & Tampilkan Semua"` (`#empty-state-reset-btn`) | `#fleet-empty-state` | Mereset seluruh filter/pencarian saat hasil filter kosong; disembunyikan (`hidden`) saat katalog gagal dimuat dari API. | `emptyResetBtn.addEventListener('click', resetAllFilters)` + `button.hidden = !showReset` di `js/armada-detail.js`. | Tersembunyi rapat saat API offline (`502`), dan muncul serta berfungsi penuh mereset filter saat pencarian menghasilkan 0 unit. | **PASS** |
| Tombol `"Lihat semua mobil"` (`#fleet-view-toggle`) | Di bawah `#fleet-cards-container` | Menampilkan seluruh unit jika jumlah unit melebihi batas tampilan ringkas (6 kartu). | Listener `click` di `js/armada-detail.js`. | Mengubah `aria-expanded` dan menampilkan seluruh unit yang cocok. | **PASS** |
| Tombol `"Lihat Detail"` (`.toggle-detail-btn`) | Kartu Katalog Armada | Membuka modal `<dialog id="vehicle-detail-modal">` berisi rincian unit. | `openVehicleModal(record, trigger)` di `js/armada-detail.js`. | Membuka modal detail kendaraan dengan nama, status, spesifikasi, dan harga. | **PASS** |
| Tombol Tutup Modal (`[data-close-vehicle-modal]`) | Header & Footer `#vehicle-detail-modal` | Menutup modal detail kendaraan. | `closeVehicleModal()` di `js/armada-detail.js`. | Menutup modal saat diklik atau saat menekan `Escape`. | **PASS** |
| Tombol `"Ajukan Pemesanan"` (`.vehicle-booking-trigger`) | Kartu Katalog & Modal Detail | Membuka panel form permintaan pemesanan (`#vehicle-booking-request-form`) untuk unit yang dipilih. | `openBookingForm(record, trigger)` di `js/armada-detail.js`. | Membuka form pemesanan dengan ringkasan kendaraan yang dipilih. | **PASS** |
| Form Permintaan Pemesanan (`#vehicle-booking-request-form`) & Tombol Submit / Batal | Panel Booking Armada | Memvalidasi input (nama, telepon E.164, tanggal, layanan, lokasi) dan mengirim permintaan ke `POST /api/v1/public/booking-requests`. | `handleBookingSubmit` di `js/armada-detail.js`. | Submit kosong ditolak dengan pesan validasi bahasa Indonesia; telepon tidak valid ditolak; tanggal selesai < mulai ditolak; input valid mengirim payload ke API dan menampilkan pesan konfirmasi. | **PASS** |

---

## 6. Pusat Bantuan (`pages/pusat-bantuan.html`)

| Nama Tombol / Elemen | Lokasi Komponen | Fungsi yang Diharapkan | Implementasi Aktual | Hasil Pengujian Browser | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| 5 Tombol Accordion FAQ (`.faq-trigger`) | `#faq-accordion-group` | Membuka jawaban FAQ yang diklik dan menutup item FAQ lain yang sedang terbuka. | Dikelola oleh `js/pusat-bantuan.js`. | Mengklik pertanyaan kedua membuka kontennya (`data-state="open"`, `aria-expanded="true"`) dan menutup pertanyaan pertama. | **PASS** |
| Input Cari Kota/Provinsi (`#map-search-input`) | Bar Filter Peta `#cabang-kami` | Menyaring pin peta (`.city-marker`), daftar area (`.city-list-item`), dan memperbarui `#location-count-badge`. | `applyMapFilters()` di `#interactive-map-controller`. | Mengetik `"Bali"` menyisakan 1 pin & 1 item daftar (`"1 titik ilustratif"`); mengetik `"zzzz"` menampilkan pesan kosong di peta dan daftar (`"0 titik ilustratif"`). | **PASS** |
| 7 Tombol Filter Kepulauan (`.region-filter-btn`) | Bar Filter Peta `#cabang-kami` | Menyaring titik area berdasarkan kepulauan (`all`, `sumatra`, `jawa`, `bali-nusa`, `kalimantan`, `sulawesi`, `maluku-papua`). | Listener `click` di `#interactive-map-controller` dengan `aria-pressed`. | Klik `"Sumatra"` menampilkan 7 pin & 7 item daftar serta memperbarui badge menjadi `"7 titik ilustratif"`. | **PASS** |
| Tombol `"Reset Peta"` (`#reset-map-view-btn`) | Bar Filter Peta `#cabang-kami` | Mengembalikan zoom ke 100%, menghapus pencarian, dan mengaktifkan kembali filter `"Semua"` (22 titik). | Listener `click` di `#interactive-map-controller`. | Mengembalikan seluruh 22 pin, 22 item daftar, dan zoom 100%. | **PASS** |
| Kontrol Zoom Peta (`[data-map-zoom-in]`, `[data-map-zoom-out]`, `[data-map-zoom-reset]`) | Pojok Kanan Atas `.indonesia-map` | Memperbesar (hingga 250%), memperkecil, dan mereset skala peta serta mengizinkan drag-pan saat diperbesar. | `setMapZoom()` & pointer events di `#interactive-map-controller`. | Klik `+` mengubah status ke `"Zoom peta 125 persen"`, mengaktifkan tombol `-` dan reset, serta mereset kembali ke 100% saat tombol reset diklik. | **PASS** |
| 22 Pin Kota (`.city-marker`) & 22 Item Daftar (`.city-list-item`) | Kanvas Peta & `#cities-scroll-list` | Membuka modal detail area `#selected-city-modal` untuk kota yang dipilih (mendukung klik mouse & tombol `Enter`/`Space`). | `selectCity(city, trigger)` di `#interactive-map-controller`. | Mengklik pin maupun item daftar membuka `#selected-city-modal` dengan nama kota, provinsi, status, dan iframe Google Maps area terkait. | **PASS** |
| Tombol Tutup Modal Lokasi (`[data-close-selected-city]`) | Pojok Kanan Atas `#selected-city-modal` | Menutup modal detail lokasi dan mengembalikan fokus ke elemen pemicu. | `closeModal()` di `#interactive-map-controller`. | Menutup modal saat tombol `X`, backdrop, atau `Escape` ditekan. | **PASS** |
| `"Lihat Daftar Armada"` & `"Eksplorasi Layanan"` | Seksi Callout Bawah | Navigasi ke `pages/armada.html` dan `pages/layanan.html`. | `<a href="../pages/armada.html">` & `<a href="../pages/layanan.html">`. | Keduanya mengarah ke halaman tujuan yang benar. | **PASS** |
