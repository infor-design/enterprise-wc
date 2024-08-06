import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';

const grid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

grid.columns = [{
  id: 'id',
  name: 'ID',
  field: 'id'
},
{
  id: 'role',
  name: 'Role',
  field: 'role',
  formatter: grid.formatters.dropdown,
  editor: {
    type: 'dropdown',
    editorSettings: {
      autoselect: true,
      dirtyTracker: true,
      options: [] // will be set later with the server
    }
  }
}];

grid.data = [{
  id: 1,
  role: 'Administration'
},
{
  id: 2,
  role: 'Manager'
}];

// Applying options later, simulating server side gave options later
grid.columns[1]!.editor!.editorSettings!.options = [{
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
}];
