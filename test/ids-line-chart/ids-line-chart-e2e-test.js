describe('Ids Line Chart e2e Tests', () => {
  const url = 'http://localhost:4444/ids-line-chart';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Line Chart Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast'] });
  });

  it('should not be responsive if not set', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart', { waitUntil: ['networkidle2', 'load'] });
    const h = await page.evaluate('document.querySelector("ids-line-chart").height');
    const w = await page.evaluate('document.querySelector("ids-line-chart").width');
    expect(h).toBe(500);
    expect(w).toBe(800);
  });

  it('should be responsive', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/responsive.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    const h = await page.evaluate('document.querySelector("ids-line-chart").height');
    const w = await page.evaluate('document.querySelector("ids-line-chart").width');
    expect(h).toBeLessThan(301);
    expect(w).toBeLessThan(330);
  });

  it('should be responsive even when the container is hidden', async () => {
    await page.evaluate('document.querySelector("ids-container").hidden = true');
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.evaluate('document.querySelector("ids-line-chart").width = "inherit"');
    await page.evaluate('document.querySelector("ids-line-chart").height = "inherit"');
    await page.evaluate('document.querySelector("ids-container").style.width = "300px"');
    await page.evaluate('document.querySelector("ids-container").style.height = "600px"');

    const h = await page.evaluate('document.querySelector("ids-line-chart").height');
    const w = await page.evaluate('document.querySelector("ids-line-chart").width');
    expect(h).toBeLessThan(340);
    expect(w).toBeLessThan(330);
  });
});
