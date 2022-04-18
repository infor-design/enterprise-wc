import percySnapshot from '@percy/puppeteer';

describe('Ids Image Percy Tests', () => {
  const url = 'http://localhost:4444/ids-image';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-image-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-image/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-image-standalone-css', { widths: [1280] });
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-image-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-image-new-contrast');
  });
});
