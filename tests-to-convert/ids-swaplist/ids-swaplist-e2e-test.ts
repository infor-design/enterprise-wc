import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Swap List e2e Tests', () => {
  const url = 'http://localhost:4444/ids-swaplist/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it.skip('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Swaplist Component');
    const count = (await page.$$('pierce/ids-swappable-item')).length;
    expect(count).toEqual(15);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['scrollable-region-focusable']).analyze();
    expect(results.violations.length).toBe(0);
  });

});
