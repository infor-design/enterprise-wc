import percySnapshot from '@percy/puppeteer';

describe('Ids Data Grid Percy Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await percySnapshot(page, 'ids-data-grid-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-data-grid-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-data-grid-new-contrast');
  });
});

describe('Ids Data Grid List Style Percy Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid/list-style.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await percySnapshot(page, 'ids-data-grid-list-style-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
    });
    await percySnapshot(page, 'ids-data-grid-list-style-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await page.evaluate(() => {
      document.querySelector('ids-theme-switcher').setAttribute('mode', 'contrast');
    });
    await percySnapshot(page, 'ids-data-grid-list-style-new-contrast');
  });
});

describe('Ids Data Grid Virtual Scroll Percy Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid/virtual-scroll.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('ids-layout-grid-cell');
    await percySnapshot(page, 'ids-data-grid-virtual-scroll-new-light');
  });
});
