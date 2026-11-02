# Validasi Visual dan Browser

## Run Phase 1 — 1 November 2026

Pratinjau dijalankan melalui `scripts/serve.js` di `http://127.0.0.1:4174` untuk browser in-app. Viewport yang diminta adalah desktop 1440×900 dan mobile 390×844. Ukuran area dokumen yang dilaporkan browser lebih kecil karena scrollbar (sekitar 1425 px dan 375 px). Semua lima halaman dibuka pada dua ukuran tersebut.

### Visual

- Kelima halaman memuat `css/tailwind.generated.css`, menggunakan Manrope, dan tidak merujuk Tailwind CDN.
- Tidak ditemukan overflow horizontal pada desktop maupun mobile.
- Screenshot desktop Armada menunjukkan heading, banner data dummy, pencarian, tujuh kategori, grid kartu, dan CTA dalam tata letak yang konsisten dengan identitas teal/sage.
- Screenshot mobile Armada memperlihatkan grid yang menyempit ke satu kolom; menu mobile terbuka dan menampilkan lima tautan. Wordmark yang sebelumnya terpotong diubah menjadi dua baris pada lebar sempit, lalu dicek ulang.
- Screenshot desktop dan mobile Pusat Bantuan serta Layanan ditinjau. Struktur bertumpuk pada layar sempit dan tidak meluap.
- Foto tertentu menggunakan fallback placeholder ketika foto referensi tidak tersedia. Google Fonts dan gambar eksternal masih bergantung jaringan.

### Interaksi

- Armada: 63 kartu dimuat dari JSON. Semua 7 kategori diuji: City Car / EV 11, MPV Standar 15, MPV Keluarga 16, Premium 13, Minibus 6, Bus Medium 1, Bus Besar 1. Jumlah hasil cocok dengan `fleet.json`.
- Armada: pencarian `Toyota All New Innova Zenix` menemukan model tersebut dan varian Hybrid; pencarian tanpa hasil menampilkan empty state; Reset mengembalikan 63 kartu dan membersihkan query.
- Armada: dialog detail model dibuka; judul, 15 baris detail, status data dummy, dan gambar placeholder tersedia; tombol tutup diuji.
- Layanan: filter Rental Mobil menyisakan satu kartu; dialog detail membuka ringkasan, fitur, dan ketentuan; dialog dapat ditutup.
- Pusat Bantuan: accordion pertama ditutup ketika FAQ kedua dibuka. Pencarian `Bandung` menyaring pin. Memilih area membuka panel detail dengan status “Perlu konfirmasi pemilik”.
- Navigasi mobile membuka panel dengan lima tautan dan mengubah `aria-expanded`; navigasi lokal/path dan target fragmen diperiksa `tests/validate.ps1`.
- Log console halaman Armada setelah pengujian katalog tidak mengandung pesan.

### Batas dan cakupan

Pemeriksaan ini adalah pengujian halaman lokal di browser, bukan deployment produksi. Pengujian tidak memvalidasi layanan WhatsApp/email, ketersediaan URL gambar eksternal, kepemilikan nomor, data bisnis, atau perilaku pada semua browser/perangkat. Tidak dilakukan pembandingan pixel dengan ekspor desain. Validator HTML5/CSS eksternal, Lighthouse, uji performa, dan audit aksesibilitas formal belum dijalankan. Lulus build dan validator statis sendiri tidak dianggap sebagai bukti visual; hasil interaksi dan tampilan browser di atas dicatat terpisah.
