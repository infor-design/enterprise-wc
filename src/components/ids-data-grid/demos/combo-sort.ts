/* eslint-disable object-curly-newline */
import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    const columns: IdsDataGridColumn[] = [];
    const data = [];

    data.push({ id: 4, productId: 2445204, productName: '01AM', activity: 'Inspect and Repair', portable: true, quantity: 3, price: null, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'ac', description: 'Compressor comes with with air tool kit' });
    data.push({ id: 5, productId: 2542205, productName: '01PT', activity: 'Inspect and Repair', portable: false, quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'oh' });
    data.push({ id: 6, productId: 2642205, productName: '02PT', activity: 'Inspect and Repair', portable: false, quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 7, productId: 2642206, productName: '03AM', activity: 'Inspect and Repair', portable: true, quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 2, productId: 2241202, productName: '1', activity: 'Inspect and Repair', quantity: 2, price: 210.991, status: '', orderDate: new Date(2016, 2, 15, 0, 30, 36), portable: false, action: 'oh', description: 'The kit has an air blow gun that can be used for cleaning' });
    data.push({ id: 3, productId: 2342203, productName: '10', activity: 'Inspect and Repair', portable: true, quantity: 1, price: 120.992, status: null, orderDate: new Date(2014, 6, 3), action: 'ac' });
    data.push({ id: 8, productId: 2642207, productName: '05AM', activity: 'Inspect and Repair', portable: true, quantity: 12, price: 12.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 9, productId: 2142201, productName: '05PT', activity: 'Inspect and Repair', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2016, 2, 15, 12, 30, 36), portable: false, action: 'ac' });
    data.push({ id: 10, productId: 2642206, productName: '06AM', activity: 'Inspect and Repair', portable: true, quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 11, productId: 2642206, productName: '07PT', activity: 'Inspect and Repair', portable: true, quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 12, productId: 2642206, productName: '10CD', activity: 'Inspect and Repair', portable: true, quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 13 });
    data.push({ id: 14 });

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
      id: 'productId',
      name: 'Product Id',
      field: 'productId',
      sortable: true,
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'productName',
      name: 'Product Name',
      field: 'productName',
      sortable: true,
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.hyperlink
    });
    columns.push({
      id: 'activity',
      name: 'Activity',
      field: 'activity',
      sortable: true,
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'quantity',
      name: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });

    dataGrid.columns = columns;
    dataGrid.data = data;
  }());
}
