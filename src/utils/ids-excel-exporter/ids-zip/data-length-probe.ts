import { BaseWorker, Chunk } from './base-worker';

/**
 * A worker which calculate the total length of the data flowing through.
 * @param {string} propName the name used to expose the length
 */
export class DataLengthProbe extends BaseWorker {
  propName;

  constructor(propName: string) {
    super(`DataLengthProg for ${propName}`);
    this.propName = propName;
    this.withStreamInfo(propName, 0);
  }

  processChunk(chunk: Chunk) {
    if (chunk) {
      const length = this.streamInfo[this.propName] || 0;
      this.streamInfo[this.propName] = length + chunk.data.length;
    }

    this.push(chunk);
  }
}
