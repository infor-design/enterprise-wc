import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import companyJSON from '../../../assets/data/companies.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-list')!;

(async function init() {
  // Do an ajax request
  const url: any = companyJSON;
  const columns: IdsDataGridColumn[] = [];

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
    resizable: true,
    width: 65
  });
  columns.push({
    id: 'companyName',
    name: 'Company Name',
    field: 'companyName',
    formatter: dataGrid.formatters.hyperlink,
    resizable: true,
    href: '#'
  });
  columns.push({
    id: 'phone',
    name: 'Phone',
    field: 'phone',
    sortable: true,
    resizable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    sortable: true,
    resizable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'customerSince',
    name: 'Since',
    field: 'customerSince',
    sortable: true,
    formatter: dataGrid.formatters.date
  });

  dataGrid.columns = columns;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };

  await setData();
}());
