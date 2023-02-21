import { saveAs } from '../ids-file-saver/ids-file-saver';
import { ExcelRow, generateWorksheet } from './ids-excel-formatter';
import { CONTENT_TYPES, RELS, WORKBOOK_XML, WORKBOOK_XML_REL } from './ids-worksheet-templates';
import { IdsZip } from './ids-zip/ids-zip';

export function exportToCSV(data: Array<ExcelRow>) {
  console.info('exportToCSV', data);
}

export function exportToXLSX(data: Array<ExcelRow>) {
  const zip = new IdsZip();
  const xl = zip.folder('xl');
  xl?.file('workbook.xml', WORKBOOK_XML);
  xl?.file('_rels/workbook.xml.rels', WORKBOOK_XML_REL);
  zip.file('_rels/.rels', RELS);
  zip.file('[Content_Types].xml', CONTENT_TYPES);
  xl?.file('worksheets/sheet1.xml', generateWorksheet(data));
  zip.generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }).then((blob: any) => {
    console.info(blob);
    saveAs(blob, `test.xlsx`);
  });
}
