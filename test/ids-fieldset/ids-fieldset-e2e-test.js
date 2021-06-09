describe('Ids Fieldset e2e Tests', () => {
  const url = 'http://localhost:4444/ids-fieldset';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', () => {
    expect(page.title()).resolves.toMatch('IDS Fieldset Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });
});
