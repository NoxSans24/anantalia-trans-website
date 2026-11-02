# Kemajuan Implementasi — Phase 1

## Pembaruan 2 November 2026

- Armada dibuka dengan enam model rekomendasi yang mewakili kategori kendaraan berbeda. Tombol **Lihat semua armada** membuka seluruh 63 entri; saat katalog terbuka penuh, tombol dapat mengembalikan tampilan rekomendasi.
- Filter **Kapasitas** dan **Transmisi** ditambahkan dari nilai unik di `fleet.json`; kedua filter dapat digabung dengan kategori dan pencarian, dan ikut dihapus oleh tombol reset.
- Panel filter spesifikasi ditata ulang dengan hierarki judul/kontrol, ikon pendamping, kontrol berukuran sentuh, serta susunan vertikal untuk layar kecil.
- Filter kategori dipindahkan ke dalam panel yang sama dengan kapasitas dan transmisi; pilihan kategori tetap berupa tab dan membungkus pada layar kecil.
- Tombol tampilkan katalog menggulir kembali ke panel filter setelah daftar diperluas atau diringkas, dengan menghormati preferensi pengurangan gerak.
- Pencarian dan filter kategori tetap bekerja pada seluruh katalog. Pilihan enam model adalah susunan tampilan yang diminta, bukan penilaian mutu atau klaim ketersediaan. Data tetap dummy.
- Audit 16 `href="#"` dari empat halaman sebelumnya: 8 tautan Bantuan kini mengarah ke `pages/pusat-bantuan.html`; 8 tautan Syarat & Ketentuan/Kebijakan Privasi menjadi teks biasa karena halaman dan URL resmi belum tersedia. Tidak ada placeholder `href="#"` pada lima halaman saat ini.
- Ekspor Google Stitch Pusat Bantuan tidak ditemukan pada dua root workspace maupun subfoldernya. Halaman kerja yang sudah ada dipertahankan; file ekspor asli diperlukan jika kesesuaian dengan sumber Stitch harus ditinjau.
- Perubahan ini lulus `tests/validate.ps1`; perilaku dan tampilan barunya belum diverifikasi melalui browser pada sesi ini.

## Selesai pada 1 November 2026

- Audit ulang dilakukan pada struktur aktual, lima halaman kerja, CSS, JavaScript, JSON, dan dokumentasi yang tersedia. Berkas yang hanya disebut dokumentasi lama tetapi tidak ada dicatat sebagai tidak tersedia.
- Backup bernama unik dibuat sebelum perubahan di `backups/phase-1-20261101-211126/`; 22 file sumber/dokumentasi disalin tanpa menimpa backup yang sudah ada.
- Semua halaman publik diberi penanda TODO pemilik untuk data yang belum terkonfirmasi. Klaim mengenai legalitas, layanan, jam, cakupan, fasilitas, jaminan, dan angka yang tidak bersumber dinetralkan; informasi penting yang sudah ada tidak dijadikan fakta terverifikasi.
- Tailwind CSS dikompilasi lokal melalui `tailwindcss@3.4.17`; lima halaman tidak lagi memuat CDN/runtime Tailwind. Konfigurasi mencakup HTML dan JavaScript serta forms plugin. Build mencakup utility, state responsif, hover, focus, dan breakpoint yang dipakai.
- Katalog 63 armada dipindahkan sepenuhnya ke `fleet.json`. HTML kartu katalog dihapus dan diganti renderer client-side; filter kategori, pencarian, empty state, reset, gambar/fallback, sumber foto, modal, dan tombol detail dipertahankan.
- Halaman Armada kini dibuka dengan enam pilihan dari kategori kendaraan berbeda. Tombol “Lihat semua mobil” memperluas katalog; pencarian dan filter kategori menampilkan seluruh hasil yang cocok. Pilihan awal adalah susunan tampilan, bukan klaim kualitas atau ketersediaan karena semua entri masih dummy.
- Harga dan data spesifikasi dummy pada 63 record dibandingkan dengan backup dan tidak berubah. 20 metadata foto Wikimedia dari kartu lama dicocokkan ke record yang sama.
- Impor Material Symbols disatukan menjadi satu per halaman.
- README, inventaris aset, arsitektur, kemajuan, validasi visual, dan laporan stabilisasi ditulis ulang sesuai kondisi aktual.
- `desain.md` dan `docs/audit-project-2026-11-01.md` tidak diubah. Tidak ada admin dashboard yang dibuat.

## Hasil pemeriksaan

- `npm run build:css` berhasil; output lokal dibuat di `css/tailwind.generated.css`. Build memberi peringatan database `caniuse-lite` kedaluwarsa, tetapi proses selesai.
- `npm run test:stabilization` lulus: 5 halaman, 63 ID unik, katalog JSON tunggal, tanpa CDN, 696 token class tercakup, media breakpoint serta state hover/focus terdeteksi.
- `tests/validate.ps1` lulus: halaman, navigasi shell, logo/path lokal, target fragmen, ID unik, CSS seimbang, dan sintaks JavaScript inline.
- Pemeriksaan sintaks `node --check` lulus pada `js/armada-detail.js` dan `scripts/serve.js`; JavaScript inline semua halaman turut diperiksa validator. Interaksi katalog, FAQ, filter layanan/peta juga diuji dari browser.
- Browser desktop 1440×900 dan mobile 390×844: kelima halaman memakai stylesheet lokal, Manrope aktif, tanpa overflow horizontal. Header wordmark mobile diuji ulang setelah wrapping diperbaiki.
- Pengujian browser Armada mencocokkan jumlah tujuh kategori (11, 15, 16, 13, 6, 1, 1) dengan JSON; pencarian, status tanpa hasil, reset ke 63 kartu, foto placeholder, dan dialog detail diuji.
- Pengujian browser Layanan: filter kategori menampilkan satu kartu Rental Mobil; dialog detail dan penutupan diuji.
- Pengujian browser Pusat Bantuan: accordion FAQ berpindah state, pencarian peta menyorot Bandung, daftar/pin dapat dipilih, dialog memperlihatkan status perlu konfirmasi.
- Detail browser, batas validasi, dan hasil viewport ada di `docs/visual-validation.md`.

## Masalah yang belum terselesaikan

- Pemilik masih perlu mengonfirmasi nama badan usaha, perizinan, nomor telepon/WhatsApp, alamat, jam layanan, cakupan, daftar layanan, kebijakan, ketentuan, dan data operasional armada. Nomor lama tetap ada sebagai data dari situs sebelumnya dan diberi label belum terverifikasi.
- Tarif, fasilitas, spesifikasi, ketersediaan, dan daftar model tetap contoh dummy, bukan penawaran aktual. Jangan menghapus penanda dummy sebelum data resmi disediakan.
- Font dan beberapa gambar masih eksternal; kualitas muatannya bergantung pada koneksi. Tautan sumber foto/cari gambar bukan bukti kepemilikan armada.
- Label Syarat & Ketentuan dan Kebijakan Privasi belum memiliki URL/konten resmi.
- Build CSS menampilkan peringatan `caniuse-lite` kedaluwarsa; pembaruan database belum dilakukan.
- Tidak ditemukan/diaktifkan validator HTML5, CSS validator eksternal, Lighthouse, atau audit aksesibilitas formal. Tes browser adalah browser in-app; tidak ada klaim uji deployment produksi atau uji jaringan eksternal.

## Rekomendasi tahap berikutnya

1. Minta pemilik mengisi checklist verifikasi konten dan mengganti hanya nilai TODO yang dapat dibuktikan.
2. Publikasikan daftar layanan, wilayah, kontak, kebijakan, dan penawaran resmi setelah bukti/keputusan pemilik tersedia.
3. Jalankan Phase 2: System Planning untuk admin dashboard terpisah: kebutuhan pengguna, peran/otorisasi, entitas/data, workflow armada/pemesanan, audit trail, API, risiko, dan batas integrasi. Jangan membangun dashboard sebelum spesifikasi dan model data disetujui.
4. Setelah sumber bisnis dikonfirmasi, tambahkan validasi HTML/CSS dan uji aksesibilitas/performa produksi.
