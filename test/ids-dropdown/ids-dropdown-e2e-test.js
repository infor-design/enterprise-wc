describe('Ids Dropdown e2e Tests', () => {
  const url = 'http://localhost:4444/ids-dropdown';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Dropdown Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    // Using newer aria-description
    await expect(page).toPassAxeTests({ disabledRules: ['aria-valid-attr', 'color-contrast', 'duplicate-id'] });
  });
});
