import { ZipEntry } from './ids-zip-entry';

// Zip entry constants used in zip part headers
const SIGNATURE = {
  LOCAL_FILE_HEADER: 'PK\x03\x04',
  CENTRAL_FILE_HEADER: 'PK\x01\x02',
  CENTRAL_DIRECTORY_END: 'PK\x05\x06',
  DIR_FILE_ATTR: '\x10\x00\xFD\x41',
  NON_DIR_FILE_ATTR: '\x00\x00\xB4\x81'
};

export class IdsZip {
  // folder root
  private root = '';

  // zip entries
  private entries: Record<string, ZipEntry> = {};

  // byte count (size)
  private bytesWritten = 0;

  // collection of encoded zip file records, concatenated at the end
  private dataArray: Array<Uint8Array> = [];

  /**
   * Add a zip entry
   * @param {string} name file name
   * @param {string} data string data
   */
  file(name: string, data: string) {
    name = this.root + name;
    this.addEntry(name, data, false);
  }

  /**
   * Creates Zip file containing all entries
   * @param {string} mimeType mime type
   * @returns {Blob} Blob of zip file
   */
  zip(mimeType: string): Blob {
    return this.createZipFile(Object.values(this.entries), mimeType);
  }

  /**
   * Create folder zip entry
   * @param {string} name folder name
   * @returns {ZipEntry} folder zip entry
   */
  private addFolderEntry(name: string): ZipEntry {
    if (!this.entries[name]) {
      this.addEntry(name, null, true);
    }

    return this.entries[name];
  }

  /**
   * Creates zip entry
   * @param {string} name file name
   * @param {string} data content data
   * @param {boolean} isDir true if entry is a folder
   */
  private addEntry(name: string, data: any, isDir: boolean): void {
    // create parent folders
    const parent = this.isNested(name);
    if (parent) this.addFolderEntry(parent);

    // if folder or data empty, initialize as empty Uint8Array
    if (!!isDir || !data || data.length === 0) {
      data = new Uint8Array();
    }

    const zipEntry = new ZipEntry(name, data, isDir);
    this.entries[name] = zipEntry;
  }

  /**
   * Checks if path is nested in folders
   * @param {string} path path name
   * @returns {string} parent folder
   */
  private isNested(path: string): string {
    if (path.slice(-1) === '/') {
      path = path.substring(0, path.length - 1);
    }
    const lastSlash = path.lastIndexOf('/');
    return (lastSlash > 0) ? path.substring(0, lastSlash) : '';
  }

  /**
   * Process all zip entries into a Blob
   * @param {Array<ZipEntry>} entries array of zip entries
   * @param {string} mimeType mime type
   * @returns {Blob} Blob of zip file
   */
  private createZipFile(entries: Array<ZipEntry>, mimeType: string): Blob {
    const entryDirs: string[] = [];

    entries.forEach((entry: ZipEntry) => {
      const entryParts = this.processEntry(entry, this.bytesWritten);
      // write entry header
      this.writeData(entryParts.localFileHeader);
      // write entry content
      this.writeData(entryParts.content);
      // cache entry dir record for central directory section
      entryDirs.push(entryParts.centralDirectoryFileHeader);
    });

    // write EOCD
    this.closeZipFile(entryDirs);
    const dataArray = this.concat(this.dataArray);

    return new Blob([dataArray.buffer], { type: mimeType });
  }

  /**
   * Procses zip file entry and break into separate records
   * @param {ZipEntry} entry zip entry
   * @param {number} entryOffset next starting position for entry
   * @returns {Record<string, any>} zip entry parts
   */
  private processEntry(entry: ZipEntry, entryOffset: number) {
    const content = entry.processData();
    const headerPartial = this.generateHeaderPartial(entry);
    const localFileHeader = this.generateLocalFileHeader(headerPartial, entry);
    const centralDirectoryFileHeader = this.generateCentralDirectoryFileHeader(entry, headerPartial, entryOffset);

    return {
      localFileHeader,
      centralDirectoryFileHeader,
      content
    };
  }

  /**
   * Prepares End of Central Directory record to end zip package
   * @param {Array<string>} entryDirs dir zip entries
   */
  private closeZipFile(entryDirs: string[]): void {
    const localDirSize = this.bytesWritten;

    for (let i = 0; i < entryDirs.length; i++) {
      this.writeData(entryDirs[i]);
    }

    const centralDirSize = this.bytesWritten - localDirSize;
    const dirEnd = this.generateEndOfCentralDirectory(
      entryDirs.length,
      centralDirSize,
      localDirSize
    );

    this.writeData(dirEnd);
  }

  /**
   * Appends and transforms data to data array
   * Also tracks current size of all entries
   * @param {any} data string or Uint8Array
   */
  private writeData(data: any): void {
    if (data && data.length) {
      this.dataArray.push(this.transform(data));
      this.bytesWritten += data.length;
    }
  }

  /**
   * Transforms string data into Uint8Array
   * @param {string | Uint8Array} data data
   * @returns {Uint8Array} encoded data
   */
  private transform(data: string | Uint8Array): Uint8Array {
    if (typeof data !== 'string') return data;

    const output = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
      // trims charCode to 8 bits
      output[i] = data.charCodeAt(i) & 0xFF;
    }

    return output;
  }

  /**
   * Flattens data array collection
   * @param {Array<Uint8Array>} dataArray data array of all zip entries
   * @returns {Uint8Array} flattend dataArray
   */
  private concat(dataArray: Array<Uint8Array>): Uint8Array {
    const totalLength = dataArray.reduce((total, data) => total + data.length, 0);
    const res = new Uint8Array(totalLength);
    let index = 0;

    for (let i = 0; i < dataArray.length; i++) {
      res.set(dataArray[i], index);
      index += dataArray[i].length;
    }

    return res;
  }

  /**
   * Create partial header information shared between
   * Local and Central Directory file header
   * @see {@link https://docs.fileformat.com/compression/zip/#local-file-header}
   * @see {@link https://docs.fileformat.com/compression/zip/#central-directory-file-header}
   * @param {ZipEntry} entry zip entry
   * @returns {string} header represented in hex strings
   */
  private generateHeaderPartial(entry: ZipEntry): string {
    const compression = entry.compression;
    const date = entry.date;
    let modTime;
    let modDate;

    // calc last modified time
    modTime = date.getUTCHours();
    modTime <<= 6;
    modTime |= date.getUTCMinutes();
    modTime <<= 5;
    modTime |= date.getUTCSeconds() / 2;

    // calc last modified date
    modDate = date.getUTCFullYear() - 1980;
    modDate <<= 4;
    modDate |= (date.getUTCMonth() + 1);
    modDate <<= 5;
    modDate |= date.getUTCDate();

    return [
      // Version needed to extract (minimum)
      '\x0A\x00',
      // General purpose bit flag
      '\x00\x00',
      // Compression method
      compression,
      // File last modification time
      this.decToHex(modTime, 2),
      // File last modification date
      this.decToHex(modDate, 2),
      // CRC-32
      this.decToHex(entry.crc32, 4),
      // Compressed size
      this.decToHex(entry.compressedSize, 4),
      // Uncompressed size
      this.decToHex(entry.uncompressedSize, 4),
      // File name length (n)
      this.decToHex(entry.name.length, 2),
      // Extra field length (m)
      '\x00\x00'
    ].join('');
  }

  /**
   * Create Locale File Header string
   * @see {@link https://docs.fileformat.com/compression/zip/#local-file-header}
   * @param {string} header header partial
   * @param {ZipEntry} entry zip entry
   * @returns {string} Locale File Header string
   */
  private generateLocalFileHeader(header: string, entry: ZipEntry): string {
    return SIGNATURE.LOCAL_FILE_HEADER + header + entry.name;
  }

  /**
   * Create Central Directory File Header string
   * @see {@link https://docs.fileformat.com/compression/zip/#central-directory-file-header}
   * @param {ZipEntry} entry zip entry
   * @param {string} header header partial
   * @param {number} offset entry starting position
   * @returns {string} Central Directory File Header string
   */
  private generateCentralDirectoryFileHeader(entry: ZipEntry, header: string, offset: number): string {
    // UNIX, version 3.0
    const VERSION_MADE_BY = 0x031E;
    // Reflects no OS permissions set for (read, write, execute), only difference is flag for directory
    const EXT_FILE_ATTR = entry.dir ? SIGNATURE.DIR_FILE_ATTR : SIGNATURE.NON_DIR_FILE_ATTR;

    return [
      // Central directory file header signature
      SIGNATURE.CENTRAL_FILE_HEADER,
      // Version made by
      this.decToHex(VERSION_MADE_BY, 2),
      // generateHeaderPartial
      header,
      // File comment length (k)
      '\x00\x00',
      // Disk number where file starts
      '\x00\x00',
      // Internal file attributes
      '\x00\x00',
      // External file attributes
      EXT_FILE_ATTR,
      // Relative offset of local file header.
      this.decToHex(offset, 4),
      // File name
      entry.name,
      // Extra field
      '',
      // File comment
      ''
    ].join('');
  }

  /**
   * Create End of Central Directory record
   * @see {@link https://docs.fileformat.com/compression/zip/#end-of-central-directory-record}
   * @param {number} entriesCount number of zip entries
   * @param {number} centralDirSize length of central directory record
   * @param {number} offset starting position for EOCD
   * @returns {string} End of Central Directory string
   */
  private generateEndOfCentralDirectory(entriesCount: number, centralDirSize: number, offset: number): string {
    return [
      // End of central directory signature
      SIGNATURE.CENTRAL_DIRECTORY_END,
      // Number of this disk
      '\x00\x00',
      // Disk where central directory starts
      '\x00\x00',
      // Number of central directory records on this disk
      this.decToHex(entriesCount, 2),
      // Total number of central directory records
      this.decToHex(entriesCount, 2),
      // Size of central directory (4 bytes)
      this.decToHex(centralDirSize, 4),
      // Offset of start of central directory, relative to start of archive
      this.decToHex(offset, 4),
      // Comment length (n)
      '\x00\x00',
      // Comment
      ''
    ].join('');
  }

  /**
   * Convert decimal value into a padded 8 bit hex strings
   * Returns hex string in little-endian order
   * @param {number} dec the number to convert.
   * @param {number} bytes the number of bytes to generate.
   * @returns {string} the result.
   */
  private decToHex(dec: number, bytes: number) {
    let hex = '';

    for (let i = 0; i < bytes; i++) {
      // get char code from first 8 bits of decimal value
      hex += String.fromCharCode(dec & 0xFF);
      // shift decimal by 8 bits
      dec >>>= 8;
    }

    return hex;
  }
}
