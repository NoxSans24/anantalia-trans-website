# Google Stitch — Anantalia Trans Admin Panel (Complete UI/UX)

Baca brief ini sampai selesai. Buat **satu sistem Admin Panel lengkap** dengan seluruh halaman yang disebutkan, bukan hanya Dashboard Overview. Gunakan screenshot TailAdmin yang dilampirkan pengguna sebagai referensi utama untuk komposisi visual dashboard dan pola admin template. Adaptasikan identitas ke Anantalia Trans. Jangan gunakan logo, nama, avatar, atau konten TailAdmin.

## 1. Product
- Product: Anantalia Trans Admin Panel
- Platform: responsive web application, desktop-first
- UI language: Bahasa Indonesia
- Main users: administrator dan staf operasional yang memiliki izin
- Purpose: mengelola armada, pemesanan, pelanggan, tarif, konten website, pesan masuk, analytics, dan pengaturan.
- This is a private admin interface, separate from the five public website pages.
- Public website pages remain: Beranda, Tentang Kami, Layanan, Armada, Pusat Bantuan.
- Do not redesign the public website in this task.

## 2. Required screens — design ALL of them
Create a complete connected set of high-fidelity screens and a navigable prototype where supported. Every page must use the same sidebar, topbar, typography, color tokens, spacing, component rules, and responsive behavior.

1. **Dashboard Overview** — KPI cards, booking/revenue chart, weekly booking activity, recent bookings, fleet status.
2. **Manajemen Armada** — fleet table/list, search, filters, status, add/edit vehicle forms, vehicle detail view, image placeholder/upload area, city/out-of-city tariff summary if available.
3. **Pemesanan** — booking list, filters by date/status, booking detail, customer and vehicle summary, booking status actions, payment status. Do not invent workflow rules; label uncertain actions as prototype examples.
4. **Pelanggan** — customer list, search/filter, customer detail drawer/page, contact and booking history. Use fictional sample data only.
5. **Keuangan** — revenue summary, transaction list, payment status, date filters, revenue chart, export action placeholder. Never invent real financial figures; use clearly labeled demo data or placeholders.
6. **Harga & Tarif** — pricing management for Dalam Kota and Luar Kota, tariff table by vehicle, edit tariff interaction, effective-date/notes fields only if needed. Start with placeholder/demo values and mark them as examples pending verified business data.
7. **Konten Website** — manage public-site content sections for Beranda, Tentang Kami, Layanan, Armada, and Pusat Bantuan. Provide list/editor preview patterns. Do not fabricate company claims, testimonials, certifications, addresses, or phone numbers.
8. **Pesan Masuk** — inbox list, unread/read state, message detail, search/filter, reply/contact action. Do not invent a real email or WhatsApp integration.
9. **Analytics** — visitor and page-performance overview, top pages, traffic trend, device/source breakdown only as demo placeholders until connected to analytics data. Clearly label demo data.
10. **Pengaturan** — admin profile, account/security settings, notification preferences, appearance preferences, and system settings sections. Do not expose or request passwords, API keys, or secrets in the design.

Also create reusable UI states and component examples:
- Empty state, loading skeleton, error state, success feedback, confirmation dialog, destructive confirmation, filter popover, profile dropdown, notification popover, sidebar collapsed state, mobile navigation drawer.
- Include add/edit form states for Fleet and Tariff; booking detail/status state; customer detail state; content editor state; message detail state.

## 3. Visual reference and layout fidelity
The TailAdmin screenshot is a **layout and density reference**, not a brand asset source. Match its overall visual grammar closely:
- Fixed dark vertical sidebar on the left.
- White horizontal topbar above the content.
- Compact content heading.
- Four equal KPI cards across the top on desktop.
- Main analytics row with a wide chart card on the left and narrower chart card on the right (approximately 2:1 ratio).
- Additional content panels/tables below.
- White cards, fine borders, subtle shadows, modest corner radii, small outlined icons in soft circular backgrounds.
- Keep information density similar to the screenshot. Avoid oversized cards, excessive whitespace, giant hero headers, decorative gradients, glassmorphism, or a radically different layout.
- Dashboard should feel visually close to the supplied reference while using Anantalia's colors, content, and brand assets.
- For non-dashboard pages, retain the same admin shell and compact content density; choose tables/forms/detail panels appropriate to each task.

## 4. Brand and design tokens
Use these tokens from the Anantalia Trans website design system:
- Primary teal: `#006764`
- Secondary teal: `#00827E`
- Dark text / sidebar: `#02201F`
- Secondary text: `#526765`
- Page background: `#F7F8F6`
- Soft mint surface: `#EAF6F4`
- White surface: `#FFFFFF`
- Border: `#DCE5E2`
- WhatsApp green: `#0D7837` — reserve for WhatsApp-specific actions only.
- Typography: Manrope.
- Icon family: Lucide, consistent stroke weight.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32 px.
- Card radius: 12–16 px.
- Control radius: 8–10 px.
- Border: 1 px subtle.
- Shadows: soft, low contrast.
Do not introduce blue-purple gradients from the TailAdmin screenshot. Do not use WhatsApp green as a general accent.

## 5. Shared admin shell

### Sidebar
Use this exact navigation and order:
**MENU UTAMA**
- Dashboard
- Manajemen Armada
- Pemesanan
- Pelanggan
- Keuangan
- Harga & Tarif

**MANAJEMEN WEBSITE**
- Konten Website
- Pesan Masuk
- Analytics

**PREFERENSI**
- Pengaturan

Sidebar requirements:
- Dark background `#02201F`.
- Official Anantalia Trans logo at top, preserving its original design and aspect ratio.
- If official logo asset is not attached, use a neutral temporary icon/wordmark placeholder and mark it as replaceable. Do not fabricate or redraw the official logo.
- Active item background `#006764`.
- White/off-white labels, desaturated mint group labels.
- Lucide icons, consistent size and alignment.
- Desktop sidebar around 240–260 px on wide desktop; match the screenshot's relative visual weight (roughly one-fifth of viewport).
- Collapsible on desktop/tablet and a drawer on mobile.
- Place account/logout area near the bottom only if appropriate.

### Topbar
- White, approximately 60–64 px high.
- Sidebar toggle on the left.
- Search input with placeholder “Cari menu atau data...”.
- Right side: notifications, messages, admin avatar/initials, profile dropdown.
- Use fictional neutral admin identity such as “Admin”, not the person in the screenshot.
- Search, notification, message and profile controls must have real prototype interactions or clearly disabled states.

### Main content
- Page background `#F7F8F6`.
- Compact page title and short description.
- Consistent content padding around 24 px desktop.
- Reuse page header, card, table, badge, filter, form, modal, empty state and pagination components.

## 6. Screen specifications

### Screen 1 — Dashboard Overview
Purpose: quickly understand operational status.
- Heading: “Dashboard”; subtitle “Ringkasan operasional Anantalia Trans”.
- Four KPI cards: Total Armada, Total Pemesanan, Armada Tersedia, Total Pelanggan.
- Each card: icon well, large value, concise label, optional period delta only when valid source data exists.
- Wide chart: “Statistik Pemesanan”, line chart with Pemesanan and Pendapatan series, period filters Hari/Minggu/Bulan.
- Narrow chart: “Aktivitas Pemesanan”, weekly bars for Pemesanan and Selesai.
- Lower row: “Pemesanan Terbaru” table and “Status Armada” summary (Tersedia, Sedang disewa, Maintenance).
- Preserve the screenshot's compact TailAdmin-like composition.

### Screen 2 — Manajemen Armada
Purpose: maintain the vehicle catalog and operational availability.
- Page title “Manajemen Armada”; short subtitle.
- Primary action “Tambah Armada”.
- KPI strip optional: Total Unit, Tersedia, Disewa, Maintenance.
- Main table columns: Foto/Unit, Nama Armada, Kategori, Tarif Dalam Kota, Tarif Luar Kota, Status, Aksi.
- Search by vehicle name; filters by category and status.
- Row actions: Detail, Edit; delete only through confirmation dialog.
- Add/edit form fields: Nama Armada, Kategori, Deskripsi singkat, poin penting, status, image upload placeholder, tariff references.
- Vehicle detail drawer/page: image, vehicle facts, tariff summary, current status.
- Do not invent actual vehicle models, specifications, or tariffs. Use neutral placeholders or explicitly marked sample records.

### Screen 3 — Pemesanan
Purpose: monitor booking requests and their progress.
- Page title “Pemesanan”; primary action only if a valid admin-created booking workflow is required.
- KPI strip: Total Pemesanan, Menunggu, Dikonfirmasi, Selesai (only if data exists).
- Table columns: ID, Pelanggan, Armada, Tanggal, Durasi/Periode, Total, Status, Aksi.
- Filters: date range, status, vehicle; search by ID/customer.
- Detail drawer/page: booking summary, customer, selected vehicle, schedule, price breakdown, payment status, internal notes.
- Status actions with confirmation and clear feedback. Avoid assuming cancellation/refund rules not supplied by the business.

### Screen 4 — Pelanggan
Purpose: manage customer records.
- Page title “Pelanggan”.
- Search and filters.
- Table columns: Nama, Kontak, Jumlah Pemesanan, Pemesanan Terakhir, Aksi.
- Customer detail: profile summary, contact fields, booking history.
- Use fictional names and masked/example contact details only. Do not display real personal data.

### Screen 5 — Keuangan
Purpose: review financial activity.
- Page title “Keuangan”.
- KPI cards: Pendapatan periode ini, Transaksi, Menunggu pembayaran, Selesai dibayar; values must be placeholders or explicitly demo.
- Revenue line/bar chart with period selector.
- Transaction table: ID Transaksi, ID Pemesanan, Tanggal, Metode, Jumlah, Status.
- Date/status filters and export control (prototype only unless implemented).
- Do not infer profit or financial performance from revenue without cost data.

### Screen 6 — Harga & Tarif
Purpose: manage price rules for city and out-of-city service.
- Page title “Harga & Tarif”.
- Two clear sections/tabs: “Dalam Kota” and “Luar Kota”.
- Table grouped by vehicle: Armada, Tarif, Satuan/ketentuan (only when supplied), Terakhir diperbarui, Aksi.
- Add/edit tariff modal or side panel.
- Keep unknown values as “Belum diatur” or “—”.
- Mark any demonstration pricing as “Data contoh — perlu verifikasi”.
- Do not invent pricing, inclusions, surcharges, or terms.

### Screen 7 — Konten Website
Purpose: maintain public website content without changing its visual identity.
- Page title “Konten Website”.
- Tabs/filters for Beranda, Tentang Kami, Layanan, Armada, Pusat Bantuan.
- Content section list with title, page, last updated, publication state, action.
- Editor view with fields appropriate to content type and preview panel.
- Preserve public site brand system. Do not create unsupported company claims, testimonials, awards, certifications, addresses, phone numbers, or legal statements.
- Use draft/published badges only if publication workflow is intended.

### Screen 8 — Pesan Masuk
Purpose: view visitor inquiries.
- Page title “Pesan Masuk”.
- Inbox layout: compact message list on left, message detail on right at desktop.
- Filters: Semua, Belum dibaca, Sudah dibaca; search.
- Message row: sender name, subject/short preview, date, read state.
- Detail: message content, timestamp, contact channel if known.
- Actions: mark read/unread, archive only if appropriate, contact/reply button only as a non-functional prototype unless integration exists.
- Use fictional example messages; no invented real integration.

### Screen 9 — Analytics
Purpose: understand public website traffic and engagement.
- Page title “Analytics”.
- KPI cards: Pengunjung, Tampilan Halaman, Sesi, Durasi Rata-rata (only as placeholder/demo).
- Main traffic trend chart.
- Supporting panels: Halaman Terpopuler, Sumber Trafik, Perangkat.
- Period filter and export placeholder.
- Explicitly label prototype values “Data contoh”; do not imply analytics provider is connected.

### Screen 10 — Pengaturan
Purpose: configure admin account and interface.
- Page title “Pengaturan”.
- Left settings navigation or tabs: Profil Admin, Akun & Keamanan, Notifikasi, Tampilan, Preferensi Sistem.
- Profile form: display name, email (placeholder), profile image.
- Security screen: password-change form with masked fields only; never request or expose actual credentials in prototype.
- Notification toggles.
- Appearance options: light/dark only if supported by design system.
- Save/cancel actions with feedback.
- Avoid advanced system settings that have not been specified.

## 7. Shared components and states
Create reusable components:
- Sidebar, nav item, submenu, topbar, search, notification popover, profile menu.
- KPI card, chart card, chart legend, period selector.
- Data table, filter bar, pagination, status badge.
- Primary/secondary/destructive buttons.
- Text input, select, date range, textarea, upload placeholder.
- Modal, confirmation dialog, detail drawer.
- Toast/feedback, empty state, loading skeleton, error state.
- Tabs and responsive drawer.

For every relevant screen, include:
- Default state.
- Loading state.
- Empty state.
- Error state.
- Success/confirmation state.
- Disabled/focus/hover states for controls.

## 8. Prototype and interaction flow
Build clickable navigation between all 10 pages from the shared sidebar.
- Dashboard KPI cards link to relevant pages where appropriate.
- Fleet: open detail, add, edit, and delete confirmation.
- Bookings: open detail, change status with confirmation.
- Customers: open detail and booking history.
- Tariffs: switch Dalam Kota/Luar Kota and open edit form.
- Website content: switch page section and open editor preview.
- Inbox: select message, mark read/unread.
- Analytics: change date range.
- Settings: switch categories and save preferences.
- Topbar search, notification and profile controls open corresponding popovers/panels.
All visible controls should work in prototype or be clearly marked as disabled/not connected. Do not imply backend persistence.

## 9. Responsive behavior
Desktop >= 1200 px:
- Full sidebar.
- Four KPI columns.
- Dashboard charts two columns (wide left, narrow right).
- Tables and detail panels use full available width.

Tablet 768–1199 px:
- Collapsible sidebar.
- KPI two columns.
- Chart cards may stack if needed for readability.
- Tables retain usable columns or controlled horizontal scroll.

Mobile < 768 px:
- Sidebar drawer.
- Compact topbar.
- KPI two columns where space permits, one column on very narrow screens.
- Charts stacked.
- Tables become compact cards/list or controlled horizontal scroll.
- Forms use one column and full-width controls.
- Detail panels become full-screen drawers/pages.

## 10. Content integrity and assets
- Use only verified business information supplied by the user/project.
- Never invent phone numbers, branch addresses, vehicle models, prices, testimonials, ratings, certifications, legal details, booking records, customer information, or actual revenue.
- Use `—`, “Belum tersedia”, or clearly labeled “Data contoh” where facts are missing.
- Official logo asset has not been included in this prompt package. Keep a replaceable logo slot and ask the user to attach the official `logo.png` to Stitch. Do not redraw the logo.
- Do not use TailAdmin logo, avatar, exact text, or branded assets.
- This Markdown brief is a prompt/specification for Google Stitch, not a native Stitch project file.

## 11. Deliverables
Create all 10 high-fidelity screens, shared components, and a clickable prototype/navigation flow. Provide desktop and mobile variants at minimum for Dashboard, Armada, Pemesanan, and Pengaturan; other screens must still have responsive behavior.
Keep the layout density and admin-shell composition close to the supplied TailAdmin screenshot. Apply Anantalia Trans colors and Manrope consistently across every screen.
