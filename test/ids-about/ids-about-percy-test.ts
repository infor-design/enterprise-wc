import pageSnapshot from '../helpers/page-snapshot';

describe('Ids About Percy Tests', () => {
  const url = 'http://localhost:4444/ids-about/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document.querySelector('#about-example-trigger') as any).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-about-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-about/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-about-standalone-css', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      (document.querySelector('#about-example-trigger') as any).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-about-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      (document.querySelector('#about-example-trigger') as any).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-about-new-contrast');
  });
});
