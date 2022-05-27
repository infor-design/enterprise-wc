import percySnapshot from '@percy/puppeteer';

describe('Ids Tabs Percy Tests (Header Tabs)', () => {
  const url = 'http://localhost:4444/ids-tabs/header-tabs.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForTimeout(60);
    await percySnapshot(page, 'ids-tabs-header-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForTimeout(60);
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-tabs-header-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForTimeout(60);
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-tabs-header-new-contrast');
  });
});
