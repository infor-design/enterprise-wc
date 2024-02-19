/**
 * @jest-environment jsdom
 */
import { TextEncoder } from 'util';
import * as excelExporter from '../../src/utils/ids-excel-exporter/ids-excel-exporter';
import * as fileSaver from '../../src/utils/ids-file-saver/ids-file-saver';
import '../helpers/resize-observer-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import { IdsDataGridColumn } from '../../src/components/ids-data-grid/ids-data-grid-column';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import { IdsZip } from '../../src/utils/ids-zip/ids-zip';
import { XLSXFormatter } from '../../src/utils/ids-excel-exporter/ids-excel-formatter';
import { ExcelColumn } from '../../src/utils/ids-excel-exporter/ids-worksheet-templates';

describe('IdsDataGrid Excel Export', () => {
  global.TextEncoder = TextEncoder;

  let dataGrid: IdsDataGrid;
  const formatters = new IdsDataGridFormatters();
  const columns: IdsDataGridColumn[] = [
    {
      id: 'selectionCheckbox',
      sortable: false,
      resizable: false,
      formatter: formatters.selectionCheckbox,
      align: 'center',
      width: 20
    },
    {
      id: 'id',
      name: 'ID',
      field: 'id',
      formatter: formatters.text,
      width: 80,
      sortable: true
    },
    {
      id: 'productName',
      name: 'Product Name',
      field: 'productName',
      formatter: formatters.text,
      sortable: true
    }
  ];
  const products = [
    {
      id: 1,
      productId: '7439937961',
      productName: 'Steampan Lid',
      inStock: true,
      units: '9',
      unitPrice: 23,
      color: 'Green',
      escalated: 2
    },
    {
      id: 2,
      productId: '3672150959',
      productName: 'Coconut - Creamed, Pure',
      inStock: true,
      units: '588',
      unitPrice: 18,
      color: 'Yellow',
      disabled: true,
      escalated: 1
    }
  ];

  let mockSaveAs: jest.SpyInstance;

  beforeEach(() => {
    mockSaveAs = jest.spyOn(fileSaver, 'saveAs');
    mockSaveAs.mockImplementation(() => 'ok');
    dataGrid = new IdsDataGrid();
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns;
    dataGrid.data = products;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    mockSaveAs.mockReset();
  });

  test('can export to csv', () => {
    const spy = jest.spyOn(excelExporter, 'exportToCSV');
    dataGrid.exportToExcel('csv', 'test');
    expect(mockSaveAs).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  test('can export to xlsx', () => {
    const spy = jest.spyOn(excelExporter, 'exportToXLSX');
    dataGrid.exportToExcel('xlsx', 'test');
    expect(mockSaveAs).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  test('can create zip file', () => {
    const root = new IdsZip();
    root.file('test.txt', 'test data');
    const zipFile = root.zip('text/*');
    expect(zipFile instanceof Blob).toBeTruthy();
    expect(zipFile.type).toEqual('text/*');
  });

  test('can generate xlsx worksheet with string types', () => {
    const xlsxFormatter = new XLSXFormatter();
    const data = [{ name: 'Joe Shmo' }];
    const xlColumns: ExcelColumn[] = [{
      id: 'name',
      name: 'Name',
      field: 'name',
      type: 'string'
    }];
    const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
    const expectedCell = '<is><t>Joe Shmo</t></is>';
    expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
  });

  test('can generate xlsx worksheet with number types', () => {
    const xlsxFormatter = new XLSXFormatter();
    const data = [{ num: 12345.54321 }];
    const xlColumns: ExcelColumn[] = [{
      id: 'num',
      name: 'Num',
      field: 'num',
      type: 'number'
    }];
    const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
    const expectedCell = '<v>12345.54321</v>';
    expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
  });

  test('can generate xlsx worksheet with date types', () => {
    const xlsxFormatter = new XLSXFormatter();
    const date = new Date(1990, 3, 21);
    const data = [{ date: date.toISOString() }];
    const dateInExcelFormat = 32984; // days since Jan 1 1900;
    const xlColumns: ExcelColumn[] = [{
      id: 'date',
      name: 'Date',
      field: 'date',
      type: 'date'
    }];
    const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
    const expectedCell = `<v>${dateInExcelFormat}</v>`;
    expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
  });

  test('can generate xlsx worksheet with time types', () => {
    const xlsxFormatter = new XLSXFormatter();
    const date = new Date(1990, 3, 21, 3, 25); // April 21 1990 3:25
    const data = [{ time: date.toISOString() }];
    const dateInExcelFormat = 32984.14236111111;
    const xlColumns: ExcelColumn[] = [{
      id: 'time',
      name: 'Time',
      field: 'time',
      type: 'time'
    }];
    const worksheet = xlsxFormatter.generateWorksheet(data, xlColumns);
    const expectedCell = `<v>${dateInExcelFormat}</v>`;
    expect(worksheet.indexOf(expectedCell) !== -1).toBeTruthy();
  });
});
