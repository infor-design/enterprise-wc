import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';

test.describe('IdsAxisChart tests', () => {
  const url = '/ids-axis-chart/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', async () => {
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

  test.describe('functionality tests', () => {
    test('should hide the legend if no name', async ({ page }) => {
      await page.goto('/ids-axis-chart/hide-legend.html');
      const locator = await page.locator('.chart-legend').first();
      expect(await locator.innerHTML()).toBe('');
    });

    test('supports setting title', async ({ page }) => {
      await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        axisChart.title = 'Test Title';
      });
      const locator = await page.locator('ids-axis-chart title');
      expect(await locator.textContent()).toEqual('Test Title');
    });

    test('supports setting height inline', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart');
        axisChart?.setAttribute('width', '500');
        axisChart?.setAttribute('height', '500');
        return [
          axisChart?.svg?.getAttribute('width'),
          axisChart?.svg?.getAttribute('height')
        ];
      });
      expect(values[0]).toEqual('500');
      expect(values[1]).toEqual('500');
    });

    test('supports setting animated', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const animated = axisChart.animated;
        axisChart.animated = false;

        return [
          animated,
          axisChart.animated,
          axisChart.getAttribute('animated'),
        ];
      });

      expect(values[0]).toEqual(true);
      expect(values[1]).toEqual(false);
      expect(values[2]).toEqual('false');
    });

    test('supports setting width', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const width = axisChart.width;
        axisChart.width = 400;

        return [
          width,
          axisChart.width,
          axisChart.shadowRoot?.querySelector('svg')?.getAttribute('width')
        ];
      });

      expect(values[0]).toEqual(700);
      expect(values[1]).toEqual(400);
      expect(values[2]).toEqual('400');
    });

    test('supports setting width to inherit', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        axisChart.width = 'inherit';
        return [
          axisChart.getAttribute('width'),
        ];
      });
      expect(values[0]).toEqual('inherit');
    });

    test('skips resize when not initialized', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        axisChart.width = 500;
        axisChart.initialized = false;
        axisChart.resize(300, 300);
        return [
          axisChart.svg?.getAttribute('width'),
        ];
      });
      expect(values[0]).toEqual('500');
    });

    test('supports setting height to inherit', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        axisChart.height = 'inherit';
        return [
          axisChart.getAttribute('height'),
        ];
      });
      expect(values[0]).toEqual('inherit');
    });

    test('supports setting height even when hidden', async ({ page }) => {
      const values = await page.evaluate(() => {
        const container = document.querySelector<IdsAxisChart>('ids-container')!;
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;

        container.hidden = true;
        axisChart.height = 300;
        const results: any = [
          axisChart.height,
        ];

        container.hidden = false;
        results.push(axisChart.svg?.getAttribute('height'));

        return results;
      });

      expect(values[0]).toEqual(300);
      expect(values[1]).toEqual('300');
    });

    test('supports setting margins', async ({ page }) => {
      const newMargins = {
        left: 32,
        right: 32,
        top: 32,
        bottom: 32,
        leftInner: 32,
        rightInner: 32,
        topInner: 32,
        bottomInner: 32
      };

      const values = await page.evaluate(({ marginValue }) => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const results = [
          axisChart.margins.left,
          axisChart.margins.right
        ];

        axisChart.margins = marginValue;
        results.push(axisChart.margins);
        results.push(axisChart.state.margins);

        return results;
      }, { marginValue: newMargins });

      expect(values[0]).toEqual(values[0]);
      expect(values[1]).toEqual(4);
      expect(values[2]).toEqual(newMargins);
      expect(values[3]).toEqual(newMargins);
    });

    test('supports setting textWidths', async ({ page }) => {
      const newTextWidths = {
        left: 40, right: 40, top: 40, bottom: 40
      };

      const values = await page.evaluate(({ textWidths }) => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const results: any = [
          axisChart.textWidths.left,
          axisChart.textWidths.right
        ];

        axisChart.textWidths = textWidths;
        results.push(axisChart.textWidths);
        results.push(axisChart.state.textWidths);

        return results;
      }, { textWidths: newTextWidths });

      // expect(values[0]).toEqual(4);
      // expect(values[1]).toEqual(0);
      expect(values[2]).toEqual(newTextWidths);
      expect(values[3]).toEqual(newTextWidths);
    });

    test('supports setting dataset to null', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.data = null;
        return [
          axisChart.shadowRoot?.querySelector('.grid'),
          axisChart.data
        ];
      });
      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual([]);
    });

    test('supports setting yAxisMin', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const results = [
          axisChart.yAxisMin,
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[8].textContent
        ];

        axisChart.yAxisMin = 1000;
        results.push(axisChart.shadowRoot?.querySelectorAll('.y-labels text')[0].textContent);
        results.push(axisChart.shadowRoot?.querySelectorAll('.y-labels text')[7].textContent);

        return results;
      });

      expect(values[0]).toEqual(0);
      expect(values[1]).toEqual('8K');
      expect(values[2]).toEqual('0');
      expect(values[3]).toEqual('8K');
      expect(values[4]).toEqual('1K');
    });

    test('supports setting showVerticalGridLines', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const results = [
          axisChart.showVerticalGridLines,
          axisChart.shadowRoot?.querySelector('.grid.vertical-lines.hidden')
        ];

        axisChart.showVerticalGridLines = true;
        results.push(axisChart.shadowRoot?.querySelector('.grid.vertical-lines.hidden'));

        axisChart.showVerticalGridLines = false;
        results.push(axisChart.shadowRoot?.querySelector('.grid.vertical-lines.hidden'));

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toBeTruthy();
      expect(values[2]).toBeFalsy();
      expect(values[3]).toBeTruthy();
    });

    test('supports setting showHorizontalGridLines', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        const results = [
          axisChart.showHorizontalGridLines,
          axisChart.shadowRoot?.querySelector('.grid.horizontal-lines.hidden')
        ];

        axisChart.showHorizontalGridLines = false;
        results.push(axisChart.shadowRoot?.querySelector('.grid.horizontal-lines.hidden'));

        axisChart.showHorizontalGridLines = true;
        results.push(axisChart.shadowRoot?.querySelector('.grid.horizontal-lines.hidden'));

        return results;
      });

      expect(values[0]).toEqual(true);
      expect(values[1]).toBeFalsy();
      expect(values[2]).toBeTruthy();
      expect(values[3]).toBeFalsy();
    });

    test('renders zero when missing value', async ({ page }) => {
      const newData = [{
        data: [{
          name: 'Jan',
          value: 100
        }, {
          name: 'Feb',
          value: null
        }]
      }];
      const values = await page.evaluate(({ data }) => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.data = data;
        return [
          axisChart.markerData.points[0]['1'].value,
        ];
      }, { data: newData });
      expect(values[0]).toEqual(0);
    });

    test('renders an empty message with empty data', async ({ page }) => {
      const newData = [{
        data: [{
          name: 'Jan',
          value: 100
        }, {
          name: 'Feb',
          value: null
        }]
      }];
      const values = await page.evaluate(({ data }) => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const hidden = axisChart.emptyMessage?.getAttribute('hidden');
        axisChart.data = [];
        const hidden2 = axisChart.emptyMessage?.getAttribute('hidden');
        axisChart.data = data;
        const hidden3 = axisChart.emptyMessage?.getAttribute('hidden');
        axisChart.data = [];
        const hidden4 = axisChart.emptyMessage?.getAttribute('hidden');
        return [
          hidden,
          hidden2,
          hidden3,
          hidden4
        ];
      }, { data: newData });
      expect(values[0]).toEqual('');
      expect(values[1]).toBeFalsy();
      expect(values[2]).toEqual('');
      expect(values[3]).toBeFalsy();
    });

    test('changes empty message text when changing locale', async ({ page }) => {
      const value1 = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.data = [];
        return axisChart.emptyMessage.querySelector('ids-text').textContent;
      });

      await page.evaluate(async () => {
        const locale = window.IdsGlobal.locale!;
        await locale.setLocale('de-DE');
      });

      const value2 = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        return axisChart.emptyMessage.querySelector('ids-text').textContent;
      });

      expect(value1).toEqual('No data available');
      expect(value2).toEqual('Keine Daten verfügbar');
    });

    test('can get colors and color range', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        return [
          axisChart.colors.length,
          axisChart.color(2)
        ];
      });
      expect(values[0]).toEqual(20);
      expect(values[1]).toEqual('var(--ids-chart-color-accent-03)');
    });

    test('renders when changing format/locale', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const locale = window.IdsGlobal.locale!;
        await locale.setLocale('fr-FR');

        const results = [
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent
        ];
        await locale.setLocale('en-US');
        return results;
      });

      expect(values[0]).toEqual('8 k');
      expect(values[1]).toEqual('0');
      expect(values[2]).toEqual('8 k');
      expect(values[3]).toEqual('1 k');
    });

    test('renders decimal and groups when changing format/locale', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const locale = window.IdsGlobal.locale!;
        await locale.setLocale('fr-FR');
        axisChart.yAxisFormatter = {
          style: 'currency',
          currency: 'EUR'
        };

        const results = [
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent
        ];
        await locale.setLocale('en-US');
        return results;
      });

      expect(values[0]).toEqual('8 000,00 €');
      expect(values[1]).toEqual('0,00 €');
      expect(values[2]).toEqual('8 000,00 €');
      expect(values[3]).toEqual('1 000,00 €');
    });

    test('can set the y axis formatter to Intl.NumberFormat', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.yAxisFormatter = {
          maximumFractionDigits: 0
        };
        return [
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent
        ];
      });
      expect(values[0]).toEqual('8,000');
      expect(values[1]).toEqual('0');
      expect(values[2]).toEqual('8,000');
      expect(values[3]).toEqual('1,000');
    });

    test('can set the y axis formatter to a function', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.yAxisFormatter = (value: number) => `${value / 1000}$`;
        return [
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[0]?.textContent,
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[8]?.textContent,
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[0].textContent,
          axisChart.shadowRoot?.querySelectorAll('.y-labels text')[7]?.textContent
        ];
      });
      expect(values[0]).toEqual('8$');
      expect(values[1]).toEqual('0$');
      expect(values[2]).toEqual('8$');
      expect(values[3]).toEqual('1$');
    });

    test('can set the x axis formatter to a function', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.xAxisFormatter = (value: string) => value.substring(0, 1);
        const results = [
          axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent,
          axisChart.shadowRoot.querySelectorAll('.x-labels text')[1].textContent,
          axisChart.shadowRoot.querySelectorAll('.x-labels text')[2].textContent,
          axisChart.shadowRoot.querySelectorAll('.x-labels text')[3].textContent
        ];
        axisChart.xAxisFormatter = 'test';
        results.push(axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent);
        return results;
      });
      expect(values[0]).toEqual('J');
      expect(values[1]).toEqual('F');
      expect(values[2]).toEqual('M');
      expect(values[3]).toEqual('A');
      expect(values[4]).toEqual('');
    });

    test('can set the y axis formatter to empty', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.yAxisFormatter = null;
        return [
          axisChart.shadowRoot?.querySelectorAll('.x-labels text')[0].textContent,
          axisChart.shadowRoot?.querySelectorAll('.x-labels text')[1].textContent,
        ];
      });
      expect(values[0]).toEqual('Jan');
      expect(values[1]).toEqual('Feb');
    });

    test('can set the legend placement', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const results = [
          axisChart.legendPlacement,
        ];

        axisChart.legendPlacement = 'left';
        axisChart.redraw();
        results.push(axisChart.container?.parentNode.classList.contains('legend-left'));

        axisChart.legendPlacement = 'right';
        axisChart.redraw();
        results.push(axisChart.container?.parentNode.classList.contains('legend-right'));

        axisChart.legendPlacement = 'bottom';
        axisChart.redraw();
        results.push(axisChart.container?.parentNode.classList.contains('legend-bottom'));

        return results;
      });
      expect(values[0]).toEqual('bottom');
      expect(values[1]).toBeTruthy();
      expect(values[2]).toBeTruthy();
      expect(values[3]).toBeTruthy();
    });

    test('can set alignXLabels', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const results = [
          axisChart.alignXLabels,
        ];

        axisChart.alignXLabels = 'middle';
        axisChart.redraw();
        results.push(axisChart.container?.querySelector('.x-labels text')?.getAttribute('text-anchor'));

        return results;
      });
      expect(values[0]).toEqual('start');
      expect(values[1]).toEqual('middle');
    });

    test('can set animationSpeed', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const results = [
          axisChart.animationSpeed,
        ];

        axisChart.animationSpeed = 1.5;
        axisChart.redraw();
        results.push(axisChart.getAttribute('animation-speed'));

        return results;
      });
      expect(values[0]).toEqual(0.8);
      expect(values[1]).toEqual('1.5');
    });

    test('has no tooltip elements when only the base', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        return [
          axisChart.tooltipElements()
        ];
      });
      expect(values[0]).toEqual([]);
    });

    test('should get tooltip template', async ({ page }) => {
      const template = '<b>${label}</b> ${value}'; // eslint-disable-line
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        return [
          axisChart.tooltipTemplate()
        ];
      });
      expect(values[0]).toEqual(template);
    });

    test('has no tooltip elements when only the base 2', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        axisChart.data = [];
        return [
          axisChart.data
        ];
      });
      expect(values[0]).toEqual([]);
    });

    test('can set custom colors', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const data = [{
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
          color: 'var(--ids-color-blue-20)',
          name: 'Series 2'
        }];

        axisChart.data = data;
        axisChart.redraw();
        return [
          axisChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1'),
          axisChart.color(0),
          axisChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2'),
          axisChart.color(1)
        ];
      });
      expect(values[0]).toBeTruthy();
      expect(values[1]).toEqual('var(color-1)');
      expect(values[2]).toBeTruthy();
      expect(values[3]).toEqual('var(color-2)');
    });

    test('should adjust RTL', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const locale = window.IdsGlobal.locale!;
        await locale.setLanguage('ar');
        return [
          axisChart.localeAPI.isRTL()
        ];
      });

      expect(values[0]).toBe(true);
    });

    test('should set axis label', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const locale = window.IdsGlobal.locale!;

        const results = [
          axisChart.shadowRoot.querySelectorAll('.labels.axis-labels text').length
        ];

        axisChart.axisLabelBottom = 'Bottom axis label';
        axisChart.axisLabelEnd = 'End axis label';
        axisChart.axisLabelStart = 'Start axis label';
        axisChart.axisLabelTop = 'Top axis label';
        axisChart.axisLabelMargin = 20;
        results.push(axisChart.shadowRoot.querySelectorAll('.labels.axis-labels text').length);

        await locale.setLanguage('ar');

        axisChart.axisLabelBottom = '';
        axisChart.axisLabelEnd = '';
        axisChart.axisLabelStart = '';
        axisChart.axisLabelTop = '';
        axisChart.axisLabelMargin = 0;
        axisChart.redraw();
        results.push(axisChart.shadowRoot.querySelectorAll('.labels.axis-labels text').length);

        return results;
      });
      expect(values[0]).toEqual(0);
      expect(values[1]).toEqual(4);
      expect(values[2]).toEqual(0);
    });

    test('should set axis rotation', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const locale = window.IdsGlobal.locale!;

        axisChart.rotateNameLabels = '-60';
        const xLabels = axisChart.shadowRoot.querySelectorAll('.labels.x-labels text');
        const results = [
          xLabels.length,
          xLabels[0].getAttribute('transform'),
          xLabels[5].getAttribute('transform'),
          xLabels[0].getAttribute('transform-origin'),
          xLabels[0].getAttribute('transform-origin')
        ];

        await locale.setLanguage('ar');
        axisChart.alignXLabels = 'middle';
        axisChart.redraw();
        results.push(xLabels[0].getAttribute('transform'));
        results.push(xLabels[5].getAttribute('transform'));

        axisChart.rotateNameLabels = '';
        axisChart.redraw();
        results.push(xLabels[0].getAttribute('transform'));

        return results;
      });

      expect(values[0]).toEqual(6);
      expect(values[1]).toContain('rotate(-60');
      expect(values[2]).toContain('rotate(-60');
      expect(values[3]).toEqual(null);
      expect(values[4]).toEqual(null);
      expect(values[5]).toContain('rotate(-60');
      expect(values[6]).toContain('rotate(-60');
      expect(values[7]).toContain('rotate(-60');
    });

    test('should set horizontal', async ({ page }) => {
      const values = await page.evaluate(() => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const results = [
          axisChart.horizontal,
          axisChart.getAttribute('horizontal')
        ];

        axisChart.horizontal = true;
        results.push(axisChart.horizontal);
        results.push(axisChart.getAttribute('horizontal'));

        axisChart.horizontal = false;
        results.push(axisChart.horizontal);
        results.push(axisChart.getAttribute('horizontal'));

        return results;
      });

      expect(values[0]).toEqual(false);
      expect(values[1]).toEqual(null);
      expect(values[2]).toEqual(true);
      expect(values[3]).toEqual('');
      expect(values[4]).toEqual(false);
      expect(values[5]).toEqual(null);
    });

    test('should set horizontal axis rotation', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const axisChart = document.querySelector<any>('ids-axis-chart')!;
        const locale = window.IdsGlobal.locale!;
        axisChart.rotateNameLabels = '-60';
        axisChart.horizontal = true;

        const yLabels = axisChart.shadowRoot?.querySelectorAll('.labels.y-labels text') || [];

        const results = [
          yLabels.length,
          yLabels[0].getAttribute('transform'),
          yLabels[5].getAttribute('transform'),
          yLabels[0].getAttribute('transform-origin'),
        ];

        await locale.setLanguage('ar');
        axisChart.alignXLabels = 'middle';
        axisChart.redraw();
        results.push(yLabels[0].getAttribute('transform'));
        results.push(yLabels[5].getAttribute('transform'));

        axisChart.rotateNameLabels = 0;
        axisChart.redraw();
        results.push(yLabels[0].getAttribute('transform'));

        return results;
      });

      expect(values[0]).toEqual(6);
      expect(values[1]).toContain('rotate(-60');
      expect(values[2]).toContain('rotate(-60');
      // expect(values[3]).toEqual('4px 57px');
      expect(values[4]).toContain('rotate(-60');
      expect(values[5]).toContain('rotate(-60');
      expect(values[6]).toContain('rotate(-60');
    });
  });
});
