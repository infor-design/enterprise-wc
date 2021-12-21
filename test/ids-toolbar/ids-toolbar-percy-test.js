import percySnapshot from '@percy/puppeteer';

describe('Ids Toolbar Percy Tests', () => {
  const url = 'http://localhost:4444/ids-toolbar';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-toolbar-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-toolbar-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-toolbar-new-contrast');
  });

  it('renders overflow items correctly', async () => {
    await page.setViewport({ width: 450, height: 800 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-toolbar-more-actions');
    await page.click('ids-toolbar-more-actions');
    await page.waitForFunction(`document.querySelector('ids-toolbar-more-actions').hasAttribute('visible')`);
    await percySnapshot(page, 'ids-toolbar-overflow');
  });
});

describe('Ids Toolbar Formatter Percy Tests', () => {
  const url = 'http://localhost:4444/ids-toolbar/formatter.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-toolbar-formatter-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-toolbar-formatter-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-toolbar-formatter-new-contrast');
  });
});
