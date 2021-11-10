export default class IdsWeekView extends HTMLElement {
  /** Set start of the week to show */
  startDate: string | null;

  /** Set end of the week to show */
  endDate: string | null;

  /** Set first day of the week. 1 would be Monday */
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | null;

  /** Set whether or not the today button should be shown. */
  showToday: 'true' | 'false' | boolean | null;
}
