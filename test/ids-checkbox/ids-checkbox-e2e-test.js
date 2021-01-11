const { percySnapshot } = require('@percy/puppeteer');

describe('Ids Checkbox e2e Tests', () => {
  const url = 'http://localhost:4444/ids-checkbox';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Checkbox Component');
  });

  it('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });

  it('should not have visual regressions (percy)', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    // -----
    const waitTillHTMLRendered = async (pg, timeout = 30000) => {
      const checkDurationMsecs = 1000;
      const maxChecks = timeout / checkDurationMsecs;
      let lastHTMLSize = 0;
      let checkCounts = 1;
      let countStableSizeIterations = 0;
      const minStableSizeIterations = 3;

      while (checkCounts++ <= maxChecks) {
        const html = await pg.content(); // eslint-disable-line
        const currentHTMLSize = html.length;

        const bodyHTMLSize = await pg.evaluate(() => document.body.innerHTML.length); // eslint-disable-line

        if (lastHTMLSize !== 0 && currentHTMLSize === lastHTMLSize) {
          countStableSizeIterations++;
        } else {
          countStableSizeIterations = 0; // reset the counter
        }

        if (countStableSizeIterations >= minStableSizeIterations) {
          break;
        }

        lastHTMLSize = currentHTMLSize;
        await pg.waitFor(checkDurationMsecs); // eslint-disable-line
      }
    };
    await waitTillHTMLRendered(page);
    await percySnapshot(page, 'ids-checkbox');
    // await percySnapshot(page, 'ids-checkbox');
  });
});
