import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import { hoursTo12, hoursTo24, isValidDate } from '../../utils/ids-date-utils/ids-date-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import Base from './ids-time-picker-base';
import '../ids-dropdown/ids-dropdown';
import '../ids-popup/ids-popup';
import '../ids-trigger-field/ids-trigger-field';
import type IdsDropdown from '../ids-dropdown/ids-dropdown';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import type IdsPopup from '../ids-popup/ids-popup';

import styles from './ids-time-picker.scss';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import { IdsPopupElementRef } from '../ids-popup/ids-popup-attributes';

const range: any = (start: any, stop: any, step = 1) => (
  start > stop ? [] : [start, ...range(start + Math.abs(step), stop, step)]
);

/**
 * IDS TimePicker Component
 * @type {IdsTimePicker}
 * @inherits IdsElement
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLabelStateMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container of the component
 * @part trigger-button - the trigger button
 * @part icon - the icon in the trigger button
 * @part input - the input element
 * @part popup - the popup with dropdowns
 * @part btn-set - the set button in the popup
 * @part hours - the hours dropdown
 * @part minutes - the minutes dropdown
 * @part seconds - the seconds dropdown
 * @part period - the period dropdown
 */
@customElement('ids-time-picker')
@scss(styles)
export default class IdsTimePicker extends Base {
  isFormComponent = true;

  triggerButton?: IdsTriggerButton | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.triggerButton = this.container?.querySelector<IdsTriggerButton>('ids-trigger-button');
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#renderDropdowns();
    this.#applyMask();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.close();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @private
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOSELECT,
      attributes.AUTOUPDATE,
      attributes.DISABLED,
      attributes.EMBEDDABLE,
      attributes.END_HOUR,
      attributes.FORMAT,
      attributes.HOURS,
      attributes.ID,
      attributes.LABEL,
      attributes.MINUTES,
      attributes.NO_MARGINS,
      attributes.PERIOD,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SECONDS,
      attributes.SIZE,
      attributes.START_HOUR,
      attributes.TABBABLE,
      attributes.USE_CURRENT_TIME,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
    ];
  }

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants = ['alternate-formatter'];

  /**
   * Push color variant to the trigger-field element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    if (this.input) {
      this.input.colorVariant = this.colorVariant;
    }
  }

  /**
   * Push label-state to the trigger-field element
   * @returns {void}
   */
  onLabelStateChange(): void {
    if (this.input) {
      this.input.labelState = this.labelState;
    }
  }

  /**
   * Push field-height/compact to the trigger-field element
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string) {
    if (val) {
      const attr = val === 'compact' ? { name: 'compact', val: '' } : { name: 'field-height', val };
      this.input?.setAttribute(attr.name, attr.val);
    } else {
      this.input?.removeAttribute('compact');
      this.input?.removeAttribute('field-height');
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} HTML for the template
   */
  template() {
    if (this.embeddable) {
      return `<div class="ids-time-picker" part="container">
        <div class="dropdowns" part="dropdowns"></div>
      </div>`;
    }

    const colorVariant = this.colorVariant ? ` color-variant="${this.colorVariant}"` : '';
    const fieldHeight = this.fieldHeight ? ` field-height="${this.fieldHeight}"` : '';
    const labelState = this.labelState ? ` label-state="${this.labelState}"` : '';
    const compact = this.compact ? ' compact' : '';
    const noMargins = this.noMargins ? ' no-margins' : '';

    return `
      <div class="ids-time-picker" part="container">
        <ids-trigger-field
          ${this.id ? `id="${this.id}"` : ''}
          ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
          label="${this.label}"
          size="${this.size}"
          placeholder="${this.placeholder}"
          value="${this.value}"
          disabled="${this.disabled}"
          ${this.validate ? `validate="${this.validate}"` : ''}
          validation-events="${this.validationEvents}"
          ${this.mask ? 'mask="date"' : ''}
          part="input"
        >
          <ids-text audible="true" translate-text="true">UseArrow</ids-text>
          <ids-trigger-button slot="trigger-end" part="trigger-button">
            <ids-text audible="true" translate-text="true">TimepickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="clock" part="icon"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup type="menu" tabindex="-1" part="popup">
          <section slot="content">
            <div class="dropdowns" part="dropdowns"></div>
            <ids-button class="popup-btn" hidden="${this.autoupdate}" part="btn-set">
              <ids-text translate-text="true" font-weight="bold">SetTime</ids-text>
            </ids-button>
          </section>
        </ids-popup>
      <div>
    `;
  }

  /**
   * Callback for dirty tracker setting change
   * @param {boolean} value The changed value
   * @returns {void}
   */
  onDirtyTrackerChange(value: boolean) {
    if (value) {
      this.input?.setAttribute(attributes.DIRTY_TRACKER, String(value));
    } else {
      this.input?.removeAttribute(attributes.DIRTY_TRACKER);
    }
  }

  /**
   * Runs when a click event is propagated to the window.
   * @private
   * @see IdsPopupOpenEventsMixin.addOpenEvents()
   * @param {MouseEvent} e the original click event
   * @returns {void}
   */
  onOutsideClick(e: any): void {
    const path = e.path || (e.composedPath && e.composedPath());
    if ((!this.autoselect && !path?.includes(this.popup))
    || (this.autoselect && !path?.includes(this.popup) && !path?.includes(this.input))) {
      this.close();
    }
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {IdsTimePicker} this class-instance object for chaining
   */
  #attachKeyboardListeners(): IdsTimePicker {
    this.listen(['ArrowDown', 'Escape', 'Backspace'], this, (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        this.open();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        this.close();
      }
    });

    return this;
  }

  /**
   * Establish Internal Event Handlers
   * @returns {IdsTimePicker} this class-instance object for chaining
   * @private
   */
  #attachEventHandlers(): IdsTimePicker {
    this.offEvent('change.time-picker-dropdowns');
    this.onEvent('change.time-picker-dropdowns', this.container?.querySelector('.dropdowns'), (e: any) => {
      const currentId = e.detail?.elem?.id;

      if (!currentId) return;

      this.setAttribute(currentId, e.detail.value);

      if (this.autoupdate) {
        this.#setTimeOnField();
      }
    });

    this.offEvent('click.time-picker-set');
    this.onEvent('click.time-picker-set', this.container?.querySelector('.popup-btn'), () => {
      this.#setTimeOnField();
      this.close();

      if (!(this.autoupdate || this.autoselect)) {
        this.input?.focus();
      }
    });

    this.offEvent('click.time-picker-popup');
    this.onEvent('click.time-picker-popup', this.triggerButton, () => {
      this.#toggleTimePopup();
    });

    this.offEvent('focus.time-picker-input');
    this.onEvent('focus.time-picker-input', this.input, () => {
      if (this.autoselect) {
        this.open();
      }
    });

    // Translate Labels
    this.offEvent('languagechange.time-picker-container');
    this.onEvent('languagechange.time-picker-container', getClosest(this, 'ids-container'), () => {
      this.#renderDropdowns();
      this.#setTimeValidation();
    });

    // Change component value on input value change
    this.offEvent('change.time-picker-input');
    this.onEvent('change.time-picker-input', this.input, (e: any) => {
      this.setAttribute(attributes.VALUE, e.detail.value);
    });

    return this;
  }

  /**
   * Render dropdowns
   */
  #renderDropdowns(): void {
    // Clear before rendering
    this.container?.querySelectorAll<HTMLElement>('.dropdowns ids-dropdown, .dropdowns .separator').forEach((item) => item.remove());

    // Adding dropdowns
    this.container?.querySelector('.dropdowns')?.insertAdjacentHTML('afterbegin', this.#dropdowns());
  }

  /**
   * Parse input date and populate dropdowns
   */
  #parseInputValue(): void {
    const inputDate = this.locale?.parseDate(
      this.input?.value || this.value,
      { dateFormat: this.format }
    ) as Date;
    const hours24 = inputDate?.getHours();
    const hours12 = hoursTo12(hours24);
    const minutes = inputDate?.getMinutes();
    const seconds = inputDate?.getSeconds();
    const period = inputDate && this.locale?.calendar()?.dayPeriods[hours24 >= 12 ? 1 : 0];

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
   * @returns {boolean} returns true if the timepicker format includes seconds ("ss")
   */
  #hasSeconds(): boolean {
    return this.format.toLowerCase().includes('ss');
  }

  /**
   * @returns {boolean} returns true if the timepicker format includes the am/pm period (" a")
   */
  #hasPeriod(): boolean {
    return this.#is12Hours() && this.format.toLowerCase().includes(' a');
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
      label: this.locale?.translate('Hours') || 'Hours',
      options: this.#getHourOptions(),
      value: this.hours,
      padStart: this.format.includes('HH') || this.format.includes('hh')
    });
    const minutes = dropdown({
      id: 'minutes',
      label: this.locale?.translate('Minutes') || 'Minutes',
      options: range(0, 59, this.minuteInterval),
      value: this.minutes,
      padStart: this.format.includes('mm')
    });
    const seconds = this.#hasSeconds() && dropdown({
      id: 'seconds',
      label: this.locale?.translate('Seconds') || 'Seconds',
      options: range(0, 59, this.secondInterval),
      value: this.seconds,
      padStart: true
    });
    const dayPeriods = this.#getDayPeriodsWithRange();
    const period = this.#hasPeriod() && dayPeriods && dropdown({
      id: 'period',
      label: this.locale?.translate('Period') || 'Period',
      options: dayPeriods,
      value: this.period
    });

    const separator = '<span class="separator colons">:</span>';
    const spacer = '<span class="separator">&nbsp;</span>';

    const numbers = [hours, minutes, seconds].filter(Boolean).join(separator);

    return [numbers, period].filter(Boolean).join(spacer);
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

    const dayPeriodIndex = this.locale?.calendar().dayPeriods?.indexOf(this.period);

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
   * @returns {number} start hour in range by day period
   */
  #getPeriodStartHour(): number {
    const dayPeriodIndex: number = this.locale?.calendar().dayPeriods?.indexOf(this.period);

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
    const dayPeriodIndex = this.locale?.calendar().dayPeriods?.indexOf(this.period);

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
    const dayPeriods: Array<string> = this.locale?.calendar().dayPeriods || [];

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

  /**
   * Get the input-field's timestring value
   * @returns {string} formatted timestring
   */
  #getTimeOnField(): string {
    const date: Date = new Date();
    const dayPeriodIndex: number = this.locale?.calendar().dayPeriods?.indexOf(this.period);

    date.setHours(hoursTo24(this.hours, dayPeriodIndex), this.minutes, this.seconds);

    return this.locale.formatDate(date, { pattern: this.format });
  }

  /**
   * Set the input-field's timestring value
   */
  #setTimeOnField(): void {
    const value = this.#getTimeOnField();

    if (this.input) {
      this.input.value = value;
    }
  }

  /**
   * Valid time validation extend validation mixin
   */
  #setTimeValidation(): void {
    if (this.validate?.includes('time')) {
      this.input?.addValidationRule({
        id: 'time',
        type: 'error',
        message: this.locale?.translate('InvalidTime'),
        check: (input: any) => {
          if (!input.value) return true;

          const date = this.locale.parseDate(
            input.value,
            { dateFormat: this.format, strictTime: true }
          ) as Date;

          return isValidDate(date);
        }
      });
    }
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
   * Applying ids-mask to the input when changing locale or format
   */
  #applyMask() {
    if (this.input && this.mask) {
      this.input.maskOptions = { format: this.format };
    }
  }

  /**
   * Close the timepicker's popup window
   */
  close() {
    if (this.popup) {
      this.popup.visible = false;
      this.removeOpenEvents();

      this.container?.classList.remove('is-open');
      this.popup.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Open the timepicker's popup window
   */
  open() {
    if (this.popup && !this.popup.visible && !this.disabled && !this.readonly) {
      this.popup.alignTarget = this.input?.container?.querySelector('.field-container') as IdsPopupElementRef;
      this.popup.arrowTarget = this.triggerButton as IdsPopupElementRef;
      this.popup.align = `bottom, ${this.locale.isRTL() || ['md', 'lg', 'full'].includes(this.size) ? 'right' : 'left'}`;
      this.popup.arrow = 'bottom';
      this.popup.y = 16;
      this.popup.visible = true;

      this.addOpenEvents();

      this.container?.classList.add('is-open');
      this.popup.removeAttribute('tabindex');

      // Update dropdown values each time the popup is opened if using current time
      if (!this.input?.value && this.useCurrentTime) {
        this.#parseInputValue();
      }

      // Focus hours dropdown
      if (!this.autoselect) {
        this.container
          ?.querySelector<IdsDropdown>('#hours')?.container
          ?.querySelector<IdsTriggerField>('ids-trigger-field')?.focus();
      }
    }
  }

  /**
   * Toggle visibility for the timepicker's popup window
   */
  #toggleTimePopup() {
    if (this.popup?.visible) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * @returns {HTMLElement} reference to the IdsPopup component
   */
  get popup(): IdsPopup | null {
    return this.container?.querySelector<IdsPopup>('ids-popup') || null;
  }

  /**
   * @returns {HTMLElement} Reference to the IdsTriggerField
   */
  get input(): IdsTriggerField | null {
    return this.container?.querySelector<IdsTriggerField>('ids-trigger-field') || null;
  }

  /**
   * Sets the time format to use in the picker.
   * @param {string|null} value - a variation of "hh:mm:ss a"
   */
  set format(value: string | null) {
    if (value) {
      this.setAttribute(attributes.FORMAT, value);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }

    this.#renderDropdowns();
    this.#applyMask();
  }

  /**
   * Gets the time format to use in the picker. Defaults to the current locale's time format or english ("hh:mm a")
   * @returns {string} the time format being used
   */
  get format(): string {
    return this.getAttribute(attributes.FORMAT) || this.locale?.calendar().timeFormat || 'hh:mm a';
  }

  /**
   * Sets a current timestring-value of the timepickers input-field
   * @param {string} value - a timestring value for the input-field
   */
  set value(value: string) {
    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, value);
      this.#parseInputValue();

      if (this.input) {
        this.input.value = value;
      }
    }
  }

  /**
   * Gets a timestring that matches the format specified by this.format()
   * @returns {string} the current timestring value of the timepicker
   */
  get value(): string { return this.getAttribute(attributes.VALUE) || ''; }

  /**
   * Sets the autoselect attribute
   * @param {boolean|string|null} value - true or false
   */
  set autoselect(value) {
    const boolVal = stringToBool(value);

    if (boolVal) {
      this.setAttribute(attributes.AUTOSELECT, 'true');
    } else {
      this.removeAttribute(attributes.AUTOSELECT);
    }
  }

  /**
   * Gets the autoselect attribute
   * @returns {boolean} true if autoselect is enabled
   */
  get autoselect(): boolean {
    return stringToBool(this.getAttribute(attributes.AUTOSELECT));
  }

  /**
   * Sets the autoupdate attribute
   * @param {boolean} value - true or false
   */
  set autoupdate(value: boolean) {
    const boolVal = stringToBool(value);
    const popupBtn = this.container?.querySelector('.popup-btn');

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
   * @returns {boolean} true if autoselect is enabled
   */
  get autoupdate(): boolean {
    return stringToBool(this.getAttribute(attributes.AUTOUPDATE));
  }

  /**
   * Sets the disabled attribute
   * @param {boolean|string|null} value - true or false
   */
  set disabled(value: boolean | string | null) {
    const boolVal = stringToBool(value);

    if (boolVal) {
      this.setAttribute(attributes.DISABLED, 'true');
      this.input?.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.input?.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * Gets the disabled attribute
   * @returns {boolean} true if the timepicker is disabled
   */
  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets the readonly attribute
   * @param {boolean|string|null} value - true or false
   */
  set readonly(value: boolean | string | null) {
    const boolVal = stringToBool(value);

    if (boolVal) {
      this.setAttribute(attributes.READONLY, 'true');
      this.input?.setAttribute(attributes.READONLY, 'true');
    } else {
      this.removeAttribute(attributes.READONLY);
      this.input?.removeAttribute(attributes.READONLY);
    }
  }

  /**
   * Gets the readonly attribute
   * @returns {boolean} true if the timepicker is in readonly mode
   */
  get readonly(): boolean {
    return stringToBool(this.getAttribute(attributes.READONLY));
  }

  /**
   * Sets the label attribute
   * @param {string|null} value - the label's text
   */
  set label(value: string | null) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
      this.input?.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
      this.input?.removeAttribute(attributes.LABEL);
    }
  }

  /**
   * Gets the label attribute
   * @returns {string} default is ""
   */
  get label(): string { return this.getAttribute(attributes.LABEL) ?? ''; }

  /**
   * Sets the placeholder attribute
   * @param {string} value - the placeholder's text
   */
  set placeholder(value: string) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.input?.setAttribute(attributes.PLACEHOLDER, value);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.input?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  /**
   * Get the placeholder attribute
   * @returns {string} default is ""
   */
  get placeholder(): string {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  /**
   * Sets the no margins attribute
   * @param {string|boolean|null} value The value for no margins attribute
   */
  set noMargins(value: string | boolean | null) {
    const boolVal = stringToBool(value);

    if (boolVal) {
      this.setAttribute(attributes.NO_MARGINS, 'true');
      this.input?.setAttribute(attributes.NO_MARGINS, 'true');
    } else {
      this.removeAttribute(attributes.NO_MARGINS);
      this.input?.removeAttribute(attributes.NO_MARGINS);
    }
  }

  /**
   * no-margins attribute
   * @returns {boolean} noMargins parameter
   */
  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Set the time picker size
   * @param {string} value The value
   */
  set size(value: string) {
    if (value) {
      this.setAttribute(attributes.SIZE, value);
    } else {
      this.removeAttribute(attributes.SIZE);
    }

    this.input?.setAttribute(attributes.SIZE, this.size);
  }

  /**
   * Get the size attribute
   * @returns {string} default is "sm"
   */
  get size(): string {
    return this.getAttribute(attributes.SIZE) ?? 'sm';
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

    this.#renderDropdowns();
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

    this.#renderDropdowns();
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

    this.container?.querySelector('ids-dropdown#hours')?.setAttribute(attributes.VALUE, String(this.hours));
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
   * Gets hours in 24 hour format
   * @returns {number} input value in 24 hours format
   */
  get hours24(): number {
    const inputDate = this.locale?.parseDate(
      this.input?.value || this.value,
      { dateFormat: this.format }
    ) as Date;

    return inputDate.getHours();
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

    this.container?.querySelector('ids-dropdown#minutes')?.setAttribute(attributes.VALUE, String(this.minutes));
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
   * Set seconds attribute and update value in seconds dropdown
   * @param {string|number|null} value seconds param value
   */
  set seconds(value: string | number | null) {
    if (value !== null) {
      this.setAttribute(attributes.SECONDS, String(value));
    } else {
      this.removeAttribute(attributes.SECONDS);
    }

    this.container?.querySelector('ids-dropdown#seconds')?.setAttribute(attributes.VALUE, String(this.seconds));
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
    if (this.#hasHourRange()) {
      this.#renderDropdowns();
      this.container?.querySelector('ids-dropdown#hours')?.setAttribute(attributes.VALUE, String(this.#getHourOptions()[0]));
    } else {
      this.container?.querySelector('ids-dropdown#period')?.setAttribute(attributes.VALUE, this.period);
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
   * Set trigger field/input validation
   * @param {string|null} val validate param
   */
  set validate(val: string | null) {
    if (val) {
      this.setAttribute(attributes.VALIDATE, val);
      this.input?.setAttribute(attributes.VALIDATE, val);
      this.input?.setAttribute(attributes.VALIDATION_EVENTS, this.validationEvents);
      this.input?.handleValidation();
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.input?.removeAttribute(attributes.VALIDATE);
      this.input?.removeAttribute(attributes.VALIDATION_EVENTS);
      this.input?.handleValidation();
    }

    this.#setTimeValidation();
  }

  /**
   * validate attribute
   * @returns {string|null} validate param
   */
  get validate(): string | null { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set which input events to fire validation on
   * @param {string|null} val validation-events attribute
   */
  set validationEvents(val: string | null) {
    if (val) {
      this.setAttribute(attributes.VALIDATION_EVENTS, val);
      this.input?.setAttribute(attributes.VALIDATION_EVENTS, val);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.input?.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  /**
   * validation-events attributes
   * @returns {string} validationEvents param. Default is 'change blur'
   */
  get validationEvents(): string { return this.getAttribute(attributes.VALIDATION_EVENTS) ?? 'change blur'; }

  /**
   * Set trigger field tabbable attribute
   * @param {boolean|string|null} val true or false depending if the trigger field is tabbable
   */
  set tabbable(val: boolean | string | null) {
    this.setAttribute(attributes.TABBABLE, String(val));
    this.input?.setAttribute(attributes.TABBABLE, String(val));
  }

  /**
   * tabbable attribute
   * @returns {boolean} tabbable param
   */
  get tabbable(): boolean {
    const attrVal = this.getAttribute(attributes.TABBABLE);

    // tabbable by default
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set trigger field/input id attribute
   * @param {string} val id
   */
  set id(val: string) {
    if (val) {
      this.setAttribute(attributes.ID, val);
      this.input?.setAttribute(attributes.ID, val);
    } else {
      this.removeAttribute(attributes.ID);
      this.input?.removeAttribute(attributes.ID);
    }
  }

  /**
   * id attribute
   * @returns {string} id param
   */
  get id(): string { return this.getAttribute(attributes.ID) ?? ''; }

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

    this.#renderDropdowns();
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

    this.#renderDropdowns();
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

    this.#renderDropdowns();
  }

  /**
   * use-current-time attribute
   * @returns {number} useCurrentTime param converted to boolean from attribute value
   */
  get useCurrentTime(): boolean {
    return stringToBool(this.getAttribute(attributes.USE_CURRENT_TIME));
  }

  /**
   * Enable/disable mask for the input
   * @param {string|boolean|null} val mask param value
   */
  set mask(val: string | boolean | null) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.MASK, 'true');
      this.input?.setAttribute(attributes.MASK, 'date');
    } else {
      this.removeAttribute(attributes.MASK);
      this.input?.removeAttribute(attributes.MASK);
    }
  }

  /**
   * mask attribute
   * @returns {boolean} mask param converted to boolean from attribute value
   */
  get mask(): boolean {
    const attrVal = this.getAttribute(attributes.MASK);

    return stringToBool(attrVal);
  }
}
