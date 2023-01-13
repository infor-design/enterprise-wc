import defaults from './defaults';
import {
  forceTrailingSlash,
  getTypeOf,
  parentFolder,
  string2binary,
  string2buf
} from './ids-zip-util';
import { ZipObject } from './zip-object';

export type IdsZipOptions = {
  mimeType: string;
  comment?: string
};

/**
 * Add a file in the current folder.
 * @param {any} self Object context
 * @param {string} name the name of the file
 * @param {any} data the data of the file
 * @param {any} originalOptions the options of the file
 */
function fileAdd(self: any, name: string, data: any, originalOptions: any) {
  // be sure sub folders exist
  let dataType = getTypeOf(data);

  const o = { ...defaults, ...originalOptions };
  o.date = o.date || new Date();

  name = o.dir ? forceTrailingSlash(name) : name;

  const parent = parentFolder(name);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (o.createFolders && parent) folderAdd(self, parent, true);

  const isUnicodeString = dataType === 'string' && o.binary === false && o.base64 === false;
  if (!originalOptions || typeof originalOptions.binary === 'undefined') {
    o.binary = !isUnicodeString;
  }

  if (o.dir || !data || data.length === 0) {
    o.base64 = false;
    o.binary = true;
    data = '';
    o.compression = 'STORE';
    dataType = 'string';
  }

  const zipObjectContent = o.binary && o.optimizedBinaryString !== true ? string2binary(data) : data;
  const object = new ZipObject(name, zipObjectContent, o);
  self.files[name] = object;
}

/**
 * Add a (sub) folder in the current folder.
 * @param {any} self Object context
 * @param {string} name the folder's name
 * @param {boolean} [createFolders] If true, automatically create sub folders. Defaults to false.
 * @returns {object} the new folder.
 */
function folderAdd(self: any, name: string, createFolders?: boolean) {
  createFolders = (typeof createFolders !== 'undefined') ? createFolders : defaults.createFolders;

  name = forceTrailingSlash(name);

  // Does this folder already exist?
  if (!self.files[name]) {
    fileAdd(self, name, null, {
      dir: true,
      createFolders
    });
  }
  return self.files[name];
}

export class IdsZip {
  // folder root
  root = '';

  // zip object
  files: ZipObject[] = [];

  // zip comment
  comment = '';

  clone() {
    const newZip = new IdsZip();
    newZip.root = this.root;
    newZip.files = this.files;
    newZip.comment = this.comment;
    return newZip;
  }

  file(name: string, data: any, opts: any) {
    name = this.root + name;
    fileAdd(this, name, data, opts);
    return this;
  }

  folder(arg: string) {
    if (!arg) return;

    const name = this.root + arg;
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
    const worker = this.generateWorker(opts, comment);

    return new StreamHelper(worker, opts.type || "string", opts.mimeType);
  }

  generateWorker(options, comment) {
    const zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
    let entriesCount = 0;

    try {
      for (const filename of this.files) {
        const file = this.files[filename];
        const relativePath = filename.slice(this.root.length, filename.length);

        if (relativePath && filename.slice(0, this.root.length) === this.root) { // the file is in the current root
          entriesCount++;
          const compression = { magic: '\x00\x00' };
          const dir = file.dir;
          const date = file.date;

          // file._compressWorker returns DataWorker
          file.compressWorker(compression)
            .withStreamInfo('file', {
              name: relativePath,
              dir,
              date,
              comment: file.comment || '',
              unixPermissions: file.unixPermissions,
              dosPermissions: file.dosPermissions
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
