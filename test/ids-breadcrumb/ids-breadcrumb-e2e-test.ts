import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Breadcrumb e2e Tests', () => {
  const url = 'http://localhost:4444/ids-breadcrumb/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Breadcrumb Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    // @TODO: Remove setting after #669 is fixed
    const results = await new AxePuppeteer(page).disableRules(['color-contrast', 'aria-required-children', 'aria-required-parent']).analyze();
    expect(results.violations.length).toBe(0);
  });
});
