import percySnapshot from '@percy/puppeteer';

describe('Ids Bar Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-bar-chart/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-bar-chart-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await page.waitForTimeout(300);
    await percySnapshot(page, 'ids-bar-chart-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document as any).querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await page.waitForTimeout(300);
    await percySnapshot(page, 'ids-bar-chart-new-contrast');
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-bar-chart-colors');
  });

  it('should not have visual regressions with accessible patterns', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/patterns.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-bar-chart-patterns');
  });

  it('should not have visual regressions with stacked', async () => {
    await page.goto('http://localhost:4444/ids-bar-chart/stacked.html', { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-bar-chart-stacked');
  });
});
