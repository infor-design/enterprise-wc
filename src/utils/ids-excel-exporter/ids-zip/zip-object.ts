import { Chunk, ZipWorker } from './zip-worker';
import { delay, getTypeOf, string2buf } from './ids-zip-util';
import { crc32wrapper } from './crc32';

interface ZipObjectFile {
  name: string;
  dir: boolean;
  date: Date;
  comment: string;
}

interface ZipMeta {
  compressedSize: number;
  uncompressedSize: number;
  compression: any;
  crc32: number;
  file: ZipObjectFile
}

export class ZipObject {
  name: string;

  dir: boolean;

  date: Date;

  comment: string;

  data: any;

  dataBinary = false;

  options: any;

  zipMeta: ZipMeta;

  constructor(name: string, data: any, options: any) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.data = data;
    this.dataBinary = options.binary;
    this.options = {
      compression: options.compression,
      compressionOptions: options.compressionOptions
    };

    this.zipMeta = {
      compressedSize: 0,
      uncompressedSize: 0,
      compression: { magic: '\x00\x00' },
      crc32: 0,
      file: {
        name: name,
        date: options.date,
        comment: '',
        dir: options.dir
      }
    };
  }

  compressWorker(compression: any): ZipWorker {
    let result: ZipWorker = new DataWorker(this.data);

    if (!this.dataBinary) {
      result = result.pipe(new Utf8EncodeWorker());
    }

    result = result
      .pipe(new Crc32Probe())
      .pipe(new DataLengthProbe('uncompressedSize'))
      //.pipe(new ZipWorker('STORE compression'))
      .pipe(new DataLengthProbe('compressedSize'))
      .withStreamInfo('compression', compression);

    return result;
  }
}

const DEFAULT_BLOCK_SIZE = 16 * 1024;

export class DataWorker extends ZipWorker {
  dataIsReady = true;

  index = 0;

  max = 0;

  tickScheduled = false;

  data: any = null;

  type;

  constructor(data: any) {
    super('DataWorker');
    this.max = (data && data.length) || 0;
    this.data = data;
    this.type = getTypeOf(data);
  }

  cleanUp() {
    super.cleanUp();
    this.data = null;
  }

  resume() {
    if (!super.resume()) {
      return false;
    }

    if (!this.tickScheduled && this.dataIsReady) {
      this.tickScheduled = true;
      delay(this.tickAndRepeat, [], this);
    }

    return true;
  }

  tickAndRepeat() {
    this.tickScheduled = false;
    if (this.isPaused || this.isFinished) {
      return;
    }
    this.tick();
    if (!this.isFinished) {
      delay(this.tickAndRepeat, [], this);
      this.tickScheduled = true;
    }
  }

  tick() {
    if (this.isPaused || this.isFinished) {
      return false;
    }

    const size = DEFAULT_BLOCK_SIZE;
    const nextIndex = Math.min(this.max, this.index + size);

    if (this.index >= this.max) {
      // EOF
      return this.end();
    }

    const data = this.type === 'string'
      ? this.data?.substring(this.index, nextIndex)
      : this.data?.subarray(this.index, nextIndex);
    this.index = nextIndex;

    return this.push({
      data,
      meta: {
        percent: this.max ? this.index / this.max * 100 : 0
      }
    });
  }
}

export class Utf8EncodeWorker extends ZipWorker {
  constructor() {
    super('utf8 encoder');
  }

  processChunk(chunk: Chunk) {
    this.push({
      data: string2buf(chunk.data),
      meta: chunk.meta
    });
  }
}

/**
 * A worker which calculate the crc32 of the data flowing through.
 */
export class Crc32Probe extends ZipWorker {
  constructor() {
    super('Crc32Probe');
    this.withStreamInfo('crc32', 0);
  }

  processChunk(chunk: Chunk) {
    this.streamInfo.crc32 = crc32wrapper(chunk.data, this.streamInfo.crc32 || 0);
    this.push(chunk);
  }
}

/**
 * A worker which calculate the total length of the data flowing through.
 * @param {string} propName the name used to expose the length
 */
export class DataLengthProbe extends ZipWorker {
  propName;

  constructor(propName: string) {
    super(`DataLengthProg for ${propName}`);
    this.propName = propName;
    this.withStreamInfo(propName, 0);
  }

  processChunk(chunk: Chunk) {
    if (chunk) {
      const length = this.streamInfo[this.propName] || 0;
      this.streamInfo[this.propName] = length + chunk.data.length;
    }

    this.push(chunk);
  }
}
