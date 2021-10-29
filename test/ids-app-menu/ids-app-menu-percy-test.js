import percySnapshot from '@percy/puppeteer';

describe('Ids App Menu Percy Tests', () => {
  const url = 'http://localhost:4444/ids-app-menu';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('#app-menu-trigger').click();
    });
    await page.waitForSelector('ids-app-menu[visible]');
    await percySnapshot(page, 'ids-color-new-light');
  });
});
