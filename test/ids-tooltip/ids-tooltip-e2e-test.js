describe('Ids Tooltip e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tooltip';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: 'load' });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tooltip Component');
  });

  it('should open on focus', async () => {
    await page.focus('#button-1');
    const element = await page.waitForSelector('#tooltip-example', {
      visible: true,
    });
    const value = await element.evaluate((el) => el.textContent);
    await expect(value).toEqual('Additional Information');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests();
  });
});
