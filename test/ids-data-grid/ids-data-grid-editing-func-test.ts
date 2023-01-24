/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

describe('IdsDataGrid Component Editing Tests', () => {
  let dataGrid: any;
  let container: any;

  const formatters: any = new IdsDataGridFormatters();
  const columns = () => {
    const cols = [];
    // Set up columns
    cols.push({
      id: 'selectionCheckbox',
      sortable: false,
      resizable: false,
      formatter: formatters.selectionCheckbox,
      align: 'center',
      width: 20
    });
    cols.push({
      id: 'rowNumber',
      name: '#',
      formatter: formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 65,
      headerIcon: 'info',
      headerIconTooltip: 'This is header icon'
    });
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: formatters.text,
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          validate: 'required'
        }
      },
      readonly(row: number) {
        return row % 2 === 0;
      },
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
      formatter: formatters.date,
      editor: {
        type: 'datepicker',
        editorSettings: {
          dirtyTracker: true
        }
      }
    });
    cols.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: formatters.time,
      editor: {
        type: 'timepicker',
        editorSettings: {
          dirtyTracker: true
        }
      }
    });
    cols.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      formatter: formatters.decimal,
      formatOptions: { locale: 'en-US' },
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          mask: 'number',
          maskOptions: {
            allowDecimal: true,
            integerLimit: 3,
            decimalLimit: 2
          },
          validate: 'required'
        }
      }
    });
    cols.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.dropdown,
      editor: {
        type: 'dropdown',
        editorSettings: {
          dirtyTracker: true,
          options: [
            {
              id: '',
              label: '',
              value: ''
            },
            {
              id: 'usd',
              label: 'USD',
              value: 'usd'
            },
            {
              id: 'eur',
              label: 'EUR',
              value: 'eur'
            },
            {
              id: 'yen',
              label: 'YEN',
              value: 'yen'
            }
          ]
        }
      }
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
      formatter: dataGrid.formatters.checkbox,
      align: 'center',
      editor: {
        type: 'checkbox',
        editorSettings: {
          dirtyTracker: false,
        }
      },
    });
    cols.push({
      id: 'inStock',
      name: 'In Stock',
      field: 'inStock',
      formatter: formatters.checkbox
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
      formatter: formatters.text
    });
    cols.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: formatters.password
    });
    cols.push({
      id: 'custom',
      name: 'Custom',
      field: 'price',
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `Custom: ${rowData[columnData.field] || '0'}`;
        return `<span class="text-ellipsis">${value}</span>`;
      },
      editor: {
        type: 'input'
      },
    });
    return cols;
  };

  beforeEach(async () => {
    // Mock the CSSStyleSheet in adoptedStyleSheets
    (window as any).CSSStyleSheet = function CSSStyleSheet() { //eslint-disable-line
      return { cssRules: [], replaceSync: () => '', insertRule: () => '' };
    };
    (window.StyleSheet as any).insertRule = () => '';

    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = deepClone(dataset);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  const cellQuery = (col: number, row: number) => dataGrid.container.querySelector(`.ids-data-grid-row:nth-child(${row}) > .ids-data-grid-cell:nth-child(${col})`);
  const activateCell = (col: number, row: number) => {
    dataGrid.editable = true;
    const activeCell = dataGrid.setActiveCell(col, row);
    activeCell.node.focus();
    const enterKey = new KeyboardEvent('keydown', { key: 'Enter' });
    dataGrid.dispatchEvent(enterKey);
  };

  it('supports a dropdown editor', () => {
    const dropdownCell = cellQuery(8, 2);
    activateCell(7, 1);
    expect(dropdownCell.classList.contains('is-editing')).toBeTruthy();
    expect(dropdownCell.querySelector('ids-dropdown')).not.toBeNull();
  });

  it('can change cell value using dropdown editor', () => {
    const dropdownCell = cellQuery(8, 2);
    const arrowDownKey = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const enterKey = new KeyboardEvent('keydown', { key: 'Enter' });
    activateCell(7, 1);

    const dropdown = dropdownCell.querySelector('ids-dropdown');
    dropdown.focus();
    dropdown.dispatchEvent(arrowDownKey); // navigates list box options
    dropdown.dispatchEvent(enterKey); // selects option
    expect(dropdown.value).toEqual('yen');

    dropdownCell.endCellEdit();
    expect(dropdownCell.classList.contains('is-editing')).toBeFalsy();
  });

  it('supports a datepicker editor', () => {
    const activeCell = dataGrid.setActiveCell(4, 0);
    const gridCell = activeCell.node;

    // activate cell editing
    dataGrid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    const datePicker = gridCell.querySelector('ids-date-picker');
    expect(datePicker).toBeDefined();

    // set new value
    datePicker.value = '4/30/2023';
    gridCell.endCellEdit();

    expect(gridCell.textContent).toEqual('4/30/2023');
  });

  it('supports a timepicker editor', () => {
    const activeCell = dataGrid.setActiveCell(5, 0);
    const gridCell = activeCell.node;

    // activate cell editing
    dataGrid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    const timePicker = gridCell.querySelector('ids-time-picker');
    expect(timePicker).toBeDefined();
    expect(timePicker.value).toEqual('2:25 PM');

    // set new value
    timePicker.value = '3:45 AM';
    gridCell.endCellEdit();

    expect(gridCell.textContent).toEqual('3:45 AM');
  });
});
