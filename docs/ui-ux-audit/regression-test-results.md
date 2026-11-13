# Phase 11 — Regression Test Results

Setelah seluruh perbaikan diimplementasikan, pengujian regresi menyeluruh dijalankan melalui CLI dan browser nyata (Playwright).

---

## 1. Hasil Pemeriksaan Build & Test Otomatis (CLI)

| Perintah Pengujian | Tujuan | Hasil Eksekusi | Status |
| :--- | :--- | :--- | :---: |
| `npm run build:css` | Mengompilasi ulang `css/tailwind.input.css` ke `css/tailwind.generated.css` menggunakan konfigurasi lokal `js/tailwind-config.js`. | `Done in 804ms.` (Exit code `0`) | **PASS** |
| `npm run test:stabilization` (`node ./tests/stabilization.js`) | Memverifikasi integritas 63 ID prototipe di `fleet.json`, absennya kartu statis di `armada.html`, penggunaan API terverifikasi, absennya Tailwind CDN, dan ketersediaan seluruh **708 token class CSS** beserta breakpoint/state di stylesheet terkompilasi. | `LULUS: 5 halaman, 63 ID prototipe yang diarsipkan (tidak dimuat situs), katalog memakai API, tanpa Tailwind CDN, 708 token class dicakup, breakpoint/state CSS tersedia.` (Exit code `0`) | **PASS** |
| `powershell -NoProfile -ExecutionPolicy Bypass -File tests/validate.ps1` | Memverifikasi kelengkapan mobile navigation shell, pemuatan tunggal `js/site-shell.js`, keberadaan `#scrollToTopBtn`, 2 logo lokal per halaman, keunikan seluruh atribut `id`, validitas seluruh path lokal `href`/`src` dan fragmen `#anchor`, keseimbangan kurung kurawal CSS, serta sintaks seluruh file & blok JavaScript. | `LULUS: 5 halaman, shell navigasi, logo dan path lokal, target fragmen, ID unik, CSS, dan sintaks JavaScript.` (Exit code `0`, `0` error, `0` warning) | **PASS** |

---

## 2. Hasil Verifikasi Regresi di Browser Nyata (Playwright)

| Halaman | `[hidden]` Terlihat (`hiddenVisible`) | Gambar Tanpa `alt` (`missingAlt`) | Heading Kosong (`emptyHeadings`) | Nav Aktif Desktop (`activeNav`) | Nav Aktif Mobile (`activeMobileNav`) | Console Error | Overflow di 5 Viewport (`1440`, `1366`, `768`, `390`, `360`) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Beranda** (`index.html`) | `0` | `0` | `0` | `beranda` | `beranda` | `0` | `false` di semua 5 viewport | **PASS** |
| **Tentang Kami** (`pages/tentang-kami.html`) | `0` | `0` | `0` | `tentang-kami` | `tentang-kami` | `0` | `false` di semua 5 viewport | **PASS** |
| **Layanan** (`pages/layanan.html`) | `0` | `0` | `0` | `layanan` | `layanan` | `0` | `false` di semua 5 viewport | **PASS** |
| **Armada** (`pages/armada.html`) | `0` | `0` | `0` | `armada` | `armada` | `0` JS error* | `false` di semua 5 viewport | **PASS** |
| **Pusat Bantuan** (`pages/pusat-bantuan.html`) | `0` | `0` | `0` | `pusat-bantuan` | `pusat-bantuan` | `0` | `false` di semua 5 viewport | **PASS** |

*\*Catatan: Pada `pages/armada.html`, ketika server backend API di port `3000` tidak dijalankan, browser hanya mencatat respons jaringan `502 Bad Gateway` dari proxy `/api/v1/public/rental-types` dan langsung menampilkan state informasi `"Katalog belum tersedia"` dengan rapi.*
