import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Trigger Field Percy Tests', () => {
  it('should not have visual regressions in sizes', async () => {
    const urlSizes = 'http://localhost:4444/ids-trigger-field/test-sizes.html';

    await page.goto(urlSizes, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-trigger-field-sizes');
  });
});
