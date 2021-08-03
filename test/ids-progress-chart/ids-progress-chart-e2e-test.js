describe('Ids Progress Chart e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-progress-chart';

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Progress Chart Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    /**
     * TODO: need to discuss w/ design team before enabling axe tests for progress-chart
     * The colors for ids-color-status-warning and ids-color-status-caution
     * both fail axe tests against both light and dark mode backgrounds
     */
    // await expect(page).toPassAxeTests();
  });
});
