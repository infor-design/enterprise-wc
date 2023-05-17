import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Color Picker e2e Tests', () => {
  const axeUrl = 'http://localhost:4444/ids-color-picker/axe.html';
  const url = 'http://localhost:4444/ids-color-picker/example.html';

  beforeEach(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(axeUrl, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['landmark-one-main', 'page-has-heading-one', 'region']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Color Picker Component');
  });

  it('should open on clicking the swatch', async () => {
    let isVisible = await page.evaluate(`document.querySelector("#color-picker-e2e-test").popup.visible`);
    expect(isVisible).toEqual(false);
    await page.evaluate(`document.querySelector("#color-picker-e2e-test").colorPreview.click()`);
    isVisible = await page.evaluate(`document.querySelector("#color-picker-e2e-test").popup.visible`);
    expect(isVisible).toEqual(true);
    await page.evaluate(`document.querySelector("#color-picker-e2e-test").popup.visible = false`);
  });

  it('should select when clicking the hex', async () => {
    const elem = await page.$('#color-picker-e2e-test');
    let value = await page.evaluate((el: any) => el.value, elem);

    expect(value).toEqual('');
    await page.evaluate((el: any) => {
      el.popup.visible = true;
      (document.querySelector('#color-picker-e2e-test > ids-color[hex]') as any).click();
    }, elem);
    value = await page.evaluate((el: any) => el.value, elem);
    expect(value).toEqual('var(--ids-color-ruby-10)');
  });

  it('should open when pressing the down arrow', async () => {
    let isVisible = await page.evaluate(`document.querySelector("#color-picker-e2e-test").popup.visible`);
    expect(isVisible).toEqual(false);

    const input = await page.evaluateHandle('document.querySelector("#color-picker-e2e-test").textInput');
    await input.focus();
    await page.keyboard.press('ArrowDown');

    isVisible = await page.evaluate(`document.querySelector("#color-picker-e2e-test").popup.visible`);
    expect(isVisible).toEqual(true);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-color-picker id="test" label="Clearable Color Picker" value="ruby-80" clearable></ids-color-picker>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
