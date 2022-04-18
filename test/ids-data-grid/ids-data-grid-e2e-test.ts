describe('Ids Data Grid e2e Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Data Grid Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await (expect(page) as any).toPassAxeTests();
  });
});

describe('Ids Data Grid Virtual Scroll e2e Tests', () => {
  const url = 'http://localhost:4444/ids-data-grid/virtual-scroll.html';

  it('should render some rows', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('pierce/.ids-data-grid-row');

    const count = (await page.$$('pierce/.ids-data-grid-row')).length;
    expect(count).toEqual(21);
  });
});
