export default class IdsWeekView extends HTMLElement {
  /** Set start of the week to show */
  startDate: string | null;

  /** Set end of the week to show */
  endDate: string | null;

  /** Set first day of the week. 1 would be Monday */
  firstDayOfWeek: '0' | '1' | '2' | '3' | '4' | '5' | '6' | number | null;

  /** Set whether or not the today button should be shown */
  showToday: 'true' | 'false' | boolean | null;

  /** Set start hour of the day */
  startHour: string | number | null;

  /** Set end hour of the day */
  endHour: string | number | null;

  /** Set whether or not to show a bar across the current time */
  showTime: 'true' | 'false' | boolean | null;
}
