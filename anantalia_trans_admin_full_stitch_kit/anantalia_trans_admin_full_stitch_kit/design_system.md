# Anantalia Trans Admin Panel — Design System

## Purpose and evidence
This system adapts the user's Anantalia Trans website design tokens and the supplied TailAdmin dashboard screenshot. Screenshot-derived proportions are estimates, not measured source CSS. The uploaded `AI_UI_STYLE_CLONER_STITCH(4).md` is treated as the workflow and quality checklist.

## Brand principles
- Professional, calm, operational, compact SaaS admin interface.
- Teal/mint identity; dark sidebar; white surfaces.
- Information density close to the supplied TailAdmin dashboard.
- Reuse shared shell and components across all admin pages.
- Do not copy TailAdmin branding/assets.
- No invented business facts or real-looking unverified operational data.

## Color tokens

| Token | Value | Usage |
|---|---|---|
| Primary | `#006764` | Active navigation, primary buttons, main chart |
| Secondary | `#00827E` | Secondary chart series, accents |
| Text primary | `#02201F` | Headings, body emphasis, sidebar background |
| Text secondary | `#526765` | Secondary text and metadata |
| Background | `#F7F8F6` | Main page background |
| Surface mint | `#EAF6F4` | Icon wells, soft highlights |
| Surface | `#FFFFFF` | Cards, topbar, dialogs |
| Border | `#DCE5E2` | Dividers and card borders |
| WhatsApp | `#0D7837` | WhatsApp-specific action only |

Status colors are not specified in the supplied website design context. Treat status palette as provisional, keep contrast accessible, and always pair color with a text label.

## Typography
- Font: Manrope.
- Page title: 24–28 px, 700.
- Section/card title: 16–18 px, 600–700.
- KPI value: 26–32 px, 700.
- Body: 14–16 px.
- Labels/metadata: 12–13 px.
- Avoid excessive title height that pushes the content down.

## Layout
### Desktop
- Sidebar: 240–260 px target on wide screens; visual weight close to one-fifth of the reference viewport.
- Topbar: 60–64 px.
- Main content padding: 24 px (up to 28 px on wide viewports).
- KPI grid: 4 equal columns, 16–20 px gap.
- Dashboard analytics: wide-left/narrow-right ratio about 2.1:1.
- Lower content: two panels or table/detail composition as appropriate.
- Keep vertical gaps compact, matching the reference density.

### Tablet
- Sidebar collapsible.
- KPI grid two columns.
- Charts stack if two columns become cramped.
- Tables use responsive columns or controlled horizontal scrolling.

### Mobile
- Sidebar becomes drawer.
- Compact topbar.
- KPI cards two columns where possible, one on narrow screens.
- Charts and lower panels stack.
- Forms single-column.
- Detail drawers become full-screen panels.

## Spacing and shape
- Spacing scale: 4, 8, 12, 16, 20, 24, 32 px.
- Cards: 12–16 px radius.
- Inputs/buttons: 8–10 px radius.
- Borders: 1 px `#DCE5E2`.
- Shadows: subtle, low contrast.
- No neon glow, heavy shadow, glassmorphism, or decorative gradient.

## Iconography
- Lucide icons, consistent size and stroke.
- Navigation icons around 18–20 px.
- KPI icons around 18–22 px.
- Pair icons with labels; do not rely on icons alone.

## Shared shell
### Sidebar groups
MENU UTAMA: Dashboard, Manajemen Armada, Pemesanan, Pelanggan, Keuangan, Harga & Tarif.
MANAJEMEN WEBSITE: Konten Website, Pesan Masuk, Analytics.
PREFERENSI: Pengaturan.

- Background `#02201F`.
- Active item `#006764`.
- White/off-white labels.
- Desaturated mint group labels.
- Official logo must be supplied separately; use a replaceable placeholder until then.

### Topbar
- White background, bottom border.
- Sidebar toggle and search left.
- Notification, message, profile controls right.
- Use generic “Admin” identity until real admin profile data exists.

## Shared components
- Buttons: primary, secondary, ghost, destructive, disabled.
- Fields: input, select, textarea, date range, upload placeholder.
- Navigation: sidebar item, submenu, tabs, mobile drawer.
- Data: KPI card, chart card, table, pagination, status badge.
- Overlays: dropdown, popover, modal, confirmation, detail drawer.
- Feedback: toast, empty, loading, error, success.
- All components need hover/focus/pressed/disabled states.

## Data and content rules
- Do not fabricate fleet records, tariffs, booking information, customer personal details, contact data, revenue, analytics, testimonials, certifications, addresses, or phone numbers.
- Use placeholders or clearly labeled fictional demo data.
- No false claim of backend connection or persistence.
- WhatsApp green is reserved for WhatsApp-specific actions.

## Accessibility
- Adequate contrast.
- Visible keyboard focus.
- Semantic table headings and form labels.
- Status always includes text, not color only.
- Keyboard-operable navigation and dialogs.
- Respect reduced-motion preferences.
