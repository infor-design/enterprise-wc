import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import buildingsJSON from '../../../assets/data/tree-buildings.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

if (dataGrid) {
  // Change row height with popup menu
  rowHeightMenu?.addEventListener('selected', (e: Event) => {
    const value = (e.target as IdsMenuItem).value;
    if (value !== 'is-list') {
      dataGrid.rowHeight = value as string;
    }
    if (value === 'is-list') {
      dataGrid.listStyle = !dataGrid.listStyle;
    }
  });

  rowHeightMenu?.addEventListener('deselected', (e: Event) => {
    const value = (e.target as IdsMenuItem).value;
    if (value === 'is-list') {
      dataGrid.listStyle = !dataGrid.listStyle;
    }
  });

  (async function init() {
    // Do an ajax request
    const url: any = buildingsJSON;
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
      id: 'id',
      name: 'Id',
      field: 'id',
      sortable: true,
      resizable: true,
      editor: {
        type: 'tree',
        inline: true,
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          validate: 'required'
        }
      },
      formatter: dataGrid.formatters.tree,
      click: (info: any) => {
        console.info('Tree Expander Clicked', info);
      },
      width: 220,
      frozen: 'left',
      align: 'right'
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
      id: 'name',
      name: 'Name',
      field: 'name',
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
      dataGrid.data = data;
    };

    await setData();

    // Event Handlers
    dataGrid.addEventListener('rowexpanded', (e: Event) => {
      console.info(`Row Expanded`, (<CustomEvent>e).detail);
    });

    dataGrid.addEventListener('rowcollapsed', (e: Event) => {
      console.info(`Row Collapsed`, (<CustomEvent>e).detail);
    });

    dataGrid.addEventListener('beforecelledit', (e: Event) => {
      console.info(`Edit Started`, (<CustomEvent>e).detail);
    });

    dataGrid.addEventListener('celledit', (e: Event) => {
      console.info(`Currently Editing`, (<CustomEvent>e).detail);
    });

    dataGrid.addEventListener('endcelledit', (e: Event) => {
      console.info(`Edit Ended`, (<CustomEvent>e).detail);
    });

    dataGrid.addEventListener('cancelcelledit', (e: Event) => {
      console.info(`Edit Was Cancelled`, (<CustomEvent>e).detail);
    });
  }());
}
