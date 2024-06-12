import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import '../../ids-data-grid/ids-data-grid';
import type { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';
import '../../ids-container/ids-container';
import coreModeJSON from '../../../assets/data/themeData/ids-theme-default-core.json';
import darkModeJSON from '../../../assets/data/themeData/ids-theme-default-dark.json';
import contrastModeJSON from '../../../assets/data/themeData/ids-theme-default-contrast.json';

const dataGrid = document.querySelector<IdsDataGrid>('#data-tokens')!;

const modes: any = {
  coreMode: coreModeJSON,
  contrastMode: contrastModeJSON,
  darkMode: darkModeJSON,
};

const columns: IdsDataGridColumn[] = [];

columns.push({
  id: 'tokenName',
  name: 'Token Name',
  field: 'tokenName',
  click: (info: any) => {
    console.info('Tree Expander Clicked', info);
  },
  sortable: false,
  resizable: true,
  minWidth: 400,
  width: 400,
  formatter: dataGrid.formatters.tree,
  filterType: dataGrid.filters.text
});

columns.push({
  id: 'tokenValue',
  name: 'Token Value',
  field: 'tokenValue',
  sortable: false,
  resizable: true,
  minWidth: 400,
  width: 400,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});

columns.push({
  id: 'type',
  name: 'Tier',
  field: 'type',
  sortable: false,
  resizable: false,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.dropdown,
  filterConditions: [
    { value: 'Semantic', label: 'Semantic' },
    { value: 'Component', label: 'Component' },
  ]
});

columns.push({
  id: 'component',
  name: 'Component',
  field: 'component',
  sortable: true,
  resizable: false,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});

columns.push({
  id: 'preview',
  name: 'Preview',
  field: 'colorValue',
  width: 165,
  align: 'center',
  resizable: false,
  formatter: dataGrid.formatters.color,
  suppressColorTooltip: true,
});

dataGrid.columns = columns;

const fetchData = async (url: string) => {
  const res: any = await fetch(url);
  const data: any = await res.json();
  return data;
};

const updateDataGrid = async (url: string) => {
  const data: any = await fetchData(url);
  dataGrid.data = data.themeTokens;
};

const dropdownHandler = async (e: any) => {
  const url: string = modes[e.target.value];
  await updateDataGrid(url);
  dataGrid.collapseAll();
};

const dropdown: any = document.querySelector('#dropdown-modes');
if (dropdown) {
  dropdown.addEventListener('change', dropdownHandler);
}

const initializeData = async () => {
  const defaultValue = dropdown ? dropdown.value : 'coreMode';
  const defaultUrl = modes[defaultValue];
  await updateDataGrid(defaultUrl);
};

await initializeData();
dataGrid.collapseAll();

dataGrid.addEventListener('rowexpanded', (e: Event) => {
  console.info(`Row Expanded`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('rowcollapsed', (e: Event) => {
  console.info(`Row Collapsed`, (<CustomEvent>e).detail);
});
