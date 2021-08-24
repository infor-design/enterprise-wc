import percySnapshot from '@percy/puppeteer';

describe('Ids Trigger Field Percy Tests', () => {
  it('should not have visual regressions in sizes', async () => {
    const urlSizes = 'http://localhost:4444/ids-trigger-field/test-sizes.html';

    await page.goto(urlSizes, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-trigger-field-sizes');
  });
});
