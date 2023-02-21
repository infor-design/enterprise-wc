import { BaseWorker, Chunk } from './base-worker';
import { string2buf } from './ids-zip-util';

export class Utf8EncodeWorker extends BaseWorker {
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
