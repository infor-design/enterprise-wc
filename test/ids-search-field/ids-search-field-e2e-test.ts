import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Search Field e2e Tests', () => {
  const url = 'http://localhost:4444/ids-search-field/example.html';

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Search Field Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['color-contrast', 'nested-interactive']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-search-field id="test" dirty-tracker label="Products" value="Anti-virus Software" validate="required"></ids-search-field>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
