// Supporting components
import '../ids-accordion';
import '../../ids-lookup/ids-lookup';
import '../../ids-data-grid/ids-data-grid';

import booksJSON from '../../../assets/data/books.json';
import IdsGlobal from '../../ids-global/ids-global';

// Example for populating the DataGrid
const lookup: Element | any = document.querySelector('#lookup-1');

(async function init() {
  // Set a Locale and wait for it to load
  await IdsGlobal.getLocale().setLocale('en-US');

  // Do an ajax request
  const url: any = booksJSON;
  const columns = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: lookup.dataGrid.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: lookup.dataGrid.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    formatter: lookup.dataGrid.formatters.text,
    filterType: lookup.dataGrid.filters.text
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    formatter: lookup.dataGrid.formatters.text,
    filterType: lookup.dataGrid.filters.text
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    formatter: lookup.dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' },
    filterType: lookup.dataGrid.filters.decimal
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    formatter: lookup.dataGrid.formatters.text,
    filterType: lookup.dataGrid.filters.integer
  });

  lookup.columns = columns;

  const addEventListeners = () => {
    lookup.addEventListener('change', () => {
      console.info(`Value Changed`, lookup.dataGrid.selectedRows, lookup.value);
    });

    lookup.addEventListener('rowselected', (e: CustomEvent) => {
      console.info(`Row Selected`, e.detail);
    });

    lookup.addEventListener('beforerowdeselected', (e: CustomEvent) => {
      console.info(`Before Row DeSelected`, e.detail);
    });

    lookup.addEventListener('rowdeselected', (e: CustomEvent) => {
      console.info(`Row DeSelected`, e.detail);
    });

    lookup.addEventListener('selectionchanged', (e: CustomEvent) => {
      console.info(`Selection Changed`, e.detail);
    });
  };

  lookup.dataGridSettings = {
    rowSelection: 'multiple'
  };

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();

    lookup.data = data;
  };

  await setData();
  addEventListeners();
}());
