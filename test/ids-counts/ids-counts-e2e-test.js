describe('Ids Counts e2e Tests', () => {
  const url = 'http://localhost:4444/ids-counts/example-not-actionable';

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Counts Component');
  });
});
