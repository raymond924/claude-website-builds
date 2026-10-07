// Screenshot a page at desktop (1440) and phone (390) width, report horizontal
// overflow and console errors, and list any element that sticks out on phones.
//
// Usage: node screenshot.js <file-or-url> <out-prefix>
// Writes <out-prefix>-desk.png and <out-prefix>-mob.png (full page).
// In Claude Code cloud sessions Playwright is installed globally and Chromium
// lives in /opt/pw-browsers; never run `playwright install`.
const path = require('path');
const { execSync } = require('child_process');
let pw;
try { pw = require('playwright'); }
catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }

(async () => {
  const [target, out = 'shot'] = process.argv.slice(2);
  if (!target) { console.error('Usage: node screenshot.js <file-or-url> <out-prefix>'); process.exit(1); }
  const url = /^https?:|^file:/.test(target) ? target : 'file://' + path.resolve(target);
  const browser = await pw.chromium.launch();
  for (const [name, width, height] of [['desk', 1440, 900], ['mob', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    await page.waitForTimeout(1500);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const wide = sw > width ? await page.evaluate(w => [...document.querySelectorAll('body *')]
      .filter(e => e.getBoundingClientRect().right > w + 2)
      .slice(0, 8).map(e => `${e.tagName.toLowerCase()}.${e.className} → ${Math.round(e.getBoundingClientRect().right)}px`), width) : [];
    console.log(`${name}: width ${width}, scrollWidth ${sw}${sw > width ? '  ⚠ OVERFLOW' : ''}, errors ${errors.length ? errors.join(' | ') : 'none'}`);
    wide.forEach(w => console.log('   ' + w));
    await page.screenshot({ path: `${out}-${name}.png`, fullPage: true });
  }
  await browser.close();
})();
