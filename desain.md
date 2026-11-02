# Desain Website ANANTALIA TRANS

Dokumen ini merangkum bahasa visual dan pola antarmuka yang digunakan oleh lima halaman situs: Beranda, Tentang Kami, Layanan, Armada, dan Pusat Bantuan. Isinya mengikuti implementasi HTML/CSS saat ini, bukan rancangan baru.

## Arah visual

Situs menyampaikan layanan transportasi yang tepercaya, rapi, dan nyaman melalui palet teal dan mint, permukaan terang, tipografi Manrope, serta foto kendaraan dan perjalanan. Komposisi memakai ruang lega, kartu putih, sudut membulat, dan bayangan tipis untuk memisahkan kelompok informasi tanpa membuat halaman terasa berat.

## Warna

| Peran | Nilai | Penggunaan |
|---|---|---|
| Teal utama | `#006764` | Tautan aktif, ikon, judul beraksen, tombol utama non-WhatsApp |
| Teal gelap/varian | `#00827E` | Variasi warna utama dan gradasi CTA |
| Teks utama | `#02201F` | Judul dan teks utama |
| Teks sekunder | `#526765` | Deskripsi, keterangan, dan metadata |
| Latar halaman | `#F7F8F6` | Latar dasar halaman |
| Mint lembut | `#EAF6F4` | Panel informatif, sorotan hover, dan bidang pendukung |
| Kartu | `#FFFFFF` | Kartu, navigasi, dan panel konten |
| Garis tipis | `#DCE5E2` | Pemisah dan batas komponen |
| Aksen WhatsApp | `#0D7837` | Tombol WhatsApp dengan label putih; warna ini ditetapkan di `css/main.css` untuk kontras teks |

Konfigurasi Tailwind masih memuat nilai token WhatsApp `#25D366`, sedangkan aturan CSS bersama menimpanya menjadi `#0D7837` (hover `#095C2B`). Gunakan warna hasil CSS sebagai acuan tampilan tombol yang sedang berjalan.

## Tipografi

- **Jenis huruf:** Manrope untuk judul, isi, label, dan keterangan; Material Symbols Outlined untuk ikon.
- **Judul utama desktop:** 56 px, tebal, line-height 64 px.
- **Judul bagian desktop:** 36 px, tebal, line-height 44 px.
- **Judul kartu:** sekitar 22 px, semibold, line-height 30 px.
- **Isi:** 16 px, line-height 25,6 px; teks pendukung umumnya 14 px.
- **Skala layar kecil:** judul halaman dan bagian diturunkan dengan aturan responsif di `css/main.css`.

Jaga hierarki teks tetap jelas. Label kecil membantu orientasi, tetapi isi dan judul menyampaikan informasi utama tanpa bergantung pada ikon.

## Tata letak dan komponen

- **Header:** navigasi tetap di bagian atas, logo dan nama merek di kiri, tautan halaman di tengah, serta aksi WhatsApp di kanan. Pada layar kecil, navigasi desktop diganti menu yang dapat dibuka.
- **Beranda:** hero dua kolom dengan pesan dan CTA di kiri serta foto kendaraan di kanan; dilanjutkan layanan, pilihan armada, keunggulan, langkah reservasi, dan CTA penutup.
- **Halaman konten:** judul pembuka yang jelas, bagian informasi dengan urutan tematis, lalu ajakan menghubungi tim.
- **Katalog armada:** kartu kendaraan berisi foto atau placeholder, kategori, informasi ringkas, dan akses ke detail; katalog memiliki filter dan dialog detail.
- **Pusat Bantuan:** FAQ, kanal kontak, dan bagian cakupan layanan/peta dengan informasi lokasi.
- **Footer:** ringkasan perusahaan, navigasi cepat, kontak, wilayah layanan, dan informasi legal.
- **CTA WhatsApp:** aksi konversi utama, tersedia pada header dan beberapa bagian halaman; tombol mengarah ke WhatsApp.

## Bentuk, jarak, dan elevasi

- Kartu memakai radius yang umumnya berkisar 12–24 px; tombol dan label memakai radius sedang hingga bentuk pil.
- Jarak antarkelompok konten dibuat lapang; kontainer lebar dibatasi agar teks tetap nyaman dibaca.
- Gunakan bayangan ringan untuk membedakan kartu dari latar. Bayangan lebih kuat hanya muncul pada elemen yang perlu menonjol, seperti kartu visual hero atau CTA.
- Ikon berfungsi sebagai penanda pendamping teks, bukan pengganti label.

## Foto dan ilustrasi

Foto kendaraan menjadi bukti visual layanan dan digunakan pada hero serta kartu armada. Sebagian foto armada merupakan foto referensi eksternal dan bukan dokumentasi unit milik perusahaan. Kartu tanpa foto memakai ilustrasi placeholder lokal. Peta Pusat Bantuan menggunakan siluet Indonesia lokal dengan penanda kota terpisah.

Pertahankan rasio dan pemotongan foto yang konsisten dalam satu kelompok kartu. Jangan menghapus keterangan sumber, lisensi, atau penjelasan placeholder yang sudah tampil pada katalog.

## Responsif dan interaksi

- Navigasi berubah menjadi menu mobile; header dipadatkan agar identitas merek, CTA, dan tombol menu tetap muat.
- Grid beberapa kolom pada desktop ditumpuk pada layar kecil; ukuran judul ikut menyesuaikan.
- Hover dan transisi singkat memberi umpan balik pada tautan, tombol, kartu, filter, dan panel yang dapat dibuka.
- Hormati preferensi `prefers-reduced-motion`; animasi non-esensial perlu dinonaktifkan atau dikurangi.
- Pertahankan indikator fokus keyboard, label aksesibel, dan status ARIA pada kontrol interaktif.

## Prinsip penerapan

1. Pertahankan teal sebagai warna identitas; gunakan mint sebagai permukaan pendukung, bukan sebagai aksen di setiap elemen.
2. Pastikan CTA utama mudah dikenali dan teksnya memiliki kontras yang memadai.
3. Tampilkan tarif, spesifikasi, status, cakupan, dan klaim layanan hanya sesuai sumber data yang tersedia.
4. Gunakan pola kartu untuk informasi yang memang perlu dipindai atau dibandingkan; gunakan teks biasa untuk informasi legal yang belum memiliki tujuan resmi.
5. Pertahankan konsistensi header, footer, navigasi, dan kontak di seluruh halaman.

## Sumber implementasi

- Token warna, tipografi, radius, dan jarak: `js/tailwind-config.js`
- Gaya bersama dan penyesuaian responsif: `css/main.css`
- Gaya khusus katalog: `css/armada.css`
- Struktur halaman: `index.html` dan berkas di `pages/`
- Catatan design system sumber yang dipertahankan: `serene_transit/DESIGN.md` (dokumen sumber; tidak dimuat langsung oleh situs)
