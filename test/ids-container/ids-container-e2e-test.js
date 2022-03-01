describe('Ids Container e2e Tests', () => {
  const url = 'http://localhost:4444/ids-container';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Container Component');
  });

  it('should not have hidden', async () => {
    const isHidden = await page.$eval('ids-container', (container) => container.getAttribute('hidden'));
    expect(isHidden).toBe(null);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['page-has-heading-one'] });
  });
});
