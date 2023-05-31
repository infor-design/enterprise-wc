import pageSnapshot from '../helpers/page-snapshot';

describe('Ids TreeMap Percy Tests', () => {
  const url = 'http://localhost:4444/ids-treemap/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-treemap-new-light');
  });
});
