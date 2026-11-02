# Audit Project ANANTALIA TRANS

Tanggal: 1 November 2026  
Cakupan: lima halaman HTML, CSS/JavaScript lokal, katalog armada, aset, dokumentasi, dan pemeriksaan statis yang tersedia.  
Jenis pemeriksaan: desk audit kode dan konten. Tidak mencakup pentest, audit aksesibilitas formal, atau inspeksi visual browser.

## Ringkasan

Project sudah memiliki lima halaman yang saling terhubung, aset logo lokal, interaksi utama berbasis JavaScript, dan data katalog yang ditandai sebagai dummy. Validator statis yang tersedia lulus. Kesiapan produksi masih tertahan oleh klaim layanan yang belum memiliki bukti di project, ketergantungan tata letak pada Tailwind CDN, serta dokumentasi yang menyebut berkas sumber yang tidak ada di workspace.

### Temuan prioritas

| ID | Prioritas | Area | Temuan |
|---|---|---|---|
| A-01 | P1 | Keakuratan konten | Klaim operasional dan identitas bisnis belum didukung sumber verifikasi di workspace. |
| A-02 | P1 | Ketahanan deployment | Tata letak utama bergantung pada Tailwind CDN; CSS lokal tidak menggantikan seluruh utility yang digunakan. |
| A-03 | P1 | Dokumentasi/aset | README dan inventaris menyebut file data/ekspor yang tidak tersedia di workspace saat ini. |
| A-04 | P2 | Sumber data | 63 kartu Armada ditulis di HTML sementara `fleet.json` memuat daftar yang sama; rawan drift saat salah satunya diperbarui. |
| A-05 | P2 | QA visual | Tidak ada bukti pemeriksaan visual setelah revisi terakhir; validasi statis tidak menilai layout, overflow, atau tampilan komponen. |
| A-06 | P3 | Efisiensi aset | Beberapa halaman memuat stylesheet Material Symbols berulang kali. |

## Temuan

### A-01 — Klaim bisnis belum memiliki sumber verifikasi

**Prioritas:** P1 — sebelum publikasi sebagai situs komersial  
**Lokasi:** `index.html` (trust strip, hero, dan bagian layanan); `pages/layanan.html`; `pages/pusat-bantuan.html`

Beranda memuat klaim “100% Legal & Berizin”, “Uji KIR & Servis Rutin”, “Respon Cepat 24 Jam”, dan “Lolos 25 Titik Uji Jalan”. Pusat Bantuan juga menyebut nomor “Terverifikasi” dan layanan aktif 24 jam. Saya tidak menemukan dokumen pendukung untuk izin, inspeksi, jadwal layanan, kontak resmi, atau identitas badan usaha di workspace.

**Dampak:** Pengunjung dapat mengandalkan klaim legal, keselamatan, dan ketersediaan layanan yang belum dapat dibuktikan dari bahan project.

**Tindak lanjut:** Cocokkan setiap klaim dengan sumber yang disetujui pemilik. Hapus, lunakkan, atau tandai sebagai belum terverifikasi sampai bukti tersedia.

### A-02 — Layout utama tidak memiliki fallback lokal penuh

**Prioritas:** P1 — untuk deployment yang harus tetap terbaca tanpa akses CDN; selain itu P2  
**Lokasi:** seluruh halaman HTML; `css/main.css`; `css/armada.css`

Kelima halaman memuat Tailwind melalui `https://cdn.tailwindcss.com`. Utility untuk grid, display, spacing, warna, dan banyak komponen berasal dari CDN. CSS lokal berisi penyesuaian, bukan stylesheet pengganti untuk semua kelas tersebut. Dokumentasi validasi mencatat Tailwind gagal dimuat pada pemeriksaan sebelumnya, sehingga pemeriksaan interaksi saat itu tidak membuktikan tampilan.

**Dampak:** Bila CDN tidak dapat dijangkau atau skrip gagal, struktur visual dapat berubah besar walaupun HTML lokal berhasil dibuka.

**Tindak lanjut:** Pilih cara distribusi stylesheet yang sesuai target hosting. Setelah itu periksa ulang tampilan dengan dependensi aktif dan nonaktif.

### A-03 — Referensi dokumentasi tidak cocok dengan isi workspace

**Prioritas:** P1 — untuk pemeliharaan dan reproduksi build  
**Lokasi:** `README.md`, `docs/asset-inventory.md`, `docs/architecture.md`, `docs/implementation-progress.md`

README menyebut `fleet (1).json`, sedangkan file yang tersedia adalah `fleet.json`. Dokumen aset/arsitektur juga menyatakan ekspor Stitch seperti `code.html` dan `screen.png` dipertahankan, tetapi pencarian workspace hanya menemukan `serene_transit/DESIGN.md` sebagai dokumen desain sumber; file ekspor tersebut tidak tersedia di project saat ini.

**Dampak:** Pembaca tidak dapat mengikuti petunjuk dokumentasi untuk menemukan sumber katalog dan membandingkan halaman dengan desain asal. Catatan implementasi juga dapat memberi kesan bahwa aset ada padahal tidak disertakan.

**Tindak lanjut:** Perbarui dokumentasi agar merujuk file yang ada, atau pulihkan file sumber yang memang dibutuhkan.

### A-04 — Data Armada terduplikasi di JSON dan markup

**Prioritas:** P2  
**Lokasi:** `fleet.json`, `pages/armada.html`

`fleet.json` berisi 63 entri bertanda dummy. `pages/armada.html` juga memuat 63 kartu dengan atribut data armada. Pemeriksaan ID saat audit ini menemukan semua 63 ID JSON ada di HTML dan tidak ada ID kartu tambahan. Namun halaman tidak memuat katalog dari file JSON, sehingga perubahan tarif, spesifikasi, status, atau deskripsi berpotensi hanya diterapkan pada salah satu salinan.

**Dampak:** Kedua sumber dapat berbeda meski pemeriksaan ID tetap lulus. Validator saat ini tidak membandingkan isi bisnis kedua sumber.

**Tindak lanjut:** Tetapkan satu sumber data yang dipelihara. Jika markup statis dipertahankan, tambahkan pemeriksaan konsistensi data, bukan hanya keberadaan ID.

**Catatan publikasi:** Banner Armada menyatakan tarif, spesifikasi, fasilitas, dan status adalah data dummy. Jangan gunakan angka katalog sebagai penawaran resmi sebelum diverifikasi pemilik.

### A-05 — Pemeriksaan visual pascarevisi belum tercatat

**Prioritas:** P2  
**Lokasi:** `docs/visual-validation.md`

Catatan project menyatakan perubahan terbaru pada peta dan modal belum diperiksa secara visual di browser. Audit ini juga tidak mengambil screenshot. Validator yang lulus memeriksa struktur, jalur lokal, ID, keseimbangan kurung CSS, dan sintaks JavaScript; pemeriksaan itu tidak mengukur tampilan desktop/mobile atau perilaku ketika CDN gagal.

**Dampak:** Risiko layout terpotong, tumpang tindih, atau sulit digunakan pada layar kecil masih belum tersaring.

**Tindak lanjut:** Lakukan pemeriksaan browser pada desktop dan ponsel, termasuk menu, katalog, FAQ, peta, dialog, keyboard, zoom, dan reduced motion. Catat viewport dan kondisi CDN yang diuji.

### A-06 — Impor ikon berulang

**Prioritas:** P3  
**Lokasi:** bagian `<head>` halaman HTML

Setiap halaman memuat sedikitnya dua stylesheet Google Fonts untuk Material Symbols; Beranda memuat tiga dan Layanan empat. Permintaan URL yang sama dapat digabung oleh cache browser, tetapi markup tetap berulang dan variasi URL/parameter dapat meminta varian font yang sama lebih dari sekali.

**Dampak:** Head dokumen lebih sulit dirawat dan sebagian permintaan font berpotensi berulang.

**Tindak lanjut:** Sisakan satu impor Material Symbols dengan rentang glyph yang benar-benar dibutuhkan tiap halaman, lalu pastikan ikon yang dipakai tetap tampil.

## Hal yang sudah berjalan baik

- Pemeriksaan statis lulus: lima halaman, shell navigasi, logo dan path lokal, target fragmen, ID unik, CSS seimbang, serta sintaks JavaScript.
- Seluruh 63 ID kartu Armada cocok dengan ID pada `fleet.json`.
- Katalog memberi pemberitahuan bahwa datanya dummy; foto armada tertentu juga diberi keterangan bahwa foto adalah referensi, bukan dokumentasi unit.
- Tidak ditemukan `href="#"` di pemeriksaan terdahulu yang didokumentasikan; label legal yang belum punya URL resmi ditampilkan sebagai teks biasa.
- Tautan eksternal yang memakai `target="_blank"` pada halaman yang diperiksa menggunakan `rel="noopener noreferrer"`.
- Tersedia aturan `prefers-reduced-motion`, menu mobile dengan state ARIA, dan fokus terlihat untuk tombol kembali ke atas.

## Batas audit

Audit ini berfokus pada isi repository. Tidak dilakukan pentest, pemindaian dependensi (project tidak memiliki manifest paket), validasi HTML/CSS formal, audit WCAG formal, atau uji jaringan/browser baru. Kebenaran klaim perusahaan, lisensi aset, tarif, spesifikasi, kontak, dan cakupan layanan harus dikonfirmasi oleh pemilik data.
