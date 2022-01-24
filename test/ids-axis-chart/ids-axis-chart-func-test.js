/**
 * @jest-environment jsdom
 */
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';
import badDataset from '../../demos/data/products.json';
import dataset from '../../demos/data/components.json';

describe('IdsAxisChart Component', () => {
  let lineChart;

  beforeEach(async () => {
    lineChart = new IdsAxisChart();
    document.body.appendChild(lineChart);
    lineChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    lineChart = new IdsAxisChart();
    document.body.appendChild(lineChart);
    lineChart.data = badDataset;
    lineChart.data = dataset;

    lineChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders zero when missing value', async () => {
    lineChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: null
      }]
    }];
    expect(lineChart.markerData.points[1].value).toEqual(0);
  });

  it('supports setting title', () => {
    expect(lineChart.title).toEqual('');
    lineChart.title = 'Test Title';
    expect(lineChart.title).toEqual('Test Title');
    expect(lineChart.shadowRoot.querySelector('title').textContent).toEqual('Test Title');
  });

  it('supports setting width', () => {
    expect(lineChart.width).toEqual(800);
    lineChart.width = 400;
    expect(lineChart.width).toEqual(400);
    expect(lineChart.shadowRoot.querySelector('svg').getAttribute('width')).toEqual('400');
  });

  it('supports setting height', () => {
    expect(lineChart.height).toEqual(500);
    lineChart.height = 400;
    expect(lineChart.height).toEqual(400);
    expect(lineChart.shadowRoot.querySelector('svg').getAttribute('height')).toEqual('400');
  });

  it('supports setting margins', () => {
    expect(lineChart.margins.left).toEqual(16);
    expect(lineChart.margins.right).toEqual(16);
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
    lineChart.margins = newMargins;
    expect(lineChart.margins).toEqual(newMargins);
    expect(lineChart.state.margins).toEqual(newMargins);
  });

  it('supports setting textWidths', () => {
    expect(lineChart.textWidths.left).toEqual(68);
    expect(lineChart.textWidths.right).toEqual(0);
    const newTextWidths = {
      left: 40, right: 40, top: 40, bottom: 40
    };
    lineChart.textWidths = newTextWidths;
    expect(lineChart.textWidths).toEqual(newTextWidths);
    expect(lineChart.state.textWidths).toEqual(newTextWidths);
  });

  it('supports setting dataset to null', () => {
    expect(lineChart.shadowRoot.querySelector('.grid')).toBeTruthy();
    lineChart.data = null;
    expect(lineChart.data).toEqual([]);
  });

  it('supports setting yAxisMin', () => {
    expect(lineChart.yAxisMin).toEqual(0);
    expect(lineChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8000');
    expect(lineChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    lineChart.yAxisMin = 1000;
    expect(lineChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8000');
    expect(lineChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1000');
  });

  it('supports setting showVerticalGridLines', () => {
    expect(lineChart.showVerticalGridLines).toEqual(false);
    expect(lineChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeTruthy();
    lineChart.showVerticalGridLines = true;
    expect(lineChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeFalsy();
    lineChart.showVerticalGridLines = false;
    expect(lineChart.shadowRoot.querySelector('.grid.vertical-lines.hidden')).toBeTruthy();
  });

  it('supports setting showHorizontalGridLines', () => {
    expect(lineChart.showHorizontalGridLines).toEqual(true);
    expect(lineChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeFalsy();
    lineChart.showHorizontalGridLines = false;
    expect(lineChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeTruthy();
    lineChart.showHorizontalGridLines = true;
    expect(lineChart.shadowRoot.querySelector('.grid.horizontal-lines.hidden')).toBeFalsy();
  });
});
