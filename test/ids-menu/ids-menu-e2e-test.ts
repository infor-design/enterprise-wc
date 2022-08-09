import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-menu/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Menu Component');
  });

  // @TODO: Revisit and figure out accessibility issues
  it.skip('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });
});
