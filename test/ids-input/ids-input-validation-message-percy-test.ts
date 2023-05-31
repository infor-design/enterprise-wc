import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Input Validation Message Percy Tests', () => {
  const url = 'http://localhost:4444/ids-input/validation-message.html';

  it('should not have visual regressions (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-input-validation-message');
  });
});
