import Base from './ids-dropdown-base';

interface IdsDropdownEventDetail extends Event {
  detail: {
    elem: IdsDropdown
  }
}

export default class IdsDropdown extends Base {
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

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Sets the the selected option by index */
  selectedIndex: number;

  /** Returns the selected option DOM element */
  selectedOption(): HTMLElement;

  /** Returns the currently available options */
  options: Array<HTMLElement>;

  /** Opens the dropdown list */
  open(): Promise<string>;

  /** Closes the dropdown list */
  close(noFocus: boolean): void;

  /** Toggles the dropdown list open/closed state */
  toggle(): void;

  /** An async function that fires as the dropdown is opening allowing you to set contents */
  beforeShow(): Promise<string>;

  /** Fires when value change */
  on(event: 'change', listener: (detail: IdsDropdownEventDetail) => void): this;

  /** Fires when dropdown get focus */
  on(event: 'focus', listener: (detail: IdsDropdownEventDetail) => void): this;
}
