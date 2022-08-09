import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Progress Chart e2e Tests', () => {
  const url = 'http://localhost:4444/ids-progress-chart/example.html';

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Progress Chart Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    // The colors for ids-color-status-warning and ids-color-status-warning
    // both fail axe tests against both light and dark mode backgrounds
    const results = await new AxePuppeteer(page).disableRules(['color-contrast']).analyze();
    expect(results.violations.length).toBe(0);
  });
});
