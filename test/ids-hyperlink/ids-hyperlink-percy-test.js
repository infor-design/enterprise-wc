import percySnapshot from '@percy/puppeteer';

describe('Ids Hyperlink e2e Tests', () => {
  const url = 'http://localhost:4444/ids-hyperlink';

  it('should not have visual regressions in new light theme (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await percySnapshot(page, 'ids-hyperlink-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-hyperlink-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-hyperlink-new-contrast');
  });
});
