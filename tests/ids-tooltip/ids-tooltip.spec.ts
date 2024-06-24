import AxeBuilder from '@axe-core/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTooltip from '../../src/components/ids-tooltip/ids-tooltip';

test.describe('IdsTooltip tests', () => {
  const url = '/ids-tooltip/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tooltip Component');
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
      const handle = await page.$('ids-tooltip');
      const html = await handle?.evaluate((el: IdsTooltip) => el?.outerHTML);
      await expect(html).toMatchSnapshot('tooltip-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-tooltip');
      const html = await handle?.evaluate((el: IdsTooltip) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tooltip-shadow');
    });
  });

  test.describe('functionality test', async () => {
    let idsToolTip: Locator;
    let idsButton: Locator;

    const isVisible = async (elem: Locator) => {
      const res = await elem.evaluate((node: IdsTooltip) => node.visible);
      return res;
    };

    test.beforeEach(async ({ page }) => {
      idsToolTip = await page.locator('ids-tooltip');
      idsButton = await page.locator('#button-1');
    });

    test('can append early to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-tooltip') as IdsTooltip;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.id = 'new-tooltip-test';
        elem.target = '#button-1';
        elem.innerHTML = 'Another tooltip';
      });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can append late to DOM', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-tooltip') as IdsTooltip;
        elem.id = 'new-tooltip-test';
        elem.target = '#button-1';
        elem.innerHTML = 'Another tooltip';
        document.querySelector('ids-container')!.appendChild(elem);
      });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can get popup', async () => {
      const idsPopup = await idsToolTip.locator('ids-popup').elementHandle();
      expect(await idsToolTip.evaluate((
        element: IdsTooltip,
        handle
      ) => element.popup!.isSameNode(handle), idsPopup)).toBeTruthy();
    });

    test('can set/get delay', async () => {
      const defDelay = 500;
      const testData = [
        { data: 300, expected: 300 },
        { data: 'test', expected: defDelay },
        { data: '700', expected: 700 },
        { data: null, expected: defDelay },
        { data: 1, expected: 1 },
        { data: 0, expected: defDelay }
      ];

      expect(await idsToolTip.evaluate((element: IdsTooltip) => element.delay)).toEqual(defDelay);
      await expect(idsToolTip).not.toHaveAttribute('delay');

      for (const data of testData) {
        expect(await idsToolTip.evaluate((element: IdsTooltip, tData) => {
          element.delay = tData as any;
          return element.delay;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          await expect(idsToolTip).toHaveAttribute('delay');
        } else {
          await expect(idsToolTip).not.toHaveAttribute('delay');
        }
      }
    });

    test('can set/get placement', async () => {
      const testData = [
        { data: 'left', expected: 'left' },
        { data: 'right', expected: 'right' },
        { data: 'top', expected: 'top' },
        { data: 'bottom', expected: 'bottom' },
        { data: 'center', expected: 'center' },
        { data: null, expected: 'top' }
      ];

      expect(await idsToolTip.evaluate((element: IdsTooltip) => element.placement)).toEqual('top');
      await expect(idsToolTip).not.toHaveAttribute('placement');

      for (const data of testData) {
        expect(await idsToolTip.evaluate((element: IdsTooltip, tData) => {
          element.placement = tData as any;
          return element.placement;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          await expect(idsToolTip).toHaveAttribute('placement', data.expected);
        } else {
          await expect(idsToolTip).not.toHaveAttribute('placement');
        }
      }
    });

    test('can trigger events when hovered', async ({ eventsTest, page }) => {
      const buttonHandle = (await idsButton.elementHandle())!;
      const box = await idsButton.boundingBox();
      await eventsTest.onEvent('ids-tooltip', 'hoverend', buttonHandle);
      await eventsTest.onEvent('ids-tooltip', 'mouseleave', buttonHandle);

      expect(await isVisible(idsToolTip)).toBeFalsy();

      // hover in the target
      await buttonHandle.hover();
      await expect(async () => {
        expect(await isVisible(idsToolTip)).toBeTruthy();
        expect(await eventsTest.isEventTriggered('ids-tooltip', 'hoverend')).toBeTruthy();
      }).toPass();

      // mouse leave event
      await page.mouse.move(box!.width + 20, box!.height + 20);
      await expect(async () => {
        expect(await isVisible(idsToolTip)).toBeFalsy();
        expect(await eventsTest.isEventTriggered('ids-tooltip', 'mouseleave')).toBeTruthy();
      }).toPass();
    });

    test('can hide tooltip on clicked', async () => {
      expect(await isVisible(idsToolTip)).toBeFalsy();
      await expect(idsToolTip).not.toHaveAttribute('visible');

      await idsButton.hover();
      await expect(async () => {
        await expect(idsToolTip).toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeTruthy();
      }).toPass();

      await idsButton.click({ delay: 50 });
      await expect(async () => {
        await expect(idsToolTip).not.toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeFalsy();
      }).toPass();
    });

    test('can show when long pressed', async ({ page }) => {
      const box = await idsButton.boundingBox();

      expect(await isVisible(idsToolTip)).toBeFalsy();
      await expect(idsToolTip).not.toHaveAttribute('visible');

      await page.mouse.move(box!.x + (box!.width / 2), box!.y + (box!.height / 2));
      await page.mouse.down();
      await page.waitForTimeout(500);
      await expect(async () => {
        await expect(idsToolTip).toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeTruthy();
      }).toPass();
      await page.mouse.up();

      expect(await isVisible(idsToolTip)).toBeFalsy();
      await expect(idsToolTip).not.toHaveAttribute('visible');
    });

    test('can set/get visible', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsToolTip.evaluate((element: IdsTooltip) => element.visible)).toBeFalsy();
      await expect(idsToolTip).not.toHaveAttribute('visible');

      for (const data of testData) {
        expect(await idsToolTip.evaluate((element: IdsTooltip, tData) => {
          element.visible = tData as any;
          return element.visible;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsToolTip).toHaveAttribute('visible');
        } else {
          await expect(idsToolTip).not.toHaveAttribute('visible');
        }
      }
    });

    test('can show on focus and hide on focusout', async ({ page }) => {
      expect(await isVisible(idsToolTip)).toBeFalsy();
      await expect(idsToolTip).not.toHaveAttribute('visible');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      await expect(async () => {
        await expect(idsToolTip).toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeTruthy();
      }).toPass();

      await page.keyboard.press('Tab');
      await expect(async () => {
        await expect(idsToolTip).not.toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeFalsy();
      }).toPass();
    });

    test('can handle changing target', async ({ page }) => {
      expect(await idsToolTip.evaluate((element: IdsTooltip) => element.target)).toEqual('#button-1');

      await page.evaluate(() => {
        const elem = document.createElement('ids-button') as any;
        elem.id = 'new-button';
        elem.text = 'New Button';
        elem.appearance = 'secondary';
        document.querySelector('#button-1')!.parentNode!.appendChild(elem);
      });

      const newButton = await page.locator('#new-button');
      await newButton.hover();
      await expect(async () => {
        await expect(idsToolTip).not.toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeFalsy();
      }).toPass();

      // move away from the new button
      await page.mouse.move(200, 200);

      // set target
      expect(await idsToolTip.evaluate((element: IdsTooltip) => {
        element.target = '#new-button';
        return element.target;
      })).toEqual('#new-button');

      // hover again the new button
      await newButton.hover();
      await expect(async () => {
        await expect(idsToolTip).toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeTruthy();
      }).toPass();

      // move away from the new button
      await page.mouse.move(200, 200);

      // hover to the old button
      await idsButton.hover();
      await expect(async () => {
        await expect(idsToolTip).not.toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeFalsy();
      }).toPass();
    });

    test('can handle multiple target', async ({ page }) => {
      expect(await idsToolTip.evaluate((element: IdsTooltip) => element.target)).toEqual('#button-1');

      await page.evaluate(() => {
        const elem = document.createElement('ids-button') as any;
        elem.id = 'new-button';
        elem.text = 'New Button';
        elem.appearance = 'secondary';
        document.querySelector('#button-1')!.parentNode!.appendChild(elem);
      });

      const newButton = await page.locator('#new-button');
      await newButton.hover();
      await expect(async () => {
        await expect(idsToolTip).not.toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeFalsy();
      }).toPass();

      // move away from the new button
      await page.mouse.move(200, 200);

      // set target
      expect(await idsToolTip.evaluate((element: IdsTooltip) => {
        element.target = '#button-1, #new-button';
        return element.target;
      })).toEqual('#button-1, #new-button');

      // hover again the new button
      await newButton.hover();
      await expect(async () => {
        await expect(idsToolTip).toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeTruthy();
      }).toPass();

      // move away from the new button
      await page.mouse.move(200, 200);

      // hover to the old button
      await idsButton.hover();
      await expect(async () => {
        await expect(idsToolTip).toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeTruthy();
      }).toPass();
    });

    test('can prevent from showing via beforeshow event', async () => {
      expect(await isVisible(idsToolTip)).toBeFalsy();
      await expect(idsToolTip).not.toHaveAttribute('visible');

      await idsToolTip.evaluate((element: any) => {
        element.addEventListener('beforeshow', (event: CustomEvent) => {
          event.detail.response(false);
        });
        element.visible = true;
      });

      await expect(async () => {
        await expect(idsToolTip).not.toHaveAttribute('visible');
        expect(await isVisible(idsToolTip)).toBeFalsy();
      }).toPass();
    });
  });
});
