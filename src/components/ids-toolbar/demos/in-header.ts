import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';
import '../../ids-data-grid/ids-data-grid';
import '../../ids-header/ids-header';
import '../../ids-app-menu/ids-app-menu';
import '../../ids-tabs/ids-tabs';
import '../../ids-text/ids-text';

import avatarPlaceholder from '../../../assets/images/avatar-placeholder.jpg';

const avatarImg: any = window.document.getElementById('avatar');
avatarImg.src = avatarPlaceholder;

const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;
const dataGrid2 = document.querySelector<IdsDataGrid>('#data-grid-2')!;
const columns: IdsDataGridColumn[] = [];

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer: any = document.querySelector('#app-menu');
  const appMenuTriggerBtn: any = document.querySelector('#app-menu-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;

  appMenuDrawer.addEventListener('selected', (e: any) => {
    console.info(`Header "${(e.target as any).textContent.trim()}" was selected.`);
  });

  if (dataGrid) {
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
      readonly: true,
      width: 65
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: dataGrid.formatters.date
    });
    columns.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: dataGrid.formatters.time
    });
    columns.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      formatter: dataGrid.formatters.decimal,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'transactionCurrency',
      name: 'Transaction Currency',
      field: 'transactionCurrency',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
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
      href: '#'
    });
    columns.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'convention',
      name: 'Convention',
      field: 'convention',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'methodSwitch',
      name: 'Method Switch',
      field: 'methodSwitch',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: dataGrid.formatters.dropdown
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
    (async function init() {
      // Do an ajax request
      const url: any = booksJSON;

      dataGrid.columns = columns;
      dataGrid2.columns = columns;
      const setData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        dataGrid.data = data;
        dataGrid2.data = data;
      };

      setData();
    }());
  }
});
