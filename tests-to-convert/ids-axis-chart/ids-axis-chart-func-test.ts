/**
 * @jest-environment jsdom
 */
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';
import IdsContainer from '../../src/components/ids-container/ids-container';
import '../../src/components/ids-empty-message/ids-empty-message';
import '../../src/components/ids-text/ids-text';
import '../helpers/canvas-mock';
import '../helpers/resize-observer-mock';
import dataset from '../../src/assets/data/components.json';

import arMessages from '../../src/components/ids-locale/data/ar-messages.json';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';
import frFRMessages from '../../src/components/ids-locale/data/fr-FR-messages.json';
import deDELocale from '../../src/components/ids-locale/data/de-DE.json';
import frFRLocale from '../../src/components/ids-locale/data/fr-FR.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsAxisChart Component', () => {
  let axisChart: any;
  let container: any;
  let locale: any;

  beforeEach(async () => {
    container = new IdsContainer();
    axisChart = new IdsAxisChart();
    locale = IdsGlobal.getLocale();

    container.appendChild(axisChart);
    locale.loadedLanguages.set('ar', arMessages);
    locale.loadedLanguages.set('de', deMessages);
    locale.loadedLanguages.set('fr-FR', frFRMessages);
    locale.loadedLocales.set('fr-FR', frFRLocale);
    locale.loadedLocales.set('de-DE', deDELocale);
    IdsGlobal.onThemeLoaded().resolve();

    await IdsGlobal.onThemeLoaded().promise;

    axisChart.data = dataset;
    document.body.appendChild(container);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('supports setting title', () => {
    expect(axisChart.title).toEqual('');
    axisChart.title = 'Test Title';
    expect(axisChart.title).toEqual('Test Title');
    expect(axisChart.shadowRoot.querySelector('title').textContent).toEqual('Test Title');
  });

  test('supports setting height inline', () => {
    document.body.innerHTML = '';
    axisChart = new IdsAxisChart();
    axisChart.setAttribute('width', 500);
    axisChart.setAttribute('height', 500);
    document.body.appendChild(axisChart);
    axisChart.data = dataset;

    expect(axisChart.svg.getAttribute('height')).toEqual('500');
    expect(axisChart.svg.getAttribute('width')).toEqual('500');
  });

  test('supports setting animated', () => {
    expect(axisChart.animated).toEqual(true);
    axisChart.animated = 'false';
    expect(axisChart.animated).toEqual(false);
    expect(axisChart.getAttribute('animated')).toEqual('false');
  });

  test('supports setting width', () => {
    expect(axisChart.width).toEqual(700);
    axisChart.width = 400;
    expect(axisChart.width).toEqual(400);
    expect(axisChart.shadowRoot.querySelector('svg').getAttribute('width')).toEqual('400');
  });

  test('supports setting width to inherit', () => {
    axisChart.width = 'inherit';
    expect(axisChart.getAttribute('width')).toEqual('inherit');
  });

  test('skips resize when not initialized', () => {
    axisChart.width = 500;
    axisChart.initialized = false;
    axisChart.resize(300, 300);
    expect(axisChart.svg.getAttribute('width')).toEqual('500');
  });

  test('supports setting height to inherit', () => {
    axisChart.height = 'inherit';
    expect(axisChart.getAttribute('height')).toEqual('inherit');
  });

  test('supports setting height even when hidden', async () => {
    container.hidden = true;
    axisChart.height = 300;
    expect(axisChart.height).toEqual(300);
    container.hidden = false;
    expect(axisChart.svg.getAttribute('height')).toEqual('300');
  });

  test('supports setting margins', () => {
    expect(axisChart.margins.left).toEqual(axisChart.margins.left);
    expect(axisChart.margins.right).toEqual(4);
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
    axisChart.margins = newMargins;
    expect(axisChart.margins).toEqual(newMargins);
    expect(axisChart.state.margins).toEqual(newMargins);
  });

  test('supports setting textWidths', () => {
    expect(axisChart.textWidths.left).toEqual(4);
    expect(axisChart.textWidths.right).toEqual(0);
    const newTextWidths = {
      left: 40, right: 40, top: 40, bottom: 40
    };
    axisChart.textWidths = newTextWidths;
    expect(axisChart.textWidths).toEqual(newTextWidths);
    expect(axisChart.state.textWidths).toEqual(newTextWidths);
  });

  test('supports setting dataset to null', () => {
    expect(axisChart.shadowRoot.querySelector('.grid')).toBeTruthy();
    axisChart.data = null;
    expect(axisChart.data).toEqual([]);
  });

  test('supports setting yAxisMin', () => {
    expect(axisChart.yAxisMin).toEqual(0);
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8K');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    axisChart.yAxisMin = 1000;
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8K');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1K');
  });

  test('supports setting showVerticalGridLines', () => {
    expect(axisChart.showVerticalGridLines).toEqual(false);
    expect(axisChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeTruthy();
    axisChart.showVerticalGridLines = true;
    expect(axisChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeFalsy();
    axisChart.showVerticalGridLines = false;
    expect(axisChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeTruthy();
  });

  test('supports setting showHorizontalGridLines', () => {
    expect(axisChart.showHorizontalGridLines).toEqual(true);
    expect(axisChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeFalsy();
    axisChart.showHorizontalGridLines = false;
    expect(axisChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeTruthy();
    axisChart.showHorizontalGridLines = true;
    expect(axisChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeFalsy();
  });

  test('renders zero when missing value', async () => {
    axisChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: null
      }]
    }];
    expect(axisChart.markerData.points[0]['1'].value).toEqual(0);
  });

  test('renders an empty message with empty data', async () => {
    expect(axisChart.emptyMessage.getAttribute('hidden')).toEqual('');
    axisChart.data = [];
    expect(axisChart.emptyMessage.getAttribute('hidden')).toBeFalsy();
    axisChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: null
      }]
    }];
    expect(axisChart.emptyMessage.getAttribute('hidden')).toEqual('');
    axisChart.data = [];
    expect(axisChart.emptyMessage.getAttribute('hidden')).toBeFalsy();
  });

  test('changes empty message text when changing locale', async () => {
    axisChart.data = [];
    expect(axisChart.emptyMessage.querySelector('ids-text').textContent).toEqual('No data available');
    locale.setLocale('de-DE');
    expect(axisChart.emptyMessage.querySelector('ids-text').textContent).toEqual('Keine Daten verfügbar');
  });

  test('can get colors and color range', async () => {
    expect(axisChart.colors.length).toEqual(20);
    expect(axisChart.color(2)).toEqual('var(--ids-chart-color-accent-03)');
  });

  test('renders when changing format/locale', async () => {
    locale.setLocale('fr-FR');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 k');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 k');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1 k');
    locale.setLocale('en-US');
  });

  test('renders decimal and groups when changing format/locale', async () => {
    locale.setLocale('fr-FR');
    axisChart.yAxisFormatter = {
      style: 'currency',
      currency: 'EUR'
    };
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 000,00 €');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0,00 €');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 000,00 €');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1 000,00 €');
    locale.setLocale('en-US');
  });

  test('can set the y axis formatter to Intl.NumberFormat', async () => {
    locale.setLocale('en-US');
    axisChart.yAxisFormatter = {
      maximumFractionDigits: 0
    };
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8,000');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8,000');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1,000');
  });

  test('can set the y axis formatter to a function', async () => {
    axisChart.yAxisFormatter = (value: number) => `${value / 1000}$`;
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8$');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0$');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8$');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1$');
  });

  test('can set the x axis formatter to a function', async () => {
    axisChart.xAxisFormatter = (value: string) => value.substring(0, 1);
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent).toEqual('J');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[1].textContent).toEqual('F');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[2].textContent).toEqual('M');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[3].textContent).toEqual('A');
    axisChart.xAxisFormatter = 'test';
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent).toEqual('');
  });

  test('can set the y axis formatter to empty', async () => {
    axisChart.yAxisFormatter = null;
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent).toEqual('Jan');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[1].textContent).toEqual('Feb');
  });

  test('can set the legend placement', async () => {
    expect(axisChart.legendPlacement).toEqual('bottom');
    axisChart.legendPlacement = 'left';
    axisChart.redraw();
    expect(axisChart.container.parentNode.classList.contains('legend-left')).toBeTruthy();
    axisChart.legendPlacement = 'right';
    axisChart.redraw();
    expect(axisChart.container.parentNode.classList.contains('legend-right')).toBeTruthy();
    axisChart.legendPlacement = 'bottom';
    axisChart.redraw();
    expect(axisChart.container.parentNode.classList.contains('legend-bottom')).toBeTruthy();
  });

  test('can set alignXLabels', () => {
    expect(axisChart.alignXLabels).toEqual('start');
    axisChart.alignXLabels = 'middle';
    axisChart.redraw();
    expect(axisChart.container.querySelector('.x-labels text').getAttribute('text-anchor')).toEqual('middle');
  });

  test('can set animationSpeed', () => {
    expect(axisChart.animationSpeed).toEqual(0.8);
    axisChart.animationSpeed = 1.5;
    axisChart.redraw();
    expect(axisChart.getAttribute('animation-speed')).toEqual('1.5');
  });

  test('has no tooltip elements when only the base', () => {
    expect(axisChart.tooltipElements()).toEqual([]);
  });

  test('should get tooltip template', () => {
    const tmpl = '<b>${label}</b> ${value}'; // eslint-disable-line
    expect(axisChart.tooltipTemplate()).toEqual(tmpl);
  });

  test('has no tooltip elements when only the base', () => {
    const axisChart2 = new IdsAxisChart();
    expect(axisChart2.data).toEqual([]);
  });

  test('can set custom colors', async () => {
    axisChart.data = [{
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
    axisChart.redraw();

    expect(axisChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(axisChart.color(0)).toEqual('var(color-1)');

    expect(axisChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(axisChart.color(1)).toEqual('var(color-2)');
  });

  test('should adjust RTL', async () => {
    await locale.setLanguage('ar');

    expect(axisChart.localeAPI.isRTL()).toBe(true);
  });

  test('should set axis label', async () => {
    expect(axisChart.shadowRoot.querySelectorAll('.labels.axis-labels text').length).toEqual(0);
    axisChart.axisLabelBottom = 'Bottom axis label';
    axisChart.axisLabelEnd = 'End axis label';
    axisChart.axisLabelStart = 'Start axis label';
    axisChart.axisLabelTop = 'Top axis label';
    axisChart.axisLabelMargin = 20;
    expect(axisChart.shadowRoot.querySelectorAll('.labels.axis-labels text').length).toEqual(4);
    await locale.setLanguage('ar');
    expect(axisChart.localeAPI.isRTL()).toBe(true);

    axisChart.axisLabelBottom = '';
    axisChart.axisLabelEnd = '';
    axisChart.axisLabelStart = '';
    axisChart.axisLabelTop = '';
    axisChart.axisLabelMargin = 0;
    axisChart.redraw();
    expect(axisChart.shadowRoot.querySelectorAll('.labels.axis-labels text').length).toEqual(0);
  });

  test('should set axis rotation', async () => {
    axisChart.rotateNameLabels = '-60';

    const xLabels = axisChart.shadowRoot.querySelectorAll('.labels.x-labels text');
    expect(xLabels.length).toEqual(6);
    expect(xLabels[0].getAttribute('transform')).toContain('rotate(-60');
    expect(xLabels[5].getAttribute('transform')).toContain('rotate(-60');

    expect(xLabels[0].getAttribute('transform-origin')).toEqual(null);
    expect(xLabels[0].getAttribute('transform-origin')).toEqual(null);

    await locale.setLanguage('ar');
    axisChart.alignXLabels = 'middle';
    axisChart.redraw();

    expect(xLabels[0].getAttribute('transform')).toContain('rotate(-60');
    expect(xLabels[5].getAttribute('transform')).toContain('rotate(-60');

    axisChart.rotateNameLabels = '';
    axisChart.redraw();
    expect(xLabels[0].getAttribute('transform')).toContain('rotate(-60');
  });

  test('should set horizontal', () => {
    expect(axisChart.horizontal).toEqual(false);
    expect(axisChart.getAttribute('horizontal')).toEqual(null);
    axisChart.horizontal = true;
    expect(axisChart.horizontal).toEqual(true);
    expect(axisChart.getAttribute('horizontal')).toEqual('');
    axisChart.horizontal = false;
    expect(axisChart.horizontal).toEqual(false);
    expect(axisChart.getAttribute('horizontal')).toEqual(null);
  });

  test('should set horizontal axis rotation', async () => {
    axisChart.rotateNameLabels = '-60';
    axisChart.horizontal = true;

    const yLabels = axisChart.shadowRoot.querySelectorAll('.labels.y-labels text');
    expect(yLabels.length).toEqual(6);
    expect(yLabels[0].getAttribute('transform')).toContain('rotate(-60');
    expect(yLabels[5].getAttribute('transform')).toContain('rotate(-60');

    expect(yLabels[0].getAttribute('transform-origin')).toEqual('4px 57px');
    expect(yLabels[0].getAttribute('transform-origin')).toEqual('4px 57px');

    await locale.setLanguage('ar');
    axisChart.alignXLabels = 'middle';
    axisChart.redraw();

    expect(yLabels[0].getAttribute('transform')).toContain('rotate(-60');
    expect(yLabels[5].getAttribute('transform')).toContain('rotate(-60');

    axisChart.rotateNameLabels = '';
    axisChart.redraw();
    expect(yLabels[0].getAttribute('transform')).toContain('rotate(-60');
  });
});
