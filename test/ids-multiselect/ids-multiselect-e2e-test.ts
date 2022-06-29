describe('Ids Multiselect e2e Tests', () => {
  const url = 'http://localhost:4444/ids-multiselect';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Multiselect Component');
  });

  it('Should pass an Axe accessibility test', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await (expect(page) as any).toPassAxeTests();
  });
});
