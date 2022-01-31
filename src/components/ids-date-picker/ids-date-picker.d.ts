interface dayselected extends Event {
  detail: {
    elem: IdsDatePicker,
    data: Date
  }
}

export default class IdsDatePicker extends HTMLElement {
  /** Set input value */
  value: string | null;

  /** Set input placeholder */
  placeholder: string | null;

  /** Set trigger field label */
  label: string | null;

  /** Set trigger field disabled attribute */
  disabled: 'true' | 'false' | boolean | null;

  /** Set trigger field readonly attribute */
  readonly: 'true' | 'false' | boolean | null;

  /** Set the size (width) of input */
  size: string | 'xs' | 'sm' | 'mm' | 'md' | 'lg' | 'full';

  /** Set trigger field tabbable attribute */
  tabbable: 'true' | 'false' | boolean | null;

  /** Set trigger field/input id attribute */
  id: string;

  /** Set trigger field/input validation */
  validate: string | null;

  /** Set which input events to fire validation on */
  validationEvents: string | null;

  /** Sets the value date format and applies ids-mask */
  format: string | null;

  /** Set whether or not the component is used in calendar toolbar */
  isCalendarToolbar: 'true' | 'false' | boolean | null;

  /** Set whether or not the component is dropdown type */
  isDropdown: 'true' | 'false' | boolean | null;

  /** Set month view month */
  month: string | number | null;

  /** Set month view year */
  year: string | number | null;

  /** Set month view day */
  day: string | number | null;

  /** Set month view first day of the week */
  firstDayOfWeek: string | number | null;

  /** Set whether or not month view today button should be show */
  showToday: 'true' | 'false' | boolean | null;

  /** Fires when month view day is selected */
  on(event: 'dayselected', listener: (event: dayselected) => void): this;
}
