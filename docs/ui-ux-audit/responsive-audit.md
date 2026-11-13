# Phase 5 — Responsive Audit (5 Viewports)

Pengujian responsivitas dilakukan secara otomatis menggunakan Playwright pada seluruh 5 halaman publik di 5 ukuran viewport standar:
- **Desktop:** `1440 x 900`
- **Laptop:** `1366 x 768`
- **Tablet:** `768 x 1024`
- **Mobile:** `390 x 844`
- **Mobile Kecil:** `360 x 800`

---

## 1. Matriks Pemeriksaan Horizontal Overflow (`scrollWidth > innerWidth`)

| Halaman | `1440x900` | `1366x768` | `768x1024` | `390x844` | `360x800` (Sebelum) | `360x800` (Sesudah) | Status Akhir |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Beranda** (`index.html`) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | `true` (Overflow 4px pada Quick Trust Bar `grid-cols-2`) | **`false` (OK)** | **PASS** |
| **Tentang Kami** (`pages/tentang-kami.html`) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | **`false` (OK)** | **PASS** |
| **Layanan** (`pages/layanan.html`) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | **`false` (OK)** | **PASS** |
| **Armada** (`pages/armada.html`) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | **`false` (OK)** | **PASS** |
| **Pusat Bantuan** (`pages/pusat-bantuan.html`) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | `false` (OK) | **`false` (OK)** | **PASS** |

---

## 2. Evaluasi Komponen Responsif

1. **Header & Navigasi Mobile (`< 1024px`):**
   - Pada viewport `768x1024`, `390x844`, dan `360x800`, navigasi desktop (`hidden lg:flex`) disembunyikan dan digantikan oleh tombol hamburger `[data-mobile-nav-toggle]` berukuran `44x44px`.
   - Saat tombol hamburger diklik, drawer `#mobile-navigation` tampil rapi di bawah header dengan tinggi item minimal `44px` dan menyorot halaman aktif (`bg-surface-mint text-primary`).
2. **Skala Tipografi Mobile (`@media (max-width: 820px)` di `css/main.css`):**
   - `h1` menyesuaikan ke `clamp(2rem, 8vw, 2.5rem)` dan `h2` ke `clamp(1.5rem, 6vw, 1.875rem)` dengan `text-wrap: balance` dan `overflow-wrap: break-word` sehingga tidak ada judul yang terpotong pada layar `360x800`.
3. **Grid Kartu & Bento Layout:**
   - Grid 4 kolom pada Beranda (`Pilihan Armada`, `Jenis Layanan`) dan Layanan (`4 Langkah Persiapan`) beradaptasi menjadi 1 kolom di mobile (`grid-cols-1`), 2 kolom di tablet (`md:grid-cols-2`), dan 4 kolom di desktop (`lg:grid-cols-4`).
   - Quick Trust Bar pada Beranda telah diperbaiki menjadi `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` dengan `min-w-0` sehingga pada layar sempit `360x800` setiap item memiliki ruang baca penuh tanpa memicu scroll horizontal.
4. **Modal & Dialog (`#service-detail-modal`, `#vehicle-detail-modal`, `#selected-city-modal`):**
   - Pada desktop, modal menampilkan layout 2 kolom (foto/peta di samping rincian).
   - Pada mobile (`390x844` & `360x800`), modal beradaptasi menjadi 1 kolom vertikal dengan `overflow-y: auto` dan tombol tutup tetap mudah dijangkau di sudut kanan atas.
5. **Peta Interaktif Indonesia (`pages/pusat-bantuan.html`):**
   - Kanvas `.indonesia-map` mempertahankan rasio aspek proporsional di semua ukuran layar, dengan kontrol zoom (`40x40px`) dan daftar gulir 22 area (`max-h-[300px] overflow-y-auto`) di bawah peta pada perangkat mobile.
