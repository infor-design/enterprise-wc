/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';

describe('IdsDataGridCell Component', () => {
  let dataGrid: any;
  let container: any;
  let cell: any;

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
      formatter: formatters.text
    });
    cols.push({
      id: 'custom',
      name: 'Custom',
      field: 'price',
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `Custom: ${rowData[columnData.field] || '0'}`;
        return `<span class="text-ellipsis">${value}</span>`;
      }
    });
    return cols;
  };

  beforeEach(async () => {
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    cell = dataGrid.shadowRoot.querySelector('ids-data-grid-cell:nth-child(3)');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    expect(cell.innerHTML).toMatchSnapshot();
    expect(cell.renderCell());
    expect(cell.innerHTML).toMatchSnapshot();
  });

  it('renders rowNumber', () => {
    const cell1 = dataGrid.shadowRoot.querySelector('ids-data-grid-cell:nth-child(2)');
    expect(cell1.innerHTML).toBe(`<span class="text-ellipsis">1</span>`);
    expect(cell1.renderCell());
    expect(cell1.innerHTML).toBe(`<span class="text-ellipsis">1</span>`);
  });

  it('renders custom formatters', () => {
    const cell1 = dataGrid.shadowRoot.querySelector('ids-data-grid-cell:nth-child(4)');
    expect(cell1.innerHTML).toBe(`<span class="text-ellipsis">Custom: 12.99</span>`);
    expect(cell1.renderCell());
    expect(cell1.innerHTML).toBe(`<span class="text-ellipsis">Custom: 12.99</span>`);
  });
});
