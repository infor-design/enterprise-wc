/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable operator-assignment */
import { ZipWorker, Chunk } from './zip-worker';
import { string2buf, transformTo } from './ids-zip-util';
import signature from './signature';

/**
 * Transform an integer into a string in hexadecimal.
 * @param {number} dec the number to convert.
 * @param {number} bytes the number of bytes to generate.
 * @returns {string} the result.
 */
function decToHex(dec: number, bytes: number) {
  let hex = '';
  let i;

  for (i = 0; i < bytes; i++) {
    hex += String.fromCharCode(dec & 0xff);
    // eslint-disable-next-line operator-assignment
    dec = dec >>> 8;
  }

  return hex;
}

function generateUnixExternalFileAttr(unixPermissions: any, isDir: any) {
  let result = unixPermissions;
  if (!unixPermissions) {
    // I can't use octal values in strict mode, hence the hexa.
    //  040775 => 0x41fd
    // 0100664 => 0x81b4
    result = isDir ? 0x41fd : 0x81b4;
  }
  return (result & 0xFFFF) << 16;
};

/**
 * Generate the DOS part of the external file attributes.
 * @param {any} dosPermissions the dos permissions or null.
 * @returns {number} a 32 bit integer.
 *
 * Bit 0     Read-Only
 * Bit 1     Hidden
 * Bit 2     System
 * Bit 3     Volume Label
 * Bit 4     Directory
 * Bit 5     Archive
 */
function generateDosExternalFileAttr(dosPermissions: any) {
  // the dir flag is already set for compatibility
  return (dosPermissions || 0) & 0x3F;
}

/**
 * Generate the various parts used in the construction of the final zip file.
 * @param {any} streamInfo the hash with information about the compressed file.
 * @param {boolean} streamedContent is the content streamed ?
 * @param {boolean} streamingEnded is the stream finished ?
 * @param {number} offset the current offset from the start of the zip file.
 * @param {string} platform let's pretend we are this platform (change platform dependents fields)
 * @param {Function} encodeFileName the function to encode the file name / comment.
 * @returns {any} the zip parts.
 */
function generateZipParts(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
  const file = streamInfo['file'];
  const compression = streamInfo['compression'];
  const useCustomEncoding = encodeFileName !== string2buf;
  const encodedFileName = transformTo('string', encodeFileName(file.name));
  const utfEncodedFileName = transformTo('string', string2buf(file.name));
  const comment = file.comment;
  const encodedComment = transformTo('string', encodeFileName(comment));
  const utfEncodedComment = transformTo('string', string2buf(comment));
  const useUTF8ForFileName = utfEncodedFileName.length !== file.name.length;
  const useUTF8ForComment = utfEncodedComment.length !== comment.length;
  let dosTime;
  let dosDate;
  const extraFields = '';
  const dir = file.dir;
  const date = file.date;

  const dataInfo = {
    crc32: 0,
    compressedSize: 0,
    uncompressedSize: 0
  };

  // if the content is streamed, the sizes/crc32 are only available AFTER
  // the end of the stream.
  if (!streamedContent || streamingEnded) {
    dataInfo.crc32 = streamInfo['crc32'];
    dataInfo.compressedSize = streamInfo['compressedSize'];
    dataInfo.uncompressedSize = streamInfo['uncompressedSize'];
  }

  let bitflag = 0;
  if (streamedContent) {
    // Bit 3: the sizes/crc32 are set to zero in the local header.
    // The correct values are put in the data descriptor immediately
    // following the compressed data.
    bitflag |= 0x0008;
  }
  if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
    // Bit 11: Language encoding flag (EFS).
    bitflag |= 0x0800;
  }

  let extFileAttr = 0;
  let versionMadeBy = 0;
  if (dir) {
    // dos or unix, we set the dos dir flag
    extFileAttr |= 0x00010;
  }
  if (platform === 'UNIX') {
    versionMadeBy = 0x031E; // UNIX, version 3.0
    extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
  } else { // DOS or other, fallback to DOS
    versionMadeBy = 0x0014; // DOS, version 2.0
    extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
  }

  // date
  // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
  // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
  // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html

  dosTime = date.getUTCHours();
  dosTime = dosTime << 6;
  dosTime = dosTime | date.getUTCMinutes();
  dosTime = dosTime << 5;
  dosTime = dosTime | date.getUTCSeconds() / 2;

  dosDate = date.getUTCFullYear() - 1980;
  dosDate = dosDate << 4;
  dosDate = dosDate | (date.getUTCMonth() + 1);
  dosDate = dosDate << 5;
  dosDate = dosDate | date.getUTCDate();

  let header = '';

  // version needed to extract
  header += '\x0A\x00';
  // general purpose bit flag
  header += decToHex(bitflag, 2);
  // compression method
  header += compression.magic;
  // last mod file time
  header += decToHex(dosTime, 2);
  // last mod file date
  header += decToHex(dosDate, 2);
  // crc-32
  header += decToHex(dataInfo.crc32, 4);
  // compressed size
  header += decToHex(dataInfo.compressedSize, 4);
  // uncompressed size
  header += decToHex(dataInfo.uncompressedSize, 4);
  // file name length
  header += decToHex(encodedFileName.length, 2);
  // extra field length
  header += decToHex(extraFields.length, 2);

  const fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;

  const dirRecord = signature.CENTRAL_FILE_HEADER +
    // version made by (00: DOS)
    decToHex(versionMadeBy, 2) +
    // file header (common to file and central directory)
    header +
    // file comment length
    decToHex(encodedComment.length, 2) +
    // disk number start
    '\x00\x00' +
    // internal file attributes TODO
    '\x00\x00' +
    // external file attributes
    decToHex(extFileAttr, 4) +
    // relative offset of local header
    decToHex(offset, 4) +
    // file name
    encodedFileName +
    // extra field
    extraFields +
    // file comment
    encodedComment;

  return {
    fileRecord,
    dirRecord
  };
};

/**
 * Generate the EOCD record.
 * @param {number} entriesCount the number of entries in the zip file.
 * @param {number} centralDirLength the length (in bytes) of the central dir.
 * @param {number} localDirLength the length (in bytes) of the local dir.
 * @param {string} comment the zip file comment as a binary string.
 * @param {Function} encodeFileName the function to encode the comment.
 * @returns {string} the EOCD record.
 */
function generateCentralDirectoryEnd(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
  let dirEnd = '';
  const encodedComment = transformTo('string', encodeFileName(comment));

  // end of central dir signature
  dirEnd = signature.CENTRAL_DIRECTORY_END +
    // number of this disk
    '\x00\x00' +
    // number of the disk with the start of the central directory
    '\x00\x00' +
    // total number of entries in the central directory on this disk
    decToHex(entriesCount, 2) +
    // total number of entries in the central directory
    decToHex(entriesCount, 2) +
    // size of the central directory   4 bytes
    decToHex(centralDirLength, 4) +
    // offset of start of central directory with respect to the starting disk number
    decToHex(localDirLength, 4) +
    // .ZIP file comment length
    decToHex(encodedComment.length, 2) +
    // .ZIP file comment
    encodedComment;

  return dirEnd;
};

/**
 * Generate data descriptors for a file entry.
 * @param {any} streamInfo the hash generated by a worker, containing information
 * on the file entry.
 * @returns {string} the data descriptors.
 */
function generateDataDescriptors(streamInfo) {
  let descriptor = '';
  descriptor = signature.DATA_DESCRIPTOR +
      // crc-32                          4 bytes
      decToHex(streamInfo['crc32'], 4) +
      // compressed size                 4 bytes
      decToHex(streamInfo['compressedSize'], 4) +
      // uncompressed size               4 bytes
      decToHex(streamInfo['uncompressedSize'], 4);

  return descriptor;
};

/**
 * A worker to concatenate other workers to create a zip file.
 * @param {boolean} streamFiles `true` to stream the content of the files,
 * `false` to accumulate it.
 * @param {string} comment the comment to use.
 * @param {string} platform the platform to use, "UNIX" or "DOS".
 * @param {Function} encodeFileName the function to encode file names and comments.
 */
export class ZipFileWorker extends ZipWorker {
  // The number of bytes written so far. This doesn't count accumulated chunks.
  bytesWritten = 0;

  // If `streamFiles` is false, we will need to accumulate the content of the
  // files to calculate sizes / crc32 (and write them *before* the content).
  // This boolean indicates if we are accumulating chunks (it will change a lot
  // during the lifetime of this worker).
  accumulate = false;

  // The buffer receiving chunks when accumulating content.
  contentBuffer: Array<Chunk> = [];

  // The list of generated directory records.
  dirRecords: Array<string> = [];

  // The offset (in bytes) from the beginning of the zip file for the current source.
  currentSourceOffset = 0;

  // The total number of entries in this zip file.
  entriesCount = 0;

  // the name of the file currently being added, null when handling the end of the zip file.
  // Used for the emitted metadata.
  currentFile = null;

  // The comment of the zip file
  zipComment;

  // The platform "generating" the zip file.
  zipPlatform;

  // the function to encode file names and comments.
  encodeFileName;

  // Should we stream the content of the files ?
  streamFiles;

  sources: Array<ZipWorker> = [];

  constructor(streamFiles: boolean, comment: string, platform: string, encodeFileName: any) {
    super('ZipFileWorker');
    this.zipComment = comment;
    this.zipPlatform = platform;
    this.encodeFileName = encodeFileName;
    this.streamFiles = streamFiles;
  }

  push(chunk: Chunk) {
    const currentFilePercent = chunk.meta.percent || 0;
    const entriesCount = this.entriesCount;
    const remainingFiles = this.sources.length;

    if (this.accumulate) {
      this.contentBuffer.push(chunk);
    } else {
      this.bytesWritten += chunk.data.length;

      ZipWorker.prototype.push.call(this, {
        data: chunk.data,
        meta: {
          currentFile: this.currentFile,
          percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
        }
      });
    }
  }

  /**
   * The worker started a new source (an other worker).
   * @param {any} streamInfo the streamInfo object from the new source.
   */
  openedSource(streamInfo: any) {
    this.currentSourceOffset = this.bytesWritten;
    this.currentFile = streamInfo.file.name;

    const streamedContent = this.streamFiles && !streamInfo.file.dir;

    // don't stream folders (because they don't have any content)
    if (streamedContent) {
      const record = generateZipParts(
        streamInfo,
        streamedContent,
        false,
        this.currentSourceOffset,
        this.zipPlatform,
        this.encodeFileName
      );
      this.push({
        data: record.fileRecord,
        meta: { percent: 0 }
      });
    } else {
      // we need to wait for the whole file before pushing anything
      this.accumulate = true;
    }
  }

  /**
   * The worker finished a source (an other worker).
   * @param {any} streamInfo the streamInfo object from the finished source.
   */
  closedSource(streamInfo: any) {
    this.accumulate = false;
    const streamedContent = this.streamFiles && !streamInfo.file.dir;
    const record = generateZipParts(
      streamInfo,
      streamedContent,
      true,
      this.currentSourceOffset,
      this.zipPlatform,
      this.encodeFileName
    );

    this.dirRecords.push(record.dirRecord);
    if (streamedContent) {
      // after the streamed file, we put data descriptors
      this.push({
        data: generateDataDescriptors(streamInfo),
        meta: { percent: 100 }
      });
    } else {
      // the content wasn't streamed, we need to push everything now
      // first the file record, then the content
      this.push({
        data: record.fileRecord,
        meta: { percent: 0 }
      });
      while (this.contentBuffer.length) {
        this.push(this.contentBuffer.shift()!);
      }
    }
    this.currentFile = null;
  }

  flush() {
    const localDirLength = this.bytesWritten;
    for (let i = 0; i < this.dirRecords.length; i++) {
      this.push({
        data: this.dirRecords[i],
        meta: { percent: 100 }
      });
    }
    const centralDirLength = this.bytesWritten - localDirLength;

    const dirEnd = generateCentralDirectoryEnd(
      this.dirRecords.length,
      centralDirLength,
      localDirLength,
      this.zipComment,
      this.encodeFileName
    );

    this.push({
      data: dirEnd,
      meta: { percent: 100 }
    });
  }

  /**
   * Prepare the next source to be read.
   */
  prepareNextSource() {
    this.previous = this.sources.shift()!;
    this.openedSource(this.previous!.streamInfo);
    this.previous!.resume();
  }

  registerPrevious(previous: ZipWorker) {
    this.sources.push(previous);
    const self = this;

    previous.on('data', (chunk) => self.processChunk(chunk));

    previous.on('end', () => {
      self.closedSource(self.previous?.streamInfo);
      if (self.sources.length) {
        self.prepareNextSource();
      } else {
        self.end();
      }
    });

    previous.on('error', (e) => self.error(e));

    return this;
  }

  resume(): boolean {
    if (!super.resume()) {
      return false;
    }

    if (!this.previous && this.sources.length) {
      this.prepareNextSource();
      return true;
    }

    if (!this.previous && !this.sources.length && !this.generatedError) {
      this.end();
      return true;
    }

    return true;
  }

  error(e: Error) {
    const sources = this.sources;
    if (!super.error(e)) {
      return false;
    }
    for (let i = 0; i < sources.length; i++) {
      sources[i].error(e);
    }

    return true;
  }

  lock() {
    super.lock();
    const sources = this.sources;
    for (let i = 0; i < sources.length; i++) {
      sources[i].lock();
    }
  }
}
