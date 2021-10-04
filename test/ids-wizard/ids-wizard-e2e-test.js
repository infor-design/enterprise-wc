describe('Ids Wizard e2e Tests', () => {
  const url = 'http://localhost:4444/ids-wizard';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Wizard Component');
  });

  it('should be able to click first step', async () => {
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[0].click()');
    const activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(1);
  });

  it('should be able to click last step', async () => {
    await page.evaluate('document.querySelector("ids-wizard").shadowRoot.querySelectorAll("a")[3].click()');
    const activeStep = await page.evaluate(`document.querySelector("ids-wizard").stepNumber`);
    expect(activeStep).toEqual(4);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests();
  });
});
