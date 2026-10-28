# Kemajuan Implementasi

## Selesai

- Beranda menjadi entry point; Tentang Kami, Layanan, Armada, dan Pusat Bantuan memiliki halaman kerja.
- Menemukan sumber Stitch Pusat Bantuan secara rekursif dan mengadaptasikannya tanpa mengubah ekspor `code.html`/`screen.png`.
- Memperbaiki navigasi lokal ke seluruh lima halaman, termasuk tautan Bantuan yang sebelumnya menjadi placeholder.
- Menggunakan `logo.png` lokal pada lima halaman, mempertahankan file logo serta semua ekspor sumber.
- Memusatkan menu mobile dan tombol kembali ke atas di `js/site-shell.js`; menambahkan tombol ke Armada dan Pusat Bantuan.
- Menambahkan pengendali modal cabang dengan dukungan Escape, backdrop, fokus, dan Tab.
- Menambahkan judul halaman, ekstraksi CSS/config, README, dokumentasi, dan pemeriksaan statis.
- Menyelaraskan 63 kartu Armada dengan `fleet (1).json` terbaru; nama, kategori, deskripsi, spesifikasi, harga, fasilitas, dan status pada kartu/detail mengikuti sumber tersebut.
- Menampilkan kategori dari file data sebagai filter dan meneruskan deskripsi, kegunaan, spesifikasi, dua paket tarif, ketersediaan, serta ketentuan sewa ke modal Lihat Detail.
- Menjaga tautan pencarian Google `imageSearchUrl` dan mempertahankan foto referensi Commons untuk 20 kartu yang namanya masih cocok dengan pilihan sebelumnya. File terbaru tetap utuh; entri lain memakai placeholder dari data.
- Menambahkan ikon pada rincian kendaraan, ikon kategori pada deskripsi, dan ikon sumber pada tautan foto/pencarian dalam modal detail. Foto referensi bukan dokumentasi unit ANANTALIA TRANS; entri lain tetap menggunakan placeholder.

## Pemeriksaan

- Validator statis lulus pada lima halaman: shell/top button tunggal, judul, logo/path lokal, target fragmen, ID unik, CSS seimbang, dan sintaks JS.
- Pemeriksaan Chrome 155 dengan Playwright: tombol kembali ke atas diuji di kelima halaman pada desktop dan kembali ke posisi scroll 0; logo termuat lokal. Menu mobile Pusat Bantuan, FAQ, modal buka/Escape dan pengembalian fokus juga diuji.
- Pengujian interaksi sebelumnya untuk Beranda/Tentang/Layanan/Armada mencakup navigasi, menu, CTA, filter Layanan, pencarian/reset/detail Armada. Rincian waktu dan batasnya tercatat di `docs/visual-validation.md`.
- Tailwind CDN tidak dapat dimuat pada sesi pemeriksaan lokal (`tailwind is not defined`). Karena itu hasil interaksi DOM dapat dicatat, tetapi screenshot, layout, overflow, dan tampilan akhir tidak dinyatakan lolos.
- Penyelarasan katalog dengan `fleet (1).json` belum diuji ulang pada browser atau validator dalam pekerjaan terbaru ini.

## Sisa yang memerlukan sumber eksternal/resmi

- Label Syarat & Ketentuan dan Kebijakan Privasi pada lima halaman kini berupa teks non-interaktif sampai URL resmi tersedia; seluruh `href="#"` dihapus tanpa membuat konten fiktif.
- Pemeriksaan visual representatif pada 1440 × 900 dan 390 × 844 perlu diulang saat Tailwind CDN dapat dimuat. Perbandingan screenshot dengan Stitch belum dilakukan.
- Validasi HTML/CSS formal dan audit aksesibilitas formal tidak dilakukan.

