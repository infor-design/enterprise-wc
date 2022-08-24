import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Action Sheet e2e Tests', () => {
  const url = 'http://localhost:4444/ids-action-sheet/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Action Sheet Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should open popup when clicking the trigger button on desktop', async () => {
    let isVisible = await page.evaluate(`document.querySelector("ids-popup-menu").visible`);
    const actionSheetHidden = await page.evaluate(`document.querySelector("ids-action-sheet").hidden`);
    expect(isVisible).toEqual(false);
    expect(actionSheetHidden).toEqual(true);
    await page.evaluate(`document.querySelector("ids-menu-button").click()`);
    isVisible = await page.evaluate(`document.querySelector("ids-popup-menu").visible`);
    expect(isVisible).toEqual(true);
    await page.evaluate(`document.querySelector("ids-popup-menu").visible = false`);
  });

  it('should open action when clicking the trigger button on mobile', async () => {
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 599, height: 9999, deviceScaleFactor: 1 });
    await mobilePage.goto(url);
    let isVisible = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").visible`);
    const popupHidden = await mobilePage.evaluate(`document.querySelector("ids-popup-menu").hidden`);
    expect(isVisible).toEqual(false);
    expect(popupHidden).toEqual(true);
    await mobilePage.evaluate(`document.querySelector("ids-menu-button").click()`);
    isVisible = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").visible`);
    expect(isVisible).toEqual(true);
  });

  it('should not display cancel button when cancelBtnText is an empty string', async () => {
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 599, height: 9999, deviceScaleFactor: 1 });
    await mobilePage.goto(url);
    let isVisible = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").visible`);
    const cancelBtn = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").cancelBtnText = ''`);
    expect(isVisible).toEqual(false);
    expect(cancelBtn).toEqual('');
    await mobilePage.evaluate(`document.querySelector("#icon-button").click()`);
    isVisible = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").visible`);
    expect(isVisible).toEqual(true);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-action-sheet id="test">
          <ids-menu>
            <ids-menu-group>
              <ids-menu-item icon="mail" text-align="center">Option One</ids-menu-item>
              <ids-menu-item icon="filter" text-align="center">Option Two</ids-menu-item>
              <ids-menu-item icon="profile" text-align="center">Option Three</ids-menu-item>
            </ids-menu-group>
          </ids-menu>
        </ids-action-sheet>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
