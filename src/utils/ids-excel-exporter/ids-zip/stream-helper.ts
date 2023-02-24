import { ZipWorker } from './zip-worker';
import { ConvertWorker } from './convert-worker';
import { delay, transformTo } from './ids-zip-util';
import { ZipFileWorker } from './zip-file-worker';

/**
 * An helper to easily use workers outside of JSZip.
 * @param {ZipFileWorker} worker the worker to wrap
 * @param {string} outputType the type of data expected by the use
 * @param {string} mimeType the mime type of the content, if applicable.
 */
export class StreamHelper {
  // the type used internally
  internalType = 'uint8array';

  // the type used to output results
  outputType = 'blob';

  mimeType;

  worker;

  constructor(worker: ZipFileWorker, mimeType: string) {
    try {
      // the mime type
      this.mimeType = mimeType;
      this.worker = worker.pipe(new ConvertWorker('uint8array'));

      // the last workers can be rewired without issues but we need to
      // prevent any updates on previous workers.
      worker.lock();
    } catch (e) {
      this.worker = new ZipWorker('error');
      this.worker.error(e as any);
    }
  }

  /**
   * Accumulate its content and concatenate it into a complete block.
   * @returns Promise the promise for the accumulation.
   */
  accumulate(): Promise<any> {
    return new Promise((resolve, reject) => {
      let dataArray: any[] = [];
      const mimeType = this.mimeType;
  
      this
        .on('data', (data: any) => {
          dataArray.push(data);
        })
        .on('error', (err: any) => {
          dataArray = [];
          reject(err);
        })
        .on('end', () => {
          try {
            const dataBlock = transformTo('arraybuffer', this.concat(dataArray));
            const result = new Blob([dataBlock], { type: mimeType });
            resolve(result);
          } catch (e) {
            reject(e);
          }
          dataArray = [];
        })
        .resume(); // primary conversion start point
    });
  }

  /**
   * Concatenate an array of data of the given type.
   * @param {Array<any>} dataArray the array containing the data chunks to concatenate
   * @returns {Uint8Array} the concatenated data
   */
  concat(dataArray: Array<any>): Uint8Array {
    let i;
    let index = 0;
    let res = null;
    let totalLength = 0;

    for (i = 0; i < dataArray.length; i++) {
      totalLength += dataArray[i].length;
    }

    res = new Uint8Array(totalLength);
    for (i = 0; i < dataArray.length; i++) {
      res.set(dataArray[i], index);
      index += dataArray[i].length;
    }

    return res;
  }

  /**
   * Add a listener on an event triggered on a stream.
   * @param {string} evt the name of the event
   * @param {any} fn the listener
   * @returns {StreamHelper} the current helper.
   */
  on(evt: string, fn: any) {
    const self = this;

    if (evt === 'data') {
      this.worker.on(evt, (chunk) => {
        fn.call(self, chunk.data, chunk.meta);
      });
    } else {
      this.worker.on(evt, () => {
        delay(fn, arguments, self);
      });
    }
    return this;
  }

  /**
   * Resume the flow of chunks.
   * @returns {StreamHelper} the current helper.
   */
  resume() {
    this.worker.resume();
    return this;
  }

  /**
   * Pause the flow of chunks.
   * @returns {StreamHelper} the current helper.
   */
  pause() {
    this.worker.pause();
    return this;
  }
}
