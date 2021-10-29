describe('Ids Color Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-color-picker';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Color Picker Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'aria-required-children', 'aria-required-parent', 'nested-interactive'] });
  });

  it('should open on clicking the swatch', async () => {
    let isVisible = await page.evaluate(`document.querySelector("#color-picker-1").popup.visible`);
    expect(isVisible).toEqual(false);
    await page.evaluate(`document.querySelector("#color-picker-1").colorPreview.click()`);
    isVisible = await page.evaluate(`document.querySelector("#color-picker-1").popup.visible`);
    expect(isVisible).toEqual(true);
    await page.evaluate(`document.querySelector("#color-picker-1").popup.visible = false`);
  });

  it('should select when clicking the hex', async () => {
    const elem = await page.$('#color-picker-1');
    let value = await page.evaluate((el) => el.value, elem);

    expect(value).toEqual('#b94e4e');
    await page.evaluate((el) => {
      el.popup.visible = true;
      document.querySelector('#color-picker-1 > ids-color[hex]').click();
    }, elem);
    value = await page.evaluate((el) => el.value, elem);
    expect(value).toEqual('#1a1a1a');
  });

  it('should open on enter on the trigger', async () => {
    let isVisible = await page.evaluate(`document.querySelector("#color-picker-1").popup.visible`);
    expect(isVisible).toEqual(false);

    const input = await page.evaluateHandle('document.querySelector("#color-picker-1").shadowRoot.querySelector("#color-picker-1-button")');
    await input.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    isVisible = await page.evaluate(`document.querySelector("#color-picker-1").popup.visible`);
    expect(isVisible).toEqual(false);
    await page.evaluate(`document.querySelector("#color-picker-1").popup.visible = false;`);
  });
});
