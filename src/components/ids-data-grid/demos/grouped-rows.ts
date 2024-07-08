import accountsJSON from '../../../assets/data/accounts.json';

import '../ids-data-grid';

import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import type IdsText from '../../ids-text/ids-text';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
const gridMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;
const toolbarTitleText = document.querySelector<IdsText>('#title-text')!;

// Change row height with popup menu
gridMenu?.addEventListener('selected', async (e: Event) => {
  const action = (e.target as IdsMenuItem).value;
  if (action === 'columns') await dataGrid.showPersonalizationDialog();
  else dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
});

(async function init() {
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    formatter: dataGrid.formatters.text,
    width: 80,
    sortable: true,
    hideable: false,
    resizable: true
  });
  columns.push({
    id: 'name',
    name: 'Name',
    field: 'name',
    formatter: dataGrid.formatters.text,
    sortable: true,
    resizable: true
  });
  columns.push({
    id: 'hidden-column',
    name: 'Hidden Column',
    field: '',
    formatter: dataGrid.formatters.text,
    hidden: true,
    sortable: true,
    resizable: true
  });
  columns.push({
    id: 'type',
    name: 'Type',
    field: 'type',
    formatter: dataGrid.formatters.text,
    sortable: true,
    resizable: true
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    formatter: dataGrid.formatters.hyperlink,
    sortable: true,
    resizable: true
  });
  columns.push({
    id: 'firstname',
    name: 'First Name',
    field: 'firstname',
    formatter: dataGrid.formatters.text,
    sortable: true,
    resizable: true
  });
  columns.push({
    id: 'lastname',
    name: 'Last Name',
    field: 'lastname',
    formatter: dataGrid.formatters.text,
    sortable: true,
    resizable: true
  });
  columns.push({
    id: 'phone',
    name: 'Phone',
    field: 'phone',
    formatter: dataGrid.formatters.text,
    sortable: true,
    hideable: false,
    resizable: true
  });
  columns.push({
    id: 'purchases',
    name: 'Unit Price',
    field: 'purchases',
    formatter: dataGrid.formatters.decimal,
    sortable: true,
    resizable: true
  });

  // Do an ajax request
  const url: any = accountsJSON;
  const response = await fetch(url);
  const data = await response.json();

  dataGrid.groupable = {
    fields: ['type']
  };
  dataGrid.pagination = 'client-side';
  dataGrid.columns = columns;
  dataGrid.data = data;
  dataGrid.pageTotal = data.length;

  dataGrid.pager.addEventListener('pagenumberchange', (e: Event) => {
    console.info(`client-side page-number # ${(<CustomEvent>e).detail.value}`);
  });

  dataGrid.pager.addEventListener('pagesizechange', (e: Event) => {
    console.info(`client-side page-size # ${(<CustomEvent>e).detail.value}`);
  });

  // Updates the toolbar title with number of currently-selected items
  const updateTitleText = () => {
    const selectedRows = dataGrid.selectedRowsAcrossPages;
    toolbarTitleText.textContent = selectedRows.length ? `${selectedRows.length} Result${selectedRows.length > 1 ? 's' : ''}` : '';
  };
  dataGrid.addEventListener('rowselected', updateTitleText);
  dataGrid.addEventListener('rowdeselected', updateTitleText);

  console.info('Loading Time:', window.performance.now());
}());
