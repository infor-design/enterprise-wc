/* eslint-disable no-underscore-dangle */
import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Wizard Percy Tests', () => {
  const url = 'http://localhost:4444/ids-wizard/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await pageSnapshot(page, 'ids-wizard-new-light', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-wizard-new-dark', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-wizard-new-contrast', { widths: [1280] });
  });
});
