import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Message Percy Tests', () => {
  const url = 'http://localhost:4444/ids-message/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document.querySelector('#message-example-error-trigger') as HTMLElement).click();
    });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-message-new-light', { widths: [1280] });
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-message/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(200); // approx. time for a Modal to show
    await pageSnapshot(page, 'ids-message-standalone-css', { widths: [1280] });
  });
});
