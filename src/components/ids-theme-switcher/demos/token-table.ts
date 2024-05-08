import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import '../../ids-data-grid/ids-data-grid';
import type { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';
import coreThemeJSON from '../../../assets/data/themeData/coreTheme.json';
import darkThemeJSON from '../../../assets/data/themeData/darkTheme.json';
import contrastThemeJSON from '../../../assets/data/themeData/contrastTheme.json';
import '../../ids-layout-flex/ids-layout-flex';
import '../../ids-dropdown/ids-dropdown';

const dataGrid = document.querySelector<IdsDataGrid>('#data-theme')!;

const themes = {
  coreTheme: coreThemeJSON,
  contrastTheme: contrastThemeJSON,
  darkTheme: darkThemeJSON
}

const columns: IdsDataGridColumn[] = [];

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
});

columns.push({
  id: 'preview',
  name: 'Preview',
  field: 'tokenValue',
  formatter: dataGrid.formatters.color,
  width: 165,
  align: 'center'
});

// columns.push({
//   id: 'inheritedName',
//   name: 'Inherited Name',
//   field: 'inherited.tokenName',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
// });

// columns.push({
//   id: 'inheritedValue',
//   name: 'Inherited Value',
//   field: 'inherited.tokenValue',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
// });

// columns.push({
//   id: 'inheritedInheritedName',
//   name: 'Inherited Inherited Name',
//   field: 'inherited.inherited.tokenName',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
// });

// columns.push({
//   id: 'inheritedInheritedValue',
//   name: 'Inherited Inherited Value',
//   field: 'inherited.inherited.tokenValue',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
// });

// columns.push({
//   id: 'inheritedInheritedInheritedName',
//   name: 'Inherited Inherited Inherited Name',
//   field: 'inherited.inherited.inherited.tokenName',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
// });

// columns.push({
//   id: 'inheritedInheritedInheritedValue',
//   name: 'Inherited Inherited Inherited Value',
//   field: 'inherited.inherited.inherited.tokenValue',
//   formatter: dataGrid.formatters.text,
//   sortable: false,
//   resizable: true,
// });

dataGrid.columns = columns;

const fetchData = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
}

const updateDataGrid = async (url: string) => {
  const data = await fetchData(url);
  dataGrid.data = data.themeTokens;
}

const dropdownHandler = async (e: any) => {
  const url = themes[e.target.value];
  await updateDataGrid(url);
}

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
