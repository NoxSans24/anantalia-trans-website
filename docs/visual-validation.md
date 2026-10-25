# Validasi Visual dan Browser

## Lingkungan dan batas

Browser: Google Chrome 155 melalui Playwright bawaan runtime, tanpa dependensi proyek. Halaman dibuka dari URL `file:///` yang dibentuk dari path workspace aktif. Viewport yang diminta: desktop 1440 × 900 dan mobile 390 × 844.

Tailwind CSS CDN gagal dimuat pada pemeriksaan lokal dan skrip mencatat `tailwind is not defined`. Oleh sebab itu tes di bawah yang memeriksa status DOM/handler bukan bukti kesesuaian visual. Tidak ada klaim screenshot/layout/responsivitas lulus dari sesi ini dan screenshot tanpa stylesheet tidak disimpan.

## Pemeriksaan pascaintegrasi terbaru

- Kelima halaman mempunyai judul, dua gambar logo lokal yang berhasil dimuat, satu tombol kembali ke atas, dan shell navigasi.
- Pada viewport desktop 1440 × 900 dan mobile 390 × 844, scroll memunculkan tombol kembali ke atas di semua lima halaman; klik mengembalikan `scrollY` ke 0.
- Kelima tautan navigasi desktop diuji dengan klik di Chrome dan masing-masing membuka berkas lokal serta judul halaman yang sesuai.
- Pada Pusat Bantuan, menu mobile menghasilkan lima tautan navigasi, status ARIA kembali tertutup setelah Escape, terdapat lima pemicu FAQ, dan FAQ kedua dapat dibuka.
- Dialog cabang berubah menjadi terbuka saat dipicu, Escape mengubah status menjadi tertutup, dan fokus kembali ke tombol pemicu.
- Menu diuji pada viewport 390 × 844. Karena CSS Tailwind tidak aktif, pemeriksaan ini hanya mengonfirmasi perubahan DOM/status handler, bukan tampilan atau tap target.
- Chrome mencatat error `tailwind is not defined` akibat CDN; tidak ada klaim visual final.

## Interaksi halaman lain yang telah dicoba

Run sebelumnya pada empat halaman kerja yang tersedia saat itu memeriksa navigasi antarhalaman, CTA Beranda ke Tentang Kami, menu mobile/Escape, filter Layanan (Rental Mobil satu kartu; Semua empat), pencarian Armada `Avanza` (satu hasil), Reset (enam unit), dan buka/tutup detail Armada. Run tersebut mendahului integrasi halaman Pusat Bantuan; tombol kembali ke atas kemudian diuji ulang pada kelima halaman di atas.

## Audit tautan (sebelumnya placeholder)

Validator sebelumnya menemukan 16 `href="#"` pada empat halaman awal: masing-masing memiliki tautan header Bantuan, footer Bantuan, Syarat & Ketentuan, dan Kebijakan Privasi. Delapan navigasi Bantuan kini memiliki tujuan lokal; delapan tautan legal awal dan dua label legal dari halaman kelima tidak punya tujuan resmi. Untuk menghilangkan aksi mati tanpa mengarang URL atau isi, semua label legal sekarang teks biasa tanpa `href`; jumlah `href="#"` saat ini nol.

| Halaman | Tautan header/footer Bantuan | Status label legal |
|---|---|---|
| Beranda (`index.html`) | Header dan footer menuju Pusat Bantuan lokal | Syarat & Ketentuan dan Kebijakan Privasi berupa teks biasa (URL resmi belum tersedia) |
| Tentang Kami (`pages/tentang-kami.html`) | Header dan footer menuju Pusat Bantuan lokal | Syarat & Ketentuan dan Kebijakan Privasi berupa teks biasa (URL resmi belum tersedia) |
| Layanan (`pages/layanan.html`) | Header dan footer menuju Pusat Bantuan lokal | Syarat & Ketentuan dan Kebijakan Privasi berupa teks biasa (URL resmi belum tersedia) |
| Armada (`pages/armada.html`) | Header dan footer menuju Pusat Bantuan lokal | Syarat & Ketentuan dan Kebijakan Privasi berupa teks biasa (URL resmi belum tersedia) |
| Pusat Bantuan (`pages/pusat-bantuan.html`) | Header dan footer berada di halaman Pusat Bantuan | Syarat & Ketentuan dan Kebijakan Privasi berupa teks biasa (URL resmi belum tersedia) |
## Belum diverifikasi

- Kesetaraan visual dengan `screen.png`, screenshot representatif, layout final, overflow mobile, serta pemuatan font/gambar eksternal.
- Perilaku visual modal dan menu saat CSS utility aktif.
- Validasi formal HTML/CSS, performa, dan aksesibilitas formal.




