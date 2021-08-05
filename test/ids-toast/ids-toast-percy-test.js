import percySnapshot from '@percy/puppeteer';

describe('Ids Toast Percy Tests', () => {
  const url = 'http://localhost:4444/ids-toast';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('#btn-toast-demo').click();
    });
    await percySnapshot(page, 'ids-toast-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
      document.querySelector('#btn-toast-demo').click();
    });
    await percySnapshot(page, 'ids-toast-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
      document.querySelector('#btn-toast-demo').click();
    });
    await percySnapshot(page, 'ids-toast-new-contrast');
  });
});
