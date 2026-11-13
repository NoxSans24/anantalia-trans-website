# Phase 2 & 3 — Audit Mendalam Per Halaman Publik

## 1. Beranda (`index.html`)

- **Peran Halaman:** Pintu masuk utama yang merangkum proposisi layanan, 4 kategori layanan utama, 4 contoh armada unggulan, komitmen pemeriksaan unit, profil singkat perusahaan, dan 3 langkah konsultasi.
- **Temuan Sebelum Perbaikan:**
  1. **Link WhatsApp Tersembunyi Masih Tampil Secara Visual (P0):** 9 elemen `a[href*="wa.me"]` yang di-set `hidden = true` oleh `js/site-shell.js` tetap tampil di layar (`display: inline-flex` / `flex`) tanpa atribut `href`, sehingga tampak seperti tombol aktif tetapi mati saat diklik.
  2. **Navigasi Aktif Tidak Ditandai (P2):** Link `"Beranda"` pada navbar desktop dan mobile tidak memiliki `aria-current="page"` maupun kelas aktif `bg-surface-mint text-primary`.
  3. **Gambar Tanpa Atribut `alt` (P2):** 5 gambar utama (1 gambar hero + 4 gambar armada unggulan) hanya memiliki atribut `data-alt` tanpa `alt`.
  4. **Lompatan Hierarki Heading & Overflow 360px (P2):** Seksi Quick Trust Bar melompat dari `<h1>` langsung ke `<h4>` dan menggunakan `grid-cols-2` pada layar `360x800` yang menyebabkan teks `"Koordinasikan lokasi dan jadwal"` melebar 4px melewati viewport. Footer juga menggunakan `<h4>` tanpa `<h3>`.
  5. **Elemen Statis Menyerupai Filter pada Pilihan Armada (P2):** Seksi `#armada-unggulan` menampilkan teks statis `Filter Kategori: [Semua Unit]` tanpa aksi dan tidak menyediakan tautan menuju halaman katalog `pages/armada.html`.
- **Status Pasca-Perbaikan:** **PASS** — Seluruh 5 temuan telah diperbaiki dan diverifikasi di browser pada seluruh 5 viewport.

---

## 2. Tentang Kami (`pages/tentang-kami.html`)

- **Peran Halaman:** Menyampaikan profil layanan, mosaik visual armada/kabin, visi & misi perusahaan, 3 pilar standar operasional, galeri dokumentasi inspeksi, serta catatan status verifikasi data legalitas.
- **Temuan Sebelum Perbaikan:**
  1. **Tombol WhatsApp Mati Masih Tampil (P0):** 3 tombol WhatsApp (`header`, CTA penutup, dan floating button) tetap terlihat meskipun `hidden = true`.
  2. **Subjudul Brand Header Tidak Konsisten (P3):** Menggunakan `"Premium Tour & Travel"`, berbeda dari `"Informasi layanan perjalanan"` pada Beranda, Layanan, dan Pusat Bantuan.
  3. **Gambar Tanpa Atribut `alt` (P2):** 4 foto dokumentasi/mosaik hanya menggunakan `data-alt` tanpa `alt`.
  4. **Hierarki Heading Tidak Berurutan (P2):** Kotak pemberitahuan verifikasi menggunakan `<h4>` langsung di dalam `<section>` tanpa `<h2>`/`<h3>`, dan footer menggunakan `<h4>`.
  5. **Gaya Kursor Menyesatkan pada Teks Non-Interaktif (P3):** Baris informasi `"Nomor WhatsApp, menunggu konfirmasi..."` memiliki kelas `hover:text-primary cursor-pointer` padahal bukan tautan atau tombol.
- **Status Pasca-Perbaikan:** **PASS** — Seluruh 5 temuan telah diperbaiki dan diverifikasi.

---

## 3. Layanan (`pages/layanan.html`)

- **Peran Halaman:** Menampilkan 4 kategori layanan transportasi darat beserta filter kategori, modal detail layanan (`#service-detail-modal`), panduan 4 langkah persiapan booking, dan fitur salin format chat.
- **Temuan Sebelum Perbaikan:**
  1. **Tombol WhatsApp Mati Masih Tampil (P0):** 10 elemen WhatsApp (termasuk `#service-detail-whatsapp` di dalam modal detail layanan) tetap terlihat sebagai tombol mati.
  2. **Fungsi `filterServices` Bergantung pada Global `event` & Tanpa `aria-pressed` (P1):** Memanggil `event.currentTarget` secara implisit dan tidak memperbarui atribut `aria-pressed` pada `.service-tab-btn`.
  3. **Tombol "Salin Format" Memicu Blocking `alert()` Native (P1):** Menggunakan `onclick="navigator.clipboard.writeText(...); alert(...)"` yang menghentikan thread UI browser dan tidak memberikan umpan balik inline yang ramah aksesibilitas.
  4. **Sinkronisasi Navigasi Aktif Terlambat (P2):** Menggunakan inline `<script>` saat `DOMContentLoaded` untuk memberi warna aktif pada menu `"Layanan"`, sehingga terjadi duplikasi logika dan `mobile-navigation` tidak mendapat status `aria-current="page"`.
  5. **Gambar Tanpa `alt` & Heading Kosong di Modal (P2):** 4 gambar kartu layanan tidak memiliki atribut `alt`, dan `<h2 id="service-detail-title"></h2>` kosong saat modal tertutup.
- **Status Pasca-Perbaikan:** **PASS** — Seluruh temuan telah diperbaiki dan diuji di browser nyata.

---

## 4. Armada (`pages/armada.html`)

- **Peran Halaman:** Menampilkan katalog kendaraan terverifikasi dari API publik (`/api/v1/public/rental-types`), dilengkapi pencarian instan, filter kapasitas/transmisi/kategori, modal detail spesifikasi (`#vehicle-detail-modal`), dan form pengajuan pemesanan (`#vehicle-booking-request-form`).
- **Temuan Sebelum Perbaikan:**
  1. **Kegagalan Validasi `tests/validate.ps1` pada `/runtime-config.js` (P1):** Tag `<script defer src="/runtime-config.js"></script>` gagal diverifikasi sebagai path lokal oleh script validasi proyek dan belum memiliki file fallback statis di disk.
  2. **Tombol Reset Filter Tetap Muncul Saat API Gagal (`502 Bad Gateway`) (P0):** Karena `pages/armada.html` tidak memuat `css/main.css` dan aturan `[hidden]` tertimpa oleh class `inline-flex`, ketika API gagal dimuat, tombol `#empty-state-reset-btn` (`hidden = true`) dan `#vehicle-detail-whatsapp` (`hidden = true`) tetap tampil. Mengklik tombol reset saat API gagal menghapus pesan galat dan menampilkan `"0 model terverifikasi ditampilkan"`.
  3. **Subjudul Header & Heading Modal Kosong (P2):** Subjudul brand masih `"Premium Tour & Travel"`, `<nav>` belum memiliki `aria-label="Navigasi utama"`, dan `#vehicle-detail-title` berupa `<h2>` kosong sebelum modal dibuka.
- **Status Pasca-Perbaikan:** **PASS** (dengan catatan katalog live memerlukan backend API port 3000 aktif; penanganan offline & seluruh alur katalog/booking saat API tersedia telah diverifikasi penuh).

---

## 5. Pusat Bantuan (`pages/pusat-bantuan.html`)

- **Peran Halaman:** Menyediakan accordion 5 FAQ utama, informasi kontak terpusat, serta peta interaktif 22 titik area ilustratif Indonesia (`#cabang-kami`) dengan fitur pencarian kota/provinsi, filter kepulauan, kontrol zoom/pan, dan modal detail area (`#selected-city-modal`).
- **Temuan Sebelum Perbaikan:**
  1. **Console Error SVG `<path>` Rusak (P1):** Baris 202 memiliki atribut `d="M10 18a8 8 0 100-16 8 0 000 16z..."` yang kehilangan parameter radius kedua (`8`), memicu `Error: <path> attribute d: Expected arc flag ('0' or '1')` di console browser setiap kali halaman dibuka.
  2. **Ketidaksinkronan Daftar Area (`#cities-scroll-list`) dan Badge Counter (`#location-count-badge`) dengan 22 Pin Peta (P2):** Peta memiliki 22 `.city-marker` dan badge menulis `"22 titik ilustratif"`, tetapi daftar gulir di sebelahnya hanya memuat 9 kota statis (13 kota di peta tidak ada di daftar!). Selain itu, saat pengguna memfilter wilayah atau mencari kota, angka pada `#location-count-badge` tidak pernah berubah dan daftar tidak menampilkan pesan kosong ketika hasil pencarian 0.
  3. **Tombol WhatsApp Mati Masih Tampil (P0):** 4 tombol WhatsApp (termasuk di dalam `#selected-city-modal`) tetap terlihat meskipun `hidden = true`.
  4. **Atribut Navigasi & Hierarki Heading (P2):** `<nav>` desktop belum memiliki `data-site-navigation="true"` dan `aria-label="Navigasi utama"`, serta judul `"Daftar Area Ilustratif"` menggunakan `<h4>` langsung di bawah `<h2>`.
- **Status Pasca-Perbaikan:** **PASS** — 0 console error, seluruh 22 titik area tampil dan tersinkronisasi dengan filter/pencarian serta badge counter.
