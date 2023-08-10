/**
 * @jest-environment jsdom
 */
import IdsPieChart from '../../src/components/ids-pie-chart/ids-pie-chart';
import dataset from '../../src/assets/data/items-single.json';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsLocaleData from '../../src/components/ids-locale/ids-locale-data';

import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import '../helpers/resize-observer-mock';
import processAnimFrame from '../helpers/process-anim-frame';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import { locale as deDELocale } from '../../src/components/ids-locale/data/de-DE';

describe('IdsPieChart Component', () => {
  let pieChart: any;
  let container: any;

  beforeEach(async () => {
    container = new IdsContainer();
    IdsLocaleData.loadedLanguages.set('de', deMessages);
    IdsLocaleData.loadedLocales.set('de-DE', deDELocale);

    pieChart = new IdsPieChart();
    document.body.appendChild(container);
    container.appendChild(pieChart);
    pieChart.animated = false;
    pieChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    document.body.appendChild(pieChart);
    pieChart.animated = false;
    pieChart.data = dataset;
    await processAnimFrame();

    pieChart.remove();
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set custom colors', async () => {
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
        color: 'var(--ids-color-azure-20)',
      }]
    }];
    await processAnimFrame();
    pieChart.redraw();
    await processAnimFrame();

    // Note: This doesnt test this really well since jest doesnt support stylesheets - see also the percy test
    expect(pieChart.svgContainer.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(pieChart.color(0)).toEqual('var(--ids-chart-color-accent-01)');

    expect(pieChart.svgContainer.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(pieChart.color(1)).toEqual('var(color-2)');
  });

  it('can set accessible patterns', async () => {
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

    expect(pieChart.svgContainer.parentNode.querySelectorAll('.swatch svg')[0].querySelector('rect').getAttribute('fill')).toEqual('url(#circles)');
    expect(pieChart.shadowRoot.querySelectorAll('.slice')[0].getAttribute('stroke')).toEqual('url(#circles)');

    expect(pieChart.svgContainer.parentNode.querySelectorAll('.swatch svg')[1].querySelector('rect').getAttribute('fill')).toEqual('url(#exes)');
    expect(pieChart.shadowRoot.querySelectorAll('.slice')[1].getAttribute('stroke')).toEqual('url(#exes)');
  });

  it('supports donut chart', async () => {
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);
    pieChart.donut = true;
    pieChart.donutText = 'Test Text';
    pieChart.data = dataset;
    await processAnimFrame();

    expect(pieChart.container.querySelectorAll('[index="0"]').length).toBe(1);
    expect(pieChart.container.querySelectorAll('[index="1"]').length).toBe(1);
    expect(pieChart.container.querySelectorAll('[index="2"]').length).toBe(1);
    expect(pieChart.container.querySelector('.donut-text').innerHTML).toBe('Test Text');

    pieChart.donutText = 'Test Update';
    expect(pieChart.container.querySelector('.donut-text').innerHTML).toBe('Test Update');
  });

  it('shows a tooltip on hover', async () => {
    pieChart.animated = false;
    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    await processAnimFrame();
    expect(tooltip.visible).toEqual(true);
    expect(tooltip.textContent).toEqual('Item A 10.1');
  });

  it('can suppress tooltips', async () => {
    pieChart.suppressTooltips = true;
    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    await processAnimFrame();
    expect(tooltip.visible).toEqual(false);
  });

  it('shows a custom tooltip on hover', async () => {
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    document.body.appendChild(pieChart);
    pieChart.animated = false;

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
    await processAnimFrame();

    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    await processAnimFrame();

    expect(tooltip.visible).toEqual(true);
    expect(tooltip.textContent).toEqual('Test Tooltip');
  });

  it('defaults missing value to zero in a tooltip', async () => {
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
    await processAnimFrame();

    const slice = pieChart.container.querySelector('.slice');
    slice.dispatchEvent(new CustomEvent('hoverend'));
    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');
    await processAnimFrame();
    expect(tooltip.visible).toEqual(true);
    expect(tooltip.textContent).toEqual('Jan 0');
  });

  it('shows tooltip on hover with donut', () => {
    const ds = [{
      data: [
        { value: 1, name: 'slice1', tooltip: 'slice1' },
        { value: 1, name: 'slice2', tooltip: 'slice2' },
        { value: 1, name: 'slice3', tooltip: 'slice3' },
        { value: 1, name: 'slice4', tooltip: 'slice4' },
        { value: 1, name: 'slice5', tooltip: 'slice5' },
        { value: 1, name: 'slice6', tooltip: 'slice6' },
        { value: 1, name: 'slice7', tooltip: 'slice7' },
        { value: 1, name: 'slice8', tooltip: 'slice8' },
        { value: 1, name: 'slice9', tooltip: 'slice9' },
        { value: 1, name: 'slice10', tooltip: 'slice10' },
        { value: 1, name: 'slice11', tooltip: 'slice11' },
        { value: 1, name: 'slice12', tooltip: 'slice12' },
        { value: 1, name: 'slice13', tooltip: 'slice13' },
        { value: 1, name: 'slice14', tooltip: 'slice14' },
        { value: 1, name: 'slice15', tooltip: 'slice15' },
        { value: 1, name: 'slice16', tooltip: 'slice16' }
      ]
    }];
    document.body.innerHTML = '';
    pieChart = new IdsPieChart();
    pieChart.animated = false;
    document.body.appendChild(pieChart);
    pieChart.donut = true;
    pieChart.donutText = 'Test';
    pieChart.data = ds;

    const tooltip: any = pieChart.shadowRoot.querySelector('ids-tooltip');

    [...pieChart.container.querySelectorAll('.slice')].forEach((slice: any, i: number) => {
      slice.dispatchEvent(new CustomEvent('hoverend'));
      expect(tooltip.visible).toEqual(true);
      expect(tooltip.textContent).toEqual(ds[0].data[i].tooltip);
    });
  });

  it('renders an empty message with empty data', async () => {
    expect(pieChart.emptyMessage.getAttribute('hidden')).toEqual('');
    pieChart.data = [];
    await processAnimFrame();
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
    await processAnimFrame();
    expect(pieChart.emptyMessage.getAttribute('hidden')).toEqual('');
    pieChart.data = [];
    await processAnimFrame();
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
    await processAnimFrame();
    pieChart.data = [];
    await processAnimFrame();
    expect(pieChart.emptyMessage.querySelector('ids-text').textContent).toBe('No data available');
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
    await processAnimFrame();
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

  it('should set selectable', () => {
    expect(pieChart.selectable).toEqual(false);
    expect(pieChart.getAttribute('selectable')).toEqual(null);
    pieChart.selectable = true;
    expect(pieChart.selectable).toEqual(true);
    expect(pieChart.getAttribute('selectable')).toEqual('');
    pieChart.selectable = false;
    expect(pieChart.selectable).toEqual(false);
    expect(pieChart.getAttribute('selectable')).toEqual(null);
  });

  it('should select/deselect by click', () => {
    expect(pieChart.selectionElements.length).toEqual(0);
    expect(pieChart.setSelection()).toEqual(false);
    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    pieChart.selectable = true;
    let selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);

    let elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);

    elem = pieChart.shadowRoot.querySelector('.slice[index="2"]');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    elem = pieChart.shadowRoot.querySelector('.slice[index="0"]');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    elem = pieChart.shadowRoot.querySelector('.slice[index="0"]');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);
  });

  it('should set pre selected elements', async () => {
    document.body.innerHTML = '';
    const ds = deepClone(dataset);
    (ds as any)[0].data[2].selected = true;

    // TODO Changing order of the appendChilds causes the test to fail
    container = new IdsContainer();
    pieChart = new IdsPieChart();
    document.body.appendChild(container);
    container.appendChild(pieChart);
    pieChart.selectable = true;
    pieChart.animated = false;
    pieChart.data = ds;
    await processAnimFrame();
    const selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
  });

  it('should veto before selected', async () => {
    let veto: boolean;
    pieChart.addEventListener('beforeselected', (e: CustomEvent) => {
      e.detail.response(veto);
    });
    veto = false;
    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    pieChart.selectable = true;

    let selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);

    let elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);
    veto = true;
    elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
  });

  it('should veto before deselected', async () => {
    let veto: boolean;
    pieChart.addEventListener('beforedeselected', (e: CustomEvent) => {
      e.detail.response(veto);
    });

    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    pieChart.selectable = true;

    let selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);

    let elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    veto = false;
    elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(2)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    veto = true;
    elem = pieChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);
  });

  it('should get/set selected by api', async () => {
    pieChart.setSelected();
    let selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);
    expect(pieChart.getSelected()).toEqual({});
    pieChart.selectable = true;

    pieChart.setSelected('test');
    expect(pieChart.getSelected()).toEqual({});
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(0);
    expect(pieChart.getSelected()).toEqual({});

    pieChart.setSelected({ index: 0 });
    selected = pieChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    expect(selected.length).toEqual(1);
    expect(pieChart.getSelected().index).toEqual('0');
  });
});
