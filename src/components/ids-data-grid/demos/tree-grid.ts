import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import buildingsJSON from '../../../assets/data/tree-buildings.json';

let dataset: Record<string, any>[] = [];
// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid')!;

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    const url: any = buildingsJSON;
    const columns: IdsDataGridColumn[] = [];

    // Set up columns
    columns.push({
      id: 'selectionCheckbox',
      name: 'selection',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.selectionCheckbox,
      align: 'center',
      frozen: 'left'
    });
    columns.push({
      id: 'name',
      name: 'Name',
      field: 'name',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.tree,
      click: (info: any) => {
        console.info('Tree Expander Clicked', info);
      },
      width: 220,
      frozen: 'left'
    });
    columns.push({
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 65
    });
    columns.push({
      id: 'id',
      name: 'Id',
      field: 'id',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'capacity',
      name: 'Capacity',
      field: 'capacity',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.integer
    });
    columns.push({
      id: 'available',
      name: 'Available',
      field: 'available',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.date
    });
    columns.push({
      id: 'comments',
      name: 'Comments',
      field: 'comments',
      sortable: true,
      resizable: true,
      formatter: dataGrid.formatters.text
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();

      console.info(`Initial Load`);
      dataset = data.slice(0, 120);
      console.info('-------- local dataset ---------');
      console.info(dataset);

      dataGrid.data = dataset;
      console.info('-------- dataGrid.data ---------');
      console.info(dataGrid.data);
    };

    await setData();

    dataGrid.addEventListener('selectionchanged', (e: Event) => {
      console.info(`Selection Changed`, (<CustomEvent>e).detail);
      console.info('-------- local dataset ---------');
      console.info(dataset);
      console.info('-------- dataGrid.data ---------');
      console.info(dataGrid.data);
    });

    dataGrid.addEventListener('rowexpanded', (e: Event) => {
      console.info(`Row Expanded`, (<CustomEvent>e).detail);
      console.info('-------- local dataset ---------');
      console.info(dataset);
      console.info('-------- dataGrid.data ---------');
      console.info(dataGrid.data);
    });

    dataGrid.addEventListener('rowcollapsed', (e: Event) => {
      console.info(`Row Collapsed`, (<CustomEvent>e).detail);
      console.info('-------- local dataset ---------');
      console.info(dataset);
      console.info('-------- dataGrid.data ---------');
      console.info(dataGrid.data);
    });
  }());
}
