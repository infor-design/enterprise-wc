import { Crc32Probe } from './Crc32Probe';
import { DataLengthProbe } from './DataLengthProbe';
import { DataWorker } from './DataWorker';
import { GenericWorker } from './GenericWorker';
import { Utf8EncodeWorker } from './Utf8EncodeWorker';

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

  internalStream(type) {
    var result = null, outputType = 'string';
    try {
      if (!type) {
        throw new Error('No output type specified.');
      }
      outputType = type.toLowerCase();
      var askUnicodeString = outputType === 'string' || outputType === 'text';
      if (outputType === 'binarystring' || outputType === 'text') {
        outputType = 'string';
      }
      result = this._decompressWorker();

      var isUnicodeString = !this._dataBinary;

      if (isUnicodeString && !askUnicodeString) {
        result = result.pipe(new Utf8EncodeWorker());
      }
      if (!isUnicodeString && askUnicodeString) {
        result = result.pipe(new utf8.Utf8DecodeWorker());
      }
    } catch (e) {
      result = new GenericWorker('error');
      result.error(e);
    }

    return new StreamHelper(result, outputType, '');
  }

  async(type, onUpdate) {
    return this.internalStream(type).accumulate(onUpdate);
  }

  compressWorker(compression) {
    let result = new DataWorker(this.data);

    if (!this.dataBinary) {
      result = result.pipe(new Utf8EncodeWorker());
    }

    result = result
      .pipe(new Crc32Probe())
      .pipe(new DataLengthProbe('uncompressedSize'))
      .pipe(new GenericWorker('STORE compression'))
      .pipe(new DataLengthProbe('compressedSize'))
      .withStreamInfo('compression', compression);

    return result;
  }
}