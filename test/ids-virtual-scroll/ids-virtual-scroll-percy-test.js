import percySnapshot from '@percy/puppeteer';

describe('Ids Virtual Scroll Percy Tests', () => {
  const url = 'http://localhost:4444/ids-virtual-scroll';

  it('should not have visual regressions (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('.ids-data-grid-row');
    await percySnapshot(page, 'ids-virtual-scroll');
  });
});
