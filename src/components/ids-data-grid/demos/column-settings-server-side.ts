import booksJSON from '../../../assets/data/books.json';
import '../ids-data-grid';
import type IdsDataGrid from '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    // const url: any = booksJSON;

    const columns: IdsDataGridColumn[] = [];
    columns.push({
      id: 'id',
      name: 'ID',
      field: 'id',
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true
        }
      }
    });
    columns.push({
      id: 'name',
      name: 'Name',
      field: 'name',
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true
        }
      }
    });
    columns.push({
      id: 'isAdmin',
      name: 'Is Admin',
      field: 'isAdmin',
      formatter: dataGrid.formatters.checkbox,
      editor: {
        type: 'checkbox',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true
        }
      }
    });
    columns.push({
      id: 'role',
      name: 'Role',
      field: 'role',
      // NOTE: commenting this out to set later in setTimeout()
      // formatter: dataGrid.formatters.dropdown,
      editor: {
        type: 'dropdown',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          // NOTE: commenting these out to set later in setTimeout()
          // options: [{
          //   value: 'Administration',
          //   label: 'Administration'
          // },{
          //   value: 'Manager',
          //   label: 'Manager'
          // },{
          //   value: 'Developer',
          //   label: 'Developer'
          // }]
        }
      }
    });
    columns.push({
      id: 'date',
      name: 'Date',
      field: 'date',
      editor: {
        type: 'datepicker',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true
        }
      }
    });

    const gridData = [{
      id: 1,
      name: 'User 1',
      isAdmin: true,
      date: '05-11-2022',
      role: 'Administration'
    },
    {
      id: 2,
      name: 'User 2',
      isAdmin: false,
      date: '06-11-2022',
      role: 'Manager'
    },
    {
      id: 3,
      name: 'User 3',
      isAdmin: true,
      date: '07-11-2022',
      role: 'Developer'
    }];

    dataGrid.columns = columns;
    dataGrid.data = gridData;

    setTimeout(() => {
      const updatedColumns = dataGrid.columns;
      if (!updatedColumns?.[3]?.editor?.editorSettings) return;

      // set options later simulating options comming from server
      console.log('Now setting >>> updatedColumns[3].editor.editorSettings.options');
      updatedColumns[3].editor.editorSettings.options = [
        {
          value: 'Administration',
          label: 'Administration'
        },
        {
          value: 'Manager',
          label: 'Manager'
        },
        {
          value: 'Developer',
          label: 'Developer'
        }
      ];

      updatedColumns[3].formatter = dataGrid.formatters.dropdown;
      dataGrid.columns = updatedColumns;
    }, 2000);
  }());
}
