// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface IdsUploadEventDetail extends Event {
  detail: {
    elem: IdsUpload
  }
}

export default class IdsUpload extends HTMLElement {
  /** Sets limit the file types to be uploaded */
  accept: string;

  /** Sets the dirty tracking feature on to indicate a changed field */
  dirtyTracker: boolean|string;

  /** Sets to disabled state * */
  disabled: boolean|string;

  /** Sets the label text for text input * */
  label: string;

  /** Sets the label text for file input * */
  labelFiletype: string;

  /** Sets to allows multiple files to be uploaded */
  multiple: boolean|string;

  /** Sets ellipsis to be not shown on text input */
  noTextEllipsis: boolean|string;

  /** Sets the input placeholder text * */
  placeholder: string;

  /** Sets the size (width) of input * */
  size: string;

  /** Sets to readonly state * */
  readonly: boolean|string;

  /** Sets the label text for trigger button * */
  triggerLabel: string;

  /** Sets the validation check to use * */
  validate: string;

  /** Sets the validation events to use * */
  validationEvents: string;

  /** Sets the `value` attribute * */
  value: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Fires when file input files change. */
  on(event: 'change', listener: (detail: IdsUploadEventDetail) => void): this;
}
