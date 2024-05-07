import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productsJSON from '../../../assets/data/products.json';
import treeLargeJSON from '../../../assets/data/tree-large.json';
import css from '../../../assets/css/ids-data-grid/auto-fit.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

const url: any = productsJSON;
const columns1: IdsDataGridColumn[] = [];
const dataGrid1 = document.querySelector<IdsDataGrid>('#data-grid-1')!;

const button = document.querySelector('#button-1')!;

const lists: IdsDataGrid[] = [];
lists.push(dataGrid1);

(async function init() {
  // Set up columns
  columns1.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid1.formatters.selectionCheckbox,
    align: 'center'
  });
  columns1.push({
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid1.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 66
  });
  columns1.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    formatter: dataGrid1.formatters.text,
    width: 80,
    sortable: true
  });
  columns1.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    formatter: dataGrid1.formatters.text,
    sortable: true
  });
  columns1.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    formatter: dataGrid1.formatters.text,
    filterType: dataGrid1.filters.dropdown,
    filterConditions: [
      { value: 'not-filtered', label: ' ' },
      { value: 'True', label: 'True' },
      { value: 'False', label: 'False' },
      { value: 'True', label: 'true' },
      { value: 'False', label: 'false' },
    ]
  });
  columns1.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    formatter: dataGrid1.formatters.text,
    sortable: true
  });
  columns1.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    formatter: dataGrid1.formatters.text,
    sortable: true
  });
  columns1.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    formatter: dataGrid1.formatters.text,
    sortable: true
  });
  columns1.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    formatter: dataGrid1.formatters.text,
    sortable: true
  });

  dataGrid1.columns = columns1;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid1.data = data;
  };

  setData();
}());

const dataGrid2 = document.querySelector<IdsDataGrid>('#data-grid-2')!;

(async function init() {
  // Do an ajax request
  const url2: any = treeLargeJSON;
  const columns2: IdsDataGridColumn[] = [];

  // Set up columns
  columns2.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid2.formatters.selectionCheckbox,
    align: 'center',
    frozen: 'left'
  });
  columns2.push({
    id: 'name',
    name: 'Name',
    field: 'name',
    sortable: true,
    resizable: true,
    width: 220,
    frozen: 'left'
  });
  columns2.push({
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid2.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 66
  });

  columns2.push({
    id: 'id',
    name: 'Id',
    field: 'id',
    sortable: true,
    resizable: true,
    formatter: dataGrid2.formatters.text
  });
  columns2.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    sortable: true,
    resizable: true,
    formatter: dataGrid2.formatters.text
  });
  columns2.push({
    id: 'capacity',
    name: 'Capacity',
    field: 'capacity',
    sortable: true,
    resizable: true,
    formatter: dataGrid2.formatters.integer
  });
  columns2.push({
    id: 'available',
    name: 'Available',
    field: 'available',
    sortable: true,
    resizable: true,
    formatter: dataGrid2.formatters.date
  });
  columns2.push({
    id: 'comments',
    name: 'Comments',
    field: 'comments',
    sortable: true,
    resizable: true,
    formatter: dataGrid2.formatters.text
  });

  dataGrid2.columns = columns2;

  const setData = async () => {
    const res = await fetch(url2);
    const data = await res.json();
    dataGrid2.data = data;
  };

  await setData();
  button?.addEventListener('click', async () => {
    await setData();
  });

  dataGrid1.addEventListener('selected', (e: any) => {
    console.info('selected', e.detail);
  });
}());
