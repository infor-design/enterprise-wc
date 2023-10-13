import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Error Page Percy Tests', () => {
  const url = 'http://localhost:4444/ids-error-page/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(200);
    await pageSnapshot(page, 'ids-error-page-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await page.waitForTimeout(200);
    await pageSnapshot(page, 'ids-error-page-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await page.waitForTimeout(200);
    await pageSnapshot(page, 'ids-error-page-new-contrast');
  });
});
