
describe('Ids Time Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-time-picker';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Time Picker Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'aria-required-children', 'aria-required-parent', 'nested-interactive'] });
  });

  it('can interact with dropdowns (hours, minutes, seconds period)', () => {});
  it('can hide seconds dropdown', () => {});
  it('can hide period (am/pm) dropdown', () => {});
  it('can be disabled', () => {});
  it('should show and hide popup on enter on the trigger-button', async () => {});
  it('should show popup on clicking the trigger-button', async () => {});
});
