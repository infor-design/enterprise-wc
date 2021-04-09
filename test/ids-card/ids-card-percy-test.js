import percySnapshot from '@percy/puppeteer';

describe('Ids Card e2e Tests', () => {
  const url = 'http://localhost:4444/ids-card';

  it('should not have visual regressions in new light theme (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await percySnapshot(page, 'ids-card-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-card-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-card-new-contrast');
  });
});
