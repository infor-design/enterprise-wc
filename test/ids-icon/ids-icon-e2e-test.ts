import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Icon e2e Tests', () => {
  const url = 'http://localhost:4444/ids-icon/example.html?count=1';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Icon Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['color-contrast']).analyze();
    expect(results.violations.length).toBe(0);
  });
});
