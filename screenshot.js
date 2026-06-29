const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 15000)); // wait for loading screen to disappear
  await page.screenshot({ path: '/Users/kavyajain/.gemini/antigravity-ide/brain/2eadb4b6-59ce-45af-81de-ce1dfb2ad2e3/test.png' });
  await browser.close();
  console.log("Screenshot saved!");
})();
