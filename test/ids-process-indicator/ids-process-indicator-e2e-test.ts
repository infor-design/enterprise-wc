import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Process Indicator e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-process-indicator/example.html';
  const emptyLabelExampleUrl = `http://localhost:4444/ids-process-indicator/empty-label.html`;

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Process Indicator Component');
    await page.goto(emptyLabelExampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['color-contrast']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should show hide details on resize', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });

    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.waitForSelector('ids-process-indicator-step [slot="detail"]', {
      visible: false,
    });
    const size = await page.evaluate('document.querySelector("ids-process-indicator-step [slot=\'detail\']").style.width');
    expect(Number(size.replace('px', ''))).toBe(0);
  });
});
