import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import { hoursTo12, hoursTo24 } from '../../utils/ids-date-utils/ids-date-utils'; // , isValidDate

import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPickerPopup from '../ids-picker-popup/ids-picker-popup';

import { IdsTimePickerCommonAttributes, IdsTimePickerMixinAttributes, range } from './ids-time-picker-common';

import styles from './ids-time-picker-popup.scss';

import '../ids-modal-button/ids-modal-button';
import '../ids-dropdown/ids-dropdown';

import type IdsButton from '../ids-button/ids-button';
import type IdsModalButton from '../ids-modal-button/ids-modal-button';
import type IdsDropdown from '../ids-dropdown/ids-dropdown';

type IdsTimePickerPopupButton = IdsButton | IdsModalButton;

const Base = IdsDateAttributeMixin(
  IdsLocaleMixin(
    IdsKeyboardMixin(
      IdsPickerPopup
    )
  )
);

/**
 * IDS Time Picker Popup Component
 * @type {IdsTimePickerPopup}
 * @inherits IdsPickerPopup
 * @mixes IdsDateAttributeMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-time-picker-popup')
@scss(styles)
class IdsTimePickerPopup extends Base {
  private isRendering: boolean;

  constructor() {
    super();
    this.#value = '';
    this.isRendering = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.attachEventListeners();
    this.setAttribute(attributes.FOCUS_INLINE, 'true');
    this.isRendering = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.removeEventListeners();
    this.#value = null;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      ...IdsTimePickerCommonAttributes,
      ...IdsTimePickerMixinAttributes
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const dropdownHTML = `<div class="dropdowns" part="dropdowns">${this.#dropdowns()}</div>`;

    if (this.embeddable) {
      return `<div class="ids-time-picker-popup embedded" part="container">${dropdownHTML}</div>`;
    }

    return `<ids-popup class="ids-time-picker-popup" type="menu" tabIndex="-1" align="bottom, left" arrow="bottom" part="popup" animated>
      <section slot="content">
        ${dropdownHTML}
        <ids-modal-button class="popup-btn" hidden="${this.autoupdate}" part="btn-set" appearance="primary">
          <ids-text translate-text="true" font-weight="semi-bold">SetTime</ids-text>
        </ids-modal-button>
      </section>
    </ids-popup>`;
  }

  /**
   * Creates the HTML the timepicker's dropdown fields
   * @returns {string} an array of HTML for the timepicker's dropdowns
   */
  #dropdowns(): string {
    const dropdown: any = ({
      id,
      label,
      options,
      value,
      padStart
    }: any) => `
      <ids-dropdown id="${id}" class="dropdown" label="${label}" value="${value}" size="xs" part="${id}">
        <ids-list-box>
          ${options.map((option: any) => `
            <ids-list-box-option id="timepicker-${id}-${option}" value="${option}">
              ${padStart ? `${option}`.padStart(2, '0') : option}
            </ids-list-box-option>
          `).join('')}
        </ids-list-box>
      </ids-dropdown>
    `;

    const hours = dropdown({
      id: 'hours',
      label: this.localeAPI?.translate('Hours') || 'Hours',
      options: this.#getHourOptions(),
      value: this.hours,
      padStart: this.format.includes('HH') || this.format.includes('hh')
    });
    const minutes = dropdown({
      id: 'minutes',
      label: this.localeAPI?.translate('Minutes') || 'Minutes',
      options: range(0, 59, this.minuteInterval),
      value: this.minutes,
      padStart: this.format.includes('mm')
    });
    const seconds = this.#hasSeconds() && dropdown({
      id: 'seconds',
      label: this.localeAPI?.translate('Seconds') || 'Seconds',
      options: range(0, 59, this.secondInterval),
      value: this.seconds,
      padStart: true
    });
    const dayPeriods = this.#getDayPeriodsWithRange();
    const period = this.#hasPeriod() && dayPeriods && dropdown({
      id: 'period',
      label: this.localeAPI?.translate('Period') || 'Period',
      options: dayPeriods,
      value: this.period
    });

    const separator = '<span class="separator colons">:</span>';
    const spacer = '<span class="separator">&nbsp;</span>';

    const numbers = [hours, minutes, seconds].filter(Boolean).join(separator);

    return [numbers, period].filter(Boolean).join(spacer);
  }

  /**
   * Attaches Time Picker dropdowns to the shadow root
   */
  renderDropdowns(): void {
    this.isRendering = true;

    const el = this.dropdownContainerEl;
    if (el) el.innerHTML = this.#dropdowns();

    // Refresh values stored in mixin properties
    this.refreshFocusableElements();
    this.isRendering = false;
  }

  /**
   * Updates the value from attribute setters
   */
  private updateValue() {
    const newValue = this.getFormattedTime();
    if (this.#value !== newValue) {
      this.#value = newValue;
      if (this.#value !== null) this.setAttribute(attributes.VALUE, newValue);
    }
  }

  /**
   * Attaches event listeners for inner elements
   */
  private attachEventListeners() {
    this.offEvent('change.time-picker-dropdowns');
    this.onEvent('change.time-picker-dropdowns', this.dropdownContainerEl, (e: any) => {
      const currentId = e.detail?.elem?.id;
      if (!currentId) return;

      this.setAttribute(currentId, e.detail.value);
      if (this.autoupdate) this.triggerSelectedEvent();
    });

    this.offEvent('click.time-picker-set');
    this.onEvent('click.time-picker-set', this.applyButtonEl, () => {
      this.updateValue();
      this.triggerSelectedEvent();
      this.hide(true);
    });

    this.listen(['Escape', 'Backspace'], this, (e: KeyboardEvent) => {
      if (this.embeddable) return;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        this.hide(true);
      }
    });
  }

  private removeEventListeners() {
    this.offEvent('change.time-picker-dropdowns');
    this.offEvent('click.time-picker-set');
    this.unlisten('Escape');
    this.unlisten('Backspace');
  }

  /**
   * Get options list for hours dropdown
   * @returns {Array<number>} options
   */
  #getHourOptions(): Array<number> {
    if (!this.#hasHourRange()) {
      return range(this.#is12Hours() ? 1 : 0, this.#is12Hours() ? 12 : 23);
    }

    if (this.#is24Hours()) {
      return range(this.startHour, this.endHour > 23 ? 23 : this.endHour);
    }

    const dayPeriodIndex = this.localeAPI?.calendar().dayPeriods?.indexOf(this.period);

    // Including 12AM or 12PM to the range
    if ((dayPeriodIndex === 0 && this.startHour === 0)
      || (dayPeriodIndex === 1 && (this.startHour <= 12 && this.endHour >= 12))
    ) {
      return [...range(this.#getPeriodStartHour(), this.#getPeriodEndHour()), 12];
    }

    return range(this.#getPeriodStartHour(), this.#getPeriodEndHour());
  }

  /**
   * @returns {boolean} true if range is set
   */
  #hasHourRange(): boolean {
    return this.startHour > 0 || this.endHour < 24;
  }

  /**
   * @returns {boolean} returns true if the timepicker format includes seconds ("ss")
   */
  #hasSeconds(): boolean {
    return this.format.toLowerCase().includes('ss');
  }

  /**
   * @returns {boolean} returns true if the timepicker format includes a day period ("a")
   */
  #hasPeriod(): boolean {
    return this.#is12Hours() && (this.format.toLowerCase().indexOf(' a') > -1 || this.format.toLowerCase().indexOf('a') === 0);
  }

  /**
   * @returns {boolean} returns true if the timepicker is using a 12-Hour format ("hh")
   */
  #is12Hours(): boolean {
    return this.format.includes('h');
  }

  /**
   * @returns {boolean} returns true if the timepicker is using a 24-Hour format ("HH")
   */
  #is24Hours(): boolean {
    return this.format.includes('H') || !this.#hasPeriod();
  }

  /**
   * @returns {number} start hour in range by day period
   */
  #getPeriodStartHour(): number {
    const dayPeriodIndex: number = this.localeAPI?.calendar().dayPeriods?.indexOf(this.period);

    if ((this.startHour <= 12 && dayPeriodIndex === 1) || this.startHour === 0) {
      return 1;
    }

    if (this.startHour > 12) {
      return this.startHour % 12;
    }

    return this.startHour;
  }

  /**
   * @returns {number} end hour in range by day period
   */
  #getPeriodEndHour() {
    const dayPeriodIndex = this.localeAPI?.calendar().dayPeriods?.indexOf(this.period);

    if ((this.endHour >= 12 && dayPeriodIndex === 0) || this.endHour === 24) {
      return 11;
    }

    if (dayPeriodIndex === 1) {
      return this.endHour % 12;
    }

    return this.endHour;
  }

  /**
   * @returns {Array<string>} list of available day periods
   */
  #getDayPeriodsWithRange(): Array<string> {
    const dayPeriods: Array<string> = this.localeAPI?.calendar().dayPeriods || [];

    if (!this.#hasHourRange()) {
      return dayPeriods;
    }

    // Do not include out of range day period
    return dayPeriods.reduce((prev: Array<string>, curr: string, index: number) => {
      const amInRange = index === 0 && (this.startHour < 12 || this.startHour === 0);
      const pmInRange = index === 1 && this.endHour >= 12;

      if (amInRange || pmInRange) {
        return [...prev, curr];
      }

      return prev;
    }, []);
  }

  onFormatChange() {
    this.updateValue();
    this.renderDropdowns();
  }

  /**
   * Removes all button ripples in the component
   * @returns {void}
   */
  private removeRipples() {
    this.buttons?.forEach((button: IdsTimePickerPopupButton) => {
      button.removeRipples();
    });
  }

  /**
   * @param {number} value minutes or seconds to be rounded
   * @param {number} interval for value to be rounded to
   * @returns {number} rounded value
   */
  #roundToInterval(value: number, interval: number): number {
    return Math.round(value / interval) * interval;
  }

  /**
   * Parse input date and populate dropdowns
   * @param {string} val time attribute string
   */
  syncTimeAttributes(val: string): void {
    const inputDate = this.localeAPI?.parseDate(
      val || this.value,
      { pattern: this.format }
    ) as Date;
    const hours24 = inputDate?.getHours();
    const hours12 = hoursTo12(hours24);
    const minutes = inputDate?.getMinutes();
    const seconds = inputDate?.getSeconds();
    const period = inputDate && this.localeAPI?.calendar()?.dayPeriods[hours24 >= 12 ? 1 : 0];

    if (this.#is24Hours() && hours24 !== this.hours) {
      this.hours = hours24;
    }

    if (this.#is12Hours() && hours12 !== this.hours) {
      this.hours = hours12;
    }

    if (minutes !== this.minutes) {
      this.minutes = minutes;
    }

    if (seconds !== this.seconds) {
      this.seconds = seconds;
    }

    if (this.#hasPeriod()) {
      this.period = period;
    }
  }

  /**
   * Triggers the same `timeselected` event on the Popup's target element that came from the internal Dropdowns
   * @param {CustomEvent} [e] optional event handler to pass arguments
   * @returns {void}
   */
  triggerSelectedEvent(e?: CustomEvent): void {
    if (this.isRendering) return;

    let args: any;
    if (e) args = e;
    else {
      args = {
        bubbles: true,
        detail: {
          elem: this,
          date: this.activeDate,
          value: this.getFormattedTime()
        }
      };
    }

    // Time Picker Popup emits the event in `embeddable` mode.
    // The target element emits the event otherwise
    const event = new CustomEvent('timeselected', args);
    if (this.embeddable) this.dispatchEvent(event);
    else if (this.target) this.target.dispatchEvent(event);
  }

  /**
   * Sets the autoupdate attribute
   * @param {boolean} value - true or false
   */
  set autoupdate(value: boolean) {
    const boolVal = stringToBool(value);
    const popupBtn = this.applyButtonEl;

    if (boolVal) {
      this.setAttribute(attributes.AUTOUPDATE, 'true');
      popupBtn?.setAttribute('hidden', 'true');
    } else {
      this.removeAttribute(attributes.AUTOUPDATE);
      popupBtn?.removeAttribute('hidden');
    }
  }

  /**
   * Gets the autoupdate attribute
   * @returns {boolean} true if autoupdate is enabled
   */
  get autoupdate(): boolean {
    return stringToBool(this.getAttribute(attributes.AUTOUPDATE));
  }

  /**
   * @readonly
   * @returns {IdsModalButton} reference to the Time Picker's "Apply" button, if applicable
   */
  get applyButtonEl() {
    return this.container?.querySelector<IdsModalButton>('.popup-btn');
  }

  /**
   * @readonly
   * @returns {NodeList<IdsTimePickerPopupButton>} containing all buttons in the Date Picker Popup
   */
  get buttons() {
    return this.container?.querySelectorAll<IdsTimePickerPopupButton>('ids-button, ids-modal-button, ids-toggle-button');
  }

  /**
   * @readonly
   * @returns {HTMLDivElement} containing element for Time Picker dropdowns
   */
  get dropdownContainerEl() {
    return this.shadowRoot?.querySelector<HTMLDivElement>('div.dropdowns');
  }

  /**
   * Set whether or not show only hours/minutes/seconds dropdowns without input
   * @param {string|boolean|null} val embeddable param value
   */
  set embeddable(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.EMBEDDABLE, 'true');
    } else {
      this.removeAttribute(attributes.EMBEDDABLE);
    }

    this.render();
    this.connectedCallback();
  }

  /**
   * embeddable attribute
   * @returns {boolean} whether or not to show only hours/minutes/seconds dropdowns without input
   */
  get embeddable(): boolean {
    return stringToBool(this.getAttribute(attributes.EMBEDDABLE));
  }

  /**
   * Set hours attribute and update value in hours dropdown
   * @param {string|number|null} value hours param value
   */
  set hours(value: string | number | null) {
    if (value !== null) {
      this.setAttribute(attributes.HOURS, String(value));
    } else {
      this.removeAttribute(attributes.HOURS);
    }

    this.updateValue();
    this.container?.querySelector('ids-dropdown#hours')?.setAttribute(attributes.VALUE, String(value));
  }

  /**
   * hours attribute, default is 1
   * @returns {number} hours attribute value converted to number
   */
  get hours(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.HOURS));

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    if (this.#hasHourRange()) {
      return this.#getHourOptions()[0];
    }

    if (this.useCurrentTime && Number.isNaN(numberVal)) {
      const hours24Now = new Date().getHours();

      if (this.#is12Hours()) {
        return hoursTo12(hours24Now);
      }

      return hours24Now;
    }

    return 1;
  }

  /**
   * Set minutes attribute and update value in minutes dropdown
   * @param {string|number|null} value minutes param value
   */
  set minutes(value: string | number | null) {
    if (value !== null) {
      this.setAttribute(attributes.MINUTES, String(value));
    } else {
      this.removeAttribute(attributes.MINUTES);
    }

    this.updateValue();
    this.container?.querySelector('ids-dropdown#minutes')?.setAttribute(attributes.VALUE, String(value));
  }

  /**
   * minutes attribute, default is 0
   * @returns {number} minutes attribute value converted to number
   */
  get minutes(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.MINUTES));

    if (!Number.isNaN(numberVal)) {
      return this.#roundToInterval(numberVal, this.minuteInterval);
    }

    if (this.useCurrentTime && Number.isNaN(numberVal)) {
      const minutesNow = new Date().getMinutes();

      return this.#roundToInterval(minutesNow, this.minuteInterval);
    }

    // Default
    return 0;
  }

  /**
   * Set interval in minutes dropdown
   * @param {string|number|null} val minute-interval attribute value
   */
  set minuteInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal)) {
      this.setAttribute(attributes.MINUTE_INTERVAL, String(numberVal));
    } else {
      this.removeAttribute(attributes.MINUTE_INTERVAL);
    }

    this.updateValue();
    this.renderDropdowns();
  }

  /**
   * minute-interval attribute, default is 5
   * @returns {number} minuteInterval value
   */
  get minuteInterval(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.MINUTE_INTERVAL));

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return 5;
  }

  /**
   * Set seconds attribute and update value in seconds dropdown
   * @param {string|number|null} value seconds param value
   */
  set seconds(value: string | number | null) {
    if (value !== null) {
      this.setAttribute(attributes.SECONDS, String(value));
    } else {
      this.removeAttribute(attributes.SECONDS);
    }

    this.updateValue();
    this.container?.querySelector('ids-dropdown#seconds')?.setAttribute(attributes.VALUE, String(value));
  }

  /**
   * seconds attribute, default is 0
   * @returns {number} seconds attribute value converted to number
   */
  get seconds(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.SECONDS));

    if (!Number.isNaN(numberVal)) {
      return this.#roundToInterval(numberVal, this.secondInterval);
    }

    if (this.useCurrentTime && Number.isNaN(numberVal)) {
      const secondsNow = new Date().getSeconds();

      return this.#roundToInterval(secondsNow, this.secondInterval);
    }

    // Default
    return 0;
  }

  /**
   * Set interval in seconds dropdown
   * @param {string|number|null} val second-interval attribute value
   */
  set secondInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal)) {
      this.setAttribute(attributes.SECOND_INTERVAL, String(numberVal));
    } else {
      this.removeAttribute(attributes.SECOND_INTERVAL);
    }

    this.updateValue();
    this.renderDropdowns();
  }

  /**
   * second-interval attribute, default is 5
   * @returns {number} secondInterval value
   */
  get secondInterval(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.SECOND_INTERVAL));

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return 5;
  }

  /**
   * Set period attribute and update value in period dropdown
   * @param {string|null} value period param value
   */
  set period(value: string | null) {
    if (value) {
      this.setAttribute(attributes.PERIOD, value);
    } else {
      this.removeAttribute(attributes.PERIOD);
    }

    // Updating hours dropdown with AM/PM range
    this.updateValue();
    this.renderDropdowns();
    if (value) {
      if (this.#hasHourRange()) {
        this.container?.querySelector('ids-dropdown#hours')?.setAttribute(attributes.VALUE, String(this.#getHourOptions()[0]));
      } else {
        this.container?.querySelector('ids-dropdown#period')?.setAttribute(attributes.VALUE, value.toString().toUpperCase());
      }
    }
  }

  /**
   * period attribute, default is first day period in locale calendar
   * @returns {string} period attribute value
   */
  get period(): string {
    const attrVal = this.getAttribute(attributes.PERIOD);
    const dayPeriods: Array<string> = this.#getDayPeriodsWithRange();
    const dayPeriodExists: boolean = dayPeriods.map((item: string) => item.toLowerCase())
      .includes(attrVal?.toString().toLowerCase() as string);

    if (!this.#hasPeriod()) return '';

    if (attrVal && dayPeriodExists) {
      return attrVal;
    }

    if (this.useCurrentTime) {
      const hours24Now = new Date().getHours();

      if (hours24Now >= 12) {
        return dayPeriods[1];
      }

      return dayPeriods[0];
    }

    return dayPeriods[0];
  }

  /**
   * Set start of limited hours range
   * @param {string|number|null} val to be set as end-hour attribute
   */
  set startHour(val: number | string | null) {
    if (val) {
      this.setAttribute(attributes.START_HOUR, String(val));
    } else {
      this.removeAttribute(attributes.START_HOUR);
    }

    this.updateValue();
    this.renderDropdowns();
  }

  /**
   * start-hour attribute, default is 0
   * @returns {number} startHour param converted to number from attribute value
   */
  get startHour(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.START_HOUR));

    if (!Number.isNaN(numberVal) && numberVal >= 0) {
      return numberVal;
    }

    return 0;
  }

  /**
   * Set end of limited hours range
   * @param {string|number|null} val to be set as end-hour attribute
   */
  set endHour(val: number | string | null) {
    if (val) {
      this.setAttribute(attributes.END_HOUR, String(val));
    } else {
      this.removeAttribute(attributes.END_HOUR);
    }

    this.updateValue();
    this.renderDropdowns();
  }

  /**
   * end-hour attribute, default is 24
   * @returns {number} endHour param converted to number from attribute value
   */
  get endHour(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.END_HOUR));

    if (!Number.isNaN(numberVal) && numberVal <= 24) {
      return numberVal;
    }

    return 24;
  }

  /**
   * Set whether or not to show current time in the dropdowns
   * @param {string|boolean|null} val useCurrentTime param value
   */
  set useCurrentTime(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.USE_CURRENT_TIME, 'true');
    } else {
      this.removeAttribute(attributes.USE_CURRENT_TIME);
    }

    this.updateValue();
    this.renderDropdowns();
  }

  /**
   * use-current-time attribute
   * @returns {number} useCurrentTime param converted to boolean from attribute value
   */
  get useCurrentTime(): boolean {
    return stringToBool(this.getAttribute(attributes.USE_CURRENT_TIME));
  }

  /**
   * Stored timestring-value of the timepickers input-field
   * @private
   */
  #value: string | null;

  /**
   * Sets a current timestring-value of the timepickers input-field
   * @param {string} value - a timestring value for the input-field
   */
  set value(value: string) {
    const currentValue = this.#value;
    if (value !== currentValue) {
      this.#value = value;
      if (value) {
        this.setAttribute(attributes.VALUE, value);
      } else {
        this.removeAttribute(attributes.VALUE);
      }

      this.syncTimeAttributes(value);
    }
  }

  /**
   * Gets a timestring that matches the format specified by this.format()
   * @returns {string} the current timestring value of the timepicker
   */
  get value(): string { return this.#value || ''; }

  /**
   * Focuses the first available dropdown element
   */
  focus() {
    const dropdownEl = this.container?.querySelector<IdsDropdown>('ids-dropdown');
    if (dropdownEl) dropdownEl.focus();
    else this.applyButtonEl?.focus();
  }

  /**
   * @returns {string} formatted time string
   */
  getFormattedTime() {
    const date: Date = new Date();
    const dayPeriodIndex: number = this.localeAPI?.calendar().dayPeriods?.indexOf(this.period);

    date.setHours(hoursTo24(this.hours, dayPeriodIndex), this.minutes, this.seconds);
    return this.localeAPI.formatDate(date, { pattern: this.format });
  }

  onHide() {
    this.removeRipples();
    this.container?.setAttribute('tabindex', '-1');
    this.capturesFocus = false;
    this.cyclesFocus = false;
  }

  onShow() {
    this.container?.removeAttribute('tabindex');
    this.capturesFocus = true;
    this.cyclesFocus = true;
    this.focus();
  }
}

export default IdsTimePickerPopup;
