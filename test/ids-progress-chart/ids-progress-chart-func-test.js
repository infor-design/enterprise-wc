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
    chart.color = '';
    expect(chart.color).toBeNull();

    chart.color = 'error';
    expect(chart.color).toBe('error');

    chart.color = 'success';
    expect(chart.color).toBe('success');

    chart.color = 'warning';
    expect(chart.color).toBe('warning');

    chart.color = '#606066';
    expect(chart.color).toBe('#606066');

    chart.color = 'amethyst-50';
    expect(chart.color).toBe('amethyst-50');

    // chart.shadowRoot.querySelector('.bar-value').style.backgroundColor = 'var(--ids-color-palette-amethyst-50)';
    // console.log(chart.shadowRoot.querySelector('.bar-value').style.backgroundColor);
    // expect(chart.shadowRoot.querySelector('.bar-value').style.backgroundColor).toEqual('var(--ids-color-palette-amethyst-50)');
  });

  it('sets labels correctly', () => {
    chart.label = 'test label';
    expect(chart.label).toBe('test label');

    chart.label = null;
    expect(chart.label).toBe('');
  });

  it('sets value correctly', () => {
    chart.value = '50';
    expect(chart.value).toBe('50');

    chart.value = '';
    expect(chart.value).toBeNull();

    // expect(chart.value = '-1').toBeFalsy();

    // chart.total = '200';
    // expect(chart.value = '150').toBe(75);
  });

  it('sets total correctly', () => {
    chart.total = '100';
    expect(chart.total).toBe('100');

    chart.total = '';
    expect(chart.total).toBeNull();

    chart.total = false;
    expect(chart.total).toBeNull();
  });

  it('sets value label correctly', () => {
    chart.valueLabel = '50 meters';
    expect(chart.valueLabel).toBe('50 meters');

    chart.valueLabel = '';
    expect(chart.valueLabel).toBe('');
  });

  it('sets total label correctly', () => {
    chart.totalLabel = '100 meters';
    expect(chart.totalLabel).toBe('100 meters');

    chart.totalLabel = '';
    expect(chart.totalLabel).toBe('');
  });

  it('sets size correctly', () => {
    chart.size = 'small';
    expect(chart.size).toBe('small');

    chart.size = '';
    expect(chart.size).toBeNull();
  });
});
