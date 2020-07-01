describe('Google', () => {
  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:4444/ids-tag', { waitUntil: 'load' });
  });

  test('should display "Normal Tag" text in page', async () => {
    await expect(page).toMatch('Normal Tag');
  });
});
