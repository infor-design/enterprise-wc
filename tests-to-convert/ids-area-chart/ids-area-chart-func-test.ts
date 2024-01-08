/**
 * @jest-environment jsdom
 */
import IdsAreaChart from '../../src/components/ids-area-chart/ids-area-chart';
import dataset from '../../src/assets/data/components.json';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import '../helpers/canvas-mock';
import '../helpers/resize-observer-mock';

describe('IdsAreaChart Component', () => {
  let areaChart: any;

  beforeEach(async () => {
    areaChart = new IdsAreaChart();
    document.body.appendChild(areaChart);
    areaChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('supports setting markerSize', () => {
    expect(areaChart.markerSize).toEqual(5);
    expect(areaChart.shadowRoot.querySelector('circle').getAttribute('r')).toEqual('5');
    areaChart.markerSize = 8;
    expect(areaChart.markerSize).toEqual(8);
  });

  it('supports setting animated', () => {
    expect(areaChart.shadowRoot.querySelectorAll('.animate').length).toEqual(3);
    areaChart.animated = false;
    areaChart.redraw();
    expect(areaChart.shadowRoot.querySelectorAll('.animate').length).toEqual(0);
  });

  it('can set custom colors', async () => {
    areaChart.data = [{
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
      color: 'var(--ids-color-azure-20)',
      name: 'Series 2'
    }];
    areaChart.redraw();

    expect(areaChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('circle')[0].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('.areas path')[0].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.color(0)).toEqual('var(color-1)');

    expect(areaChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('circle')[1].classList.contains('color-1')).toBeTruthy();
    expect(areaChart.shadowRoot.querySelectorAll('.areas path')[1].classList.contains('color-2')).toBeTruthy();
    expect(areaChart.color(1)).toEqual('var(color-2)');
  });

  it('should get svg chart template', () => {
    expect(areaChart.chartTemplate()).toContain('<g class="marker-lines">');
  });

  it('should set selectable', () => {
    expect(areaChart.selectable).toEqual(false);
    expect(areaChart.getAttribute('selectable')).toEqual(null);
    areaChart.selectable = true;
    expect(areaChart.selectable).toEqual(true);
    expect(areaChart.getAttribute('selectable')).toEqual('');
    areaChart.selectable = false;
    expect(areaChart.selectable).toEqual(false);
    expect(areaChart.getAttribute('selectable')).toEqual(null);
  });

  it('should select/deselect by click', () => {
    expect(areaChart.selectionElements.length).toEqual(0);
    expect(areaChart.setSelection()).toEqual(false);
    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    areaChart.selectable = true;
    let selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    let selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    let elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    elem = areaChart.shadowRoot.querySelector('[part="marker"][group-index="1"][index="2"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    elem = areaChart.shadowRoot.querySelector('[part="marker"][group-index="1"][index="2"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    elem = areaChart.shadowRoot.querySelector('[part="line"][group-index="1"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    elem = areaChart.shadowRoot.querySelector('[part="line"][group-index="1"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    elem = areaChart.shadowRoot.querySelector('[part="area"][group-index="1"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    elem = areaChart.shadowRoot.querySelector('[part="area"][group-index="1"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
  });

  it('should switch select to other elements', () => {
    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    areaChart.selectable = true;
    let selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    let selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    let elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);

    elem = areaChart.shadowRoot.querySelector('[part="marker"][group-index="1"][index="2"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);

    elem = areaChart.shadowRoot.querySelector('[part="line"][group-index="2"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);

    elem = areaChart.shadowRoot.querySelector('[part="area"][group-index="1"]');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
  });

  it('should set pre selected group elements', () => {
    document.body.innerHTML = '';
    const ds = deepClone(dataset);
    (ds as any)[0].selected = true;

    areaChart = new IdsAreaChart();
    areaChart.selectable = true;
    document.body.appendChild(areaChart);
    areaChart.data = ds;

    const selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    const selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
  });

  it('should set pre selected group elements', () => {
    document.body.innerHTML = '';
    const ds = deepClone(dataset);
    (ds as any)[1].data[1].selected = true;

    areaChart = new IdsAreaChart();
    areaChart.selectable = true;
    document.body.appendChild(areaChart);
    areaChart.data = ds;

    const selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    const selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
  });

  it('should veto before selected', async () => {
    let veto: boolean;
    areaChart.addEventListener('beforeselected', (e: CustomEvent) => {
      e.detail.response(veto);
    });
    veto = false;
    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    areaChart.selectable = true;

    let selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    let selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    let elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
    veto = true;
    elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
  });

  it('should veto before deselected', async () => {
    let veto: boolean;
    areaChart.addEventListener('beforedeselected', (e: CustomEvent) => {
      e.detail.response(veto);
    });

    const triggerClick = (el: any) => el.dispatchEvent(new Event('click', { bubbles: true }));
    areaChart.selectable = true;

    let selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    let selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);

    let elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    veto = false;
    elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(2)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    veto = true;
    elem = areaChart.shadowRoot.querySelector('.chart-legend-item:nth-child(1)');
    triggerClick(elem);
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
  });

  it('should get/set selected by api', async () => {
    areaChart.setSelected();
    let selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    let selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
    expect(areaChart.getSelected()).toEqual({});
    areaChart.selectable = true;

    areaChart.setSelected('test');
    expect(areaChart.getSelected()).toEqual({});
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
    expect(areaChart.getSelected()).toEqual({});

    areaChart.setSelected({ groupIndex: 0 });
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    expect(areaChart.getSelected().groupIndex).toEqual('0');
    expect(areaChart.getSelected().index).toEqual(undefined);

    areaChart.setSelected({ groupIndex: 1, index: 2 });
    selected = areaChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = areaChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(8);
    expect(areaChart.getSelected().groupIndex).toEqual('1');
    expect(areaChart.getSelected().index).toEqual('2');
  });
});
