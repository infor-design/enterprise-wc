/** Debounce method called only once in a given time period, delay after its last invocation. */
export function debounce(
  /** The callback function to be run on a stagger. */
  func: (...args: Array<unknown>) => void,

  /** The amount of time in CPU ticks to delay. */
  threshold: number,

  /** If true, executes the callback immediately instead of waiting for the threshold to complete. */
  execAsap: boolean
): void;
