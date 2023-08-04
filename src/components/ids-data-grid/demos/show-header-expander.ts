import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-expandable-row')!;

const btnExpandAll = document.querySelector('#btn-expand-all');
const btnCollapseAll = document.querySelector('#btn-collapse-all');
btnExpandAll?.addEventListener('click', () => dataGrid?.expandAll());
btnCollapseAll?.addEventListener('click', () => dataGrid?.collapseAll());

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    const url: any = booksJSON;
    const columns: IdsDataGridColumn[] = [];

    // Set up columns
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: dataGrid.formatters.expander,
      showHeaderExpander: true,
    });
    columns.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: dataGrid.formatters.date
    });
    columns.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: dataGrid.formatters.time
    });
    columns.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      href: '#'
    });
    columns.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      formatter: dataGrid.formatters.checkbox,
      showHeaderExpander: true,
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data;
    };

    setData();

    dataGrid.addEventListener('rowexpanded', (e: Event) => {
      console.info(`Row Expanded`, (<CustomEvent>e).detail);
    });

    dataGrid.addEventListener('rowcollapsed', (e: Event) => {
      console.info(`Row Collapsed`, (<CustomEvent>e).detail);
    });
  }());
}
