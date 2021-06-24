describe('Ids Swipe Action e2e Tests', () => {
  const url = 'http://localhost:4444/ids-swipe-action';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Swipe Action Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    // { disabledRules: ['nested-interactive'] }
    await expect(page).toPassAxeTests();
  });
});
