import percySnapshot from '@percy/puppeteer';

describe('Ids Line Chart Percy Tests', () => {
  const url = 'http://localhost:4444/ids-line-chart';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-line-chart-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-line-chart-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-line-chart-new-contrast');
  });

  it('should not have visual regressions with custom colors', async () => {
    await page.goto('http://localhost:4444/ids-line-chart/colors.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await percySnapshot(page, 'ids-line-chart-colors');
  });

  it('should not have visual regressions when responsive', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/responsive.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await percySnapshot(page, 'ids-line-chart-responsive');
  });
});
