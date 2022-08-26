import '../ids-data-grid';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#data-grid-formatters');
const container: any = document.querySelector('ids-container');

if (dataGrid) {
  (async function init() {
    // Set Locale and wait for it to load
    await container?.setLocale('en-US');

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
      click: (rowData: any) => {
        console.info('Drilldown clicked', rowData);
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
      click: (rowData: any) => {
        console.info('Link clicked', rowData);
      },
      href: '#'
    });
    columns.push({
      id: 'location',
      name: 'Location (Router Link)',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      routerLink: 'user/bob'
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
      name: 'Price',
      field: 'price',
      align: 'right',
      sortable: true,
      formatter: dataGrid.formatters.decimal,
      formatOptions: { locale: 'en-US' },
      width: 200
    });
    columns.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      align: 'right',
      sortable: true,
      formatter: dataGrid.formatters.integer,
      formatOptions: { locale: 'en-US' },
      width: 200
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
      click: (rowData: any) => {
        console.info('Actions clicked', rowData);
      },
      text: 'Actions',
      width: 56
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
