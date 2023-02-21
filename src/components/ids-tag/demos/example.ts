import { exportToXLSX } from '../../../utils/ids-excel-exporter/ids-excel-exporter';
import { ExcelRow } from '../../../utils/ids-excel-exporter/ids-excel-formatter';
import booksJSON from '../../../assets/data/books.json';

// Add an event listener to test clickable links
const tag = document.querySelector('#ids-clickable-tag');
tag?.addEventListener('click', (e) => {
  console.info('Click Fired', e);
});

async function createExcel() {
  const url = booksJSON;
  const books = await fetch(url);
  
  exportToXLSX(data);
}
