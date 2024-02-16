import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Pie Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-pie-chart/no-animation.html';

  test('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-pie-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-colors', { widths: [1280] });
  });

  test('should not have visual regressions with accessible patterns', async () => {
    await page.goto('http://localhost:4444/ids-pie-chart/patterns.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-patterns', { widths: [1280] });
  });

  test('should not have visual regressions with donuts', async () => {
    await page.goto('http://localhost:4444/ids-pie-chart/donut.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-donut', { widths: [1280] });
  });
});
