import '../ids-hyperlink/ids-hyperlink';
import '../ids-button/ids-button';
import '../ids-alert/ids-alert';
import '../ids-badge/ids-badge';
import '../ids-card/ids-card';
import '../ids-color/ids-color';
import '../ids-counts/ids-counts';
import '../ids-icon/ids-icon';
import '../ids-image/ids-image';
import '../ids-progress-bar/ids-progress-bar';
import '../ids-rating/ids-rating';
import '../ids-slider/ids-slider';
import '../ids-step-chart/ids-step-chart';
import '../ids-tag/ids-tag';

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

  /** Used to check if the row or column should show as disabled */
  #isDisabled(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): boolean {
    return item?.idstempcanrowdisabled || this.#columnDisabled(row, value, col, item);
  }

  /** Used to get the color via the function or text */
  #color(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): string | undefined {
    const color = col.color;
    return typeof color === 'function' ? color(row, value, col, item) : color;
  }

  #readonly(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): boolean | undefined {
    const readonly = col.readonly;

    return typeof readonly === 'function' ? readonly(row, value, col, item) : readonly;
  }

  #size(row: number, value: any, col: IdsDataGridColumn, item: Record<string, any>): string | undefined {
    const size = col.size;

    return typeof size === 'function' ? size(row, value, col, item) : size;
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
    const opts = columnData.formatOptions || {};
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
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled="true"' : '';

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
    return `<ids-hyperlink href="${colHref}" tabindex="-1"${disabled}>${value}</ids-hyperlink>`;
  }

  /** Shows a selection checkbox column */
  selectionCheckbox(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const isDisabled = this.#isDisabled(index, '', columnData, rowData);

    return `<span class="ids-data-grid-checkbox-container is-selection-checkbox"><span role="checkbox" aria-checked="${rowData?.rowSelected ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-data-grid-checkbox${rowData?.rowSelected ? ' checked' : ''}${isDisabled ? ' disabled' : ''}"></span></span>`;
  }

  /** Shows a checkbox column */
  checkbox(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const isDisabled = this.#isDisabled(index, '', columnData, rowData);
    const dataValue = this.#extractValue(rowData, columnData.field);
    let value = stringToBool(dataValue);
    value = dataValue === 'No' ? false : dataValue;
    value = dataValue === 'Yes' ? false : dataValue;
    return `<span class="ids-data-grid-checkbox-container"><span role="checkbox" aria-checked="${value ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-data-grid-checkbox${value ? ' checked' : ''}${isDisabled ? ' disabled' : ''}"></span></span>`;
  }

  /** Shows a selection radio column */
  selectionRadio(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const isDisabled = this.#isDisabled(index, '', columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';
    return `<span class="ids-data-grid-radio-container"><span role="radio" aria-checked="${rowData?.rowSelected ? 'true' : 'false'}" aria-label="${columnData.name}" class="ids-data-grid-radio${rowData?.rowSelected ? ' checked' : ''}${disabled}"></span></span>`;
  }

  /** Shows an ids-button */
  button(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    // Type / disabled / icon / text
    return `<ids-button tabindex="-1"${disabled}${columnData.type ? ` type="${columnData.type}"` : ' appearance="tertiary"'}>
      <span class="audible">${columnData.text || ' Button'}</span>
      ${columnData.icon ? `<ids-icon icon="${columnData.icon}"></ids-icon>` : ''}
      <span class="audible">${columnData.text || ' Button'}</span>
    </ids-button>`;
  }

  /** Shows an ids-badge */
  badge(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';
    const color = this.#color(index, value, columnData, rowData);
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    return `<ids-badge color="${color || ''}"${disabled}>${value}</ids-badge>`;
  }

  /** Shows an Tree */
  tree(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value = this.#extractValue(rowData, columnData.field);
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

  /* Shows ids-alert, and the field value will appear in a tooltip. An `icon` option can be provided as an override. */
  alert(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value && !columnData.icon) return '';

    const icon = columnData.icon ?? 'alert';
    const tooltip = value ? `tooltip="${value}"` : '';
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    return `
      <span class="text-ellipsis">
        <ids-alert icon="${icon}"${tooltip}${disabled}></ids-alert>
      </span>
    `;
  }

  /* Shows ids-color. If a `color` option is provided, the field's value will appear in a tooltip. */
  color(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    if (!columnData.color && !value) return `<span class="text-ellipsis"><ids-color${disabled}></ids-color></span>`;

    const color = this.#color(index, value, columnData, rowData);

    const hex = color || value || '#C2A1F1';
    const tooltip = !color && value ? ` tooltip="${value}"` : '';

    return `
      <span class="text-ellipsis">
        <ids-color hex="${hex}"${tooltip}${disabled}></ids-color>
      </span>
    `;
  }

  /* Shows the field value as an ids-icon. An `icon` and `size` option can be provided as overrides. */
  icon(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value && !columnData.icon) return '';

    const color = this.#color(index, value, columnData, rowData) || '';
    const badgeColor = color ? ` badge-color="${color}" badge-position="top-left"` : '';

    const sizes = ['small', 'medium', 'large', 'xl', 'xxl'];
    let size = this.#size(index, value, columnData, rowData) || '';
    size = sizes.includes(size) ? size : 'large';

    const icon = String(columnData.icon || value).replace('icon-', '');
    const text = (columnData.icon && typeof value === typeof '') ? value : '';
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    return `
      <span class="text-ellipsis">
        <ids-icon icon="${icon}" size="${size}"${badgeColor}${disabled}></ids-icon><span>${text}</span>
      </span>
    `;
  }

  /* Shows the field value as a `star-filled` or `star-outlined`. A `size` option can be provided as an override. */
  favorite(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);

    return this.rating(
      {
        ...rowData,
        [String(columnData.field)]: value ? 1 : 0,
      },
      {
        ...columnData,
        max: 1,
        min: 0,
      },
      index,
    );
  }

  /* Shows the field value as an `ids-tag`. A `color` option can be provdied as an override. */
  tag(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';
    const color = this.#color(index, value, columnData, rowData);
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    return `<ids-tag color="${color || ''}"${disabled}>${value}</ids-tag>`;
  }

  /*
    Shows the field value as an `ids-progress`. A `text` option can be provided to customize the label.
    A `color` and `max` option can be provided as overrides.
  */
  progress(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    // const color = this.#color(index, value, columnData, rowData);

    const val = Number.isNaN(value) ? 0 : value;
    let max = columnData.max ?? 10;
    if (!columnData.max && value > 1) {
      const digitCount = String(Math.floor(value)).length;
      max = parseInt(`1`.padEnd(digitCount + 1, '0'));
    }

    const isDisabled = this.#isDisabled(index, val, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    // TODO: Fix label and label-audible attribute
    const label = `label="${columnData?.text || `${val} of ${max}`}" label-audible`;

    return `
      <ids-progress-bar ${label} max="${max}"${disabled} value="${val}" readonly>
      </ids-progress-bar>
    `;
  }

  /*
    Shows the field value as an `ids-rating`. A `text` option can be provided to customize the label.
    A `color` and `max` option can be provided as overrides.
  */
  rating(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    const color = this.#color(index, value, columnData, rowData);

    const max = columnData.max ?? 5;
    let val = Number.isNaN(value) ? 0 : value;
    if ((!columnData.max && val > 1) || val > max) {
      const digitCount = String(Math.floor(val)).length;
      const divisor = parseInt(`1`.padEnd(digitCount + 1, '0'));

      if (val > 10) {
        val = (val / divisor) * max;
      }
    }

    const sizes = ['small', 'medium', 'large', 'xl', 'xxl'];
    let size = this.#size(index, value, columnData, rowData) || '';
    size = sizes.includes(size) ? size : 'large';

    const label = columnData.text ?? `${val} of ${max} stars`;
    const readonly = this.#readonly(index, value, columnData, rowData) ?? true;
    const isDisabled = this.#isDisabled(index, val, columnData, rowData);

    return `
      <span class="text-ellipsis">
        <ids-rating
          label="${label}"
          size="${size}"
          stars="${max}"
          value="${val}"
          ${color ? `color="${color}"` : ''}
          ${readonly ? 'readonly' : ''}
          ${isDisabled ? 'disabled' : ''}
        >
        </ids-rating>
      </span>
    `;
  }

  /*
    Shows the field value as an `ids-slider`. A `text` option can be provided to customize the label.
    A `color`, `max`, `min` and `type` option can be provided as overrides.
  */
  slider(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    const color = this.#color(index, value, columnData, rowData);

    const min = columnData.min ?? 0;
    const max = columnData.max ?? 100;
    let val = Number.isNaN(value) ? 0 : value;
    if ((!columnData.max && val > 1) || val > max) {
      const digitCount = String(Math.floor(val)).length;
      const divisor = parseInt(`1`.padEnd(digitCount + 1, '0'));

      if (val > 10) {
        val = (val / divisor) * max;
      }
    }

    const type = columnData.type ?? 'single';
    const label = columnData.text ?? `${val} of ${max} stars`;
    const readonly = this.#readonly(index, value, columnData, rowData) ?? true;
    const isDisabled = this.#isDisabled(index, val, columnData, rowData);

    return `
      <ids-slider
        type="${type}"
        label="${label}"
        min="${Math.max(min, 0)}"
        max="${max}"
        value="${Math.min(val, max)}"
        show-tooltip
        ${color ? `color="${color}"` : ''}
        ${readonly ? 'readonly' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      </ids-slider>
    `;
  }

  /*
    Shows the field value as an `ids-step-chart`. A `text` option can be provided to customize the label.
    A `color` and `max` option can be provided as overrides.
  */
  stepChart(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    const color = this.#color(index, value, columnData, rowData);

    let max = columnData.max ?? 5;
    if (!columnData.max && value > 1) {
      const digitCount = String(Math.floor(value)).length;
      max = parseInt(`1`.padEnd(digitCount + 1, '0'));
    }

    let val = Number.isNaN(value) ? 0 : value;
    if (max > 10) {
      val = (val / max) * 10;
      max = 10;
    }

    // const label = columnData.text ?? `${val} of ${max} steps completed`;
    const completedSteps = Math.floor(val);
    const stepsInProgress = Math.ceil(val);
    const showStepsInProgress = completedSteps !== stepsInProgress;
    const isDisabled = this.#isDisabled(index, val, columnData, rowData);

    return `
      <ids-step-chart
        step-number="${Math.min(max, 10)}"
        steps-in-progress="${showStepsInProgress ? stepsInProgress : 0}"
        value="${Math.floor(val)}"
        progress-color="ruby02"
        ${color ? `color="${color}"` : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      </ids-step-chart>
    `;
  }

  /* Shows the field value as an `ids-image`. A `text` option can be provided to the `alt` and `title` attributes. */
  image(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';

    const metadata = columnData.text ? ` alt="${columnData.text}" title="${columnData.text}"` : '';
    const isDisabled = this.#isDisabled(index, value, columnData, rowData);
    const disabled = isDisabled ? ' disabled' : '';

    return `<ids-image src="${value}"${metadata}${disabled}></ids-image>`;
  }

  card(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';

    return `<ids-card>${value}</ids-card>`;
  }
}
