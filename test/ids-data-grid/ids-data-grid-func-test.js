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
      width: 65
    });
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      formatter: formatters.text
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
    const errors = jest.spyOn(global.console, 'error');
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
});
