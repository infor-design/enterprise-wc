import productsJSON from '../../../assets/data/products.json';
import IdsDataGrid from '../ids-data-grid';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-paging-client-side')!;

(async function init() {
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
    id: 'id',
    name: 'ID',
    field: 'id',
    formatter: dataGrid.formatters.text,
    width: 80,
    sortable: true
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    formatter: dataGrid.formatters.text,
    sortable: true
  });

  // Do an ajax request
  const url: any = productsJSON;
  const response = await fetch(url);
  const data = await response.json();
  dataGrid.pagination = 'client-side';
  dataGrid.columns = columns;
  dataGrid.data = data;
  dataGrid.pageTotal = data.length;

  dataGrid.pager.addEventListener('pagenumberchange', (e: Event) => {
    console.info(`client-side page-number # ${(<CustomEvent>e).detail.value}`);
  });

  dataGrid.pager.addEventListener('pagesizechange', (e: Event) => {
    console.info(`client-side page-size # ${(<CustomEvent>e).detail.value}`);
  });

  console.info('Loading Time:', window.performance.now());
}());
