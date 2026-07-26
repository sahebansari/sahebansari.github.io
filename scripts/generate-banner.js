/**
 * Generates the TerraFluent promo banner shown in the homepage hero.
 *
 *   - terrafluent-banner.png  → 1200×960 branded card (PDF · HTML · DOCX suite)
 *
 * Same approach as the OG cards (scripts/generate-og.js): an SVG is rasterised
 * with resvg using the bundled Inter fonts, so the banner renders identically on
 * any OS/CI and nothing binary has to be committed. Generation runs from the
 * `eleventy.before` hook in .eleventy.js (writing into the output dir). Standalone:
 *
 *   npm run banner        # writes into _site/assets/images
 *
 * Requires: @resvg/resvg-js (build dependency).
 */

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const FONT_DIR = path.join(__dirname, 'fonts');
const FONT_FILES = [
  path.join(FONT_DIR, 'Inter-Regular.ttf'),
  path.join(FONT_DIR, 'Inter-SemiBold.ttf'),
  path.join(FONT_DIR, 'Inter-Bold.ttf'),
];

const W = 1200;
const H = 960;
const PAD = 64;
const INNER = W - PAD * 2; // 1072

const FILE_NAME = 'terrafluent-banner.png';

// ── content ────────────────────────────────────────────────
const FORMATS = [
  {
    label: 'PDF',
    pkg: 'TerraFluent.Pdf.Reporting',
    note: 'Pure C# engine · AES-256 · .NET 8/9/10',
    tint: '#5eb0ff',
    ink: '#8fc4ff',
  },
  {
    label: 'HTML',
    pkg: 'TerraFluent.Html.Reporting',
    note: 'Paginated, print-ready · netstandard2.0+',
    tint: '#c084fc',
    ink: '#d8b4fe',
  },
  {
    label: 'DOCX',
    pkg: 'TerraFluent.Docx.Reporting',
    note: 'Native Open XML Word · netstandard2.0+',
    tint: '#2dd4bf',
    ink: '#5ee7df',
  },
];

const PILLS = ['.NET 8 · 9 · 10', 'MIT licensed', 'Zero dependencies', 'Cross-platform'];

// ── helpers ────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function backdrop() {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#06264d"/>
      <stop offset="0.55" stop-color="#141033"/>
      <stop offset="1" stop-color="#2a0a52"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#1a96ff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#1a96ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#2dd4bf" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#a51aff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#a51aff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c026d3"/>
      <stop offset="1" stop-color="#4c1d6b"/>
    </linearGradient>
    <linearGradient id="bar" gradientUnits="userSpaceOnUse" x1="${PAD}" y1="0" x2="${PAD + 620}" y2="0">
      <stop offset="0" stop-color="#5eb0ff"/>
      <stop offset="0.5" stop-color="#c084fc"/>
      <stop offset="1" stop-color="#5ee7df"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="80" cy="60" rx="560" ry="560" fill="url(#glowA)"/>
  <ellipse cx="1160" cy="900" rx="520" ry="520" fill="url(#glowB)"/>
  <ellipse cx="1180" cy="80" rx="420" ry="420" fill="url(#glowC)"/>`;
}

/** TerraFluent "Tf" mark — mirrors src/assets/images/terra_fluent_logo.png. */
function logoMark(x, y, size) {
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${0.22 * size}" fill="url(#mark)"/>
  <text x="${x + size / 2}" y="${y + size / 2 + 2}" font-family="Inter" font-weight="700"
        font-size="${0.46 * size}" fill="#ffffff" text-anchor="middle" dominant-baseline="central"
        letter-spacing="-1">Tf</text>`;
}

/** One format row: colour-coded badge + package name + one-line note. */
function formatRow(fmt, y) {
  const h = 112;
  return `
  <rect x="${PAD}" y="${y}" width="${INNER}" height="${h}" rx="20"
        fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.14"/>
  <rect x="${PAD + 32}" y="${y + 32}" width="96" height="48" rx="12"
        fill="${fmt.tint}" fill-opacity="0.18" stroke="${fmt.tint}" stroke-opacity="0.55"/>
  <text x="${PAD + 80}" y="${y + 57}" font-family="Inter" font-weight="700" font-size="22"
        fill="${fmt.ink}" text-anchor="middle" dominant-baseline="central" letter-spacing="1">${esc(fmt.label)}</text>
  <text x="${PAD + 160}" y="${y + 52}" font-family="Inter" font-weight="700" font-size="26"
        fill="#ffffff">${esc(fmt.pkg)}</text>
  <text x="${PAD + 160}" y="${y + 86}" font-family="Inter" font-size="19"
        fill="#9fb4e8">${esc(fmt.note)}</text>`;
}

/** Capability pills laid out left-to-right; widths approximated from Inter metrics. */
function pillRow(labels, y) {
  let x = PAD;
  return labels
    .map((label) => {
      const w = Math.round(40 + label.length * 10.5);
      const svg = `
  <rect x="${x}" y="${y}" width="${w}" height="52" rx="26"
        fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.18"/>
  <text x="${x + w / 2}" y="${y + 27}" font-family="Inter" font-weight="600" font-size="19"
        fill="#d6e0f5" text-anchor="middle" dominant-baseline="central">${esc(label)}</text>`;
      x += w + 14;
      return svg;
    })
    .join('\n');
}

function bannerSvg() {
  const rowY = [452, 580, 708];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${backdrop()}

  ${logoMark(PAD, 56, 96)}
  <text x="${PAD + 128}" y="112" font-family="Inter" font-weight="700" font-size="50" fill="#ffffff" letter-spacing="-1">TerraFluent</text>
  <text x="${PAD + 130}" y="150" font-family="Inter" font-size="22" fill="#9fb4e8">terrafluent.dev</text>

  <text x="${PAD}" y="234" font-family="Inter" font-weight="600" font-size="20" fill="#5ee7df" letter-spacing="4">ZERO-DEPENDENCY .NET REPORTING SUITE</text>
  <text x="${PAD - 2}" y="308" font-family="Inter" font-weight="700" font-size="56" fill="#ffffff" letter-spacing="-1">One fluent API.</text>
  <text x="${PAD - 2}" y="376" font-family="Inter" font-weight="700" font-size="56" fill="url(#bar)" letter-spacing="-1">Three output formats.</text>
  <rect x="${PAD}" y="408" width="180" height="6" rx="3" fill="url(#bar)"/>

  ${FORMATS.map((fmt, i) => formatRow(fmt, rowY[i])).join('\n')}

  ${pillRow(PILLS, 860)}
</svg>`;
}

// ── render ─────────────────────────────────────────────────
function renderPng(svg) {
  const resvg = new Resvg(svg, {
    font: { loadSystemFonts: false, fontFiles: FONT_FILES, defaultFontFamily: 'Inter' },
    fitTo: { mode: 'width', value: W },
  });
  return resvg.render().asPng();
}

function upToDate(file, refMtimeMs) {
  try {
    return fs.statSync(file).mtimeMs >= refMtimeMs;
  } catch {
    return false;
  }
}

/**
 * Generate the hero banner into `outDir`.
 * @param {string} outDir  absolute path to write the PNG into
 * @param {object} [opts]
 * @param {boolean} [opts.incremental] skip if the image is newer than this script
 * @param {function} [opts.log] logger
 * @returns {{written:number, skipped:number}}
 */
function generateBannerImage(outDir, { incremental = false, log = () => {} } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, FILE_NAME);
  if (incremental && upToDate(outPath, fs.statSync(__filename).mtimeMs)) {
    return { written: 0, skipped: 1 };
  }
  fs.writeFileSync(outPath, renderPng(bannerSvg()));
  log(`✓ ${FILE_NAME}`);
  return { written: 1, skipped: 0 };
}

module.exports = { generateBannerImage };

// CLI: `node scripts/generate-banner.js [outDir]`
if (require.main === module) {
  const outDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(__dirname, '..', '_site', 'assets', 'images');
  const { written, skipped } = generateBannerImage(outDir, { incremental: false, log: console.log });
  console.log(`\nGenerated ${written} banner (${skipped} skipped) in ${outDir}`);
}
