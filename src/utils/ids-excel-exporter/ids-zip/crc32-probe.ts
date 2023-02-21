import { crc32wrapper } from './crc32';
import { BaseWorker, Chunk } from './base-worker';

/**
 * A worker which calculate the crc32 of the data flowing through.
 */
export class Crc32Probe extends BaseWorker {
  constructor() {
    super('Crc32Probe');
    this.withStreamInfo('crc32', 0);
  }

  processChunk(chunk: Chunk) {
    this.streamInfo.crc32 = crc32wrapper(chunk.data, this.streamInfo.crc32 || 0);
    this.push(chunk);
  }
}
