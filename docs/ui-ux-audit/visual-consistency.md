# Phase 2 — Visual UI/UX & Design System Consistency Audit

Audit dilakukan terhadap kepatuhan seluruh 5 halaman publik pada design system **Google Stitch — Serene Transit** (`serene_transit/DESIGN.md`, `desain.md`, dan `js/tailwind-config.js`).

## Evaluasi 15 Dimensi Visual

| No | Dimensi Audit | Token / Standar Design System | Temuan Sebelum Perbaikan | Status Pasca-Perbaikan |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Color Consistency** | `surface-page` (`#F7F8F6`), `surface-card` (`#FFFFFF`), `surface-mint` (`#EAF6F4`), `primary` (`#006764`), `on-surface` (`#191C1B`), `text-secondary` (`#3D4948`), `whatsapp-green` (`#0d7837` di `main.css`). | `pages/armada.html` tidak memuat `css/main.css`, sehingga `.bg-whatsapp-green` menggunakan warna `#25D366` (kontras teks putih tidak memenuhi WCAG AA) alih-alih `#0d7837`. | **PASS** |
| 2 | **Typography Consistency** | Font keluarga `Manrope` (`400`, `500`, `600`, `700`) dengan skala `display-h1`, `section-h2`, `card-h3`, `headline-sm`, `body-default`, `body-sm`, `caption`, `label-sm`. | Konsisten menggunakan `Manrope` di seluruh 5 halaman. | **PASS** |
| 3 | **Spacing Consistency** | Token `space-xs` (`8px`), `space-sm` (`12px`), `space-md` (`16px`), `space-lg` (`24px`), `space-xl` (`32px`), `space-2xl` (`48px`), container `max-w-7xl mx-auto px-6 lg:px-12`. | Konsisten di seluruh halaman; hanya terdapat kepadatan berlebih pada Quick Trust Bar `index.html` (`grid-cols-2` di layar 360px). Diperbaiki menjadi `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. | **PASS** |
| 4 | **Layout Consistency** | Header fixed `h-20` (`72px` di mobile), konten utama `pt-20`, footer 12 kolom (`lg:col-span-5`, `3`, `4`). | Konsisten di seluruh 5 halaman. | **PASS** |
| 5 | **Component Consistency** | Header, Mobile Drawer, Notice Banner (`#FEF3C7`), Scroll-to-Top (`#scrollToTopBtn`), dan Footer. | Subjudul brand di header berbeda antara `"Premium Tour & Travel"` (`tentang-kami`, `armada`) dan `"Informasi layanan perjalanan"` (`index`, `layanan`, `pusat-bantuan`). Diseragamkan menjadi `"Informasi layanan perjalanan"`. | **PASS** |
| 6 | **Icon Consistency** | Google Material Symbols Outlined (1 stylesheet import per halaman). | Satu SVG inline pada `pusat-bantuan.html` memiliki path rusak (`d="..."`). Diperbaiki dan diberi `aria-hidden="true"`. | **PASS** |
| 7 | **Button Consistency** | Tombol utama `bg-primary text-on-primary rounded-lg`, sekunder `bg-surface-card` / `bg-surface-mint`. | Elemen dengan atribut `[hidden]` tetap tampil sebagai tombol mati karena class `flex`/`inline-flex` menimpa user-agent `[hidden]`. Diperbaiki dengan `[hidden] { display: none !important; }`. | **PASS** |
| 8 | **Card Consistency** | Kartu menggunakan `bg-surface-card rounded-xl` atau `rounded-2xl` dengan `shadow-sm` dan border halus. | Konsisten di seluruh halaman. | **PASS** |
| 9 | **Border & Radius Consistency** | Radius `rounded-lg` (`12px`), `rounded-xl` (`16px`), `rounded-2xl` (`20px`), `rounded-full`. | Konsisten mengikuti token `js/tailwind-config.js`. | **PASS** |
| 10 | **Shadow Consistency** | Ambient shadow lembut `rgba(23, 51, 50, 0.06)` tanpa shadow hitam pekat. | Konsisten di seluruh halaman. | **PASS** |
| 11 | **Visual Hierarchy** | Kontras jelas antara hero, section header, dan kartu konten. | Baik; perbaikan penyembunyian tombol WhatsApp yang belum terkonfirmasi menghilangkan distraksi visual tombol mati. | **PASS** |
| 12 | **Information Hierarchy** | Urutan heading `h1` → `h2` → `h3` yang logis. | Terdapat lompatan `h1` → `h4` di `index.html`, `h2` → `h4` di `pusat-bantuan.html`, dan `h4` di footer. Seluruhnya telah dinormalisasi ke urutan `h1` → `h2` → `h3`. | **PASS** |
| 13 | **Content Readability** | Panjang baris terkontrol (`max-w-2xl` / `max-w-3xl`) dan kontras teks memenuhi WCAG AA (`#191C1B` & `#3D4948` di atas `#F7F8F6` / `#FFFFFF`). | Sangat baik dan mudah dibaca di desktop maupun mobile. | **PASS** |
| 14 | **Image Quality & Aspect Ratio** | `object-cover` dengan rasio proporsional dan placeholder saat gambar gagal dimuat pada modal/katalog. | Seluruh gambar proporsional; ditambahkan `loading="lazy"` dan `alt` deskriptif pada 13 gambar yang sebelumnya hanya memiliki `data-alt`. | **PASS** |
| 15 | **Alignment & Positioning** | Penataan grid, flex, dan pin koordinat peta. | Pin peta di `pusat-bantuan.html` terproyeksi presisi di atas siluet kepulauan Indonesia; tidak ada elemen bertumpuk atau terpotong. | **PASS** |
