import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Line Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-line-chart/no-animation.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.waitForSelector('pierce/.chart-legend');
    await page.waitForSelector('[mode="light"]');
    await pageSnapshot(page, 'ids-line-chart-new-light');
  });

  it('should not have visual regressions in new light theme (percy) for rotated axis', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await page.evaluate(() => {
      (document as any).querySelector('#no-animation-example').setAttribute('rotate-name-labels', '-65');
    });
    await pageSnapshot(page, 'ids-line-chart-rotate-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForSelector('[mode="dark"]');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForSelector('[mode="contrast"]');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-new-contrast');
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-line-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-colors');
  });

  it('should not have visual regressions when responsive short', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/responsive.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-line-chart-responsive-short');
  });

  it('should not have visual regressions when responsive abbreviated', async () => {
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
