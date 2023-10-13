import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Pie Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-pie-chart/no-animation.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await page.waitForSelector('[mode="light"]');
    await pageSnapshot(page, 'ids-pie-chart-new-light', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForSelector('[mode="dark"]');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-new-dark', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForSelector('[mode="contrast"]');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-new-contrast', { widths: [1280] });
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-pie-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-colors', { widths: [1280] });
  });

  it('should not have visual regressions with accessible patterns', async () => {
    await page.goto('http://localhost:4444/ids-pie-chart/patterns.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-patterns', { widths: [1280] });
  });

  it('should not have visual regressions with donuts', async () => {
    await page.goto('http://localhost:4444/ids-pie-chart/donut.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-pie-chart-donut', { widths: [1280] });
  });
});
