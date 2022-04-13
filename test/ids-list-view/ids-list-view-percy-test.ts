import percySnapshot from '@percy/puppeteer';

describe('Ids List View Percy Tests', () => {
  const url = 'http://localhost:4444/ids-list-view';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-listview-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
    });
    await page.waitForTimeout(300); // approx. time for a theme switch to take effect
    await percySnapshot(page, 'ids-listview-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
    });
    await page.waitForTimeout(300); // approx. time for a theme switch to take effect
    await percySnapshot(page, 'ids-listview-new-contrast');
  });
});
