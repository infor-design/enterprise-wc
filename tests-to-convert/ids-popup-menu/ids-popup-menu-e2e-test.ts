import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Popup Menu Tests', () => {
  const url = 'http://localhost:4444/ids-popup-menu/example.html';
  const menuItemSelector = '#item-six'; // ids-menu-item with sub level ids-popup-menu
  const subPopupMenuSelector = `${menuItemSelector} > ids-popup-menu`; // reference to sub level ids-popup-menu
  const popupHoverDelay = 500; // popupDelay configured in ids-popup-interactions-mixin.js


  test('should open sub popup menu when menu item hovered', async () => {
    // open popup menu
    await page.click('ids-container', { button: 'right' });

    // hover over menu item of top level popup menu
    await page.hover(menuItemSelector);
    await page.waitForTimeout(popupHoverDelay);

    // check that sub popupmenu is visible
    const isVisible = await page.$eval(subPopupMenuSelector, (el: any) => el?.visible);
    expect(isVisible).toBeTruthy();
  });

  test('should open sub popup menu when menu item clicked', async () => {
    // open popup menu
    await page.click('ids-container', { button: 'right' });

    // hover over menu item of top level popup menu
    await page.click(menuItemSelector);

    // check that sub popupmenu is visible
    const isVisible = await page.$eval(subPopupMenuSelector, (el: any) => el?.visible);
    expect(isVisible).toBeTruthy();
  });

  test('should keep sub ppopup menu open when menu item hovered and then clicked', async () => {
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

  test('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-popup-menu');
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  test('should be able to set attributes before append', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-popup-menu');
        elem.type = 'menu';
        document.body.appendChild(elem);
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  test('should be able to set attributes after append', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-popup-menu');
        document.body.appendChild(elem);
        elem.width = '550px';
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  test('should be able to set attributes after insertAdjacentHTML', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', `<ids-popup-menu id="test"></ids-popup-menu>`);
        const elem: any = document.querySelector('#test');
        elem.width = '550px';
      });
    } catch (err) {
      hasError = true;
    }

    const value = await page.evaluate('document.querySelector("#test").getAttribute("width")');
    await expect(value).toEqual('550px');
    await expect(hasError).toEqual(false);
  });
});
