import '../ids-data-grid';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#data-grid-paging-server-side');
const container: any = document.querySelector('ids-container');

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');
  const columns = [];

  // Set up columns
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

  dataGrid.pagination = 'server-side';
  dataGrid.columns = columns;

  // Do an ajax request
  const url: any = productsJSON;
  const response = await fetch(url);
  const data = await response.json();

  const mockServerSideRequest = async (pageNumber = 1, pageSize = 10) => {
    const last = pageNumber * pageSize;
    const start = last - pageSize;
    return {
      results: data.slice(start, start + pageSize),
      totalResults: data.length,
    };
  };

  const populatePaginatedDatagrid = async (pageNumber = 1, pageSize = 10) => {
    const {
      results,
      totalResults,
    } = await mockServerSideRequest(pageNumber, pageSize);

    dataGrid.data = results;
    dataGrid.pageTotal = totalResults;
  };

  populatePaginatedDatagrid(1, 10); // load data for 1st page

  dataGrid.pager.addEventListener('pagenumberchange', (e: CustomEvent) => {
    console.info(`server-side page-number # ${e.detail.value}`);
    const pageNumber = e.detail.value;
    const pageSize = dataGrid.pageSize;
    populatePaginatedDatagrid(pageNumber, pageSize);
  });

  dataGrid.pager.addEventListener('pagesizechange', (e: CustomEvent) => {
    console.info(`server-side page-size # ${e.detail.value}`);
    const pageSize = e.detail.value;
    const pageNumber = dataGrid.pageNumber;
    populatePaginatedDatagrid(pageNumber, pageSize);
  });

  console.info('Loading Time:', window.performance.now());
  console.info('Page Memory:', (window.performance as any).memory);
}());
