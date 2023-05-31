import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Bar Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-bar-chart/no-animation.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-new-light');
  });

  it('should not have visual regressions in new light theme (percy) for rotated axis', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await page.evaluate(() => {
      (document as any).querySelector('#no-animation-example').setAttribute('rotate-name-labels', '-65');
    });
    await pageSnapshot(page, 'ids-bar-chart-rotate-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-new-contrast');
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-colors');
  });

  it('should not have visual regressions with accessible patterns', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/patterns.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-patterns');
  });

  it('should not have visual regressions with stacked', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/stacked.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-stacked');
  });

  it('should not have visual regressions with grouped', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/grouped.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-grouped');
  });

  it('should not have visual regressions with horizontal', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/horizontal.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-horizontal');
  });

  it('should not have visual regressions with horizontal grouped', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/horizontal-grouped.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-horizontal-grouped');
  });

  it('should not have visual regressions with horizontal stacked', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/horizontal-stacked.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-horizontal-stacked');
  });

  it('should not have visual regressions with horizontal rotating name labels', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/horizontal-rotate-name-labels.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-bar-chart-horizontal-rotate-name-labels');
  });
});
