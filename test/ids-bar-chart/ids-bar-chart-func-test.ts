/**
 * @jest-environment jsdom
 */
import IdsBarChart from '../../src/components/ids-bar-chart/ids-bar-chart';
import dataset from '../../src/assets/data/components.json';
import '../helpers/resize-observer-mock';

describe('IdsBarChart Component', () => {
  let barChart: any;

  beforeEach(async () => {
    barChart = new IdsBarChart();
    barChart.animated = false;
    document.body.appendChild(barChart);
    barChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    barChart = new IdsBarChart();
    barChart.animated = false;
    document.body.appendChild(barChart);
    barChart.data = dataset;

    barChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set custom colors', () => {
    barChart.data = [{
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
    barChart.rerender();

    // Note: This doesnt test this really well since jest doesnt support stylesheets - see also the percy test
    expect(barChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(barChart.shadowRoot.querySelectorAll('.color-1')[0].classList.contains('color-1')).toBeTruthy();
    expect(barChart.color(0)).toEqual('var(color-1)');

    expect(barChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(barChart.shadowRoot.querySelectorAll('.color-2')[0].classList.contains('color-2')).toBeTruthy();
    expect(barChart.color(1)).toEqual('var(color-2)');
  });

  it('can set accessible patterns', () => {
    document.body.innerHTML = '';
    barChart = new IdsBarChart();
    barChart.animated = false;
    document.body.appendChild(barChart);

    // Mock stylesheets
    barChart.shadowRoot.styleSheets = [{
      insertRule: jest.fn()
    }];

    barChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: 200
      }],
      name: 'Series 1',
      pattern: 'circles',
      patternColor: '#DA1217'
    }, {
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: 300
      }],
      name: 'Series 2',
      pattern: 'exes'
    }];

    expect(barChart.container.parentNode.querySelectorAll('.swatch svg')[0].querySelector('rect').getAttribute('fill')).toEqual('url(#circles)');
    expect(barChart.shadowRoot.querySelectorAll('.color-1')[0].getAttribute('fill')).toEqual('url(#circles)');
    expect(barChart.color(0)).toEqual('#DA1217');

    expect(barChart.container.parentNode.querySelectorAll('.swatch svg')[1].querySelector('rect').getAttribute('fill')).toEqual('url(#exes)');
    expect(barChart.shadowRoot.querySelectorAll('.color-2')[0].getAttribute('fill')).toEqual('url(#exes)');
    expect(barChart.color(1)).toEqual('var(--ids-color-palette-turquoise-40)');
  });

  it('can set barPercentage', () => {
    expect(barChart.barPercentage).toEqual(0.5);
    barChart.barPercentage = 1.5;
    barChart.rerender();
    expect(barChart.getAttribute('bar-percentage')).toEqual('1.5');
  });

  it('renders animated elements', () => {
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('beforeend', `<ids-bar-chart animated="true"></ids-bar-chart>`);
    barChart = document.querySelector('ids-bar-chart');
    barChart.width = 500;
    barChart.height = 500;
    barChart.data = dataset;
    barChart.rerender();
    expect(barChart.container.querySelectorAll('animate')).toHaveLength(36);
    barChart.animated = false;
    barChart.remove();
  });

  it('can set category percentage', () => {
    expect(barChart.categoryPercentage).toEqual(0.9);
    barChart.categoryPercentage = 1.5;
    barChart.rerender();
    expect(barChart.getAttribute('category-percentage')).toEqual('1.5');
  });

  it('supports stacked chart', () => {
    document.body.innerHTML = '';
    barChart = new IdsBarChart();
    barChart.animated = false;
    document.body.appendChild(barChart);
    barChart.width = 500;
    barChart.height = 500;
    barChart.stacked = true;
    barChart.data = dataset;

    expect(barChart.container.querySelectorAll('[index="0"]').length).toBe(3);
    expect(barChart.container.querySelectorAll('[index="1"]').length).toBe(3);
    expect(barChart.container.querySelectorAll('[index="2"]').length).toBe(3);
  });

  it('shows a tooltip on hover', (done) => {
    barChart.animated = false;
    const rect = barChart.container.querySelector('rect');
    rect.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = barChart.container.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toEqual('Jan 100');
      done();
    }, 1);
  });

  it('wont error if no vertical lines', () => {
    const errors = jest.spyOn(global.console, 'error');
    barChart.shadowRoot.querySelector('.vertical-lines').remove();
    barChart.rendered();
    expect(errors).not.toHaveBeenCalled();
  });

  it('shows a custom tooltip on hover', (done) => {
    document.body.innerHTML = '';
    barChart = new IdsBarChart();
    barChart.animated = false;
    document.body.appendChild(barChart);

    barChart.data = [{
      data: [{
        name: 'Jan',
        value: 100,
        tooltip: 'Test Tooltip'
      }, {
        name: 'Feb',
        value: 200,
        tooltip: 'Test Tooltip'
      }],
      name: 'Series 1'
    }, {
      data: [{
        name: 'Jan',
        value: 100,
        tooltip: '{{value}}'
      }, {
        name: 'Feb',
        value: 300,
        tooltip: '{{value}}'
      }],
      name: 'Series 2'
    }];

    const rect = barChart.container.querySelector('rect');
    rect.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = barChart.container.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toEqual('Test Tooltip');
      done();
    }, 1);
  });

  it('shows a stacked tooltip on hover', (done) => {
    document.body.innerHTML = '';
    barChart = new IdsBarChart();
    barChart.stacked = true;
    barChart.animated = false;
    document.body.appendChild(barChart);

    barChart.data = [{
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: 200
      }],
      name: 'Series 1'
    }, {
      data: [{
        name: 'Jan',
        value: 100
      }, {
        name: 'Feb',
        value: 300
      }],
      name: 'Series 2'
    }];

    const rect = barChart.container.querySelector('rect');
    rect.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = barChart.container.querySelector('ids-tooltip');
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toContain('Jan');
      expect(tooltip.textContent).toContain('Series 1');
      expect(tooltip.textContent).toContain('Series 2');
      done();
    }, 1);
  });
});
