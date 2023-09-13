import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';
import IdsButton from '../../ids-button/ids-button';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-save-settings-manual')!;

(async function init() {
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
    id: 'id',
    name: 'ID',
    field: 'id',
    width: 80,
    resizable: true,
    reorderable: true,
    sortable: true,
    formatter: dataGrid.formatters.text,
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text,
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
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.integer,
    filterType: dataGrid.filters.integer
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });

  // Do an ajax request
  const url: any = productsJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
    dataGrid.pageTotal = data.length;
  };
  setData();

  /* ==========================================================
   * Some unique-id to save/restore
   */
  const uniqueId = 'datagrid123-some-uniqueid';
  const uniqueKey = (key: string) => `${uniqueId}-${key}`;

  const isValid = (v: any) => typeof v !== 'undefined' && v !== null;
  const setItem = (key: string, value: any) => localStorage.setItem(uniqueKey(key), value);
  const getItem = (key: string) => localStorage.getItem(uniqueKey(key));

  /* ==========================================================
   * Save user settings
   */
  dataGrid.addEventListener('settingschanged', (e: any) => {
    console.info('Settings Changed:', e.detail.settings);

    // Save each in local storage (or use your own DB)
    const s = e.detail.settings;
    if (isValid(s.activePage)) setItem('activePage', s.activePage);
    if (isValid(s.columns)) setItem('columns', JSON.stringify(s.columns));
    if (isValid(s.filter)) setItem('filter', JSON.stringify(s.filter));
    if (isValid(s.pageSize)) setItem('pageSize', s.pageSize);
    if (isValid(s.rowHeight)) setItem('rowHeight', s.rowHeight);
    if (isValid(s.sortOrder)) setItem('sortOrder', JSON.stringify(s.sortOrder));
  });

  /* ==========================================================
   * Restore user settings
   */
  const btnRestore = document.querySelector<IdsButton>('#btn-restore')!;
  btnRestore?.addEventListener('click', () => {
    const s = {
      activePage: getItem('activePage'),
      columns: getItem('columns'),
      filter: getItem('filter'),
      pageSize: getItem('pageSize'),
      rowHeight: getItem('rowHeight'),
      sortOrder: getItem('sortOrder')
    };

    // Active page
    if (isValid(s.activePage)) {
      dataGrid.restoreSetting(dataGrid.settings.activePage, Number(s.activePage));
    }

    // Columns
    if (isValid(s.columns)) {
      dataGrid.restoreSetting(dataGrid.settings.columns, JSON.parse(s.columns || ''));
    }

    // Filter
    if (isValid(s.filter)) {
      dataGrid.restoreSetting(dataGrid.settings.filter, JSON.parse(s.filter || ''));
    }

    // Page size
    if (isValid(s.pageSize)) {
      dataGrid.restoreSetting(dataGrid.settings.pageSize, Number(s.pageSize));
    }

    // Row height
    if (isValid(s.rowHeight)) {
      dataGrid.restoreSetting(dataGrid.settings.rowHeight, (s.rowHeight || ''));
    }

    // Sort order
    if (isValid(s.sortOrder)) {
      dataGrid.restoreSetting(dataGrid.settings.sortOrder, JSON.parse(s.sortOrder || ''));
    }

    /*
    // Restore all settings
    const allSettings: any = {};
    Object.entries(s).forEach(([key, value]) => {
      if (isValid(value)) {
        let val;
        switch (key) {
          case 'activePage': val = Number(value); break;
          case 'columns': val = JSON.parse(value || ''); break;
          case 'filter': val = JSON.parse(value || ''); break;
          case 'pageSize': val = Number(value); break;
          case 'rowHeight': val = value; break;
          case 'sortOrder': val = JSON.parse(value || ''); break;
          default: break;
        }
        allSettings[key] = val;
      }
    });
    dataGrid.restoreAllSettings(allSettings);
    */
  });

  /* ==========================================================
   * Clear settings from local storage
   */
  const btnClearSettings = document.querySelector<IdsPopupMenu>('#btn-clear-settings')!;
  btnClearSettings?.addEventListener('click', () => {
    // Local storage keys
    const lsKeys = {
      activePage: uniqueKey('activePage'),
      columns: uniqueKey('columns'),
      filter: uniqueKey('filter'),
      pageSize: uniqueKey('pageSize'),
      rowHeight: uniqueKey('rowHeight'),
      sortOrder: uniqueKey('sortOrder')
    };

    // Clear all settings
    dataGrid.clearAllSettings(lsKeys);

    /*
    // Clear each individual setting
    dataGrid.clearSetting(dataGrid.settings.activePage, lsKeys.activePage);
    dataGrid.clearSetting(dataGrid.settings.columns, lsKeys.columns);
    dataGrid.clearSetting(dataGrid.settings.filter, lsKeys.filter);
    dataGrid.clearSetting(dataGrid.settings.pageSize, lsKeys.pageSize);
    dataGrid.clearSetting(dataGrid.settings.rowHeight, lsKeys.rowHeight);
    dataGrid.clearSetting(dataGrid.settings.sortOrder, lsKeys.sortOrder);
    */
  });

  /* ==========================================================
   * Change row height with popup menu
   */
  const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;
  rowHeightMenu?.addEventListener('selected', (e: Event) => {
    dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
  });
}());
