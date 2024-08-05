import '../../ids-tabs/ids-tabs';

import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

const dataGrid1 = document.querySelector<IdsDataGrid>('#data-grid-1')!;

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
    formatter: dataGrid1.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid1.formatters.rowNumber,
    sortable: false,
    resizable: true,
    reorderable: true,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.text,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true
      },
      editorValidation: {
        check: (input) => input.value.length < 256,
        message: 'Maximum of 255 characters',
        id: 'maxchars'
      }
    }
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid1.formatters.text,
    editor: {
      type: 'dropdown',
      editorSettings: {
        dirtyTracker: true,
        options: [
          {
            id: 'CORE',
            label: 'CORE',
            value: 'CORE'
          },
          {
            id: '2025',
            label: '2025',
            value: '2025'
          },
          {
            id: '2026',
            label: '2026',
            value: '2026'
          }
        ]
      }
    }
  });

  dataGrid1.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid1.data = data;
  };

  await setData();

  document.querySelector('#add-row')?.addEventListener('click', () => {
    const newRow = {
      name: '',
    };
    dataGrid1.addRow(newRow);
    dataGrid1.setActiveCell(0, dataGrid1.data.length - 1);
    dataGrid1.editFirstCell();
  });

  document.querySelector('#delete-row')?.addEventListener('click', () => {
    dataGrid1.selectedRows.reverse().forEach((row: any) => {
      dataGrid1.removeRow(row.index);
    });
  });
}());
