import percySnapshot from '@percy/puppeteer';

describe('Ids Header Percy Tests', () => {
  const url = 'http://localhost:4444/ids-header';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(30); // Wait for Search Field to change variants/types
    await percySnapshot(page, 'ids-header-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForTimeout(30); // Wait for Search Field to change variants/types
    await percySnapshot(page, 'ids-header-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForTimeout(30); // Wait for Search Field to change variants/types
    await percySnapshot(page, 'ids-header-new-contrast');
  });
});
