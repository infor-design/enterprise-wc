import percySnapshot from '@percy/puppeteer';

describe('Ids Input Validation Message Percy Tests', () => {
  const url = 'http://localhost:4444/ids-input/test-validation-message';

  it('should not have visual regressions (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await percySnapshot(page, 'ids-input-validation-message');
  });
});
