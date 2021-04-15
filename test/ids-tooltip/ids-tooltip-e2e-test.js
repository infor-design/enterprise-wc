describe('Ids Tooltip e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tag';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tag Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });
});
