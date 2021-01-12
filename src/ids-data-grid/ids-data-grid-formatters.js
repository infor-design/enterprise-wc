class IdsDataGridFormatters {
  text(/** @type {any} */ rowData, /** @type {any} */ columnData) {
    const value = rowData[columnData.field];
    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return `<span class="text-ellipsis">${str}</span>`;
  }
}

export { IdsDataGridFormatters };
