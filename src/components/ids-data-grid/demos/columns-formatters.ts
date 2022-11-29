import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import { escapeHTML } from '../../../utils/ids-xss-utils/ids-xss-utils';
import booksJSON from '../../../assets/data/books.json';
import css from '../../../assets/css/ids-data-grid/custom-link.css';
import IdsIcon from '../../ids-icon/ids-icon';

// Add custom icon
IdsIcon.addIcon('custom-airplane', [{
  shape: 'path',
  d: 'm7 16.81-1.57-1 .49-9L.83 3.37s-.51-1.51 1-1.56c1 .63 5.09 3.33 5.09 3.33l7.8-4.33 1.62 1-5.87 5.64 3.36 2.14 2.11-.9 1.31.85-.44.72-1.56 1-.39.63-.19 1.82-.45.73-1.31-.86-.07-2.36L9.45 9.1Z',
  transform: 'translate(-0.25 -0.23)'
}]);

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-formatters')!;

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
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      align: 'center'
    });
    columns.push({
      id: 'selectionRadio',
      name: 'selection',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.selectionRadio,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      align: 'center'
    });
    columns.push({
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 56
    });
    columns.push({
      id: 'description',
      name: 'Text',
      field: 'description',
      sortable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'location',
      name: 'Hyperlink',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Link clicked', info);
      },
      href: '#'
    });
    columns.push({
      id: 'ledger',
      name: 'Password',
      field: 'ledger',
      sortable: true,
      formatter: dataGrid.formatters.password
    });
    columns.push({
      id: 'publishDate',
      name: 'Date',
      field: 'publishDate',
      sortable: true,
      formatter: dataGrid.formatters.date,
      width: 200
    });
    columns.push({
      id: 'publishTime',
      name: 'Time',
      field: 'publishDate',
      sortable: true,
      formatter: dataGrid.formatters.time,
      width: 200
    });
    columns.push({
      id: 'price',
      name: 'Decimal',
      field: 'price',
      align: 'right',
      sortable: true,
      formatter: dataGrid.formatters.decimal,
      formatOptions: { locale: 'en-US' },
      width: 200
    });
    columns.push({
      id: 'price',
      name: 'Integer',
      field: 'price',
      align: 'right',
      sortable: true,
      formatter: dataGrid.formatters.integer,
      formatOptions: { locale: 'en-US' },
      width: 200
    });
    columns.push({
      id: 'inStock',
      name: 'Checkbox',
      field: 'inStock',
      align: 'center',
      sortable: true,
      formatter: dataGrid.formatters.checkbox,
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101
    });
    columns.push({
      id: 'badge',
      name: 'Badge',
      field: 'price',
      color: 'info',
      sortable: true,
      formatter: dataGrid.formatters.badge,
      width: 75
    });
    columns.push({
      id: 'more',
      name: 'Actions',
      sortable: false,
      resizable: true,
      formatter: dataGrid.formatters.button,
      icon: 'more',
      type: 'icon',
      align: 'center',
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Actions clicked', info);
      },
      text: 'Actions',
      width: 56
    });
    columns.push({
      id: 'custom',
      name: 'Custom',
      field: 'price',
      sortable: false,
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `Custom: ${rowData[columnData.field] || '0'}`;
        return `<span class="text-ellipsis">${value}</span>`;
      },
      width: 180
    });
    columns.push({
      id: 'custom',
      name: 'Custom Formatter',
      field: 'location',
      sortable: false,
      // formatter: (): string => `<ids-hyperlink href="#" tabindex="-1">Click me!</ids-hyperlink>`,
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `${rowData[columnData.field] || ''}`;
        return `<a part="custom-link" href="#" class="text-ellipsis">${escapeHTML(value)}</a>`;
      },
      click: (info: any) => {
        console.info('Custom Link Clicked', info);
      },
      width: 180
    });
    columns.push({
      id: 'spacer',
      name: '',
      field: '',
      sortable: false
    });
    columns.push({
      id: 'airplane',
      name: '',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.button,
      icon: 'custom-airplane',
      type: 'icon',
      align: 'center',
      disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Airplane clicked', info);
      },
      text: 'Drill Down',
      width: 56
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data;
    };

    setData();
  }());
}
