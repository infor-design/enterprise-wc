describe('Ids Button e2e Tests', () => {
  const url = 'http://localhost:4444/ids-button';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(2000);
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Button Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });
});
