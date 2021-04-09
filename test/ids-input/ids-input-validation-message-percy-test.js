import percySnapshot from '@percy/puppeteer';

describe('Ids Input Validation Message Percy Tests', () => {
  const url = 'http://localhost:4444/ids-input/test-validation-message';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await percySnapshot(page, 'ids-input-validation-message');
  });
});
