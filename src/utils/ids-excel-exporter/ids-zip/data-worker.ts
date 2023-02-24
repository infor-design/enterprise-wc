import { ZipWorker } from './zip-worker';
import { delay, getTypeOf } from './ids-zip-util';

const DEFAULT_BLOCK_SIZE = 16 * 1024;

export class DataWorker extends ZipWorker {
  dataIsReady = true;

  index = 0;

  max = 0;

  tickScheduled = false;

  data: any = null;

  type;

  constructor(data: any) {
    super('DataWorker');
    this.max = (data && data.length) || 0;
    this.data = data;
    this.type = getTypeOf(data);
  }

  cleanUp() {
    super.cleanUp();
    this.data = null;
  }

  resume() {
    if (!ZipWorker.prototype.resume.call(this)) {
      return false;
    }

    if (!this.tickScheduled && this.dataIsReady) {
      this.tickScheduled = true;
      delay(this.tickAndRepeat, [], this);
    }

    return true;
  }

  tickAndRepeat() {
    this.tickScheduled = false;
    if (this.isPaused || this.isFinished) {
      return;
    }
    this.tick();
    if (!this.isFinished) {
      delay(this.tickAndRepeat, [], this);
      this.tickScheduled = true;
    }
  }

  tick() {
    if (this.isPaused || this.isFinished) {
      return false;
    }

    const size = DEFAULT_BLOCK_SIZE;
    const nextIndex = Math.min(this.max, this.index + size);

    if (this.index >= this.max) {
      // EOF
      return this.end();
    }

    const data = this.type === 'string'
      ? this.data?.substring(this.index, nextIndex)
      : this.data?.subarray(this.index, nextIndex);
    this.index = nextIndex;

    return this.push({
      data,
      meta: {
        percent: this.max ? this.index / this.max * 100 : 0
      }
    });
  }
}
