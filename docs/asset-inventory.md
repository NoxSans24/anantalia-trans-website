# Inventaris Aset

| Kelompok | Kondisi | Catatan |
|---|---|---|
| Ekspor halaman | Beranda, Tentang Kami, Layanan, Armada, Pusat Bantuan tersedia di folder ekspor masing-masing | `code.html` dan `screen.png` asli dipertahankan; lima halaman kerja ada di root/`pages/` |
| State ekspor | Modal serta state layanan, armada, dan cabang tersedia | Tidak dipindah atau dihapus dari folder sumber |
| Pusat Bantuan | Sumber `pusat_bantuan_cabang_kami_state_modal_detail_cabang_koordinasi_jemput_anantalia/code.html` ditemukan | Halaman kerja diadaptasi sebagai `pages/pusat-bantuan.html`; modal cabang dapat dibuka dari bagian Cabang Kami |
| Design system | `serene_transit/DESIGN.md` | Catatan token desain dipertahankan, bukan stylesheet langsung |
| CSS lokal | `css/main.css`, `css/armada.css` | CSS bersama dan aturan khusus Armada |
| JavaScript lokal | `js/tailwind-config.js`, `js/site-shell.js`, `js/pusat-bantuan.js` | Konfigurasi Tailwind, shell menu/top, dan modal cabang |
<<<<<<< HEAD
| Katalog Armada | `fleet (1).json`, `pages/armada.html`, `js/armada-detail.js` | Halaman diselaraskan dengan 63 model dummy dan 7 kategori dari data terbaru. Kartu menampilkan nama dan contoh tarif dalam kota; modal memuat rincian dari data tersebut dan tautan `imageSearchUrl`. Berkas sumber dipertahankan tanpa perubahan. |
| Ilustrasi placeholder kendaraan | `assets/placeholder-vehicle.svg` | Fallback kartu Armada jika foto referensi tidak tersedia atau gagal dimuat; bukan foto kendaraan tertentu. |
| Foto referensi armada | Wikimedia Commons, dipasangkan ke model yang sama pada katalog | 20 kartu mempertahankan foto prototipe Commons beserta sumber, kredit, dan lisensi di modal detail. Entri lain memakai placeholder dari data terbaru dan tautan pencarian Google. Foto bukan dokumentasi unit milik ANANTALIA TRANS. |
| Logo resmi `logo.png` | Root; 121.031 byte | Dipakai oleh kelima halaman kerja. Tidak dipindah atau diubah. SHA-256 tercatat: `7554A7C2931DE78EF5BC60364D7D0D8B758EED050D15B497197AA5262E67967E`. Ekspor Stitch tetap memakai referensi aslinya. |
| Font | Manrope dan Material Symbols via Google Fonts | Memerlukan internet |
| Foto/ilustrasi | URL eksternal di HTML sumber | Memerlukan internet; aset sumber tidak disalin |
| Label legal | Syarat & Ketentuan dan Kebijakan Privasi pada setiap halaman kerja | Teks biasa, tanpa tautan mati; URL/isi resmi diperlukan sebelum diaktifkan |

=======
| Logo resmi `logo.png` | Root; 121.031 byte | Dipakai oleh kelima halaman kerja. Tidak dipindah atau diubah. SHA-256 tercatat: `7554A7C2931DE78EF5BC60364D7D0D8B758EED050D15B497197AA5262E67967E`. Ekspor Stitch tetap memakai referensi aslinya. |
| Font | Manrope dan Material Symbols via Google Fonts | Memerlukan internet |
| Foto/ilustrasi | URL eksternal di HTML sumber | Memerlukan internet; aset sumber tidak disalin |
| Label legal | Syarat & Ketentuan dan Kebijakan Privasi pada setiap halaman kerja | Teks biasa, tanpa tautan mati; URL/isi resmi diperlukan sebelum diaktifkan |

>>>>>>> origin/main
