import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import treeLargeJSON from '../../../assets/data/tree-large-children.json';
import '../../ids-layout-flex/ids-layout-flex';
import '../../ids-input/ids-input';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid-virtual-scroll')!;
const btnExpandAll = document.querySelector('#btn-expand-all');
const btnCollapseAll = document.querySelector('#btn-collapse-all');
const scrollToInput = document.querySelector('#scroll-to-input');

let isExpanded = false;

btnExpandAll?.addEventListener('click', () => {
  dataGrid?.expandAll();
  isExpanded = true;
});

btnCollapseAll?.addEventListener('click', () => {
  dataGrid?.collapseAll();
  isExpanded = false;
});

scrollToInput?.addEventListener('change', ((evt: CustomEvent) => {
  const rowIndex = Number(evt.detail.value);
  if (!Number.isNaN(rowIndex)) dataGrid.scrollRowIntoView(rowIndex);
}) as EventListener);

// Do an ajax request
const url: any = treeLargeJSON;
const columns: IdsDataGridColumn[] = [];

// Set up columns
columns.push({
  id: 'selectionCheckbox',
  name: 'selection',
  sortable: false,
  resizable: false,
  formatter: dataGrid.formatters.selectionCheckbox,
  align: 'center',
  frozen: 'left'
});

columns.push({
  id: 'rowNumber',
  name: 'Row #',
  formatter: dataGrid.formatters.rowNumber,
  sortable: false,
  readonly: true,
  width: 66
});

columns.push({
  id: 'name',
  name: 'Name',
  field: 'name',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.tree,
  click: (info: any) => {
    console.info('Tree Expander Clicked', info);
  },
  width: 220,
  frozen: 'left'
});

columns.push({
  id: 'email',
  name: 'Email',
  field: 'email',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
});

columns.push({
  id: 'company',
  name: 'Company',
  field: 'company',
  sortable: true,
  resizable: true,
  width: 200,
  formatter: dataGrid.formatters.text,
  editor: {
    type: 'input',
    inline: true,
    editorSettings: {
      autoselect: true,
      dirtyTracker: true,
      validate: 'required'
    }
  },
});

columns.push({
  id: 'age',
  name: 'Age',
  field: 'age',
  sortable: true,
  resizable: true,
  width: 100,
  formatter: dataGrid.formatters.text,
});

columns.push({
  id: 'phone',
  name: 'Phone',
  field: 'phone',
  sortable: true,
  resizable: true,
  width: 200,
  formatter: dataGrid.formatters.text,
});

columns.push({
  id: 'address',
  name: 'Address',
  field: 'address',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});

dataGrid.columns = columns;

const fetchData = async () => {
  const res = await fetch(url);
  const data = await res.json();

  return data;
};

const setData = async () => {
  const data = await fetchData();
  dataGrid.data = data.slice(0, 50);
};
await setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollend', async (e: any) => {
  console.info(`scrollend`, (<CustomEvent>e).detail);
  const lastRowLoaded = e.detail.value;
  const data = await fetchData();
  const rowsToAdd = data
    .slice(lastRowLoaded + 1, lastRowLoaded + 10)
    .map((row: any) => {
      row.rowExpanded = isExpanded;
      return row;
    });

  if (rowsToAdd.length) {
    // simulate fetch delay
    setTimeout(() => {
      dataGrid.appendData(rowsToAdd);
      console.info('Appending Rows:', rowsToAdd.length);
    }, 100);
  } else {
    console.info('---END OF DATA---');
  }
});
