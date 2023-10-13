import pageSnapshot from '../helpers/page-snapshot';

describe('Ids App Menu Percy Tests', () => {
  const url = 'http://localhost:4444/ids-app-menu/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document.querySelector('#app-menu-trigger') as any).click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await pageSnapshot(page, 'ids-app-menu-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await page.evaluate(() => {
      (document.querySelector('#app-menu-trigger') as any).click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await pageSnapshot(page, 'ids-app-menu-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await page.evaluate(() => {
      (document.querySelector('#app-menu-trigger') as any).click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await pageSnapshot(page, 'ids-app-menu-new-contrast');
  });
});
