import { BaseWorker } from './base-worker';
import { Crc32Probe } from './crc32-probe';
import { DataLengthProbe } from './data-length-probe';
import { DataWorker } from './data-worker';
import { Utf8EncodeWorker } from './utf8-encode-worker';

export class ZipObject {
  name: string;

  dir: boolean;

  date: Date;

  comment: string;

  unixPermissions: any;

  dosPermissions: any;

  data: any;

  dataBinary = false;

  options: any;

  constructor(name: string, data: any, options: any) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.unixPermissions = options.unixPermissions;
    this.dosPermissions = options.dosPermissions;

    this.data = data;
    this.dataBinary = options.binary;
    // keep only the compression
    this.options = {
      compression: options.compression,
      compressionOptions: options.compressionOptions
    };
  }

  compressWorker(compression: any) {
    let result: BaseWorker = new DataWorker(this.data);

    if (!this.dataBinary) {
      result = result.pipe(new Utf8EncodeWorker());
    }

    result = result
      .pipe(new Crc32Probe())
      .pipe(new DataLengthProbe('uncompressedSize'))
      .pipe(new BaseWorker('STORE compression'))
      .pipe(new DataLengthProbe('compressedSize'))
      .withStreamInfo('compression', compression);

    return result;
  }
}
