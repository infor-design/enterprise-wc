import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productsJSON from '../../../assets/data/products.json';
import IdsGlobal from '../../ids-global/ids-global';
import '../../ids-layout-flex/ids-layout-flex';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-frozen');
const locale = IdsGlobal.getLocale();

if (dataGrid) {
  (async function init() {
    // Set Locale and wait for it to load
    await locale?.setLocale('en-US');

    // Do an ajax request
    const url: any = productsJSON.slice(0, 50);
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
      name: 'ID',
      field: 'id',
      formatter: dataGrid.formatters.text,
      frozen: 'left',
      sortable: true,
      resizable: true,
      width: 90,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'color',
      name: 'Color',
      field: 'color',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'inStock',
      name: 'In Stock',
      field: 'inStock',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'productId',
      name: 'Product Id',
      field: 'productId',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'productName',
      name: 'Product Name',
      field: 'productName',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'unitPrice',
      name: 'Unit Price',
      field: 'unitPrice',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'units',
      name: 'Units',
      field: 'units',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'unitPrice',
      name: 'GB Unit Price',
      field: 'unitPrice',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'units',
      name: 'GB Units',
      field: 'units',
      align: 'center',
      formatter: dataGrid.formatters.text,
      sortable: true,
      resizable: true,
      filterType: dataGrid.filters.text
    });
    columns.push({
      id: 'more',
      name: 'More',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.button,
      icon: 'more',
      type: 'icon',
      align: 'center',
      click: (info: any) => {
        console.info('Actions clicked', info);
      },
      text: '',
      width: 65,
      frozen: 'right'
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data.slice(0, 100);
    };

    setData();
  }());
}
