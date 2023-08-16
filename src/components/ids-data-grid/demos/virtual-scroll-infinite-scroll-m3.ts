import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productsJSON from '../../../assets/data/m3-items.json';
import css from '../../../assets/css/ids-data-grid/custom-css.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

// Do an ajax request
const url: any = productsJSON;
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
  readonly: true,
  width: 66
});
columns.push({
  id: 'id',
  name: 'ID',
  field: 'id',
  formatter: dataGrid.formatters.text,
  width: 80,
  sortable: true
});
columns.push({
  id: 'color',
  name: 'Color',
  field: 'color',
  formatter: dataGrid.formatters.text,
  sortable: true
});
columns.push({
  id: 'inStock',
  name: 'In Stock',
  field: 'inStock',
  formatter: dataGrid.formatters.text,
  sortable: true
});
columns.push({
  id: 'productId',
  name: 'Product Id',
  field: 'productId',
  formatter: dataGrid.formatters.text,
  sortable: true
});
columns.push({
  id: 'productName',
  name: 'Product Name',
  field: 'productName',
  formatter: dataGrid.formatters.text,
  sortable: true
});
columns.push({
  id: 'unitPrice',
  name: 'Unit Price',
  field: 'unitPrice',
  formatter: dataGrid.formatters.text,
  sortable: true
});
columns.push({
  id: 'units',
  name: 'Units',
  field: 'units',
  formatter: dataGrid.formatters.text,
  sortable: true
});

dataGrid.columns = [
  {
    id: 'MMITNO',
    field: 'MMITNO',
    name: 'Item number',
    width: 136,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    customLabel: 'Item number    ',
    defaultLabel: 'Item number',
    isCustomColumn: false
  },
  {
    id: 'MMITTY',
    field: 'MMITTY',
    name: 'Itp',
    width: 66,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Itp',
    isCustomColumn: false
  },
  {
    id: 'MMECMA',
    field: 'MMECMA',
    name: 'ECO',
    width: 68,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    editor: {
      type: 'checkbox',
      editorSettings: {
        dirtyTracker: true
      }
    },
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'center',
    defaultLabel: 'ECO',
    isCustomColumn: false
  },
  {
    id: 'ASCK',
    field: 'ASCK',
    name: 'Chk',
    width: 66,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'right',
    defaultLabel: 'Chk',
    isCustomColumn: false
  },
  {
    id: 'MMSTAT',
    field: 'MMSTAT',
    name: 'Sts',
    width: 146,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Sts',
    isCustomColumn: false
  },
  {
    id: 'MMITCL',
    field: 'MMITCL',
    name: 'P grp',
    width: 87,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'P grp',
    isCustomColumn: false
  },
  {
    id: 'MMITGR',
    field: 'MMITGR',
    name: 'Itmgr',
    width: 77,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    customLabel: 'Itmgr   ',
    defaultLabel: 'Itmgr',
    isCustomColumn: false
  },
  {
    id: 'MBAVAL',
    field: 'MBAVAL',
    name: 'Alohb',
    width: 80,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'right',
    defaultLabel: 'Alohb',
    isCustomColumn: false
  },
  {
    id: 'MMUNMS',
    field: 'MMUNMS',
    name: 'U/M',
    width: 68,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'U/M',
    isCustomColumn: false
  },
  {
    id: 'BUAR',
    field: 'BUAR',
    name: 'Business area',
    width: 148,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Business area',
    isCustomColumn: false
  },
  {
    id: 'MMPUPR',
    field: 'MMPUPR',
    name: 'P prc',
    width: 94,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    editor: {
      type: 'input',
      inline: true,
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: 'number',
        maskOptions: {
          allowDecimal: true,
          decimalLimit: 2
        }
      }
    },
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'right',
    defaultLabel: 'P prc',
    isCustomColumn: false
  },
  {
    id: 'MBSLDY',
    field: 'MBSLDY',
    name: 'Sh lf',
    width: 70,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'right',
    defaultLabel: 'Sh lf',
    isCustomColumn: false
  },
  {
    id: 'MMSAPR',
    field: 'MMSAPR',
    name: 'S prc',
    width: 94,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    editor: {
      type: 'input',
      inline: true,
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: 'number',
        maskOptions: {
          allowDecimal: true,
          decimalLimit: 6
        }
      }
    },
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'right',
    defaultLabel: 'S prc',
    isCustomColumn: false
  },
  {
    id: 'MMSUNO',
    field: 'MMSUNO',
    name: 'Suppl',
    width: 80,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Suppl',
    isCustomColumn: false
  },
  {
    id: 'MMRESP',
    field: 'MMRESP',
    name: 'Resp',
    width: 105,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Resp',
    isCustomColumn: false
  },
  {
    id: 'MMATMO',
    field: 'MMATMO',
    name: 'Mod',
    width: 70,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Mod',
    isCustomColumn: false
  },
  {
    id: 'MMACHK',
    field: 'MMACHK',
    name: 'Chk',
    width: 66,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    editor: {
      type: 'checkbox',
      editorSettings: {
        dirtyTracker: true
      }
    },
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'right',
    align: 'center',
    defaultLabel: 'Chk',
    isCustomColumn: false
  },
  {
    id: 'EXRE',
    field: 'EXRE',
    name: 'External reference',
    width: 161,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'External reference',
    isCustomColumn: false
  },
  {
    id: 'FUDS',
    field: 'FUDS',
    name: 'Description',
    width: 453,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Description',
    isCustomColumn: false
  },
  {
    id: 'ITCL',
    field: 'ITCL',
    name: 'Product group',
    width: 145,
    resizable: true,
    maxWidth: 2804,
    filterConditions: [],
    sortable: false,
    reorderable: false,
    headerTooltipCssPart: 'h5tooltip',
    headerAlign: 'left',
    align: 'left',
    defaultLabel: 'Product group',
    isCustomColumn: false
  },
  {
    id: 'h5SpacerColumn',
    name: '',
    field: '',
    reorderable: false,
    sortable: false,
    resizable: true
  }
] as IdsDataGridColumn[];

for (const col of dataGrid.columns) {
  col.formatter = (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
    const value = `${rowData[columnData.field] || ''}`;
    return !value ? '' : `<span class="text-ellipsis">${value}&nbsp;<ids-icon part="custom-cell-icon" icon="edit"></ids-icon></span>`;
  };

  if (col.editor) {
    col.readonly = (): boolean => {
      const random = Math.floor(Math.random() * 100);
      return (random % 5) === 1;
    };
  }
}
const MAX_RESULTS_COUNT = 1386;
let data: any = null;
const fetchData = async (startIndex = 0) => {
  if (data === null) {
    const res = await fetch(url);
    const results = await res.json();
    data = results.slice(0, MAX_RESULTS_COUNT);
  }

  if (startIndex > MAX_RESULTS_COUNT) return [];

  const numRowsNeeded = Math.max((MAX_RESULTS_COUNT - startIndex), 0);
  const dataSet = data.splice(0, Math.min(numRowsNeeded, startIndex === 0 ? 66 : 33));
  return dataSet;
};

const setData = async () => {
  dataGrid.rowStart = 30;
  dataGrid.data = await fetchData();
};

dataGrid.addEventListener('afterrendered', async () => {
  dataGrid.selectRow(30);
});

setData();

dataGrid.addEventListener('scrollend', async (e: Event) => {
  const endIndex = (<CustomEvent>e).detail?.value || 0;
  const moreData = await fetchData(endIndex + 1);
  if (moreData.length) {
    dataGrid.appendData(moreData);
    console.info('scrollend >>>', moreData.length);
  }
});
