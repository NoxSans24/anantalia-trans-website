# Inventaris Aset

| Kelompok | File/kondisi | Catatan |
|---|---|---|
| Halaman kerja | `index.html`, `pages/tentang-kami.html`, `pages/layanan.html`, `pages/armada.html`, `pages/pusat-bantuan.html` | Lima halaman aktual; satu navigasi lokal bersama. |
| Katalog Armada | `fleet.json` | Satu sumber untuk 63 ID unik di 7 kategori; seluruh harga, fasilitas, spesifikasi, dan ketersediaan merupakan data dummy. |
| Render armada | `js/armada-detail.js`, `pages/armada.html` | Kartu tidak lagi ditulis berulang pada HTML. JS mengambil data JSON, membentuk kategori/kartu, lalu mengelola pencarian, filter kategori/kapasitas/transmisi, reset, status kosong, dialog detail, dan tautan sumber foto. |
| Gambar armada | `assets/placeholder-vehicle.svg` dan URL sumber di `fleet.json` | Fallback lokal saat gambar tidak tersedia. Dua puluh record memiliki metadata foto referensi Wikimedia Commons yang dipertahankan dari HTML lama; foto bukan dokumentasi kendaraan perusahaan. |
| Peta ilustratif | `assets/indonesia-silhouette.svg` | Siluet lokal Sage/Teal. Dua puluh dua pin adalah ilustrasi lokasi antarmuka, bukan wilayah/pool aktual yang terverifikasi. |
| Logo | `logo.png` (root) | Dipakai oleh lima halaman. Aset asli tidak diubah. |
| CSS | `css/tailwind.input.css`, `css/tailwind.generated.css`, `css/main.css`, `css/armada.css`, `css/layanan.css`, `css/pusat-bantuan.css` | Utility lokal hasil kompilasi dan aturan spesifik komponen. |
| JavaScript | `js/tailwind-config.js`, `js/site-shell.js`, `js/armada-detail.js`, `js/layanan-detail.js`, `js/pusat-bantuan.js` | Konfigurasi build, shared navigation, serta interaksi halaman. |
| Build/serve | `package.json`, `package-lock.json`, `scripts/serve.js` | Tailwind CSS 3.4.17 dan forms plugin; server statis lokal tanpa dependency server tambahan. |
| Font/icon | Google Fonts: Manrope dan Material Symbols | Satu impor Material Symbols per halaman; koneksi internet diperlukan. |
| Referensi visual | `serene_transit/DESIGN.md`, `desain.md`, `anantalia_trans_admin_full_stitch_kit.zip` | Berkas aktual yang ada di root; tidak dimuat langsung situs publik. `desain.md` dipertahankan. |
| Ekspor Google Stitch Pusat Bantuan | Tidak ditemukan di workspace aktif maupun root visualisasi terkait | Halaman kerja `pages/pusat-bantuan.html` tetap dipertahankan. Ekspor `code.html`/`screen.png` diperlukan untuk pemeriksaan kesesuaian visual terhadap sumber. |
| Dokumentasi audit | `docs/audit-project-2026-11-01.md` | Dipertahankan apa adanya. |
| Backup | `backups/phase-1-20261101-211126/` | Salinan pra-perubahan untuk 22 file sumber/dokumentasi. Tidak menimpa backup yang sudah ada. |

## Hal yang tidak tersedia

Dokumentasi ini tidak mengklaim adanya folder ekspor Stitch, `code.html`, `screen.png`, `fleet (1).json`, atau aset sumber lain di luar daftar aktual di atas. URL font dan sebagian foto tetap bergantung pada layanan eksternal.
