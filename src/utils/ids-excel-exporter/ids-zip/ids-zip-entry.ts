import { crc32 } from './crc32';

export class ZipEntry {
  name: string;

  dir: boolean;

  date: Date;

  data: string | Uint8Array;

  compressedSize = 0;

  uncompressedSize = 0;

  compression = '\x00\x00';

  crc32 = 0;

  comment = '';

  constructor(name: string, data: any, isDir: boolean) {
    this.name = isDir ? this.forceTrailingSlash(name) : name;
    this.dir = isDir;
    this.date = new Date();
    this.data = data;
  }

  processData(): Uint8Array {
    let data: Uint8Array = new Uint8Array();

    if (typeof this.data === 'string' && this.data.length) {
      data = this.encodeData(this.data);
      this.crc32 = crc32(0, data, data.length, 0);
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
}
