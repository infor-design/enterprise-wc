import '../ids-data-grid';
import type IdsDataGrid from '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-editable')!;

(async function init() {
  // Do an ajax request
  const url: any = booksJSON;
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        validate: 'required',
      }
    },
    readonly(row: number) {
      return row % 2 === 0;
    },
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    uppercase: true,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        maxlength: 2,
        uppercase: true
      }
    },
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    resizable: true,
    reorderable: true,
    uppercase: true,
    formatter: dataGrid.formatters.dropdown,
    editor: {
      type: 'dropdown',
      editorSettings: {
        dirtyTracker: true,
        validate: 'required'
      }
    }
  });
  columns.push({
    id: 'transactionCurrency',
    name: 'Transaction Currency',
    field: 'transactionCurrency',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'integer',
    name: 'Price (Int)',
    field: 'price',
    formatter: dataGrid.formatters.integer,
    formatOptions: { locale: 'en-US' }, // Data Values are in en-US
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: 'number',
        maskOptions: {
          allowDecimal: false,
          integerLimit: 3
        },
        validate: 'required'
      }
    },
  });
  columns.push({
    id: 'postHistory',
    name: 'Post History',
    field: 'postHistory',
    formatter: dataGrid.formatters.checkbox,
    align: 'center',
    editor: {
      type: 'checkbox',
      editorSettings: {
        dirtyTracker: true,
      }
    },
  });

  dataGrid.columns = columns;
  dataGrid.idColumn = 'book';

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };

  await setData();

  type Currency = {
    id: string,
    label: string,
    value: string
  };

  // simulate the delay of the options coming from the server
  const fetchCurrencies = new Promise<Array<Currency>>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'usd',
          label: 'USD',
          value: 'usd'
        },
        {
          id: 'eur',
          label: 'EUR',
          value: 'eur'
        },
        {
          id: 'yen',
          label: 'YEN',
          value: 'yen'
        },
        {
          id: 'cad',
          label: 'CAD',
          value: 'cad'
        },
        {
          id: 'gbp',
          label: 'GBP',
          value: 'gbp'
        },
        {
          id: 'ars',
          label: 'ARS',
          value: 'ars'
        }
      ]);
    }, 200);
  });

  // Event Handlers
  dataGrid.addEventListener('beforecelledit', ((evt: CustomEvent) => {
    // Can be vetoed (<CustomEvent>e).detail.response(false);
    console.info(`Edit Started`, evt.detail);
    const colId = evt.detail.column.id;
    const editor = evt.detail.column.editor;

    if (editor && colId === 'bookCurrency' && !editor.editorSettings.options?.length) {
      evt.detail.response(async () => {
        const currencies = await fetchCurrencies;
        editor.editorSettings.options = currencies;
        return true;
      });
    }
  }) as EventListener);
}());
