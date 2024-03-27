// Supporting components
import '../ids-lookup';
import '../../ids-data-grid/ids-data-grid';

import productsJSON from '../../../assets/data/products-100.json';
import type IdsLookup from '../ids-lookup';

const lookup: IdsLookup | null = document.querySelector('ids-lookup');

(async function init() {
  // Do an ajax request
  const url: any = productsJSON;
  const columns = [];

  // Set up columns
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: lookup?.dataGrid?.filters.integer,
    formatter: lookup?.dataGrid?.formatters.text
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: lookup?.dataGrid?.formatters.text,
    filterType: lookup?.dataGrid?.filters.text,
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
    reorderable: true,
    align: 'center',
    formatter: lookup?.dataGrid?.formatters.text,
    filterType: lookup?.dataGrid?.filters.checkbox
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: lookup?.dataGrid?.formatters.integer,
    filterType: lookup?.dataGrid?.filters.integer
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: lookup?.dataGrid?.formatters.text,
    filterType: lookup?.dataGrid?.filters.text
  });

  lookup!.columns = columns;
  lookup!.data = [];
  lookup!.dataGrid!.loadingIndicator.start();
  lookup!.dataGrid!.suppressEmptyMessage = true;
  lookup!.dataGridSettings = {
    rowSelection: 'single'
  };

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();

    lookup!.data = data;
    lookup!.dataGrid!.loadingIndicator.stop();
    lookup!.dataGrid!.suppressEmptyMessage = false;
  };

  const addEventListeners = () => {
    lookup?.addEventListener('change', () => {
      console.info(`Value Changed`, lookup?.dataGrid?.selectedRows, lookup?.value);
    });

    lookup?.addEventListener('rowselected', (e: any) => {
      console.info(`Row Selected`, e.detail);
    });

    lookup?.addEventListener('beforerowdeselected', (e: any) => {
      console.info(`Before Row DeSelected`, e.detail);
    });

    lookup?.addEventListener('rowdeselected', (e: any) => {
      console.info(`Row DeSelected`, e.detail);
    });

    lookup?.addEventListener('selectionchanged', (e: any) => {
      console.info(`Selection Changed`, e.detail);
    });

    lookup?.modal?.addEventListener('show', async () => {
      await setData();
    });
  };

  addEventListeners();
}());
