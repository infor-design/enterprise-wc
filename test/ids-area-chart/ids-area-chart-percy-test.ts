import percySnapshot from '@percy/puppeteer';

describe('Ids Area Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-area-chart/no-animation.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await percySnapshot(page, 'ids-area-chart-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForSelector('pierce/.chart-legend');
    await percySnapshot(page, 'ids-area-chart-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForSelector('pierce/.chart-legend');
    await percySnapshot(page, 'ids-area-chart-new-contrast');
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-area-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await percySnapshot(page, 'ids-area-chart-colors');
  });
});
