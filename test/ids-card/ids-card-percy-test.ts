import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Card e2e Tests', () => {
  const url = 'http://localhost:4444/ids-card/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-card-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-card/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-card-standalone-css', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-card-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-card-new-contrast');
  });
});
