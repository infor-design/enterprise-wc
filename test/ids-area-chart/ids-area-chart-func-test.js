/**
 * @jest-environment jsdom
 */
import IdsAreaChart from '../../src/components/ids-area-chart/ids-area-chart';
import dataset from '../../demos/data/components.json';

describe('IdsAreaChart Component', () => {
  let lineChart;

  beforeEach(async () => {
    lineChart = new IdsAreaChart();
    document.body.appendChild(lineChart);
    lineChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    lineChart = new IdsAreaChart();
    document.body.appendChild(lineChart);
    lineChart.data = dataset;

    lineChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });
});
