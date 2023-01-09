import percySnapshot from '@percy/puppeteer';

describe('Ids Button Percy Tests', () => {
  const url = 'http://localhost:4444/ids-button/matrix.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-button-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-button/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-button-standalone-css', { widths: [1280] });
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-button-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-button-new-contrast');
  });
});
