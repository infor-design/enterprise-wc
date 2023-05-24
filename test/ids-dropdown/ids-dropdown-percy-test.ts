import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Dropdown Percy Tests', () => {
  const url = 'http://localhost:4444/ids-dropdown/example.html';
  const urlSizes = 'http://localhost:4444/ids-dropdown/sizes.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-dropdown-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-dropdown-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-dropdown-new-contrast');
  });

  it('should not have visual regressions on Sizes example in light theme (percy)', async () => {
    await page.goto(urlSizes, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-dropdown-sizes-light');
  });
});
