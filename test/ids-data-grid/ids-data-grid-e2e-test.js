const percySnapshot = require('@percy/puppeteer');

describe('Ids Data Grid e2e Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Data Grid Component');
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
    await percySnapshot(page, 'ids-data-grid');
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-data-grid/standalone-css', { waitUntil: 'load' });
    await percySnapshot(page, 'ids-data-grid-css');
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-data-grid/virtual-scroll', { waitUntil: 'load' });
    await percySnapshot(page, 'ids-data-grid-virtual-scroll');
  });
});
