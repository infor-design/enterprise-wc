import IdsLookup from '../../ids-lookup/ids-lookup';
import booksJSON from '../../../assets/data/books.json';
import IdsFilterField from '../ids-filter-field';

const initLookup = async () => {
  // Init lookup
  const lookup = document.querySelector('ids-lookup') as IdsLookup;
  const url: any = booksJSON;
  const columns = [];

  if (!lookup) return;

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: lookup.dataGrid?.formatters?.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: lookup.dataGrid?.formatters?.rowNumber,
    sortable: false,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    formatter: lookup.dataGrid?.formatters?.text,
    filterType: lookup.dataGrid?.filters?.text
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    formatter: lookup.dataGrid?.formatters?.text,
    filterType: lookup.dataGrid?.filters?.text
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    formatter: lookup.dataGrid?.formatters?.decimal,
    formatOptions: { locale: 'en-US' },
    filterType: lookup.dataGrid?.filters?.decimal
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    formatter: lookup.dataGrid?.formatters?.text,
    filterType: lookup.dataGrid?.filters?.integer
  });

  lookup.columns = columns;

  const addEventListeners = () => {
    lookup.addEventListener('change', () => {
      console.info(`Value Changed`, lookup.dataGrid?.selectedRows, lookup.value);
    });

    lookup.addEventListener('rowselected(', ((e: CustomEvent) => {
      console.info(`Row Selected`, e.detail);
    }) as EventListener);

    lookup.addEventListener('beforerowdeselected', ((e: CustomEvent) => {
      console.info(`Before Row DeSelected`, e.detail);
    }) as EventListener);

    lookup.addEventListener('rowdeselected(', ((e: CustomEvent) => {
      console.info(`Row DeSelected`, e.detail);
    }) as EventListener);

    lookup.addEventListener('selectionchanged(', ((e: CustomEvent) => {
      console.info(`Selection Changed`, e.detail);
    }) as EventListener);
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
};

document.addEventListener('DOMContentLoaded', async () => {
  const filterFields = document.querySelectorAll<IdsFilterField>('ids-filter-field');
  filterFields.forEach((filterField) => {
    filterField?.addEventListener('change', console.info);
  });

  await initLookup();
});
