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
    id: 'id',
    name: 'ID',
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
      },
      editorValidation: {
        check: (input) => {
          const val = input.value;
          return !!/^[0-9]*$/.test(val);
        },
        message: 'Only numbers allowed',
        id: 'numbersonly'
      }
    },
    readonly(row: number) {
      return row % 2 === 0;
    },
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.date,
    editor: {
      type: 'datepicker',
      editorSettings: {
        validate: 'required',
        dirtyTracker: true
      },
      editorValidation: {
        check: (input) => {
          const inputDate = new Date(input.value);
          return inputDate?.getFullYear() > 2010;
        },
        message: 'Must be published after 2010',
        id: 'minPubDate'
      }
    }
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' },
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: 'number',
        maskOptions: {
          allowDecimal: true,
          integerLimit: 3,
          decimalLimit: 2
        }
      },
      editorValidation: {
        check: (input) => Number(input.value) >= 5,
        message: '$5 is th minimum price',
        id: 'minPrice'
      }
    },
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.dropdown,
    editor: {
      type: 'dropdown',
      editorSettings: {
        dirtyTracker: true,
        validate: 'required',
        options: [
          {
            id: '',
            label: '',
            value: ''
          },
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
          }
        ]
      },
      editorValidation: {
        check: (input) => ['USD', 'EUR'].includes(input.value),
        message: 'Only EUR or USD accepted',
        id: 'eurUSDOnly'
      }
    }
  });

  dataGrid.columns = columns;
  dataGrid.idColumn = 'book';

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };

  await setData();

  // Event Handlers
  dataGrid.addEventListener('beforecelledit', (e: Event) => {
    // Can be vetoed (<CustomEvent>e).detail.response(false);
    console.info(`Edit Started`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('celledit', (e: Event) => {
    console.info(`Currently Editing`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('endcelledit', (e: Event) => {
    console.info(`Edit Ended`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('cancelcelledit', (e: Event) => {
    console.info(`Edit Was Cancelled`, (<CustomEvent>e).detail);
  });
}());
