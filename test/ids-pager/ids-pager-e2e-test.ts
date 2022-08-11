import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Pager e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-pager/example.html';
  const sandboxUrl = 'http://localhost:4444/ids-pager/sandbox.html';

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Pager Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['color-contrast', 'region']).analyze();
    expect(results.violations.length).toBe(0);

    await page.goto(sandboxUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results2 = await new AxePuppeteer(page).disableRules(['color-contrast', 'region']).analyze();
    expect(results2.violations.length).toBe(0);
  });
});
