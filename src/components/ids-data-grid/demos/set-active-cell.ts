import type IdsDataGrid from '../ids-data-grid';
import type IdsButton from '../../ids-button/ids-button';
import type IdsCheckbox from '../../ids-checkbox/ids-checkbox';
import type IdsDropdown from '../../ids-dropdown/ids-dropdown';

import '../ids-data-grid';
import '../../ids-button/ids-button';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-list-box/ids-list-box';
import '../../ids-list-box/ids-list-box-option';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-toolbar/ids-toolbar-section';

import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

if (dataGrid) {
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
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
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
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.date
    });
    columns.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.time
    });
    columns.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.decimal,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'transactionCurrency',
      name: 'Transaction Currency',
      field: 'transactionCurrency',
      formatter: dataGrid.formatters.text,
    });
    columns.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: dataGrid.formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      href: '#',
      click: () => { console.info('Link was clicked'); }
    });
    columns.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'convention',
      name: 'Convention',
      field: 'convention',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'methodSwitch',
      name: 'Method Switch',
      field: 'methodSwitch',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: dataGrid.formatters.password
    });
    columns.push({
      id: 'deprecationHistory',
      name: 'Deprecation History',
      field: 'deprecationHistory',
      formatter: dataGrid.formatters.text
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data;
    };

    await setData();

    // ============================================
    // Configure the selection controls

    const useRowNavCheck = document.querySelector<IdsCheckbox>('#toggle-row-navigation')!;
    useRowNavCheck.addEventListener('change', (e: any) => {
      console.info(`Set 'rowNavigation' prop to ${e.detail.checked}`);
      dataGrid.rowNavigation = e.detail.checked;
    });

    const columnsDropdown = document.querySelector<IdsDropdown>('#target-column')!;
    columnsDropdown.beforeShow = async function columnsBeforeShow() {
      const ret: any[] = [];
      columns.forEach((col, i) => {
        ret.push({
          value: `${i}`,
          label: `${i} (${col.name})`
        });
      });
      return ret;
    };

    const rowsDropdown = document.querySelector<IdsDropdown>('#target-row')!;
    rowsDropdown.beforeShow = async function columnsBeforeShow() {
      const ret: any[] = [];
      dataGrid.data.forEach((row, i) => {
        ret.push({
          value: `${i}`,
          label: `${i}`
        });
      });
      return ret;
    };

    // When submit button is clicked, cell is set to active
    const submitBtn = document.querySelector<IdsButton>('#use-set-active-cell')!;
    submitBtn.addEventListener('click', () => {
      const colsValue = Number(columnsDropdown.value) || 0;
      const rowsValue = Number(rowsDropdown.value) || 0;
      dataGrid.setActiveCell(colsValue, rowsValue);
      console.info(`Cell at position '${colsValue}, ${rowsValue}' was activated`);
    });
  }());
}
