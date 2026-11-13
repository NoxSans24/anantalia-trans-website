# ANANTALIA TRANS

Situs statis multi-halaman untuk ANANTALIA TRANS. Informasi bisnis, layanan, kontak, jangkauan, tarif, dan spesifikasi kendaraan yang belum dikonfirmasi diberi penanda agar tidak disajikan sebagai fakta.

## Halaman

- `index.html` — Beranda
- `pages/tentang-kami.html` — Tentang Kami
- `pages/layanan.html` — Layanan dan filter kategori
- `pages/armada.html` — Katalog kategori, model, kapasitas, dan jenis sewa yang diterima dari public fleet API. Data tarif dan ketersediaan tidak ditampilkan.
- `pages/pusat-bantuan.html` — FAQ, peta ilustratif, filter area, dan dialog lokasi

## Teknologi dan sumber data

- HTML, CSS, dan JavaScript vanilla.
- Tailwind CSS 3.4.17 dikompilasi ke `css/tailwind.generated.css` secara lokal. Halaman tidak memuat Tailwind CDN.
- `fleet.json` menyimpan data prototipe lama untuk arsip dan tidak dimuat sebagai katalog situs.
- Katalog publik mengambil data dari `/api/v1/public/*`. Server preview meneruskan route tersebut ke backend loopback pada `127.0.0.1:3000`; atur `BACKEND_API_ORIGIN` hanya ke origin loopback bila port backend berbeda.
- Manrope dan satu stylesheet Material Symbols per halaman diambil dari Google Fonts; font memerlukan koneksi internet.
- Foto dari sumber eksternal dapat tidak tersedia. Kartu Armada memakai `assets/placeholder-vehicle.svg` sebagai fallback.

## Menjalankan secara lokal

Katalog memuat `fleet.json` melalui HTTP, sehingga buka `index.html` langsung sebagai `file://` tidak menjalankan katalog. Jalankan dari root proyek:

```powershell
npm ci
npm run build:css
npm run serve
```

Buka `http://127.0.0.1:4173`. Jalankan backend secara terpisah pada `127.0.0.1:3000`; `npm run watch:css` tersedia ketika mengubah utility class.

## Pemeriksaan

```powershell
npm run build:css
npm run test:stabilization
powershell -NoProfile -ExecutionPolicy Bypass -File tests/validate.ps1
```

Pemeriksaan statis dan interaksi browser memiliki cakupan yang berbeda. Hasil pemeriksaan terakhir dicatat di `docs/stabilization-report.md` dan rincian browser di `docs/visual-validation.md`.

## Pemeliharaan

- Ubah katalog armada melalui API admin setelah sumber model dan kategori diverifikasi; jangan mengaktifkan model publik sebelum persetujuan.
- Setelah menambah atau mengubah utility class di HTML/JavaScript, jalankan `npm run build:css` dan `npm run test:stabilization`.
- Konfirmasi klaim, nomor kontak/WhatsApp, alamat, kebijakan, tarif, jangkauan, fasilitas, dan status operasional kepada pemilik sebelum dipublikasikan sebagai informasi faktual.
- URL Syarat & Ketentuan dan Kebijakan Privasi belum tersedia; labelnya tetap berupa teks biasa.
- Jangan mengubah `desain.md` atau `docs/audit-project-2026-11-01.md` tanpa permintaan tersendiri.
