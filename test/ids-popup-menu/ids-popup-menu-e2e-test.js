const { percySnapshot } = require('@percy/puppeteer');

describe('Ids Popup Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-popup-menu';
  jestPuppeteer.debug();

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it.skip('should not have errors', async () => {
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
    await page.goto('http://localhost:4444/ids-popup-menu/selected-state', { waitUntil: 'domcontentloaded' });

    // detect the page body and click
    await page.mouse.click(100, 100, { button: 'right' });

    // await page.waitForSelector('ids-popup-menu', { visible: true, timeout: 2000 });
    await percySnapshot(page, 'ids-popup-menu');
  });

  it.skip('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-popup-menu/standalone-css', { waitUntil: 'domcontentloaded' });
    await percySnapshot(page, 'ids-popup-menu-css');
  });
});
