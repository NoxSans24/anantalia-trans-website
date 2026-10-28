# Validasi Visual dan Browser

<<<<<<< HEAD
## Perubahan katalog Armada

Katalog Armada diselaraskan dengan 63 model dummy dan 7 kategori dalam `fleet (1).json` terbaru. Nama, kategori, tarif, deskripsi, spesifikasi, fasilitas, dan status ditampilkan dari snapshot data tersebut; 20 foto referensi Commons yang sudah dipasangkan ke model sama tetap dipertahankan, sementara entri lain mengikuti placeholder dari sumber. Tautan `imageSearchUrl` tetap tersedia pada detail. File JSON tidak diubah. Perubahan ini belum diuji ulang di browser; uraian pemeriksaan browser di bawah hanya berlaku untuk run terdahulu yang dijelaskan pada waktunya.

=======
>>>>>>> origin/main
## Lingkungan dan batas

Browser: Google Chrome 155 melalui Playwright bawaan runtime, tanpa dependensi proyek. Halaman dibuka dari URL `file:///` yang dibentuk dari path workspace aktif. Viewport yang diminta: desktop 1440 × 900 dan mobile 390 × 844.

Tailwind CSS CDN gagal dimuat pada pemeriksaan lokal dan skrip mencatat `tailwind is not defined`. Oleh sebab itu tes di bawah yang memeriksa status DOM/handler bukan bukti kesesuaian visual. Tidak ada klaim screenshot/layout/responsivitas lulus dari sesi ini dan screenshot tanpa stylesheet tidak disimpan.

## Pemeriksaan pascaintegrasi terbaru

- Kelima halaman mempunyai judul, dua gambar logo lokal yang berhasil dimuat, satu tombol kembali ke atas, dan shell navigasi.
<<<<<<< HEAD
- Pada viewport desktop 1440 × 900 dan mobile 390 × 844, scroll memunculkan tombol kembali ke atas di semua lima halaman; klik mengembalikan `scrollY` ke 0.
=======
- Pada viewport desktop 1440 × 900 dan mobile 390 × 844, scroll memunculkan tombol kembali ke atas di semua lima halaman; klik mengembalikan `scrollY` ke 0.
>>>>>>> origin/main
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
<<<<<<< HEAD
- Validasi formal HTML/CSS, performa, dan aksesibilitas formal.

## Revisi UI setelah audit, 28 Oktober 2026

- Kontras permukaan CTA WhatsApp, indikator fokus tombol kembali ke atas, affordance avatar header, dan scrollbar WebKit diperbarui pada CSS lokal.
- Filter wilayah dan pencarian Pusat Bantuan sekarang memakai kriteria gabungan, menyaring daftar lokasi, dan menampilkan status saat peta tidak memiliki hasil.
- Header mobile kini memiliki aturan layout lokal untuk logo, label merek, CTA WhatsApp, tombol menu, dan panel navigasi. `js/site-shell.js` juga menemukan navigasi desktop Pusat Bantuan yang sebelumnya tidak memiliki atribut `data-site-navigation`.
- Modal detail lokasi kini menempatkan informasi di samping peta Google Maps pada layar lebar dan menumpuknya pada ponsel. Peta memakai pencarian nama kota/provinsi; alamat atau titik pool spesifik tidak dibuat. Perubahan modal belum diuji browser.
- Revisi tersebut belum diuji melalui browser setelah perubahan. Pengujian visual dan interaksi pada Chrome desktop/mobile masih menunggu pemeriksaan pengguna.
- Tailwind tetap dimuat dari CDN. Workspace ini tidak memiliki output CSS lokal yang dapat menggantikannya tanpa menambahkan proses/dependensi baru; ketergantungan layout pada koneksi eksternal masih menjadi batas.

## Pembaruan peta cakupan, 28 Oktober 2026

- Siluet pada referensi gambar yang dikirim pengguna kini menjadi aset SVG lokal berwarna Sage `#A3B8A1` dengan garis Teal `#079F9A`. Gambar putih dan watermark tidak dimasukkan ke halaman. Proyeksi pin dipetakan ke bentang siluet; ukuran pin diperkecil dan pulse pada pin utama dihilangkan agar kawasan padat tetap terbaca.
- Tombol zoom memperbesar/memperkecil peta dari 100% sampai 250%, menyediakan reset, status zoom untuk pembaca layar, dan geser peta saat diperbesar. Pin serta siluet berada pada satu lapisan sehingga ikut bergerak dan membesar bersama.
- Posisi 22 pin dihitung dari koordinat kota/area perkiraan di atas proyeksi peta yang sama. Pin menunjukkan area kota layanan, bukan alamat pool atau titik penjemputan yang terverifikasi; pin Jakarta Timur tetap ditandai sebagai pool pusat sesuai data halaman.
- Aset peta mempertahankan bentuk ilustratif pada referensi, bukan dataset geospasial resmi, batas administratif, atau peta navigasi. Posisi pin tetap perkiraan area kota, bukan koordinat pool yang terverifikasi.
- Perubahan peta belum diperiksa di Chrome secara visual. Tidak ada klaim hasil uji tampilan desktop atau mobile untuk perubahan ini.




=======
- Validasi formal HTML/CSS, performa, dan aksesibilitas formal.




>>>>>>> origin/main
