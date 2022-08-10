import { AxePuppeteer } from '@axe-core/puppeteer';

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
});
