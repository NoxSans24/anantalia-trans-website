# Validasi

## Perintah

Dari root proyek jalankan:

`powershell -NoProfile -ExecutionPolicy Bypass -File tests/validate.ps1`

Skrip memeriksa lima halaman, judul, shell dan tombol kembali ke atas tunggal, dua logo lokal per halaman, path lokal, target fragmen, ID duplikat, keseimbangan CSS, serta sintaks JavaScript inline dan file lokal. Node.js harus tersedia.

## Hasil pemeriksaan terakhir sebelum dokumentasi ini

LULUS pada lima halaman. Tidak ada `href="#"`; label legal tetap berupa teks biasa sampai URL resmi tersedia. Pemeriksaan Chrome dan keterbatasan CDN dirangkum di `docs/visual-validation.md`.

