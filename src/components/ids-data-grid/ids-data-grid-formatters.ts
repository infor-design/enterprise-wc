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

  /** Used to get the color via the function  or text */
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
    return `<span class="text-ellipsis">${value}</span>`;
  }

  /** Formats date data as a time string in the desired format */
  time(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number, api: IdsDataGrid): string {
    let value: any = this.#extractValue(rowData, columnData.field);
    value = api.localeAPI?.formatDate(value, columnData.formatOptions || { timeStyle: 'short' }) ?? value.toString();
    return `<span class="text-ellipsis">${value}</span>`;
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
        class="dropdown-cell-icon">
      </ids-icon>
    `;
  }

  /* Shows ids-alert, and the field value will appear in a tooltip. An `icon` option can be provided as an override. */
  alert(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value && !columnData.icon) return '';

    const icon = columnData.icon ?? 'alert';
    const tooltip = value ? `tooltip="${value}"` : '';

    return `<ids-alert icon="${icon}" ${tooltip}></ids-alert>`;
  }

  /* Shows ids-color. If a `color` option is provided, the field's value will appear in a tooltip. */
  color(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!columnData.color && !value) return '<ids-color></ids-color>';

    const color = this.#color(index, value, columnData, rowData);

    const hex = color || value || '#C2A1F1';
    const tooltip = !color && value ? `tooltip="${value}"` : '';

    return `<ids-color hex="${hex}" ${tooltip}></ids-color>`;
  }

  /* Shows the field value within an ids-counts. A `color` option can be provided to override the color of ids-count. */
  counts(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    const color = this.#color(index, value, columnData, rowData);

    return `
      <ids-counts compact color="${color || ''}">
        <ids-text count-value>${Number.isNaN(value) ? 0 : value}</ids-text>
      </ids-counts>
    `;
  }

  /* Shows the field value as an ids-icon. An `icon` and `size` option can be provided as overrides. */
  icon(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value && !columnData.icon) return '';

    const color = this.#color(index, value, columnData, rowData) || '';
    const badgeColor = color ? `badge-color="${color}" badge-position="top-left"` : '';

    const sizes = ['small', 'medium', 'large', 'xl', 'xxl'];
    let size = this.#size(index, value, columnData, rowData) || '';
    size = sizes.includes(size) ? size : 'large';

    const icon = String(columnData.icon || value).replace('icon-', '');
    const text = (columnData.icon && typeof value === typeof '') ? value : '';

    return `<ids-icon icon="${icon}" size="${size}" ${badgeColor}></ids-icon>${text}`;
  }

  /* Shows the field value as a `star-filled` or `star-outlined`. A `size` option can be provided as an override. */
  favorite(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);

    return this.icon(
      rowData,
      {
        ...columnData,
        icon: value ? 'star-filled' : 'star-outlined',
      },
      index,
    );
  }

  /* Shows the field value as an `ids-tag`. A `color` option can be provdied as an override. */
  tag(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';
    const color = this.#color(index, value, columnData, rowData);

    return `<ids-tag color="${color || ''}">${value}</ids-tag>`;
  }

  /*
    Shows the field value as an `ids-progress`. A `text` option can be provided to customize the label.
    A `color` and `max` option can be provided as overrides.
  */
  progress(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    // const color = this.#color(index, value, columnData, rowData);

    const val = Number.isNaN(value) ? 0 : value;
    let max = columnData.max ?? 10;
    if (!columnData.max && value > 1) {
      const digitCount = String(Math.floor(value)).length;
      max = parseInt(`1`.padEnd(digitCount + 1, '0'));
    }

    // TODO: Fix label and label-audible attribute
    // const label = columnData.text ? `label="${columnData.text}" label-audible` : '';
    const label = columnData.text ? `label="${columnData.text} (${val} / ${max})"` : '';

    return `
      <ids-progress-bar ${label} max="${max}" value="${val}">
      </ids-progress-bar>
    `;
  }

  /*
    Shows the field value as an `ids-rating`. A `text` option can be provided to customize the label.
    A `color` and `max` option can be provided as overrides.
  */
  rating(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    const color = this.#color(index, value, columnData, rowData) || 'azure06';

    const max = columnData.max ?? 5;
    let val = Number.isNaN(value) ? 0 : value;
    if ((!columnData.max && val > 1) || val > max) {
      const digitCount = String(Math.floor(val)).length;
      const divisor = parseInt(`1`.padEnd(digitCount + 1, '0'));

      if (val > 10) {
        val = (val / divisor) * max;
      }
    }

    const label = columnData.text ?? `${val} of ${max} stars`;
    const readonly = this.#readonly(index, value, columnData, rowData) ? 'readonly' : '';

    return `
      <ids-rating
        label="${label}"
        color="${color}"
        stars="${max}"
        value="${val}"
        ${readonly}
      >
      </ids-rating>
    `;
  }

  /*
    Shows the field value as an `ids-slider`. A `text` option can be provided to customize the label.
    A `color`, `max`, `min` and `type` option can be provided as overrides.
  */
  slider(rowData: Record<string, unknown>, columnData: IdsDataGridColumn, index: number): string {
    const value: any = parseFloat(this.#extractValue(rowData, columnData.field));
    const color = this.#color(index, value, columnData, rowData) || 'azure06';

    const type = columnData.type ?? 'single';
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

    const label = columnData.text ?? `${val} of ${max} stars`;
    const readonly = this.#readonly(index, value, columnData, rowData) ? 'readonly' : '';

    return `
      <ids-slider
        type="${type}"
        label="${label}"
        color="${color}"
        min="${min}"
        max="${max}"
        value="${val}"
        show-tooltip
        ${readonly}
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
    const color = this.#color(index, value, columnData, rowData) || 'azure06';

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

    const label = columnData.text ?? `${val} of ${max} steps completed`;
    const completedSteps = Math.floor(val);
    const stepsInProgress = Math.ceil(val);
    const showStepsInProgress = completedSteps !== stepsInProgress;

    return `
      <ids-step-chart
        label="${label}"
        color="${color}"
        progress-color="ruby02"
        step-number="${Math.min(max, 10)}"
        steps-in-progress="${showStepsInProgress ? stepsInProgress : 0}"
        value="${Math.floor(val)}"
      >
      </ids-step-chart>
    `;
  }

  /* Shows the field value as an `ids-image`. A `text` option can be provided to the `alt` and `title` attributes. */
  image(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';

    const metadata = columnData.text ? `alt="${columnData.text}" title="${columnData.text}"` : '';

    return `<ids-image src="${value}" ${metadata}></ids-image>`;
  }

  card(rowData: Record<string, unknown>, columnData: IdsDataGridColumn): string {
    const value: any = this.#extractValue(rowData, columnData.field);
    if (!value) return '';

    return `<ids-card>${value}</ids-card>`;
  }
}
