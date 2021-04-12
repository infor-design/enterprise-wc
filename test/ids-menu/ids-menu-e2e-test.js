describe('Ids Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-menu';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Menu Component');
  });

  // @TODO: Revisit and figure out accessibility issues
  it.skip('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await expect(page).toPassAxeTests();
  });
});
