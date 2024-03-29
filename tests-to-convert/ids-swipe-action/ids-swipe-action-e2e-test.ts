import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Swipe Action Tests', () => {
  const url = 'http://localhost:4444/ids-swipe-action/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  test('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Swipe Action Component');
  });

  it.skip('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['aria-hidden-focus']).analyze();
    expect(results.violations.length).toBe(0);
  });
});
