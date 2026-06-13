const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'DAY003');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const FILE = `file:///${__dirname.replace(/\\/g, '/')}/xiaohongshu-day003.html`;

const CARDS = [
  { label: '01-封面',     selector: '.c01' },
  { label: '02-改之前',   selector: '.c02' },
  { label: '03-改之后',   selector: '.c03' },
  { label: '04-对话过程', selector: '.c04' },
];

(async () => {
  console.log('启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 2000, deviceScaleFactor: 3 });
  await page.goto(FILE, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  for (const { label, selector } of CARDS) {
    const el = await page.$(selector);
    if (!el) { console.log(`⚠️  找不到 ${selector}`); continue; }
    const outPath = path.join(OUTPUT_DIR, `DAY003-${label}.jpg`);
    await el.screenshot({ path: outPath, type: 'jpeg', quality: 96 });
    console.log(`✅ ${label}`);
  }

  await browser.close();
  console.log(`\n🎉 完成！保存在 DAY003/`);
})();
