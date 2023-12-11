import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Tabs Percy Tests (Vertical Tabs)', () => {
  const url = 'http://localhost:4444/ids-tabs/vertical.html';

  it.skip('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
    await page.waitForSelector('ids-tab[selected]');
    await pageSnapshot(page, 'ids-tabs-vertical-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
    await page.waitForSelector('ids-tab[selected]');
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-tabs-vertical-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
    await page.waitForSelector('ids-tab[selected]');
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-tabs-vertical-new-contrast');
  });
});
