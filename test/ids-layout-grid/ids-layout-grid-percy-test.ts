import percySnapshot from '@percy/puppeteer';

describe('Ids Layout Grid Percy Tests', () => {
  const url = 'http://localhost:4444/ids-layout-grid';

  it('should not have visual regressions (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-layout-grid');
  });

  it.skip('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-layout-grid/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-layout-grid-standalone-css', { widths: [1280] });
  });
});
