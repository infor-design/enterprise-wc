/**
 * @jest-environment jsdom
 */
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsEmptyMessage from '../../src/components/ids-empty-message/ids-empty-message';
import IdsText from '../../src/components/ids-text/ids-text';
import ResizeObserver from '../helpers/resize-observer-mock';
import badDataset from '../../demos/data/products.json';
import dataset from '../../demos/data/components.json';
import processAnimFrame from '../helpers/process-anim-frame';

describe('IdsAxisChart Component', () => {
  let axisChart;
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    axisChart = new IdsAxisChart();

    container.appendChild(axisChart);
    document.body.appendChild(container);
    axisChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    axisChart = new IdsAxisChart();
    document.body.appendChild(axisChart);
    axisChart.data = badDataset;
    axisChart.data = dataset;

    axisChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('supports setting title', () => {
    expect(axisChart.title).toEqual('');
    axisChart.title = 'Test Title';
    expect(axisChart.title).toEqual('Test Title');
    expect(axisChart.shadowRoot.querySelector('title').textContent).toEqual('Test Title');
  });

  it('supports setting animated', () => {
    expect(axisChart.shadowRoot.querySelector('animated')).toBeTruthy();
    expect(axisChart.animated).toEqual(true);
    axisChart.animated = 'false';
    expect(axisChart.animated).toEqual(false);
    expect(axisChart.shadowRoot.querySelector('animated')).toBeFalsy();
  });

  it('supports setting width', () => {
    expect(axisChart.width).toEqual(800);
    axisChart.width = 400;
    expect(axisChart.width).toEqual(400);
    expect(axisChart.shadowRoot.querySelector('svg').getAttribute('width')).toEqual('400');
  });

  it('supports setting width to parent', () => {
    axisChart.parentNode.style.width = '300px';
    axisChart.width = 'inherit';
    axisChart.rerender();
    expect(axisChart.width).toEqual(800);
    expect(axisChart.shadowRoot.querySelector('svg').getAttribute('width')).toEqual('800');
  });

  it('supports setting height to parent', () => {
    axisChart.parentNode.style.height = '300px';
    axisChart.height = 'inherit';
    axisChart.rerender();
    expect(axisChart.height).toEqual(400);
    expect(axisChart.shadowRoot.querySelector('svg').getAttribute('height')).toEqual('400');
  });

  it('supports setting margins', () => {
    expect(axisChart.margins.left).toEqual(16);
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

  it('supports setting textWidths', () => {
    expect(axisChart.textWidths.left).toEqual(4);
    expect(axisChart.textWidths.right).toEqual(0);
    const newTextWidths = {
      left: 40, right: 40, top: 40, bottom: 40
    };
    axisChart.textWidths = newTextWidths;
    expect(axisChart.textWidths).toEqual(newTextWidths);
    expect(axisChart.state.textWidths).toEqual(newTextWidths);
  });

  it('supports setting dataset to null', () => {
    expect(axisChart.shadowRoot.querySelector('.grid')).toBeTruthy();
    axisChart.data = null;
    expect(axisChart.data).toBeFalsy();
  });

  it('supports setting yAxisMin', () => {
    expect(axisChart.yAxisMin).toEqual(0);
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8K');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    axisChart.yAxisMin = 1000;
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8K');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1K');
  });

  it('supports setting showVerticalGridLines', () => {
    expect(axisChart.showVerticalGridLines).toEqual(false);
    expect(axisChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeTruthy();
    axisChart.showVerticalGridLines = true;
    expect(axisChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeFalsy();
    axisChart.showVerticalGridLines = false;
    expect(axisChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeTruthy();
  });

  it('supports setting showHorizontalGridLines', () => {
    expect(axisChart.showHorizontalGridLines).toEqual(true);
    expect(axisChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeFalsy();
    axisChart.showHorizontalGridLines = false;
    expect(axisChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeTruthy();
    axisChart.showHorizontalGridLines = true;
    expect(axisChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeFalsy();
  });

  it('renders zero when missing value', async () => {
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

  it('renders an empty message with empty data', async () => {
    expect(axisChart.emptyMessage.getAttribute('hidden')).toBeTruthy();
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
    expect(axisChart.emptyMessage.getAttribute('hidden')).toBeTruthy();
    axisChart.data = [];
    expect(axisChart.emptyMessage.getAttribute('hidden')).toBeFalsy();
  });

  it('changes empty message text when changing locale', async () => {
    axisChart.data = [];
    expect(axisChart.emptyMessage.querySelector('ids-text').textContent).toEqual('No Data Available');
    container.locale = 'de-DE';
    await processAnimFrame();
    expect(axisChart.emptyMessage.querySelector('ids-text').textContent).toEqual('Keine Daten verfügbar');
  });

  it('can get colors and color range', async () => {
    expect(axisChart.colors.length).toEqual(20);
    expect(axisChart.color(2)).toEqual('--ids-color-palette-amethyst-60');
  });

  it('renders when changing format/locale', async () => {
    container.locale = 'fr-FR';
    await processAnimFrame();
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 k');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 k');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1 k');
    container.locale = 'en-US';
  });

  it('renders decimal and groups when changing format/locale', async () => {
    container.locale = 'fr-FR';
    axisChart.yAxisFormatter = {
      style: 'currency',
      currency: 'EUR'
    };
    await processAnimFrame();
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 000,00 €');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0,00 €');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8 000,00 €');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1 000,00 €');
    container.locale = 'en-US';
  });

  it('can set the y axis formatter to Intl.NumberFormat', async () => {
    container.locale = 'en-US';
    axisChart.yAxisFormatter = {
      maximumFractionDigits: 0
    };
    await processAnimFrame();
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8,000');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8,000');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1,000');
  });

  it('can set the y axis formatter to a function', async () => {
    axisChart.yAxisFormatter = (value) => `${value / 1000 }$`;
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8$');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0$');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8$');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1$');
  });

  it('can set the x axis formatter to a function', async () => {
    axisChart.xAxisFormatter = (value) => value.substring(0, 1);
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent).toEqual('J');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[1].textContent).toEqual('F');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[2].textContent).toEqual('M');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[3].textContent).toEqual('A');
  });

  it('can set the y axis formatter to empty', async () => {
    axisChart.yAxisFormatter = null;
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[0].textContent).toEqual('Jan');
    expect(axisChart.shadowRoot.querySelectorAll('.x-labels text')[1].textContent).toEqual('Feb');
  });

  it('can set the legend placement', async () => {
    expect(axisChart.legendPlacement).toEqual('bottom');
    axisChart.legendPlacement = 'left';
    axisChart.rerender();
    expect(axisChart.container.parentNode.classList.contains('legend-left')).toBeTruthy();
    axisChart.legendPlacement = 'right';
    axisChart.rerender();
    expect(axisChart.container.parentNode.classList.contains('legend-right')).toBeTruthy();
    axisChart.legendPlacement = 'bottom';
    axisChart.rerender();
    expect(axisChart.container.parentNode.classList.contains('legend-bottom')).toBeTruthy();
  });

  it('can set custom colors', async () => {
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
      color: 'var(--ids-color-palette-azure-20)',
      name: 'Series 2'
    }];
    axisChart.rerender();

    expect(axisChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(axisChart.color(0)).toEqual('color-1');

    expect(axisChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(axisChart.color(1)).toEqual('color-2');
  });
});
