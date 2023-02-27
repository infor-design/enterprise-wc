import { ZipWorker, Chunk } from './zip-worker';
import { transformTo } from './ids-zip-util';

/**
 * A worker which convert chunks to a specified type.
 * @param {string} destType the destination type.
 */
export class ConvertWorker extends ZipWorker {
  constructor() {
    super(`ConvertWorker to uint8array`);
  }

  processChunk(chunk: Chunk) {
    this.push({
      data: transformTo('uint8array', chunk.data),
      meta: chunk.meta
    });
  }
}
