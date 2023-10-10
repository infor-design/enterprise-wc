import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-alignment')!;

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    const url: any = booksJSON;
    const columns: IdsDataGridColumn[] = [];

    // Set up columns
    columns.push({
      id: 'description',
      name: 'ID',
      field: 'description',
      sortable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'inStock',
      name: 'Checkbox (left)',
      field: 'inStock',
      formatter: dataGrid.formatters.checkbox,
      sortable: true,
      align: 'left'
    });
    columns.push({
      id: 'inStock',
      name: 'Checkbox (center)',
      field: 'inStock',
      formatter: dataGrid.formatters.checkbox,
      sortable: true,
      align: 'center'
    });
    columns.push({
      id: 'inStock',
      name: 'Checkbox (right)',
      field: 'inStock',
      formatter: dataGrid.formatters.checkbox,
      sortable: true,
      align: 'right'
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
