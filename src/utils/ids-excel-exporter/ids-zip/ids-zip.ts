import {
  forceTrailingSlash,
  getTypeOf,
  parentFolder,
  string2binary,
  string2buf
} from './ids-zip-util';
import { StreamHelper } from './stream-helper';
import { ZipFileWorker } from './zip-file-worker';
import { ZipObject } from './zip-object';

export type IdsZipOptions = {
  type: any;
  mimeType: string;
  comment?: string
};

/**
 * Add a file in the current folder.
 * @param {any} self Object context
 * @param {string} name the name of the file
 * @param {any} data the data of the file
 * @param {boolean} isDir is directory
 */
function fileAdd(self: any, name: string, data: any, isDir: boolean) {
  // be sure sub folders exist
  let dataType = getTypeOf(data);

  const o = {
    binary: !!isDir,
    dir: !!isDir,
    date: new Date(),
    compression: isDir ? 'STORE' : null,
    compressionOptions: null
  };

  name = isDir ? forceTrailingSlash(name) : name;

  // create parent folders
  const parent = parentFolder(name);
  if (parent) folderAdd(self, parent);

  // if entry is a directory
  if (o.dir || !data || data.length === 0) {
    data = '';
    dataType = 'string';
  }

  const zipObjectContent = o.binary ? string2binary(data) : data;
  const object = new ZipObject(name, zipObjectContent, o);
  self.files[name] = object;
}

/**
 * Add a (sub) folder in the current folder.
 * @param {any} self Object context
 * @param {string} name the folder's name
 * @returns {object} the new folder.
 */
function folderAdd(self: any, name: string) {
  name = forceTrailingSlash(name);

  // Does this folder already exist?
  if (!self.files[name]) {
    fileAdd(self, name, null, true);
  }
  return self.files[name];
}

export class IdsZip {
  // folder root
  root = '';

  // zip object
  files: Record<string, ZipObject> = {};

  // zip comment
  comment = '';

  clone() {
    const newZip = new IdsZip();
    for (const i in this) {
      if (typeof this[i] !== 'function') {
        (newZip as any)[i] = this[i];
      }
    }
    return newZip;
  }

  file(name: string, data: any) {
    name = this.root + name;
    fileAdd(this, name, data, false);
    return this;
  }

  folder(folderName: string) {
    const name = this.root + folderName;
    const newFolder = folderAdd(this, name);

    // Allow chaining by returning a new object with this folder as the root
    const ret = this.clone();
    ret.root = newFolder.name;

    return ret;
  }

  generate(options: IdsZipOptions) {
    return this.generateInternalStream(options).accumulate();
  }

  generateInternalStream(options: IdsZipOptions) {
    const optDefaults = {
      streamFiles: false,
      type: '',
      platform: 'UNIX',
      mimeType: 'application/zip',
      encodeFileName: string2buf,
      comment: ''
    };
    const opts = {
      ...optDefaults,
      ...options
    };
    const comment = opts.comment || this.comment || '';
    const zipFileWorker = this.generateWorker(opts, comment);

    return new StreamHelper(zipFileWorker, opts.mimeType);
  }

  generateWorker(options: any, comment: any): ZipFileWorker {
    const zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
    let entriesCount = 0;

    try {
      // eslint-disable-next-line guard-for-in
      for (const filename in this.files) {
        const zipObject = this.files[filename];
        const relativePath = filename.slice(this.root.length, filename.length);

        if (relativePath && filename.slice(0, this.root.length) === this.root) { // the file is in the current root
          entriesCount++;
          const compression = { magic: '\x00\x00' };
          const dir = zipObject.dir;
          const date = zipObject.date;

          // file._compressWorker returns DataWorker
          zipObject.compressWorker(compression)
            .withStreamInfo('file', {
              name: relativePath,
              dir,
              date,
              comment: ''
            })
            .pipe(zipFileWorker);
        }
      }

      zipFileWorker.entriesCount = entriesCount;
    } catch (e) {
      zipFileWorker.error(e);
    }

    return zipFileWorker;
  }
}
