import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import { escapeHTML } from '../../../utils/ids-xss-utils/ids-xss-utils';
import booksJSON from '../../../assets/data/books.json';
// import css from '../../../assets/css/ids-data-grid/custom-link.css';
import IdsIcon from '../../ids-icon/ids-icon';

// Add custom icons
import customIconJSON from '../../ids-icon/demos/custom-icon-data.json';

// Load Static Css
// const cssLink = `<link href="${css}" rel="stylesheet">`;
// document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-disabled-rows')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

// Set ssome disabled rows in given data
const setDisabledRows = (data: any) => {
  const disableIndexes = [1, 2, 3, 4];
  return [...data].map((node: any, index: number) => {
    if (disableIndexes.includes(index)) return { ...node, disabled: true };
    return node;
  });
};

// Random index
const randomIndex = (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min;

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
      // disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      align: 'center'
    });
    columns.push({
      id: 'selectionRadio',
      name: 'selection',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.selectionRadio,
      // disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
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
      formatter: dataGrid.formatters.text,
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          mask: 'number',
          maskOptions: {
            allowDecimal: false,
            integerLimit: 3
          },
          validate: 'required'
        }
      }
    });
    columns.push({
      id: 'location',
      name: 'Hyperlink',
      field: 'location',
      resizable: true,
      formatter: dataGrid.formatters.hyperlink,
      // disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Link clicked', info);
      },
      href: '#',
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          validate: 'required'
        }
      }
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
      width: 200,
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
      id: 'count-progress',
      name: 'Progress Bar',
      field: 'count',
      sortable: true,
      formatter: dataGrid.formatters.progress,
      width: 200,
      resizable: true,
      color: '#4caf50',
      text: 'Your Progess'
    });
    columns.push({
      id: 'count-rating',
      name: 'Rating',
      field: 'count',
      align: 'center',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.rating,
      width: 200,
      color: 'azure06',
      max: 5,
    });
    columns.push({
      id: 'count-step-chart',
      name: 'Step Chart',
      field: 'count',
      sortable: true,
      formatter: dataGrid.formatters.stepChart,
      width: 200,
      resizable: true,
      color: 'azure06',
    });
    columns.push({
      id: 'inStock',
      name: 'Checkbox',
      field: 'inStock',
      align: 'center',
      sortable: true,
      formatter: dataGrid.formatters.checkbox,
      // disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101
    });
    columns.push({
      id: 'inStock-favorite',
      name: 'Favorite',
      field: 'inStock',
      align: 'center',
      sortable: true,
      size: 'large',
      formatter: dataGrid.formatters.favorite,
    });
    columns.push({
      id: 'badge',
      name: 'Badge',
      field: 'price',
      align: 'center',
      color: 'info',
      sortable: true,
      resizable: true,
      width: 100,
      formatter: dataGrid.formatters.badge,
    });
    columns.push({
      id: 'category-tag',
      name: 'Tag',
      field: 'category',
      align: 'center',
      sortable: true,
      resizable: true,
      width: 200,
      color: 'success',
      formatter: dataGrid.formatters.tag,
      cssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell' : ''),
    });
    columns.push({
      id: 'category-alert',
      name: 'Alert',
      field: 'category',
      align: 'center',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.alert,
      color: 'info',
      cssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell' : ''),
    });
    columns.push({
      id: 'color',
      name: 'Color',
      field: 'color',
      align: 'center',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.color,
    });
    columns.push({
      id: 'icon',
      name: 'Icon',
      field: 'icon',
      align: 'center',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.icon,
      color: (): string => {
        const colors = ['info', 'error', 'success', 'warning'];
        const idx = randomIndex(0, colors.length - 1);
        return colors[idx];
      },
    });
    columns.push({
      id: 'icon-text',
      name: 'Custom Icon',
      field: 'icon',
      width: 200,
      align: 'left',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.icon,
      icon: 'user-profile',
    });
    columns.push({
      id: 'image',
      name: 'Image',
      field: 'image',
      align: 'center',
      sortable: true,
      resizable: true,
      text: 'Image Alt Text',
      formatter: dataGrid.formatters.image,
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
      // disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
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
        return `<a part="custom-link" href="#" class="text-ellipsis" tabindex="-1">${escapeHTML(value)}</a>`;
      },
      click: (info: any) => {
        console.info('Custom Link Clicked', info);
      },
      width: 180
    });
    columns.push({
      id: 'cargoship',
      name: '',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.button,
      icon: 'custom-cargo-ship',
      type: 'icon',
      align: 'center',
      // disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
      click: (info: any) => {
        console.info('Cargoship clicked', info);
      },
      text: 'Drill Down',
      width: 56
    });
    columns.push({
      id: 'spacer',
      name: '',
      field: '',
      sortable: false
    });

    dataGrid.columns = columns;

    // Change row height with popup menu
    rowHeightMenu?.addEventListener('selected', (e: Event) => {
      dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
    });

    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = setDisabledRows(data);

      const iconUrl: any = customIconJSON;
      const iconRes = await fetch(iconUrl);
      const customIconData = await iconRes.json();
      IdsIcon.customIconData = customIconData;
    };

    setData();
  }());
}
