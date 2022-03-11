describe('Ids Area Chart e2e Tests', () => {
  const url = 'http://localhost:4444/ids-axis-chart';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Axis Chart Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast'] });
  });

  it('should render custom colors', async () => {
    const colorUrl = 'http://localhost:4444/ids-axis-chart/colors.html';
    await page.goto(colorUrl, { waitUntil: ['networkidle2', 'load'] });

    const attr = await page.evaluate(() => {
      const styles = getComputedStyle(document.querySelector('ids-axis-chart').shadowRoot.querySelector('.chart-legend .color-1'));
      return styles.getPropertyValue('background-color');
    });
    expect(attr).toEqual('rgb(0, 84, 177)');
  });
});
