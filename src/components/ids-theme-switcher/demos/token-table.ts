import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import '../../ids-data-grid/ids-data-grid';
import type { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';
import coreThemeJSON from '../../../assets/data/themeData/coreTheme.json';

const dataGrid = document.querySelector<IdsDataGrid>('#data-theme')!;

if (dataGrid) {
  (async function init() {
    const url: any = coreThemeJSON;
    const columns: IdsDataGridColumn[] = [];

    columns.push({
      id: 'tokenName',
      name: 'Token Name',
      field: 'tokenName',
      formatter: dataGrid.formatters.text,
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
      id: 'inheritedName',
      name: 'Inherited Name',
      field: 'inherited.tokenName',
      formatter: dataGrid.formatters.text,
      sortable: false,
      resizable: true,
    });

    columns.push({
      id: 'inheritedValue',
      name: 'Inherited Value',
      field: 'inherited.tokenValue',
      formatter: dataGrid.formatters.text,
      sortable: false,
      resizable: true,
    });

    columns.push({
      id: 'inheritedInheritedName',
      name: 'Inherited Inherited Name',
      field: 'inherited.inherited.tokenName',
      formatter: dataGrid.formatters.text,
      sortable: false,
      resizable: true,
    });

    columns.push({
      id: 'inheritedInheritedValue',
      name: 'Inherited Inherited Value',
      field: 'inherited.inherited.tokenValue',
      formatter: dataGrid.formatters.text,
      sortable: false,
      resizable: true,
    });

    columns.push({
      id: 'inheritedInheritedInheritedName',
      name: 'Inherited Inherited Inherited Name',
      field: 'inherited.inherited.inherited.tokenName',
      formatter: dataGrid.formatters.text,
      sortable: false,
      resizable: true,
    });

    columns.push({
      id: 'inheritedInheritedInheritedValue',
      name: 'Inherited Inherited Inherited Value',
      field: 'inherited.inherited.inherited.tokenValue',
      formatter: dataGrid.formatters.text,
      sortable: false,
      resizable: true,
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data.themeTokens;
    };

    await setData();
  }());
}
