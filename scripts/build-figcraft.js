/**
 * FIGCRAFT PROJECT BUILDER FOR ANANTALIA TRANS ANDROID APPLICATION
 * Generates official FigCraft document.json, manifest.json, design tokens,
 * 28 mobile app screens, reusable components, and bundles into anantalia_trans.figcraft archive.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.resolve(__dirname, '../figcraft_bundle');
const ARCHIVE_FILE = path.resolve(__dirname, '../anantalia_trans.figcraft');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Color Converter Helper
function hexToColor(hex, alpha = 1.0) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r: Number(r.toFixed(3)), g: Number(g.toFixed(3)), b: Number(b.toFixed(3)), a: alpha };
}

const COLORS = {
  primary: hexToColor('#006764'),
  secondary: hexToColor('#00827E'),
  dark: hexToColor('#02201F'),
  canvas: hexToColor('#F7F8F6'),
  mint: hexToColor('#EAF6F4'),
  white: hexToColor('#FFFFFF'),
  border: hexToColor('#DCE5E2'),
  text: hexToColor('#183331'),
  textSecondary: hexToColor('#526765'),
  textMuted: hexToColor('#849997'),
  success: hexToColor('#15803D'),
  warning: hexToColor('#D97706'),
  warningBg: hexToColor('#FEF3C7'),
  error: hexToColor('#DC2626'),
  errorBg: hexToColor('#FEE2E2'),
  whatsapp: hexToColor('#0D7837')
};

let idCounter = 1;
function genId() {
  return `node_${idCounter++}`;
}

// Node Builder Helpers
function createText(characters, options = {}) {
  const {
    fontSize = 14,
    fontWeight = 400,
    color = COLORS.text,
    x = 0,
    y = 0,
    width = 300,
    height = 24,
    align = "LEFT",
    fontFamily = "Manrope"
  } = options;

  return {
    id: genId(),
    name: characters.substring(0, 25),
    type: "TEXT",
    characters: characters,
    style: {
      fontFamily: fontFamily,
      fontPostScriptName: `Manrope-${fontWeight >= 700 ? 'Bold' : (fontWeight >= 600 ? 'SemiBold' : 'Regular')}`,
      fontWeight: fontWeight,
      fontSize: fontSize,
      textAlignHorizontal: align,
      textAlignVertical: "CENTER",
      letterSpacing: 0,
      lineHeightPx: Math.round(fontSize * 1.35)
    },
    fills: [{ type: "SOLID", color: color }],
    absoluteBoundingBox: { x, y, width, height }
  };
}

function createRect(name, x, y, width, height, options = {}) {
  const {
    fill = COLORS.white,
    stroke = null,
    strokeWidth = 1,
    cornerRadius = 0
  } = options;

  const node = {
    id: genId(),
    name: name,
    type: "RECTANGLE",
    absoluteBoundingBox: { x, y, width, height },
    fills: fill ? [{ type: "SOLID", color: fill }] : [],
    cornerRadius: cornerRadius
  };

  if (stroke) {
    node.strokes = [{ type: "SOLID", color: stroke }];
    node.strokeWeight = strokeWidth;
  }

  return node;
}

function createFrame(name, x, y, width, height, options = {}) {
  const {
    fill = COLORS.canvas,
    cornerRadius = 0,
    layoutMode = "NONE",
    children = []
  } = options;

  return {
    id: genId(),
    name: name,
    type: "FRAME",
    absoluteBoundingBox: { x, y, width, height },
    fills: fill ? [{ type: "SOLID", color: fill }] : [],
    cornerRadius: cornerRadius,
    clipsContent: true,
    layoutMode: layoutMode,
    children: children
  };
}

// Android Status Bar Component
function createAndroidStatusBar(parentX, parentY) {
  return createFrame("Android Status Bar", parentX, parentY, 390, 42, {
    fill: null,
    children: [
      createText("19:21", { x: parentX + 24, y: parentY + 12, width: 60, height: 20, fontSize: 12, fontWeight: 700, color: COLORS.dark }),
      createText("5G • WiFi • 98%", { x: parentX + 260, y: parentY + 12, width: 106, height: 20, fontSize: 11, fontWeight: 600, color: COLORS.dark, align: "RIGHT" })
    ]
  });
}

// Android Bottom Navigation Component (5 Menus)
function createAndroidBottomNav(parentX, parentY, activeTab = 0) {
  const tabs = [
    { label: "Beranda", icon: "🏠" },
    { label: "Armada", icon: "🚗" },
    { label: "Booking", icon: "📅" },
    { label: "Riwayat", icon: "📋" },
    { label: "Profil", icon: "👤" }
  ];

  const barY = parentY + 844 - 68;
  const navChildren = [
    createRect("Nav Background", parentX, barY, 390, 68, { fill: COLORS.white, stroke: COLORS.border, strokeWidth: 1 })
  ];

  const tabWidth = 390 / 5;
  tabs.forEach((tab, index) => {
    const tabX = parentX + (index * tabWidth);
    const isActive = index === activeTab;
    const tabColor = isActive ? COLORS.primary : COLORS.textMuted;
    const weight = isActive ? 800 : 500;

    navChildren.push(
      createText(tab.icon, { x: tabX, y: barY + 10, width: tabWidth, height: 20, fontSize: 18, align: "CENTER" }),
      createText(tab.label, { x: tabX, y: barY + 34, width: tabWidth, height: 18, fontSize: 10.5, fontWeight: weight, color: tabColor, align: "CENTER" })
    );
  });

  return createFrame("Android Bottom Navigation", parentX, barY, 390, 68, {
    fill: null,
    children: navChildren
  });
}

// Button Component
function createButtonNode(label, variant, x, y, width = 342, height = 48) {
  let bg = COLORS.primary;
  let textColor = COLORS.white;
  let stroke = null;

  if (variant === 'secondary') {
    bg = COLORS.mint;
    textColor = COLORS.primary;
    stroke = COLORS.primary;
  } else if (variant === 'whatsapp') {
    bg = COLORS.whatsapp;
    textColor = COLORS.white;
  }

  return createFrame(`Button [${variant}]`, x, y, width, height, {
    fill: bg,
    cornerRadius: 999,
    children: [
      createRect("Btn Bg", x, y, width, height, { fill: bg, stroke: stroke, strokeWidth: stroke ? 1.5 : 0, cornerRadius: 999 }),
      createText(label, { x: x, y: y + 14, width: width, height: 20, fontSize: 14, fontWeight: 700, color: textColor, align: "CENTER" })
    ]
  });
}

// =====================================================================
// SCREEN GENERATORS (All 28 Android Screens)
// =====================================================================

function buildScreenFrame(title, colIndex, rowIndex, contentBuilder, activeNav = null) {
  const SCREEN_WIDTH = 390;
  const SCREEN_HEIGHT = 844;
  const GAP_X = 50;
  const GAP_Y = 80;

  const originX = colIndex * (SCREEN_WIDTH + GAP_X);
  const originY = rowIndex * (SCREEN_HEIGHT + GAP_Y);

  const screenChildren = [
    createRect("Canvas Latar", originX, originY, SCREEN_WIDTH, SCREEN_HEIGHT, { fill: COLORS.canvas }),
    createAndroidStatusBar(originX, originY)
  ];

  // Build screen-specific contents
  const contents = contentBuilder(originX, originY, SCREEN_WIDTH, SCREEN_HEIGHT);
  screenChildren.push(...contents);

  // Attach bottom nav if applicable
  if (activeNav !== null) {
    screenChildren.push(createAndroidBottomNav(originX, originY, activeNav));
  }

  return createFrame(title, originX, originY, SCREEN_WIDTH, SCREEN_HEIGHT, {
    fill: COLORS.canvas,
    cornerRadius: 40,
    children: screenChildren
  });
}

console.log("Generating FigCraft document structure for Anantalia Trans...");

const appScreens = [];

// ROW 0: SPLASH, INTRO, ONBOARDING (Col 0 - 4)
appScreens.push(
  // 1. Splash Screen
  buildScreenFrame("01. Splash Screen", 0, 0, (x, y) => [
    createRect("Splash Icon Box", x + 145, y + 300, 100, 100, { fill: COLORS.white, cornerRadius: 24, stroke: COLORS.border }),
    createText("🚙", { x: x + 145, y: y + 325, width: 100, height: 48, fontSize: 44, align: "CENTER" }),
    createText("ANANTALIA TRANS", { x: x + 40, y: y + 420, width: 310, height: 32, fontSize: 24, fontWeight: 800, color: COLORS.primary, align: "CENTER" }),
    createText("Premium Mobility & Rental Service", { x: x + 40, y: y + 456, width: 310, height: 20, fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, align: "CENTER" }),
    createRect("Loader Track", x + 125, y + 540, 140, 4, { fill: COLORS.border, cornerRadius: 99 }),
    createRect("Loader Active", x + 125, y + 540, 60, 4, { fill: COLORS.primary, cornerRadius: 99 })
  ]),

  // 2. Animated Intro (5-Scene)
  buildScreenFrame("02. Animated Intro (5-Scene)", 1, 0, (x, y) => [
    createButtonNode("Lewati (Skip)", "secondary", x + 270, y + 50, 96, 32),
    createRect("Scenery Stage", x + 24, y + 100, 342, 420, { fill: COLORS.mint, cornerRadius: 24, stroke: COLORS.white, strokeWidth: 2 }),
    createText("☁️   ☁️", { x: x + 40, y: y + 130, width: 310, height: 30, fontSize: 24 }),
    createText("🏔️ 🌲 🏡 🌲 🏔️", { x: x + 40, y: y + 260, width: 310, height: 40, fontSize: 30, align: "CENTER" }),
    createRect("Road Asphal", x + 24, y + 440, 342, 80, { fill: hexToColor('#394A48') }),
    createText("🚙 (3D Cartoon Anta MPV)", { x: x + 80, y: y + 400, width: 230, height: 40, fontSize: 20, fontWeight: 800, color: COLORS.white, align: "CENTER" }),
    createRect("Info Card", x + 24, y + 540, 342, 160, { fill: COLORS.white, cornerRadius: 16, stroke: COLORS.border }),
    createText("SCENE 1: THE JOURNEY BEGINS", { x: x + 44, y: y + 560, width: 302, height: 18, fontSize: 11, fontWeight: 800, color: COLORS.primary }),
    createText("Your Journey, Our Priority", { x: x + 44, y: y + 586, width: 302, height: 26, fontSize: 18, fontWeight: 800, color: COLORS.dark }),
    createText("Petualangan baru dimulai bersama armada sewa terpercaya Anantalia Trans.", { x: x + 44, y: y + 618, width: 302, height: 40, fontSize: 13, color: COLORS.textSecondary })
  ]),

  // 3. Onboarding 1
  buildScreenFrame("03. Onboarding 1 - Perjalanan", 2, 0, (x, y) => [
    createText("1 / 3", { x: x + 24, y: y + 54, width: 60, height: 20, fontSize: 12, fontWeight: 800, color: COLORS.primary }),
    createRect("Artwork Box", x + 24, y + 90, 342, 380, { fill: COLORS.mint, cornerRadius: 24 }),
    createText("🚙 ⛰️ 🌲", { x: x + 40, y: y + 240, width: 310, height: 60, fontSize: 52, align: "CENTER" }),
    createText("Perjalanan Lebih Menyenangkan", { x: x + 24, y: y + 500, width: 342, height: 32, fontSize: 22, fontWeight: 800, color: COLORS.dark, align: "CENTER" }),
    createText("Temukan layanan rental kendaraan untuk berbagai kebutuhan perjalananmu dengan unit terawat dan nyaman.", { x: x + 34, y: y + 540, width: 322, height: 50, fontSize: 13.5, color: COLORS.textSecondary, align: "CENTER" }),
    createButtonNode("Lanjut", "primary", x + 24, y + 740, 342, 48)
  ]),

  // 4. Onboarding 2
  buildScreenFrame("04. Onboarding 2 - Pilihan Armada", 3, 0, (x, y) => [
    createText("2 / 3", { x: x + 24, y: y + 54, width: 60, height: 20, fontSize: 12, fontWeight: 800, color: COLORS.primary }),
    createRect("Artwork Box", x + 24, y + 90, 342, 380, { fill: COLORS.mint, cornerRadius: 24 }),
    createText("🚗 🚙 🚐", { x: x + 40, y: y + 240, width: 310, height: 60, fontSize: 52, align: "CENTER" }),
    createText("Pilihan Armada Setiap Kebutuhan", { x: x + 24, y: y + 500, width: 342, height: 32, fontSize: 22, fontWeight: 800, color: COLORS.dark, align: "CENTER" }),
    createText("Jelajahi berbagai pilihan kendaraan dari City Car lincah hingga MPV lega sesuai rute perjalanan.", { x: x + 34, y: y + 540, width: 322, height: 50, fontSize: 13.5, color: COLORS.textSecondary, align: "CENTER" }),
    createButtonNode("Lanjut", "primary", x + 24, y + 740, 342, 48)
  ]),

  // 5. Onboarding 3
  buildScreenFrame("05. Onboarding 3 - Booking Mudah", 4, 0, (x, y) => [
    createText("3 / 3", { x: x + 24, y: y + 54, width: 60, height: 20, fontSize: 12, fontWeight: 800, color: COLORS.primary }),
    createRect("Artwork Box", x + 24, y + 90, 342, 380, { fill: COLORS.mint, cornerRadius: 24 }),
    createText("📱 ✨ 🚗", { x: x + 40, y: y + 240, width: 310, height: 60, fontSize: 52, align: "CENTER" }),
    createText("Booking Lebih Mudah", { x: x + 24, y: y + 500, width: 342, height: 32, fontSize: 22, fontWeight: 800, color: COLORS.dark, align: "CENTER" }),
    createText("Ajukan pemesanan kendaraan dengan praktis melalui aplikasi dan pantau konfirmasi admin langsung dari ponselmu.", { x: x + 34, y: y + 540, width: 322, height: 50, fontSize: 13.5, color: COLORS.textSecondary, align: "CENTER" }),
    createButtonNode("Mulai Sekarang", "primary", x + 24, y + 740, 342, 48)
  ])
);

// ROW 1: AUTHENTICATION (Col 0 - 4)
appScreens.push(
  // 6. Login Screen
  buildScreenFrame("06. Login Screen", 0, 1, (x, y) => [
    createRect("Logo Box", x + 24, y + 70, 52, 52, { fill: COLORS.mint, cornerRadius: 16 }),
    createText("🔑", { x: x + 24, y: y + 80, width: 52, height: 32, fontSize: 24, align: "CENTER" }),
    createText("Selamat Datang Kembali", { x: x + 24, y: y + 134, width: 342, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark }),
    createText("Masuk ke akun Anantalia Trans untuk melanjutkan sewa.", { x: x + 24, y: y + 168, width: 342, height: 20, fontSize: 13, color: COLORS.textSecondary }),
    
    // Form Inputs
    createText("Alamat Email", { x: x + 24, y: y + 210, width: 342, height: 18, fontSize: 12.5, fontWeight: 600, color: COLORS.dark }),
    createRect("Input Email", x + 24, y + 234, 342, 48, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("ihsan.pratama@example.com", { x: x + 40, y: y + 248, width: 300, height: 20, fontSize: 13.5, color: COLORS.text }),

    createText("Kata Sandi", { x: x + 24, y: y + 298, width: 342, height: 18, fontSize: 12.5, fontWeight: 600, color: COLORS.dark }),
    createRect("Input Password", x + 24, y + 322, 342, 48, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("••••••••••••", { x: x + 40, y: y + 338, width: 260, height: 20, fontSize: 14, color: COLORS.text }),
    createText("👁️", { x: x + 325, y: y + 336, width: 24, height: 20, fontSize: 14 }),

    createText("☑ Ingat Saya", { x: x + 24, y: y + 386, width: 140, height: 20, fontSize: 12.5, color: COLORS.textSecondary }),
    createText("Lupa Sandi?", { x: x + 250, y: y + 386, width: 116, height: 20, fontSize: 12.5, fontWeight: 700, color: COLORS.primary, align: "RIGHT" }),

    createButtonNode("Masuk ke Akun", "primary", x + 24, y + 430, 342, 48),
    createText("Belum punya akun? Daftar Sekarang", { x: x + 24, y: y + 510, width: 342, height: 20, fontSize: 13, fontWeight: 600, color: COLORS.primary, align: "CENTER" })
  ]),

  // 7. Register Screen
  buildScreenFrame("07. Register Screen", 1, 1, (x, y) => [
    createText("Daftar Akun Baru", { x: x + 24, y: y + 80, width: 342, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark }),
    createText("Nama Lengkap", { x: x + 24, y: y + 130, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Input Name", x + 24, y + 152, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("Email", { x: x + 24, y: y + 208, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Input Email", x + 24, y + 230, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("Nomor WhatsApp (+62)", { x: x + 24, y: y + 286, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Input Phone", x + 24, y + 308, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("Kata Sandi", { x: x + 24, y: y + 364, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Input Pass", x + 24, y + 386, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createButtonNode("Daftar Akun", "primary", x + 24, y + 460, 342, 48)
  ]),

  // 8. Forgot Password
  buildScreenFrame("08. Forgot Password", 2, 1, (x, y) => [
    createText("Lupa Kata Sandi?", { x: x + 24, y: y + 80, width: 342, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark }),
    createText("Masukkan alamat email Anda untuk menerima instruksi reset.", { x: x + 24, y: y + 120, width: 342, height: 36, fontSize: 13, color: COLORS.textSecondary }),
    createRect("Input Email", x + 24, y + 180, 342, 48, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createButtonNode("Kirim Instruksi Reset", "primary", x + 24, y + 250, 342, 48)
  ]),

  // 9. OTP Verification
  buildScreenFrame("09. Email OTP Verification", 3, 1, (x, y) => [
    createText("Verifikasi Email", { x: x + 24, y: y + 80, width: 342, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark }),
    createText("Masukkan 6 digit kode yang dikirim ke email Anda.", { x: x + 24, y: y + 120, width: 342, height: 36, fontSize: 13, color: COLORS.textSecondary }),
    createRect("Digit 1", x + 24, y + 180, 48, 52, { fill: COLORS.white, stroke: COLORS.primary, strokeWidth: 2, cornerRadius: 12 }),
    createRect("Digit 2", x + 82, y + 180, 48, 52, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createRect("Digit 3", x + 140, y + 180, 48, 52, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createRect("Digit 4", x + 198, y + 180, 48, 52, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createRect("Digit 5", x + 256, y + 180, 48, 52, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createRect("Digit 6", x + 314, y + 180, 48, 52, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createButtonNode("Verifikasi Kode", "primary", x + 24, y + 260, 342, 48)
  ]),

  // 10. Auth Success
  buildScreenFrame("10. Auth Success Screen", 4, 1, (x, y) => [
    createText("🎉", { x: x + 145, y: y + 260, width: 100, height: 60, fontSize: 52, align: "CENTER" }),
    createText("Akun Berhasil Diverifikasi!", { x: x + 24, y: y + 340, width: 342, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark, align: "CENTER" }),
    createText("Selamat datang di Anantalia Trans. Mari temukan armada terbaik untuk perjalananmu.", { x: x + 34, y: y + 380, width: 322, height: 40, fontSize: 13, color: COLORS.textSecondary, align: "CENTER" }),
    createButtonNode("Mulai Eksplorasi Armada", "primary", x + 24, y + 460, 342, 48)
  ])
);

// ROW 2: CORE DASHBOARD, CATALOG, & DETAIL (Col 0 - 3)
appScreens.push(
  // 11. Home Dashboard
  buildScreenFrame("11. Home Dashboard", 0, 2, (x, y) => [
    createText("SELAMAT PAGI 👋", { x: x + 24, y: y + 54, width: 200, height: 16, fontSize: 11, fontWeight: 700, color: COLORS.textSecondary }),
    createText("Ihsan Pratama", { x: x + 24, y: y + 72, width: 200, height: 26, fontSize: 18, fontWeight: 800, color: COLORS.dark }),
    createRect("Bell Btn", x + 322, y + 56, 40, 40, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 20 }),
    createText("🔔", { x: x + 322, y: y + 66, width: 40, height: 20, fontSize: 16, align: "CENTER" }),
    
    // Search Box
    createRect("Search Field", x + 24, y + 114, 342, 46, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 99 }),
    createText("🔍  Cari Calya, Avanza, Innova, HiAce...", { x: x + 40, y: y + 128, width: 300, height: 20, fontSize: 13, color: COLORS.textSecondary }),

    // 3D Hero Adventure Card
    createRect("Hero Card", x + 24, y + 174, 342, 140, { fill: COLORS.primary, cornerRadius: 24 }),
    createText("3D ADVENTURE MPV", { x: x + 44, y: y + 194, width: 200, height: 16, fontSize: 10, fontWeight: 800, color: COLORS.mint }),
    createText("Jelajahi Rute Impian", { x: x + 44, y: y + 214, width: 190, height: 26, fontSize: 18, fontWeight: 800, color: COLORS.white }),
    createText("Armada bersih & siap jalan.", { x: x + 44, y: y + 242, width: 190, height: 18, fontSize: 11.5, color: COLORS.white }),
    createButtonNode("Booking Sekarang ➔", "secondary", x + 44, y + 266, 150, 32),
    createText("🚙", { x: x + 240, y: y + 210, width: 100, height: 70, fontSize: 56, align: "CENTER" }),

    // Quick Action 4 Pillars
    createRect("QA 1", x + 24, y + 334, 76, 76, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("🚗\nArmada", { x: x + 24, y: y + 350, width: 76, height: 44, fontSize: 11.5, fontWeight: 700, align: "CENTER" }),
    createRect("QA 2", x + 112, y + 334, 76, 76, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("📅\nBooking", { x: x + 112, y: y + 350, width: 76, height: 44, fontSize: 11.5, fontWeight: 700, align: "CENTER" }),
    createRect("QA 3", x + 200, y + 334, 76, 76, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("📋\nRiwayat", { x: x + 200, y: y + 350, width: 76, height: 44, fontSize: 11.5, fontWeight: 700, align: "CENTER" }),
    createRect("QA 4", x + 288, y + 334, 76, 76, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("💬\nWhatsApp", { x: x + 288, y: y + 350, width: 76, height: 44, fontSize: 11.5, fontWeight: 700, align: "CENTER" }),

    // Category Slider
    createText("Kategori Kendaraan", { x: x + 24, y: y + 430, width: 200, height: 22, fontSize: 16, fontWeight: 800, color: COLORS.dark }),
    createRect("Cat 1", x + 24, y + 460, 80, 34, { fill: COLORS.primary, cornerRadius: 99 }),
    createText("Semua", { x: x + 24, y: y + 468, width: 80, height: 18, fontSize: 12, fontWeight: 700, color: COLORS.white, align: "CENTER" }),
    createRect("Cat 2", x + 112, y + 460, 110, 34, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 99 }),
    createText("City Car", { x: x + 112, y: y + 468, width: 110, height: 18, fontSize: 12, fontWeight: 600, color: COLORS.text, align: "CENTER" }),
    createRect("Cat 3", x + 230, y + 460, 136, 34, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 99 }),
    createText("MPV Keluarga", { x: x + 230, y: y + 468, width: 136, height: 18, fontSize: 12, fontWeight: 600, color: COLORS.text, align: "CENTER" }),

    // Featured Fleet Card
    createText("Armada Pilihan", { x: x + 24, y: y + 514, width: 200, height: 22, fontSize: 16, fontWeight: 800, color: COLORS.dark }),
    createRect("Car Card", x + 24, y + 544, 210, 200, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createRect("Thumb", x + 24, y + 544, 210, 100, { fill: COLORS.mint, cornerRadius: 16 }),
    createText("🚗", { x: x + 24, y: y + 574, width: 210, height: 40, fontSize: 36, align: "CENTER" }),
    createText("MPV STANDAR", { x: x + 36, y: y + 654, width: 180, height: 14, fontSize: 10, fontWeight: 700, color: COLORS.primary }),
    createText("Toyota Avanza", { x: x + 36, y: y + 672, width: 180, height: 20, fontSize: 14, fontWeight: 800, color: COLORS.dark }),
    createText("Rp450.000 / 12 Jam", { x: x + 36, y: y + 710, width: 180, height: 18, fontSize: 12, fontWeight: 800, color: COLORS.primary })
  ], 0),

  // 12. Fleet Catalog (Grid Mode)
  buildScreenFrame("12. Fleet Catalog (Grid)", 1, 2, (x, y) => [
    createText("Katalog Armada", { x: x + 24, y: y + 54, width: 200, height: 28, fontSize: 20, fontWeight: 800, color: COLORS.dark }),
    createRect("Search Field", x + 24, y + 96, 260, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("🔍  Cari armada...", { x: x + 38, y: y + 110, width: 220, height: 20, fontSize: 13, color: COLORS.textSecondary }),
    createRect("Filter Btn", x + 292, y + 96, 74, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("⚙️ Filter", { x: x + 292, y: y + 110, width: 74, height: 20, fontSize: 12, fontWeight: 700, align: "CENTER" }),

    // Grid 2 Columns
    createRect("Card 1", x + 24, y + 160, 164, 210, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createRect("T1", x + 24, y + 160, 164, 100, { fill: COLORS.mint }),
    createText("🚗", { x: x + 24, y: y + 195, width: 164, height: 30, fontSize: 28, align: "CENTER" }),
    createText("Toyota Calya", { x: x + 34, y: y + 270, width: 144, height: 18, fontSize: 13, fontWeight: 800 }),
    createText("Rp350.000 / 12 Jam", { x: x + 34, y: y + 335, width: 144, height: 18, fontSize: 11.5, fontWeight: 800, color: COLORS.primary }),

    createRect("Card 2", x + 202, y + 160, 164, 210, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createRect("T2", x + 202, y + 160, 164, 100, { fill: COLORS.mint }),
    createText("🚙", { x: x + 202, y: y + 195, width: 164, height: 30, fontSize: 28, align: "CENTER" }),
    createText("Toyota Avanza", { x: x + 212, y: y + 270, width: 144, height: 18, fontSize: 13, fontWeight: 800 }),
    createText("Rp450.000 / 12 Jam", { x: x + 212, y: y + 335, width: 144, height: 18, fontSize: 11.5, fontWeight: 800, color: COLORS.primary }),

    createRect("Card 3", x + 24, y + 386, 164, 210, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createRect("T3", x + 24, y + 386, 164, 100, { fill: COLORS.mint }),
    createText("Innova Reborn", { x: x + 34, y: y + 496, width: 144, height: 18, fontSize: 13, fontWeight: 800 }),
    createText("Rp650.000 / 12 Jam", { x: x + 34, y: y + 560, width: 144, height: 18, fontSize: 11.5, fontWeight: 800, color: COLORS.primary }),

    createRect("Card 4", x + 202, y + 386, 164, 210, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createRect("T4", x + 202, y + 386, 164, 100, { fill: COLORS.mint }),
    createText("HiAce Commuter", { x: x + 212, y: y + 496, width: 144, height: 18, fontSize: 13, fontWeight: 800 }),
    createText("Rp1.100.000 / 12 Jam", { x: x + 212, y: y + 560, width: 144, height: 18, fontSize: 11.5, fontWeight: 800, color: COLORS.primary })
  ], 1),

  // 13. Vehicle Detail Screen
  buildScreenFrame("13. Vehicle Detail Screen", 2, 2, (x, y) => [
    createRect("Hero Visual", x, y, 390, 260, { fill: COLORS.mint }),
    createText("←", { x: x + 20, y: y + 50, width: 40, height: 40, fontSize: 24, color: COLORS.dark }),
    createText("❤️", { x: x + 330, y: y + 50, width: 40, height: 40, fontSize: 20 }),
    createText("🚙 (Render 3D Avanza)", { x: x + 50, y: y + 140, width: 290, height: 50, fontSize: 22, fontWeight: 800, color: COLORS.primary, align: "CENTER" }),
    
    createRect("Detail Sheet", x, y + 240, 390, 604, { fill: COLORS.white, cornerRadius: 24 }),
    createText("Toyota Avanza", { x: x + 24, y: y + 270, width: 250, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark }),
    createText("⭐ 4.9 (42 Ulasan) • Siap Reservasi", { x: x + 24, y: y + 304, width: 342, height: 20, fontSize: 12, color: COLORS.success, fontWeight: 700 }),
    createText("MPV legendaris keluarga Indonesia dengan kabin luas dan suspensi nyaman.", { x: x + 24, y: y + 330, width: 342, height: 38, fontSize: 13, color: COLORS.textSecondary }),

    // Specs Grid
    createRect("Spec 1", x + 24, y + 380, 78, 64, { fill: COLORS.canvas, cornerRadius: 12 }),
    createText("👥 7 Kursi", { x: x + 24, y: y + 402, width: 78, height: 20, fontSize: 11, fontWeight: 700, align: "CENTER" }),
    createRect("Spec 2", x + 112, y + 380, 78, 64, { fill: COLORS.canvas, cornerRadius: 12 }),
    createText("⚙️ AT / MT", { x: x + 112, y: y + 402, width: 78, height: 20, fontSize: 11, fontWeight: 700, align: "CENTER" }),
    createRect("Spec 3", x + 200, y + 380, 78, 64, { fill: COLORS.canvas, cornerRadius: 12 }),
    createText("⛽ Bensin", { x: x + 200, y: y + 402, width: 78, height: 20, fontSize: 11, fontWeight: 700, align: "CENTER" }),
    createRect("Spec 4", x + 288, y + 380, 78, 64, { fill: COLORS.canvas, cornerRadius: 12 }),
    createText("❄️ Double AC", { x: x + 288, y: y + 402, width: 78, height: 20, fontSize: 11, fontWeight: 700, align: "CENTER" }),

    // Tariffs
    createRect("Tariff Box", x + 24, y + 460, 342, 80, { fill: COLORS.mint, cornerRadius: 12 }),
    createText("Tarif Dalam Kota (12 Jam): Rp450.000", { x: x + 40, y: y + 476, width: 300, height: 20, fontSize: 12.5, fontWeight: 700, color: COLORS.dark }),
    createText("Tarif Luar Kota (12 Jam): Rp650.000", { x: x + 40, y: y + 504, width: 300, height: 20, fontSize: 12.5, fontWeight: 700, color: COLORS.primary }),

    // Sticky Bottom Bar
    createRect("Bottom Sticky", x, y + 760, 390, 84, { fill: COLORS.white, stroke: COLORS.border }),
    createText("Estimasi Mulai\nRp450.000", { x: x + 24, y: y + 776, width: 140, height: 40, fontSize: 13, fontWeight: 800, color: COLORS.primary }),
    createButtonNode("Booking Sekarang ➔", "primary", x + 180, y + 776, 186, 48)
  ])
);

// ROW 3: BOOKING WIZARD (STEPS 1 - 6) & SUCCESS (Col 0 - 6)
appScreens.push(
  // 14. Booking Step 1: Vehicle Selection
  buildScreenFrame("14. Booking Step 1 - Pilih Mobil", 0, 3, (x, y) => [
    createText("Pengajuan Booking", { x: x + 24, y: y + 54, width: 342, height: 26, fontSize: 18, fontWeight: 800 }),
    createText("Langkah 1 dari 6: Pilih Kendaraan", { x: x + 24, y: y + 90, width: 342, height: 20, fontSize: 13, fontWeight: 700, color: COLORS.primary }),
    createRect("Sel 1", x + 24, y + 130, 342, 64, { fill: COLORS.mint, stroke: COLORS.primary, strokeWidth: 2, cornerRadius: 12 }),
    createText("🚗  Toyota Avanza (MPV Standar - 7 Kursi)", { x: x + 40, y: y + 152, width: 280, height: 20, fontSize: 13, fontWeight: 700 }),
    createRect("Sel 2", x + 24, y + 204, 342, 64, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("🚙  Toyota Innova Reborn (MPV Keluarga)", { x: x + 40, y: y + 226, width: 280, height: 20, fontSize: 13 }),
    createRect("Sel 3", x + 24, y + 278, 342, 64, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("🚐  Toyota HiAce Commuter (Minibus 16 Kursi)", { x: x + 40, y: y + 300, width: 280, height: 20, fontSize: 13 }),
    createButtonNode("Lanjut ke Tipe Layanan ➔", "primary", x + 24, y + 680, 342, 48)
  ], 2),

  // 15. Booking Step 2: Service Type
  buildScreenFrame("15. Booking Step 2 - Tipe Layanan", 1, 3, (x, y) => [
    createText("Langkah 2 dari 6: Tipe Layanan", { x: x + 24, y: y + 90, width: 342, height: 20, fontSize: 13, fontWeight: 700, color: COLORS.primary }),
    createRect("Option A", x + 24, y + 130, 342, 90, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("🔑  Lepas Kunci (Self Drive)", { x: x + 40, y: y + 150, width: 300, height: 24, fontSize: 15, fontWeight: 800 }),
    createText("Bebas mengemudi sendiri. Wajib SIM A & KTP.", { x: x + 40, y: y + 180, width: 300, height: 20, fontSize: 12, color: COLORS.textSecondary }),

    createRect("Option B", x + 24, y + 236, 342, 90, { fill: COLORS.mint, stroke: COLORS.primary, strokeWidth: 2, cornerRadius: 16 }),
    createText("👨‍✈️  Dengan Sopir (With Driver)", { x: x + 40, y: y + 256, width: 300, height: 24, fontSize: 15, fontWeight: 800, color: COLORS.primary }),
    createText("Perjalanan santai dipandu sopir berpengalaman.", { x: x + 40, y: y + 286, width: 300, height: 20, fontSize: 12, color: COLORS.textSecondary }),
    createButtonNode("Lanjut ke Jadwal & Rute ➔", "primary", x + 24, y + 680, 342, 48)
  ], 2),

  // 16. Booking Step 3: Trip Details
  buildScreenFrame("16. Booking Step 3 - Detail Rute", 2, 3, (x, y) => [
    createText("Langkah 3 dari 6: Jadwal & Area", { x: x + 24, y: y + 90, width: 342, height: 20, fontSize: 13, fontWeight: 700, color: COLORS.primary }),
    createText("Tanggal Mulai Sewa", { x: x + 24, y: y + 130, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Date 1", x + 24, y + 152, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("📅 10 November 2026", { x: x + 40, y: y + 164, width: 300, height: 20, fontSize: 13 }),

    createText("Tanggal Selesai Sewa", { x: x + 24, y: y + 208, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Date 2", x + 24, y + 230, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("📅 12 November 2026", { x: x + 40, y: y + 242, width: 300, height: 20, fontSize: 13 }),

    createText("Titik Penjemputan", { x: x + 24, y: y + 286, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Location", x + 24, y + 308, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("📍 Pool Pusat Anantalia Trans", { x: x + 40, y: y + 320, width: 300, height: 20, fontSize: 13 }),

    createText("Area Perjalanan: 🔘 Dalam Kota   ⚪ Luar Kota", { x: x + 24, y: y + 370, width: 342, height: 20, fontSize: 13, fontWeight: 600 }),
    createButtonNode("Lanjut ke Data Pemesan ➔", "primary", x + 24, y + 680, 342, 48)
  ], 2),

  // 17. Booking Step 4: Customer Details
  buildScreenFrame("17. Booking Step 4 - Data Kontak", 3, 3, (x, y) => [
    createText("Langkah 4 dari 6: Data Pelanggan", { x: x + 24, y: y + 90, width: 342, height: 20, fontSize: 13, fontWeight: 700, color: COLORS.primary }),
    createText("Nama Lengkap", { x: x + 24, y: y + 130, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Name", x + 24, y + 152, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("Ihsan Pratama", { x: x + 40, y: y + 164, width: 300, height: 20, fontSize: 13 }),

    createText("Nomor WhatsApp Aktif", { x: x + 24, y: y + 208, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Phone", x + 24, y + 230, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("+62 812-3456-7890", { x: x + 40, y: y + 242, width: 300, height: 20, fontSize: 13 }),

    createText("Alamat Email", { x: x + 24, y: y + 286, width: 342, height: 16, fontSize: 12, fontWeight: 600 }),
    createRect("Email", x + 24, y + 308, 342, 44, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("ihsan.pratama@example.com", { x: x + 40, y: y + 320, width: 300, height: 20, fontSize: 13 }),
    createButtonNode("Tinjau Ringkasan Sewa ➔", "primary", x + 24, y + 680, 342, 48)
  ], 2),

  // 18. Booking Step 5: Summary
  buildScreenFrame("18. Booking Step 5 - Ringkasan", 4, 3, (x, y) => [
    createText("Langkah 5 dari 6: Ringkasan Booking", { x: x + 24, y: y + 90, width: 342, height: 20, fontSize: 13, fontWeight: 700, color: COLORS.primary }),
    createRect("Recap Box", x + 24, y + 130, 342, 220, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("Model: Toyota Avanza", { x: x + 40, y: y + 150, width: 300, height: 20, fontSize: 13, fontWeight: 700 }),
    createText("Layanan: Dengan Sopir (Dalam Kota)", { x: x + 40, y: y + 180, width: 300, height: 20, fontSize: 12.5 }),
    createText("Durasi: 10 Nov - 12 Nov 2026 (2 Hari)", { x: x + 40, y: y + 210, width: 300, height: 20, fontSize: 12.5 }),
    createText("Estimasi Biaya: Rp1.300.000", { x: x + 40, y: y + 290, width: 300, height: 24, fontSize: 16, fontWeight: 800, color: COLORS.primary }),
    createRect("Alert Box", x + 24, y + 370, 342, 70, { fill: COLORS.warningBg, stroke: COLORS.warning, cornerRadius: 12 }),
    createText("ℹ️ Biaya di atas merupakan estimasi awal. Tarif final akan dikonfirmasi admin sesuai ketersediaan unit fisik.", { x: x + 38, y: y + 382, width: 310, height: 46, fontSize: 11.5, color: hexToColor('#92400E') }),
    createButtonNode("Lanjut ke Konfirmasi Akhir ➔", "primary", x + 24, y + 680, 342, 48)
  ], 2),

  // 19. Booking Step 6: Confirmation
  buildScreenFrame("19. Booking Step 6 - Submit", 5, 3, (x, y) => [
    createText("Langkah 6 dari 6: Konfirmasi S&K", { x: x + 24, y: y + 90, width: 342, height: 20, fontSize: 13, fontWeight: 700, color: COLORS.primary }),
    createRect("Terms Box", x + 24, y + 130, 342, 140, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("Dengan mengajukan permohonan ini, status pemesanan Anda adalah waiting_confirmation. Admin Anantalia Trans akan memverifikasi ketersediaan armada sebelum mengonfirmasi.", { x: x + 40, y: y + 150, width: 310, height: 80, fontSize: 12.5, color: COLORS.textSecondary }),
    createText("☑ Saya menyetujui Syarat & Ketentuan Sewa", { x: x + 24, y: y + 290, width: 342, height: 20, fontSize: 12.5, fontWeight: 700 }),
    createButtonNode("Kirim Pengajuan Booking 🚀", "primary", x + 24, y + 350, 342, 48)
  ], 2),

  // 20. Booking Success Screen
  buildScreenFrame("20. Booking Success Screen", 6, 3, (x, y) => [
    createText("🎉", { x: x + 145, y: y + 160, width: 100, height: 50, fontSize: 44, align: "CENTER" }),
    createText("Pengajuan Berhasil Dikirim!", { x: x + 24, y: y + 230, width: 342, height: 30, fontSize: 22, fontWeight: 800, color: COLORS.dark, align: "CENTER" }),
    createText("Booking mobil Toyota Avanza telah diterima sistem backend.", { x: x + 34, y: y + 266, width: 322, height: 36, fontSize: 13, color: COLORS.textSecondary, align: "CENTER" }),
    createRect("Ref Box", x + 75, y + 310, 240, 50, { fill: COLORS.mint, stroke: COLORS.primary, strokeWidth: 1.5, cornerRadius: 12 }),
    createText("KODE: ANT-2026-9041", { x: x + 75, y: y + 324, width: 240, height: 22, fontSize: 15, fontWeight: 800, color: COLORS.primary, align: "CENTER" }),
    createRect("Badge", x + 95, y + 380, 200, 32, { fill: COLORS.warningBg, cornerRadius: 99 }),
    createText("Status: Menunggu Konfirmasi", { x: x + 95, y: y + 388, width: 200, height: 16, fontSize: 11.5, fontWeight: 800, color: COLORS.warning, align: "CENTER" }),
    createButtonNode("💬 Konfirmasi via WhatsApp Admin", "whatsapp", x + 24, y + 460, 342, 48),
    createButtonNode("Lihat Riwayat Pemesanan", "secondary", x + 24, y + 520, 342, 48)
  ])
);

// ROW 4: HISTORY & AUXILIARY SCREENS (Col 0 - 4)
appScreens.push(
  // 21. Booking History
  buildScreenFrame("21. Booking History Screen", 0, 4, (x, y) => [
    createText("Riwayat Pemesanan", { x: x + 24, y: y + 54, width: 260, height: 28, fontSize: 20, fontWeight: 800, color: COLORS.dark }),
    createRect("Tab All", x + 24, y + 96, 70, 32, { fill: COLORS.primary, cornerRadius: 99 }),
    createText("Semua", { x: x + 24, y: y + 104, width: 70, height: 16, fontSize: 11.5, fontWeight: 700, color: COLORS.white, align: "CENTER" }),
    createRect("Tab Wait", x + 102, y + 96, 90, 32, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 99 }),
    createText("Menunggu", { x: x + 102, y: y + 104, width: 90, height: 16, fontSize: 11.5, fontWeight: 600, color: COLORS.text, align: "CENTER" }),
    createRect("Tab Done", x + 200, y + 96, 80, 32, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 99 }),
    createText("Selesai", { x: x + 200, y: y + 104, width: 80, height: 16, fontSize: 11.5, fontWeight: 600, color: COLORS.text, align: "CENTER" }),

    // History Cards
    createRect("Hist 1", x + 24, y + 148, 342, 130, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("ANT-2026-9041", { x: x + 40, y: y + 164, width: 140, height: 18, fontSize: 13, fontWeight: 800 }),
    createRect("Wait Badge", x + 210, y + 162, 140, 24, { fill: COLORS.warningBg, cornerRadius: 99 }),
    createText("Menunggu Konfirmasi", { x: x + 210, y: y + 166, width: 140, height: 16, fontSize: 10, fontWeight: 800, color: COLORS.warning, align: "CENTER" }),
    createText("🚗  Toyota Avanza (Dengan Sopir)", { x: x + 40, y: y + 196, width: 280, height: 20, fontSize: 13, fontWeight: 700 }),
    createText("📅 10 Nov - 12 Nov 2026 • Rp1.300.000", { x: x + 40, y: y + 224, width: 280, height: 18, fontSize: 11.5, color: COLORS.textSecondary }),

    createRect("Hist 2", x + 24, y + 294, 342, 130, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("ANT-2026-8812", { x: x + 40, y: y + 310, width: 140, height: 18, fontSize: 13, fontWeight: 800 }),
    createRect("Done Badge", x + 270, y + 308, 80, 24, { fill: COLORS.mint, cornerRadius: 99 }),
    createText("Selesai", { x: x + 270, y: y + 312, width: 80, height: 16, fontSize: 10, fontWeight: 800, color: COLORS.primary, align: "CENTER" }),
    createText("🚙  Toyota Innova Reborn (Lepas Kunci)", { x: x + 40, y: y + 342, width: 280, height: 20, fontSize: 13, fontWeight: 700 }),
    createText("📅 24 Okt - 26 Okt 2026 • Rp1.700.000", { x: x + 40, y: y + 370, width: 280, height: 18, fontSize: 11.5, color: COLORS.textSecondary })
  ], 3),

  // 22. Booking Detail & Timeline
  buildScreenFrame("22. Booking Detail & Timeline", 1, 4, (x, y) => [
    createText("←  Detail Pemesanan", { x: x + 24, y: y + 54, width: 260, height: 26, fontSize: 18, fontWeight: 800 }),
    createText("KODE: ANT-2026-9041", { x: x + 24, y: y + 96, width: 200, height: 20, fontSize: 14, fontWeight: 800, color: COLORS.primary }),
    createRect("Timeline Box", x + 24, y + 140, 342, 240, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("✓  1. Pengajuan Dikirim Pelanggan (07 Nov, 19:21)", { x: x + 40, y: y + 160, width: 310, height: 20, fontSize: 12, fontWeight: 700, color: COLORS.primary }),
    createText("⏳ 2. Verifikasi Unit Fisik di Pool (Sedang Proses)", { x: x + 40, y: y + 210, width: 310, height: 20, fontSize: 12, fontWeight: 700, color: COLORS.warning }),
    createText("○  3. Konfirmasi Jadwal & Pembayaran", { x: x + 40, y: y + 260, width: 310, height: 20, fontSize: 12, color: COLORS.textMuted }),
    createText("○  4. Penyerahan Unit & Sewa Selesai", { x: x + 40, y: y + 310, width: 310, height: 20, fontSize: 12, color: COLORS.textMuted }),
    createButtonNode("Hubungi Admin WhatsApp", "whatsapp", x + 24, y + 420, 342, 48),
    createButtonNode("Ajukan Pembatalan Sewa", "secondary", x + 24, y + 480, 342, 48)
  ]),

  // 23. Wishlist Screen
  buildScreenFrame("23. Wishlist Screen", 2, 4, (x, y) => [
    createText("←  Armada Favorit", { x: x + 24, y: y + 54, width: 260, height: 26, fontSize: 18, fontWeight: 800 }),
    createRect("Fav 1", x + 24, y + 100, 342, 100, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("🚗  Toyota Avanza", { x: x + 40, y: y + 120, width: 200, height: 20, fontSize: 14, fontWeight: 800 }),
    createText("MPV Standar • Rp450.000 / 12 Jam", { x: x + 40, y: y + 148, width: 240, height: 18, fontSize: 12, color: COLORS.primary }),
    createText("❤️", { x: x + 320, y: y + 130, width: 30, height: 30, fontSize: 20 }),

    createRect("Fav 2", x + 24, y + 216, 342, 100, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("🚙  Toyota Alphard", { x: x + 40, y: y + 236, width: 200, height: 20, fontSize: 14, fontWeight: 800 }),
    createText("Premium VIP • Rp1.800.000 / 12 Jam", { x: x + 40, y: y + 264, width: 240, height: 18, fontSize: 12, color: COLORS.primary }),
    createText("❤️", { x: x + 320, y: y + 246, width: 30, height: 30, fontSize: 20 })
  ]),

  // 24. Notification Center
  buildScreenFrame("24. Notification Center", 3, 4, (x, y) => [
    createText("←  Pusat Notifikasi", { x: x + 24, y: y + 54, width: 260, height: 26, fontSize: 18, fontWeight: 800 }),
    createRect("Notif 1", x + 24, y + 100, 342, 80, { fill: COLORS.mint, stroke: hexToColor('#B5DED8'), cornerRadius: 12 }),
    createText("📋  Pengajuan Booking Diterima", { x: x + 40, y: y + 116, width: 300, height: 20, fontSize: 13, fontWeight: 800 }),
    createText("Booking ANT-2026-9041 sedang diverifikasi admin.", { x: x + 40, y: y + 140, width: 300, height: 18, fontSize: 11.5, color: COLORS.textSecondary }),

    createRect("Notif 2", x + 24, y + 192, 342, 80, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 12 }),
    createText("🏷️  Promo Spesial Akhir Pekan", { x: x + 40, y: y + 208, width: 300, height: 20, fontSize: 13, fontWeight: 800 }),
    createText("Dapatkan potongan sewa untuk armada MPV Keluarga.", { x: x + 40, y: y + 232, width: 300, height: 18, fontSize: 11.5, color: COLORS.textSecondary })
  ]),

  // 25. Profile & Settings
  buildScreenFrame("25. Profile & Settings", 4, 4, (x, y) => [
    createRect("Header Profile", x, y + 42, 390, 120, { fill: COLORS.mint }),
    createRect("Avatar", x + 24, y + 68, 64, 64, { fill: COLORS.white, stroke: COLORS.primary, strokeWidth: 2, cornerRadius: 32 }),
    createText("👤", { x: x + 24, y: y + 80, width: 64, height: 40, fontSize: 32, align: "CENTER" }),
    createText("Ihsan Pratama", { x: x + 104, y: y + 74, width: 240, height: 24, fontSize: 18, fontWeight: 800 }),
    createText("ihsan.pratama@example.com", { x: x + 104, y: y + 102, width: 240, height: 18, fontSize: 12, color: COLORS.textSecondary }),

    createRect("Menu Group 1", x + 24, y + 180, 342, 140, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("❤️  Armada Favorit (Wishlist)              ➔", { x: x + 40, y: y + 196, width: 310, height: 24, fontSize: 13, fontWeight: 600 }),
    createText("📋  Riwayat Pemesanan                    ➔", { x: x + 40, y: y + 238, width: 310, height: 24, fontSize: 13, fontWeight: 600 }),
    createText("🏷️  Voucher & Promo Diskon              ➔", { x: x + 40, y: y + 280, width: 310, height: 24, fontSize: 13, fontWeight: 600 }),

    createRect("Menu Group 2", x + 24, y + 338, 342, 140, { fill: COLORS.white, stroke: COLORS.border, cornerRadius: 16 }),
    createText("📍  Lokasi Cabang & Pool                 ➔", { x: x + 40, y: y + 354, width: 310, height: 24, fontSize: 13, fontWeight: 600 }),
    createText("❓  Pusat Bantuan & FAQ                 ➔", { x: x + 40, y: y + 396, width: 310, height: 24, fontSize: 13, fontWeight: 600 }),
    createText("📱  Versi Aplikasi                          v1.0.0", { x: x + 40, y: y + 438, width: 310, height: 24, fontSize: 13, fontWeight: 600, color: COLORS.textMuted }),

    createButtonNode("Keluar dari Akun (Logout)", "secondary", x + 24, y + 510, 342, 48)
  ], 4)
);

// PAGE 2: DESIGN SYSTEM & DESIGN TOKENS
const designTokensPage = {
  id: "page_tokens",
  name: "🎨 Design System & Tokens",
  type: "CANVAS",
  backgroundColor: COLORS.canvas,
  children: [
    createFrame("Color Tokens Swatches", 0, 0, 800, 500, {
      fill: COLORS.white,
      cornerRadius: 24,
      children: [
        createText("ANANTALIA TRANS — OFFICIAL COLOR TOKENS", { x: 40, y: 40, width: 600, height: 30, fontSize: 20, fontWeight: 800, color: COLORS.dark }),
        // Swatches
        createRect("Sw 1", 40, 100, 120, 60, { fill: COLORS.primary, cornerRadius: 12 }),
        createText("Primary #006764", { x: 40, y: 170, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 2", 180, 100, 120, 60, { fill: COLORS.secondary, cornerRadius: 12 }),
        createText("Secondary #00827E", { x: 180, y: 170, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 3", 320, 100, 120, 60, { fill: COLORS.dark, cornerRadius: 12 }),
        createText("Dark #02201F", { x: 320, y: 170, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 4", 460, 100, 120, 60, { fill: COLORS.mint, cornerRadius: 12, stroke: COLORS.border }),
        createText("Mint #EAF6F4", { x: 460, y: 170, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 5", 600, 100, 120, 60, { fill: COLORS.canvas, cornerRadius: 12, stroke: COLORS.border }),
        createText("Canvas #F7F8F6", { x: 600, y: 170, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),

        createRect("Sw 6", 40, 220, 120, 60, { fill: COLORS.success, cornerRadius: 12 }),
        createText("Success #15803D", { x: 40, y: 290, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 7", 180, 220, 120, 60, { fill: COLORS.warning, cornerRadius: 12 }),
        createText("Warning #D97706", { x: 180, y: 290, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 8", 320, 220, 120, 60, { fill: COLORS.error, cornerRadius: 12 }),
        createText("Error #DC2626", { x: 320, y: 290, width: 120, height: 20, fontSize: 11, fontWeight: 700 }),
        createRect("Sw 9", 460, 220, 120, 60, { fill: COLORS.whatsapp, cornerRadius: 12 }),
        createText("WhatsApp #0D7837", { x: 460, y: 290, width: 120, height: 20, fontSize: 11, fontWeight: 700 })
      ]
    })
  ]
};

// PAGE 1: ANDROID APP SCREENS
const appScreensPage = {
  id: "page_screens",
  name: "📱 Android App Screens (28 Screens)",
  type: "CANVAS",
  backgroundColor: COLORS.canvas,
  children: appScreens
};

// ROOT DOCUMENT
const figcraftDocument = {
  name: "Anantalia Trans - Android Mobile Application",
  version: "1.0.0",
  lastModified: new Date().toISOString(),
  thumbnailUrl: "",
  schemaVersion: 0,
  document: {
    id: "doc_root",
    name: "Document",
    type: "DOCUMENT",
    children: [
      appScreensPage,
      designTokensPage
    ]
  }
};

// MANIFEST
const figcraftManifest = {
  format: "figcraft",
  version: "1.0.0",
  title: "Anantalia Trans Android App UI/UX",
  creator: "Antigravity Senior Product Designer",
  createdAt: new Date().toISOString(),
  targetPlatform: "Android",
  flutterReady: true,
  themeConcept: "3D Cartoon Automotive Adventure"
};

// Write files into figcraft_bundle
fs.writeFileSync(path.join(OUTPUT_DIR, 'document.json'), JSON.stringify(figcraftDocument, null, 2), 'utf-8');
fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(figcraftManifest, null, 2), 'utf-8');

// Ensure images folder exists
const imagesDir = path.join(OUTPUT_DIR, 'images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

console.log(`Successfully generated figcraft bundle at: ${OUTPUT_DIR}`);

// Package into .figcraft archive using .NET ZipFile
try {
  if (fs.existsSync(ARCHIVE_FILE)) {
    fs.unlinkSync(ARCHIVE_FILE);
  }
  const psCmd = `powershell -Command "$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${OUTPUT_DIR}', '${ARCHIVE_FILE}')"`;
  execSync(psCmd);
  console.log(`Successfully created FigCraft archive: ${ARCHIVE_FILE}`);
} catch (e) {
  console.error("Archive creation error:", e.message);
}
