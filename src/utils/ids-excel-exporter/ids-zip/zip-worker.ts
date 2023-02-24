export type Chunk = {
  data: any;
  meta: any;
};

type ListenerCallback = (data: any) => void;

type StreamInfo = Record<string, any>;

/**
 * A worker that does nothing but passing chunks to the next one. This is like
 * a nodejs stream but with some differences. On the good side :
 * - it works on IE 6-9 without any issue / polyfill
 * - it weights less than the full dependencies bundled with browserify
 * - it forwards errors (no need to declare an error handler EVERYWHERE)
 *
 * A chunk is an object with 2 attributes : `meta` and `data`. The former is an
 * object containing anything (`percent` for example), see each worker for more
 * details. The latter is the real data (String, Uint8Array, etc).
 *
 * @param {string} name the name of the stream (mainly used for debugging purposes)
 */
export class ZipWorker {
  // the name of the worker
  name = 'default';

  // an object containing metadata about the workers chain
  streamInfo: StreamInfo = {};

  // an error which happened when the worker was paused
  generatedError: Error | null = null;

  // an object containing metadata to be merged by this worker into the general metadata
  extraStreamInfo: StreamInfo = {};

  // true if the stream is paused (and should not do anything), false otherwise
  isPaused = true;

  // true if the stream is finished (and should not do anything), false otherwise
  isFinished = false;

  // true if the stream is locked to prevent further structure updates (pipe), false otherwise
  isLocked = false;

  // the event listeners
  listeners: Record<string, Array<ListenerCallback>> = {
    data: [],
    end: [],
    error: []
  };

  // the previous worker, if any
  previous: ZipWorker | null = null;

  constructor(name: string) {
    this.name = name || this.name;
  }

  /**
   * Trigger an event. This will call registered callback with the provided arg.
   * @param {string} name the name of the event (data, end, error)
   * @param {unknown} arg the argument to call the callback with.
   */
  emit(name: string, arg?: unknown) {
    if (this.listeners[name]) {
      for (let i = 0; i < this.listeners[name].length; i++) {
        this.listeners[name][i].call(this, arg);
      }
    }
  }

  /**
   * End the stream.
   * @returns {boolean} true if this call ended the worker, false otherwise.
   */
  end() {
    if (this.isFinished) {
      return false;
    }

    this.flush();
    try {
      this.emit('end');
      this.cleanUp();
      this.isFinished = true;
    } catch (e) {
      this.emit('error', e);
    }
    return true;
  }

  /**
   * End the stream with an error.
   * @param {Error} e the error which caused the premature end.
   * @returns {boolean} true if this call ended the worker with an error, false otherwise.
   */
  error(e: Error) {
    if (this.isFinished) {
      return false;
    }

    if (this.isPaused) {
      this.generatedError = e;
    } else {
      this.isFinished = true;

      this.emit('error', e);

      // in the workers chain exploded in the middle of the chain,
      // the error event will go downward but we also need to notify
      // workers upward that there has been an error.
      if (this.previous) {
        this.previous.error(e);
      }

      this.cleanUp();
    }
    return true;
  }

  /**
   * Add a callback on an event.
   * @param {string} name the name of the event (data, end, error)
   * @param {Function} listener the function to call when the event is triggered
   * @returns {ZipWorker} the current object for chainability
   */
  on(name: string, listener: ListenerCallback) {
    this.listeners[name].push(listener);
    return this;
  }

  /**
   * Clean any references when a worker is ending.
   */
  cleanUp() {
    this.streamInfo = {};
    this.listeners = {};
    this.extraStreamInfo = {};
    this.generatedError = null;
  }

  /**
   * Chain a worker with an other.
   * @param {ZipWorker} next the worker receiving events from the current one.
   * @returns {ZipWorker} the next worker for chainability
   */
  pipe(next: ZipWorker) {
    return next.registerPrevious(this);
  }

  /**
   * Pause the stream so it doesn't send events anymore.
   * @returns {boolean} true if this call paused the worker, false otherwise.
   */
  pause() {
    if (this.isPaused || this.isFinished) {
      return false;
    }
    this.isPaused = true;

    if (this.previous) {
      this.previous.pause();
    }
    return true;
  }

  /**
   * Resume a paused stream.
   * @returns {boolean} true if this call resumed the worker, false otherwise.
   */
  resume(): boolean {
    if (!this.isPaused || this.isFinished) {
      return false;
    }

    this.isPaused = false;

    // if true, the worker tried to resume but failed
    let withError = false;
    if (this.generatedError) {
      this.error(this.generatedError);
      withError = true;
    }
    if (this.previous) {
      this.previous.resume();
    }

    return !withError;
  }

  /**
   * Flush any remaining bytes as the stream is ending.
   */
  flush() { }

  /**
   * Process a chunk. This is usually the method overridden.
   * @param {Chunk} chunk the chunk to process.
   */
  processChunk(chunk: Chunk) {
    this.push(chunk);
  }
  
  /**
   * Same as `pipe` in the other direction.
   * Using an API with `pipe(next)` is very easy.
   * Implementing the API with the point of view of the next one registering
   * a source is easier, see the ZipFileWorker.
   * @param {ZipWorker} previous the previous worker, sending events to this one
   * @returns {ZipWorker} the current worker for chainability
   */
  registerPrevious(previous: ZipWorker) {
    // sharing the streamInfo...
    this.streamInfo = previous.streamInfo;
    // ... and adding our own bits
    this.mergeStreamInfo();
    this.previous = previous;

    previous.on('data', (chunk) => {
      this.processChunk(chunk);
    });
    previous.on('end', () => {
      this.end();
    });
    previous.on('error', (e) => {
      this.error(e);
    });

    return this;
  }

  /**
   * Add a key/value to be added in the workers chain streamInfo once activated.
   * @param {string} key the key to use
   * @param {any} value the associated value
   * @returns {ZipWorker} the current worker for chainability
   */
  withStreamInfo(key: string, value: unknown) {
    this.extraStreamInfo[key] = value;
    this.mergeStreamInfo();
    return this;
  }

  /**
   * Merge this worker's streamInfo into the chain's streamInfo.
   */
  mergeStreamInfo() {
    for (const key in this.extraStreamInfo) {
      if (this.extraStreamInfo.hasOwnProperty(key)) {
        this.streamInfo[key] = this.extraStreamInfo[key];
      }
    }
  }

  /**
   * Lock the stream to prevent further updates on the workers chain.
   * After calling this method, all calls to pipe will fail.
   */
  lock() {
    if (this.isLocked) {
      throw new Error(`The stream ${this.name} has already been used.`);
    }
    this.isLocked = true;
    if (this.previous) {
      this.previous.lock();
    }
  }

  /**
   * Push a chunk to the next workers.
   * @param {Chunk} chunk the chunk to push
   */
  push(chunk: Chunk) {
    this.emit('data', chunk);
  }
}
