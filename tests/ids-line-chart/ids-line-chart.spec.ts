import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsLineChart from '../../src/components/ids-line-chart/ids-line-chart';
import { IdsChartData } from '../../src/components/ids-axis-chart/ids-axis-chart';

test.describe('IdsLineChart tests', () => {
  const url = '/ids-line-chart/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Line Chart Component');
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
      const handle = await page.$('ids-line-chart');
      const html = await handle?.evaluate((el: IdsLineChart) => el?.outerHTML);
      await expect(html).toMatchSnapshot('line-chart-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-line-chart');
      const html = await handle?.evaluate((el: IdsLineChart) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('line-chart-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-line-chart-light');
    });
  });

  test.describe('functionality tests', () => {
    let idsLine: Locator;

    test.beforeEach(async ({ page }) => {
      idsLine = await page.locator('#index-example');
    });

    test('can set/get markerSize attribute', async () => {
      await expect(idsLine).not.toHaveAttribute('marker-size');
      expect(await idsLine.evaluate((element: IdsLineChart) => element.markerSize)).toEqual(5);

      expect(await idsLine.evaluate((element: IdsLineChart) => {
        element.markerSize = 8;
        return element.markerSize;
      })).toEqual(8);
      await expect(idsLine).toHaveAttribute('marker-size', '8');
    });

    test('can enable/disable animation', async () => {
      expect(await idsLine.evaluate((element: IdsLineChart) => element.shadowRoot?.querySelectorAll('animate').length)).toBeGreaterThan(0);
      expect(await idsLine.evaluate((element: IdsLineChart) => {
        element.animated = false;
        element.redraw();
        return element.shadowRoot?.querySelectorAll('animate').length;
      })).toEqual(0);

      expect(await idsLine.evaluate((element: IdsLineChart) => {
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

      await idsLine.evaluate((element: IdsLineChart, data) => {
        element.data = data;
        element.redraw();
      }, testData);

      const lines = await idsLine.locator('g.marker-lines polyline').all();
      const circles = await idsLine.locator('g.markers circle').all();
      const legends = await idsLine.locator('div.chart-legend > a > div').all();
      const colors = await idsLine.evaluate((element: IdsLineChart, len) => {
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
      const lines = await idsLine.locator('g.marker-lines polyline').all();
      const circles = await idsLine.locator('g.markers circle').all();

      await expect(idsLine).not.toHaveAttribute('selected');
      expect(await idsLine.evaluate((element: IdsLineChart) => element.selectable)).toBeFalsy();
      lines.forEach(async (line) => {
        await expect(line).not.toHaveClass('selected');
      });
      circles.forEach(async (circle) => {
        await expect(circle).not.toHaveClass('selected');
      });

      // select line if selectable = false
      expect(await idsLine.evaluate((element: IdsLineChart) => {
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
        const selected = await idsLine.evaluate((element: IdsLineChart, select) => {
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
      expect(await idsLine.evaluate((element: IdsLineChart) => element.horizontal)).toBeFalsy();
      await expect(idsLine).not.toHaveAttribute('horizontal');
      expect(await idsLine.evaluate((element: IdsLineChart) => {
        element.horizontal = true;
        return element.horizontal;
      })).toBeFalsy();
      await expect(idsLine).not.toHaveAttribute('horizontal');
    });
  });
});
