import { exportToXLSX } from '../../../utils/ids-excel-exporter/ids-excel-exporter';
import productsURL from '../../../assets/data/products.json';
import { ExcelConfig } from '../../../utils/ids-excel-exporter/ids-worksheet-templates';

// Add an event listener to test clickable links
const tag = document.querySelector('#ids-clickable-tag');
tag?.addEventListener('click', (e) => {
  console.info('Click Fired', e);
});

async function createExcel() {
  const url: any = productsURL;
  const res = await fetch(url);
  const data = await res.json();
  const config: ExcelConfig = {
    filename: 'products',
    columns: [
      { field: 'id', type: 'number' },
      { field: 'productId', type: 'string' },
      { field: 'productName', type: 'string' },
      { field: 'inStock', type: 'string' },
      { field: 'units', type: 'string' },
      { field: 'unitPrice', type: 'number' },
      { field: 'color', type: 'string' },
    ]
  };

  exportToXLSX(data, config);
}

createExcel();