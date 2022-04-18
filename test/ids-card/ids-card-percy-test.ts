import percySnapshot from '@percy/puppeteer';

describe('Ids Card e2e Tests', () => {
  const url = 'http://localhost:4444/ids-card';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-card-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-card/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-card-standalone-css', { widths: [1280] });
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-card-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-card-new-contrast');
  });
});
