import pageSnapshot from '../helpers/page-snapshot';

describe('Ids List View Percy Tests', () => {
  const url = 'http://localhost:4444/ids-list-view/example.html';

  it.skip('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(200);
    await pageSnapshot(page, 'ids-listview-new-light');
  });
});
