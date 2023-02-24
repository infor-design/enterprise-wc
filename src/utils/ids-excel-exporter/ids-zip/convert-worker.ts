import { ZipWorker, Chunk } from './zip-worker';
import { transformTo } from './ids-zip-util';

/**
 * A worker which convert chunks to a specified type.
 * @param {string} destType the destination type.
 */
export class ConvertWorker extends ZipWorker {
  destType: 'string' | 'uint8array';

  constructor(destType: 'string' | 'uint8array') {
    super(`ConvertWorker to ${destType}`);
    this.destType = destType;
  }

  processChunk(chunk: Chunk) {
    this.push({
      data: transformTo(this.destType, chunk.data),
      meta: chunk.meta
    });
  }
}
