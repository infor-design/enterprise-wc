/**
 * @jest-environment jsdom
 */
import IdsAreaChart from '../../src/components/ids-area-chart/ids-area-chart';
import dataset from '../../demos/data/components.json';

describe('IdsAreaChart Component', () => {
  let areaChart;

  beforeEach(async () => {
    areaChart = new IdsAreaChart();
    document.body.appendChild(areaChart);
    areaChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    areaChart = new IdsAreaChart();
    document.body.appendChild(areaChart);
    areaChart.data = dataset;

    areaChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('supports setting markerSize', () => {
    expect(areaChart.markerSize).toEqual(1);
    expect(areaChart.shadowRoot.querySelector('circle').getAttribute('r')).toEqual('1');
    areaChart.markerSize = 8;
    expect(areaChart.markerSize).toEqual(8);
  });

  it('can set custom colors', async () => {
    areaChart.data = [{
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
    areaChart.rerender();

    expect(areaChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('circle')[0].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('.areas path')[0].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.color(0)).toEqual('color-1');

    expect(areaChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('circle')[1].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('.areas path')[1].classList.contains('color-2')).toBeTruthy();
    expect(areaChart.color(1)).toEqual('color-2');
  });
});
