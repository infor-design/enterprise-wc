import AxeBuilder from '@axe-core/playwright';
import { Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';

import IdsDraggable from '../../src/components/ids-draggable/ids-draggable';
import getElTranslatePoint from '../../src/components/ids-draggable/get-el-translate-point';

test.describe('IdsDraggable tests', () => {
  const url = '/ids-draggable/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Draggable Component');
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
      const handle = await page.$('ids-draggable');
      const html = await handle?.evaluate((el: IdsDraggable) => el?.outerHTML);
      await expect(html).toMatchSnapshot('draggable-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-draggable');
      const html = await handle?.evaluate((el: IdsDraggable) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('draggable-shadow');
    });
  });

  // becarefull in adding a variable in the test.describe scope as it may fail during parallel runs
  test.describe('end to end test', () => {
    // these are +-n allowed values for the draggable to consider flakiness
    // if expected that the new coordinates to be changed greatly, use this
    const changedMargin = 20;
    // if expected to remain the same - allowed smaller value, since toEqual can still lead to flakiness
    const unchangedMargin = 5;

    test('can be dragged anywhere', async ({ page }) => {
      await page.waitForSelector('#no-axis');
      const idsDrag = await page.locator('#no-axis');
      const prevBox = await idsDrag.boundingBox();

      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(-200, -200);
      await page.mouse.up();

      expect(await idsDrag.boundingBox()).not.toEqual(expect.objectContaining({ x: prevBox!.x, y: prevBox!.y }));
    });

    test('can be dragged on x-axis only', async ({ page }) => {
      await page.waitForSelector('#axis-x');
      const idsDrag = await page.locator('#axis-x');
      const prevBox = await idsDrag.boundingBox();

      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(200, 200);
      await page.mouse.up();

      const currBox = await idsDrag.boundingBox();
      expect(currBox).not.toEqual(expect.objectContaining({ x: prevBox!.x }));
      expect(currBox!.y).toBeInAllowedBounds(prevBox!.y, unchangedMargin);
    });

    test('can be dragged on y-axis only', async ({ page }) => {
      await page.waitForSelector('#axis-y');
      const idsDrag = await page.locator('#axis-y');
      const prevBox = await idsDrag.boundingBox();

      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(200, 200);
      await page.mouse.up();

      const currBox = await idsDrag.boundingBox();
      expect(currBox).not.toEqual(expect.objectContaining({ y: prevBox!.y }));
      expect(currBox!.x).toBeInAllowedBounds(prevBox!.x, unchangedMargin);
    });

    test('can be dragged with limits', async ({ page }) => {
      await page.waitForSelector('#limits');
      const idsDrag = await page.locator('#limits');

      const transforms = await idsDrag.evaluate((element: IdsDraggable) => {
        const ret = {
          minX: element.minTransformX,
          maxX: element.maxTransformX,
          minY: element.minTransformY,
          maxY: element.maxTransformY
        };
        return ret;
      });
      /* positions:
      * value = refers to the value being set in the min/maxTransformX/Y property
      * relValue = calculated value of the position in the container
      * moveTo = calculated value of the next position in the container
      * variable = refers to a value to add/subtract to the relValue for repositioning
      */
      const positions = {
        minX: {
          value: transforms.minX, relValue: 0, moveTo: 0, variable: -100
        },
        maxX: {
          value: transforms.maxX, relValue: 0, moveTo: 0, variable: 100
        },
        minY: {
          value: transforms.minY, relValue: 0, moveTo: 0, variable: -100
        },
        maxY: {
          value: transforms.maxY, relValue: 0, moveTo: 0, variable: 100
        },
      };

      const prevBox = await idsDrag.boundingBox();
      // calculate the relative value and moveTo values
      positions.minX.relValue = prevBox!.x + positions.minX.value;
      positions.maxX.relValue = prevBox!.x + positions.maxX.value;
      positions.minY.relValue = prevBox!.y + positions.minY.value;
      positions.maxY.relValue = prevBox!.y + positions.maxY.value;

      positions.minX.moveTo = positions.minX.relValue + positions.minX.variable;
      positions.maxX.moveTo = positions.maxX.relValue + positions.maxX.variable;
      positions.minY.moveTo = positions.minY.relValue + positions.minY.variable;
      positions.maxY.moveTo = positions.maxY.relValue + positions.maxY.variable;
      console.info(positions);

      // drags the element outside of the limit and check if the x and y values are on the closest limit edge
      // validate min-x limit
      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(positions.minX.moveTo + prevBox!.width / 2, positions.minY.relValue + prevBox!.height / 2);
      await page.mouse.up();
      let currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds(positions.minX.relValue, changedMargin);
      expect(currBox!.y).toBeInAllowedBounds(positions.minY.relValue, unchangedMargin);

      // validate max-x limit
      await page.mouse.move(currBox!.x + currBox!.width / 2, currBox!.y + currBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(positions.maxX.moveTo + currBox!.width / 2, positions.minY.relValue + currBox!.height / 2);
      await page.mouse.up();
      currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds(positions.maxX.relValue, changedMargin);
      expect(currBox!.y).toBeInAllowedBounds(positions.minY.relValue, unchangedMargin);

      // validate max-y limit
      await page.mouse.move(currBox!.x + currBox!.width / 2, currBox!.y + currBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(positions.maxX.relValue + currBox!.width / 2, positions.maxY.moveTo + currBox!.height / 2);
      await page.mouse.up();
      currBox = await idsDrag.boundingBox();
      expect(currBox!.y).toBeInAllowedBounds(positions.maxY.relValue, changedMargin);
      expect(currBox!.x).toBeInAllowedBounds(positions.maxX.relValue, unchangedMargin);

      // validate min-y limit
      await page.mouse.move(currBox!.x + currBox!.width / 2, currBox!.y + currBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(positions.maxX.relValue + currBox!.width / 2, positions.minY.moveTo + currBox!.height / 2);
      await page.mouse.up();
      currBox = await idsDrag.boundingBox();
      expect(currBox!.y).toBeInAllowedBounds(positions.minY.relValue, changedMargin);
      expect(currBox!.x).toBeInAllowedBounds(positions.maxX.relValue, unchangedMargin);
    });

    test('can be dragged within container only', async ({ page }) => {
      await page.waitForSelector('#contained');
      const idsDrag = await page.locator('#contained');
      const container = await page.locator('div.ids-draggable-demo-content');
      // reduce the height of the container to 40% of viewport for validation sake
      await container.evaluate((element) => { element.style.height = '40vh'; });
      const containerBox = await container.boundingBox();
      const prevBox = await idsDrag.boundingBox();

      // check the x-axis
      await page.mouse.move(prevBox!.x, prevBox!.y);
      await page.mouse.down();
      await page.mouse.move(containerBox!.x + containerBox!.width + 100, containerBox!.y);
      await page.mouse.up();

      let currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds((containerBox!.width + containerBox!.x) - currBox!.width, changedMargin);
      expect(currBox!.y).toBeInAllowedBounds(prevBox!.y, unchangedMargin);

      // check the y-axis
      await page.mouse.move(currBox!.x, currBox!.y);
      await page.mouse.down();
      await page.mouse.move(currBox!.x, containerBox!.y + containerBox!.height + 100);
      await page.mouse.up();

      // will fail if container height is more than the viewport height
      currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds((containerBox!.width + containerBox!.x) - currBox!.width, unchangedMargin);
      expect(currBox!.y).toBeInAllowedBounds((containerBox!.height + containerBox!.y) - currBox!.height, changedMargin);
    });

    test('can be dragged within container x-axis only', async ({ page }) => {
      await page.waitForSelector('#contained-x');
      const idsDrag = await page.locator('#contained-x');
      const container = await page.locator('div.ids-draggable-demo-content');
      // reduce the height of the container to 40% of viewport for validation sake
      await container.evaluate((element) => { element.style.height = '40vh'; });
      const containerBox = await container.boundingBox();
      const prevBox = await idsDrag.boundingBox();

      // check the x-axis
      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(containerBox!.x + containerBox!.width, containerBox!.y + containerBox!.height);
      await page.mouse.up();

      const currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds((containerBox!.width + containerBox!.x) - currBox!.width, changedMargin);
      expect(currBox!.y).toBeInAllowedBounds(prevBox!.y, unchangedMargin);
    });

    test('can be dragged within container y-axis only', async ({ page }) => {
      await page.waitForSelector('#contained-y');
      const idsDrag = await page.locator('#contained-y');
      const container = await page.locator('div.ids-draggable-demo-content');
      // reduce the height of the container to 40% of viewport for validation sake
      await container.evaluate((element) => { element.style.height = '40vh'; });
      const containerBox = await container.boundingBox();
      const prevBox = await idsDrag.boundingBox();

      // check the x-axis
      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(containerBox!.x + containerBox!.width, containerBox!.y + containerBox!.height);
      await page.mouse.up();

      const currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds(prevBox!.x, unchangedMargin);
      expect(currBox!.y).toBeInAllowedBounds((containerBox!.height + containerBox!.y) - currBox!.height, changedMargin);
    });

    test('can disable drag', async ({ page }) => {
      await page.waitForSelector('#no-axis');
      const idsDrag = await page.locator('#no-axis');
      await idsDrag.evaluate((element: IdsDraggable) => { element.disabled = true; });
      const prevBox = await idsDrag.boundingBox();

      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(200, 200);
      await page.mouse.up();

      const currBox = await idsDrag.boundingBox();
      expect(currBox!.x).toBeInAllowedBounds(prevBox!.x, unchangedMargin);
      expect(currBox!.y).toBeInAllowedBounds(prevBox!.y, unchangedMargin);
    });
  });

  test.describe('functional tests', () => {
    let idsDrag: Locator;

    test.beforeEach(async ({ page }) => {
      idsDrag = await page.locator('#no-axis');
    });

    test('can set/get axis attribute', async () => {
      const testData = [
        { data: 'y', expected: 'y' },
        { data: 'x', expected: 'x' },
        { data: '', expected: null },
        { data: 'invalid', expected: null },
        { data: undefined, expected: null },
        { data: null, expected: null },
      ];

      await expect(idsDrag).not.toHaveAttribute('axis');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.axis)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.axis = tData.data;
          return element.axis;
        }, data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsDrag).toHaveAttribute('axis', data.expected);
        } else {
          await expect(idsDrag).not.toHaveAttribute('axis');
        }
      }
    });

    test('can set/get parentContainment attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true }, // stringToBool returns any string value besides false as true
        { data: 'invalid', expected: true }
      ];

      await expect(idsDrag).not.toHaveAttribute('parent-containment');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.parentContainment)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.parentContainment = tData.data;
          return element.parentContainment;
        }, data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsDrag).toHaveAttribute('parent-containment', '');
        } else {
          await expect(idsDrag).not.toHaveAttribute('parent-containment');
        }
      }
    });

    test('can set/get disabled attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true }, // stringToBool returns any string value besides false as true
        { data: 'invalid', expected: true }
      ];

      await expect(idsDrag).not.toHaveAttribute('disabled');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.disabled)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.disabled = tData.data;
          return element.disabled;
        }, data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsDrag).toHaveAttribute('disabled', '');
        } else {
          await expect(idsDrag).not.toHaveAttribute('disabled');
        }
      }
    });

    test('can set/get handle attribute', async () => {
      const testData = [
        { data: '.handle', expected: '.handle' },
        { data: '.handle', expected: '.handle' }, // same value validation
        { data: '.anotherHandle', expected: '.anotherHandle' },
        { data: '', expected: null },
        { data: null, expected: null },
      ];

      await expect(idsDrag).not.toHaveAttribute('handle');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.handle)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.handle = tData.data;
          return element.handle;
        }, data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsDrag).toHaveAttribute('handle', data.expected);
        } else {
          await expect(idsDrag).not.toHaveAttribute('handle');
        }
      }
    });

    test('can set/get minTransformX', async () => {
      const testData = [
        { data: null, expected: 0 },
        { data: undefined, expected: 0 },
        { data: [], expected: 0 },
        { data: '1', expected: 1 },
        { data: 80, expected: 80 }
      ];

      await expect(idsDrag).not.toHaveAttribute('min-transform-x');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.minTransformX)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.minTransformX = tData.data as any;
          return element.minTransformX;
        }, data)).toEqual(data.expected);
        if (data.expected > 0) {
          await expect(idsDrag).toHaveAttribute('min-transform-x', data.expected.toString());
        } else {
          await expect(idsDrag).not.toHaveAttribute('min-transform-x');
        }
      }
    });

    test('can set/get maxTransformX', async () => {
      const testData = [
        { data: null, expected: 0 },
        { data: undefined, expected: 0 },
        { data: [], expected: 0 },
        { data: '1', expected: 1 },
        { data: 80, expected: 80 }
      ];

      await expect(idsDrag).not.toHaveAttribute('max-transform-x');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.maxTransformX)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.maxTransformX = tData.data as any;
          return element.maxTransformX;
        }, data)).toEqual(data.expected);
        if (data.expected > 0) {
          await expect(idsDrag).toHaveAttribute('max-transform-x', data.expected.toString());
        } else {
          await expect(idsDrag).not.toHaveAttribute('max-transform-x');
        }
      }
    });

    test('can set/get minTransformY', async () => {
      const testData = [
        { data: null, expected: 0 },
        { data: undefined, expected: 0 },
        { data: [], expected: 0 },
        { data: '1', expected: 1 },
        { data: 80, expected: 80 }
      ];

      await expect(idsDrag).not.toHaveAttribute('min-transform-y');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.minTransformY)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.minTransformY = tData.data as any;
          return element.minTransformY;
        }, data)).toEqual(data.expected);
        if (data.expected > 0) {
          await expect(idsDrag).toHaveAttribute('min-transform-y', data.expected.toString());
        } else {
          await expect(idsDrag).not.toHaveAttribute('min-transform-y');
        }
      }
    });

    test('can set/get maxTransformY', async () => {
      const testData = [
        { data: null, expected: 0 },
        { data: undefined, expected: 0 },
        { data: [], expected: 0 },
        { data: '1', expected: 1 },
        { data: 80, expected: 80 }
      ];

      await expect(idsDrag).not.toHaveAttribute('max-transform-y');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.maxTransformY)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.maxTransformY = tData.data as any;
          return element.maxTransformY;
        }, data)).toEqual(data.expected);
        if (data.expected > 0) {
          await expect(idsDrag).toHaveAttribute('max-transform-y', data.expected.toString());
        } else {
          await expect(idsDrag).not.toHaveAttribute('max-transform-y');
        }
      }
    });

    test('can set/get isDragging attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true }, // stringToBool returns any string value besides false as true
        { data: 'invalid', expected: true }
      ];

      await expect(idsDrag).not.toHaveAttribute('is-dragging');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.isDragging)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.isDragging = tData.data;
          return element.isDragging;
        }, data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsDrag).toHaveAttribute('is-dragging', '');
        } else {
          await expect(idsDrag).not.toHaveAttribute('is-dragging');
        }
      }
    });

    test('can set/get relativeBounds attribute', async () => {
      const testData = [
        { data: 'left: -20', expected: 'left: -20' },
        { data: 20, expected: '20' },
        { data: '', expected: null },
        { data: null, expected: null },
      ];

      await expect(idsDrag).not.toHaveAttribute('relative-bounds');
      expect(await idsDrag.evaluate((element: IdsDraggable) => element.relativeBounds)).toBeFalsy();

      for (const data of testData) {
        expect(await idsDrag.evaluate((element: IdsDraggable, tData) => {
          element.relativeBounds = tData.data;
          return element.relativeBounds;
        }, data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsDrag).toHaveAttribute('relative-bounds', data.expected);
        } else {
          await expect(idsDrag).not.toHaveAttribute('relative-bounds');
        }
      }
    });

    test('isDragging value true while dragging', async ({ page }) => {
      // if need to validate if the code below is working, disable the draggable
      // await idsDrag.evaluate((elem: IdsDraggable) => { elem.disabled = true; });
      let isDragging: boolean;
      const waitForDragging = async (elem: Locator) => {
        // retries for 100 times while the component is being dragged
        for (let i = 1; i <= 100; i++) {
          isDragging = await elem.evaluate((dDrag: IdsDraggable) => dDrag.isDragging);
          if (isDragging) break;
        }
        expect(isDragging).toBe(true);
      };

      const moveMouse = async (elem: Locator) => {
        const box = await elem.boundingBox();
        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down();
        // move the mouse 1 pixel at a time while checking if the isDragging is true
        for (let i = 1; i <= 100; i++) {
          await page.mouse.move(box!.x + i, box!.y);
          if (isDragging) break;
        }
        await page.mouse.up();
      };

      await Promise.all([
        waitForDragging(idsDrag),
        moveMouse(idsDrag)
      ]);
    });

    test('can drag with no errors', async ({ page }) => {
      const prevBox = await idsDrag.boundingBox();
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.type());
      });
      page.on('pageerror', (error) => errors.push(error.name));

      await page.mouse.move(prevBox!.x + prevBox!.width / 2, prevBox!.y + prevBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(-200, -200);
      await page.mouse.up();

      expect(errors).toHaveLength(0);
    });

    // getElTranslatePoint util
    test('can get computed translate values from style prop', async ({ browser }) => {
      const testData = [
        { data: 'none', expected: { x: 0, y: 0, z: 0 } },
        { data: 'matrix(1, 0, 0, 1, 114, 0)', expected: { x: 114, y: 0, z: 0 } },
        { data: 'matrix3d(0.5, 0, -0.866025, 0, 0.595877, 1.2, -1.03209, 0, 0.866025, 0, 0.5, 0, 25.9808, 0, 15, 1)', expected: { x: 25.9808, y: 0, z: 15 } },
        { data: 'matrix(0, 0, 0, 0, 0, 0)', expected: { x: 0, y: 0, z: 0 } },
        { data: 'matrix4d(0, 0, 0, 0, 0, 0)', expected: { x: 0, y: 0, z: 0 } },
        { data: 'matrix()', expected: { x: 0, y: 0, z: 0 } }
      ];
      // needs to create a new context to be able to insert the function
      const newContext = await browser.newContext({ bypassCSP: true });
      const newPage = await newContext.newPage();
      await newPage.goto(url);
      await newPage.addScriptTag({ content: `${getElTranslatePoint}` });
      let getEl = await newPage.evaluateHandle(`getElTranslatePoint(document.querySelector('#no-axis'))`);
      expect(await getEl.jsonValue()).toEqual({ x: 0, y: 0, z: 0 });

      for (const data of testData) {
        await newPage.evaluate((trans) => {
          const elem = document.querySelector('#no-axis') as IdsDraggable;
          elem.style.transform = trans.data;
        }, data);
        getEl = await newPage.evaluateHandle(`getElTranslatePoint(document.querySelector('#no-axis'))`);
        expect(await getEl.jsonValue()).toEqual(data.expected);
      }
      await newContext.close();
    });
  });
});
