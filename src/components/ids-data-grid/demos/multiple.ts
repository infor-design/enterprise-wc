import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';
import productsJSON from '../../../assets/data/products.json';

const dataGrid1 = document.querySelector<IdsDataGrid>('#data-grid-1')!;

(async function init() {
  // Do an ajax request
  const url: any = booksJSON;
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid1.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid1.formatters.rowNumber,
    sortable: false,
    resizable: true,
    reorderable: true,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.date
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.time
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.decimal,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'transactionCurrency',
    name: 'Transaction Currency',
    field: 'transactionCurrency',
    formatter: dataGrid1.formatters.text,
  });
  columns.push({
    id: 'integer',
    name: 'Price (Int)',
    field: 'price',
    formatter: dataGrid1.formatters.integer,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    formatter: dataGrid1.formatters.hyperlink,
    href: '#'
  });
  columns.push({
    id: 'postHistory',
    name: 'Post History',
    field: 'postHistory',
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'active',
    name: 'Active',
    field: 'active',
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'convention',
    name: 'Convention',
    field: 'convention',
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'methodSwitch',
    name: 'Method Switch',
    field: 'methodSwitch',
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'trackDeprecationHistory',
    name: 'Track Deprecation History',
    field: 'trackDeprecationHistory',
    formatter: dataGrid1.formatters.text
  });
  columns.push({
    id: 'useForEmployee',
    name: 'Use For Employee',
    field: 'useForEmployee',
    formatter: dataGrid1.formatters.password
  });
  columns.push({
    id: 'deprecationHistory',
    name: 'Deprecation History',
    field: 'deprecationHistory',
    formatter: dataGrid1.formatters.text
  });

  dataGrid1.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid1.data = data;
  };

  setData();
}());

const dataGrid2 = document.querySelector<IdsDataGrid>('#data-grid-2')!;

(async function init() {
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid2.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    width: 80,
    resizable: true,
    reorderable: true,
    sortable: true,
    formatter: dataGrid2.formatters.text
  });
  columns.push({
    id: 'customTooltip',
    name: 'Custom Tooltip',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid2.formatters.hyperlink,
    formatOptions: { group: '' },
    width: 88,
    tooltip: 'This is a product Id',
    headerTooltip: 'This is the product Id header'
  });
  columns.push({
    id: 'color',
    name: 'Tooltip Callback',
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid2.formatters.text,
    width: 105
  });
  columns.push({
    id: 'productId',
    name: 'Tooltip async Callback',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid2.formatters.integer,
    formatOptions: { group: '' }
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid2.formatters.text,
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    sortable: false,
    resizable: true,
    reorderable: true,
    align: 'center',
    formatter: dataGrid2.formatters.text,
    headerIcon: 'info',
    headerIconTooltip: 'This is header icon',
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid2.formatters.integer
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid2.formatters.text
  });

  // Do an ajax request
  const url: any = productsJSON;

  dataGrid2.columns = columns;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid2.data = data.slice(0, 10);
  };
  setData();
}());
