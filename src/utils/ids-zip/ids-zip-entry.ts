// Create table on load. Used as reference to calculate crc checksum
const crcTable = (() => {
  let c;
  const table = [];

  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
})();

export class ZipEntry {
  // filename/dir name
  name: string;

  // is directory
  dir: boolean;

  // date modified
  date: Date;

  // file content
  data: string | Uint8Array;

  // compressed size
  // (compression not currently supported)
  compressedSize = 0;

  // uncompressed size
  uncompressedSize = 0;

  // compression algorithm (no compression)
  compression = '\x00\x00';

  // crc32 checksum
  crc32 = 0;

  // file comment
  comment = '';

  constructor(name: string, data: any, isDir: boolean) {
    this.name = isDir ? this.forceTrailingSlash(name) : name;
    this.dir = isDir;
    this.date = new Date();
    this.data = data;
  }

  /**
   * Processes file data and calculates size and checksum
   * @returns {Uint8Array} data converted to Uin8Array
   */
  processData(): Uint8Array {
    let data: Uint8Array = new Uint8Array();

    if (typeof this.data === 'string' && this.data.length) {
      data = this.encodeData(this.data);
      this.crc32 = this.calcCrc32(0, data, data.length, 0);
      this.compressedSize = data.length;
      this.uncompressedSize = data.length;
    }

    return data;
  }

  /**
   * Encode data string
   * @param {string} str string to convert
   * @returns {Uint8Array} buffer
   */
  private encodeData(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  private forceTrailingSlash(path: string): string {
    return path.slice(-1) !== '/' ? `${path}/` : path;
  }

  /**
   * Compute the crc32 of a buffer
   * @param {number} crc the starting value of the crc.
   * @param {any} buf the buffer to use.
   * @param {number} len the length of the buffer.
   * @param {number} pos the starting position for the crc32 computation.
   * @returns {number} the computed crc32
   */
  private calcCrc32(crc: number, buf: any, len: number, pos: number) {
    const t = crcTable;
    const end = pos + len;

    crc ^= (-1);

    for (let i = pos; i < end; i++) {
      crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
    }

    return (crc ^ (-1));
  }
}
