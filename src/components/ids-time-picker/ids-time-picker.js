import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-time-picker-base';
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
 * @mixes IdsLocaleMixin
 */
@customElement('ids-time-picker')
@scss(styles)
export default class IdsTimePicker extends Base {
  constructor() {
    super();
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
      input: this.container.querySelector('ids-input'),
      popup: this.container.querySelector('ids-popup'),
      triggerButton: this.container.querySelector('ids-trigger-button'),
      triggerField: this.container.querySelector('ids-trigger-field'),
      setTimeButton: this.container.querySelector('ids-button#set-time'),
    };
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
      attributes.FORMAT,
      attributes.LABEL,
      attributes.READONLY,
      attributes.PLACEHOLDER,
      attributes.VALUE,
    ];
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
   * Invoked each time an attribute is changed on a custom element.
   * @param {string} name - the attribute's name
   * @param {string} oldValue - the attribute's old value
   * @param {string} newValue - the attribute's new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue !== newValue) {
      switch (name) {
      case attributes.FORMAT:
        this.elements.dropdowns.wrapper.innerHTML = this.dropdowns();
        if (this.value) {
          this.setTimeOnField();
        }
        break;
      case attributes.AUTOUPDATE:
        this.elements.setTimeButton.classList.remove('hidden');
        stringToBool(newValue) && this.elements.setTimeButton.classList.add('hidden');
        break;
      default:
        // handle default case
        break;
      }
    }
  }

  /**
   * @readonly
   * @returns {boolean} returns true if the timepicker format includes seconds ("ss")
   */
  get hasSeconds() { return this.format.toLowerCase().includes('ss'); }

  /**
   * @readonly
   * @returns {boolean} returns true if the timepicker format includes the am/pm period (" a")
   */
  get hasPeriod() { return this.is12Hours && this.format.toLowerCase().includes(' a'); }

  /**
   * @readonly
   * @returns {boolean} returns true if the timepicker is using a 12-Hour format ("hh")
   */
  get is12Hours() { return this.format.includes('h'); }

  /**
   * @readonly
   * @returns {boolean} returns true if the timepicker is using a 24-Hour format ("HH")
   */
  get is24Hours() { return this.format.includes('H') || !this.hasPeriod; }

  /**
   * @readonly
   * @returns {boolean} returns true if the timepicker's popup is open
   */
  get isOpen() { return !!this.elements.popup.visible; }

  /**
   * Sets the time format to use in the picker.
   * @param {string} value - a variation of "hh:mm:ss a"
   */
  set format(value) { this.setAttribute(attributes.FORMAT, value); }

  /**
   * Gets the time format to use in the picker. Defaults to the current locale's time format or english ("hh:mm a")
   * @returns {string} the time format being used
   */
  get format() {
    return this.getAttribute(attributes.FORMAT) || this.locale?.calendar().timeFormat || 'hh:mm a';
  }

  /**
   * Sets a current timestring-value of the timepickers input-field
   * @param {string} value - a timestring value for the input-field
   */
  set value(value) {
    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, value);
      this.elements.input.value = value;
    }
  }

  /**
   * Gets a timestring that matches the format specified by this.format()
   * @returns {string} the current timestring value of the timepicker
   */
  get value() { return this.getAttribute(attributes.VALUE) || ''; }

  /**
   * Sets the autoselect attribute
   * @param {boolean} value - true or false
   */
  set autoselect(value) {
    this.setAttribute(attributes.AUTOSELECT, stringToBool(value));
  }

  /**
   * Gets the autoselect attribute
   * @returns {boolean} true if autoselect is enabled
   */
  get autoselect() { return stringToBool(this.getAttribute(attributes.AUTOSELECT)); }

  /**
   * Sets the autoupdate attribute
   * @param {boolean} value - true or false
   */
  set autoupdate(value) {
    this.setAttribute(attributes.AUTOUPDATE, stringToBool(value));
  }

  /**
   * Gets the autoupdate attribute
   * @returns {boolean} true if autoselect is enabled
   */
  get autoupdate() { return stringToBool(this.getAttribute(attributes.AUTOUPDATE)); }

  /**
   * Sets the disabled attribute
   * @param {boolean} value - true or false
   */
  set disabled(value) {
    const disabled = stringToBool(value);
    this.setAttribute(attributes.DISABLED, disabled);
    this.elements.triggerField.disabled = disabled;
    this.elements.triggerButton.disabled = disabled;
    this.elements.input.disabled = disabled;
  }

  /**
   * Gets the disabled attribute
   * @returns {boolean} true if the timepicker is disabled
   */
  get disabled() { return this.getAttribute(attributes.DISABLED) ?? false; }

  /**
   * Sets the readonly attribute
   * @param {boolean} value - true or false
   */
  set readonly(value) {
    const readonly = stringToBool(value);
    this.setAttribute(attributes.READONLY, readonly);
    this.elements.triggerField.readonly = readonly;
    this.elements.triggerButton.readonly = readonly;
    this.elements.input.readonly = readonly;
  }

  /**
   * Gets the readonly attribute
   * @returns {boolean} true if the timepicker is in readonly mode
   */
  get readonly() { return this.getAttribute(attributes.READONLY) ?? false; }

  /**
   * Sets the label attribute
   * @param {string} value - the label's text
   */
  set label(value) {
    this.setAttribute(attributes.LABEL, value);
    this.elements.triggerField.label = value;
  }

  /**
   * Gets the label attribute
   * @returns {string} default is ""
   */
  get label() { return this.getAttribute(attributes.LABEL) ?? ''; }

  /**
   * Sets the placeholder attribute
   * @param {string} value - the placeholder's text
   */
  set placeholder(value) {
    this.setAttribute(attributes.PLACEHOLDER, value);
    this.elements.input.placeholder = value;
  }

  /**
   * Get the placeholder attribute
   * @returns {string} default is ""
   */
  get placeholder() { return this.getAttribute(attributes.PLACEHOLDER) ?? ''; }

  /**
   * Get the size attribute
   * @returns {string} default is "sm"
   */
  get size() { return this.getAttribute(attributes.SIZE) ?? 'sm'; }

  /**
   * Gets an object keyed-by minutes|seconds which contains the minutes and seconds intervals
   * @returns {object} an object with type { [minutes|seconds]: number }
   */
  get intervals() {
    return {
      minutes: parseInt(this.getAttribute(attributes.MINUTE_INTERVAL)) || false,
      seconds: parseInt(this.getAttribute(attributes.SECOND_INTERVAL)) || false,
    };
  }

  /**
   * Gets an object containing the dropdown-field values for hours|minutes|seconds|period
   * @returns {object} an object keyed by hours|minutes|seconds|period
   */
  get options() {
    const intervals = this.intervals;
    return {
      hours: this.is12Hours ? TIME.TWELVE : TIME.TWENTYFOUR,
      minutes: intervals.minutes ? range(0, 59, intervals.minutes) : TIME.SIXTY,
      seconds: intervals.seconds ? range(0, 59, intervals.seconds) : TIME.SIXTY,
      period: TIME.PERIOD,
    };
  }

  /**
   * Create the Template for the contents
   * @returns {string} HTML for the template
   */
  template() {
    return `
      <div class="ids-time-picker">
        <ids-trigger-field
          label="${this.label}"
          size="${this.size}"
        >
          <ids-text audible="true" translate-text="true">UseArrow</ids-text>
          <ids-input
            type="text"
            placeholder="${this.placeholder}"
            value="${this.value}"
            disabled="${this.disabled}"
          >
          </ids-input>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">TimepickerTriggerButton</ids-text>
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
          <section slot="content"">
            <div id="dropdowns">${this.dropdowns()}</div>
            <ids-button id="set-time" class="${this.autoupdate ? 'hidden' : ''}">
              Set Time
            </ids-button>
          </section>
        </ids-popup>
      <div>
    `;
  }

  /**
   * Creates the HTML the timepicker's dropdown fields
   * @returns {string[]} an array of HTML for the timepicker's dropdowns
   */
  dropdowns() {
    const dropdown = ({
      id,
      label,
      options,
    }) => `
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

    const options = this.options;
    const hours = dropdown({ id: 'hours', label: this.locale?.translate('Hours') || 'Hours', options: options.hours });
    const minutes = dropdown({ id: 'minutes', label: this.locale?.translate('Minutes') || 'Minutes', options: options.minutes });
    const seconds = this.hasSeconds && dropdown({ id: 'seconds', label: this.locale?.translate('Seconds') || 'Seconds', options: options.seconds });
    const period = this.hasPeriod && dropdown({ id: 'period', label: this.locale?.translate('Period') || 'Period', options: options.period });

    const separator = '<span class="separator">&nbsp;</span>';
    const spacer = '<span class="separator">&nbsp;</span>';

    const numbers = [hours, minutes, seconds].filter(Boolean).join(separator);
    return [numbers, period].filter(Boolean).join(spacer);
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

    this.onEvent('change', this.container, (e) => {
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
    this.onEvent('mouseup', setTimeButton, () => {
      this.setTimeOnField();
      this.closeTimePopup();
    });

    // using on mouseup, because on click interferes with on Enter
    this.onEvent('mouseup', triggerButton, () => this.toggleTimePopup());
    this.onEvent('focus', input, () => this.autoselect && this.openTimePopup());

    // Translate Labels
    this.offEvent('languagechange.container');
    this.onEvent('languagechange.container', this.closest('ids-container'), async () => {
      if (this.elements.dropdowns.hours) {
        this.elements.dropdowns.hours.label = this.locale?.translate('Hours') || 'Hours';
      }
      if (this.elements.dropdowns.minutes) {
        this.elements.dropdowns.minutes.label = this.locale?.translate('Minutes') || 'Minutes';
      }
      if (this.elements.dropdowns.period) {
        this.elements.dropdowns.period.label = this.locale?.translate('Period') || 'HouPeriodrs';
      }
      if (this.elements.dropdowns.seconds) {
        this.elements.dropdowns.seconds.label = this.locale?.translate('Seconds') || 'Seconds';
      }
    });

    // Change Locale if not set by a setting initially
    const formatSet = this.getAttribute('format') !== null;
    this.offEvent('localechange.container');
    this.onEvent('localechange.container', this.closest('ids-container'), async () => {
      if (!formatSet) {
        this.format = this.locale?.calendar().timeFormat;
      }
    });

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
