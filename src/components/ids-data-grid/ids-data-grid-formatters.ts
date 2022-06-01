import '../ids-hyperlink/ids-hyperlink';
import '../ids-button/ids-button';
import type { IdsDataGridColumn } from './ids-data-grid-column';

/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
export default class IdsDataGridFormatters {
  /** Formats Just the string Data Removing Nulls and Undefined */
  nullToString(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: unknown = rowData[columnData.field || ''];
    const str = ((value === null || value === undefined || value === '') ? '' : (value as any).toString());
    return str;
  }

  /** Formats Just the object Data Removing Nulls and Undefined */
  nullToObj(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: unknown = rowData[columnData.field || ''];
    const str = ((value === null || value === undefined || value === '') ? '' : value);
    return (str as string);
  }

  /** Used to check if an editor should be disabled */
  columnDisabled(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): boolean {
    const isTrue = (v: any) => (typeof v !== 'undefined' && v !== null && ((typeof v === 'boolean' && v === true) || (typeof v === 'string' && v.toLowerCase() === 'true')));
    const disabled = col.disabled;

    return typeof disabled === 'function' ? disabled(row, value, col, item) : isTrue(disabled);
  }

  /** Formats Text */
  text(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    return `<span class="text-ellipsis">${this.nullToString(rowData, columnData)}</span>`;
  }

  /** Masks text with stars */
  password(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    return `<span class="text-ellipsis">${this.nullToString(rowData, columnData).replace(/./g, '*')}</span>`;
  }

  /** Formats a sequencing running count of rows */
  rowNumber(_rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    return `<span class="text-ellipsis">${index}</span>`;
  }

  /** Formats date data as a date string in the desired format */
  date(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any): string {
    let value: any = this.nullToObj(rowData, columnData);
    value = api.locale?.formatDate(value, columnData.formatOptions) ?? value.toString();
    return `<span class="text-ellipsis">${value}</span>`;
  }

  /** Formats date data as a time string in the desired format */
  time(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any): string {
    let value: any = this.nullToObj(rowData, columnData);
    value = api.locale?.formatDate(value, columnData.formatOptions || { timeStyle: 'short' }) ?? value.toString();
    return `<span class="text-ellipsis">${value}</span>`;
  }

  /** Formats number data as a decimal string in the specific locale */
  decimal(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any): string {
    let value: any = this.nullToObj(rowData, columnData);
    value = api.locale?.formatNumber(value, columnData.formatOptions
      || { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? value.toString();
    return `<span class="text-ellipsis">${value === 'NaN' ? '' : value}</span>`;
  }

  /** Formats number data as a integer string in the specific locale */
  integer(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: any): string {
    let value: any = this.nullToObj(rowData, columnData);
    const opts = columnData.formatOptions || { };
    opts.style = 'integer';

    value = api.locale?.formatNumber(value, opts) ?? value.toString();
    return `<span class="text-ellipsis">${value === 'NaN' ? '' : value}</span>`;
  }

  /** Formats number data as a ids-hyperlink */
  hyperlink(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value = columnData.text || this.nullToString(rowData, columnData);
    if (!value) {
      return '';
    }
    let colHref: any = columnData.href || '#';

    // Support for dynamic links based on content
    if (columnData.href && typeof columnData.href === 'function') {
      colHref = columnData.href(rowData, columnData);
      // Passing a null href will produce "just text" with no link
      if (colHref == null) {
        return columnData.text || value;
      }
    } else {
      colHref = colHref.replace('{{value}}', value);
    }
    return `<ids-hyperlink href="${colHref}" tabindex="-1">${value}</ids-hyperlink>`;
  }

  /** Shows a selection checkbox column */
  selectionCheckbox(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    return `<span class="ids-datagrid-checkbox-container"><span role="checkbox" aria-checked="${rowData?.rowSelected ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-datagrid-checkbox${rowData?.rowSelected ? ' checked' : ''}"></span></span>`;
  }

  /** Shows a selection radio column */
  selectionRadio(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    return `<span class="ids-datagrid-radio-container"><span role="radio" aria-checked="${rowData?.rowSelected ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-datagrid-radio${rowData?.rowSelected ? ' checked' : ''}"></span></span>`;
  }

  /** Shows an ids-button */
  button(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.nullToObj(rowData, columnData);
    // Type / disabled / icon / text
    return `<ids-button tabindex="-1" ${columnData.text || ''}${this.columnDisabled(index, value, columnData, rowData) ? ' disabled="true"' : ''}${columnData.type ? ` type="${columnData.type}"` : ' type="tertiary"'}>
      <span class="audible">${columnData.text || ' Button'}</span>
      ${columnData.icon ? `<ids-icon slot="icon" icon="${columnData.icon}"></ids-icon>` : ''}
    </ids-button>`;
  }
}
