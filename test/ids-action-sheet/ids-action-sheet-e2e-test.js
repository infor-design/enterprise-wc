describe('Ids Action Sheet e2e Tests', () => {
  const url = 'http://localhost:4444/ids-action-sheet';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Action Sheet Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
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
    await mobilePage.goto('http://localhost:4444/ids-action-sheet');
    let isVisible = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").visible`);
    const popupHidden = await mobilePage.evaluate(`document.querySelector("ids-popup-menu").hidden`);
    expect(isVisible).toEqual(null);
    expect(popupHidden).toEqual(true);
    await mobilePage.evaluate(`document.querySelector("ids-menu-button").click()`);
    isVisible = await mobilePage.evaluate(`document.querySelector("ids-action-sheet").visible`);
    expect(isVisible).toEqual('true');
  });
});
