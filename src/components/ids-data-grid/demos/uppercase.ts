import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-uppercase')!;
const data: any[] = [];
const columns: IdsDataGridColumn[] = [];

// Set Data
data.push({
  id: 1,
  productId: 2142201,
  productName: 'Compressor',
  activity: 'Paint',
  quantity: 1,
  price: 210.99,
  status: 'OK',
  orderDate: '',
  portable: false,
  action: 'ac',
  description: 'Compressor comes with with air tool kit'
});
data.push({
  id: 2,
  productId: 2241202,
  productName: 'Different Compressor',
  activity: 'Inspect and Repair',
  quantity: 2,
  price: 210.991,
  status: '',
  orderDate: '2021-04-23T18:25:43.511Z',
  portable: false,
  action: 'oh',
  description: 'The kit has an air blow gun that can be used for cleaning'
});
data.push({
  id: 3,
  productId: 2342203,
  productName: 'Portable Compressor',
  activity: '',
  portable: true,
  quantity: null,
  price: 120.992,
  status: null,
  orderDate: '2021-02-23T18:25:43.511Z',
  action: 'ac'
});
data.push({
  id: 4,
  productId: 2445204,
  productName: 'Another Compressor',
  activity: 'Assemble Paint',
  portable: true,
  quantity: 3,
  price: null,
  status: 'OK',
  orderDate: '2021-12-23T18:25:43.511Z',
  action: 'ac',
  description: 'Compressor comes with with air tool kit'
});
data.push({
  id: 5,
  productId: 2542205,
  productName: 'De Wallt Compressor',
  activity: 'Inspect and Repair',
  portable: false,
  quantity: 4,
  price: 210.99,
  status: 'OK',
  orderDate: '2021-12-12T18:25:43.511Z',
  action: 'oh'
});
data.push({
  id: 6,
  productId: 2642205,
  productName: 'Air Compressors',
  activity: 'Inspect and Repair',
  portable: false,
  quantity: 41,
  price: 120.99,
  status: 'OK',
  orderDate: '2020-12-12T18:25:43.511Z',
  action: 'oh'
});
data.push({
  id: 7,
  productId: 2642206,
  productName: 'Some Compressor',
  activity: 'inspect and Repair',
  portable: true,
  quantity: 41,
  price: 123.99,
  status: 'OK',
  orderDate: '2019-12-12T18:25:43.511Z',
  action: 'oh'
});

// Set Columns
columns.push({
  id: 'id',
  name: 'Row Id',
  field: 'id',
  sortable: true,
  resizable: true,
  readonly: true,
  width: 100,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.integer,
  editor: {
    type: 'input',
    editorSettings: {
      autoselect: true,
      dirtyTracker: true,
      validate: 'required'
    }
  }
});
columns.push({
  id: 'productName',
  name: 'Product Name',
  field: 'productName',
  resizable: true,
  uppercase: true,
  formatter: dataGrid.formatters.hyperlink,
  filterType: dataGrid.filters.text,
  editor: {
    type: 'input',
    editorSettings: {
      autoselect: true,
      dirtyTracker: true
    }
  },
});
columns.push({
  id: 'activity',
  name: 'Activity',
  field: 'activity',
  resizable: true,
  uppercase: true,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text,
  editor: {
    type: 'input',
    editorSettings: {
      autoselect: true,
      dirtyTracker: true
    }
  },
});
columns.push({
  id: 'action',
  name: 'Action',
  field: 'action',
  resizable: true,
  uppercase: true,
  formatter: dataGrid.formatters.dropdown,
  filterType: dataGrid.filters.dropdown,
  filterConditions: [
    { value: 'ac', label: 'ac' },
    { value: 'oh', label: 'oh' }
  ],
  editor: {
    type: 'dropdown',
    editorSettings: {
      dirtyTracker: true,
      validate: 'required',
      options: [
        {
          id: '',
          label: '',
          value: ''
        },
        {
          id: 'ac',
          label: 'ac',
          value: 'ac'
        },
        {
          id: 'oh',
          label: 'oh',
          value: 'oh'
        }
      ]
    }
  }
});
columns.push({
  id: 'price',
  name: 'Price',
  field: 'price',
  resizable: true,
  formatter: dataGrid.formatters.decimal,
  filterType: dataGrid.filters.decimal,
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
      }
    }
  },
});
columns.push({
  id: 'orderDate',
  name: 'Order Date',
  field: 'orderDate',
  resizable: true,
  formatter: dataGrid.formatters.date,
  filterType: dataGrid.filters.date,
  editor: {
    type: 'datepicker',
    editorSettings: {
      validate: 'required',
      dirtyTracker: true
    }
  }
});

dataGrid.columns = columns;
dataGrid.data = data;
