describe('Ids Pager e2e Tests', () => {
  const url = 'http://localhost:4444/ids-pager';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Pager Component');
  });

  it('should pass Axe accessibility tests', async () => {
    page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests();
  });
});
