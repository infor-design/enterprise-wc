import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Area Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-area-chart/no-animation.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-area-chart-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-area-chart-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForSelector('pierce/.chart-legend');
    await pageSnapshot(page, 'ids-area-chart-new-contrast');
  });
});
