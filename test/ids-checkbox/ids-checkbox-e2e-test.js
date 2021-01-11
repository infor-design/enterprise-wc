const { percySnapshot } = require('@percy/puppeteer');

describe('Ids Checkbox e2e Tests', () => {
  const url = 'http://localhost:4444/ids-checkbox';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Checkbox Component');
  });

  it('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForSelector('.no-required-indicator').then(() => {
      percySnapshot(page, 'ids-checkbox');
    });
    // await percySnapshot(page, 'ids-checkbox');
  });
});
