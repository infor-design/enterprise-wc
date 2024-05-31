import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPieChart from '../../src/components/ids-pie-chart/ids-pie-chart';
import dataset from '../../src/assets/data/items-single.json';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

test.describe('IdsPieChart tests', () => {
  const url = '/ids-pie-chart/example.html';
  let pieChart: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    pieChart = await page.locator('ids-pie-chart').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Pie Chart Component');
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
      const handle = await page.$('ids-pie-chart');
      const html = await handle?.evaluate((el: IdsPieChart) => el?.outerHTML);
      await expect(html).toMatchSnapshot('pie-chart-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-pie-chart-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can set custom colors', async () => {
      const parentEl = await pieChart.evaluate((pie:IdsPieChart) => pie?.svgContainer?.parentNode?.querySelectorAll('.swatch')[0].classList);
      await expect(parentEl).toEqual({ 0: 'swatch', 1: 'color-1' });
      const color = await pieChart.evaluate((pie:IdsPieChart) => pie.color(0));
      await expect(color).toEqual('var(--ids-chart-color-accent-01)');
      const parentEl2 = await pieChart.evaluate((pie:IdsPieChart) => pie?.svgContainer?.parentNode?.querySelectorAll('.swatch')[1].classList);
      await expect(parentEl2).toEqual({ 0: 'swatch', 1: 'color-2' });
      const color2 = await pieChart.evaluate((pie:IdsPieChart) => pie.color(1));
      await expect(color2).toEqual('var(--ids-chart-color-accent-02)');
    });

    test('can set accessible patterns', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const piechartEl = document.createElement('ids-pie-chart') as IdsPieChart;
        piechartEl.animated = false;
        document.body.appendChild(piechartEl);

        piechartEl.data = [{
          data: [{
            name: 'Jan',
            value: 100,
            pattern: 'circles',
            patternColor: '#DA1217'
          }, {
            name: 'Feb',
            value: 200,
            pattern: 'exes'
          }]
        }];
      });

      const rect = await pieChart.evaluate((pie:IdsPieChart) => pie?.svgContainer?.parentNode?.querySelectorAll('.swatch svg')[0]?.querySelector('rect')?.getAttribute('fill'));
      await expect(rect).toEqual('url(#circles)');
      const svg = await pieChart.locator('.swatch svg').nth(0).locator('rect');
      await expect(svg).toHaveAttribute('fill', 'url(#circles)');
      let slice = await pieChart.locator('.slice').first();
      await expect(slice).toHaveAttribute('stroke', 'url(#circles)');

      const rect2 = await pieChart.evaluate((pie:IdsPieChart) => pie?.svgContainer?.parentNode?.querySelectorAll('.swatch svg')[1]?.querySelector('rect')?.getAttribute('fill'));
      await expect(rect2).toEqual('url(#exes)');
      const svg2 = await pieChart.locator('.swatch svg').nth(1).locator('rect');
      await expect(svg2).toHaveAttribute('fill', 'url(#exes)');
      slice = await pieChart.locator('.slice').nth(1);
      await expect(slice).toHaveAttribute('stroke', 'url(#exes)');
    });

    test('supports donut chart', async ({ page }) => {
      await page.evaluate((data) => {
        document.body.innerHTML = '';
        const piechartEl = document.createElement('ids-pie-chart') as IdsPieChart;
        piechartEl.animated = false;
        document.body.appendChild(piechartEl);
        piechartEl.donut = true;
        piechartEl.donutText = 'Test Text';
        piechartEl.data = data;
      }, dataset);

      expect(await pieChart.locator('[index="0"]').all()).toHaveLength(1);
      expect(await pieChart.locator('[index="1"]').all()).toHaveLength(1);
      expect(await pieChart.locator('[index="2"]').all()).toHaveLength(1);
      await pieChart.evaluate((pie:IdsPieChart) => { pie.donutText = 'Test Update'; });
      expect(await pieChart.locator('.donut-text').innerHTML()).toBe('Test Update');
    });

    test('shows a tooltip on hover', async () => {
      await pieChart.evaluate((pie:IdsPieChart) => { pie.animated = false; });
      const slice = pieChart.locator('.slice').first();
      await slice.dispatchEvent('hoverend');
      const tooltip = pieChart.locator('ids-tooltip') as Locator;
      await expect(tooltip).toHaveAttribute('visible', 'true');
      await expect(tooltip).toContainText('Item A 10.1');
    });

    test('can suppress tooltips', async () => {
      await pieChart.evaluate((pie:IdsPieChart) => { pie.suppressTooltips = true; });
      const slice = pieChart.locator('.slice').first();
      await slice.dispatchEvent('hoverend');
      const tooltip = pieChart.locator('ids-tooltip');
      await expect(tooltip).not.toHaveAttribute('visible');
    });

    test('shows a custom tooltip on hover', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const piechartEl = document.createElement('ids-pie-chart') as IdsPieChart;

        document.body.appendChild(piechartEl);
        piechartEl.animated = false;

        piechartEl.data = [{
          data: [{
            name: 'Jan',
            value: 100,
            tooltip: 'Test Tooltip'
          }, {
            name: 'Feb',
            value: 200,
            tooltip: 'Test Tooltip'
          }]
        }];
      });

      const slice = pieChart.locator('.slice').first();
      await slice.dispatchEvent('hoverend');
      const tooltip = pieChart.locator('ids-tooltip') as Locator;
      await expect(tooltip).toHaveAttribute('visible', 'true');
      await expect(tooltip).toContainText('Test Tooltip');
    });

    test('defaults missing value to zero in a tooltip', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const piechartEl = document.createElement('ids-pie-chart') as IdsPieChart;

        piechartEl.animated = false;
        document.body.appendChild(piechartEl);

        piechartEl.data = [{
          data: [{
            name: 'Jan',
            value: undefined
          }, {
            name: 'Feb',
            value: undefined
          }]
        }];
      });

      const slice = pieChart.locator('.slice').first();
      await slice.dispatchEvent('hoverend');
      const tooltip = pieChart.locator('ids-tooltip') as Locator;
      await expect(tooltip).toHaveAttribute('visible', 'true');
      await expect(tooltip).toContainText('Jan 0');
    });

    test('shows tooltip on hover with donut', async ({ page }) => {
      const ds = [{
        data: [
          { value: 1, name: 'slice1', tooltip: 'slice1' },
          { value: 1, name: 'slice2', tooltip: 'slice2' },
          { value: 1, name: 'slice3', tooltip: 'slice3' },
          { value: 1, name: 'slice4', tooltip: 'slice4' },
          { value: 1, name: 'slice5', tooltip: 'slice5' },
          { value: 1, name: 'slice6', tooltip: 'slice6' },
          { value: 1, name: 'slice7', tooltip: 'slice7' },
          { value: 1, name: 'slice8', tooltip: 'slice8' },
          { value: 1, name: 'slice9', tooltip: 'slice9' },
          { value: 1, name: 'slice10', tooltip: 'slice10' },
          { value: 1, name: 'slice11', tooltip: 'slice11' },
          { value: 1, name: 'slice12', tooltip: 'slice12' },
          { value: 1, name: 'slice13', tooltip: 'slice13' },
          { value: 1, name: 'slice14', tooltip: 'slice14' },
          { value: 1, name: 'slice15', tooltip: 'slice15' },
          { value: 1, name: 'slice16', tooltip: 'slice16' }
        ]
      }];
      await page.evaluate((data) => {
        document.body.innerHTML = '';
        const piechartEl = document.createElement('ids-pie-chart') as IdsPieChart;
        piechartEl.animated = false;
        document.body.appendChild(piechartEl);
        piechartEl.donut = true;
        piechartEl.donutText = 'Test';
        piechartEl.data = data;
      }, ds);
      const slices = await pieChart.locator('.slices').all();
      let i = 0;
      for (const slice of slices) {
        await slice.dispatchEvent('hoverend');
        const tooltip = pieChart.locator('ids-tooltip') as Locator;
        await expect(tooltip).toHaveAttribute('visible', 'true');
        await expect(tooltip).toContainText(ds[0].data[i].tooltip);
        i++;
      }
    });

    test('renders an empty message with empty data', async () => {
      let emptyMessage = await pieChart.locator('ids-empty-message');
      await expect(emptyMessage).toHaveAttribute('hidden', '');
      await pieChart.evaluate((pie:IdsPieChart) => { pie.data = []; });
      emptyMessage = await pieChart.locator('ids-empty-message');
      await expect(emptyMessage).not.toHaveAttribute('hidden');
      await pieChart.evaluate((pie:IdsPieChart) => {
        pie.data = [{
          data: [{
            name: 'Jan',
            value: 100
          }, {
            name: 'Feb',
            value: undefined
          }]
        }];
      });
      emptyMessage = await pieChart.locator('ids-empty-message');
      emptyMessage = await pieChart.locator('ids-empty-message');
      await expect(emptyMessage).toHaveAttribute('hidden', '');
      await pieChart.evaluate((pie:IdsPieChart) => { pie.data = []; });
      await expect(emptyMessage).not.toHaveAttribute('hidden');
    });

    test.skip('can translate empty text', async ({ page }) => {
      await pieChart.evaluate((pie:IdsPieChart) => {
        pie.data = [{
          data: [{
            name: 'Jan',
            value: 100
          }, {
            name: 'Feb',
            value: undefined
          }]
        }];
      });
      await pieChart.evaluate((pie:IdsPieChart) => { pie.data = []; });

      let emptyMessage = await pieChart.locator('ids-text');
      await expect(emptyMessage).toContainText('No data available');
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLocale('de-DE');
      });
      emptyMessage = await pieChart.locator('ids-text');
      await expect(emptyMessage).toContainText('Keine Daten verfügbar');
    });

    test('can set a static height', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        document.body.insertAdjacentHTML('beforeend', `<ids-pie-chart width="500" height="400" animated="true"></ids-pie-chart>`);
      });
      const dimensions = await pieChart.evaluate((pie:IdsPieChart) => {
        const height = pie.height;
        const width = pie.width;
        return {
          height,
          width
        };
      });
      await expect(dimensions.height).toBe(400);
      await expect(dimensions.width).toBe(500);
    });

    test('can set a legend formatter', async () => {
      await pieChart.evaluate((pie:IdsPieChart) => { pie.legendFormatter = (slice: any, datax: any) => `${slice.name}: ${datax.rounded}`; });
      const legend = await pieChart.locator('.chart-legend a').first();
      await expect(legend).toContainText('Item A: 11');
    });

    test('can set animation', async () => {
      await pieChart.evaluate((pie:IdsPieChart) => { pie.animated = false; });
      await pieChart.evaluate((pie:IdsPieChart) => { pie.animated = true; });
      const chartTemplate = await pieChart.evaluate((pie:IdsPieChart) => pie.chartTemplate());
      await expect(chartTemplate).toContain('stroke-dashoffset');
      await expect(pieChart).toHaveAttribute('animated', 'true');
    });

    test('defaults animation to true', async () => {
      const isanimated = await pieChart.evaluate((pie:IdsPieChart) => pie.animated);
      await expect(isanimated).toBe(true);
    });

    test('can set data to empty', async () => {
      await pieChart.evaluate((pie:IdsPieChart) => { pie.data = null as any; });
      const pieData = await pieChart.evaluate((pie:IdsPieChart) => pie.data);
      await expect(pieData).toHaveLength(0);
    });

    test('can set title', async () => {
      let title = await pieChart.evaluate((pie:IdsPieChart) => pie.title);
      await expect(title).toBe('A pie chart showing component usage');
      await expect(await pieChart.locator('title').first()).toContainText('');
      await expect(await pieChart.locator('title').nth(1)).toContainText('');
      await pieChart.evaluate((pie:IdsPieChart) => { pie.title = 'Test Title'; });
      title = await pieChart.evaluate((pie:IdsPieChart) => pie.title);
      await expect(title).toBe('Test Title');
      await expect(await pieChart.locator('title').first()).toContainText('');
      await expect(await pieChart.locator('title').nth(1)).toContainText('Test Title');
    });

    test('can set selectable', async () => {
      let selectable = await pieChart.evaluate((pie:IdsPieChart) => pie.selectable);
      await expect(selectable).toBe(false);
      await expect(pieChart).not.toHaveAttribute('selectable');
      await pieChart.evaluate((pie:IdsPieChart) => { pie.selectable = true; });
      selectable = await pieChart.evaluate((pie:IdsPieChart) => pie.selectable);
      await expect(selectable).toBe(true);
      await expect(pieChart).toHaveAttribute('selectable', '');
      await pieChart.evaluate((pie:IdsPieChart) => { pie.selectable = false; });
      selectable = await pieChart.evaluate((pie:IdsPieChart) => pie.selectable);
      await expect(selectable).toBe(false);
      await expect(pieChart).not.toHaveAttribute('selectable');
    });

    test('select/deselect by click', async () => {
      const selectionElements = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.length);
      await expect(selectionElements).toBe(0);
      const setSelection = await pieChart.evaluate((pie:IdsPieChart) => pie.setSelection(1));
      await expect(setSelection).toBe(false);
      await pieChart.evaluate((pie:IdsPieChart) => { pie.selectable = true; });
      let selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
      const legend = await pieChart.locator('.chart-legend-item:nth-child(1)');
      await legend.click();
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(1);
      await legend.click();
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);

      let slice = await pieChart.locator('.slice[index="2"]');
      await slice.dispatchEvent('click');
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(1);
      slice = await pieChart.locator('.slice[index="0"]');
      await slice.dispatchEvent('click');
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(1);
      await slice.dispatchEvent('click');
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
    });

    test('can set pre selected elements', async () => {
      const ds: any = deepClone(dataset);
      ds[0].data[2].selected = true;
      await pieChart.evaluate((pie:IdsPieChart, data: any) => {
        pie.selectable = true;
        pie.animated = false;
        pie.data = data;
      }, ds);
      const selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(1);
    });

    test('can veto before selected', async () => {
      await pieChart.evaluate((pie: IdsPieChart) => {
        pie.addEventListener('beforeselected', ((e: CustomEvent) => {
          e.detail.response(false);
        }) as EventListener);
      });
      await pieChart.evaluate((pie:IdsPieChart) => { pie.selectable = true; });
      let selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
      const legend = await pieChart.locator('.chart-legend-item:nth-child(1)');
      const legend2 = await pieChart.locator('.chart-legend-item:nth-child(2)');
      await legend.click();
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
      await legend2.dispatchEvent('click');
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
      await pieChart.evaluate((pie: IdsPieChart) => {
        pie.addEventListener('beforeselected', ((e: CustomEvent) => {
          e.detail.response(true);
        }) as EventListener);
      });
      await legend.click();
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(1);
      await legend.click();
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
    });

    test('can get/set selected by api', async () => {
      const val: any = 2;
      const newVal: any = 'Test';
      await pieChart.evaluate((pie:IdsPieChart, value: any) => pie.setSelected(value), val);
      let selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);
      let getSelected = await pieChart.evaluate((pie:IdsPieChart) => pie.getSelected());
      await expect(getSelected).toEqual({});
      await pieChart.evaluate((pie:IdsPieChart) => { pie.selectable = true; });

      await pieChart.evaluate((pie:IdsPieChart, value: any) => pie.setSelected(value), newVal);
      getSelected = await pieChart.evaluate((pie:IdsPieChart) => pie.getSelected());
      await expect(getSelected).toEqual({});
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(0);

      await pieChart.evaluate((pie:IdsPieChart) => pie.setSelected({ index: 0 }));
      selected = await pieChart.evaluate((pie:IdsPieChart) => pie.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected')).length);
      await expect(selected).toEqual(1);
      getSelected = await pieChart.evaluate((pie:IdsPieChart) => pie.getSelected().index);
      await expect(getSelected).toEqual('0');
    });
  });
});
