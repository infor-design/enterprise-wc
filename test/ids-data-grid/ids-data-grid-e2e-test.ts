import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Data Grid e2e Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Data Grid Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });
});

describe('Ids Data Grid Virtual Scroll e2e Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid/virtual-scroll.html';

  it('should render some rows', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.ids-data-grid-row');

    const count = (await page.$$('pierce/.ids-data-grid-row')).length;
    expect(count).toEqual(63);
  });
});
