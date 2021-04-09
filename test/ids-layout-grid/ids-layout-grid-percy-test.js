import percySnapshot from '@percy/puppeteer';

describe('Ids Layout Grid Percy Tests', () => {
  const url = 'http://localhost:4444/ids-layout-grid';

  it('should not have visual regressions (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await percySnapshot(page, 'ids-layout-grid');
  });
});
