/**
 * Generates Open Graph / social share images (1200×630 PNG).
 *
 *   - og/default.png       → site-wide card (home + all non-post pages)
 *   - og/<post-slug>.png   → one branded card per blog post (title + category)
 *
 * Social platforms (Facebook, LinkedIn, X, Slack, WhatsApp) do NOT render SVG,
 * so these are rasterised to PNG. Generation runs automatically at build time
 * from an `eleventy.before` hook in .eleventy.js (writing into the output dir),
 * so there is nothing to commit. You can also run it standalone:
 *
 *   npm run og            # writes into _site/assets/images/og
 *
 * Requires: @resvg/resvg-js, gray-matter (build dependencies).
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Resvg } = require('@resvg/resvg-js');

const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');
const FONT_DIR = path.join(__dirname, 'fonts');

// Bundled Inter (SIL OFL 1.1) — loaded explicitly so cards render identically
// on any OS/CI (no dependency on host system fonts). See scripts/fonts/OFL.txt.
const FONT_FILES = [
  path.join(FONT_DIR, 'Inter-Regular.ttf'),
  path.join(FONT_DIR, 'Inter-SemiBold.ttf'),
  path.join(FONT_DIR, 'Inter-Bold.ttf'),
];

const W = 1200;
const H = 630;

// ── helpers ────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > maxChars) {
      lines.push(line);
      line = w;
    } else {
      line = line ? line + ' ' + w : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Choose the largest font size whose wrapped title fits in <= maxLines. */
function fitTitle(title, sizes, maxLines, widthPx) {
  for (const size of sizes) {
    const maxChars = Math.floor(widthPx / (size * 0.53));
    const lines = wrapText(title, maxChars);
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  const maxChars = Math.floor(widthPx / (size * 0.53));
  return { size, lines: wrapText(title, maxChars).slice(0, maxLines) };
}

// Shared background + brand defs
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
      <stop offset="0" stop-color="#2dd4bf" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#a51aff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#a51aff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a96ff"/>
      <stop offset="1" stop-color="#a51aff"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1a96ff"/>
      <stop offset="0.5" stop-color="#a51aff"/>
      <stop offset="1" stop-color="#2dd4bf"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="120" cy="80" rx="520" ry="520" fill="url(#glowA)"/>
  <ellipse cx="1140" cy="600" rx="480" ry="480" fill="url(#glowB)"/>
  <ellipse cx="1180" cy="60" rx="360" ry="360" fill="url(#glowC)"/>`;
}

function logoMark(x, y, size) {
  const r = 0.22 * size;
  const fs2 = 0.42 * size;
  return `
  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" fill="url(#mark)"/>
  <text x="${x + size / 2}" y="${y + size / 2}" font-family="Inter" font-weight="700"
        font-size="${fs2}" fill="#ffffff" text-anchor="middle" dominant-baseline="central"
        letter-spacing="-1">SA</text>`;
}

// ── card designs ───────────────────────────────────────────
function defaultCard() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${backdrop()}
  ${logoMark(80, 78, 104)}
  <text x="204" y="118" font-family="Inter" font-weight="700" font-size="40" fill="#ffffff">Saheb Ansari</text>
  <text x="204" y="158" font-family="Inter" font-size="24" fill="#9fb4e8">sahebansari.com</text>

  <text x="80" y="330" font-family="Inter" font-weight="600" font-size="26" fill="#5ee7df" letter-spacing="3">SOFTWARE ENGINEER · TECHNICAL WRITER</text>
  <text x="78" y="424" font-family="Inter" font-weight="700" font-size="94" fill="#ffffff">Learn. Build. Share.</text>
  <text x="80" y="486" font-family="Inter" font-size="38" fill="#d6e0f5">Author of TerraPDF &amp; TerraFluent — zero-dependency</text>
  <text x="80" y="534" font-family="Inter" font-size="38" fill="#d6e0f5">PDF, HTML &amp; DOCX libraries for .NET.</text>

  <rect x="80" y="576" width="240" height="6" rx="3" fill="url(#bar)"/>
</svg>`;
}

function postCard(title, category) {
  const cat = String(category || 'Article').toUpperCase();
  const { size, lines } = fitTitle(title, [74, 64, 56, 48, 42], 4, 1040);
  const lineHeight = Math.round(size * 1.14);
  // Center the baselines within a safe band (305–540) so descenders on the
  // last line always clear the accent bar at y=566.
  const BAND_TOP = 305;
  const BAND_BOTTOM = 540;
  const span = (lines.length - 1) * lineHeight;
  let y = Math.max(BAND_TOP, Math.round(BAND_TOP + (BAND_BOTTOM - BAND_TOP - span) / 2));
  const titleTspans = lines
    .map((ln) => {
      const t = `<text x="80" y="${Math.round(y)}" font-family="Inter" font-weight="700" font-size="${size}" fill="#ffffff">${esc(ln)}</text>`;
      y += lineHeight;
      return t;
    })
    .join('\n  ');

  const badgeW = 44 + cat.length * 15;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${backdrop()}
  ${logoMark(80, 74, 72)}
  <text x="170" y="103" font-family="Inter" font-weight="700" font-size="32" fill="#ffffff">Saheb Ansari</text>
  <text x="170" y="137" font-family="Inter" font-size="22" fill="#9fb4e8">sahebansari.com</text>

  <rect x="80" y="210" width="${badgeW}" height="46" rx="23" fill="#1a96ff" fill-opacity="0.18" stroke="#5eb0ff" stroke-opacity="0.5"/>
  <text x="${80 + badgeW / 2}" y="233" font-family="Inter" font-weight="700" font-size="22" fill="#8fc4ff" text-anchor="middle" dominant-baseline="central" letter-spacing="2">${esc(cat)}</text>

  ${titleTspans}

  <rect x="80" y="566" width="200" height="6" rx="3" fill="url(#bar)"/>
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
 * Generate all OG images into `outDir`.
 * @param {string} outDir  absolute path to write the PNGs into
 * @param {object} [opts]
 * @param {boolean} [opts.incremental] skip images already newer than their source
 * @param {function} [opts.log] per-file logger
 * @returns {{written:number, skipped:number}}
 */
function generateOgImages(outDir, { incremental = false, log = () => {} } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const scriptMtime = fs.statSync(__filename).mtimeMs;
  let written = 0;
  let skipped = 0;

  // Site default (depends only on this script)
  const defPath = path.join(outDir, 'default.png');
  if (incremental && upToDate(defPath, scriptMtime)) {
    skipped++;
  } else {
    fs.writeFileSync(defPath, renderPng(defaultCard()));
    written++;
    log('✓ og/default.png');
  }

  // Per-post cards
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const valid = new Set(['default.png']);
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    valid.add(`${slug}.png`);
    const outPath = path.join(outDir, `${slug}.png`);
    const srcPath = path.join(POSTS_DIR, file);
    const ref = Math.max(fs.statSync(srcPath).mtimeMs, scriptMtime);
    if (incremental && upToDate(outPath, ref)) {
      skipped++;
      continue;
    }
    const { data } = matter(fs.readFileSync(srcPath, 'utf8'));
    fs.writeFileSync(outPath, renderPng(postCard(data.title || slug, data.category)));
    written++;
    log(`✓ og/${slug}.png`);
  }

  // Prune orphans (posts that were deleted/renamed)
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith('.png') && !valid.has(f)) {
      fs.unlinkSync(path.join(outDir, f));
      log(`✗ removed orphan og/${f}`);
    }
  }

  return { written, skipped };
}

module.exports = { generateOgImages };

// CLI: `node scripts/generate-og.js [outDir]`
if (require.main === module) {
  const outDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(__dirname, '..', '_site', 'assets', 'images', 'og');
  const { written, skipped } = generateOgImages(outDir, { incremental: false, log: console.log });
  console.log(`\nGenerated ${written} OG image(s) (${skipped} skipped) in ${outDir}`);
}
