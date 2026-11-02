# Anantalia Trans Admin Panel — Complete Screen Specification

## Shared route map (proposal)
- `/admin/dashboard`
- `/admin/armada`
- `/admin/pemesanan`
- `/admin/pelanggan`
- `/admin/keuangan`
- `/admin/tarif`
- `/admin/konten`
- `/admin/pesan`
- `/admin/analytics`
- `/admin/pengaturan`

Routes are design proposals; align them with the implementation's actual routing before development.

## Shared shell
All screens use the same sidebar and topbar. Sidebar menu:
- MENU UTAMA: Dashboard, Manajemen Armada, Pemesanan, Pelanggan, Keuangan, Harga & Tarif.
- MANAJEMEN WEBSITE: Konten Website, Pesan Masuk, Analytics.
- PREFERENSI: Pengaturan.

Topbar: sidebar toggle, search, notifications, messages, profile menu.
Logo: official logo slot; asset is not included in this kit.

## 1. Dashboard Overview
**Goal:** quick operational overview.
- KPI: Total Armada, Total Pemesanan, Armada Tersedia, Total Pelanggan.
- Wide line chart: Statistik Pemesanan; series Pemesanan and Pendapatan; period Hari/Minggu/Bulan.
- Narrow weekly bar chart: Aktivitas Pemesanan; series Pemesanan and Selesai.
- Lower panels: Pemesanan Terbaru and Status Armada.
- Preserve TailAdmin reference composition and density.
- No fabricated figures; use `—` or labeled demo data.

## 2. Manajemen Armada
**Goal:** manage vehicle catalog and availability.
- Heading and primary action Tambah Armada.
- Optional compact KPI: Total Unit, Tersedia, Disewa, Maintenance.
- Table columns: Foto/Unit, Nama Armada, Kategori, Tarif Dalam Kota, Tarif Luar Kota, Status, Aksi.
- Search, category filter, status filter, pagination.
- Row actions: Detail, Edit, Hapus with confirmation.
- Add/edit form: Nama Armada, Kategori, Deskripsi singkat, Poin penting, Status, Foto, Tarif references.
- Detail drawer/page: image, verified vehicle details, tariff summary, current status.
- Unknown models/specifications/tariffs remain placeholders.

## 3. Pemesanan
**Goal:** monitor booking requests and progress.
- KPI: Total Pemesanan, Menunggu, Dikonfirmasi, Selesai, only when data exists.
- Filters: date range, status, vehicle; search ID/customer.
- Table: ID, Pelanggan, Armada, Tanggal, Periode, Total, Status, Aksi.
- Detail: booking summary, customer, vehicle, schedule, price breakdown, payment status, internal notes.
- Status action requires confirmation. Do not assume cancellation/refund rules.

## 4. Pelanggan
**Goal:** manage customer records.
- Search, filters, pagination.
- Table: Nama, Kontak, Jumlah Pemesanan, Pemesanan Terakhir, Aksi.
- Detail drawer/page: profile summary, contact details, booking history.
- Use fictional sample data only; avoid real personal data.

## 5. Keuangan
**Goal:** review financial activity.
- KPI: Pendapatan periode ini, Transaksi, Menunggu pembayaran, Selesai dibayar.
- Revenue chart with date range.
- Transaction table: ID Transaksi, ID Pemesanan, Tanggal, Metode, Jumlah, Status.
- Filters and export prototype.
- Use placeholders or labeled demo data; do not infer profit without cost data.

## 6. Harga & Tarif
**Goal:** manage Dalam Kota and Luar Kota prices.
- Two tabs/sections: Dalam Kota, Luar Kota.
- Table grouped by vehicle: Armada, Tarif, Satuan/ketentuan (only if verified), Terakhir diperbarui, Aksi.
- Add/edit tariff side panel or modal.
- Unknown values show “Belum diatur” or “—”.
- Demo pricing must be labeled “Data contoh — perlu verifikasi”.

## 7. Konten Website
**Goal:** manage public-site content.
- Tabs/filters: Beranda, Tentang Kami, Layanan, Armada, Pusat Bantuan.
- Content section list: Judul, Halaman, Terakhir diperbarui, Status, Aksi.
- Editor with content fields and preview.
- Do not invent company claims, testimonials, awards, certifications, addresses, phone numbers, or legal statements.
- Preserve public website visual identity.

## 8. Pesan Masuk
**Goal:** review visitor inquiries.
- Desktop two-pane inbox: message list left, selected message detail right.
- Filters: Semua, Belum dibaca, Sudah dibaca; search.
- List item: sender, subject/preview, date, read state.
- Detail: message content, timestamp, known contact channel.
- Mark read/unread; archive only if appropriate.
- Reply/contact action is a prototype unless integration exists.
- Fictional messages only.

## 9. Analytics
**Goal:** review public website traffic.
- KPI: Pengunjung, Tampilan Halaman, Sesi, Durasi Rata-rata.
- Traffic trend chart.
- Panels: Halaman Terpopuler, Sumber Trafik, Perangkat.
- Date filter and export prototype.
- Clearly label values “Data contoh” until analytics is connected.

## 10. Pengaturan
**Goal:** manage admin preferences.
- Settings categories: Profil Admin, Akun & Keamanan, Notifikasi, Tampilan, Preferensi Sistem.
- Profile: display name, email placeholder, avatar.
- Security: masked password-change form; never expose credentials.
- Notification toggles.
- Appearance preferences only for supported themes.
- Save/cancel with feedback.
- Do not invent advanced system configuration.

## Global states
For all relevant screens include:
- Loading skeleton.
- Empty state with helpful next action.
- Error state with retry.
- Success feedback.
- Hover/focus/pressed/disabled.
- Confirmation for destructive or status-changing actions.

## Prototype interactions
- Sidebar navigation links all 10 pages.
- Fleet add/edit/detail/delete-confirmation.
- Booking detail and status confirmation.
- Customer detail and booking history.
- Tariff tabs and edit form.
- Website content section selection and editor preview.
- Inbox select and mark read/unread.
- Analytics date filter.
- Settings category navigation and save feedback.
- Topbar search, notifications and profile popover.
All visible controls must work in prototype or be clearly marked as not connected.

## Responsive behavior
- Desktop: full sidebar, four KPI columns, two-column charts, lower panels.
- Tablet: collapsible sidebar, two KPI columns, charts stack when cramped.
- Mobile: sidebar drawer, compact topbar, stacked charts/forms/panels, responsive table/list.

## Validation checklist
- [ ] All 10 pages designed.
- [ ] Sidebar and topbar consistent across pages.
- [ ] Dashboard composition remains close to TailAdmin reference.
- [ ] Anantalia palette and Manrope used consistently.
- [ ] No TailAdmin brand assets or text remain.
- [ ] Official logo slot is replaceable and not fabricated.
- [ ] Unknown business facts are placeholders.
- [ ] Demo data clearly labeled.
- [ ] Empty/loading/error/success states included.
- [ ] Desktop, tablet, and mobile considered.
- [ ] Prototype navigation connects all pages.
