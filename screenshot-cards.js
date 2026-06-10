const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'xiaohongshu-images');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const FILE = `file:///${__dirname.replace(/\\/g, '/')}/xiaohongshu-day001.html`;

const CARDS = [
  { label: '01-封面-钩子',       selector: '.c1' },
  { label: '02-代入感',          selector: '.c2' },
  { label: '03-转折-AI出场',     selector: '.c3' },
  { label: '04-过程步骤',        selector: '.c4' },
  { label: '05-成果展示',        selector: '.c5' },
  { label: '06-留言板插曲',      selector: '.c6' },
  { label: '07-知识总结',        selector: '.c7' },
  { label: '08-金句感悟',        selector: '.c8' },
  { label: '09-关注引导',        selector: '.c9' },
];

(async () => {
  console.log('启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 60000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();

  // 设置视口足够大，确保所有卡片都能渲染
  await page.setViewport({ width: 1200, height: 6000, deviceScaleFactor: 3 });
  await page.goto(FILE, { waitUntil: 'networkidle0' });

  // 等待字体和样式加载
  await new Promise(r => setTimeout(r, 1500));

  for (let i = 0; i < CARDS.length; i++) {
    const { label, selector } = CARDS[i];
    const elements = await page.$$(selector);
    if (!elements.length) {
      console.log(`⚠️  找不到 ${selector}，跳过`);
      continue;
    }
    // 取第一个匹配元素（每种类型只有一张）
    const el = elements[0];
    const outPath = path.join(OUTPUT_DIR, `DAY001-${label}.jpg`);
    await el.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 95,
    });
    console.log(`✅ 已保存：DAY001-${label}.jpg`);
  }

  await browser.close();
  console.log(`\n🎉 全部完成！图片保存在：\n${OUTPUT_DIR}`);
})();
