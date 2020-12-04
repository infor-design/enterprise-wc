class IdsDataGridFormatters {
  text(rowData, columnData) {
    const value = rowData[columnData.field];
    const str = ((value === null || value === undefined || value === '') ? '' : value.toString());
    return str;
  }
}

export { IdsDataGridFormatters };
