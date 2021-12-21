export default class IdsMonthView extends HTMLElement {
  month: string | number | null;

  year: string | number | null;

  day: string | number | null;

  /** Set first day of the week (0-6) */
  firstDayOfWeek: string | number | null;

  /** Set whether or not the today button should be shown */
  showToday: 'true' | 'false' | boolean | null;
}
