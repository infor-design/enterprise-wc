import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import { stringUtils } from '../../utils/ids-string-utils/ids-string-utils';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsPopupOpenEventsMixin,
  IdsThemeMixin
} from '../../mixins';

// Supporting components
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import IdsPopup from '../ids-popup/ids-popup';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

import styles from './ids-time-picker.scss';

const range = (start, stop, step = 1) => (
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
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-time-picker')
@scss(styles)
class IdsTimePicker extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsPopupOpenEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();

    this.elements = {
      dropdowns: {
        hours: this.container.querySelector('ids-dropdown#hours'),
        minutes: this.container.querySelector('ids-dropdown#minutes'),
        seconds: this.container.querySelector('ids-dropdown#seconds'),
        period: this.container.querySelector('ids-dropdown#period'),
      },
      input: this.container.querySelector('ids-input'),
      popup: this.container.querySelector('ids-popup'),
      triggerButton: this.container.querySelector('ids-trigger-button'),
      triggerField: this.container.querySelector('ids-trigger-field'),
      setTimeButton: this.container.querySelector('ids-button#set-time'),
    };
  }

  /**
   * @see IdsElement.getAttribute()
   * @override
   * @param {string} name the attribute's name
   * @returns {string} the attribute's value
   */
  getAttribute(name) {
    const value = super.getAttribute(name);
    return value === 'false' ? false : value;
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
      attributes.LABEL,
      attributes.READONLY,
      attributes.PLACEHOLDER,
      attributes.VALUE,
    ];
  }

  get hasSeconds() { return this.format.toLowerCase().includes('ss'); }

  get hasPeriod() { return this.is12Hours && this.format.toLowerCase().includes(' a'); }

  get is12Hours() { return this.format.includes('hh'); }

  get is24Hours() { return this.format.includes('HH') || !this.hasPeriod; }

  get isOpen() { return !!this.elements.popup.visible; }

  set format(value) { this.setAttribute(attributes.FORMAT, value); }

  get format() { return this.getAttribute(attributes.FORMAT) ?? 'hh:mm:ss a'; }

  set value(value) {
    if (!this.disabled && !this.readonly) {
      this.setAttribute('value', value);
      this.elements.input.value = value;
    }
  }

  get value() { return this.getAttribute('value') || ''; }

  set autoselect(value) { this.setAttribute(attributes.AUTOSELECT, !!value); }

  get autoselect() { return this.hasAttribute(attributes.AUTOSELECT); }

  set autoupdate(value) { this.setAttribute(attributes.AUTOUPDATE, !!value); }

  get autoupdate() { return this.hasAttribute(attributes.AUTOUPDATE); }

  set disabled(value) {
    const disabled = stringUtils.stringToBool(value);
    this.setAttribute(attributes.DISABLED, disabled);
    this.elements.triggerField.disabled = disabled;
    this.elements.triggerButton.disabled = disabled;
    this.elements.input.disabled = disabled;
  }

  get disabled() { return this.getAttribute(attributes.DISABLED) ?? false; }

  set readonly(value) {
    const readonly = stringUtils.stringToBool(value);
    this.setAttribute(attributes.READONLY, readonly);
    this.elements.triggerField.readonly = readonly;
    this.elements.triggerButton.readonly = readonly;
    this.elements.input.readonly = readonly;
  }

  get readonly() { return this.getAttribute(attributes.READONLY) ?? false; }

  set label(value) {
    this.setAttribute(attributes.LABEL, value);
    this.elements.triggerField.label = value;
  }

  get label() { return this.getAttribute(attributes.LABEL) ?? ''; }

  set placeholder(value) {
    this.setAttribute(attributes.PLACEHOLDER, value);
    this.elements.input.placeholder = value;
  }

  get placeholder() { return this.getAttribute(attributes.PLACEHOLDER) ?? ''; }

  get size() { return this.getAttribute(attributes.SIZE) ?? 'sm'; }

  get intervals() {
    return {
      minutes: parseInt(this.getAttribute(attributes.MINUTE_INTERVAL)) || false,
      seconds: parseInt(this.getAttribute(attributes.SECOND_INTERVAL)) || false,
    };
  }

  get options() {
    const intervals = this.intervals;
    return {
      hours: this.is12Hours ? TIME.TWELVE : TIME.TWENTYFOUR,
      minutes: intervals.minutes ? range(0, 59, intervals.minutes) : TIME.SIXTY,
      seconds: intervals.seconds ? range(0, 59, intervals.seconds) : TIME.SIXTY,
      period: TIME.PERIOD,
    };
  }

  dropdown({
    id,
    label,
    options,
  }) {
    return `
      <ids-dropdown id="${id}" label="${label}" value="${options[0]}" size="xs">
        <ids-list-box>
          ${options.map((option) => `
            <ids-list-box-option id="timepicker-${id}-${option}" value="${option}">
              ${(`0${option}`).slice(-2)}
            </ids-list-box-option>
          `).join('')}
        </ids-list-box>
      </ids-dropdown>
    `;
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const options = this.options;
    const hours = this.dropdown({ id: 'hours', label: 'Hours', options: options.hours });
    const minutes = this.dropdown({ id: 'minutes', label: 'Minutes', options: options.minutes });
    const seconds = this.hasSeconds && this.dropdown({ id: 'seconds', label: 'Seconds', options: options.seconds });
    const period = this.hasPeriod && this.dropdown({ id: 'period', label: 'Period', options: options.period });

    const dropdowns = [hours, minutes, seconds, period].filter(Boolean);
    const setTimeButton = this.autoupdate ? '' : '<ids-button id="set-time">Set Time</ids-button>';

    return `
      <div class="ids-time-picker">
        <ids-trigger-field
          label="${this.label}"
          size="${this.size}"
        >
          <ids-input
            type="text"
            placeholder="${this.placeholder}"
            value="${this.value}"
            disabled="${this.disabled}"
          >
          </ids-input>
          <ids-trigger-button>
            <ids-text audible="true">Timepicker trigger</ids-text>
            <ids-icon slot="icon" icon="clock"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup
          type="menu"
          align-target="ids-trigger-field"
          align="bottom, left"
          arrow="bottom"
          animated="true"
        >
          <section slot="content" cols="${dropdowns.length}">
            <div class="dropdowns">${dropdowns.join('')}</div>
            ${setTimeButton}
          </section>
        </ids-popup>
      <div>
    `;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * @private
   */
  connectedCallback() {
    super.connectedCallback();

    if (!this.disabled && !this.readonly) {
      this
        .#attachEventHandlers()
        .#attachKeyboardListeners();
    }
  }

  /**
   * Close the timepicker's popup window
   */
  closeTimePopup() {
    this.elements.popup.visible = false;
    this.removeOpenEvents();
  }

  /**
   * Open the timepicker's popup window
   */
  openTimePopup() {
    const { input, popup, triggerButton } = this.elements;

    if (!this.isOpen) {
      popup.visible = true;
      const { bottom } = triggerButton.getBoundingClientRect();
      const positionBottom = (bottom + 100) < window.innerHeight;

      popup.alignTarget = input;
      popup.arrowTarget = triggerButton;
      popup.align = positionBottom ? 'bottom, left' : 'top, left';
      popup.arrow = positionBottom ? 'bottom' : 'top';
      popup.y = positionBottom ? 10 : -10;

      this.addOpenEvents();
    }
  }

  /**
   * Close the timepicker's popup window
   */
  toggleTimePopup() {
    if (this.isOpen) {
      this.closeTimePopup();
    } else {
      this.openTimePopup();
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
  } = {}) {
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
        hour12: !this.is24Hours,
        hour: '2-digit',
        minute: '2-digit',
        [this.hasSeconds ? 'second' : '']: '2-digit',
      });

      this.value = value.replace(/^24/, '00');
    }

    return this;
  }

  /**
   * Runs when a click event is propagated to the window.
   * @private
   * @see IdsPopupOpenEventsMixin.addOpenEvents()
   * @param {MouseEvent} e the original click event
   * @returns {void}
   */
  onOutsideClick(e) {
    if (e.target !== this && this.isOpen) {
      this.closeTimePopup();
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} this class-instance object for chaining
   */
  #attachEventHandlers() {
    const {
      dropdowns,
      input,
      triggerButton,
      setTimeButton,
    } = this.elements;

    if (this.autoupdate) {
      this.onEvent('change', dropdowns.hours, (e) => { this.setTimeOnField({ hours: e.detail.value }); });
      this.onEvent('change', dropdowns.minutes, (e) => { this.setTimeOnField({ minutes: e.detail.value }); });
      this.onEvent('change', dropdowns.seconds, (e) => { this.setTimeOnField({ seconds: e.detail.value }); });
      this.onEvent('change', dropdowns.period, (e) => { this.setTimeOnField({ period: e.detail.value }); });
    }

    // using on mouseup, because on click interferes with on Enter
    this.onEvent('mouseup', setTimeButton, () => {
      this.setTimeOnField();
      this.closeTimePopup();
    });

    // using on mouseup, because on click interferes with on Enter
    this.onEvent('mouseup', triggerButton, () => this.toggleTimePopup());

    if (this.autoselect) {
      this.onEvent('focus', input, () => this.openTimePopup());
    }

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} this class-instance object for chaining
   */
  #attachKeyboardListeners() {
    this.listen(['ArrowDown', 'Enter', 'Escape', 'Backspace'], this, (e) => {
      if (e.key === 'Enter') {
        this.setTimeOnField();
        this.toggleTimePopup();
      } else if (e.key === 'ArrowDown') {
        this.openTimePopup();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        this.closeTimePopup();
      }
    });

    return this;
  }
}

export default IdsTimePicker;
