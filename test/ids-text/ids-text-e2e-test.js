describe('Ids Text e2e Tests', () => {
  const url = 'http://localhost:4444/ids-text';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Text Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await expect(page).toPassAxeTests();
  });
});
