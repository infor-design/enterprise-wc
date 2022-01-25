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
});
