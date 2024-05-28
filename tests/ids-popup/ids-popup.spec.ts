import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';

import IdsPopup from '../../src/components/ids-popup/ids-popup';

test.describe('IdsPopup tests', () => {
  const url = '/ids-popup/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Popup Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-popup');
      const html = await handle?.evaluate((el: IdsPopup) => el?.outerHTML);
      await expect(html).toMatchSnapshot('popup-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-popup');
      const html = await handle?.evaluate((el: IdsPopup) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('popup-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-popup-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire show event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup?.addEventListener('show', () => { calls++; });
        popup.visible = true;
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire hide event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup.visible = true;
        popup?.addEventListener('hide', () => { calls++; });
        popup.visible = false;
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('can set visibility', async ({ page }) => {
      const locator = await page.locator('#popup-1').first();
      await page.evaluate(() => {
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup.visible = true;
      });

      expect(await locator.getAttribute('aria-hidden')).toBeFalsy();
      expect(await locator.getAttribute('visible')).toBe('');

      await page.evaluate(() => {
        const popup = document.querySelector<IdsPopup>('#popup-1')!;
        popup.visible = false;
      });
      expect(await locator.getAttribute('visible')).toBeFalsy();
      expect(await locator.getAttribute('aria-hidden')).toBe('true');
    });
  });

  test.describe('IdsPopUp functionality test', () => {
    let idsPopup: Locator;

    test.beforeEach(async ({ page }) => {
      idsPopup = await page.locator('#popup-1');
    });

    test('can set/get alignTarget', async ({ page }) => {
      // retrieve elements using evaluateHandle
      const idsTextElement = await page.locator('ids-text').first().evaluateHandle((node) => node);
      const idsButtonElement = await page.locator('#popup-trigger-btn').evaluateHandle((node) => node);

      // default alignment at ids-button
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => element.alignTarget!.isSameNode(handle), idsButtonElement)).toBeTruthy();

      // changed to ids-text
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.alignTarget = handle;
        return element.alignTarget!.isSameNode(handle);
      }, idsTextElement)).toBeTruthy();

      // change again to button via selector string
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.alignTarget = '#popup-trigger-btn';
        return element.alignTarget!.isSameNode(handle);
      }, idsButtonElement)).toBeTruthy();

      // remove alignTarget
      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignTarget = null;
        return element.alignTarget;
      }, idsButtonElement)).toBeFalsy();

      // invalid alignTarget
      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignTarget = '#invalid-test';
        return element.alignTarget;
      }, idsButtonElement)).toBeFalsy();
    });

    test('can set/get align', async () => {
      const defAlign = 'center';
      const testData = [
        { data: 'bottom', expected: 'bottom' },
        { data: 5, expected: defAlign },
        { data: 'left, top', expected: 'left, top' },
        { data: 'left, right', expected: 'left, top' }, // retains previous state
        { data: null, expected: defAlign },
        { data: 'right, left', expected: 'left' }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.align)).toEqual('right');
      await expect(idsPopup).toHaveAttribute('align', 'right');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.align = tData as any;
          return element.align;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('align', data.expected);
      }
    });

    test('can set/get alignX', async () => {
      expect(await idsPopup.evaluate((element: IdsPopup) => element.alignX)).toEqual('right');
      await expect(idsPopup).not.toHaveAttribute('align-x');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignX = 'left';
        return element.alignX;
      })).toEqual('left');
      await expect(idsPopup).not.toHaveAttribute('align-x');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignX = 'test';
        return element.alignX;
      })).toEqual('center');
      await expect(idsPopup).not.toHaveAttribute('align-x');
    });

    test('can set/get alignY', async () => {
      expect(await idsPopup.evaluate((element: IdsPopup) => element.alignY)).toEqual('center');
      await expect(idsPopup).not.toHaveAttribute('align-y');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignY = 'top';
        return element.alignY;
      })).toEqual('top');
      await expect(idsPopup).not.toHaveAttribute('align-y');

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.alignY = 'test';
        return element.alignY;
      })).toEqual('center');
      await expect(idsPopup).not.toHaveAttribute('align-y');
    });

    test('can set/get alignEdge', async () => {
      // data sequence is important here
      const testData = [
        {
          data: 'top',
          expected: {
            align: 'top, right',
            alignX: 'right',
            alignY: 'top',
            alignEdge: 'top'
          }
        },
        {
          data: 'right',
          expected: {
            align: 'right, top',
            alignX: 'right',
            alignY: 'top',
            alignEdge: 'right'
          }
        },
        {
          data: 'center',
          expected: {
            align: 'center',
            alignX: 'center',
            alignY: 'center',
            alignEdge: 'center'
          }
        },
        {
          data: 'junk',
          expected: {
            align: 'center',
            alignX: 'center',
            alignY: 'center',
            alignEdge: 'center'
          }
        },
        {
          data: 1,
          expected: {
            align: 'center',
            alignX: 'center',
            alignY: 'center',
            alignEdge: 'center'
          }
        }
      ];

      const aligns = async () => {
        const ret = await idsPopup.evaluate((element: IdsPopup) => {
          const res = {
            align: element.align,
            alignX: element.alignX,
            alignY: element.alignY,
            alignEdge: element.alignEdge
          };
          return res;
        });
        return ret;
      };

      expect(await aligns()).toEqual({
        align: 'right',
        alignX: 'right',
        alignY: 'center',
        alignEdge: 'right'
      });

      for (const data of testData) {
        await idsPopup.evaluate((element: IdsPopup, tData) => { element.alignEdge = tData as any; }, data.data);
        expect(await aligns()).toEqual(data.expected);
      }
    });

    test('can set align-edge via setAttribute', async () => {
      // data sequence is important here
      const testData = [
        {
          data: 'top',
          expected: {
            align: 'top, right',
            alignX: 'right',
            alignY: 'top',
            alignEdge: 'top'
          }
        },
        {
          data: 'right',
          expected: {
            align: 'right, top',
            alignX: 'right',
            alignY: 'top',
            alignEdge: 'right'
          }
        },
        {
          data: 'center',
          expected: {
            align: 'center',
            alignX: 'center',
            alignY: 'center',
            alignEdge: 'center'
          }
        },
        {
          data: 'junk',
          expected: {
            align: 'center',
            alignX: 'center',
            alignY: 'center',
            alignEdge: 'center'
          }
        },
        {
          data: 1,
          expected: {
            align: 'center',
            alignX: 'center',
            alignY: 'center',
            alignEdge: 'center'
          }
        }
      ];

      const aligns = async () => {
        const ret = await idsPopup.evaluate((element: IdsPopup) => {
          const res = {
            align: element.align,
            alignX: element.alignX,
            alignY: element.alignY,
            alignEdge: element.alignEdge
          };
          return res;
        });
        return ret;
      };

      expect(await aligns()).toEqual({
        align: 'right',
        alignX: 'right',
        alignY: 'center',
        alignEdge: 'right'
      });

      for (const data of testData) {
        await idsPopup.evaluate((element: IdsPopup, tData) => { element.setAttribute('align-edge', tData.toString()); }, data.data);
        expect(await aligns()).toEqual(data.expected);
      }
    });

    test('can get oppositeAlignEdge', async () => {
      const testData = [
        { data: 'top', expected: 'bottom' },
        { data: 'bottom', expected: 'top' },
        { data: 'left', expected: 'right' },
        { data: 'right', expected: 'left' },
        { data: 'center', expected: 'none' }
      ];

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.align = tData;
          return element.oppositeAlignEdge;
        }, data.data)).toEqual(data.expected);
      }
    });

    test('can set/get maxHeight', async () => {
      const testData = [
        { data: 200, expected: '200px' },
        { data: 'test', expected: null },
        { data: '300', expected: '300px' },
        { data: null, expected: null }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.maxHeight)).toBeNull();
      await expect(idsPopup).not.toHaveAttribute('max-height');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.maxHeight = tData as any;
          return element.maxHeight;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsPopup).toHaveAttribute('max-height', data.expected);
        } else {
          await expect(idsPopup).not.toHaveAttribute('max-height');
        }
      }
    });

    test('can set/get animated', async () => {
      const testData = [
        { data: 'false', expected: false },
        { data: true, expected: true },
        { data: null, expected: false },
        { data: '', expected: true }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.animated)).toBeTruthy();
      await expect(idsPopup).toHaveAttribute('animated');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.animated = tData as any;
          return element.animated;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsPopup).toHaveAttribute('animated');
        } else {
          await expect(idsPopup).not.toHaveAttribute('animated');
        }
      }
    });

    test('can set/get animationStyle', async () => {
      // data sequence is important
      const testData = [
        { data: 'scale-in', expected: 'scale-in' },
        { data: 'test', expected: 'scale-in' },
        { data: 'slide-from-bottom', expected: 'slide-from-bottom' },
      ];
      const container = await idsPopup.locator('div[part="popup"]').first();

      expect(await idsPopup.evaluate((element: IdsPopup) => element.animationStyle)).toEqual('fade');
      await expect(idsPopup).toHaveAttribute('animation-style', 'fade');
      await expect(container).toHaveClass(/animation-fade/);

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.animationStyle = tData as any;
          return element.animationStyle;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('animation-style', data.expected);
        await expect(container).toHaveClass(new RegExp(`animation-${data.expected}`, 'g'));
      }

      expect(await idsPopup.evaluate((element: IdsPopup) => {
        element.removeAttribute('animation-style');
        return element.animationStyle;
      })).toEqual('fade');
    });

    test('can set/get bleed', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.bleed)).toBeFalsy();
      await expect(idsPopup).not.toHaveAttribute('bleed');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData: any) => {
          element.bleed = tData;
          return element.bleed;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsPopup).toHaveAttribute('bleed');
        } else {
          await expect(idsPopup).not.toHaveAttribute('bleed');
        }
      }
    });

    test('can set/get containingElem', async ({ page }) => {
      // add another ids-container
      await page.evaluate(() => {
        document.querySelector('ids-container')!.setAttribute('id', 'old-container');
        const idsContainer = document.createElement('ids-container')!;
        idsContainer.setAttribute('id', 'new-container');
        document.body.appendChild(idsContainer);
      });
      await page.locator('#new-container').waitFor({ state: 'attached' });
      const oldContHandle = await page.locator('#old-container').evaluateHandle((node) => node);
      const newContHandle = await page.locator('#new-container').evaluateHandle((node) => node);

      // get current containingElem
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => element.containingElem!.isSameNode(handle), oldContHandle)).toBeTruthy();

      // set new containingElem
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.containingElem = handle;
        return element.containingElem!.isSameNode(handle);
      }, newContHandle)).toBeTruthy();

      // set invalid containingElem
      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.containingElem = 'invalid' as any;
        return element.containingElem!.isSameNode(handle);
      }, newContHandle)).toBeTruthy();
    });

    test('can set/get arrow', async () => {
      const defArrow = 'none';
      const testData = [
        { data: 'bottom', expected: 'bottom' },
        { data: '', expected: defArrow },
        { data: 'top', expected: 'top' },
        { data: 'invalid', expected: defArrow },
        { data: null, expected: defArrow }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.arrow)).toEqual('right');
      await expect(idsPopup).toHaveAttribute('arrow', 'right');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.arrow = tData as any;
          return element.arrow;
        }, data.data)).toEqual(data.expected);
        if (data.expected !== 'none') {
          await expect(idsPopup).toHaveAttribute('arrow', data.expected);
        } else {
          await expect(idsPopup).not.toHaveAttribute('arrow');
        }
      }
    });

    test('can set/get arrowTarget', async ({ page }) => {
      const container = await page.locator('ids-container').evaluateHandle((node) => node);
      const button = await page.locator('#popup-trigger-btn').evaluateHandle((node) => node);

      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => element.arrowTarget!.isSameNode(handle), button)).toBeTruthy();

      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.arrowTarget = handle;
        return element.arrowTarget!.isSameNode(handle);
      }, container)).toBeTruthy();

      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.arrowTarget = '#popup-trigger-btn';
        return element.arrowTarget!.isSameNode(handle);
      }, button)).toBeTruthy();

      expect(await idsPopup.evaluate((
        element: IdsPopup,
        handle
      ) => {
        element.arrowTarget = '#invalid';
        return element.arrowTarget!.isSameNode(handle);
      }, button)).toBeTruthy();
    });

    test('can set/get positionStyle', async () => {
      const container = await idsPopup.locator('div[part="popup"]').first();
      // data sequence is important
      const testData = [
        { data: 'viewport', expected: 'viewport' },
        { data: 'fixed', expected: 'fixed' },
        { data: 'invalid', expected: 'fixed' },
        { data: null, expected: 'fixed' }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.positionStyle)).toEqual('absolute');
      await expect(idsPopup).toHaveAttribute('position-style', 'absolute');
      await expect(container).toHaveClass(/position-absolute/);

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.positionStyle = tData as any;
          return element.positionStyle;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('position-style', data.expected);
        await expect(container).toHaveClass(new RegExp(`position-${data.expected}`, 'g'));
      }
    });

    test('can set/get type', async () => {
      const container = await idsPopup.locator('div[part="popup"]').first();
      // data sequence is important
      const testData = [
        { data: 'none', expected: 'none' },
        { data: 'modal', expected: 'modal' },
        { data: 'tooltip', expected: 'tooltip' },
        { data: 'custom', expected: 'custom' },
        { data: 'dropdown', expected: 'dropdown' },
        { data: 'module-nav', expected: 'module-nav' },
        { data: 'invalid', expected: 'module-nav' },
        { data: null, expected: 'module-nav' }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.type)).toEqual('menu');
      await expect(idsPopup).toHaveAttribute('type', 'menu');
      await expect(container).toHaveClass(/menu/);

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.type = tData as any;
          return element.type;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('type', data.expected);
        await expect(container).toHaveClass(new RegExp(`${data.expected}`, 'g'));
      }
    });

    test('can set/get visible', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsPopup.evaluate((element: IdsPopup) => element.visible)).toBeFalsy();
      await expect(idsPopup).not.toHaveAttribute('visible');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData: any) => {
          element.visible = tData;
          return element.visible;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsPopup).toHaveAttribute('visible');
          await expect(idsPopup).not.toHaveAttribute('aria-hidden');
        } else {
          await expect(idsPopup).not.toHaveAttribute('visible');
          await expect(idsPopup).toHaveAttribute('aria-hidden');
        }
      }
    });

    test('can set/get x coordinate', async () => {
      const testData = [
        { data: 30, expected: 30 },
        { data: -10, expected: -10 },
        { data: 'test', expected: 0 },
        { data: '100', expected: 100 },
        { data: null, expected: 0 }
      ];
      expect(await idsPopup.evaluate((element: IdsPopup) => element.x)).toEqual(15);
      await expect(idsPopup).toHaveAttribute('x', '15');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.x = tData as any;
          return element.x;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('x', data.expected.toString());
      }
    });

    test('can set/get y coordinate', async () => {
      const testData = [
        { data: 30, expected: 30 },
        { data: -10, expected: -10 },
        { data: 'test', expected: 0 },
        { data: '100', expected: 100 },
        { data: null, expected: 0 }
      ];
      expect(await idsPopup.evaluate((element: IdsPopup) => element.y)).toEqual(0);
      await expect(idsPopup).toHaveAttribute('y', '0');

      for (const data of testData) {
        expect(await idsPopup.evaluate((element: IdsPopup, tData) => {
          element.y = tData as any;
          return element.y;
        }, data.data)).toEqual(data.expected);
        await expect(idsPopup).toHaveAttribute('y', data.expected.toString());
      }
    });

    test('can set position', async ({ page }) => {
      const changeX = 300;
      const changeY = 300;
      const popupHandle = await idsPopup.evaluateHandle((node) => node);

      await idsPopup.evaluate((element: IdsPopup) => element.setPosition(0, 0, true, true));
      await idsPopup.waitFor();
      let popupBox = await idsPopup.boundingBox();
      const defXPos = popupBox!.x;
      const defYPos = popupBox!.y;
      const expectedX = defXPos + changeX;
      const expectedY = defYPos + changeY;

      // change position via setPosition
      await idsPopup.evaluate((
        element: IdsPopup,
        data
      ) => element.setPosition(data.changeX, data.changeY, true, true), { changeX, changeY });
      await idsPopup.waitFor();
      await page.waitForFunction((data) => {
        const box = data.popupHandle.getBoundingClientRect();
        return (box.x >= data.xPos - 20 && box.x <= data.xPos + 20)
        && (box.y >= data.yPos - 20 && box.y <= data.yPos + 20);
      }, { popupHandle, xPos: expectedX, yPos: expectedY });
      popupBox = await idsPopup.boundingBox();
      expect(popupBox!.x).toBeInAllowedBounds(expectedX, 20);
      expect(popupBox!.y).toBeInAllowedBounds(expectedY, 20);
    });
  });
});
