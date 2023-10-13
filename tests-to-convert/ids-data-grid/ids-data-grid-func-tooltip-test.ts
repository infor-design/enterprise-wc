/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/products.json';
import wait from '../helpers/wait';

let dataGrid: any;
let container: any;
let tooltip: any;
let sel: string;

// Define tooltip callback
const tooltipCallback = (args: {
  type: string,
  columnIndex: number,
  rowIndex: number,
  text: string
}): string => {
  const {
    type,
    columnIndex,
    rowIndex,
    text
  } = args;

  if (type === 'header-title') {
    return `Text: ${text}<br/>Header Row: ${rowIndex}, Cell: ${columnIndex}`;
  }
  if (type === 'filter-button') {
    return `Text: ${text}<br/>FilterButton Row: ${rowIndex}, Cell: ${columnIndex}`;
  }
  return `Text: ${text}<br/>for Row: ${rowIndex}, Cell: ${columnIndex}`;
};

// Define async tooltip callback.
const tooltipCallbackAsync = async (args: {
  type: string,
  columnIndex: number,
  rowIndex: number,
  text: string
}): Promise<string> => {
  const {
    type,
    columnIndex,
    rowIndex,
    text
  } = args;

  return new Promise((resolve) => {
    setTimeout(() => {
      let tooltipContent = '';
      if (type === 'header-title') {
        tooltipContent = `Async Text: ${text}<br/>Header Row: ${rowIndex}, Cell: ${columnIndex}`;
      } else if (type === 'filter-button') {
        tooltipContent = `Async Text: ${text}<br/>FilterButton Row: ${rowIndex}, Cell: ${columnIndex}`;
      } else {
        tooltipContent = `Async Text: ${text}<br/>Row: ${rowIndex}, Cell: ${columnIndex}`;
      }
      resolve(tooltipContent);
    }, 500);
  });
};

const tooltipWait = 500;

const columns = (grid: any) => {
  const cols = [];
  cols.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: grid.formatters.selectionCheckbox,
    align: 'center'
  });
  cols.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    width: 80,
    resizable: true,
    reorderable: true,
    sortable: true,
    formatter: grid.formatters.text
  });
  cols.push({
    id: 'customTooltip',
    name: 'Custom Tooltip',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: grid.filters.integer,
    formatter: grid.formatters.hyperlink,
    formatOptions: { group: '' },
    width: 88,
    tooltip: 'This is a product Id',
    headerTooltip: 'This is the product Id header',
    filterButtonTooltip: 'This is the product Id filterButton',
    tooltipOptions: {
      placement: 'right',
      headerPlacement: 'top',
      filterButtonPlacement: 'bottom',
      x: 10,
      y: 0,
      headerX: 0,
      headerY: 10,
      filterButtonX: 12,
      filterButtonY: 18
    },
    tooltipCssPart: 'custom-tooltip',
    headerTooltipCssPart: 'custom-tooltip',
    headerIconTooltipCssPart: 'custom-tooltip',
    filterButtonTooltipCssPart: 'custom-tooltip'
  });
  cols.push({
    id: 'color',
    name: 'Tooltip Callback',
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: grid.formatters.text,
    filterType: grid.filters.text,
    width: 105,
    tooltip: tooltipCallback,
    tooltipCssPart: () => 'custom-tooltip',
    tooltipOptions: () => ({
      placement: 'right',
      headerPlacement: 'top',
      filterButtonPlacement: 'bottom',
      x: 10,
      y: 0,
      headerX: 0,
      headerY: 10,
      filterButtonX: 12,
      filterButtonY: 18
    })
  });
  cols.push({
    id: 'productId',
    name: 'Tooltip async Callback',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: grid.filters.integer,
    formatter: grid.formatters.integer,
    formatOptions: { group: '' },
    tooltip: tooltipCallbackAsync
  });
  cols.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: grid.formatters.text,
    filterType: grid.filters.text,
    filterConditions: [{
      value: 'contains',
      label: 'Contains',
      icon: 'filter-contains'
    },
    {
      value: 'equals',
      label: 'Equals',
      icon: 'filter-equals',
      selected: true
    }]
  });
  cols.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    sortable: false,
    resizable: true,
    reorderable: true,
    align: 'center',
    formatter: grid.formatters.text,
    filterType: grid.filters.checkbox,
    headerIcon: 'info',
    headerIconTooltip: 'This is header icon',
    tooltipOptions: {
      headerIconPlacement: 'top',
      headerIconX: 0,
      headerIconY: 16
    }
  });
  cols.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: grid.formatters.integer,
    filterType: grid.filters.integer
  });
  cols.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: grid.formatters.text,
    filterType: grid.filters.text
  });
  return cols;
};

// Check tooltip for given element
const checkTooltip = async (elem: any, grid: any, tooltipEl: any, shouldSetWidth = false) => {
  const link = elem.querySelector('ids-hyperlink');
  const textEllipsis = (link ? elem : elem.querySelector('.text-ellipsis'));
  expect(tooltipEl.visible).toEqual(false);
  expect(elem).toBeTruthy();
  const showtooltipMockCallback = jest.fn(() => { });
  const hidetooltipMockCallback = jest.fn(() => { });
  grid.addEventListener('showtooltip', showtooltipMockCallback);
  grid.addEventListener('showtooltip', hidetooltipMockCallback);
  const mouseover = new MouseEvent('mouseover', { bubbles: true });
  const mouseout = new MouseEvent('mouseout', { bubbles: true });
  const scroll = new MouseEvent('scroll', { bubbles: true });
  const orig = { offsetWidth: elem.offsetWidth, scrollWidth: elem.scrollWidth };
  if (shouldSetWidth) {
    Object.defineProperty(elem, 'offsetWidth', { configurable: true, value: 1 });
    Object.defineProperty(elem, 'scrollWidth', { configurable: true, value: 2 });
  }
  if (textEllipsis) {
    Object.defineProperty(textEllipsis, 'offsetWidth', { configurable: true, value: 1 });
    Object.defineProperty(textEllipsis, 'scrollWidth', { configurable: true, value: 2 });
  }
  elem.dispatchEvent(mouseover);
  await wait(tooltipWait);
  expect(tooltipEl.visible).toEqual(true);
  expect(showtooltipMockCallback.mock.calls.length).toBe(1);
  grid.container.dispatchEvent(scroll);
  expect(tooltipEl.visible).toEqual(false);
  grid.container.dispatchEvent(mouseout);
  expect(tooltipEl.visible).toEqual(false);
  expect(hidetooltipMockCallback.mock.calls.length).toBe(1);
  if (shouldSetWidth) {
    Object.defineProperty(elem, 'offsetWidth', { configurable: true, value: orig.offsetWidth });
    Object.defineProperty(elem, 'scrollWidth', { configurable: true, value: orig.scrollWidth });
  }
  if (textEllipsis) {
    Object.defineProperty(textEllipsis, 'offsetWidth', { configurable: true, value: orig.offsetWidth });
    Object.defineProperty(textEllipsis, 'scrollWidth', { configurable: true, value: orig.scrollWidth });
  }
};

describe('IdsDataGrid Component', () => {
  beforeEach(async () => {
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.columns = deepClone(columns(dataGrid));
    dataGrid.data = deepClone(dataset).slice(0, 2);

    tooltip = dataGrid.shadowRoot.querySelector('ids-tooltip');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const dataGrid2: any = new IdsDataGrid();
    document.body.appendChild(dataGrid2);
    dataGrid2.columns = deepClone(columns(dataGrid2));
    dataGrid2.data = deepClone(dataset).slice(0, 2);
    dataGrid2.remove();

    expect(document.querySelectorAll('ids-data-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should sets suppress tooltips', () => {
    expect(dataGrid.getAttribute('suppress-tooltips')).toEqual(null);
    expect(dataGrid.suppressTooltips).toEqual(false);
    dataGrid.suppressTooltips = true;

    expect(dataGrid.getAttribute('suppress-tooltips')).toEqual('');
    expect(dataGrid.suppressTooltips).toEqual(true);
    dataGrid.suppressTooltips = false;

    expect(dataGrid.getAttribute('suppress-tooltips')).toEqual(null);
    expect(dataGrid.suppressTooltips).toEqual(false);
  });

  it('shows tooltip with text content for body cell', async () => {
    sel = '.ids-data-grid-body [data-index="0"] [aria-colindex="6"]';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip, true);
  });

  it('shows tooltip with text content for header title', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="7"] .ids-data-grid-header-text';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip, true);
  });

  it('shows tooltip with text content for header icon', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="7"] .ids-data-grid-header-icon';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it('shows tooltip with text content for filter button', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="7"] ids-menu-button';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it.skip('shows tooltip with custom content for body cell', async () => {
    sel = '.ids-data-grid-body [data-index="0"] [aria-colindex="3"]';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it('shows tooltip with custom content for header title', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="3"] .ids-data-grid-header-text';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip, true);
  });

  it('shows tooltip with custom content for filter button', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="3"] ids-menu-button';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it.skip('shows tooltip with callback content for body cell', async () => {
    sel = '.ids-data-grid-body [data-index="0"] [aria-colindex="4"]';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it('shows tooltip with callback content for header title', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="4"] .ids-data-grid-header-text';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip, true);
  });

  it('shows tooltip with callback content for filter button', async () => {
    sel = '.ids-data-grid-header-cell[aria-colindex="4"] ids-menu-button';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it.skip('shows tooltip with header groups', async () => {
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.columns = deepClone(columns(dataGrid));
    dataGrid.columnGroups = [{
      colspan: 3,
      id: 'group1',
      name: 'Column Group One',
      align: 'center'
    }, {
      colspan: 2,
      id: 'group2',
      name: 'Column Group Two',
      headerIcon: 'error',
    }, {
      colspan: 4,
      id: 'group3',
      name: 'Column Group Three',
      align: 'right'
    }];
    dataGrid.data = deepClone(dataset).slice(0, 2);
    tooltip = dataGrid.shadowRoot.querySelector('ids-tooltip');

    sel = '.ids-data-grid-column-groups [column-group-id="group1"] .ids-data-grid-header-text';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip, true);

    sel = '.ids-data-grid-header-cell[aria-colindex="7"] .ids-data-grid-header-text';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip, true);

    sel = '.ids-data-grid-header-cell[aria-colindex="7"] .ids-data-grid-header-icon';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);

    sel = '.ids-data-grid-header-cell[aria-colindex="7"] ids-menu-button';
    await checkTooltip(dataGrid.container.querySelector(sel), dataGrid, tooltip);
  });

  it.skip('should veto before tooltip show response', async () => {
    let isVeto: boolean;
    dataGrid.addEventListener('beforetooltipshow', (e: CustomEvent) => {
      e.detail.response(isVeto); // veto
    });
    sel = '.ids-data-grid-body [data-index="0"] [aria-colindex="7"]';
    let elem = dataGrid.container.querySelector(sel);

    expect(tooltip.visible).toEqual(false);
    expect(elem).toBeTruthy();

    let mouseover = new MouseEvent('mouseover', { bubbles: true });
    let scroll = new MouseEvent('scroll', { bubbles: true });
    isVeto = false;
    elem.dispatchEvent(mouseover);
    await wait(tooltipWait);

    expect(tooltip.visible).toEqual(false);
    dataGrid.container.dispatchEvent(scroll);

    expect(tooltip.visible).toEqual(false);
    isVeto = true;
    elem = dataGrid.container.querySelector(sel);
    expect(elem).toBeTruthy();
    mouseover = new MouseEvent('mouseover', { bubbles: true });
    scroll = new MouseEvent('scroll', { bubbles: true });
    elem.dispatchEvent(mouseover);
    await wait(tooltipWait);

    expect(tooltip.visible).toEqual(true);
    dataGrid.container.dispatchEvent(scroll);

    expect(tooltip.visible).toEqual(false);
  });
});
