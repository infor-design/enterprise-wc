/**
 * @jest-environment jsdom
 */
import { IdsDataGrid, IdsDataGridFormatters } from '../../src/components/ids-data-grid/ids-data-grid';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../demos/data/books.json';

describe('IdsDataGrid Component', () => {
  let dataGrid;
  let container;

  const formatters = new IdsDataGridFormatters();
  const columns = () => {
    const cols = [];
    // Set up columns
    cols.push({
      id: 'selectionCheckbox',
      sortable: false,
      resizable: false,
      formatter: formatters.text,
      align: 'center',
      width: 20
    });
    cols.push({
      id: 'rowNumber',
      name: '#',
      formatter: formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 65
    });
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: formatters.text
    });
    cols.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: formatters.text
    });
    cols.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: formatters.date
    });
    cols.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: formatters.time
    });
    cols.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      formatter: formatters.decimal,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    cols.push({
      id: 'bookCurrency',
      name: 'Currency',
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
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    cols.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: formatters.hyperlink,
      href: '#'
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
      formatter: formatters.password
    });
    cols.push({
      id: 'deprecationHistory',
      name: 'Deprecation History',
      field: 'deprecationHistory',
      formatter: formatters.text
    });
    return cols;
  };

  beforeEach(async () => {
    // Mock the CSSStyleSheet in adoptedStyleSheets
    window.CSSStyleSheet = function CSSStyleSheet() { //eslint-disable-line
      return { cssRules: [], replaceSync: () => '', insertRule: () => '' };
    };
    window.StyleSheet.insertRule = () => '';

    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.columns = columns();
    dataGrid.data = dataset;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  describe('Setup / General Tests', () => {
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

    it('can set the label setting', () => {
      dataGrid.label = 'Books';
      expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('aria-label')).toEqual('Books');
      expect(dataGrid.getAttribute('label')).toEqual('Books');

      dataGrid.label = null;
      expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('aria-label')).toEqual('Data Grid');
      expect(dataGrid.getAttribute('label')).toEqual(null);
    });

    it('renders column css with adoptedStyleSheets', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.shadowRoot.adoptedStyleSheets = () => [window.CSSStyleSheet];
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();
      dataGrid.data = dataset;

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
    });

    it('renders column css with styleSheets', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();
      dataGrid.data = dataset;

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
    });

    it('skips render column no styleSheets in headless browsers', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.shadowRoot.styleSheets = [];
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();
      dataGrid.data = dataset;

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
    });

    it('renders one single column', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
      document.body.appendChild(dataGrid);
      dataGrid.columns = [{
        id: 'test',
        width: 20
      }];
      dataGrid.data = dataset;

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
    });
  });

  describe('Row Rendering Tests', () => {
    it('renders row data', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-cell').length).toEqual(dataGrid.columns.length * 9);
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
  });

  describe('Virtual Scrolling Tests', () => {
    it('renders with virtualScroll option', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      dataGrid.virtualScroll = true;
      document.body.appendChild(dataGrid);
      dataGrid.columns = columns();
      dataGrid.data = dataset;
      dataGrid.virtualScroll = false;

      expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(0);
      expect(dataGrid.getAttribute('virtual-scroll')).toEqual('false');
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
  });

  describe('Column Rendering Tests', () => {
    it('renders single column with empty data', () => {
      document.body.innerHTML = '';
      dataGrid = new IdsDataGrid();
      document.body.appendChild(dataGrid);
      dataGrid.data = null;
      dataGrid.columns = columns();

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-body').length).toEqual(1);
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
  });

  describe('Sorting Tests', () => {
    it('fires sorted event on sort', () => {
      const mockCallback = jest.fn((x) => {
        expect(x.detail.elem).toBeTruthy();
        expect(x.detail.sortColumn.id).toEqual('description');
        expect(x.detail.sortColumn.ascending).toEqual(true);
      });

      dataGrid.addEventListener('sort', mockCallback);
      dataGrid.setSortColumn('description', true);

      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('fires sorted event on sort', () => {
      const mockCallback = jest.fn((x) => {
        expect(x.detail.elem).toBeTruthy();
        expect(x.detail.sortColumn.id).toEqual('description');
        expect(x.detail.sortColumn.ascending).toEqual(false);
      });

      dataGrid.addEventListener('sort', mockCallback);
      dataGrid.setSortColumn('description', false);

      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('fires defaults to ascending sort', () => {
      const mockCallback = jest.fn((x) => {
        expect(x.detail.elem).toBeTruthy();
        expect(x.detail.sortColumn.id).toEqual('description');
        expect(x.detail.sortColumn.ascending).toEqual(true);
      });

      dataGrid.addEventListener('sort', mockCallback);
      dataGrid.setSortColumn('description');

      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('sets sort state via the API', () => {
      dataGrid.setSortState('description');
      expect(dataGrid.shadowRoot.querySelectorAll('[data-column-id]')[2].getAttribute('aria-sort')).toBe('ascending');
    });

    it('handles wrong ID on sort', () => {
      const errors = jest.spyOn(global.console, 'error');
      dataGrid.setSortColumn('bookx', false);

      expect(errors).not.toHaveBeenCalled();
    });

    it('fires sorted event on click', () => {
      const mockCallback = jest.fn((x) => {
        expect(x.detail.elem).toBeTruthy();
        expect(x.detail.sortColumn.id).toEqual('description');
        expect(x.detail.sortColumn.ascending).toEqual(true);
      });

      dataGrid.addEventListener('sort', mockCallback);
      dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell')[2].click();

      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('should not error clicking on a non sortable column', () => {
      const errors = jest.spyOn(global.console, 'error');
      const mockCallback = jest.fn();

      dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell')[5].click();
      dataGrid.addEventListener('sort', mockCallback);

      expect(mockCallback.mock.calls.length).toBe(0);
      expect(errors).not.toHaveBeenCalled();
    });
  });

  describe('Row Height Tests', () => {
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
  });

  describe('Formatter Tests', () => {
    it('can render with the text formatter', () => {
      // Renders undefined/null
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('');

      // Renders text
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('CORE');
    });

    it('can render with the password formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[16].querySelector('.text-ellipsis').innerHTML).toEqual('**');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[16].querySelector('.text-ellipsis').innerHTML).toEqual('**');
    });

    it('can render with the rowNumber formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('1');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('4');
    });

    it('can render with the date formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('4/23/2021');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('');
    });

    it('can render with the time formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[5].querySelector('.text-ellipsis').innerHTML)
        .toEqual(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date('2021-04-23T18:25:43.511Z')));

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[5].querySelector('.text-ellipsis').innerHTML)
        .toEqual('');
    });

    it('can render with the decimal formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('12.99');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('');
    });

    it('can render with the decimal formatter (with defaults)', () => {
      delete dataGrid.columns[6].formatOptions;
      dataGrid.rerender();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('12.99');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('');
    });

    it('can render with the integer formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('13');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('');
    });

    it('can render with the integer formatter (with defaults)', () => {
      delete dataGrid.columns[9].formatOptions;
      dataGrid.rerender();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('13');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('');
    });

    it('can render with the hyperlink formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').innerHTML).toEqual('United States');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
    });

    it('can render with the hyperlink formatter (with default href)', () => {
      delete dataGrid.columns[10].href;
      dataGrid.rerender();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').innerHTML).toEqual('United States');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
    });

    it('can render with the hyperlink formatter (with href function)', () => {
      dataGrid.columns[10].href = (row) => {
        if (row.book === 101) {
          return null;
        }
        return `${row.book}`;
      };
      dataGrid.rerender();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').getAttribute('href')).toEqual('102');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
    });
  });

  describe('Keyboard Tests', () => {
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
      expect(dataGrid.activeCell.cell).toEqual(13);
      dataGrid.dispatchEvent(event);
      expect(dataGrid.activeCell.cell).toEqual(14);
      dataGrid.dispatchEvent(event);
      expect(dataGrid.activeCell.cell).toEqual(15);
      dataGrid.dispatchEvent(event);
      expect(dataGrid.activeCell.cell).toEqual(16);
      dataGrid.dispatchEvent(event);
      expect(dataGrid.activeCell.cell).toEqual(17);
      dataGrid.dispatchEvent(event);
      expect(dataGrid.activeCell.cell).toEqual(17);
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
  });

  describe('Active Cell Tests', () => {
    it('fires activecellchange event', () => {
      const mockCallback = jest.fn((x) => {
        expect(x.detail.elem).toBeTruthy();
        expect(x.detail.activeCell.row).toEqual(1);
        expect(x.detail.activeCell.cell).toEqual(0);
        expect(x.detail.activeCell.node).toBeTruthy();
      });

      dataGrid.addEventListener('activecellchange', mockCallback);
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      dataGrid.dispatchEvent(event);

      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('fires activecellchange event on click', () => {
      const mockCallback = jest.fn();

      dataGrid.addEventListener('activecellchange', mockCallback);
      dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[3]
        .querySelectorAll('.ids-data-grid-cell')[3].click();

      expect(mockCallback.mock.calls.length).toBe(1);
      expect(dataGrid.activeCell.row).toEqual(2);
      expect(dataGrid.activeCell.cell).toEqual(3);
    });
  });

  describe('Theme Tests', () => {
    it('supports setting mode', () => {
      dataGrid.mode = 'dark';
      expect(dataGrid.container.getAttribute('mode')).toEqual('dark');
    });

    it('supports setting version', () => {
      dataGrid.version = 'classic';
      expect(dataGrid.container.getAttribute('version')).toEqual('classic');
    });
  });

  describe('RTL/Language Tests', () => {
    it('supports direction / RTL', () => {
      dataGrid.language = 'ar';
      expect(dataGrid.getAttribute('dir')).toEqual('rtl');
      expect(dataGrid.container.getAttribute('dir')).toEqual('rtl');
      dataGrid.rerender();
      expect(dataGrid.getAttribute('dir')).toEqual('rtl');
      expect(dataGrid.container.getAttribute('dir')).toEqual('rtl');
    });

    it('supports readonly columns / RTL', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[1].classList.contains('readonly')).toBeTruthy();
    });

    it('supports readonly RTL when set from the container', () => {
      container.language = 'ar';
      expect(dataGrid.container.getAttribute('dir')).toEqual('rtl');
      expect(dataGrid.getAttribute('language')).toEqual('ar');

      container.locale = 'de-DE';
      expect(dataGrid.locale.locale.name).toEqual('de-DE');
    });
  });
});
