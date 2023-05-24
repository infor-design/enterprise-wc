import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Search Field Percy Tests', () => {
  const url = 'http://localhost:4444/ids-search-field/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.waitForSelector('pierce/.ids-input.color-variant-alternate .ids-input-field');
    await pageSnapshot(page, 'ids-search-field-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await page.waitForSelector('pierce/.ids-input.color-variant-alternate .ids-input-field');
    await pageSnapshot(page, 'ids-search-field-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });

    await page.waitForSelector('pierce/.ids-input.color-variant-alternate .ids-input-field');
    await pageSnapshot(page, 'ids-search-field-new-contrast');
  });
});
