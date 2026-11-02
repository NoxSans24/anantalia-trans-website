# Laporan Stabilisasi Proyek — Phase 1

**Proyek:** ANANTALIA TRANS  
**Tanggal:** 1 November 2026  
**Cakupan:** Audit ulang dan stabilisasi website publik. Tidak termasuk pembangunan admin dashboard.

## Ringkasan temuan aktual

Audit diulang terhadap lima halaman HTML aktual, seluruh stylesheet dan JavaScript halaman, `fleet.json`, konfigurasi/build, serta dokumentasi yang tersedia di workspace. Temuan lama secara umum masih relevan, tetapi detail diperiksa ulang sebelum perubahan.

| ID | Temuan aktual | Penanganan Phase 1 |
|---|---|---|
| A-01 | Materi publik memuat klaim badan usaha/legalitas, cakupan, jam operasi, kondisi/KIR/asuransi armada, kualifikasi pengemudi, SLA, fasilitas, harga, dan kebijakan tanpa bukti pemilik. Nomor telepon/WhatsApp lama tersedia tetapi kepemilikannya belum terverifikasi. | Klaim yang berisiko dibaca sebagai fakta diganti dengan keterangan netral/permintaan konfirmasi. Nomor yang sudah ada dipertahankan dan diberi label perlu konfirmasi; tidak ada nomor, alamat, izin, atau kebijakan baru yang dibuat. TODO(owner) ditempatkan pada halaman publik. Data armada tetap berlabel dummy. |
| A-02 | Lima halaman bergantung pada Tailwind CDN untuk utility layout; utility tidak tersedia ketika CDN gagal. | Tailwind 3.4.17 dikompilasi menjadi stylesheet lokal. CDN dan runtime config di HTML dihapus setelah build serta pemeriksaan browser terhadap pengganti lokal. |
| A-03 | README dan dokumentasi menyebut nama/path ekspor, berkas JSON, dan aset yang tidak tersedia pada struktur aktual. | README, inventaris aset, arsitektur, kemajuan, catatan visual, dan instruksi tes diperbarui berdasarkan file aktual. Berkas yang tidak ada dicatat sebagai tidak tersedia. |
| A-04 | 63 kartu penuh pada `pages/armada.html` menduplikasi model dan data dari `fleet.json`. Metadata gambar 20 kartu juga hanya tercatat di HTML. | `fleet.json` menjadi sumber katalog tunggal; kartu dan kategori di HTML diganti hook render. Metadata foto dari kartu lama dipindah ke record yang ID-nya sama. |
| A-05 | Tidak ada validasi visual terbaru dengan stylesheet aktif dan data katalog akhir. | Lima halaman dibuka di browser lokal pada desktop dan mobile; layout, overflow, menu, filter, pencarian, dialog, FAQ, dan peta diuji. Hasil dan keterbatasan tercatat di `docs/visual-validation.md`. |
| A-06 | Material Symbols dimuat berulang 2–4 kali pada beberapa halaman. | Setiap halaman kini memuat satu impor Material Symbols. |

## Backup dan berkas yang dipertahankan

Sebelum implementasi, dibuat backup unik di [`backups/phase-1-20261101-211126/`](../backups/phase-1-20261101-211126/). Backup berisi 22 salinan pra-perubahan halaman, CSS/JS, JSON, tes, dan dokumentasi. Tidak ada backup lama yang ditimpa dan tidak ada aset sumber asli yang dihapus atau ditimpa.

[`desain.md`](../desain.md) dan [`docs/audit-project-2026-11-01.md`](./audit-project-2026-11-01.md) dipertahankan apa adanya.

## File yang diubah atau ditambahkan

### Situs dan katalog

- `index.html`, `pages/tentang-kami.html`, `pages/layanan.html`, `pages/pusat-bantuan.html`: menautkan Tailwind lokal, mengurangi impor Material Symbols menjadi satu, memperjelas informasi yang belum terverifikasi, dan menambahkan TODO pemilik. Data penting yang sudah ada tidak diganti dengan fakta buatan.
- `pages/armada.html`: menghapus 63 kartu hardcoded dan daftar kategori hardcoded; mempertahankan shell katalog, kategori, status kosong, dan dialog detail.
- `fleet.json`: menerima metadata gambar, teks alternatif, dan sumber/kredit/lisensi dari 63 kartu sebelum markup statis dihapus. Semua data kategori/tarif/spesifikasi dummy dibandingkan dengan backup dan tidak berubah.
- `js/armada-detail.js`: mengambil JSON melalui HTTP, membentuk kartu/kategori, mengelola pencarian, filter, reset, empty/error state, fallback gambar, detail, dan tautan sumber.
- `js/tailwind-config.js`, `css/tailwind.input.css`, `css/tailwind.generated.css`: konfigurasi dan output Tailwind lokal.
- `css/main.css`: mengubah wordmark header mobile yang terpotong agar membungkus pada lebar sempit tanpa overflow.

### Build dan pengujian

- `package.json`, `package-lock.json`: skrip build, watch, serve, dan tes stabilisasi; Tailwind CSS 3.4.17 serta plugin forms 0.5.9 dipatok versinya.
- `scripts/serve.js`: server statis HTTP loopback untuk pratinjau lokal; diperlukan karena katalog mengambil JSON menggunakan `fetch()`.
- `.gitignore`: mengecualikan `node_modules/`.
- `tests/stabilization.js`: validasi cakupan utility CSS, tanpa CDN, impor ikon, sumber katalog dan ID armada.
- `tests/README.md`: membedakan tes statis dari uji browser.

### Dokumentasi

- `README.md`
- `docs/asset-inventory.md`
- `docs/architecture.md`
- `docs/implementation-progress.md`
- `docs/visual-validation.md`
- `docs/stabilization-report.md` (laporan ini)

Salinan sementara untuk browser (`*.local-qa.html`) dibuat selama tahap pra-penghapusan CDN dan dibersihkan setelah QA; tidak ada halaman kerja atau aset asli yang dihapus.

## Keputusan teknis

1. `fleet.json` adalah sumber tunggal untuk data katalog; HTML tidak menyimpan ulang record armada.
2. Semua 63 ID dan tujuh kategori dipertahankan. Tarif, fitur, spesifikasi, ketentuan, availability dummy, gambar, fallback, pencarian gambar, dan metadata foto yang tersedia dipertahankan.
3. Kartu dirender di browser memakai DOM/text API agar teks data tidak disisipkan sebagai HTML mentah. Katalog perlu diakses lewat HTTP, bukan `file://`.
4. `tailwind.generated.css` dipertahankan sebagai artefak build yang dimuat halaman publik. Konfigurasi memindai lima HTML dan JavaScript yang menggunakan kelas dinamis; plugin forms tetap aktif.
5. Klaim bisnis tidak diverifikasi melalui asumsi maupun pencarian eksternal. Copy yang belum disahkan diberi bahasa bersyarat dan TODO pemilik.
6. Tidak ada struktur dashboard atau admin baru pada fase ini.

## Hasil pengujian

### Otomatis

- `npm run build:css` — **lulus**, output `css/tailwind.generated.css` dibuat (53.582 byte pada run terakhir). Ada peringatan bahwa database `caniuse-lite` kedaluwarsa; warning tidak menghentikan build.
- `npm run test:stabilization` — **lulus**: lima halaman, 63 ID unik, tidak ada kartu duplikat dalam HTML, JSON tunggal, tanpa CDN, satu impor Material Symbols per halaman, 696 token class ditemukan pada sumber/renderer tercakup dalam output, breakpoint 640/768/1024 px dan state hover/focus tersedia.
- `tests/validate.ps1` — **lulus**: lima halaman, shell navigasi, logo/path lokal, target fragmen, ID unik, CSS seimbang, serta sintaks JavaScript inline.
- `node --check` — **lulus** untuk `js/armada-detail.js`, `js/site-shell.js`, `js/layanan-detail.js`, `js/pusat-bantuan.js`, dan `scripts/serve.js`.
- Perbandingan JSON dengan backup — **lulus** untuk seluruh 63 ID dan bidang dummy kategori, kapasitas, transmisi, bahan bakar, fitur, tarif/paket, ketersediaan, dan ketentuan; tidak ada perubahan pada bidang-bidang tersebut. Dua puluh metadata gambar Wikimedia tetap terhubung ke model yang sama.
- `npm audit` ketika dependency dipasang — melaporkan **0 kerentanan yang diketahui** pada saat pemeriksaan.

### Browser desktop dan mobile

Situs pratinjau lokal diuji pada viewport desktop 1440×900 dan mobile 390×844. Kelima halaman dibuka pada keduanya; area dokumen browser sekitar 1425 px dan 375 px karena scrollbar. Semua halaman memakai font Manrope/CSS lokal dan tidak memiliki overflow horizontal.

- Armada: seluruh 7 filter kategori menghasilkan hitungan sama dengan JSON; pencarian model dan varian bekerja; hasil kosong muncul; reset memulihkan 63 unit; modal detail menampilkan data dummy dan placeholder gambar saat tidak tersedia.
- Layanan: filter Rental Mobil menampilkan satu kartu; modal detail dapat dibuka dan ditutup.
- Pusat Bantuan: FAQ berganti state; pencarian area, pemilihan Bandung, dan dialog detail status ilustratif bekerja.
- Navigasi mobile membuka lima tautan dan memperbarui `aria-expanded`.
- Screenshot aktual ditinjau pada desktop dan mobile; tidak ada klaim hasil Lighthouse atau kesetaraan pixel dengan desain sumber.

## Masalah yang belum terselesaikan

- Pemilik harus memastikan badan usaha dan legalitas, nomor telepon/WhatsApp, alamat, jam layanan, layanan, jangkauan, kondisi/fasilitas armada, pengemudi, harga, kontrak/SLA, serta kebijakan pembatalan dan biaya. Penanda TODO perlu tetap ada sampai data/bukti diterima.
- Harga, spesifikasi, fasilitas, dan status armada masih dummy, bukan penawaran atau ketersediaan aktual. Nomor kontak lama yang dipertahankan juga belum terverifikasi. Hindari menerima reservasi berdasarkan data prototipe.
- Sebagian font/foto menggunakan layanan eksternal. Uji browser lokal tidak menjamin URL eksternal tetap tersedia atau penggunaannya memiliki izin yang sesuai.
- URL/konten kebijakan Syarat & Ketentuan dan Privasi belum disediakan.
- Database kompatibilitas `caniuse-lite` menampilkan warning versi usang.
- Validator HTML5/CSS eksternal, Lighthouse, pengujian aksesibilitas formal, dan deployment/traffic produksi tidak dijalankan. Uji browser dilakukan di browser in-app lokal.

## Rekomendasi berikutnya

1. Minta pemilik mengisi dan menyetujui nilai TODO untuk badan usaha, kontak, kebijakan, cakupan, layanan, dan daftar armada aktual.
2. Setelah informasi resmi tersedia, perbarui satu sumber data (`fleet.json`) dan copy publik; tinjau izin/atribusi setiap foto.
3. Mulai Phase 2 — System Planning dengan kebutuhan aktor/peran, otorisasi, entitas, alur armada dan pemesanan, audit trail, API, integrasi, backup/retensi, serta risiko. Sepakati arsitektur dan rancangan sebelum implementasi dashboard admin.
4. Setelah Phase 2 disetujui, tambahkan validasi HTML/CSS dan pengujian aksesibilitas, performa, serta deployment lintas browser.
