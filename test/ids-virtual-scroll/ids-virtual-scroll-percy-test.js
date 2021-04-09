import percySnapshot from '@percy/puppeteer';

describe('Ids Virtual Scroll Percy Tests', () => {
  const url = 'http://localhost:4444/ids-virtual-scroll';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForSelector('.ids-data-grid-row');
    await percySnapshot(page, 'ids-virtual-scroll');
  });
});
