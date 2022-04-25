describe('Ids Badge e2e Tests', () => {
  const url = 'http://localhost:4444/ids-badge';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Badge Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    // @TODO: Remove setting after #669 is fixed
    await (expect(page) as any).toPassAxeTests({ disabledRules: ['color-contrast'] });
  });
});
