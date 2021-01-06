/**
 * @jest-environment jsdom
 */
import { IdsDataGrid, IdsDataGridFormatters } from '../../src/ids-data-grid/ids-data-grid';
import dataset from '../../app/data/books.json';

describe('IdsDataGrid Component', () => {
  let dataGrid;
  const formatters = new IdsDataGridFormatters();
  const columns = () => {
    const cols = [];
    cols.push({
      id: 'selectionCheckbox',
      sortable: false,
      resizable: false,
      formatter: formatters.text,
      align: 'center',
      width: 20
    });
    cols.push({
      id: 'book',
      name: 'Book',
      field: 'book',
      formatter: formatters.text,
      width: 65,
      sortable: true
    });
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      formatter: formatters.text,
      sortable: true
    });
    cols.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: formatters.text
    });
    cols.push({
      id: 'bookCurrency',
      name: 'Book Currency',
      field: 'bookCurrency',
      formatter: formatters.text
    });
    cols.push({
      id: 'transactionCurrency',
      name: 'Transaction Currency',
      field: 'transactionCurrency',
      formatter: formatters.text,
    });
    cols.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      formatter: formatters.text
    });
    cols.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      formatter: formatters.text
    });
    cols.push({
      id: 'convention',
      name: 'Convention',
      field: 'convention',
      formatter: formatters.text
    });
    cols.push({
      id: 'methodSwitch',
      name: 'Method Switch',
      field: 'methodSwitch',
      formatter: formatters.text,
      filterType: 'select'
    });
    cols.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: formatters.dropdown
    });
    cols.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: formatters.dropdown
    });
    cols.push({
      id: 'deprecationHistory',
      name: 'Deprecation History',
      field: 'deprecationHistory',
      formatter: formatters.dropdown
    });
    return cols;
  };

  beforeEach(async () => {
    // Mock the CSSStyleSheet in adoptedStyleSheets
    window.CSSStyleSheet = function CSSStyleSheet() { //eslint-disable-line
      return { cssRules: [], replaceSync: () => '', insertRule: () => '' };
    };

    dataGrid = new IdsDataGrid();
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    const dataGrid2 = new IdsDataGrid();
    document.body.appendChild(dataGrid2);
    dataGrid2.columns = columns();
    dataGrid2.data = dataset;
    dataGrid2.remove();

    expect(document.querySelectorAll('ids-data-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(dataGrid.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders row data', () => {
    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-cell').length).toEqual(117);
  });

  it('renders with no errors on empty data and columns', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    document.body.appendChild(dataGrid);
    dataGrid.columns = [];
    dataGrid.data = [];
    dataGrid.template();

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders with alternateRowShading option', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.alternateRowShading = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;

    expect(dataGrid.shadowRoot.querySelectorAll('.alt-row-shading').length).toEqual(1);
    expect(dataGrid.getAttribute('alternate-row-shading')).toEqual('true');
  });

  it('can reset the alternateRowShading option', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.alternateRowShading = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.alternateRowShading = false;
    dataGrid.alternateRowShading = true;
    dataGrid.alternateRowShading = null;
    dataGrid.alternateRowShading = true;
    dataGrid.alternateRowShading = 'false';

    expect(dataGrid.shadowRoot.querySelectorAll('.alt-row-shading').length).toEqual(0);
    expect(dataGrid.getAttribute('alternate-row-shading')).toEqual('false');
  });

  it('renders with virtualScroll option', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.virtualScroll = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.virtualScroll = false;

    expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(0);
    expect(dataGrid.getAttribute('virtual-scroll')).toBeFalsy();
  });

  it('can reset the virtualScroll option', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.virtualScroll = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;

    expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(1);
  });

  it('renders single column with empty data', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    document.body.appendChild(dataGrid);
    dataGrid.data = null;
    dataGrid.columns = columns();

    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-body').length).toEqual(1);
  });

  it('renders column css with adoptedStyleSheets', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.shadowRoot.adoptedStyleSheets = () => [window.CSSStyleSheet];
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;

    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(13);
  });

  it('renders column css with styleSheets', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.shadowRoot.styleSheets = () => [window.CSSStyleSheet];
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;

    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(13);
  });

  it('renders column when set to empty', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.columns = null;

    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(1);
  });

  it('renders column with no all set widths', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.shadowRoot.adoptedStyleSheets = () => [window.CSSStyleSheet];
    document.body.appendChild(dataGrid);
    dataGrid.data = dataset;
    dataGrid.columns = columns().slice(0, 2);

    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(2);
  });

  it('fires sorted event on sort', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
      expect(x.detail.sortColumn.id).toEqual('description');
      expect(x.detail.sortColumn.ascending).toEqual(true);
    });

    dataGrid.addEventListener('sorted', mockCallback);
    dataGrid.setSortColumn('description', true);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('fires sorted event on sort', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
      expect(x.detail.sortColumn.id).toEqual('description');
      expect(x.detail.sortColumn.ascending).toEqual(false);
    });

    dataGrid.addEventListener('sorted', mockCallback);
    dataGrid.setSortColumn('description', false);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('fires defaults to ascending sort', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
      expect(x.detail.sortColumn.id).toEqual('description');
      expect(x.detail.sortColumn.ascending).toEqual(true);
    });

    dataGrid.addEventListener('sorted', mockCallback);
    dataGrid.setSortColumn('description');

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('sets sort state via the API', () => {
    dataGrid.setSortState('book');
    expect(dataGrid.shadowRoot.querySelectorAll('[data-column-id]')[1].getAttribute('aria-sort')).toBe('ascending');
  });

  it('handles wrong ID on sort', () => {
    const errors = jest.spyOn(global.console, 'error');
    dataGrid.setSortColumn('bookx', false);

    expect(errors).not.toHaveBeenCalled();
  });

  it('fires sorted event on click', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
      expect(x.detail.sortColumn.id).toEqual('book');
      expect(x.detail.sortColumn.ascending).toEqual(true);
    });

    dataGrid.addEventListener('sorted', mockCallback);
    dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell')[1].click();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should not error clicking on a non sortable column', () => {
    const errors = jest.spyOn(global.console, 'error');
    const mockCallback = jest.fn();

    dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell')[5].click();
    dataGrid.addEventListener('sorted', mockCallback);

    expect(mockCallback.mock.calls.length).toBe(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set the label setting', () => {
    dataGrid.label = 'Books';
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('aria-label')).toEqual('Books');
    expect(dataGrid.getAttribute('label')).toEqual('Books');

    dataGrid.label = null;
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('aria-label')).toEqual('Data Grid');
    expect(dataGrid.getAttribute('label')).toEqual(null);
  });

  it('can set the rowHeight setting', () => {
    dataGrid.rowHeight = 'extra-small';
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('extra-small');
    expect(dataGrid.getAttribute('row-height')).toEqual('extra-small');

    dataGrid.rowHeight = 'small';
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('small');
    expect(dataGrid.getAttribute('row-height')).toEqual('small');

    dataGrid.rowHeight = 'medium';
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('medium');
    expect(dataGrid.getAttribute('row-height')).toEqual('medium');

    dataGrid.rowHeight = null;
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('large');
    expect(dataGrid.getAttribute('row-height')).toEqual(null);

    dataGrid.rowHeight = 'large';
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('large');
    expect(dataGrid.getAttribute('row-height')).toEqual('large');
  });

  it('can set the rowHeight setting in virtualScroll mode', () => {
    dataGrid.virtualScroll = true;
    dataGrid.rowHeight = 'extra-small';
    expect(dataGrid.shadowRoot.querySelector('ids-virtual-scroll').getAttribute('item-height')).toEqual('30');

    dataGrid.rowHeight = 'small';
    expect(dataGrid.shadowRoot.querySelector('ids-virtual-scroll').getAttribute('item-height')).toEqual('35');

    dataGrid.rowHeight = 'medium';
    expect(dataGrid.shadowRoot.querySelector('ids-virtual-scroll').getAttribute('item-height')).toEqual('40');

    dataGrid.rowHeight = null;
    expect(dataGrid.shadowRoot.querySelector('ids-virtual-scroll').getAttribute('item-height')).toEqual('50');

    dataGrid.rowHeight = 'large';
    expect(dataGrid.shadowRoot.querySelector('ids-virtual-scroll').getAttribute('item-height')).toEqual('50');

    dataGrid.virtualScroll = false;
    dataGrid.rowHeight = 'small';
    expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('small');
    expect(dataGrid.getAttribute('row-height')).toEqual('small');
  });

  it('can render with the text formatter', () => {
    // Renders text
    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
      .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('101');

    // Renders undefined
    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
      .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('');

    // Renders null
    expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
      .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('');
  });

  it('can handle ArrowRight key', () => {
    expect(dataGrid.activeCell.row).toEqual(0);
    expect(dataGrid.activeCell.cell).toEqual(0);

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.activeCell.row).toEqual(0);
    expect(dataGrid.activeCell.cell).toEqual(1);

    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(2);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(3);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(4);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(5);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(6);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(7);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(8);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(9);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(10);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(11);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(12);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(12);
  });

  it('can handle ArrowLeft key', () => {
    expect(dataGrid.activeCell.row).toEqual(0);
    expect(dataGrid.activeCell.cell).toEqual(0);

    let event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.activeCell.row).toEqual(0);
    expect(dataGrid.activeCell.cell).toEqual(1);

    event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(0);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.cell).toEqual(0);
  });

  it('can handle ArrowDown key', () => {
    expect(dataGrid.activeCell.row).toEqual(0);
    expect(dataGrid.activeCell.cell).toEqual(0);

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.activeCell.row).toEqual(1);
    expect(dataGrid.activeCell.cell).toEqual(0);

    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(2);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(3);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(4);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(5);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(6);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(7);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(8);
  });

  it('can handle ArrowUp key', () => {
    expect(dataGrid.activeCell.row).toEqual(0);

    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.activeCell.row).toEqual(1);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(2);

    event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(1);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(0);
    dataGrid.dispatchEvent(event);
    expect(dataGrid.activeCell.row).toEqual(0);
  });

  it('fires activecellchanged event', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
      expect(x.detail.activeCell.row).toEqual(1);
      expect(x.detail.activeCell.cell).toEqual(0);
      expect(x.detail.activeCell.node).toBeTruthy();
    });

    dataGrid.addEventListener('activecellchanged', mockCallback);
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dataGrid.dispatchEvent(event);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('fires activecellchanged event on click', () => {
    const mockCallback = jest.fn();

    dataGrid.addEventListener('activecellchanged', mockCallback);
    dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[3]
      .querySelectorAll('.ids-data-grid-cell')[3].click();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(dataGrid.activeCell.row).toEqual(2);
    expect(dataGrid.activeCell.cell).toEqual(3);
  });
});
