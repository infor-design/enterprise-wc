import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsAreaChart from '../../src/components/ids-area-chart/ids-area-chart';
import { IdsChartData } from '../../src/components/ids-axis-chart/ids-axis-chart';

test.describe('IdsAreaChart tests', () => {
  const url = '/ids-area-chart/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Area Chart Component');
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
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-area-chart-light');
    });
  });

  test.describe('functionality tests', () => {
    let idsAreaChart: Locator;

    test.beforeEach(async ({ page }) => {
      idsAreaChart = await page.locator('ids-area-chart');
    });

    test('can get selectionElements', async () => {
      let result = await idsAreaChart.evaluate((element: IdsAreaChart) => {
        const res = { selectable: element.selectable, selectionElements: element.selectionElements };
        return res;
      });

      expect(result.selectable).toBeFalsy();
      expect(result.selectionElements).toEqual([]);

      result = await idsAreaChart.evaluate((element: IdsAreaChart) => {
        element.selectable = true;
        const res = { selectable: element.selectable, selectionElements: element.selectionElements };
        return res;
      });

      expect(result.selectable).toBeTruthy();
      expect(result.selectionElements.length).toBeGreaterThan(0);
    });

    test('can set/get markerSize attribute', async () => {
      const circle = await idsAreaChart.locator('g.markers circle').all();
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => element.markerSize)).toEqual(5);
      await expect(idsAreaChart).not.toHaveAttribute('marker-size');
      circle.forEach(async (item) => {
        await expect(item).toHaveAttribute('r', '5');
      });

      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => {
        element.markerSize = 10;
        return element.markerSize;
      })).toEqual(10);
      await expect(idsAreaChart).toHaveAttribute('marker-size', '10');
      circle.forEach(async (item) => {
        await expect(item).toHaveAttribute('r', '10');
      });
    });

    test('can set/get animated attribute', async () => {
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => element.shadowRoot?.querySelectorAll('animate').length)).toBeGreaterThan(0);
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => {
        element.animated = false;
        element.redraw();
        return element.shadowRoot?.querySelectorAll('animate').length;
      })).toEqual(0);

      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => {
        element.animated = true;
        element.redraw();
        return element.shadowRoot?.querySelectorAll('animate').length;
      })).toBeGreaterThan(0);
    });

    test('can set custom colors', async () => {
      const testData = [{
        data: [{
          name: 'Jan',
          value: 100
        }, {
          name: 'Feb',
          value: 200
        }],
        name: 'Series 1',
        color: '#800000',
      }, {
        data: [{
          name: 'Jan',
          value: 100
        }, {
          name: 'Feb',
          value: 300
        }],
        name: 'Series 2',
        color: '--ids-color-blue-20',
      }] as Array<IdsChartData>;
      const circlesExpLength = testData.length * 2;

      await idsAreaChart.evaluate((element: IdsAreaChart, data) => {
        element.data = data;
        element.redraw();
      }, testData);

      const lines = await idsAreaChart.locator('g.marker-lines polyline').all();
      const circles = await idsAreaChart.locator('g.markers circle').all();
      const legends = await idsAreaChart.locator('div.chart-legend > a > div').all();
      const colors = await idsAreaChart.evaluate((element: IdsAreaChart, len) => {
        const res: string[] = [];
        for (let i = 0; i < len; i++) res.push(element.color(i));
        return res;
      }, testData.length);

      colors.forEach((color, index) => {
        expect(color).toEqual(`var(color-${index + 1})`);
      });

      expect(lines).toHaveLength(testData.length);
      expect(circles).toHaveLength(circlesExpLength);
      expect(legends).toHaveLength(testData.length);

      lines.forEach(async (line, index) => {
        await expect(line).toHaveClass(new RegExp(`color-${index + 1}`, 'g'));
      });
      let colInd = 0;
      for (let i = 0; i < circles.length; i++) {
        if (i % 2 === 0) colInd++;
        await expect(circles[i]).toHaveClass(new RegExp(`color-${colInd}`, 'g'));
      }
      legends.forEach(async (legend, index) => {
        await expect(legend).toHaveClass(new RegExp(`color-${index + 1}`, 'g'));
      });
    });

    test('can set/get selected', async () => {
      const lines = await idsAreaChart.locator('g.marker-lines polyline').all();
      const circles = await idsAreaChart.locator('g.markers circle').all();

      await expect(idsAreaChart).not.toHaveAttribute('selected');
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => element.selectable)).toBeFalsy();
      lines.forEach(async (line) => {
        await expect(line).not.toHaveClass('selected');
      });
      circles.forEach(async (circle) => {
        await expect(circle).not.toHaveClass('selected');
      });

      // select line if selectable = false
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => {
        element.setSelected({ groupIndex: 0, index: 0 });
        return element.getSelected();
      })).toEqual({});
      lines.forEach(async (line) => {
        await expect(line).not.toHaveClass('selected');
      });
      circles.forEach(async (circle) => {
        await expect(circle).not.toHaveClass('selected');
      });

      const testData = [
        { groupIndex: 0, index: undefined },
        { groupIndex: 1, index: 5 },
        { groupIndex: 2, index: 3 },
      ];

      for (const data of testData) {
        const selected = await idsAreaChart.evaluate((element: IdsAreaChart, select) => {
          element.selectable = true;
          element.setSelected({ groupIndex: select.groupIndex, index: select.index });
          return element.getSelected();
        }, data);
        expect(selected.groupIndex).toBe(data.groupIndex.toString());
        expect(selected.index).toBe((data.index !== undefined) ? data.index.toString() : undefined);

        lines.forEach(async (line) => {
          if ((await line.getAttribute('group-index')) === data.groupIndex.toString()) {
            await expect(line).toHaveClass(/selected/);
          } else {
            await expect(line).toHaveClass(/not-selected/);
          }
        });
        circles.forEach(async (circle) => {
          if ((await circle.getAttribute('group-index')) === data.groupIndex.toString()) {
            await expect(circle).toHaveClass(/selected/);
          } else {
            await expect(circle).toHaveClass(/not-selected/);
          }
        });
      }
    });

    test('prevent setting of horizontal attribute', async () => {
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => element.horizontal)).toBeFalsy();
      await expect(idsAreaChart).not.toHaveAttribute('horizontal');
      expect(await idsAreaChart.evaluate((element: IdsAreaChart) => {
        element.horizontal = true;
        return element.horizontal;
      })).toBeFalsy();
      await expect(idsAreaChart).not.toHaveAttribute('horizontal');
    });

    /**
     * Selected class validation
     * @param {Locator[]} elements array of locators
     * @param {string} index groupIndex of the element
     * @param {'select' | 'deselect'} mode 'select' | 'deselect'
     * @param {boolean} [checkSelected] for validation of attribute selected
     */
    async function validateSelected(elements: Locator[], index: string, mode: 'select' | 'deselect', checkSelected: boolean = false) {
      for (let i = 0; i < elements.length; i++) {
        if (mode === 'select') {
          if ((await elements[i].getAttribute('group-index')) === index) {
            await expect(elements[i]).toHaveClass(/selected/);
            if (checkSelected) await expect(elements[i]).toHaveAttribute('selected');
          } else {
            await expect(elements[i]).toHaveClass(/not-selected/);
            if (checkSelected) await expect(elements[i]).not.toHaveAttribute('selected');
          }
        } else {
          await expect(elements[i]).not.toHaveClass(/selected/);
          await expect(elements[i]).not.toHaveClass(/not-selected/);
          if (checkSelected) await expect(elements[i]).not.toHaveAttribute('selected');
        }
      }
    }

    test('can be selected/deselected by clicking the area', async () => {
      const lines = await idsAreaChart.locator('g.marker-lines polyline').all();
      const circles = await idsAreaChart.locator('g.markers circle').all();
      const areas = await idsAreaChart.locator('g.areas path').all();

      await idsAreaChart.evaluate((element: IdsAreaChart) => { element.selectable = true; });

      for (const area of areas) {
        const groupIndex = await area.getAttribute('group-index');

        // select the area
        await area.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'select');
        await validateSelected(lines, groupIndex!, 'select', true);
        await validateSelected(circles, groupIndex!, 'select');

        // deselect the area
        await area.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'deselect');
        await validateSelected(lines, groupIndex!, 'deselect', true);
        await validateSelected(circles, groupIndex!, 'deselect');
      }
    });

    test('can be selected/deselected by clicking the line', async () => {
      const lines = await idsAreaChart.locator('g.marker-lines polyline').all();
      const circles = await idsAreaChart.locator('g.markers circle').all();
      const areas = await idsAreaChart.locator('g.areas path').all();

      await idsAreaChart.evaluate((element: IdsAreaChart) => { element.selectable = true; });

      for (const line of lines) {
        const groupIndex = await line.getAttribute('group-index');

        // select the line
        await line.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'select');
        await validateSelected(lines, groupIndex!, 'select', true);
        await validateSelected(circles, groupIndex!, 'select');

        // deselect the line
        await line.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'deselect');
        await validateSelected(lines, groupIndex!, 'deselect', true);
        await validateSelected(circles, groupIndex!, 'deselect');
      }
    });

    // https://github.com/infor-design/enterprise-wc/issues/2235
    test.skip('can be selected/deselected by clicking the markers', async ({ page }) => {
      const lines = await idsAreaChart.locator('g.marker-lines polyline').all();
      const circles = await idsAreaChart.locator('g.markers circle').all();
      const areas = await idsAreaChart.locator('g.areas path').all();

      const errors: any[] = [];
      await page.evaluate(`console.clear()`);
      page.on('pageerror', (exception) => errors.push(exception.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text);
      });

      await idsAreaChart.evaluate((element: IdsAreaChart) => { element.selectable = true; });

      for (const circle of circles) {
        const groupIndex = await circle.getAttribute('group-index');

        // select the marker
        await circle.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'select');
        await validateSelected(lines, groupIndex!, 'select');
        await validateSelected(circles, groupIndex!, 'select');

        // deselect the marker
        await circle.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'deselect');
        await validateSelected(lines, groupIndex!, 'deselect');
        await validateSelected(circles, groupIndex!, 'deselect');
      }
      expect(errors).toStrictEqual([]);
    });

    test('can be selected/deselected by clicking the legends', async () => {
      const lines = await idsAreaChart.locator('g.marker-lines polyline').all();
      const circles = await idsAreaChart.locator('g.markers circle').all();
      const areas = await idsAreaChart.locator('g.areas path').all();
      const legends = await idsAreaChart.locator('slot[name="legend"] a').all();

      await idsAreaChart.evaluate((element: IdsAreaChart) => { element.selectable = true; });

      for (const legend of legends) {
        const groupIndex = await legend.getAttribute('data-index');

        // select the area
        await legend.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'select');
        await validateSelected(lines, groupIndex!, 'select', true);
        await validateSelected(circles, groupIndex!, 'select');

        // deselect the area
        await legend.dispatchEvent('click');
        await validateSelected(areas, groupIndex!, 'deselect');
        await validateSelected(lines, groupIndex!, 'deselect', true);
        await validateSelected(circles, groupIndex!, 'deselect');
      }
    });
  });
});
