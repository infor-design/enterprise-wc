// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface IdsTextareaEventDetail extends Event {
  detail: {
    elem: IdsTextarea
  }
}

export class IdsTextarea extends HTMLElement {
  /** Will automatically expand the textarea to fit the contents when typing */
  autogrow: boolean;

  /** The Max Height of the textarea when autogrow is enabled */
  autogrowMaxHeight: number | string;

  /** When set will select all text on focus */
  autoselect: boolean;

  /** Text that will be used in place of the `max` text */
  charMaxText: string;

  /** Text that will be used in place of the `remaining` */
  charRemainingText: string;

  /** Displays a counter that counts down from the maximum */
  characterCounter: boolean;

  /** Sets the dirty tracking feature on to indicate a changed field */
  dirtyTracker: boolean;

  /** Sets textarea to disabled */
  disabled: boolean;

  /** Sets the label text */
  label: string;

  /** Sets the validation required indicator on label text, it's default to `true` */
  labelRequired: boolean;

  /** Maximum characters allowed in textarea */
  maxlength: number | string;

  /** Sets the placeholder text */
  placeholder: string;

  /** Determines whether or not the textarea can be displayed on a printed page */
  printable: boolean;

  /** Sets the size (width) */
  size: 'sm ' | 'md' | 'lg' | 'full' | string;

  /** Sets to readonly state */
  readonly: boolean;

  /** Can resize the height of the textarea */
  resizable: boolean;

  /** Sets to visible height of a text area in lines */
  rows: number | string;

  /** Sets the text alignment */
  textAlign: 'left' | 'center ' | 'right' | string;

  /** Sets the validation check to use */
  validate: 'required' | string;

  /** Sets the validation events to use */
  validationEvents: 'blur' | string;

  /** Sets the `value` attribute */
  value: string | number;

  /** Fires when value change. */
  on(event: 'change', listener: (detail: IdsTextareaEventDetail) => void): this;

  /** Fires when user type. */
  on(event: 'input', listener: (detail: IdsTextareaEventDetail) => void): this;

  /** Fires when copy paste and value change. */
  on(event: 'propertychange', listener: (detail: IdsTextareaEventDetail) => void): this;

  /** Fires when textarea get focus. */
  on(event: 'focus', listener: (detail: IdsTextareaEventDetail) => void): this;

  /** Fires when textarea text get selected. */
  on(event: 'select', listener: (detail: IdsTextareaEventDetail) => void): this;
}
