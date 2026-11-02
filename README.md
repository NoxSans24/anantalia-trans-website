# ANANTALIA TRANS

Situs statis multi-halaman untuk ANANTALIA TRANS. Informasi bisnis, layanan, kontak, jangkauan, tarif, dan spesifikasi kendaraan yang belum dikonfirmasi diberi penanda agar tidak disajikan sebagai fakta.

## Halaman

- `index.html` — Beranda
- `pages/tentang-kami.html` — Tentang Kami
- `pages/layanan.html` — Layanan dan filter kategori
- `pages/armada.html` — Katalog armada yang dibuka dengan enam pilihan rekomendasi; tombol menampilkan seluruh katalog. Pencarian serta filter kategori, kapasitas, dan transmisi bekerja bersama; dialog detail tetap tersedia.
- `pages/pusat-bantuan.html` — FAQ, peta ilustratif, filter area, dan dialog lokasi

## Teknologi dan sumber data

- HTML, CSS, dan JavaScript vanilla.
- Tailwind CSS 3.4.17 dikompilasi ke `css/tailwind.generated.css` secara lokal. Halaman tidak memuat Tailwind CDN.
- `fleet.json` adalah satu-satunya sumber katalog 63 entri armada, termasuk metadata gambar dan tautan sumbernya. Seluruh data tarif dan spesifikasi tetap ditandai sebagai dummy.
- Manrope dan satu stylesheet Material Symbols per halaman diambil dari Google Fonts; font memerlukan koneksi internet.
- Foto dari sumber eksternal dapat tidak tersedia. Kartu Armada memakai `assets/placeholder-vehicle.svg` sebagai fallback.

## Menjalankan secara lokal

Katalog memuat `fleet.json` melalui HTTP, sehingga buka `index.html` langsung sebagai `file://` tidak menjalankan katalog. Jalankan dari root proyek:

```powershell
npm ci
npm run build:css
npm run serve
```

Buka `http://127.0.0.1:4173`. `npm run watch:css` tersedia ketika mengubah utility class.

## Pemeriksaan

```powershell
npm run build:css
npm run test:stabilization
powershell -NoProfile -ExecutionPolicy Bypass -File tests/validate.ps1
```

Pemeriksaan statis dan interaksi browser memiliki cakupan yang berbeda. Hasil pemeriksaan terakhir dicatat di `docs/stabilization-report.md` dan rincian browser di `docs/visual-validation.md`.

## Pemeliharaan

- Perbarui daftar dan metadata armada hanya di `fleet.json`; jangan menambahkan kembali kartu katalog statis di HTML.
- Setelah menambah atau mengubah utility class di HTML/JavaScript, jalankan `npm run build:css` dan `npm run test:stabilization`.
- Konfirmasi klaim, nomor kontak/WhatsApp, alamat, kebijakan, tarif, jangkauan, fasilitas, dan status operasional kepada pemilik sebelum dipublikasikan sebagai informasi faktual.
- URL Syarat & Ketentuan dan Kebijakan Privasi belum tersedia; labelnya tetap berupa teks biasa.
- Jangan mengubah `desain.md` atau `docs/audit-project-2026-11-01.md` tanpa permintaan tersendiri.
