import percySnapshot from '@percy/puppeteer';

describe('Ids Tooltip Percy Tests', () => {
  const url = 'http://localhost:4444/ids-tooltip/standalone-css';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-tooltip-new-light');
  });
});
