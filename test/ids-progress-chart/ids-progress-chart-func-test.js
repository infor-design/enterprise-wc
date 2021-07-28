/**
 * @jest-environment jsdom
 */
import IdsProgressChart from '../../src/ids-progress-chart/ids-progress-chart';

describe('IdsProgressChart Component', () => {
  let chart;

  beforeEach(async () => {
    const elem = new IdsProgressChart();
    elem.id = 'test-progress-chart';
    elem.text = 'Test Progress Chart';
    document.body.appendChild(elem);
    chart = document.querySelector('ids-progress-chart');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    chart = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    chart.remove();
    chart = new IdsProgressChart();
    document.body.appendChild(chart);

    expect(document.querySelectorAll('ids-progress-chart').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    const elem = new IdsProgressChart();
    //  elem.icon = 'add';
    elem.label = 'test';
    elem.valueLabel = '30 mins';
    elem.totalLabel = '60 mins';
    elem.value = 30;
    elem.total = 60;
    //  elem.state.type = 'icon';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets color correctly', () => {
    chart.color = 'success';
    expect(chart.color).toBe('success');

    chart.color = 'warning';
    expect(chart.color).toBe('warning');

    chart.color = '#FF0000';
    expect(chart.color).toBe('#FF0000');

    chart.color = 'amethyst-50';
    expect(chart.color).toBe('amethyst-50');
    // chart.shadowRoot.querySelector('.bar-value').style.backgroundColor = 'var(--ids-color-palette-amethyst-50)';
    // console.log(chart.shadowRoot.querySelector('.bar-value').style.backgroundColor);
    // expect(chart.shadowRoot.querySelector('.bar-value').style.backgroundColor).toEqual('var(--ids-color-palette-amethyst-50)');
  });
});
