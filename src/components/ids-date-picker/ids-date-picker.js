import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { isValidDate } from '../../utils/ids-date-utils/ids-date-utils';

// Supporting components
import IdsModalButton from '../ids-modal-button/ids-modal-button';
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

  #popup = this.container.querySelector('ids-popup');

  #triggerField = this.container.querySelector('ids-trigger-field');

  #triggerButton = this.container.querySelector('ids-trigger-button');

  #input = this.container.querySelector('ids-input');

  #monthView = this.container.querySelector('ids-month-view');

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
      attributes.DISABLED,
      attributes.FORMAT,
      attributes.FORMAT,
      attributes.ID,
      attributes.IS_CALENDAR_TOOLBAR,
      attributes.IS_DROPDOWN,
      attributes.LABEL,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.TABBABLE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS,
      attributes.VALUE,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const classes = [
      'ids-date-picker',
      this.isCalendarToolbar && 'is-calendar-toolbar',
      this.isDropdown && 'is-dropdown'
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}"${this.isCalendarToolbar ? ' tabindex="0"' : ''}>
        ${this.isCalendarToolbar ? `
          <ids-text font-size="20" class="datepicker-text">${this.value}</ids-text>
          <ids-text audible="true" translate-text="true">SelectDay</ids-text>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="schedule" class="datepicker-icon"></ids-icon>
          </ids-trigger-button>
        ` : ``}
        ${this.isDropdown ? `
          <ids-button
            icon="dropdown"
            icon-align="end"
            square="true"
          >${this.value}</ids-button>
          <ids-popup
            type="dropdown"
            animated="true"
          >
            <section slot="content">
              <ids-text>Test</ids-text>
            </section>
          </ids-popup>
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
            >
            </ids-input>
            <ids-trigger-button>
              <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
              <ids-icon slot="icon" icon="schedule"></ids-icon>
            </ids-trigger-button>
          </ids-trigger-field>
        ` : ``}
        ${!this.isDropdown ? `
          <ids-popup
            type="menu"
            animated="true"
          >
            <section slot="content">
              <ids-month-view
                compact="true"
                show-today="true"
                is-date-picker="true"
              ></ids-month-view>
              <div class="popup-footer">
                <ids-button class="popup-btn-start">
                  Cancel
                </ids-button>
                <ids-button class="popup-btn-end">
                  Apply
                </ids-button>
              </div>
            </section>
          </ids-popup>
        ` : ``}
      <div>
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
    // Respond to container changing language
    this.offEvent('languagechange.date-picker-container');
    this.onEvent('languagechange.date-picker-container', this.closest('ids-container'), async () => {
    });

    // Respond to container changing locale
    this.offEvent('localechange.date-picker-container');
    this.onEvent('localechange.date-picker-container', this.closest('ids-container'), async () => {
      this.#applyMask();
    });

    this.offEvent('click.date-picker');
    this.onEvent('click.date-picker', this.#triggerButton, () => {
      this.#togglePopup(!this.#popup.visible);
    });

    this.offEvent('dayselected.date-picker');
    this.onEvent('dayselected.date-picker', this.#monthView, (e) => {
      this.value = this.locale.formatDate(e.detail.date);
      this.#togglePopup(false);
    });

    return this;
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
      this.#setupMonthView();
      this.#popup.visible = true;
      const { bottom } = this.#triggerButton.getBoundingClientRect();
      const positionBottom = (bottom + 100) < window.innerHeight;

      this.#popup.alignTarget = this.container;
      this.#popup.arrowTarget = this.#triggerButton;
      this.#popup.align = positionBottom ? 'bottom, left' : 'top, left';
      this.#popup.arrow = positionBottom ? 'bottom' : 'top';
      this.#popup.y = 16;
    } else {
      this.removeOpenEvents();
      this.#popup.visible = false;
    }
  }

  #setupMonthView() {
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
    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, val);
      this.#input?.setAttribute(attributes.VALUE, val);
    }
  }

  get placeholder() {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }

  set placeholder(val) {
    if (val) {
      this.setAttribute(attributes.PLACEHOLDER, val);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
    }

    this.#input.placeholder = val;
  }

  get label() {
    return this.getAttribute(attributes.LABEL) ?? '';
  }

  set label(val) {
    if (val) {
      this.setAttribute(attributes.LABEL, val);
      this.#triggerField.setAttribute(attributes.LABEL, val);
    } else {
      this.removeAttribute(attributes.LABEL);
      this.#triggerField.removeAttribute(attributes.LABEL);
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
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#triggerField.disabled = boolVal;
  }

  get readonly() {
    const attrVal = this.getAttribute(attributes.READONLY);

    return stringToBool(attrVal);
  }

  set readonly(val) {
    const boolVal = stringToBool(val);

    if (boolVal) {
      this.setAttribute(attributes.READONLY, boolVal);
    } else {
      this.removeAttribute(attributes.READONLY);
    }

    this.#triggerField.readonly = boolVal;
    this.#input.readonly = boolVal;
  }

  get size() { return this.getAttribute(attributes.SIZE); }

  set size(val) {
    this.setAttribute(attributes.SIZE, val);
    this.#triggerField.size = val;
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
      this.#triggerField.setAttribute(attributes.ID, val);
    } else {
      this.removeAttribute(attributes.ID);
      this.#triggerField.removeAttribute(attributes.ID);
    }
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

  set validate(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATE, val);
      this.#triggerField.setAttribute(attributes.VALIDATE, val);
      this.#triggerField.setAttribute(attributes.VALIDATION_EVENTS, this.validationEvents);
      this.#triggerField.handleValidation();
    } else {
      this.removeAttribute(attributes.VALIDATE);
      this.#triggerField.removeAttribute(attributes.VALIDATE);
      this.#triggerField.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#triggerField.handleValidation();
    }
  }

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS) ?? 'change blur'; }

  set validationEvents(val) {
    if (val) {
      this.setAttribute(attributes.VALIDATION_EVENTS, val);
      this.#input.setAttribute(attributes.VALIDATION_EVENTS, val);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      this.#input.removeAttribute(attributes.VALIDATION_EVENTS);
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

  get isDropdown() {
    const attrVal = this.getAttribute(attributes.IS_DROPDOWN);

    return stringToBool(attrVal);
  }

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
}

export default IdsDatePicker;
