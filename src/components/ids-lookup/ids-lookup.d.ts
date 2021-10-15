// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

interface IdsLookupEventDetail extends Event {
  detail: {
    elem: IdsLookup
  }
}

export default class IdsLookup extends IdsElement {
  /** Sets the dirty tracking feature on to indicate a changed field */
  dirtyTracker: boolean;

  /** Sets dropdown to disabled */
  disabled: boolean;

  /** Sets the label text */
  label: string;

  /** Sets the language for RTL and inner labels */
  language: string;

  /** Sets the validation required indicator on label text, it's default to `true` */
  labelRequired: boolean;

  /** Maximum characters allowed in textarea */
  maxlength: number | string;

  /** Sets the placeholder text */
  placeholder: string;

  /** Sets the size (width) */
  size: 'sm ' | 'md' | 'lg' | 'full' | string;

  /** Sets to readonly state */
  readonly: boolean;

  /** Sets the validation routine to use */
  validate: 'required' | string;

  /** Sets the validation events to use */
  validationEvents: 'blur' | string;

  /** Sets option to the matching option by the `value` attribute */
  value: string;

  /** Sets the `id` attribute */
  id: string;

  /** Sets the tooltip on the dropdown container */
  tooltip: string;

  /** Set if the trigger field is tabbable */
  tabbable: boolean;

  /** An object containing name/value pairs for all the settings you want to pass to the datagrid in the modal */
  gridSettings: Record<string, unknown>;

  /** Set the data array of the datagrid. This can be a JSON Array */
  columns: Array<Record<string, unknown>>;

  /** Set the columns array of the datagrid. See column settings */
  data: Array<Record<string, unknown>>;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** An async function that fires as the dropdown is opening allowing you to set contents */
  beforeShow(): Promise<string>;

  /** Fires when value change */
  on(event: 'change', listener: (detail: IdsLookupEventDetail) => void): this;

  /** Fires when dropdown get focus */
  on(event: 'focus', listener: (detail: IdsLookupEventDetail) => void): this;
}
