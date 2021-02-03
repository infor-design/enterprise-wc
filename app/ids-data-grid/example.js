// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');

// Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = '/api/books';
const columns = [];

// Set up columns
columns.push({
  id: 'selectionCheckbox',
  sortable: false,
  resizable: false,
  formatter: dataGrid.formatters.text,
  align: 'center',
  width: 20
});
columns.push({
  id: 'book',
  name: 'Book',
  field: 'book',
  formatter: dataGrid.formatters.text,
  sortable: true,
  width: 65
});
columns.push({
  id: 'description',
  name: 'Description',
  field: 'description',
  sortable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'ledger',
  name: 'Ledger',
  field: 'ledger',
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'bookCurrency',
  name: 'Book Currency',
  field: 'bookCurrency',
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'transactionCurrency',
  name: 'Transaction Currency',
  field: 'transactionCurrency',
  formatter: dataGrid.formatters.text,
});
columns.push({
  id: 'postHistory',
  name: 'Post History',
  field: 'postHistory',
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'active',
  name: 'Active',
  field: 'active',
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'convention',
  name: 'Convention',
  field: 'convention',
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'methodSwitch',
  name: 'Method Switch',
  field: 'methodSwitch',
  formatter: dataGrid.formatters.text,
  filterType: 'select'
});
columns.push({
  id: 'trackDeprecationHistory',
  name: 'Track Deprecation History',
  field: 'trackDeprecationHistory',
  formatter: dataGrid.formatters.dropdown
});
columns.push({
  id: 'useForEmployee',
  name: 'Use For Employee',
  field: 'useForEmployee',
  formatter: dataGrid.formatters.dropdown
});
columns.push({
  id: 'deprecationHistory',
  name: 'Deprecation History',
  field: 'deprecationHistory',
  formatter: dataGrid.formatters.dropdown
});

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    dataGrid.data = JSON.parse(this.responseText);
    dataGrid.columns = columns;
  }
};

// Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
