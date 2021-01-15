const { percySnapshot } = require('@percy/puppeteer');

describe('Ids List View e2e Tests', () => {
  const url = 'http://localhost:4444/ids-list-view';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS List View Component');
  });

  it('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    page.on('error', (error) => {
      console.log(`Chrome Handler: ${error}`);
      global.chromepool.release(browser);
    });
    await expect(page).toPassAxeTests();
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await percySnapshot(page, 'ids-list-view');
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-list-view/standalone-css', { waitUntil: 'domcontentloaded' });
    await percySnapshot(page, 'ids-list-view-css');
  });
});
