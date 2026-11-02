const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'pages/tentang-kami.html', 'pages/layanan.html', 'pages/armada.html', 'pages/pusat-bantuan.html'];
const fail = (message) => { console.error(`GAGAL: ${message}`); process.exitCode = 1; };
const htmlByPath = new Map(pages.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
let fleet;
try { fleet = JSON.parse(fs.readFileSync(path.join(root, 'fleet.json'), 'utf8')); }
catch (error) { fail(`fleet.json tidak valid: ${error.message}`); process.exit(1); }
const ids = fleet.fleet.map(record => record.id);
if (ids.length !== 63 || new Set(ids).size !== 63) fail(`Armada harus berisi 63 ID unik; didapat ${ids.length}/${new Set(ids).size}.`);
if (!fleet.isDummy || fleet.fleet.some(record => !record.isDummy)) fail('Data dummy fleet harus tetap ditandai.');
const armada = htmlByPath.get('pages/armada.html');
if (/<article\b[^>]*\bfleet-item/.test(armada)) fail('Kartu armada masih tersimpan statis di HTML.');
if (!armada.includes('data-fleet-categories') || !armada.includes('fleet-cards-container')) fail('Hook render katalog tidak lengkap.');
for (const [file, html] of htmlByPath) {
  if (/cdn\.tailwindcss\.com|tailwindcss@.*cdn/i.test(html)) fail(`Tailwind CDN masih dirujuk: ${file}`);
  const generatedLink = file === 'index.html' ? 'css/tailwind.generated.css' : '../css/tailwind.generated.css';
  if (!html.includes(generatedLink)) fail(`CSS Tailwind lokal tidak dimuat: ${file}`);
  const symbols = (html.match(/fonts\.googleapis\.com\/css2\?family=Material\+Symbols/g) || []).length;
  if (symbols !== 1) fail(`${file} memuat ${symbols} impor Material Symbols; diharapkan satu.`);
}
const stylesheet = postcss.parse(fs.readFileSync(path.join(root, 'css/tailwind.generated.css'), 'utf8'));
const selectors = new Set();
stylesheet.walkRules(rule => {
  try {
    selectorParser(nodes => nodes.walkClasses(node => selectors.add(node.value)) ).processSync(rule.selector);
  } catch { /* CSS parser reports its own syntax errors below. */ }
});
const utilityTokens = new Set();
for (const [file, html] of htmlByPath) {
  for (const match of html.matchAll(/\bclass="([^"]*)"/g)) match[1].split(/\s+/).filter(Boolean).forEach(token => utilityTokens.add(token));
}
const jsFiles = ['js/armada-detail.js', 'js/layanan-detail.js', 'js/pusat-bantuan.js', 'js/site-shell.js'];
for (const file of jsFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of source.matchAll(/(?:className\s*=\s*|classList\.(?:add|remove|toggle)\()\s*[`'"]([^`'"]*)/g)) {
    match[1].split(/\s+/).filter(Boolean).forEach(token => utilityTokens.add(token));
  }
  for (const match of source.matchAll(/make\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]*)['"]/g)) {
    match[1].split(/\s+/).filter(Boolean).forEach(token => utilityTokens.add(token));
  }
  for (const match of source.matchAll(/const\s+(?:categoryActive|categoryIdle)\s*=\s*\[([^\]]*)\]/g)) {
    for (const token of match[1].matchAll(/['"]([^'"]+)['"]/g)) {
      token[1].split(/\s+/).filter(Boolean).forEach(value => utilityTokens.add(value));
    }
  }
}
const behavioralHooks = new Set(['service-tab-btn', 'service-card', 'category-filter-btn', 'faq-item', 'faq-trigger', 'region-filter-btn', 'fleet-item', 'fleet-catalogue-card', 'toggle-detail-btn', 'fleet-card-image-wrap', 'fleet-card-image', 'fleet-card-content', 'fleet-card-name', 'fleet-card-price-block', 'fleet-card-price-label', 'fleet-card-price', 'vehicle-detail-spec-icon', 'vehicle-detail-spec-label', 'vehicle-detail-spec-value', 'material-symbols-outlined', 'floating-whatsapp-pulse', 'shimmer-active', 'active', 'service-detail-modal', 'service-detail-grid', 'service-detail-photo', 'service-photo-placeholder', 'service-detail-content', 'service-detail-heading', 'service-modal-close', 'service-detail-extra', 'service-detail-features', 'service-detail-actions', 'service-modal-secondary', 'service-modal-whatsapp', 'motion-header-fade', 'motion-notice-fade', 'motion-filter-fade', 'whatsapp-fab-pulse', 'vehicle-detail-modal', 'vehicle-detail-grid', 'vehicle-detail-photo', 'vehicle-photo-placeholder', 'vehicle-detail-content', 'vehicle-detail-heading', 'vehicle-data-status', 'vehicle-modal-close', 'vehicle-detail-description', 'vehicle-reference-links', 'vehicle-specs-block', 'vehicle-detail-specs', 'vehicle-detail-actions', 'vehicle-modal-secondary', 'vehicle-modal-whatsapp', 'motion-btn', 'motion-chip', 'motion-card', 'reveal-on-scroll', 'faq-icon', 'faq-content', 'motion-input', 'indonesia-map', 'indonesia-map-svg', 'map-zoom-controls', 'map-zoom-button', 'city-marker', 'selected-city-modal', 'selected-city-dialog', 'city-list-item', 'floating-wa', 'card-visible', 'card-hidden', 'is-closing', 'is-visible']);
const missing = [...utilityTokens].filter(token => !behavioralHooks.has(token) && !selectors.has(token));
if (missing.length) fail(`Utility belum ditemukan pada CSS terkompilasi: ${missing.join(', ')}`);
const css = fs.readFileSync(path.join(root, 'css/tailwind.generated.css'), 'utf8');
for (const marker of ['@media (min-width:640px)', '@media (min-width:768px)', '@media (min-width:1024px)', ':hover', ':focus']) {
  if (!css.includes(marker)) fail(`CSS terkompilasi tidak memuat state/breakpoint ${marker}.`);
}
if (!process.exitCode) console.log(`LULUS: ${pages.length} halaman, 63 ID armada, satu sumber JSON, tanpa Tailwind CDN, ${utilityTokens.size} token class dicakup, breakpoint/state CSS tersedia.`);
