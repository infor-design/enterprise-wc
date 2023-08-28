import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import treeLargeJSON from '../../../assets/data/tree-large.json';
import '../../ids-layout-flex/ids-layout-flex';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid-virtual-scroll')!;

// Do an ajax request
const url: any = treeLargeJSON;
const columns: IdsDataGridColumn[] = [];
let currentId = 1000;
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
  id: 'rowNumber',
  name: '#',
  formatter: dataGrid.formatters.rowNumber,
  sortable: false,
  readonly: true,
  width: 66
});

columns.push({
  id: 'id',
  name: 'Id',
  field: 'id',
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
  id: 'capacity',
  name: 'Capacity',
  field: 'capacity',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.integer
});
columns.push({
  id: 'available',
  name: 'Available',
  field: 'available',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.date
});
columns.push({
  id: 'comments',
  name: 'Comments',
  field: 'comments',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});

dataGrid.columns = columns;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  dataGrid.data = data.splice(0, 120);
};

setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollend', (e: Event) => {
  const newDataArray : any[] = [];
  for (let counter = 0; counter < 10; counter++) {
    currentId++;
    const newData = {
      id: currentId,
      name: `Crawler-${currentId}`,
      location: 'St. Louis',
      capacity: 44,
      available: '2022-05-08T01:57:17Z',
      comments: 'integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus',
      time: '22:14:42',
      rowExpanded: false,
      children: [
        {
          id: currentId + 0.1,
          name: 'Battery',
          location: 'Lower',
          capacity: 2,
          available: '2022-01-14T02:43:11Z',
          time: '7:20:19',
          rowHidden: true
        }
      ]
    };
    newDataArray.push(newData);
  }
  console.info(`append`, newDataArray);
  dataGrid.appendData(newDataArray);
  console.info(`scrollend`, (<CustomEvent>e).detail);
});