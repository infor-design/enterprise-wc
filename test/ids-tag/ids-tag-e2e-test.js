describe('Google', () => {
  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:4444/ids-tag', { waitUntil: 'load' });
  });

  test('should display "Normal Tag" text in page', async () => {
    // await jestPuppeteer.debug();
    expect(1 + 2).toBe(3);
  });

  test('should be able to tab to tag and dismiss', async () => {
    // await jestPuppeteer.debug();
    expect(1 + 2).toBe(3);
  });
});
