import IdsDataGrid from '../ids-data-grid';
import IdsContainer from '../../ids-container/ids-container';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-filter-books');
const container = document.querySelector('ids-container');

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');
  const columns = [];

  // Set up columns
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    filterType: dataGrid.filters.date,
    formatter: dataGrid.formatters.date
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
    id: 'price',
    name: 'Price',
    field: 'price',
    width: 180,
    filterType: dataGrid.filters.decimal,
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' }
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
    id: 'active',
    name: 'Active',
    field: 'active',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox,
    isChecked: (value) => value === 'Yes'
  });
  columns.push({
    id: 'useForEmployee',
    name: 'NotFilterdItem (blank)',
    field: 'useForEmployee',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.dropdown,
    filterTerms: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' }
    ]
  });
  columns.push({
    id: 'useForEmployee2',
    name: 'NotFilterdItem (custom)',
    field: 'useForEmployee',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.dropdown,
    filterTerms: [
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
    formatter: dataGrid.formatters.hyperlink,
    filterType: dataGrid.filters.contents,
    filterOptions: {
      notFilteredItem: { value: 'not-filtered', label: 'Not Filtered' }
    }
  });

  // Do an ajax request
  const url = booksJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };
  setData();
}());
