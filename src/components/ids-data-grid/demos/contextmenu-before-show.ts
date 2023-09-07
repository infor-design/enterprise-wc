import '../ids-data-grid';
import booksJSON from '../../../assets/data/books.json';
import menuContentsJSON from '../../../assets/data/menu-contents.json';
import IdsGlobal from '../../ids-global/ids-global';

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#data-grid-contextmenu-before-show');
const locale = IdsGlobal.getLocale();

if (dataGrid) {
  (async function init() {
    // Set Locale and wait for it to load
    await locale?.setLocale('en-US');

    // Do an ajax request
    const url: any = booksJSON;
    const menuUrl: any = menuContentsJSON;

    // Header contextmenu data
    const headerMenuData = {
      id: 'grid-header-menu',
      contents: [{
        id: 'actions-group',
        items: [
          { id: 'actions-split', value: 'actions-split', text: 'Split' },
          { id: 'actions-sort', value: 'actions-sort', text: 'Sort' },
          { id: 'actions-hide', value: 'actions-hide', text: 'Hide' }
        ]
      }],
    };

    const newMenuData = {
      id: 'grid-new-menu',
      contents: [{
        id: 'actions-group',
        items: [
          { id: 'actions-new1', value: 'actions-new-1', text: 'Some New menu item 1' },
          { id: 'actions-new2', value: 'actions-new-2', text: 'Some New menu item 2' },
          { id: 'actions-new3', value: 'actions-new-3', text: 'Some New menu item 3' }
        ]
      }],
    };

    // Set up columns
    const columns: any[] = [];
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
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: dataGrid.formatters.text
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
      href: '#'
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

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const menuRes = await fetch(menuUrl);

      const data = await res.json();
      const menuData = await menuRes.json();

      dataGrid.data = data;
      dataGrid.menuData = menuData;
      dataGrid.headerMenuData = headerMenuData;

      dataGrid.addEventListener('beforemenushow', (e: any) => {
        console.info('Before contextmenu show', e.detail);
        const thisData = e.detail?.data;
        if (thisData?.type === dataGrid.contextmenuTypes.BODY_CELL) {
          const rowIndex = thisData.rowIndex ?? 0;
          const newData = ((rowIndex % 2) === 0) ? newMenuData : menuData;
          dataGrid.menuData = newData;
        }
      });

      dataGrid.addEventListener('menushow', (e: any) => {
        console.info('After contextmenu show', e.detail);
      });

      dataGrid.addEventListener('menuselected', (e: any) => {
        console.info('contextmenu item selected', e.detail);

        // simulate a column change after menuselection
        dataGrid.columns = [...columns];
      });
    };

    setData();
  }());
}
