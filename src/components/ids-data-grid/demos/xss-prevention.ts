/* eslint-disable object-curly-newline */
import '../ids-data-grid';

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#data-grid-1');
const container: any = document.querySelector('ids-container');

if (dataGrid) {
  (async function init() {
    // Set Locale and wait for it to load
    await container?.setLocale('en-US');

    const data: any = [];
    const columns = [];

    data.push({ id: 2, productId: 2241202, productName: 'Different Compressor', activity: '<script>alert()</script>', quantity: 2, price: 210.991, status: '', orderDate: new Date(2016, 2, 15, 0, 30, 36), portable: false, action: 'oh', description: 'The kit has an air blow gun that can be used for cleaning' });
    data.push({ id: 3, productId: 2342203, productName: 'Portable Compressor', activity: '&lt;script&gt;alert()&lt;script&gt;', portable: true, quantity: 1, price: 120.992, status: null, orderDate: new Date(2014, 6, 3), action: 'ac' });
    data.push({ id: 4, productId: 2445204, productName: 'Another Compressor', activity: '&lt;svg/onload=alert(1)&gt;', portable: true, quantity: 3, price: null, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'ac', description: 'Compressor comes with with air tool kit' });
    data.push({ id: 5, productId: 2542205, productName: 'De Wallt Compressor', activity: 'Inspect and Repair', portable: false, quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'oh' });
    data.push({ id: 6, productId: 2642205, productName: 'Air Compressors', activity: 'Inspect and Repair', portable: false, quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 7, productId: 2642206, productName: 'Some Compressor', activity: 'inspect and Repair', portable: true, quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 8, productId: 2642207, productName: 'Img Compressor', activity: 'script<img onerror=\'alert(0)\'>', portable: true, quantity: 12, price: 12.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'oh' });
    data.push({ id: 2, productId: 2142201, productName: 'Compressor', activity: '<svg/onload=alert(1)>', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2016, 2, 15, 12, 30, 36), portable: false, action: 'ac' });

    columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, formatter: dataGrid.formatters.selectionCheckbox, align: 'center' });
    columns.push({ id: 'productName', name: '<Product Name>/>', sortable: false, field: 'productName', formatter: dataGrid.formatters.text });
    columns.push({ id: 'test1', name: '<script>alert(3)</script>', field: 'activity', formatter: dataGrid.formatters.hyperlink });
    columns.push({ id: 'test2', name: '<script>alert(4)</script>', field: 'activity' });
    columns.push({ id: 'test3', name: '<img onerror=alert("kocicka")>test', field: 'quantity', align: 'right' });

    dataGrid.columns = columns;
    dataGrid.data = data;
  }());
}
