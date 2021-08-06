describe('Ids Summary Form e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-summary-form';

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Summary Form Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });

    await expect(page).toPassAxeTests();
  });
});
