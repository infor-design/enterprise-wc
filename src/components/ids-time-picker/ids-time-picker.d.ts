// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

export default class IdsTimePicker extends IdsElement {
  /** Set the time format to indicate which dropdowns to render (Default: "hh:mm:ss a") */
  format?: string | 'hh:mm a';

  /** Set the input-field value (a timestring) */
  value?: string;

  /** Multiples of this value are displayed as options in the minutes dropdown. */
  minuteInternal?: number;

  /** Multiples of this value are displayed as options in the seconds dropdown. */
  secondInternal?: number;

  /** Enable autoselect popup feature */
  autoselect?: boolean | false;

  /** Enables the autoupdate feature, and removes the "Set Time" button */
  autoupdate?: boolean | false;

  /** Set the disabled attribute */
  disabled?: boolean | false;

  /** Set the readonly attribute */
  readonly?: boolean | false;

  /** Set the label attribute */
  label?: string;

  /** Set the placeholder attribute */
  placeholder?: string;

  /** Sets the size of the field-width */
  size?: 'sm ' | 'md' | 'lg' | 'full' | string;

  /** Set the theme mode */
  mode?: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version?: 'new' | 'classic' | string;

  /** Get a list of element dependencies for this component */
  readonly elements: {
    [key: string]: HTMLElement | { [key: string]: HTMLElement },
  };

  /** Get the minutes and seconds intervals */
  readonly intervals: {
    minutes: number | false,
    seconds: number | false,
  };

  /** Get dropdown-options for hour, minutes, second and period (am/pm) */
  readonly options: {
    hours: Array<number>,
    minutes: Array<number>,
    seconds: Array<number>,
    period: ['AM', 'PM'],
  };

  /** Does the timepicker format include seconds ("ss") */
  readonly hasSeconds: boolean;

  /** Does the timepicker format include the am/pm period (" a") */
  readonly hasPeriod: boolean;

  /** Is the timepicker using a 12-Hour format ("hh") */
  readonly is12Hours: boolean;

  /** Is the timepicker using a 24-Hour format ("HH") */
  readonly is24Hours: boolean;

  /** Is the timepicker's popup open */
  readonly isOpen: boolean;

  /** Close the timepicker's popup window */
  closeTimePopup(): void;

  /** Open the timepicker's popup window */
  openTimePopup(): void;

  /** Close the timepicker's popup window */
  toggleTimePopup(): void;

  /** Set the input-field's timestring value. */
  setTimeOnField(timeunits: {
    hours?: string | number,
    minutes?: string | number,
    seconds?: string | number,
    period?: 'AM' | 'PM',
  }): IdsTimePicker;
}
