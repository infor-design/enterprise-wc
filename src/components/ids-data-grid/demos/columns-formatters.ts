import IdsDataGrid from '../ids-data-grid';
import booksJSON from '../../../assets/data/books.json';
import css from '../../../assets/css/ids-data-grid/custom-link.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-formatters')!;

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    const url: any = booksJSON;
    const columns = [];

    // Set up columns
    columns.push({
      id: 'selectionCheckbox',
      name: 'selection',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.selectionCheckbox,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      align: 'center'
    });
    columns.push({
      id: 'selectionRadio',
      name: 'selection',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.selectionRadio,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      align: 'center'
    });
    columns.push({
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 56
    });
    columns.push({
      id: 'drilldown',
      name: '',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.button,
      icon: 'drilldown',
      type: 'icon',
      align: 'center',
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Drilldown clicked', info);
      },
      text: 'Drill Down',
      width: 56
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Link clicked', info);
      },
      href: '#'
    });
    columns.push({
      id: 'ledger',
      name: 'Password',
      field: 'ledger',
      sortable: true,
      formatter: dataGrid.formatters.password
    });
    columns.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      sortable: true,
      formatter: dataGrid.formatters.date,
      width: 200
    });
    columns.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      sortable: true,
      formatter: dataGrid.formatters.time,
      width: 200
    });
    columns.push({
      id: 'price',
      name: 'Price (decimal)',
      field: 'price',
      align: 'right',
      sortable: true,
      formatter: dataGrid.formatters.decimal,
      formatOptions: { locale: 'en-US' },
      width: 200
    });
    columns.push({
      id: 'price',
      name: 'Price (integer)',
      field: 'price',
      align: 'right',
      sortable: true,
      formatter: dataGrid.formatters.integer,
      formatOptions: { locale: 'en-US' },
      width: 200
    });
    columns.push({
      id: 'inStock',
      name: 'In Stock',
      field: 'inStock',
      align: 'center',
      sortable: true,
      formatter: dataGrid.formatters.checkbox,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101
    });
    columns.push({
      id: 'badge',
      name: 'Badge',
      field: 'price',
      color: 'info',
      sortable: true,
      formatter: dataGrid.formatters.badge,
      width: 75
    });
    columns.push({
      id: 'more',
      name: '',
      sortable: false,
      resizable: true,
      formatter: dataGrid.formatters.button,
      icon: 'more',
      type: 'icon',
      align: 'center',
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Actions clicked', info);
      },
      text: 'Actions',
      width: 56
    });
    columns.push({
      id: 'custom',
      name: 'Custom',
      field: 'price',
      sortable: false,
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `Custom: ${rowData[columnData.field] || '0'}`;
        return `<span class="text-ellipsis">${value}</span>`;
      },
      width: 180
    });
    columns.push({
      id: 'custom',
      name: 'Custom Link',
      field: 'location',
      sortable: false,
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `${rowData[columnData.field] || ''}`;
        return `<a part="custom-link" href="#" class="text-ellipsis">${value}</a>`;
      },
      click: (info: any) => {
        console.info('Custom Link Clicked', info);
      },
      width: 180
    });
    columns.push({
      id: 'spacer',
      name: '',
      field: '',
      sortable: false
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data;
    };

    setData();
  }());
}
