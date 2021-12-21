import { IdsDataGrid } from '../../src/components/ids-data-grid';
import { IdsContainer } from '../../src/components/ids-container';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');
const container = document.querySelector('ids-container');

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');
  const columns = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    formatter: dataGrid.formatters.date
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    formatter: dataGrid.formatters.time
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'transactionCurrency',
    name: 'Transaction Currency',
    field: 'transactionCurrency',
    formatter: dataGrid.formatters.text,
  });
  columns.push({
    id: 'integer',
    name: 'Price (Int)',
    field: 'price',
    formatter: dataGrid.formatters.integer,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    formatter: dataGrid.formatters.hyperlink,
    href: '#'
  });
  columns.push({
    id: 'postHistory',
    name: 'Post History',
    field: 'postHistory',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'active',
    name: 'Active',
    field: 'active',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'convention',
    name: 'Convention',
    field: 'convention',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'methodSwitch',
    name: 'Method Switch',
    field: 'methodSwitch',
    formatter: dataGrid.formatters.text,
    filterType: 'select'
  });
  columns.push({
    id: 'trackDeprecationHistory',
    name: 'Track Deprecation History',
    field: 'trackDeprecationHistory',
    formatter: dataGrid.formatters.dropdown
  });
  columns.push({
    id: 'useForEmployee',
    name: 'Use For Employee',
    field: 'useForEmployee',
    formatter: dataGrid.formatters.password
  });
  columns.push({
    id: 'deprecationHistory',
    name: 'Deprecation History',
    field: 'deprecationHistory',
    formatter: dataGrid.formatters.text
  });

  // Do an ajax request
  const url = '/data/books.json';
  const response = await fetch(url);
  const data = await response.json();
  dataGrid.columns = columns;
  dataGrid.data = data;
  console.info('Loading Time:', window.performance.now());
  console.info('Page Memory:', window.performance.memory);

  // fetch(url).then(async (res) => {
  //   const json = await res.json();
  //   console.log('json is ', json);
  //   dataGrid.columns = columns;
  //   dataGrid.data = json;
  //   console.info('Loading Time:', window.performance.now());
  //   console.info('Page Memory:', window.performance.memory);
  // });

  // const xmlhttp = new XMLHttpRequest();
  // xmlhttp.onreadystatechange = function onreadystatechange() {
  //   if (this.readyState === 4 && this.status === 200) {
  //     dataGrid.columns = columns;
  //     dataGrid.data = JSON.parse(this.responseText);
  //     console.info('Loading Time:', window.performance.now());
  //     console.info('Page Memory:', window.performance.memory);
  //   }
  // };

  // // Execute the request
  // xmlhttp.open('GET', url, true);
  // xmlhttp.send();
}());
