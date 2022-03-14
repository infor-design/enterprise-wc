/**
 * @jest-environment jsdom
 */
import IdsLineChart from '../../src/components/ids-line-chart/ids-line-chart';
import dataset from '../../src/assets/data/components.json';

describe('IdsLineChart Component', () => {
  let lineChart;

  beforeEach(async () => {
    lineChart = new IdsLineChart();
    document.body.appendChild(lineChart);
    lineChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    lineChart = new IdsLineChart();
    document.body.appendChild(lineChart);
    lineChart.data = dataset;

    lineChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('supports setting markerSize', () => {
    expect(lineChart.markerSize).toEqual(5);
    expect(lineChart.shadowRoot.querySelector('circle').getAttribute('r')).toEqual('5');
    lineChart.markerSize = 8;
    expect(lineChart.markerSize).toEqual(8);
  });

  it('supports disabling animation', () => {
    expect(lineChart.shadowRoot.querySelectorAll('animate').length).toBe(21);
    lineChart.animated = false;
    lineChart.rerender();
    expect(lineChart.shadowRoot.querySelectorAll('animate').length).toEqual(0);
  });

  it('can set custom colors', async () => {
    lineChart.data = [{
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
    lineChart.rerender();

    expect(lineChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(lineChart.shadowRoot.querySelectorAll('circle')[0].classList.contains('color-1')).toBeTruthy();
    expect(lineChart.color(0)).toEqual('color-1');

    expect(lineChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(lineChart.shadowRoot.querySelectorAll('circle')[1].classList.contains('color-1')).toBeTruthy();
    expect(lineChart.shadowRoot.querySelector('circle').getAttribute('r')).toEqual('5');
    expect(lineChart.color(1)).toEqual('color-2');
  });
});
