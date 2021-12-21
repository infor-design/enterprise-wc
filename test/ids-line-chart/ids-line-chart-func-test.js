/**
 * @jest-environment jsdom
 */
import IdsLineChart from '../../src/components/ids-line-chart/ids-line-chart';
import dataset from '../../demos/data/products.json';

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
});
