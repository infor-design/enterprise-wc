import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Tooltip Percy Tests', () => {
  const url = 'http://localhost:4444/ids-tooltip/standalone-css.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-tooltip-new-light');
  });
});
