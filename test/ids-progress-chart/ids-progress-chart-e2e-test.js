describe('Ids Progress Chart e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-progress-chart';

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Progress Chart Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });
});
