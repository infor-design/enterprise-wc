import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Line Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-line-chart/no-animation.html';

  test('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-line-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-colors');
  });

  test('should not have visual regressions when responsive short', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/responsive.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-responsive-short');
  });

  test('should not have visual regressions when responsive abbreviated', async () => {
    await page.setViewport({
      width: 270,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/responsive.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-responsive-abbreviated');
  });
});
