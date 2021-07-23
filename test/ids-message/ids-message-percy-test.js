import percySnapshot from '@percy/puppeteer';

describe('Ids Message Percy Tests', () => {
  const url = 'http://localhost:4444/ids-message';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('#message-example-error-trigger').click();
    });
    await page.waitFor(200); // approx. time for a Modal to show
    await percySnapshot(page, 'ids-message-new-light');
  });
});
