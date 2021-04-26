describe('Ids Popup Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-popup-menu';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Popup Menu Component');
  });

  // @TODO: Revisit and figure out accessibility issues
  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });
});
