// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base/ids-element';

interface IdsUploadAdvancedFileEventDetail extends Event {
  detail: {
    elem: IdsUploadAdvancedFile
  }
}

export default class IdsUploadAdvancedFile extends IdsElement {
  /** Sets the whole file element to disabled state */
  disabled: boolean|string;

  /** Sets the file state to show there was an error during the file operations */
  error: string;

  /** Sets the file name */
  fileName: string;

  /** Sets the file size in bytes */
  size: number|string;

  /** Sets the progress bar value */
  value: number|string;

  /** Set the abort handler method */
  abortHandler(e: unknown): void;

  /** Set the progress handler method */
  progressHandler(e: unknown): void;

  /** Set the complete handler method */
  completeHandler(e: unknown): void;

  /** Set the error handler method */
  errorHandler(e: unknown): void;

  /** Fires when file sent to in-process for upload */
  on(event: 'beginupload', listener: (detail: IdsUploadAdvancedFileEventDetail) => void): this;

  /** Fires when file get abort */
  on(event: 'abort', listener: (detail: IdsUploadAdvancedFileEventDetail) => void): this;

  /** Fires when file get error */
  on(event: 'error', listener: (detail: IdsUploadAdvancedFileEventDetail) => void): this;

  /** Fires when file complete uploading */
  on(event: 'complete', listener: (detail: IdsUploadAdvancedFileEventDetail) => void): this;

  /** Fires when clicked on close button */
  on(event: 'closebuttonclick', listener: (detail: IdsUploadAdvancedFileEventDetail) => void): this;
}
