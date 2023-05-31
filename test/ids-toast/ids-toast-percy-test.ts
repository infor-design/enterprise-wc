import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Toast Percy Tests', () => {
  const url = 'http://localhost:4444/ids-toast/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document.querySelector('#btn-toast-demo') as any).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-toast-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
      (document.querySelector('#btn-toast-demo') as any).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-toast-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
      (document.querySelector('#btn-toast-demo') as any).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-toast-new-contrast');
  });
});
