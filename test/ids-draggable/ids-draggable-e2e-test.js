describe('Ids Draggable e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-draggable';
  const sandboxUrl = 'http://localhost:4444/ids-draggable/sandbox';

  beforeAll(async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Draggable Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'region'] });

    await page.goto(sandboxUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'region'] });
  });
});
