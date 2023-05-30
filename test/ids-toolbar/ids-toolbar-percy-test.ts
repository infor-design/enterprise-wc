import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Toolbar Percy Tests', () => {
  const url = 'http://localhost:4444/ids-toolbar/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-toolbar-new-light');
  });

  it('should not have visual regressions in standalone css', async () => {
    await page.goto('http://localhost:4444/ids-toolbar/standalone-css.html', { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-toolbar-standalone-css', { widths: [1280] });
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-toolbar-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-toolbar-new-contrast');
  });

  it('renders overflow items correctly', async () => {
    await page.setViewport({ width: 450, height: 800 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(200); // Wait for everything to load
    await page.waitForSelector('ids-toolbar-more-actions');
    await page.click('ids-toolbar-more-actions');
    await page.waitForFunction(`document.querySelector('ids-toolbar-more-actions').hasAttribute('visible')`);
    await page.waitForTimeout(200);
    await pageSnapshot(page, 'ids-toolbar-overflow');
  });
});

describe('Ids Toolbar Formatter Percy Tests', () => {
  const url = 'http://localhost:4444/ids-toolbar/formatter.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-toolbar-formatter-new-light');
  });

  it.skip('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-dark');
    });
    await pageSnapshot(page, 'ids-toolbar-formatter-new-dark');
  });

  it.skip('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher')?.setAttribute('theme', 'default-contrast');
    });
    await pageSnapshot(page, 'ids-toolbar-formatter-new-contrast');
  });
});
