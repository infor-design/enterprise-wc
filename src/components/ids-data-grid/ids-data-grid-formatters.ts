import '../ids-hyperlink/ids-hyperlink';
import '../ids-button/ids-button';
import '../ids-badge/ids-badge';
import '../ids-alert/ids-alert';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { escapeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import type { IdsDataGridColumn } from './ids-data-grid-column';
import type IdsDataGrid from './ids-data-grid';

/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
export default class IdsDataGridFormatters {
  #extractValue(item: Record<string, any>, field: string | undefined) {
    if (!field) return '';

    let rawValue;
    if (field.indexOf('.') > -1) {
      rawValue = field.split('.').reduce((o: any, x: any) => (o ? o[x] : ''), item);
    } else {
      rawValue = item[field];
    }

    if (rawValue === undefined || rawValue === null) {
      return '';
    }

    if (typeof rawValue !== 'string') {
      return rawValue;
    }

    return escapeHTML(rawValue || '');
  }

  /** Used to check if the column should show as disabled */
  #columnDisabled(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): boolean {
    const isTrue = (v: any) => (typeof v !== 'undefined' && v !== null && ((typeof v === 'boolean' && v === true) || (typeof v === 'string' && v.toLowerCase() === 'true')));
    const disabled = col.disabled;

    return typeof disabled === 'function' ? disabled(row, value, col, item) : isTrue(disabled);
  }

  /** Used to get the color via the function  or text */
  #color(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): string | undefined {
    const color = col.color;

    return typeof color === 'function' ? color(row, value, col, item) : color;
  }

  /** Displays a Text String */
  text(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    return `<span class="text-ellipsis">${this.#extractValue(rowData, columnData.field)}</span>`;
  }

  /** Masks text with stars */
  password(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    return `<span class="text-ellipsis">${this.#extractValue(rowData, columnData.field).toString().replace(/./g, '•')}</span>`;
  }

  /** Formats a sequencing running count of rows */
  rowNumber(_rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    return `<span class="text-ellipsis">${index + 1}</span>`;
  }

  /** Formats date data as a date string in the desired format */
  date(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: IdsDataGrid): string {
    let value: any = this.#extractValue(rowData, columnData.field);
    value = api.localeAPI?.formatDate(value, columnData.formatOptions) ?? value.toString();
    const icon = columnData.editor?.type === 'datepicker' ? '<ids-icon icon="schedule" class="editor-cell-icon"></ids-icon>' : '';
    return `<span class="text-ellipsis">${value}</span>${icon}`;
  }

  /** Formats date data as a time string in the desired format */
  time(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: IdsDataGrid): string {
    let value: any = this.#extractValue(rowData, columnData.field);
    value = api.localeAPI?.formatDate(value, columnData.formatOptions || { timeStyle: 'short' }) ?? value.toString();
    const icon = columnData.editor?.type === 'timepicker' ? '<ids-icon icon="clock" class="editor-cell-icon"></ids-icon>' : '';
    return `<span class="text-ellipsis">${value}</span>${icon}`;
  }

  /** Formats number data as a decimal string in the specific localeAPI */
  decimal(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: IdsDataGrid): string {
    let value: any = this.#extractValue(rowData, columnData.field);
    value = api.localeAPI?.formatNumber(value, columnData.formatOptions
      || { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? value.toString();
    return `<span class="text-ellipsis">${value === 'NaN' ? '' : value}</span>`;
  }

  /** Formats number data as a integer string in the specific locale */
  integer(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: IdsDataGrid): string {
    let value: any = this.#extractValue(rowData, columnData.field);
    const opts = columnData.formatOptions || { };
    opts.style = 'integer';

    value = api.localeAPI?.formatNumber(value, opts) ?? value.toString();
    return `<span class="text-ellipsis">${value === 'NaN' ? '' : value}</span>`;
  }

  /** Formats number data as a ids-hyperlink */
  hyperlink(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value = columnData.text || this.#extractValue(rowData, columnData.field).toString();
    if (!value) {
      return '';
    }
    let colHref: any = columnData.href || '#';
    const isDisabled = this.#columnDisabled(index, value, columnData, rowData);

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
    return `<ids-hyperlink href="${colHref}" tabindex="-1" ${isDisabled ? ' disabled="true"' : ''}>${value}</ids-hyperlink>`;
  }

  /** Shows a selection checkbox column */
  selectionCheckbox(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const isDisabled = this.#columnDisabled(index, '', columnData, rowData);
    return `<span class="ids-data-grid-checkbox-container is-selection-checkbox"><span role="checkbox" aria-checked="${rowData?.rowSelected ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-data-grid-checkbox${rowData?.rowSelected ? ' checked' : ''}${isDisabled ? ' disabled' : ''}"></span></span>`;
  }

  /** Shows a checkbox column */
  checkbox(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const isDisabled = this.#columnDisabled(index, '', columnData, rowData);
    const dataValue = this.#extractValue(rowData, columnData.field);
    let value = stringToBool(dataValue);
    value = dataValue === 'No' ? false : dataValue;
    value = dataValue === 'Yes' ? false : dataValue;
    return `<span class="ids-data-grid-checkbox-container"><span role="checkbox" aria-checked="${value ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-data-grid-checkbox${value ? ' checked' : ''}${isDisabled ? ' disabled' : ''}"></span></span>`;
  }

  /** Shows a selection radio column */
  selectionRadio(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const isDisabled = this.#columnDisabled(index, '', columnData, rowData);
    return `<span class="ids-data-grid-radio-container"><span role="radio" aria-checked="${rowData?.rowSelected ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-data-grid-radio${rowData?.rowSelected ? ' checked' : ''}${isDisabled ? ' disabled' : ''}"></span></span>`;
  }

  /** Shows an ids-button */
  button(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    // Type / disabled / icon / text
    return `<ids-button tabindex="-1" ${this.#columnDisabled(index, value, columnData, rowData) ? ' disabled="true"' : ''}${columnData.type ? ` type="${columnData.type}"` : ' type="tertiary"'}>
      <span class="audible">${columnData.text || ' Button'}</span>
      ${columnData.icon ? `<ids-icon icon="${columnData.icon}"></ids-icon>` : ''}
    </ids-button>`;
  }

  /** Shows an ids-badge */
  badge(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';
    const color = this.#color(index, value, columnData, rowData);

    return `<ids-badge color="${color || ''}">${value}</ids-badge>`;
  }

  /** Shows an Tree */
  tree(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    const button = rowData?.children ? `<ids-button tabindex="-1" class="expand-button">
      <ids-icon icon="plusminus-folder-${rowData.rowExpanded === false ? 'closed' : 'open'}"></ids-icon>
    </ids-button>` : '&nbsp;';
    return `<span class="ids-data-grid-tree-container">${button}<span class="text-ellipsis">${value}</span></span>`;
  }

  /** Shows an expander button */
  expander(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    const button = `<ids-button tabindex="-1" class="expand-button">
        <ids-icon icon="plusminus-folder-${rowData.rowExpanded === true ? 'open' : 'closed'}"></ids-icon>
      </ids-button>`;
    return `<span class="ids-data-grid-tree-container">${button}<span class="text-ellipsis">${value}</span></span>`;
  }

  /** Shows a dropdown list */
  dropdown(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const field = columnData.field ?? '';
    const options = <any[]>columnData.editor?.editorSettings?.options || [];
    const value = rowData[field];
    const valueOpt = options.find((opt) => opt.value === value);

    return `
      <span
        class="text-ellipsis dropdown-cell-value"
        data-value="${valueOpt?.value ?? ''}"
        data-id="${valueOpt?.id ?? ''}">
          ${valueOpt?.label ?? ''}
      </span>
      <ids-icon
        icon="dropdown"
        class="editor-cell-icon">
      </ids-icon>
    `;
  }
}
