import booksJSON from '../../../assets/data/books.json';
import { exportToXLSX, IdsExcelData } from '../../../utils/ids-excel-exporter/ids-excel-exporter';

(async () => {
  async function getData() {
    const res = await fetch(booksJSON as any);
    const data = await res.json();
    return data;
  }

  function formatData(data: any[]): IdsExcelData {
    return data.map((row) => Object.keys(row).map((key) => ({
      column: key,
      value: row[key],
      type: typeof (row[key]) === 'number' ? 'number' : 'string'
    })));
  }

  const books = formatData(await getData());
  exportToXLSX(books);
})();
