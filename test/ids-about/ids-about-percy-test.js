import percySnapshot from '@percy/puppeteer';

describe('Ids About Percy Tests', () => {
  const url = 'http://localhost:4444/ids-about';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('#about-example-trigger').click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await percySnapshot(page, 'ids-about-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      document.querySelector('#about-example-trigger').click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await percySnapshot(page, 'ids-about-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      document.querySelector('#about-example-trigger').click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await percySnapshot(page, 'ids-about-new-contrast');
  });
});
