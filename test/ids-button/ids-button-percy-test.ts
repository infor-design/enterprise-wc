import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Button Percy Tests', () => {
  const url = 'http://localhost:4444/ids-button/matrix.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-button-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-button/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-button-standalone-css', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-button-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-button-new-contrast');
  });
});
