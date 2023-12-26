/**
 * @jest-environment jsdom
 */
import IdsLineChart from '../../src/components/ids-line-chart/ids-line-chart';
import dataset from '../../src/assets/data/components.json';
import '../helpers/canvas-mock';
import '../helpers/resize-observer-mock';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsLineChart Component', () => {
  let lineChart: any;

  beforeEach(async () => {
    lineChart = new IdsLineChart();
    IdsGlobal.onThemeLoaded().resolve();
    document.body.appendChild(lineChart);
    lineChart.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('supports setting markerSize', () => {
    expect(lineChart.markerSize).toEqual(5);
    expect(lineChart.shadowRoot.querySelector('circle').getAttribute('r')).toEqual('5');
    lineChart.markerSize = 8;
    expect(lineChart.markerSize).toEqual(8);
  });

  it('supports disabling animation', () => {
    expect(lineChart.shadowRoot.querySelectorAll('animate').length).toBe(21);
    lineChart.animated = false;
    lineChart.redraw();
    expect(lineChart.shadowRoot.querySelectorAll('animate').length).toEqual(0);
  });

  it('can set custom colors', async () => {
    lineChart.data = [{
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
    lineChart.redraw();

    expect(lineChart.container.parentNode.querySelectorAll('.swatch')[0].classList.contains('color-1')).toBeTruthy();
    expect(lineChart.shadowRoot.querySelectorAll('circle')[0].classList.contains('color-1')).toBeTruthy();
    expect(lineChart.color(0)).toEqual('var(color-1)');

    expect(lineChart.container.parentNode.querySelectorAll('.swatch')[1].classList.contains('color-2')).toBeTruthy();
    expect(lineChart.shadowRoot.querySelectorAll('circle')[1].classList.contains('color-1')).toBeTruthy();
    expect(lineChart.shadowRoot.querySelector('circle').getAttribute('r')).toEqual('5');
    expect(lineChart.color(1)).toEqual('var(color-2)');
  });

  it('supports short labels', () => {
    // Needs a real DOM to test properly
    lineChart.width = 300;
    lineChart.redraw();
    expect(lineChart.shadowRoot.querySelector('.chart-legend').innerHTML).toMatchSnapshot();
  });

  it('should get/set selected by api', async () => {
    lineChart.setSelected();
    let selected = lineChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    let selectedClass = lineChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
    expect(lineChart.getSelected()).toEqual({});
    lineChart.selectable = true;

    lineChart.setSelected('test');
    expect(lineChart.getSelected()).toEqual({});
    selected = lineChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = lineChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(0);
    expect(selectedClass.length).toEqual(0);
    expect(lineChart.getSelected()).toEqual({});

    lineChart.setSelected({ groupIndex: 0 });
    selected = lineChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = lineChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(7);
    expect(lineChart.getSelected().groupIndex).toEqual('0');
    expect(lineChart.getSelected().index).toEqual(undefined);

    lineChart.setSelected({ groupIndex: 1, index: 2 });
    selected = lineChart.selectionElements.filter((el: SVGElement) => el.hasAttribute('selected'));
    selectedClass = lineChart.selectionElements.filter((el: SVGElement) => el.classList.contains('selected'));
    expect(selected.length).toEqual(1);
    expect(selectedClass.length).toEqual(7);
    expect(lineChart.getSelected().groupIndex).toEqual('1');
    expect(lineChart.getSelected().index).toEqual('2');
  });

  it('should not let set horizontal', () => {
    expect(lineChart.horizontal).toEqual(false);
    expect(lineChart.getAttribute('horizontal')).toEqual(null);
    lineChart.horizontal = true;
    expect(lineChart.horizontal).toEqual(false);
    expect(lineChart.getAttribute('horizontal')).toEqual(null);
  });
});
