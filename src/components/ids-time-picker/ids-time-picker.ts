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

const TIME = {
  TWELVE: range(1, 12),
  TWENTYFOUR: range(0, 23),
  SIXTY: range(0, 59),
  PERIOD: ['AM', 'PM'],
};

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
    this.#renderDropdowns();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.hide();
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
      attributes.LABEL,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SIZE,
      attributes.VALUE
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
          disabled="${this.disabled}">
          <ids-text audible="true" translate-text="true">UseArrow</ids-text>
          <ids-trigger-button slot="trigger-end">
            <ids-text audible="true" translate-text="true">TimepickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="clock"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup type="menu">
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
    if (!e.path?.includes(this.popup)) {
      this.hide();
    }
  }

  /**
   * Get a list of element dependencies for this component
   * @returns {object} of elements
   */
  get elements() {
    return {
      dropdowns: {
        wrapper: this.container.querySelector('div#dropdowns'),
        hours: this.container.querySelector('ids-dropdown#hours'),
        minutes: this.container.querySelector('ids-dropdown#minutes'),
        seconds: this.container.querySelector('ids-dropdown#seconds'),
        period: this.container.querySelector('ids-dropdown#period'),
      },
    };
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} this class-instance object for chaining
   */
  #attachKeyboardListeners(): object {
    this.listen(['ArrowDown', 'Enter', 'Escape', 'Backspace'], this, (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.setTimeOnField();
      } else if (e.key === 'ArrowDown') {
        this.show();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        this.hide();
      }
    });

    return this;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} this class-instance object for chaining
   */
  #attachEventHandlers(): object {
    const {
      dropdowns,
    } = this.elements;

    this.onEvent('change', this.container, (e: any) => {
      const currentId = e.detail?.elem?.id;
      if (!currentId || !this.autoupdate) return;

      if (currentId === dropdowns?.hours?.id) {
        this.setTimeOnField({ hours: e.detail.value });
      } else if (currentId === dropdowns?.minutes?.id) {
        this.setTimeOnField({ minutes: e.detail.value });
      } else if (currentId === dropdowns?.seconds?.id) {
        this.setTimeOnField({ seconds: e.detail.value });
      } else if (currentId === dropdowns?.period?.id) {
        this.setTimeOnField({ period: e.detail.value });
      }
    });

    // using on mouseup, because on click interferes with on Enter
    this.onEvent('mouseup', this.container.querySelector('.popup-btn'), () => {
      this.setTimeOnField();
      this.hide();
    });

    // using on mouseup, because on click interferes with on Enter
    this.onEvent('mouseup', this.#triggerButton, () => this.#toggleTimePopup());
    this.onEvent('focus', this.input, () => this.autoselect && this.show());

    // Translate Labels
    this.offEvent('languagechange.time-picker-container');
    this.onEvent('languagechange.time-picker-container', getClosest(this, 'ids-container'), () => {
      const {
        hours,
        minutes,
        period,
        seconds,
      } = this.elements.dropdowns;
      if (hours) {
        hours.label = this.locale?.translate('Hours') || 'Hours';
      }
      if (minutes) {
        minutes.label = this.locale?.translate('Minutes') || 'Minutes';
      }
      if (period) {
        period.label = this.locale?.translate('Period') || 'Period';
      }
      if (seconds) {
        seconds.label = this.locale?.translate('Seconds') || 'Seconds';
      }
    });

    // Input value change triggers component value change
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
    const {
      hours, minutes, seconds, period
    } = this.elements.dropdowns;

    const inputDate: Date = this.locale?.parseDate(
      this.value,
      { dateFormat: this.format }
    );

    if (hours && this.#is24Hours() && inputDate) {
      hours.value = inputDate.getHours();
    }

    if (hours && this.#is12Hours() && inputDate) {
      hours.value = inputDate.getHours() === 0 ? 12 : inputDate.getHours() % 12;
    }

    if (minutes && inputDate) {
      minutes.value = inputDate.getMinutes();
    }

    if (seconds && inputDate) {
      seconds.value = inputDate.getSeconds();
    }

    if (period && inputDate) {
      this.locale?.calendar().dayPeriods?.forEach((item: string) => {
        if (this.value?.includes(item)) {
          period.setAttribute(attributes.VALUE, item);
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
      options
    }: any) => `
      <ids-dropdown id="${id}" label="${label}" value="${options[0]}" size="xs">
        <ids-list-box>
          ${options.map((option: any) => `
            <ids-list-box-option id="timepicker-${id}-${option}" value="${option}">
              ${(`0${option}`).slice(-2)}
            </ids-list-box-option>
          `).join('')}
        </ids-list-box>
      </ids-dropdown>
    `;

    const options = this.#options();
    const hours = dropdown({ id: 'hours', label: this.locale?.translate('Hours') || 'Hours', options: options.hours });
    const minutes = dropdown({ id: 'minutes', label: this.locale?.translate('Minutes') || 'Minutes', options: options.minutes });
    const seconds = this.#hasSeconds() && dropdown({ id: 'seconds', label: this.locale?.translate('Seconds') || 'Seconds', options: options.seconds });
    const period = this.#hasPeriod() && dropdown({ id: 'period', label: this.locale?.translate('Period') || 'Period', options: options.period });

    const separator = '<span class="separator">&nbsp;</span>';
    const spacer = '<span class="separator">&nbsp;</span>';

    const numbers = [hours, minutes, seconds].filter(Boolean).join(separator);

    return <any>[numbers, period].filter(Boolean).join(spacer);
  }

  /**
   * Gets an object containing the dropdown-field values for hours|minutes|seconds|period
   * @returns {object} an object keyed by hours|minutes|seconds|period
   */
  #options() {
    type TimeConfig = { hours: number, minutes: number, seconds: number, period: string[] };
    const timeOptions: TimeConfig = {
      hours: this.#is12Hours() ? TIME.TWELVE : TIME.TWENTYFOUR,
      minutes: this.minuteInterval ? range(0, 59, this.minuteInterval) : TIME.SIXTY,
      seconds: this.secondInterval ? range(0, 59, this.secondInterval) : TIME.SIXTY,
      period: TIME.PERIOD,
    };

    return timeOptions;
  }

  /**
   * Close the timepicker's popup window
   */
  hide() {
    if (this.popup) {
      this.popup.visible = false;
      this.removeOpenEvents();
    }
  }

  /**
   * Open the timepicker's popup window
   */
  show() {
    if (!this.popup.visible && !this.disabled && !this.readonly) {
      const { bottom } = this.#triggerButton.getBoundingClientRect();
      const positionBottom = (bottom + 100) < window.innerHeight;

      this.popup.alignTarget = this.input;
      this.popup.arrowTarget = this.#triggerButton;
      this.popup.align = positionBottom ? 'bottom, left' : 'top, left';
      this.popup.arrow = positionBottom ? 'bottom' : 'top';
      this.popup.visible = true;

      this.addOpenEvents();
    }
  }

  /**
   * Close the timepicker's popup window
   */
  #toggleTimePopup() {
    if (this.popup.visible) {
      this.hide();
    } else {
      this.show();
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
   * Gets the time format to use in the picker. Defaults to the current locale's time format or english ("hh:mm a")
   * @returns {string} the time format being used
   */
  get format(): string {
    return this.getAttribute(attributes.FORMAT) || this.locale?.calendar().timeFormat || 'hh:mm a';
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
   * Gets a timestring that matches the format specified by this.format()
   * @returns {string} the current timestring value of the timepicker
   */
  get value(): string { return this.getAttribute(attributes.VALUE) || ''; }

  /**
   * Sets a current timestring-value of the timepickers input-field
   * @param {string} value - a timestring value for the input-field
   */
  set value(value: string) {
    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, value);

      if (this.input) {
        this.input.value = value;
      }

      this.#parseInputValue();
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
   * Gets the autoupdate attribute
   * @returns {boolean} true if autoselect is enabled
   */
  get autoupdate(): boolean {
    return stringToBool(this.getAttribute(attributes.AUTOUPDATE));
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
   * Gets the disabled attribute
   * @returns {boolean} true if the timepicker is disabled
   */
  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Sets the disabled attribute
   * @param {boolean} value - true or false
   */
  set disabled(value) {
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
   * Gets the readonly attribute
   * @returns {boolean} true if the timepicker is in readonly mode
   */
  get readonly(): boolean {
    return stringToBool(this.getAttribute(attributes.READONLY));
  }

  /**
   * Sets the readonly attribute
   * @param {boolean | string} value - true or false
   */
  set readonly(value: boolean | string) {
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
   * Gets the label attribute
   * @returns {string} default is ""
   */
  get label(): string { return this.getAttribute(attributes.LABEL) ?? ''; }

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
   * Get the placeholder attribute
   * @returns {string} default is ""
   */
  get placeholder(): string {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

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
   * no-margins attribute
   * @returns {boolean} noMargins parameter
   */
  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Sets the no margins attribute
   * @param {boolean} value The value for no margins attribute
   */
  set noMargins(value: boolean) {
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
   * Get the size attribute
   * @returns {string} default is "sm"
   */
  get size(): string {
    return this.getAttribute(attributes.SIZE) ?? 'sm';
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
   * minute-interval attribute
   * @returns {number} minuteInterval value
   */
  get minuteInterval(): number {
    return stringToNumber(this.getAttribute(attributes.MINUTE_INTERVAL));
  }

  /**
   * Set interval in minutes dropdown
   * @param {string|number|null} val minute-interval attribute value
   */
  set minuteInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);

    if (numberVal) {
      this.setAttribute(attributes.MINUTE_INTERVAL, numberVal);
    } else {
      this.removeAttribute(attributes.MINUTE_INTERVAL);
    }

    this.#renderDropdowns();
    this.#parseInputValue();
  }

  /**
   * second-interval attribute
   * @returns {number} secondInterval value
   */
  get secondInterval(): number {
    return stringToNumber(this.getAttribute(attributes.SECOND_INTERVAL));
  }

  /**
   * Set interval in seconds dropdown
   * @param {string|number|null} val second-interval attribute value
   */
  set secondInterval(val: string | number | null) {
    const numberVal = stringToNumber(val);

    if (numberVal) {
      this.setAttribute(attributes.SECOND_INTERVAL, numberVal);
    } else {
      this.removeAttribute(attributes.SECOND_INTERVAL);
    }

    this.#renderDropdowns();
    this.#parseInputValue();
  }

  /**
   * embeddable attribute
   * @returns {boolean} whether or not to show only hours/minutes/seconds dropdowns without input
   */
  get embeddable(): boolean {
    return stringToBool(this.getAttribute(attributes.EMBEDDABLE));
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
   * Set the input-field's timestring value using.
   *
   * @param {object} timeunits set values for the timepicker
   * @param {string|number} timeunits.hours number of hours to show
   * @param {string|number} timeunits.minutes number of minutes to show
   * @param {string|number} timeunits.seconds number of seconds to show
   * @param {string} timeunits.period am or pm
   * @returns {object} this class-instance object for chaining
   */
  setTimeOnField({
    hours,
    minutes,
    seconds,
    period,
  }: any = {}): object {
    const { dropdowns } = this.elements;
    const values = {
      hours: hours ?? dropdowns.hours?.value ?? '00',
      minutes: minutes ?? dropdowns.minutes?.value ?? '00',
      seconds: seconds ?? dropdowns.seconds?.value ?? '00',
      period: (this.hasPeriod && (period ?? dropdowns.period?.value)) || '',
    };

    const datestring = new Date().toDateString();
    const timestring = [values.hours, values.minutes, values.seconds].join(':');
    const datetime = new Date(`${datestring} ${timestring} ${values.period}`);

    if (datetime.getTime()) {
      const value = datetime.toLocaleTimeString(this.container.locale, {
        hour12: !this.#is24Hours(),
        hour: '2-digit',
        minute: '2-digit',
        [this.#hasSeconds() ? 'second' : '']: '2-digit',
      });

      this.value = value.replace(/^24/, '00');
      this.triggerEvent('change', this, {
        bubbles: true,
        detail: { elem: this, value: this.value }
      });
    }

    return this;
  }
}
