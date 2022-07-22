import percySnapshot from '@percy/puppeteer';

describe('Ids List Builder Percy Tests', () => {
  const url = 'http://localhost:4444/ids-list-builder/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'light');
    });
    await page.waitForSelector('pierce/#button-delete');
    await percySnapshot(page, 'ids-list-builder-new-light', { widths: [1280] });
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
    });
    await page.waitForSelector('pierce/#button-delete');
    await percySnapshot(page, 'ids-list-builder-new-dark', { widths: [1280] });
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
    });
    await page.waitForSelector('pierce/#button-delete');
    await percySnapshot(page, 'ids-list-builder-new-contrast', { widths: [1280] });
  });
});
