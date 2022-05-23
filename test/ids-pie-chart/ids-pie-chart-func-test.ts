/**
 * @jest-environment jsdom
 */
import IdsPieChart from '../../src/components/ids-pie-chart/ids-pie-chart';
import dataset from '../../src/assets/data/items-single.json';
import IdsContainer from '../../src/components/ids-container/ids-container';
import '../helpers/resize-observer-mock';

describe('IdsPieChart Component', () => {
  let pieChart: any;
  let container: any;

  beforeEach(async () => {
    container = new IdsContainer();
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(container);
    container.appendChild(pieChart);
    pieChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);
    pieChart.data = dataset;

    pieChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set custom colors', () => {
    pieChart.data = [{
      data: [{
        name: 'Item A',
        value: 100
      }, {
        name: 'Item B',
        value: 200,
        color: '#800000',
      }, {
        name: 'Item C',
        value: 200,
        color: 'var(--ids-color-palette-azure-20)',
      }]
    }];
    pieChart.rerender();

    // Note: This doesnt test this really well since jest doesnt support stylesheets - see also the percy test
    expect(pieChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(pieChart.color(0)).toEqual('var(--ids-color-palette-azure-80)');

    expect(pieChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(pieChart.color(1)).toEqual('var(color-2)');
  });

  it('can set accessible patterns', () => {
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);

    // Mock stylesheets
    pieChart.shadowRoot.styleSheets = [{
      insertRule: jest.fn(),
      deleteRule: jest.fn(),
      cssRules: [{ selectorText: ':host' }]
    }];

    pieChart.data = [{
      data: [{
        name: 'Jan',
        value: 100,
        pattern: 'circles',
        patternColor: '#DA1217'
      }, {
        name: 'Feb',
        value: 200,
        pattern: 'exes'
      }]
    }];

    expect(pieChart.container.parentNode.querySelectorAll('.swatch svg')[0].querySelector('rect').getAttribute('fill')).toEqual('url(#circles)');
    expect(pieChart.shadowRoot.querySelectorAll('.slice')[0].getAttribute('stroke')).toEqual('url(#circles)');

    expect(pieChart.container.parentNode.querySelectorAll('.swatch svg')[1].querySelector('rect').getAttribute('fill')).toEqual('url(#exes)');
    expect(pieChart.shadowRoot.querySelectorAll('.slice')[1].getAttribute('stroke')).toEqual('url(#exes)');
  });

  it('supports donut chart', () => {
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);
    pieChart.donut = true;
    pieChart.donutText = 'Test Text';
    pieChart.data = dataset;

    expect(pieChart.container.querySelectorAll('[index="0"]').length).toBe(1);
    expect(pieChart.container.querySelectorAll('[index="1"]').length).toBe(1);
    expect(pieChart.container.querySelectorAll('[index="2"]').length).toBe(1);
    expect(pieChart.container.querySelector('.donut-text').innerHTML).toBe('Test Text');
  });

  it('shows a tooltip on hover', (done) => {
    pieChart.animated = false;
    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toEqual('Item A 11%');
      done();
    }, 1);
  });

  it('can suppress tooltips', (done) => {
    pieChart.suppressTooltips = true;
    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(false);
      done();
    }, 1);
  });

  it('shows a custom tooltip on hover', (done) => {
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);

    pieChart.data = [{
      data: [{
        name: 'Jan',
        value: 100,
        tooltip: 'Test Tooltip'
      }, {
        name: 'Feb',
        value: 200,
        tooltip: 'Test Tooltip'
      }]
    }];

    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toEqual('Test Tooltip');
      done();
    }, 1);
  });

  it('defaults missing value to zero in a tooltip', (done) => {
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);

    pieChart.data = [{
      data: [{
        name: 'Jan',
        value: null
      }, {
        name: 'Feb',
        value: null
      }]
    }];

    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toEqual('Jan 0');
      done();
    }, 1);
  });

  it('renders an empty message with empty data', async () => {
    expect(pieChart.emptyMessage.getAttribute('hidden')).toEqual('');
    pieChart.data = [];
    expect(pieChart.emptyMessage.getAttribute('hidden')).toBeFalsy();
    pieChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: null
      }]
    }];
    expect(pieChart.emptyMessage.getAttribute('hidden')).toEqual('');
    pieChart.data = [];
    expect(pieChart.emptyMessage.getAttribute('hidden')).toBeFalsy();
  });

  it('can translate empty text', async () => {
    pieChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: null
      }]
    }];
    pieChart.data = [];
    expect(pieChart.emptyMessage.querySelector('ids-text').textContent).toBe('No Data Available');
    await container.setLocale('de-DE');
    expect(pieChart.emptyMessage.querySelector('ids-text').textContent).toBe('Keine Daten verfügbar');
  });

  it('can set a static height', async () => {
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('beforeend', `<ids-pie-chart width="500" height="400" animated="true"></ids-pie-chart>`);
    pieChart = document.querySelector('ids-pie-chart');
    expect(pieChart.height).toBe(400);
    expect(pieChart.width).toBe(500);
  });

  it('can set a legend formatter', async () => {
    pieChart.legendFormatter = (slice: any, datax: any) => `${slice.name}: ${datax.rounded}`;
    expect(pieChart.shadowRoot.querySelector('.chart-legend a').textContent).toContain('Item A: 11');
  });

  it('can set animation', async () => {
    expect(pieChart.animated).toBe(false);
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('beforeend', `<ids-pie-chart width="500" height="400" animated="true"></ids-pie-chart>`);
    pieChart.animated = true;

    expect(pieChart.chartTemplate()).toContain('stroke-dashoffset');
    expect(pieChart.getAttribute('animated')).toBe('true');
  });

  it('defaults animation to true ', async () => {
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('beforeend', `<ids-pie-chart></ids-pie-chart>`);
    pieChart = document.querySelector('ids-pie-chart');
    expect(pieChart.animated).toBe(true);
  });

  it('can set data to empty', async () => {
    pieChart.data = null;
    expect(pieChart.data.length).toBe(0);
  });

  it('can set title', async () => {
    expect(pieChart.title).toBe('');
    expect(pieChart.shadowRoot.querySelectorAll('title')[0].textContent).toBe('');
    expect(pieChart.shadowRoot.querySelectorAll('title')[1].textContent).toBe('');
    pieChart.title = 'Test Title';
    expect(pieChart.title).toBe('Test Title');
    expect(pieChart.shadowRoot.querySelectorAll('title')[0].textContent).toBe('');
    expect(pieChart.shadowRoot.querySelectorAll('title')[1].textContent).toBe('Test Title');
  });
});
