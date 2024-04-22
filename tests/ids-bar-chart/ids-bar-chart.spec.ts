import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsBarChart from '../../src/components/ids-bar-chart/ids-bar-chart';
import dataset from '../../src/assets/data/components.json';
import { stringToNumber } from '../../src/utils/ids-string-utils/ids-string-utils';
import { IdsChartData } from '../../src/components/ids-axis-chart/ids-axis-chart';

test.describe('IdsBarChart tests', () => {
  const url = '/ids-bar-chart/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Bar Chart Component');
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
      await percySnapshot(page, 'ids-bar-chart-light');
    });
  });

  test.describe('functionality tests', () => {
    let idsBarChart: Locator;

    test.beforeEach(async ({ page }) => {
      idsBarChart = await page.locator('ids-bar-chart');
    });

    test('can get selectionElements', async () => {
      let result = await idsBarChart.evaluate((element: IdsBarChart) => {
        const res = { selectable: element.selectable, selectionElements: element.selectionElements };
        return res;
      });

      expect(result.selectable).toBeFalsy();
      expect(result.selectionElements).toEqual([]);

      result = await idsBarChart.evaluate((element: IdsBarChart) => {
        element.selectable = true;
        const res = { selectable: element.selectable, selectionElements: element.selectionElements };
        return res;
      });

      expect(result.selectable).toBeTruthy();
      expect(result.selectionElements.length).toBeGreaterThan(0);
    });

    test('can get groupCount attribute', async () => {
      expect(await idsBarChart.evaluate((element: IdsBarChart) => element.groupCount)).toEqual(1);
    });

    test('can get alignXLabels attribute', async () => {
      expect(await idsBarChart.evaluate((element: IdsBarChart) => element.alignXLabels)).toEqual('middle');
    });

    test('can set/get barPercentage attribute', async () => {
      const defPercent = 0.5;
      const testData = [
        { data: 0.1, expected: 0.1 },
        { data: 0, expected: defPercent },
        { data: '0.2', expected: 0.2 },
        { data: 1.1, expected: defPercent },
        { data: 'Test', expected: defPercent }
      ];

      expect(await idsBarChart.evaluate((element: IdsBarChart) => element.barPercentage)).toEqual(defPercent);
      await expect(idsBarChart).not.toHaveAttribute('bar-percentage');

      for (const data of testData) {
        expect(await idsBarChart.evaluate((element: IdsBarChart, tData) => {
          element.barPercentage = tData as any;
          return element.barPercentage;
        }, data.data)).toEqual(data.expected);
        if (!Number.isNaN(stringToNumber(data.data)) && (stringToNumber(data.data) > 0 && stringToNumber(data.data) <= 1)) {
          await expect(idsBarChart).toHaveAttribute('bar-percentage', data.expected.toString());
        } else {
          await expect(idsBarChart).not.toHaveAttribute('bar-percentage');
        }
      }
    });

    test('can set/get categoryPercentage attribute', async () => {
      const defPercent = 0.9;
      const testData = [
        { data: 0.1, expected: 0.1 },
        { data: 0, expected: defPercent },
        { data: '0.2', expected: 0.2 },
        { data: 1.1, expected: defPercent },
        { data: 'Test', expected: defPercent }
      ];

      expect(await idsBarChart.evaluate((element: IdsBarChart) => element.categoryPercentage)).toEqual(defPercent);
      await expect(idsBarChart).not.toHaveAttribute('category-percentage');

      for (const data of testData) {
        expect(await idsBarChart.evaluate((element: IdsBarChart, tData) => {
          element.categoryPercentage = tData as any;
          return element.categoryPercentage;
        }, data.data)).toEqual(data.expected);
        if (!Number.isNaN(stringToNumber(data.data)) && (stringToNumber(data.data) > 0 && stringToNumber(data.data) <= 1)) {
          await expect(idsBarChart).toHaveAttribute('category-percentage', data.expected.toString());
        } else {
          await expect(idsBarChart).not.toHaveAttribute('category-percentage');
        }
      }
    });

    test('can set/get horizontal', async () => {
      expect(await idsBarChart.evaluate((element: IdsBarChart) => element.horizontal)).toBeFalsy();
      await expect(idsBarChart).not.toHaveAttribute('horizontal');

      expect(await idsBarChart.evaluate((element: IdsBarChart) => {
        element.horizontal = true;
        return element.horizontal;
      })).toBeTruthy();
      await expect(idsBarChart).toHaveAttribute('horizontal');
    });

    test('can set/get stacked chart type', async () => {
      expect(await idsBarChart.evaluate((element: IdsBarChart) => element.stacked)).toBeFalsy();
      await expect(idsBarChart).not.toHaveAttribute('stacked');

      await idsBarChart.evaluate((element: IdsBarChart, data) => {
        element.data = data;
        element.stacked = true;
      }, dataset);
      await expect(idsBarChart).toHaveAttribute('stacked', 'true');
    });

    /**
     * Selected class validation
     * @param {Locator[]} elements array of locators
     * @param {string} index groupIndex of the element
     * @param {'select' | 'deselect'} mode 'select' | 'deselect'
     * @param {'group-index' | 'index'} [attribute] attribute to check
     * @param {boolean} [checkSelected] for validation of attribute selected
     */
    async function validateSelected(
      elements: Locator[],
      index: string,
      mode: 'select' | 'deselect',
      attribute: 'group-index' | 'index' = 'group-index',
      checkSelected: boolean = false
    ) {
      for (let i = 0; i < elements.length; i++) {
        if (mode === 'select') {
          if ((await elements[i].getAttribute(attribute)) === index) {
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

    test('can be selected/deselected by clicking the bars', async () => {
      test.slow(true, 'this test runs slow as its selecting/deselecting all rectangle');
      expect(await idsBarChart.evaluate((element: IdsBarChart, data) => {
        element.data = data;
        element.stacked = true;
        element.selectable = true;
        return element.selectable;
      }, dataset)).toBeTruthy();
      const bars = await idsBarChart.locator('g.bars g rect').all();

      for (const bar of bars) {
        const index = await bar.getAttribute('index');

        // select
        await bar.dispatchEvent('click');
        await validateSelected(bars, index!, 'select', 'index', true);

        // deselect
        await bar.dispatchEvent('click');
        await validateSelected(bars, index!, 'deselect', 'index');
      }
    });

    test('can be selected/deselected by clicking the legends', async () => {
      expect(await idsBarChart.evaluate((element: IdsBarChart, data) => {
        element.data = data;
        element.stacked = true;
        element.selectable = true;
        return element.selectable;
      }, dataset)).toBeTruthy();
      const bars = await idsBarChart.locator('g.bars g rect').all();
      const legends = await idsBarChart.locator('slot[name="legend"] a').all();

      for (const legend of legends) {
        const index = await legend.getAttribute('data-index');

        // select
        await legend.dispatchEvent('click');
        await validateSelected(bars, index!, 'select', 'group-index', true);

        // deselect
        await legend.dispatchEvent('click');
        await validateSelected(bars, index!, 'deselect', 'group-index');
      }
    });

    test('can set custom colors', async ({ page }) => {
      const series1Color = '#800000';
      const series2Color = '--ids-color-blue-20';
      const testData = [{
        data: [{
          name: 'Jan',
          value: 100
        }, {
          name: 'Feb',
          value: 200
        }],
        name: 'Series 1',
        color: series1Color,
      }, {
        data: [{
          name: 'Jan',
          value: 100
        }, {
          name: 'Feb',
          value: 300
        }],
        name: 'Series 2',
        color: series2Color,
      }] as Array<IdsChartData>;
      const hexToRGB = (hex: string) => {
        hex = hex.replace(/^#/, '');
        return {
          red: parseInt(hex.substring(0, 2), 16),
          green: parseInt(hex.substring(2, 4), 16),
          blue: parseInt(hex.substring(4, 6), 16)
        };
      };
      const series1RGB = hexToRGB(series1Color);
      const series2RGB = hexToRGB(await page.evaluate((
        color
      ) => getComputedStyle(document.body).getPropertyValue(color), series2Color));

      await idsBarChart.evaluate((element: IdsBarChart, data) => {
        element.data = data;
        element.redraw();
      }, testData);

      const bars1 = await idsBarChart.locator('g.bars g rect[group-index="0"]').all();
      const bars2 = await idsBarChart.locator('g.bars g rect[group-index="1"]').all();

      // validate first bar color
      for (const bar of bars1) {
        await expect(bar).toHaveCSS('fill', `rgb(${series1RGB.red}, ${series1RGB.green}, ${series1RGB.blue})`);
      }

      // validate second bar color
      for (const bar of bars2) {
        await expect(bar).toHaveCSS('fill', `rgb(${series2RGB.red}, ${series2RGB.green}, ${series2RGB.blue})`);
      }
    });

    test('can set/get selected', async () => {
      expect(await idsBarChart.evaluate((element: IdsBarChart, data) => {
        element.data = data;
        element.stacked = true;
        element.selectable = true;
        return element.selectable;
      }, dataset)).toBeTruthy();

      const testData = [
        { groupIndex: 0, index: undefined },
        { groupIndex: 1, index: 5 },
        { groupIndex: 2, index: 3 },
      ];
      const bars = await idsBarChart.locator('g.bars g rect').all();

      for (const data of testData) {
        await idsBarChart.evaluate((element: IdsBarChart, select) => {
          element.selectable = true;
          element.setSelected({ groupIndex: select.groupIndex, index: select.index });
          return element.getSelected();
        }, data);
        if (data.index === undefined) {
          await validateSelected(bars, data.groupIndex.toString(), 'select', 'group-index', true);
        } else {
          await validateSelected(bars, data.index.toString(), 'select', 'index', true);
        }
      }
    });

    test('can show tooltip on hover', async () => {
      const toolTipStrings = [
        'January 100',
        'February 3111',
        'March 3411',
        'April 500',
        'May 3411',
        'June 6500'
      ];
      let index = 0;

      for (const bar of await idsBarChart.locator('g.bars g rect').all()) {
        await bar.dispatchEvent('hoverend');
        await expect(idsBarChart.locator('ids-tooltip')).toHaveAttribute('visible', 'true');
        await expect(idsBarChart.locator('ids-tooltip')).toHaveText(toolTipStrings[index]);
        index++;
      }
    });
  });
});
