import percySnapshot from '@percy/puppeteer';

describe('Ids Tooltip Percy Tests', () => {
  const url = 'http://localhost:4444/ids-tooltip';
  const showTooltip = async () => {
    await page.focus('#button-1');
    await page.waitForSelector('#tooltip-example', {
      visible: true,
    });
  };

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await showTooltip();
    await percySnapshot(page, 'ids-tooltip-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await showTooltip();
    await percySnapshot(page, 'ids-tooltip-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await showTooltip();
    await percySnapshot(page, 'ids-tooltip-new-contrast');
  });
});
