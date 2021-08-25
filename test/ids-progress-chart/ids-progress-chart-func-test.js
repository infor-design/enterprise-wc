/**
 * @jest-environment jsdom
 */
import IdsProgressChart from '../../src/components/ids-progress-chart/ids-progress-chart';

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
    elem.label = 'test';
    elem.progressLabel = '30 mins';
    elem.totalLabel = '60 mins';
    elem.progress = '30';
    elem.total = '60';
    elem.size = 'small';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets icon correctly', () => {
    const icon = chart.container.querySelector('.icon');

    chart.icon = 'alert';
    expect(chart.icon).toBe('alert');
    expect(icon.getAttribute('icon')).toBe('alert');
    expect(icon.style.display).toBe('');

    chart.size = 'small';
    expect(icon.getAttribute('size')).toBe('small');

    chart.icon = '';
    expect(chart.icon).toBe('');
    expect(icon.getAttribute('icon')).toBe('');
    expect(icon.style.display).toBe('none');
  });

  it('sets color correctly', () => {
    chart.color = '#25af65';
    expect(chart.color).toBe('#25af65');

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
  });

  it('sets labels correctly', () => {
    chart.label = 'test label';
    expect(chart.label).toBe('test label');
    expect(chart.container.querySelector('.label-main').innerHTML).toBe('test label');

    chart.label = null;
    expect(chart.label).toBe('');
  });

  it('sets progress correctly', () => {
    chart.progress = '50';
    expect(chart.progress).toBe('50');

    // invalid inputs set attribute to default (0)
    chart.progress = '';
    expect(chart.progress).toBe('0');

    chart.progress = '-1';
    expect(chart.progress).toBe('0');
  });

  it('sets total correctly', () => {
    chart.total = '70';
    expect(chart.total).toBe('70');

    // invalid inputs set attribute to default (100)
    chart.total = '';
    expect(chart.total).toBe('100');

    chart.total = false;
    expect(chart.total).toBe('100');
  });

  it('calculates percentage correctly', () => {
    chart.progress = '0.7';
    chart.total = '1';
    expect(chart.percentage).toBe(70);

    // when the progress value is more than the total, it should max out at 100, never beyond
    chart.progress = '5';
    chart.total = '3';
    expect(chart.percentage).toBe(100);
  });

  it('sets progress label correctly', () => {
    chart.progressLabel = '50 meters';
    expect(chart.progressLabel).toBe('50 meters');
    expect(chart.container.querySelector('.label-progress').innerHTML).toBe('50 meters');

    chart.progressLabel = '2 weeks';
    expect(chart.progressLabel).toBe('2 weeks');
    expect(chart.container.querySelector('.label-progress').innerHTML).toBe('2 weeks');

    chart.progressLabel = '';
    expect(chart.progressLabel).toBe('');
    expect(chart.container.querySelector('.label-progress').innerHTML).toBe('');
  });

  it('sets total label correctly', () => {
    chart.totalLabel = '100 meters';
    expect(chart.totalLabel).toBe('100 meters');
    expect(chart.container.querySelector('.label-total').innerHTML).toBe('100 meters');

    chart.totalLabel = '12 months';
    expect(chart.totalLabel).toBe('12 months');
    expect(chart.container.querySelector('.label-total').innerHTML).toBe('12 months');

    chart.totalLabel = '';
    expect(chart.totalLabel).toBe('');
    expect(chart.container.querySelector('.label-total').innerHTML).toBe('');
  });

  it('sets size correctly', () => {
    chart.size = 'small';
    expect(chart.size).toBe('small');

    // invalid inputs set attribute to default (normal)
    chart.size = '';
    expect(chart.size).toBe('normal');

    chart.size = '25';
    expect(chart.size).toBe('normal');
  });
});
