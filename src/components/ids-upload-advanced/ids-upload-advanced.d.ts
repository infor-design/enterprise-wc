interface IdsUploadAdvancedEventDetail extends Event {
  detail: {
    elem: IdsUploadAdvanced
  }
}

export default class IdsUploadAdvanced extends HTMLElement {
  /** Sets limit the file types to be uploaded */
  accept: string;

  /** Sets the whole element to disabled state */
  disabled: boolean|string;

  /** Sets the icon to be use in main drop area */
  icon: string;

  /** Sets the max file size in bytes */
  maxFileSize: number|string;

  /** Sets the max number of files can be uploaded */
  maxFiles: number|string;

  /** Sets the max number of files can be uploaded while in process */
  maxFilesInProcess: number|string;

  /** Sets the method to use component XMLHttpRequest method to send files */
  method: string;

  /** Sets the variable name to read from server */
  paramName: string;

  /** Sets a link to browse files to upload */
  showBrowseLink: boolean|string;

  /** Sets the url to use component XMLHttpRequest method to send files */
  url: string;

  /** Get list of all added files */
  all: Array<unknown>;

  /** Get list of files which are in process to uploading */
  inProcess: Array<unknown>;

  /** Get list of aborted files */
  aborted: Array<unknown>;

  /** Get list of files that had error */
  errored: Array<unknown>;

  /** Get list of files that complete upload */
  completed: Array<unknown>;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the custom send method for uploading files */
  send(formData: Array<unknown>, uiElem: HTMLElement): void;

  /** Fires when files enter to drag area */
  on(event: 'filesdragenter', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;

  /** Fires when files dropped in to drag area */
  on(event: 'filesdrop', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;

  /** Fires when each file sent to in-process for upload */
  on(event: 'beginupload', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;

  /** Fires when each file get abort */
  on(event: 'abort', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;

  /** Fires when each file get error */
  on(event: 'error', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;

  /** Fires when each file complete uploading */
  on(event: 'complete', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;

  /** Fires when clicked on close button in each file ui-element */
  on(event: 'closebuttonclick', listener: (detail: IdsUploadAdvancedEventDetail) => void): this;
}
