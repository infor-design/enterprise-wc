import IdsHyperLink from '../ids-hyperlink/ids-hyperlink';

/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
export class IdsDataGridFormatters {
  /** Formats Just the string Data Removing Nulls and Undefined */
  nullToString(rowData, columnData) {
    const value = rowData[columnData.field];
    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  }

  /** Formats Just the object Data Removing Nulls and Undefined */
  nullToObj(rowData, columnData) {
    const value = rowData[columnData.field];
    const str = ((value === null || value === undefined || value === '') ? '' : value);
    return str;
  }

  /** Formats Text */
  text(rowData, columnData) {
    return `<span class="text-ellipsis">${this.nullToString(rowData, columnData)}</span>`;
  }

  /** Masks text with stars */
  password(rowData, columnData) {
    return `<span class="text-ellipsis">${this.nullToString(rowData, columnData).replace(/./g, '*')}</span>`;
  }

  /** Formats a sequencing running count of rows */
  rowNumber(_rowData, _columnData, index) {
    return `<span class="text-ellipsis">${index}</span>`;
  }

  /** Formats date data as a date string in the desired format */
  date(rowData, columnData, _index, api) {
    let value = this.nullToObj(rowData, columnData);
    value = api.locale.formatDate(value, columnData.formatOptions);
    return `<span class="text-ellipsis">${value}</span>`;
  }

  /** Formats date data as a time string in the desired format */
  time(rowData, columnData, _index, api) {
    let value = this.nullToObj(rowData, columnData);
    value = api.locale.formatDate(value, columnData.formatOptions || { timeStyle: 'short' });
    return `<span class="text-ellipsis">${value}</span>`;
  }

  /** Formats number data as a decimal string in the specific locale */
  decimal(rowData, columnData, _index, api) {
    let value = this.nullToObj(rowData, columnData);
    value = api.locale.formatNumber(value, columnData.formatOptions
      || { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `<span class="text-ellipsis">${value === 'NaN' ? '' : value}</span>`;
  }

  /** Formats number data as a integer string in the specific locale */
  integer(rowData, columnData, _index, api) {
    let value = this.nullToObj(rowData, columnData);
    const opts = columnData.formatOptions || { };
    opts.style = 'integer';

    value = api.locale.formatNumber(value, opts);
    return `<span class="text-ellipsis">${value === 'NaN' ? '' : value}</span>`;
  }

  /** Formats number data as a ids-hyperlink */
  hyperlink(rowData, columnData) {
    const value = columnData.text || this.nullToString(rowData, columnData);
    if (!value) {
      return '';
    }
    let colHref = columnData.href || '#';

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
    return `<ids-hyperlink href="${colHref}">${value}</span>`;
  }
}
