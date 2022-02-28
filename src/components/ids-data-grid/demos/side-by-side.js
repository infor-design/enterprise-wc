/* eslint-disable no-undef */
import IdsDataGrid from '../ids-data-grid';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');

// Do an ajax request
const url = '/data/books.json';
let columns = [];

// Set up columns
columns.push({
  id: 'selectionCheckbox',
  sortable: false,
  resizable: false,
  formatter: dataGrid.formatters.text,
  align: 'center',
  width: 20
});
columns.push({
  id: 'book',
  name: 'Book',
  field: 'book',
  formatter: dataGrid.formatters.text,
  sortable: true,
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
  id: 'bookCurrency',
  name: 'Book Currency',
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
  formatter: dataGrid.formatters.dropdown
});
columns.push({
  id: 'deprecationHistory',
  name: 'Deprecation History',
  field: 'deprecationHistory',
  formatter: dataGrid.formatters.dropdown
});

dataGrid.columns = columns;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  dataGrid.data = data;
};

setData();

// Initialize the 4.x
$('body').initialize();
$('body').one('initialized', () => {
  columns = [];
  const data = [
    {
      id: '1',
      productId: 'T100',
      sku: '#9000001-237',
      productName: 'Compressor',
      activity: 'Assemble Paint',
      quantity: 1,
      inStock: true,
      price: 210.99,
      percent: 0.10,
      status: 'OK',
      orderDate: '2018-08-07T06:00:00.000Z',
      action: 'Action'
    },
    {
      id: '2',
      productId: '200',
      inStock: true,
      sku: '#9000001-236',
      productName: 'Different Compressor',
      activity: 'Inspect and Repair',
      quantity: 2,
      price: 210.99,
      percent: 0.10,
      status: '',
      orderDate: '2018-06-07T06:00:00.000Z',
      action: 'On Hold'
    },
    {
      id: '3',
      productId: '300',
      inStock: true,
      sku: '#9000001-235',
      productName: 'Compressor',
      activity: 'Inspect and Repair',
      quantity: 1,
      price: 120.99,
      percent: 0.10,
      status: null,
      phone: '(888) 888-8888',
      orderDate: '2018-12-05T06:00:00.000Z',
      action: 'Action'
    },
    {
      id: '4',
      productId: 'Z400',
      sku: '#9000001-234',
      productName: 'Another Compressor',
      activity: 'Assemble Paint',
      quantity: 3,
      price: 210.99,
      percent: 0.20,
      status: 'OK',
      orderDate: '2018-04-05T06:00:00.000Z',
      action: 'Action'
    },
    {
      id: '5',
      productId: '2542205',
      sku: '#9000001-233',
      productName: 'I Love Compressors',
      activity: 'Inspect and Repair',
      quantity: 4,
      price: 210.99,
      percent: 0.30,
      status: 'OK',
      orderDate: '2018-02-02T06:00:00.000Z',
      action: 'On Hold'
    },
    {
      id: '5',
      productId: '2642205',
      sku: '#9000001-232',
      productName: 'Air Compressors',
      activity: 'Inspect and Repair',
      quantity: 41,
      price: 120.99,
      percent: 0.40,
      status: 'OK',
      phone: '(888) 888-8888',
      orderDate: '2018-09-09T06:00:00.000Z',
      action: 'On Hold'
    },
    {
      id: '6',
      productId: '2642206',
      sku: '#9000001-231',
      productName: 'Some Compressor',
      activity: 'inspect and Repair',
      quantity: 41,
      price: 123.99,
      percent: 0.10,
      status: 'OK',
      phone: '(888) 888-8888',
      orderDate: '2018-08-08T06:00:00.000Z',
      action: 'On Hold'
    }
  ];
    // Define Columns for the Grid.
  columns.push({
    id: 'productId', hideable: false, name: 'Id', field: 'productId', formatter: Soho.Formatters.Text
  });
  columns.push({
    id: 'productName', name: 'Product Name', field: 'productName', formatter: Soho.Formatters.Hyperlink,
  });
  columns.push({ id: 'activity', name: 'Activity', field: 'activity' });
  columns.push({
    id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden'
  });
  columns.push({
    id: 'price',
    align: 'right',
    name: 'Actual Price',
    field: 'price',
    formatter: Soho.Formatters.Decimal,
    numberFormat: {
      minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$'
    }
  });
  columns.push({
    id: 'percent', align: 'right', name: 'Actual %', field: 'percent', formatter: Soho.Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' }
  });
  columns.push({
    id: 'orderDate', name: 'Order Date', field: 'orderDate', formatter: Soho.Formatters.Date, dateFormat: 'M/d/yyyy'
  });
  columns.push({
    id: 'phone', name: 'Phone', field: 'phone', formatter: Soho.Formatters.Text
  });

  // Init and get the api for the grid
  $('#datagrid').datagrid({
    columns,
    dataset: data,
    saveColumns: false
  });
});
