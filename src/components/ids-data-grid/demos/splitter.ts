import '../../ids-container/ids-container';
import '../../ids-header/ids-header';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-splitter/ids-splitter';
import '../../ids-splitter/ids-splitter-pane';
import '../../ids-layout-flex/ids-layout-flex';
import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

document.addEventListener('DOMContentLoaded', async () => {});

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-editable')!;
const dataGrid2 = document.querySelector<IdsDataGrid>('#data-grid-editable-2')!;

(async function init() {
  // Do an ajax request
  const url: any = booksJSON;
  const columns: IdsDataGridColumn[] = [];

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
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        validate: 'required',
      }
    },
    readonly(row: number) {
      return row % 2 === 0;
    },
  });

  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterOptions: {
      maxlength: 2,
      uppercase: true
    },
    uppercase: true,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        maxlength: 2,
        uppercase: true
      }
    },
  });

  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.date,
    editor: {
      type: 'datepicker',
      editorSettings: {
        validate: 'required',
        dirtyTracker: true
      }
    }
  });

  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.time,
    editor: {
      type: 'timepicker',
      editorSettings: {
        dirtyTracker: true,
        format: dataGrid.localeAPI?.calendar().timeFormat
      }
    }
  });

  columns.push({
    id: 'transactionCurrency',
    name: 'Transaction Currency',
    field: 'transactionCurrency',
    formatter: dataGrid.formatters.text
  });

  dataGrid.columns = columns;
  dataGrid.idColumn = 'book';
  dataGrid2.columns = columns;
  dataGrid2.idColumn = 'book';

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data.slice(0);
    dataGrid2.data = data.slice(0);
  };

  await setData();
}());
