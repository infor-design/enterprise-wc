import percySnapshot from '@percy/puppeteer';

describe('Ids Input Percy Tests', () => {
  const url = 'http://localhost:4444/ids-input';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-input-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-input-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-input-new-contrast');
  });

  it('should not have visual regressions in sizes', async () => {
    const urlSizes = 'http://localhost:4444/ids-input/test-sizes.html';

    await page.goto(urlSizes, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-input-sizes');
  });
});
