describe('Ids Color Picker e2e Tests', () => {
  const url = 'http://localhost:4444/ids-color-picker/example.html';
  const axeUrl = 'http://localhost:4444/ids-color-picker/axe.html';

  beforeEach(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(axeUrl, { waitUntil: ['networkidle2', 'load'] });
    await (expect(page) as any).toPassAxeTests({ disabledRules: ['landmark-one-main', 'page-has-heading-one', 'region'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Color Picker Component');
  });

  it('should open on clicking the swatch', async () => {
    let isVisible = await page.evaluate(`document.querySelector("#ids-input-1").popup.visible`);
    expect(isVisible).toEqual(false);
    await page.evaluate(`document.querySelector("#ids-input-1").colorPreview.click()`);
    isVisible = await page.evaluate(`document.querySelector("#ids-input-1").popup.visible`);
    expect(isVisible).toEqual(true);
    await page.evaluate(`document.querySelector("#ids-input-1").popup.visible = false`);
  });

  it('should select when clicking the hex', async () => {
    const elem = await page.$('#ids-input-1');
    let value = await page.evaluate((el: any) => el.value, elem);

    expect(value).toEqual('');
    await page.evaluate((el: any) => {
      el.popup.visible = true;
      (document.querySelector('#ids-input-1 > ids-color[hex]') as any).click();
    }, elem);
    value = await page.evaluate((el: any) => el.value, elem);
    expect(value).toEqual('ruby-10');
  });

  it('should open when pressing the down arrow', async () => {
    let isVisible = await page.evaluate(`document.querySelector("#ids-input-1").popup.visible`);
    expect(isVisible).toEqual(false);

    const input = await page.evaluateHandle('document.querySelector("#ids-input-1")');
    await input.focus();
    await page.keyboard.press('ArrowDown');

    isVisible = await page.evaluate(`document.querySelector("#ids-input-1").popup.visible`);
    expect(isVisible).toEqual(true);
  });
});
