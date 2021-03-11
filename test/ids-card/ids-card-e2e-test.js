import percySnapshot from '@percy/puppeteer';

describe('Ids Card e2e Tests', () => {
  const url = 'http://localhost:4444/ids-card';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Card Component');
  });

  it('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-card', { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });

  it('should not have visual regressions (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-card', { waitUntil: 'load' });
    await percySnapshot(page, 'ids-card');
  });
});
