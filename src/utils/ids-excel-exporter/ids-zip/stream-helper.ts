import { BaseWorker } from './base-worker';
import { ConvertWorker } from './convert-worker';
import { delay, newBlob, transformTo } from './ids-zip-util';

/**
 * Concatenate an array of data of the given type.
 * @param {string} type the type of the data in the given array.
 * @param {Array<any>} dataArray the array containing the data chunks to concatenate
 * @returns {String|Uint8Array|Buffer} the concatenated data
 * @throws Error if the asked type is unsupported
 */
function concat(type: string, dataArray: Array<any>) {
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
 * Listen a StreamHelper, accumulate its content and concatenate it into a
 * complete block.
 * @param {StreamHelper} helper the helper to use.
 * with one arg :
 * - the metadata linked to the update received.
 * @returns Promise the promise for the accumulation.
 */
function accumulate(helper: StreamHelper) {
  return new Promise((resolve, reject) => {
    let dataArray: any[] = [];
    const chunkType = helper.internalType;
    const mimeType = helper.mimeType;

    helper
      .on('data', (data: any) => {
        dataArray.push(data);
      })
      .on('error', (err: any) => {
        dataArray = [];
        reject(err);
      })
      .on('end', () => {
        try {
          const result = newBlob(transformTo('arraybuffer', concat(chunkType!, dataArray)), mimeType);
          resolve(result);
        } catch (e) {
          reject(e);
        }
        dataArray = [];
      })
      .resume();
  });
}

/**
 * An helper to easily use workers outside of JSZip.
 * @param {BaseWorker} worker the worker to wrap
 * @param {string} outputType the type of data expected by the use
 * @param {string} mimeType the mime type of the content, if applicable.
 */
export class StreamHelper {
  internalType;

  outputType;

  mimeType;

  worker;

  constructor(worker: BaseWorker, outputType: string, mimeType: string) {
    const internalType = 'uint8array';

    try {
      // the type used internally
      this.internalType = internalType;
      // the type used to output results
      this.outputType = outputType;
      // the mime type
      this.mimeType = mimeType;
      this.worker = worker.pipe(new ConvertWorker(internalType));
      // the last workers can be rewired without issues but we need to
      // prevent any updates on previous workers.

      worker.lock();
    } catch (e) {
      this.worker = new BaseWorker('error');
      this.worker.error(e as any);
    }
  }

  /**
   * Listen a StreamHelper, accumulate its content and concatenate it into a
   * complete block.
   * @returns Promise the promise for the accumulation.
   */
  accumulate() {
    return accumulate(this);
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
    console.log('stream helper resume', this.worker);
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
