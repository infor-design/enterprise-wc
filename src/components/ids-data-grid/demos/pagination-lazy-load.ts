import IdsDataGrid from '../ids-data-grid';

// // Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;

setTimeout(() => {
  // const dataGrid = document.getElementById<IdsDataGrid>('ids-data-grid');
  const caseTableData = {
    headers: ['Column1', 'Column2'],
    rows: [
      ['A', 'A'],
      ['B', 'B'],
      ['C', 'C'],
    ],
  };

  // Mode needs to be added in both ts and html files for the data grid pagination to work

  dataGrid.columns = caseTableData.headers.map((row) => ({
    id: row,
    name: row,
    field: row,
    sortable: true,
    resizable: true,
    filterType: dataGrid.filters.text,
  }));
  dataGrid.data = caseTableData.rows.map((rows) => rows.reduce((prev, current, currentIndex) => {
    // @ts-expect-error name is there
    prev[caseTableData?.headers[currentIndex]] = current;

    return prev;
  }, {}));
  dataGrid.pageTotal = caseTableData.rows.length;
  dataGrid.rowSelection = 'single';

  dataGrid.redraw();
}, 1000);
