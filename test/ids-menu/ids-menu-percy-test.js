import percySnapshot from '@percy/puppeteer';

describe('Ids Menu Percy Tests', () => {
  const url = 'http://localhost:4444/ids-menu';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await percySnapshot(page, 'ids-menu-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-menu-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-menu-new-contrast');
  });
});
