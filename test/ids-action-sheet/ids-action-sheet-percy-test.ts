import percySnapshot from '@percy/puppeteer';

describe('Ids Action Sheet Percy Tests', () => {
  const url = 'http://localhost:4444/ids-action-sheet/example.html';

  it('should not have visual regressions when cancel button is not visible', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-action-sheet-example', { widths: [375] });
  });
});
