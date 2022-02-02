import percySnapshot from '@percy/puppeteer';

describe('Ids App Menu Percy Tests', () => {
  const url = 'http://localhost:4444/ids-app-menu';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('#app-menu-trigger').click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await percySnapshot(page, 'ids-app-menu-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.evaluate(() => {
      document.querySelector('#app-menu-trigger').click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await percySnapshot(page, 'ids-app-menu-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.evaluate(() => {
      document.querySelector('#app-menu-trigger').click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await percySnapshot(page, 'ids-app-menu-new-contrast');
  });
});
