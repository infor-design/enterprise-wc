import percySnapshot from '@percy/puppeteer';

describe('Ids Tabs Percy Tests', () => {
  const url = 'http://localhost:4444/ids-tabs';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await percySnapshot(page, 'ids-tabs-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-tabs-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-tabs-new-contrast');
  });
});
