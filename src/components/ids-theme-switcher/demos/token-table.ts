import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import '../../ids-data-grid/ids-data-grid';
import type { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';
import coreThemeJSON from '../../../assets/data/themeData/ids-theme-default-core.json';
import darkThemeJSON from '../../../assets/data/themeData/ids-theme-default-dark.json';
import contrastThemeJSON from '../../../assets/data/themeData/ids-theme-default-contrast.json';
import '../../ids-layout-flex/ids-layout-flex';
import '../../ids-dropdown/ids-dropdown';

const dataGrid = document.querySelector<IdsDataGrid>('#data-theme')!;

const themes: any = {
  coreTheme: coreThemeJSON,
  contrastTheme: contrastThemeJSON,
  darkTheme: darkThemeJSON
};

const columns: IdsDataGridColumn[] = [];

columns.push({
  id: 'type',
  name: 'Type',
  field: 'type',
  formatter: dataGrid.formatters.text,
  sortable: false,
  resizable: true,
  width: 165,
  filterType: dataGrid.filters.text
});

columns.push({
  id: 'tokenName',
  name: 'Token Name',
  field: 'tokenName',
  formatter: dataGrid.formatters.tree,
  click: (info: any) => {
    console.info('Tree Expander Clicked', info);
  },
  sortable: false,
  resizable: true,
});

columns.push({
  id: 'tokenValue',
  name: 'Token Value',
  field: 'tokenValue',
  formatter: dataGrid.formatters.text,
  sortable: false,
  resizable: true,
  // filterType: dataGrid.filters.text
});

columns.push({
  id: 'preview',
  name: 'Preview',
  field: 'tokenValue',
  formatter: dataGrid.formatters.color,
  width: 165,
  align: 'center',
  suppressColorTooltip: true,
});

// columns.push({
//   id: 'source',
//   name: 'Source',
//   field: 'source',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
//   // filterType: dataGrid.filters.text
// });

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
  const url: string = themes[e.target.value];
  await updateDataGrid(url);
};

const dropdown: any = document.querySelector('#dropdown-themes');
if (dropdown) {
  dropdown.addEventListener('change', dropdownHandler);
}

const initializeData = async () => {
  const defaultValue = dropdown ? dropdown.value : 'coreTheme';
  const defaultUrl = themes[defaultValue];
  await updateDataGrid(defaultUrl);
};

await initializeData();

dataGrid.addEventListener('rowexpanded', (e: Event) => {
  console.info(`Row Expanded`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('rowcollapsed', (e: Event) => {
  console.info(`Row Collapsed`, (<CustomEvent>e).detail);
});
