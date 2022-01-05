interface dayselected extends Event {
  detail: {
    elem: IdsMonthView,
    data: Date
  }
}

export default class IdsMonthView extends HTMLElement {
  /** Set a month to show. 0-11 range */
  month: string | number | null;

  /** Set a year to show */
  year: string | number | null;

  /** Set a day to highlight */
  day: string | number | null;

  /** Set start of the range to show */
  startDate: string | null;

  /** Set end of the range to show */
  endDate: string | null;

  /** Set first day of the week (0-6) */
  firstDayOfWeek: string | number | null;

  /** Set whether or not the today button should be shown */
  showToday: 'true' | 'false' | boolean | null;

  /** Whether or not the component should be compact view */
  compact: 'true' | 'false' | boolean | null;

  /** Fires when a day selected */
  on(event: 'dayselected', listener: (event: dayselected) => void): this;
}
