import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-date-picker-base';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

// Supporting components
import IdsDropdown from '../ids-dropdown/ids-dropdown';
import IdsIcon from '../ids-icon/ids-icon';
import IdsInput from '../ids-input/ids-input';
import IdsPopup from '../ids-popup/ids-popup';
import IdsText from '../ids-text/ids-text';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';
import IdsMonthView from '../ids-month-view/ids-month-view';

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
      attributes.LABEL,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.TABBABLE,
      attributes.VALUE,
      attributes.VALIDATE,
      attributes.VALIDATION_EVENTS
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-date-picker">
        <ids-trigger-field
          label="${this.label}"
          size="${this.size}"
          validate="${this.validate}"
        >
          <ids-text audible="true" translate-text="true">UseArrow</ids-text>
          <ids-input
            type="text"
            value="${this.value}"
            placeholder="${this.placeholder}"
          >
          </ids-input>
          <ids-trigger-button>
            <ids-text audible="true" translate-text="true">DatePickerTriggerButton</ids-text>
            <ids-icon slot="icon" icon="schedule"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
        <ids-popup
          type="menu"
          animated="true"
        >
          <ids-month-view
            month="11"
            year="2018"
            day="20"
            slot="content"
            compact="true"
            show-today="true"
          ></ids-month-view>
        </ids-popup>
      <div>
    `;
  }

  /**
   * Runs when a click event is propagated to the window.
   * @param {MouseEvent} e the original click event
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
    });

    this.offEvent('click.date-picker');
    this.onEvent('click.date-picker', this.#triggerButton, () => {
      this.#togglePopup(!this.#popup.visible);
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
      this.#popup.visible = true;
      const { bottom } = this.#triggerButton.getBoundingClientRect();
      const positionBottom = (bottom + 100) < window.innerHeight;

      this.#popup.alignTarget = this.#input;
      this.#popup.arrowTarget = this.#triggerButton;
      this.#popup.align = positionBottom ? 'bottom, left' : 'top, left';
      this.#popup.arrow = positionBottom ? 'bottom' : 'top';
      this.#popup.y = 16;
    } else {
      this.removeOpenEvents();
      this.#popup.visible = false;
    }
  }

  get value() {
    return this.getAttribute(attributes.VALUE) ?? '';
  }

  set value(val) {
    if (!this.disabled && !this.readonly) {
      this.setAttribute(attributes.VALUE, val);
      this.#input.value = val;
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

  get format() {
    const attrVal = this.getAttribute(attributes.FORMAT);

    if (attrVal) {
      return attrVal;
    }

    return this.locale.calendar().dateFormat.short;
  }

  set format(val) {
    if (val) {
      this.setAttribute(attributes.FORMAT, val);
    } else {
      this.removeAttribute(attributes.FORMAT);
    }
  }
}

export default IdsDatePicker;
