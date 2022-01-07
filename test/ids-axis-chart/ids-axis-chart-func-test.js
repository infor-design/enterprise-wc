/**
 * @jest-environment jsdom
 */
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';
import dataset from '../../demos/data/products.json';

describe('IdsLineChart Component', () => {
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
    lineChart.data = dataset;

    lineChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });
});
