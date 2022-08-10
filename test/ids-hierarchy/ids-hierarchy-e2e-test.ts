import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Hierarchy e2e test', () => {
  const url = 'http://localhost:4444/ids-hierarchy/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Hierarchy Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const results = await new AxePuppeteer(page).disableRules(['color-contrast', 'aria-required-children', 'aria-required-parent', 'nested-interactive']).analyze();
    expect(results.violations.length).toBe(0);
  });
});
