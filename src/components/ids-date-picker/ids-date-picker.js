import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import {
  buildClassAttrib,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';
import { addDate, subtractDate } from '../../utils/ids-date-utils/ids-date-utils';

// Supporting components
import IdsButton from '../ids-button/ids-button';
import IdsMenuButton from '../ids-menu-button/ids-menu-button';
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import IdsIcon from '../ids-icon/ids-icon';
import IdsInput from '../ids-input/ids-input';
// eslint-disable-next-line import/no-cycle
import IdsMonthView from '../ids-month-view/ids-month-view';
import IdsPopup from '../ids-popup/ids-popup';
import IdsText from '../ids-text/ids-text';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

// Import Styles
import styles from './ids-date-picker.scss';

/**
 * IDS Date Picker Component
 * @type {IdsDatePicker}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part container - the container of the component
 * @part trigger-field - the trigger container
 * @part trigger-button - the trigger button
 * @part icon - the icon in the trigger button
 * @part input - the input element
 * @part popup - the popup with calendar
 * @part footer - footer of the popup
 * @part start-button - clear/cancel button in the popup footer
 * @part end-button - apply button in the popup footer
 */
@customElement('ids-date-picker')
@scss(styles)
class IdsDatePicker extends Base {
  constructor() {
    super();
  }

  /**
   * Elements for internal usage
   * @private
   */
  #input = this.container.querySelector('ids-input');

  #monthView = this.container.querySelector('ids-month-view');

  #popup = this.container.querySelector('ids-popup');

  #triggerButton = this.container.querySelector('ids-trigger-button');

  #triggerField = this.container.querySelector('ids-trigger-field');

  connectedCallback() {
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DAY,
      attributes.DISABLED,
      attributes.FIRST_DAY_OF_WEEK,
      attributes.FORMAT,
      attributes.ID,
      attributes.IS_CALENDAR_TOOLBAR,
      attributes.IS_DROPDOWN,
      attributes.LABEL,
      attributes.MONTH,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SHOW_TODAY,
      attributes.SIZE,
      attributes.TABBABLE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
      attributes.YEAR,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const classAttr = buildClassAttrib(
      'ids-date-picker',
      this.isCalendarToolbar && 'is-calendar-toolbar',
      this.isDropdown && 'is-dropdown'
    );

    return `
      <div ${classAttr} ${this.isCalendarToolbar ? ' tabindex="0"' : ''} part="container">
        ${this.isCalendarToolbar ? `
          <ids-text font-size="20" class="datepicker-text">${this.value}</ids-text>
          <ids-text audible="true" translate-text="true">SelectDay</ids-text>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="schedule" class="datepicker-icon"></ids-icon>
          </ids-trigger-button>
        ` : ``}
        ${this.isDropdown ? `
          <ids-menu-button
            class="dropdown-btn"
            dropdown-icon
          >
            <ids-text slot="text" class="dropdown-btn-text" font-size="20">${this.value}</ids-text>
          </ids-menu-button>
        ` : ''}
        ${(!(this.isDropdown || this.isCalendarToolbar)) ? `
          <ids-trigger-field
            part="trigger-field"
            ${this.id ? `id="${this.id}"` : ''}
            ${this.label ? `label="${this.label}"` : ''}
            size="${this.size}"
            ${this.validate ? `validate="${this.validate}"` : ''}
          >
            <ids-text audible="true" translate-text="true">UseArrow</ids-text>
            <ids-input
              part="input"
              type="text"
              value="${this.value}"
              placeholder="${this.placeholder}"
              mask="date"
            ></ids-input>
            <ids-trigger-button part="trigger-button">
              <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
              <ids-icon part="icon" slot="icon" icon="schedule"></ids-icon>
            </ids-trigger-button>
          </ids-trigger-field>
        ` : ``}
        ${!this.isDropdown ? `
          <ids-popup
            part="popup"
            type="menu"
            animated="true"
          >
            <section slot="content">
              <ids-month-view
                compact="true"
                is-date-picker="true"
                show-today=${this.showToday}
                first-day-of-week="${this.firstDayOfWeek}"
                year="${this.year}"
                month="${this.month}"
                day="${this.day}"
              ></ids-month-view>
              <div class="popup-footer" part="footer">
                <ids-button class="popup-btn popup-btn-start" part="start-button">
                  <ids-text
                    translate-text="true"
                    font-weight="bold"
                  >${this.isCalendarToolbar ? 'Cancel' : 'Clear'}</ids-text>
                </ids-button>
                <ids-button class="popup-btn popup-btn-end" part="end-button">
                  <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
                </ids-button>
              </div>
            </section>
          </ids-popup>
        ` : ''}
      </div>
    `;
  }

  /**
   * Click event is propagated to the window.
   * @param {PointerEvent} e native pointer event
   * @returns {void}
   */
  onOutsideClick(e) {
    if (e.target !== this) {
      this.#togglePopup(false);
    }
  }

  /**
   * Establish internal event handlers
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    // Respond to container changing locale
    this.offEvent('localechange.date-picker-container');
    this.onEvent('localechange.date-picker-container', this.closest('ids-container'), async () => {
      this.#setDirection();
      this.#applyMask();

      // Locale change first day of week only if it's not set as attribute
      if (this.firstDayOfWeek === null) {
        this.firstDayOfWeek = this.locale?.calendar().firstDayofWeek || 0;
      }
    });

    if (!this.isDropdown) {
      this.offEvent('click.date-picker-popup');
      this.onEvent('click.date-picker-popup', this.#triggerButton, () => {
        this.#togglePopup(!this.#popup.visible);
      });

      this.offEvent('dayselected.date-picker');
      this.onEvent('dayselected.date-picker', this.#monthView, (e) => {
        if (!this.isCalendarToolbar) {
          this.value = this.locale.formatDate(e.detail.date);
        }

        this.#togglePopup(false);
        this.focus();
        this.#triggerSelectedEvent();
      });

      this.offEvent('click.date-picker-clear');
      this.onEvent('click.date-picker-clear', this.container.querySelector('.popup-btn-start'), (e) => {
        e.stopPropagation();

        if (!this.isCalendarToolbar) {
          this.value = '';
          this.focus();
          this.#triggerSelectedEvent();
        }

        this.#togglePopup(false);
      });

      this.offEvent('click.date-picker-apply');
      this.onEvent('click.date-picker-apply', this.container.querySelector('.popup-btn-end'), (e) => {
        e.stopPropagation();

        this.value = this.locale.formatDate(this.#monthView.activeDate);
        this.#togglePopup(false);
        this.focus();
        this.#triggerSelectedEvent();
      });
    }

    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @returns {object} this class-instance object for chaining
   */
  #attachKeyboardListeners() {
    this.offEvent('keydown.date-picker-keyboard');
    this.onEvent('keydown.date-picker-keyboard', this, (e) => {
      const key = e.keyCode;
      const stopEvent = () => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
      };

      // Arrow Down opens calendar popup
      if (key === 40) {
        stopEvent();

        this.#togglePopup(true);
      }

      // Escape closes calendar popup
      if (key === 27) {
        stopEvent();

        this.#togglePopup(false);
        this.focus();
      }

      // Tab will loop focus inside calendar popup
      if (key === 9 && this.#popup?.visible) {
        const lastFocusable = this.container.querySelector('.popup-btn-end')?.container;
        const firstFocusable = this.#monthView?.container.querySelector('ids-date-picker[is-dropdown="true"]');

        if (!e.shiftKey && lastFocusable?.matches(':focus')) {
          stopEvent();

          firstFocusable.focus();
        }

        if (e.shiftKey && firstFocusable?.matches(':focus')) {
          stopEvent();

          lastFocusable.focus();
        }
      }

      // 't' sets today date
      if (key === 84 && !this.isCalendarToolbar) {
        stopEvent();

        this.#changeDate('today');
      }

      if (!this.isCalendarToolbar && !this.value.includes('-')) {
        // '+' increments day
        if (key === 187 || key === 107) {
          stopEvent();

          this.#changeDate('next-day');
        }

        // '-' decrements day
        if (key === 189 || key === 109) {
          stopEvent();

          this.#changeDate('previous-day');
        }
      }
    });

    return this;
  }

  /**
   * Open/close popup with month view
   * @param {boolean} isOpen should be opened or closed
   */
  #togglePopup(isOpen) {
    if (isOpen && !this.readonly) {
      this.addOpenEvents();
      this.#attachMonthView();

      this.#popup.visible = true;
      this.#popup.alignTarget = this.isCalendarToolbar ? this.container : this.#input;
      this.#popup.arrowTarget = this.#triggerButton;
      this.#popup.align = 'bottom, left';
      this.#popup.arrow = 'bottom';
      this.#popup.y = 16;

      this.container.classList.add('is-open');

      this.#monthView.focus();
    } else {
      this.removeOpenEvents();
      this.#popup.visible = false;

      this.container.classList.remove('is-open');
    }
  }

  /**
   * Trigger selected event with current params
   * @returns {void}
   */
  #triggerSelectedEvent() {
    const args = {
      detail: {
        elem: this,
        date: this.#monthView.activeDate
      }
    };

    this.triggerEvent('dayselected', this, args);
  }

  /**
   * Parse date from value and pass as params to month view
   * Pass year, month, day to month view if is calendar toolbar
   */
  #attachMonthView() {
    if (!this.isCalendarToolbar) {
      const parsed = new Date(this.#input?.value);

      this.#monthView.year = parsed.getFullYear();
      this.#monthView.month = parsed.getMonth();
      this.#monthView.day = parsed.getDate();
    } else {
      this.#monthView.year = this.year;
      this.#monthView.month = this.month;
      this.#monthView.day = this.day;
    }
  }

  /**
   * Applying ids-mask to the input when changing locale or format
   */
  #applyMask() {
    const format = this.format === 'locale' ? this.locale.calendar().dateFormat.short : this.format;

    if (this.#input) {
      this.#input.maskOptions = { format };
      this.#input.value = this.value;
    }
  }

  #changeDate(type) {
    const date = this.#input?.value ? new Date(this.#input.value) : new Date();

    if (type === 'today') {
      const now = new Date();

      this.value = this.locale.formatDate(now);
    }

    if (type === 'next-day') {
      this.value = this.locale.formatDate(addDate(date, 1, 'days'));
    }

    if (type === 'previous-day') {
      this.value = this.locale.formatDate(subtractDate(date, 1, 'days'));
    }
  }

  /**
   * Focuses input or dropdown
   * @returns {void}
   */
  focus() {
    this.#input?.focus();
    this.container.querySelector('ids-menu-button')?.container?.focus();

    if (this.isCalendarToolbar) {
      this.container.focus();
    }
  }

  /**
   * value attribute
   * @returns {string} value param
   */
  get value() {
    return this.getAttribute(attributes.VALUE) ?? '';
  }

  /**
   * Set input value. Should parse a date from the value
   * Set dropdown button text if the component is dropdown
   * Set text if the component is used in calendar toolbar
   * @param {string|null} val value param
   */
  set value(val) {
    const textEl = this.container.querySelector('.datepicker-text');
    const dropdownEl = this.container.querySelector('.dropdown-btn-text');

    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, val);
      this.#input?.setAttribute(attributes.VALUE, val);

      if (textEl) {
        textEl.innerText = val;
      }

      if (dropdownEl) {
        dropdownEl.innerText = val;
      }
    }
  }

  /**
   * placeholder attribute
   * @returns {string} placeholder param
   */
  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  /**
   * Set input placeholder
   * @param {string|null} val of placeholder to be set
   */
  set placeholder(val) {
    if (val) {
      this.setAttribute(attributes.PLACEHOLDER, val);
      this.#input?.setAttribute(attributes.PLACEHOLDER, val);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.#input?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  /**
   * label attribute
   * @returns {string} label param
   */
  get label() {
    return this.getAttribute(attributes.LABEL) ?? '';
  }

  /**
   * Set trigger field label
   * @param {string|null} val of label to be set
   */
  set label(val) {
    if (val) {
      this.setAttribute(attributes.LABEL, val);
      this.#triggerField?.setAttribute(attributes.LABEL, val);
    } else {
      this.removeAttribute(attributes.LABEL);
      this.#triggerField?.removeAttribute(attributes.LABEL);
    }
  }

  /**
   * disabled attribute
   * @returns {boolean} disabled param
   */
  get disabled() {
    const attrVal = this.getAttribute(attributes.DISABLED);

    return stringToBool(attrVal);
  }

  /**
   * Set trigger field disabled attribute
   * @param {string|boolean|null} val disabled param value
   */
  set disabled(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.DISABLED, boolVal);
      this.#triggerField?.setAttribute(attributes.DISABLED, boolVal);
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.#triggerField?.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * readonly attribute
   * @returns {boolean} readonly param
   */
  get readonly() {
    const attrVal = this.getAttribute(attributes.READONLY);

    return stringToBool(attrVal);
  }

  /**
   * Set trigger field readonly attribute
   * @param {string|boolean|null} val readonly param value
   */
  set readonly(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.READONLY, boolVal);
      this.#triggerField?.setAttribute(attributes.READONLY, boolVal);
      this.#input?.setAttribute(attributes.READONLY, boolVal);
    } else {
      this.removeAttribute(attributes.READONLY);
      this.#triggerField?.removeAttribute(attributes.READONLY);
      this.#input?.removeAttribute(attributes.READONLY);
    }
  }

  /**
   * size attribute
   * @returns {string} size param
   */
  get size() { return this.getAttribute(attributes.SIZE); }

  /**
   * Set the size (width) of input
   * @param {string} val [xs, sm, mm, md, lg, full]
   */
  set size(val) {
    this.setAttribute(attributes.SIZE, val);
    this.#triggerField?.setAttribute(attributes.SIZE, val);
  }

  /**
   * tabbable attribute
   * @returns {boolean} tabbable param
   */
  get tabbable() {
    const attrVal = this.getAttribute(attributes.TABBABLE);

    // tabbable by default
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set trigger field tabbable attribute
   * @param {boolean|string|null} val true of false depending if the trigger field is tabbable
   */
  set tabbable(val) {
    this.setAttribute(attributes.TABBABLE, val);
    this.#triggerField?.setAttribute(attributes.TABBABLE, val);
  }

  /**
   * id attribute
   * @returns {string} id param
   */
  get id() { return this.getAttribute(attributes.ID) ?? ''; }

  /**
   * Set trigger field/input id attribute
   * @param {string} val id
   */
  set id(val) {
    if (val) {
      this.setAttribute(attributes.ID, val);
      this.#triggerField?.setAttribute(attributes.ID, val);
    } else {
      this.removeAttribute(attributes.ID);
      this.#triggerField?.removeAttribute(attributes.ID);
    }
  }

  /**
   * validate attribute
   * @returns {string|null} validate param
   */
  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set trigger field/input validation
   * @param {string|null} val validate param
   */
  set validate(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATE, val);
      this.#triggerField?.setAttribute(attributes.VALIDATE, val);
      this.#triggerField?.setAttribute(attributes.VALIDATION_EVENTS, this.validationEvents);
      this.#triggerField?.handleValidation();
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.#triggerField?.removeAttribute(attributes.VALIDATE);
      this.#triggerField?.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#triggerField?.handleValidation();
    }
  }

  /**
   * validation-events attributes
   * @returns {string} validationEvents param. Default is 'change blur'
   */
  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) ?? 'change blur'; }

  /**
   * Set which input events to fire validation on
   * @param {string|null} val validation-events attribute
   */
  set validationEvents(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATION_EVENTS, val);
      this.#input?.setAttribute(attributes.VALIDATION_EVENTS, val);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#input?.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  /**
   * format attributes
   * @returns {string|'locale'} format param. Default is locale - gets format from the calendar
   */
  get format() {
    return this.getAttribute(attributes.FORMAT) ?? 'locale';
  }

  /**
   * Sets the value date format and applies ids-mask
   * @param {string|null} val format attribute
   */
  set format(val) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }

    this.#applyMask();
  }

  /**
   * is-calendar-toolbar attribute
   * @returns {boolean} isCalendarToolbar param converted to boolean from attribute value
   */
  get isCalendarToolbar() {
    const attrVal = this.getAttribute(attributes.IS_CALENDAR_TOOLBAR);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is used in calendar toolbar
   * @param {string|boolean|null} val is-calendar-toolbar attribute
   */
  set isCalendarToolbar(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_CALENDAR_TOOLBAR, boolVal);
    } else {
      this.removeAttribute(attributes.IS_CALENDAR_TOOLBAR);
    }

    // Toggle container CSS class
    this.container.classList.toggle('is-calendar-toolbar', boolVal);
  }

  /**
   * is-dropdown attribute
   * @returns {boolean} isDropdown param converted to boolean from attribute value
   */
  get isDropdown() {
    const attrVal = this.getAttribute(attributes.IS_DROPDOWN);

    return stringToBool(attrVal);
  }

  /**
   * Set whether or not the component is dropdown type
   * @param {string|boolean|null} val is-dropdown attribute value
   */
  set isDropdown(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.IS_DROPDOWN, boolVal);
    } else {
      this.removeAttribute(attributes.IS_DROPDOWN);
    }

    // Toggle container CSS class
    this.container.classList.toggle('is-dropdown', boolVal);
  }

  /**
   * show-today attribute
   * @returns {boolean} showToday param converted to boolean from attribute value
   */
  get showToday() {
    const attrVal = this.getAttribute(attributes.SHOW_TODAY);

    // true by default if no attribute
    return attrVal !== null ? stringToBool(attrVal) : true;
  }

  /**
   * Set whether or not month view today button should be show
   * @param {string|boolean|null} val show-today attribute value
   */
  set showToday(val) {
    this.setAttribute(attributes.SHOW_TODAY, val);
    this.#monthView?.setAttribute(attributes.SHOW_TODAY, val);
  }

  /**
   * fist-day-of-week attribute for calendar popup
   * If not set the information comes from the locale. If not set in the locale defaults to 0
   * @returns {number} firstDayOfWeek param
   */
  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);
    const numberVal = stringToNumber(attrVal);

    if (!Number.isNaN(numberVal)) {
      return numberVal;
    }

    return this.locale?.calendar().firstDayofWeek || 0;
  }

  /**
   * Set month view first day of the week
   * @param {string|number|null} val fist-day-of-week attribute value
   */
  set firstDayOfWeek(val) {
    this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    this.#monthView?.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
  }

  /**
   * month attribute
   * @returns {number} month param
   */
  get month() {
    return this.getAttribute(attributes.MONTH);
  }

  /**
   * Set month view month attribute
   * @param {string|number|null} val month param value
   */
  set month(val) {
    if (val) {
      this.setAttribute(attributes.MONTH, val);
    } else {
      this.removeAttribute(attributes.MONTH);
    }
  }

  /**
   * year attribute
   * @returns {number} year param converted to number from attribute value
   */
  get year() {
    return this.getAttribute(attributes.YEAR);
  }

  /**
   * Set month view year attribute
   * @param {string|number|null} val year attribute value
   */
  set year(val) {
    if (val) {
      this.setAttribute(attributes.YEAR, val);
    } else {
      this.removeAttribute(attributes.YEAR);
    }
  }

  /**
   * day attribute
   * @returns {number} day param converted to number from attribute value
   */
  get day() {
    return this.getAttribute(attributes.DAY);
  }

  /**
   * Set month view day attribute
   * @param {string|number|null} val day attribute value
   */
  set day(val) {
    if (val) {
      this.setAttribute(attributes.DAY, val);
    } else {
      this.removeAttribute(attributes.DAY);
    }
  }

  /**
   * Set the direction attribute
   */
  #setDirection() {
    if (this.locale?.isRTL()) {
      this.setAttribute('dir', 'rtl');
    } else {
      this.removeAttribute('dir');
    }
  }
}

export default IdsDatePicker;
