import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import {
  buildClassAttrib,
  stringToBool,
  stringToNumber
} from '../../utils/ids-string-utils/ids-string-utils';
import { isValidDate } from '../../utils/ids-date-utils/ids-date-utils';

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
 * @mixes IdsKeyboardMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 */

@customElement('ids-date-picker')
@scss(styles)
class IdsDatePicker extends Base {
  constructor() {
    super();
  }

  #triggerField = this.container.querySelector('ids-trigger-field');

  #triggerButton = this.container.querySelector('ids-trigger-button');

  #input = this.container.querySelector('ids-input');

  #monthView;

  #popup;

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
      <div ${classAttr} ${this.isCalendarToolbar ? ' tabindex="0"' : ''}>
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
            id="${this.id}"
            label="${this.label}"
            size="${this.size}"
            validate="${this.validate}"
          >
            <ids-text audible="true" translate-text="true">UseArrow</ids-text>
            <ids-input
              type="text"
              value="${this.value}"
              placeholder="${this.placeholder}"
              mask="date"
            ></ids-input>
            <ids-trigger-button>
              <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
              <ids-icon slot="icon" icon="schedule"></ids-icon>
            </ids-trigger-button>
          </ids-trigger-field>
        ` : ``}
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
    this.#renderPopup();

    // Respond to container changing language
    this.offEvent('languagechange.date-picker-container');
    this.onEvent('languagechange.date-picker-container', this.closest('ids-container'), async () => {
      this.#renderPopup();
      this.container.querySelectorAll('ids-text[translate-text]').forEach((el) => {
        el.textContent = this.locale.translate(el.translationKey);
      });
    });

    // Respond to container changing locale
    this.offEvent('localechange.date-picker-container');
    this.onEvent('localechange.date-picker-container', this.closest('ids-container'), async () => {
      this.#renderPopup();
      this.#applyMask();
    });

    if (this.#triggerButton) {
      this.offEvent('click.date-picker-popup');
      this.onEvent('click.date-picker-popup', this.#triggerButton, () => {
        this.#togglePopup(!this.#popup.visible);
      });
    }

    return this;
  }

  #renderPopup() {
    const template = `
      <ids-popup
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
          <div class="popup-footer">
            <ids-button class="popup-btn popup-btn-start">
              <ids-text
                translate-text="true"
                font-weight="bold"
              >${this.isCalendarToolbar ? 'Cancel' : 'Clear'}</ids-text>
            </ids-button>
            <ids-button class="popup-btn popup-btn-end">
              <ids-text translate-text="true" font-weight="bold">Apply</ids-text>
            </ids-button>
          </div>
        </section>
      </ids-popup>
    `;

    this.container.querySelector('ids-popup')?.remove();
    this.#detachPopupEvents();

    if (!this.isDropdown) {
      this.container.insertAdjacentHTML('beforeend', template);
      this.#popup = this.container.querySelector('ids-popup');
      this.#monthView = this.container.querySelector('ids-month-view');
      this.#attachPopupEvents();
    }
  }

  #attachPopupEvents() {
    this.offEvent('dayselected.date-picker');
    this.onEvent('dayselected.date-picker', this.#monthView, (e) => {
      if (!(this.isCalendarToolbar || this.isDropdown)) {
        this.value = this.locale.formatDate(e.detail.date);
        this.#input?.focus();
      }

      this.#togglePopup(false);
      this.#triggerSelectedEvent();
    });

    this.offEvent('click.date-picker-clear');
    this.onEvent('click.date-picker-clear', this.container.querySelector('.popup-btn-start'), (e) => {
      e.stopPropagation();

      if (!(this.isCalendarToolbar || this.isDropdown)) {
        this.value = '';
        this.#input?.focus();
        this.#triggerSelectedEvent();
      }

      this.#togglePopup(false);
    });

    this.offEvent('click.date-picker-apply');
    this.onEvent('click.date-picker-apply', this.container.querySelector('.popup-btn-end'), (e) => {
      e.stopPropagation();

      const { month, year, day } = this.#monthView;

      this.value = this.locale.formatDate(new Date(year, month, day));
      this.#togglePopup(false);
      this.#input?.focus();
      this.#triggerSelectedEvent();
    });
  }

  #detachPopupEvents() {
    this.offEvent('dayselected.date-picker');
    this.offEvent('click.date-picker-clear');
    this.offEvent('click.date-picker-apply');
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @returns {object} this class-instance object for chaining
   */
  #attachKeyboardListeners() {
    this.listen(['ArrowDown', 'Escape'], this, (e) => {
      if (e.key === 'ArrowDown') {
        this.#togglePopup(true);
      }

      if (e.key === 'Escape') {
        this.#togglePopup(false);
      }
    });

    return this;
  }

  #togglePopup(open) {
    if (open && !this.readonly) {
      this.addOpenEvents();
      this.#attachMonthView();
      this.#popup.visible = true;
      const { bottom } = this.#triggerButton.getBoundingClientRect();
      const positionBottom = (bottom + 100) < window.innerHeight;

      this.#popup.alignTarget = (this.isDropdown || this.isCalendarToolbar) ? this.container : this.#input;
      this.#popup.arrowTarget = this.#triggerButton;
      this.#popup.align = positionBottom ? 'bottom, left' : 'top, left';
      this.#popup.arrow = positionBottom ? 'bottom' : 'top';
      this.#popup.y = 16;

      this.container.classList.add('is-open');
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
    const { year, month, day } = this.#monthView;

    const date = new Date(year, month, day);
    const args = {
      detail: {
        elem: this,
        date,
      }
    };

    this.triggerEvent('dayselected', this, args);
  }

  #attachMonthView() {
    if (this.isCalendarToolbar) {
      this.#monthView.year = this.year;
      this.#monthView.month = this.month;
      this.#monthView.day = this.day;

      return;
    }

    const now = new Date();
    const parsed = new Date(this.value);

    this.#monthView.year = isValidDate(parsed) ? parsed.getFullYear() : now.getFullYear();
    this.#monthView.month = isValidDate(parsed) ? parsed.getMonth() : now.getMonth();
    this.#monthView.day = isValidDate(parsed) ? parsed.getDate() : now.getDate();
  }

  get value() {
    return this.getAttribute(attributes.VALUE) ?? '';
  }

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

  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  set placeholder(val) {
    if (val) {
      this.setAttribute(attributes.PLACEHOLDER, val);
      this.#input?.setAttribute(attributes.PLACEHOLDER, val);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.#input?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  get label() {
    return this.getAttribute(attributes.LABEL) ?? '';
  }

  set label(val) {
    if (val) {
      this.setAttribute(attributes.LABEL, val);
      this.#triggerField?.setAttribute(attributes.LABEL, val);
    } else {
      this.removeAttribute(attributes.LABEL);
      this.#triggerField?.removeAttribute(attributes.LABEL);
    }
  }

  get disabled() {
    const attrVal = this.getAttribute(attributes.DISABLED);

    return stringToBool(attrVal);
  }

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

  get readonly() {
    const attrVal = this.getAttribute(attributes.READONLY);

    return stringToBool(attrVal);
  }

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

  get size() { return this.getAttribute(attributes.SIZE); }

  set size(val) {
    this.setAttribute(attributes.SIZE, val);
    this.#triggerField?.setAttribute(attributes.SIZE, val);
  }

  get tabbable() {
    const attrVal = this.getAttribute(attributes.TABBABLE);

    // tabbable by default
    return stringToBool(attrVal) ?? true;
  }

  set tabbable(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.TABBABLE, boolVal);
    } else {
      this.removeAttribute(attributes.TABBABLE);
    }

    this.#triggerField.tabbable = boolVal;
  }

  get id() { return this.getAttribute(attributes.ID) ?? ''; }

  set id(val) {
    if (val) {
      this.setAttribute(attributes.ID, val);
      this.#triggerField?.setAttribute(attributes.ID, val);
    } else {
      this.removeAttribute(attributes.ID);
      this.#triggerField?.removeAttribute(attributes.ID);
    }
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

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

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) ?? 'change blur'; }

  set validationEvents(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATION_EVENTS, val);
      this.#input?.setAttribute(attributes.VALIDATION_EVENTS, val);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#input?.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  #applyMask() {
    const format = this.format === 'locale' ? this.locale.calendar().dateFormat.short : this.format;

    this.#input.maskOptions = { format };
    this.#input.value = this.value;
  }

  get format() {
    return this.getAttribute(attributes.FORMAT) ?? 'locale';
  }

  set format(val) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }

    this.#applyMask();
  }

  get isCalendarToolbar() {
    const attrVal = this.getAttribute(attributes.IS_CALENDAR_TOOLBAR);

    return stringToBool(attrVal);
  }

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
   * @param {string|boolean|null} val isDropdown param value
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
   * Set whether or not the today button should be shown
   * @param {string|boolean|null} val showToday param value
   */
  set showToday(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.SHOW_TODAY, boolVal);
      this.#monthView?.setAttribute(attributes.SHOW_TODAY, boolVal);
    } else {
      this.removeAttribute(attributes.SHOW_TODAY);
      this.#monthView?.removeAttribute(attributes.SHOW_TODAY);
    }
  }

  /**
   * fist-day-of-week attribute
   * @returns {number} firstDayOfWeek param converted to number from attribute value with range (0-6)
   */
  get firstDayOfWeek() {
    const attrVal = this.getAttribute(attributes.FIRST_DAY_OF_WEEK);

    return stringToNumber(attrVal);
  }

  /**
   * Set first day of the week (0-6)
   * @param {string|number|null} val firstDayOfWeek param value
   */
  set firstDayOfWeek(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal)) {
      this.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
      this.#monthView?.setAttribute(attributes.FIRST_DAY_OF_WEEK, val);
    } else {
      this.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
      this.#monthView?.removeAttribute(attributes.FIRST_DAY_OF_WEEK);
    }
  }

  /**
   * month attribute
   * @returns {number} month param
   */
  get month() {
    const attrVal = this.getAttribute(attributes.MONTH);

    return stringToNumber(attrVal);
  }

  /**
   * Set month param
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
   * @returns {number} year param converted to number from attribute value with 4-digit check
   */
  get year() {
    const attrVal = this.getAttribute(attributes.YEAR);
    return stringToNumber(attrVal);
  }

  /**
   * Set year param and render month table/toolbar
   * @param {string|number|null} val year param value
   */
  set year(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal) && numberVal.toString().length === 4) {
      this.setAttribute(attributes.YEAR, val);
    } else {
      this.removeAttribute(attributes.YEAR);
    }
  }

  /**
   * day attribute
   * @returns {number} day param converted to number
   */
  get day() {
    const attrVal = this.getAttribute(attributes.DAY);

    return stringToNumber(attrVal);
  }

  /**
   * Set day param and select active day
   * @param {string|number|null} val day param value
   */
  set day(val) {
    const numberVal = stringToNumber(val);

    if (!Number.isNaN(numberVal) && numberVal > 0) {
      this.setAttribute(attributes.DAY, val);
    } else {
      this.removeAttribute(attributes.DAY);
    }
  }
}

export default IdsDatePicker;
