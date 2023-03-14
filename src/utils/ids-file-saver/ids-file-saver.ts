/**
 * Helper function to download file
 * @param {string} filename filename with extension
 * @param {string} data Blob or href string
 */
export function saveAs(filename: string, data: Blob | string) {
  const a = document.createElement('a');
  a.rel = 'noopener';
  a.download = filename;
  a.href = data instanceof Blob ? URL.createObjectURL(data) : data;
  a.dispatchEvent(new MouseEvent('click'));
  URL.revokeObjectURL(a.href);
}
