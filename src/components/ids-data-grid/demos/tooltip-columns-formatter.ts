import '../ids-data-grid';
import '../../ids-container/ids-container';

import css from '../../../assets/css/ids-data-grid/tooltip-columns-formatter.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#data-grid-tooltip-columns-formatter');
const container: any = document.querySelector('ids-container');

(async function init() {
  // Define column formatter callback.
  const customFormatter = (rowData: Record<string, unknown>, columnData: Record<string, any>, rowIndex: number) => {
    const value: any = rowData[columnData.field];
    return !value.title ? '' : `
      <div class="custom-card" part="custom-card">
        <h3 part="custom-card-h3">${value.title}</h3>
        <dl>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Location:</dt>
            <dd part="custom-card-dd">${value.location}</dd>
          </div>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Phone:</dt>
            <dd part="custom-card-dd">${value.phone}</dd>
          </div>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Quantity:</dt>
            <dd part="custom-card-dd">${value.quantity}</dd>
          </div>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Price:</dt>
            <dd part="custom-card-dd">${value.price}</dd>
          </div>
        </dl>
        <ids-toolbar id="my-toolbar${rowIndex}">
          <ids-toolbar-section type="buttonset" align="end">
            <ids-button class="btn-order" role="button" no-padding
              data-value="Order, for RowIndex: ${rowIndex}, Column: ${columnData.field}">
              <span slot="text">Order</span>
            </ids-button>
            <ids-button class="btn-save" role="button" no-padding
              data-value="Save, for RowIndex: ${rowIndex}, Column: ${columnData.field}">
              <span slot="text">Save</span>
            </ids-button>
            <ids-button class="btn-delete" role="button" no-padding
              data-value="Delete, for RowIndex: ${rowIndex}, Column: ${columnData.field}">
              <span slot="text">Delete</span>
            </ids-button>
            <ids-button class="btn-update" role="button" no-padding
              data-value="Update, for RowIndex: ${rowIndex}, Column: ${columnData.field}">
              <span slot="text">Update</span>
            </ids-button>
          </ids-toolbar-section>
        </ids-toolbar>
      </div>
    `;
  };

  // Define tooltip callback.
  const tooltipFormatter = (args: any) => {
    const { rowData, columnData } = args;
    const value: any = rowData[columnData.field];
    return !value.title ? '' : `
      <div class="custom-card" part="custom-card">
        <h3 part="custom-card-h3">${value.title}</h3>
        <dl>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Location:</dt>
            <dd part="custom-card-dd">${value.location}</dd>
          </div>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Phone:</dt>
            <dd part="custom-card-dd">${value.phone}</dd>
          </div>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Quantity:</dt>
            <dd part="custom-card-dd">${value.quantity}</dd>
          </div>
          <div part="custom-card-dl-div">
            <dt part="custom-card-dt">Price:</dt>
            <dd part="custom-card-dd">${value.price}</dd>
          </div>
        </dl>
      </div>
    `;
  };

  // Set Locale and wait for it to load
  await container.setLocale('en-US');

  // Define data and columns
  const data: any[] = [];
  const columns: any[] = [];

  // Some Sample Data
  data.push({
    id: 1,
    productId: 'T100',
    product: {
      title: 'Compressor (mx500)',
      location: 'Acme Inc',
      phone: '(888) 888-8889',
      quantity: '100',
      price: '$500'
    },
    misc: 'This is a basic cell'
  });

  data.push({
    id: 2,
    productId: 'C100',
    product: {
      title: 'Compressor (m3000)',
      location: 'Assembly Inc',
      phone: '(888) 888-8888',
      quantity: '15',
      price: '$800'
    },
    misc: 'This is another basic cell'
  });

  data.push({
    id: 3,
    productId: 'D100',
    product: {
      title: 'Compressor (d3000)',
      location: '<img src="a" onerror="alert(0)"/>',
      phone: '(888) 888-8888',
      quantity: '15',
      price: '$800'
    },
    misc: 'This is another basic cell'
  });

  // Define columns
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
    name: 'Id',
    field: 'productId',
    width: 100,
    formatter: dataGrid.formatters.text
  });

  columns.push({
    id: 'product',
    name: 'Product',
    field: 'product',
    width: '50%',
    formatter: customFormatter,
    tooltip: tooltipFormatter
  });

  columns.push({
    id: 'misc',
    name: 'Misc',
    field: 'misc',
    formatter: dataGrid.formatters.text
  });

  // Set columns and data
  dataGrid.columns = columns;
  dataGrid.data = data;

  // Clicled column buttons
  const btnSelector = '.btn-order, .btn-save, .btn-delete, .btn-update';
  const columnButtons: HTMLElement[] = dataGrid.container.querySelectorAll(btnSelector);
  columnButtons.forEach((btn: HTMLElement) => {
    btn?.addEventListener('click', (e: any) => {
      const value = e?.target?.getAttribute('data-value');
      console.info('Clicked!', value);
    });
  });
}());
