/**
 * Download blob as file
 * @param {Blob} blob data
 * @param {string} name filename
 */
export function saveAs(blob: Blob, name: string) {
  const a = document.createElement('a');
  name = name || blob.name || 'download';
  a.download = name;
  a.rel = 'noopener';

  // Support blobs
  a.href = URL.createObjectURL(blob);

  setTimeout(() => {
    URL.revokeObjectURL(a.href);
  }, 4E4); // 40s

  setTimeout(() => {
    try {
      a.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
      const evt = document.createEvent('MouseEvents');
      a.dispatchEvent(evt);
    }
  }, 0);
}
