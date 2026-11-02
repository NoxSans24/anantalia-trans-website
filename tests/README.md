# Pemeriksaan Proyek

## Perintah

Dari root proyek jalankan:

```powershell
npm ci
npm run build:css
npm run test:stabilization
powershell -NoProfile -ExecutionPolicy Bypass -File tests/validate.ps1
```

`test:stabilization` memeriksa JSON dan 63 ID unik, tidak ada kartu armada duplikat di HTML, satu stylesheet Material Symbols per halaman, stylesheet Tailwind lokal tanpa CDN, cakupan class terhadap CSS terkompilasi, state hover/focus, dan breakpoint 640/768/1024px.

`tests/validate.ps1` memeriksa lima halaman, judul, navigasi dan tombol top, logo serta path lokal, target fragmen, ID duplikat, CSS seimbang, dan sintaks JavaScript inline/file yang dicakup.

Kedua perintah merupakan tes otomatis; keduanya tidak menggantikan uji browser. Interaksi, viewport desktop/mobile, temuan bisnis, dan batas run terakhir dicatat di `docs/stabilization-report.md` serta `docs/visual-validation.md`.
