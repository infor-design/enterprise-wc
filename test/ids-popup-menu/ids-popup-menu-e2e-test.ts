import { AxePuppeteer } from '@axe-core/puppeteer';

describe('Ids Popup Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-popup-menu/example.html';
  const menuItemSelector = '#item-six'; // ids-menu-item with sub level ids-popup-menu
  const subPopupMenuSelector = `${menuItemSelector} > ids-popup-menu`; // reference to sub level ids-popup-menu
  const popupHoverDelay = 500; // popupDelay configured in ids-popup-interactions-mixin.js

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Popup Menu Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should open sub popup menu when menu item hovered', async () => {
    // open popup menu
    await page.click('ids-container', { button: 'right' });

    // hover over menu item of top level popup menu
    await page.hover(menuItemSelector);
    await page.waitForTimeout(popupHoverDelay);

    // check that sub popupmenu is visible
    const isVisible = await page.$eval(subPopupMenuSelector, (el: any) => el?.visible);
    expect(isVisible).toBeTruthy();
  });

  it('should open sub popup menu when menu item clicked', async () => {
    // open popup menu
    await page.click('ids-container', { button: 'right' });

    // hover over menu item of top level popup menu
    await page.click(menuItemSelector);

    // check that sub popupmenu is visible
    const isVisible = await page.$eval(subPopupMenuSelector, (el: any) => el?.visible);
    expect(isVisible).toBeTruthy();
  });

  it('should keep sub ppopup menu open when menu item hovered and then clicked', async () => {
    // open popup menu
    await page.click('ids-container', { button: 'right' });

    // hover over then click menu item of top level popup menu
    await page.hover(menuItemSelector);
    await page.waitForTimeout(popupHoverDelay);
    await page.click(menuItemSelector);

    // check that sub popupmenu is visible
    const isVisible = await page.$eval(subPopupMenuSelector, (el: any) => el?.visible);
    expect(isVisible).toBeTruthy();
  });
});
