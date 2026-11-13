# Phase 3, 7 & 8 — User Flow Audit

## 1. Alur Eksplorasi Layanan & Salin Format Pesan (`Beranda` → `Layanan`)

1. **Langkah Pengguna:**
   - Pengguna membuka **Beranda** (`index.html`), membaca ringkasan 4 layanan, lalu mengklik menu **Layanan** (`pages/layanan.html`).
   - Pengguna memfilter kategori menggunakan tab (`Semua Layanan`, `Rental Mobil`, `Airport Transfer`, `Bus Charter`, `Transportasi Korporasi`).
   - Pengguna mengklik tombol **`Lihat Detail`** pada salah satu kartu layanan untuk membaca rincian di dalam modal `#service-detail-modal`, lalu menutup modal.
   - Pengguna menggulir ke bagian **"Informasi yang Perlu Disiapkan Sebelum Menghubungi Kami"** dan mengklik tombol **`Salin Format`**.
2. **Temuan Sebelum Perbaikan:**
   - Tab filter tidak memiliki `aria-pressed`, modal memiliki `<h2>` kosong saat tertutup, dan klik **`Salin Format`** memunculkan pop-up `alert()` browser yang mengganggu.
3. **Kondisi Pasca-Perbaikan:**
   - Filter bekerja instan dengan status `aria-pressed` yang akurat, modal terbuka/tertutup dengan mulus, dan klik **`Salin Format`** langsung mengubah label tombol menjadi **`Format Disalin!`** secara non-blocking.
4. **Status Alur:** **PASS**

---

## 2. Alur Eksplorasi Armada & Pengajuan Pemesanan (`Beranda` → `Armada` → `Booking Flow`)

1. **Langkah Pengguna:**
   - Dari seksi `#armada-unggulan` di Beranda, pengguna mengklik tombol **`Lihat Katalog Armada`** menuju `pages/armada.html`.
   - Pengguna mencari model kendaraan melalui `#fleet-search-input`, memilih filter kapasitas/transmisi, atau memilih tab kategori (`.category-filter-btn`).
   - Pengguna mengklik **`Lihat Detail`** (`.toggle-detail-btn`) untuk memeriksa harga Dalam Kota & Luar Kota serta spesifikasi di `#vehicle-detail-modal`.
   - Pengguna mengklik **`Ajukan Pemesanan`** (`.vehicle-booking-trigger`), memilih jenis layanan (`Dengan Sopir` / `Lepas Kunci`), mengisi nama, nomor telepon, email, tanggal mulai & selesai, lokasi jemput & tujuan, lalu menekan **`Kirim Permintaan Pemesanan`**.
2. **Temuan Sebelum Perbaikan:**
   - Saat backend API (`127.0.0.1:3000`) tidak aktif, halaman menampilkan pesan `"Katalog belum tersedia"`, namun tombol **`Hapus Filter & Tampilkan Semua`** tetap muncul karena aturan `[hidden]` tertimpa oleh class `inline-flex`. Jika diklik, pesan error hilang dan digantikan teks membingungkan `"0 model terverifikasi ditampilkan"`.
3. **Kondisi Pasca-Perbaikan:**
   - Saat backend API tidak aktif, kotak informasi menampilkan pesan yang jelas tanpa tombol reset yang menyesatkan.
   - Saat API katalog tersedia, seluruh alur pencarian, filter, modal detail, validasi form (form kosong, nomor telepon tidak valid, tanggal terbalik), pembatalan booking, pencegahan double-submit, hingga konfirmasi pengiriman booking berjalan lengkap tanpa error.
4. **Status Alur:** **PASS** (dengan dependensi runtime pada Backend API port 3000 untuk data katalog live).

---

## 3. Alur Pusat Bantuan, FAQ & Eksplorasi Peta Area (`Pusat Bantuan`)

1. **Langkah Pengguna:**
   - Pengguna membuka **Pusat Bantuan** (`pages/pusat-bantuan.html`) dan mengklik item pertanyaan pada accordion **FAQ** (`#faq-accordion-group`).
   - Pengguna menggulir ke seksi **`#cabang-kami` (Peta Ilustrasi Area Indonesia)**, memfilter kepulauan (`.region-filter-btn`) atau mencari nama kota di `#map-search-input`.
   - Pengguna memperbesar peta dengan tombol zoom (`+`/`-`/reset) dan mengklik salah satu pin kota (`.city-marker`) atau item pada **Daftar Area Ilustratif** (`#cities-scroll-list`) untuk membuka modal `#selected-city-modal`.
2. **Temuan Sebelum Perbaikan:**
   - Terdapat console error SVG `<path>` yang rusak; daftar `#cities-scroll-list` hanya menampilkan 9 dari 22 kota yang ada di peta; dan badge `#location-count-badge` selalu statis bertuliskan `"22 titik ilustratif"` meskipun hasil filter hanya menyisakan beberapa kota atau 0 kota.
3. **Kondisi Pasca-Perbaikan:**
   - 0 console error; seluruh 22 titik area tampil lengkap di daftar gulir; badge jumlah titik selalu terbarui otomatis mengikuti hasil filter/pencarian (mis. `"7 titik ilustratif"` untuk Sumatra, `"0 titik ilustratif"` saat tidak ada hasil disertai pesan kosong); dan modal detail lokasi menampilkan informasi area beserta peta Google Maps dengan responsif.
4. **Status Alur:** **PASS**
