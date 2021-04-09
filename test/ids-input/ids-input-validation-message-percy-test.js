import percySnapshot from '@percy/puppeteer';

describe('Ids Input Validation Message Percy Tests', () => {
  const url = 'http://localhost:4444/ids-input/test-validation-message';

  it('should not have visual regressions (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await percySnapshot(page, 'ids-input-validation-message');
  });
});
