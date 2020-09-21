const { percySnapshot } = require('@percy/puppeteer');

describe('Ids Tag e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tag';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tag Component');
  });

  it('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-tag', { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });

  /*
    it('should not have visual regressions', async () => {
      const image = await page.screenshot();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: 'ids-tag-image-snapshot',
        comparisonMethod: 'ssim',
        customSnapshotsDir: __dirname,
        customDiffDir: `${__dirname}/diff`
    });
  */

  it('should not have visual regressions (percy)', async () => {
    const page = await browser.newPage();
    page.on('error', (err) => {
      console.log('error happen at the page: ', err);  //eslint-disable-line
    });

    page.on('pageerror', (pageerr) => {
      console.log('pageerror occurred: ', pageerr); //eslint-disable-line
    });

    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-tag', { waitUntil: 'load' });
    await percySnapshot(page, 'ids-tag');
  });
});
