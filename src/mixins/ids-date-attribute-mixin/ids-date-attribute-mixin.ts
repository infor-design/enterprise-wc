import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { LocaleHandler, LocaleMixinInterface } from '../ids-locale-mixin/ids-locale-mixin';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { CalendarEventsHandler } from '../ids-calendar-events-mixin/ids-calendar-events-mixin';

import { MIN_MONTH, MAX_MONTH } from '../../components/ids-date-picker/ids-date-picker-common';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

export type IdsDateAttributeChangeCallback = undefined | ((newValue: number, isValid: boolean) => void);

export interface DateAttributeInterface {
  // as instance functions
  onDayChange?(newValue: number, isValid: boolean): void;
  onFirstDayOfWeekChange?(newValue: number | null): void;
  onFormatChange?(newValue: string | null): void;
  onMonthChange?(newValue: number, isValid: boolean): void;
  onYearChange?(newValue: number, isValid: boolean): void;
}

type Constraints = IdsConstructor<
DateAttributeInterface & LocaleMixinInterface & LocaleHandler & EventsMixinInterface & CalendarEventsHandler>;

const isValidDay = (numberVal: number) => !Number.isNaN(numberVal) && numberVal > 0;
const isValidMonth = (numberVal: number) => !Number.isNaN(numberVal) && numberVal >= MIN_MONTH && numberVal <= MAX_MONTH;
const isValidYear = (numberVal: number) => !Number.isNaN(numberVal) && numberVal.toString().length === 4;

/**
 * A mixin that adds component attributes for dealing with dates.
 * @mixin IdsDateAttributeMixin
 * @param {any} superclass Accepts a superclass and creates a new subclass from it.
 * @returns {any} The extended object
 */
const IdsDateAttributeMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  dateValue: Date | null = null;

  constructor(...args: any[]) {
    super(...args);
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.DAY,
      attributes.MONTH,
      attributes.YEAR
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
  }

  /**
   * Get active/selected day in Date format
   * @readonly
   * @returns {Date} active date
   */
  get activeDate(): Date {
    return new Date(this.year, this.month, this.day);
  }

  /**
   * day attribute
   * @returns {number} day param converted to number
   */
  get day(): number {
    const attrVal = this.getAttribute(attributes.DAY);
    const numberVal = stringToNumber(attrVal);

    if (isValidDay(numberVal)) return numberVal;

    // Default is current day
    return new Date().getDate();
  }

  /**
   * Set day param and select active day
   * @param {string|number|null} val day param value
   */
  set day(val: any) {
    const numberVal = stringToNumber(val);
    const validates = isValidDay(numberVal);

    if (validates) {
      this.setAttribute(attributes.DAY, val);
    } else {
      this.removeAttribute(attributes.DAY);
    }

    if (typeof this.onDayChange === 'function') this.onDayChange(numberVal, validates);
  }

  /**
   * fist-day-of-week attribute for calendar popup
   * If not set the information comes from the locale. If not set in the locale defaults to 0
   * @returns {number} firstDayOfWeek param
   */
  get firstDayOfWeek(): number {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return this.localeAPI?.calendar().firstDayofWeek || 0;
  }

  /**
   * Set month view first day of the week
   * @param {string|number|null} val fist-day-of-week attribute value
   */
  set firstDayOfWeek(val: string | number | null) {
    this.setAttribute(attributes.FIRST_DAY_OF_WEEK, String(val));
    if (typeof this.onFirstDayOfWeekChange === 'function') this.onFirstDayOfWeekChange(Number(val));
  }

  /**
   * format attribute
   * @returns {string} format param. Default is locale - gets format from the calendar
   */
  get format(): string {
    const attrVal = this.getAttribute(attributes.FORMAT);
    return !attrVal || attrVal === 'locale' ? this.localeAPI?.calendar().dateFormat.short : attrVal;
  }

  /**
   * Sets the value date format and applies ids-mask
   * @param {string|null} val format attribute
   */
  set format(val: string | null) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }

    if (typeof this.onFormatChange === 'function') this.onFormatChange(val);
  }

  /**
   * month attribute
   * @returns {number} month param converted to number from attribute value with range (MIN_MONTH - MAX_MONTH)
   */
  get month(): number {
    const attrVal = this.getAttribute(attributes.MONTH);
    const numberVal = stringToNumber(attrVal);

    if (isValidMonth(numberVal)) return numberVal;

    // Default is current month
    return new Date().getMonth();
  }

  /**
   * Set month param and render month table/toolbar
   * @param {string|number|null} val month param value
   */
  set month(val: string | number | null) {
    const numberVal = stringToNumber(val);
    const validates = isValidMonth(numberVal);

    if (validates) {
      this.setAttribute(attributes.MONTH, String(val));
    } else {
      this.removeAttribute(attributes.MONTH);
    }

    if (typeof this.onMonthChange === 'function') this.onMonthChange(numberVal, validates);
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value with 4-digit check
   */
  get year(): number {
    const attrVal = this.getAttribute(attributes.YEAR) ?? '';
    const numberVal = stringToNumber(attrVal);

    if (isValidYear(numberVal)) return numberVal;

    // Default is current year
    return new Date().getFullYear();
  }

  /**
   * Set year param and render month table/toolbar
   * @param {string|number|null} val year param value
   */
  set year(val: string | number | null) {
    const numberVal = stringToNumber(val);
    const validates = isValidYear(numberVal);

    if (validates) {
      this.setAttribute(attributes.YEAR, String(val));
    } else {
      this.removeAttribute(attributes.YEAR);
    }

    if (typeof this.onYearChange === 'function') this.onYearChange(numberVal, validates);
  }

  get date(): Date | null {
    return this.dateValue;
  }

  /**
   * Takes a string containing a date and formats it per the provided locale and date format
   * @param {string} date the desired date string to format
   * @returns {string} the correctly formatted date string
   */
  getFormattedDate(date: Date | string) {
    return this.localeAPI.formatDate(
      date,
      { pattern: this.format }
    );
  }

  /**
   * Takes a date string and returns Date object if valid
   * @param {string | Date} date Date string
   * @returns {Date | null} Date
   */
  getDateValue(date: Date | string | null): Date | null {
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date;
    }

    if (typeof date === 'string') {
      return this.getDateValue(this.localeAPI.parseDate(date, { pattern: this.format }) as Date);
    }

    return null;
  }
};

export default IdsDateAttributeMixin;
