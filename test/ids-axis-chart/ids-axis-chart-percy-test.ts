import percySnapshot from '@percy/puppeteer';

describe('Ids Axis Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-axis-chart/no-animation.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await percySnapshot(page, 'ids-axis-chart-new-light');
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-axis-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await percySnapshot(page, 'ids-axis-chart-colors');
  });
});
