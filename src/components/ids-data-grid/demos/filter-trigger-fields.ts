import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-filter-triggers')!;

(async function init() {
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
    id: 'integer',
    name: 'Price (Int)',
    field: 'price',
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer,
    formatOptions: { locale: 'en-US' }
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    width: 180,
    filterType: dataGrid.filters.decimal,
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' }
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    width: 180,
    filterType: dataGrid.filters.date,
    formatter: dataGrid.formatters.date
  });
  columns.push({
    id: 'publishDate2',
    name: 'Two Digit Year',
    field: 'publishDate',
    width: 180,
    filterType: dataGrid.filters.date,
    formatter: dataGrid.formatters.date,
    filterOptions: { format: 'dd/MM/yy' },
    formatOptions: { year: '2-digit', month: 'numeric', day: 'numeric' }
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    width: 180,
    filterType: dataGrid.filters.time,
    formatter: dataGrid.formatters.time
  });
  columns.push({
    id: 'active',
    name: 'Active',
    field: 'active',
    align: 'center',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox,
    isChecked: (value: any) => value === 'Yes'
  });
  columns.push({
    id: 'useForEmployee',
    name: 'NotFilteredItem (blank)',
    field: 'useForEmployee',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.dropdown,
    filterConditions: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  });
  columns.push({
    id: 'useForEmployee2',
    name: 'NotFilteredItem (custom)',
    field: 'useForEmployee',
    width: 140,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.dropdown,
    filterConditions: [
      { value: 'not-filtered', label: 'Not Filtered' },
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    href: '#',
    width: 140,
    formatter: dataGrid.formatters.hyperlink,
    filterType: dataGrid.filters.contents,
    filterOptions: {
      notFilteredItem: { value: 'not-filtered', label: 'Not Filtered' }
    }
  });

  // Do an ajax request
  const url: any = booksJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
    dataGrid.pageTotal = data.length;
  };
  setData();
}());
