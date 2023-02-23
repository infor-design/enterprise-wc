import { XLXExporter } from "./ids-excel-formatter";
import { ExcelConfig } from "./ids-worksheet-templates";

export function exportToCSV(data: Array<Record<string, any>>) {
  console.info('exportToCSV', data);
}

export function exportToXLSX(data: Array<Record<string, any>>, config: ExcelConfig) {
  const xlsxExporter = new XLXExporter();
  xlsxExporter
    .exportToExcel(data, config)
    .finally(() => xlsxExporter.destroy());
}
