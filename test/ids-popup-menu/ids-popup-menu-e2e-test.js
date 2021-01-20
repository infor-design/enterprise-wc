const { percySnapshot } = require('@percy/puppeteer');

describe('Ids Popup Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-popup-menu';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Popup Menu Component');
  });

  // @TODO: Revisit and figure out accessibility issues
  it.skip('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await percySnapshot(page, 'ids-popup-menu');
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-popup-menu/standalone-css', { waitUntil: 'domcontentloaded' });
    await percySnapshot(page, 'ids-popup-menu-css');
  });
});
