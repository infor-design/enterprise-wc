describe('Ids Treemap e2e Tests', () => {
  const url = 'http://localhost:4444/ids-treemap';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Treemap Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });

  it('should resize the width when the viewport changes', async () => {
    await page.setViewport({ width: 599, height: 9999, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(200);
    let containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
    let treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
    expect(treemapWidth).toEqual(containerWidth);

    await page.setViewport({ width: 1000, height: 9999, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(200);
    containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
    treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
    expect(treemapWidth).toEqual(containerWidth);
  });
});
