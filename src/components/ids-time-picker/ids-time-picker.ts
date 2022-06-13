import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import Base from './ids-time-picker-base';
import '../ids-dropdown/ids-dropdown';
import '../ids-popup/ids-popup';
import '../ids-trigger-field/ids-trigger-field';

import styles from './ids-time-picker.scss';

const range: any = (start: any, stop: any, step = 1) => (
  start > stop ? [] : [start, ...range(start + Math.abs(step), stop, step)]
);

/**
 * IDS TimePicker Component
 * @type {IdsTimePicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-time-picker')
@scss(styles)
export default class IdsTimePicker extends Base {
  constructor() {
    super();
  }

  /**
   * Elements for internal usage
   * @private
   */
  #triggerButton = this.container.querySelector('ids-trigger-button');

  connectedCallback() {
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    this.#renderDropdowns();
    super.connectedCallback();
  }

  disconnectedCallback() {
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
      attributes.TABBABLE,
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
  onlabelStateChange(): void {
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
      return `<div class="ids-time-picker">
        <div class="dropdowns"></div>
      </div>`;
    }

    const colorVariant = this.colorVariant ? ` color-variant="${this.colorVariant}"` : '';
    const fieldHeight = this.fieldHeight ? ` field-height="${this.fieldHeight}"` : '';
    const labelState = this.labelState ? ` label-state="${this.labelState}"` : '';
    const compact = this.compact ? ' compact' : '';
    const noMargins = this.noMargins ? ' no-margins' : '';

    return `
      <div class="ids-time-picker">
        <ids-trigger-field
          ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
          label="${this.label}"
          size="${this.size}"
          placeholder="${this.placeholder}"
          value="${this.value}"
          disabled="${this.disabled}"
          ${this.validate ? `validate="${this.validate}"` : ''}
          validation-events="${this.validationEvents}"
        >
          <ids-text audible="true" translate-text="true">UseArrow</ids-text>
          <ids-trigger-button slot="trigger-end">
            <ids-text audible="true" translate-text="true">TimepickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="clock"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup type="menu" tabindex="-1">
          <section slot="content">
            <div class="dropdowns"></div>
            <ids-button class="popup-btn" hidden="${this.autoupdate}">
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
      this.input?.setAttribute(attributes.DIRTY_TRACKER, value);
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
    if ((!this.autoselect && !e.path?.includes(this.popup))
    || (this.autoselect && !e.path?.includes(this.popup) && !e.path?.includes(this.input))) {
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
    this.onEvent('change.time-picker-dropdowns', this.container.querySelector('.dropdowns'), (e: any) => {
      const currentId = e.detail?.elem?.id;

      if (!currentId) return;

      this.setAttribute(currentId, e.detail.value);

      if (this.autoupdate) {
        this.#setTimeOnField();
      }
    });

    this.offEvent('click.time-picker-set');
    this.onEvent('click.time-picker-set', this.container.querySelector('.popup-btn'), () => {
      this.#setTimeOnField();
      this.close();
    });

    this.offEvent('click.time-picker-popup');
    this.onEvent('click.time-picker-popup', this.#triggerButton, () => {
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
    this.container.querySelectorAll('.dropdowns ids-dropdown, .dropdowns .separator')
      .forEach((item: HTMLElement) => {
        item.remove();
      });

    // Adding dropdowns
    this.container.querySelector('.dropdowns')?.insertAdjacentHTML('afterbegin', this.#dropdowns());
  }

  /**
   * Parse input date and populate dropdowns
   */
  #parseInputValue(): void {
    const inputDate: Date = this.locale?.parseDate(
      this.value,
      { dateFormat: this.format }
    );
    const hours = inputDate?.getHours();
    const hours12 = hours === 0 ? 12 : hours % 12;
    const minutes = inputDate?.getMinutes();
    const seconds = inputDate?.getSeconds();

    if (this.#is24Hours() && hours && hours !== this.hours) {
      this.hours = hours;
    }

    if (this.#is12Hours() && hours && hours12 !== this.hours) {
      this.hours = hours12;
    }

    if (minutes && minutes !== this.minutes) {
      this.minutes = minutes;
    }

    if (seconds && seconds !== this.seconds) {
      this.seconds = seconds;
    }

    if (this.#hasPeriod()) {
      this.locale?.calendar().dayPeriods?.forEach((dayPeriod: string) => {
        if (this.value?.toLowerCase().includes(dayPeriod?.toLowerCase())) {
          this.period = dayPeriod;
        }
      });
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
      <ids-dropdown id="${id}" class="dropdown" label="${label}" value="${value}" size="xs">
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
      options: range(1, this.#is12Hours() ? 12 : 23),
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
    const dayPeriods = this.locale?.calendar().dayPeriods;
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
   * Set the input-field's timestring value
   */
  #setTimeOnField(): void {
    const date = new Date();
    const dayPeriodIndex = this.locale?.calendar().dayPeriods?.indexOf(this.period);
    const hours24 = this.hours + (dayPeriodIndex === -1 ? 0 : dayPeriodIndex) * 12;

    date.setHours(hours24, this.minutes, this.seconds);

    const value = this.locale.formatDate(date, { pattern: this.format });

    if (this.input) {
      this.input.value = value;
    }
  }

  /**
   * Close the timepicker's popup window
   */
  close() {
    if (this.popup) {
      this.popup.visible = false;
      this.removeOpenEvents();

      this.container.classList.remove('is-open');
      this.popup.setAttribute('tabindex', -1);
    }
  }

  /**
   * Open the timepicker's popup window
   */
  open() {
    if (!this.popup.visible && !this.disabled && !this.readonly) {
      this.popup.alignTarget = this.input;
      this.popup.arrowTarget = this.#triggerButton;
      this.popup.align = 'bottom, left';
      this.popup.arrow = 'bottom';
      this.popup.visible = true;

      this.addOpenEvents();

      this.container.classList.add('is-open');
      this.popup.removeAttribute('tabindex');
    }
  }

  /**
   * Close the timepicker's popup window
   */
  #toggleTimePopup() {
    if (this.popup.visible) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * @returns {any} reference to the IdsPopup component
   */
  get popup(): any {
    return this.container.querySelector('ids-popup');
  }

  /**
   * @returns {HTMLInputElement} Reference to the IdsTriggerField
   */
  get input(): any {
    return this.container.querySelector('ids-trigger-field');
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
      this.setAttribute(attributes.AUTOSELECT, boolVal);
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
    const popupBtn = this.container.querySelector('.popup-btn');

    if (boolVal) {
      this.setAttribute(attributes.AUTOUPDATE, boolVal);
      popupBtn?.setAttribute('hidden', boolVal);
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
      this.setAttribute(attributes.DISABLED, boolVal);
      this.input?.setAttribute(attributes.DISABLED, boolVal);
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
      this.setAttribute(attributes.READONLY, boolVal);
      this.input?.setAttribute(attributes.READONLY, boolVal);
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
      this.setAttribute(attributes.NO_MARGINS, boolVal);
      this.input?.setAttribute(attributes.NO_MARGINS, boolVal);
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
      this.setAttribute(attributes.MINUTE_INTERVAL, numberVal);
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
      this.setAttribute(attributes.SECOND_INTERVAL, numberVal);
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
      this.setAttribute(attributes.EMBEDDABLE, boolVal);
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
    if (value) {
      this.setAttribute(attributes.HOURS, value);
    } else {
      this.removeAttribute(attributes.HOURS);
    }

    this.container.querySelector('ids-dropdown#hours')?.setAttribute(attributes.VALUE, this.hours);
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

    return 1;
  }

  /**
   * Set minutes attribute and update value in minutes dropdown
   * @param {string|number|null} value minutes param value
   */
  set minutes(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.MINUTES, value);
    } else {
      this.removeAttribute(attributes.MINUTES);
    }

    this.container.querySelector('ids-dropdown#minutes')?.setAttribute(attributes.VALUE, this.minutes);
  }

  /**
   * minutes attribute, default is 0
   * @returns {number} minutes attribute value converted to number
   */
  get minutes(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.MINUTES));

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return 0;
  }

  /**
   * Set seconds attribute and update value in seconds dropdown
   * @param {string|number|null} value seconds param value
   */
  set seconds(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.SECONDS, value);
    } else {
      this.removeAttribute(attributes.SECONDS);
    }

    this.container.querySelector('ids-dropdown#seconds')?.setAttribute(attributes.VALUE, this.seconds);
  }

  /**
   * seconds attribute, default is 0
   * @returns {number} seconds attribute value converted to number
   */
  get seconds(): number {
    const numberVal = stringToNumber(this.getAttribute(attributes.SECONDS));

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

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

    this.container.querySelector('ids-dropdown#period')?.setAttribute(attributes.VALUE, this.period);
  }

  /**
   * period attribute, default is first day period in locale calendar
   * @returns {string} period attribute value
   */
  get period(): string {
    const attrVal = this.getAttribute(attributes.PERIOD);

    if (attrVal && this.locale?.calendar()?.dayPeriods?.map(
      (item: string) => item.toLowerCase()
    ).includes(attrVal.toString().toLowerCase())) {
      return attrVal;
    }

    return this.locale?.calendar()?.dayPeriods[0];
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
   * @param {boolean|string|null} val true of false depending if the trigger field is tabbable
   */
  set tabbable(val: boolean | string | null) {
    this.setAttribute(attributes.TABBABLE, val);
    this.input?.setAttribute(attributes.TABBABLE, val);
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
}
