/**
 * @jest-environment jsdom
 */
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';
import badDataset from '../../demos/data/products.json';
import dataset from '../../demos/data/components.json';

describe('IdsAxisChart Component', () => {
  let axisChart;

  beforeEach(async () => {
    axisChart = new IdsAxisChart();
    document.body.appendChild(axisChart);
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

  it('supports setting width', () => {
    expect(axisChart.width).toEqual(800);
    axisChart.width = 400;
    expect(axisChart.width).toEqual(400);
    expect(axisChart.shadowRoot.querySelector('svg').getAttribute('width')).toEqual('400');
  });

  it('supports setting height', () => {
    expect(axisChart.height).toEqual(500);
    axisChart.height = 400;
    expect(axisChart.height).toEqual(400);
    expect(axisChart.shadowRoot.querySelector('svg').getAttribute('height')).toEqual('400');
  });

  it('supports setting margins', () => {
    expect(axisChart.margins.left).toEqual(16);
    expect(axisChart.margins.right).toEqual(16);
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
    expect(axisChart.textWidths.left).toEqual(68);
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
    expect(axisChart.data).toEqual([]);
  });

  it('supports setting yAxisMin', () => {
    expect(axisChart.yAxisMin).toEqual(0);
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8000');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[8].textContent).toEqual('0');
    axisChart.yAxisMin = 1000;
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[0].textContent).toEqual('8000');
    expect(axisChart.shadowRoot.querySelectorAll('.y-labels text')[7].textContent).toEqual('1000');
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
});
