import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Scroll View e2e Tests', () => {
  const url = 'http://localhost:4444/ids-scroll-view/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Scroll View Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['scrollable-region-focusable']).analyze();
    expect(results.violations.length).toBe(0);
  });
});
