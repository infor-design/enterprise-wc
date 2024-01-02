// Supporting components
import '../ids-lookup';
import '../../ids-data-grid/ids-data-grid';

import productsJSON from '../../../assets/data/products.json';
import IdsGlobal from '../../ids-global/ids-global';
import type IdsLookup from '../ids-lookup';

// Example for populating the DataGrid
const lookup = document.querySelector<IdsLookup>('#lookup-1')!;

(async function init() {
  // Set a Locale and wait for it to load
  await IdsGlobal.getLocale().setLocale('en-US');

  // Do an ajax request
  const url: any = productsJSON;
  const columns = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: lookup.dataGrid?.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    width: 80,
    resizable: true,
    sortable: true,
    formatter: lookup.dataGrid?.formatters.text,
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    sortable: true,
    resizable: true,
    formatter: lookup.dataGrid?.formatters.text,
    filterType: lookup.dataGrid?.filters.text
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    resizable: true,
    filterType: lookup.dataGrid?.filters.integer,
    formatter: lookup.dataGrid?.formatters.integer
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    sortable: true,
    resizable: true,
    formatter: lookup.dataGrid?.formatters.text,
    filterType: lookup.dataGrid?.filters.text,
    filterConditions: [{
      value: 'contains',
      label: 'Contains',
      icon: 'filter-contains'
    },
    {
      value: 'equals',
      label: 'Equals',
      icon: 'filter-equals',
      selected: true
    }]
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    sortable: false,
    resizable: true,
    align: 'center',
    formatter: lookup.dataGrid?.formatters.text,
    filterType: lookup.dataGrid?.filters.checkbox
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    formatter: lookup.dataGrid?.formatters.integer,
    filterType: lookup.dataGrid?.filters.integer
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    resizable: true,
    align: 'right',
    filterAlign: 'left',
    formatter: lookup.dataGrid?.formatters.text,
    filterType: lookup.dataGrid?.filters.text
  });

  lookup.columns = columns;
  lookup.dataGridSettings = {
    rowSelection: 'multiple'
  };

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    lookup.dataGridSettings = {
      rowSelection: 'multiple'
    };
    lookup.recordCount = data.length;
    lookup.data = data;
  };

  setData();

  // Fake filtering logic
  let searchTerm = '';
  const checkRow = (row: Record<string, unknown>) => !(row.color as string)?.includes(searchTerm);

  lookup.addEventListener('search', async (e: Event) => {
    const res = await fetch(url);
    const data = await res.json();
    lookup.data = data;
    searchTerm = (e as CustomEvent).detail.searchTerm;
    lookup.dataGrid?.datasource.filter(checkRow);
    lookup.dataGrid?.redrawBody();
    lookup.recordCount = String(lookup.dataGrid?.datasource.data.length);
    console.info(`Search term changed`);
  });

  lookup.addEventListener('cleared', async () => {
    const res = await fetch(url);
    const data = await res.json();
    lookup.data = data;
    lookup.recordCount = data.length;
    console.info(`Search term cleared`);
  });
}());
