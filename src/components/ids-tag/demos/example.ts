import { exportToXLSX } from '../../../utils/ids-excel-exporter/ids-excel-exporter';
import booksJSON from '../../../assets/data/books.json';
import { ExcelConfig } from '../../../utils/ids-excel-exporter/ids-worksheet-templates';

// Add an event listener to test clickable links
const tag = document.querySelector('#ids-clickable-tag');
tag?.addEventListener('click', (e) => {
  console.info('Click Fired', e);
});

async function createExcel() {
  const url: any = booksJSON;
  const res = await fetch(url);
  const data = await res.json();
  
  const config: ExcelConfig = {
    filename: 'books',
    columns: [
      { field: 'book', type: 'number' },
      { field: 'description', type: 'string' },
      { field: 'ledger', type: 'string' },
      { field: 'bookCurrency', type: 'string' },
      { field: 'transactionCurrency', type: 'string' },
      { field: 'postHistory', type: 'string' },
      { field: 'active', type: 'string' },
      { field: 'inStock', type: 'string' },
      { field: 'convention', type: 'string' },
      { field: 'methodSwitch', type: 'string' },
      { field: 'trackDeprecationHistory', type: 'string' },
      { field: 'useForEmployee', type: 'string' },
      { field: 'icon', type: 'string' },
      { field: 'image', type: 'string' },
      { field: 'category', type: 'string' },
      { field: 'count', type: 'string' },
      { field: 'deprecationHistory', type: 'string' },
      { field: 'publishDate', type: 'string' },
      { field: 'price', type: 'string' },
      { field: 'location', type: 'string' },
      { field: 'color', type: 'string' }
    ]
  }

  exportToXLSX(data, config);
}

createExcel();