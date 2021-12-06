import { IdsDataGrid } from '../../src/components/ids-data-grid/ids-data-grid';
import { IdsContainer } from '../../src/components/ids-container/ids-container';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');
const container = document.querySelector('ids-container');

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');

  // Do an ajax request
  const xmlhttp = new XMLHttpRequest();
  const url = '/data/companies.json';
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
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'companyName',
    name: 'Company Name',
    field: 'companyName',
    formatter: dataGrid.formatters.hyperlink,
    href: '#'
  });
  columns.push({
    id: 'phone',
    name: 'Phone',
    field: 'phone',
    sortable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    sortable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'customerSince',
    name: 'Since',
    field: 'customerSince',
    sortable: true,
    formatter: dataGrid.formatters.date
  });

  xmlhttp.onreadystatechange = function onreadystatechange() {
    if (this.readyState === 4 && this.status === 200) {
      dataGrid.columns = columns;
      dataGrid.data = JSON.parse(this.responseText);
    }
  };

  // Execute the request
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}());
