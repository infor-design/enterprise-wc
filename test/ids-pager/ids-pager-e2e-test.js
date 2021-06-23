describe('Ids Pager e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-pager';
  const sandboxUrl = 'http://localhost:4444/ids-pager/sandbox';

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Pager Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests();

    await page.goto(sandboxUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests();
  });
});
