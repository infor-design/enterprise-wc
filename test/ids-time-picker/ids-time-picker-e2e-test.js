describe('Ids Time Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-time-picker';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Time Picker Component');
  });

  it.skip('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'aria-required-children', 'aria-required-parent', 'nested-interactive'] });
  });

  it.skip('can interact with dropdowns (hours, minutes, seconds period)', () => {});
  it.skip('can hide seconds dropdown', () => {});
  it.skip('can hide period (am/pm) dropdown', () => {});
  it.skip('can be disabled', () => {});
  it.skip('should show and hide popup on enter on the trigger-button', async () => {});
  it.skip('should show popup on clicking the trigger-button', async () => {});
  it.skip('setting the language will update the labels', () => {});
  it.skip('setting the locale will update the dropdowns and field', () => {});
});
