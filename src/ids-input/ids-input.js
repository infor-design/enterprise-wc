import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';

// Mixins
import { IdsClearableMixin } from '../ids-base/ids-clearable-mixin';
import { IdsDirtyTrackerMixin } from '../ids-base/ids-dirty-tracker-mixin';
import { IdsDomUtilsMixin } from '../ids-base/ids-dom-utils-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtilsMixin } from '../ids-base/ids-string-utils-mixin';
import { IdsValidationMixin } from '../ids-base/ids-validation-mixin';

// Supporting components
import IdsTriggerButton from '../ids-trigger-button/ids-trigger-button';

import { props } from '../ids-base/ids-constants';
import styles from './ids-input.scss';

import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';

// Input id
const ID = 'ids-input-id';

// Types
const TYPES = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  email: 'email'
};

// Setting defaults sizes
const SIZES = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  mm: 'mm',
  md: 'md',
  lg: 'lg',
  full: 'full'
};

// Setting defaults text-align
const TEXT_ALIGN = {
  default: 'left',
  left: 'left',
  center: 'center',
  right: 'right'
};

/**
 * IDS Input Component
 */
@customElement('ids-input')
@scss(styles)
@mixin(IdsClearableMixin)
@mixin(IdsDirtyTrackerMixin)
@mixin(IdsDomUtilsMixin)
@mixin(IdsEventsMixin)
@mixin(IdsStringUtilsMixin)
@mixin(IdsValidationMixin)
class IdsInput extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.AUTOSELECT,
      props.CLEARABLE,
      props.DIRTY_TRACKER,
      props.DISABLED,
      props.LABEL,
      props.LABEL_FONT_SIZE,
      props.PLACEHOLDER,
      props.SIZE,
      props.READONLY,
      props.TEXT_ALIGN,
      props.TRIGGERFIELD,
      props.TYPE,
      props.VALIDATE,
      props.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.input = this.shadowRoot.querySelector(`#${ID}`);
    this.labelEl = this.shadowRoot.querySelector(`[for="${ID}"]`);

    this.handleEvents();
  }

  /**
   * Custom Element `disconnectedCallback` implementation
   * @private
   * @returns {void}
   */
  disconnectedCallback() {
    this.handleInputChangeEvent('remove');
    this.handleInputFocusEvent('remove');
    this.handleNativeEvents('remove');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Input
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    const value = this.value !== null ? ` value="${this.value}"` : '';
    const type = ` type="${this.type || TYPES.default}"`;
    const inputClass = ` class="ids-input-field ${this.size}"`;
    let inputState = this.stringToBool(this.readonly) ? ' readonly' : '';
    inputState = this.stringToBool(this.disabled) ? ' disabled' : inputState;

    // Label
    const labelFontSize = this.labelFontSize ? ` ${props.FONT_SIZE}="${this.labelFontSize}"` : '';
    const labelClass = ` class="ids-input-label${inputState}"`;

    return `
      <label for="${ID}"${labelClass}>
        <ids-text${labelFontSize}>${this.label}</ids-text>
      </label>
      <input id="${ID}"${type}${inputClass}${value}${placeholder}${inputState} />
    `;
  }

  /**
   * Set input state for disabled or readonly
   * @private
   * @param {string} prop The property
   * @returns {void}
   */
  setInputState(prop) {
    if (prop === props.READONLY || prop === props.DISABLED) {
      const msgNodes = [].slice.call(this.shadowRoot.querySelectorAll('.validation-message'));
      const options = {
        prop1: prop,
        prop2: prop !== props.READONLY ? props.READONLY : props.DISABLED,
        val: this.stringToBool(this[prop])
      };
      if (options.val) {
        this.input?.removeAttribute(options.prop2);
        this.labelEl?.classList.remove(options.prop2);
        msgNodes.forEach((x) => x.classList.remove(options.prop2));

        this.input?.setAttribute(options.prop1, true);
        this.labelEl?.classList.add(options.prop1);
        msgNodes.forEach((x) => x.classList.add(options.prop1));
      } else {
        this.input?.removeAttribute(options.prop1);
        this.labelEl?.classList.remove(options.prop1);
        msgNodes.forEach((x) => x.classList.remove(options.prop1));
      }
    }
  }

  /**
   * Handle autoselect
   * @private
   * @returns {void}
   */
  handleAutoselect() {
    if (this.autoselect) {
      this.handleInputFocusEvent();
    } else {
      this.handleInputFocusEvent('remove');
    }
  }

  /**
   * Handle input focus event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleInputFocusEvent(option) {
    const input = this.input || this.shadowRoot.querySelector(`#${ID}`);
    if (input) {
      const eventName = 'focus';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === input) {
          this.eventHandlers.removeEventListener(eventName, input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, input, () => {
          input.select();
        });
      }
    }
  }

  /**
   * Handle input change event
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleInputChangeEvent(option) {
    if (this.input) {
      const eventName = 'change';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.eventHandlers.removeEventListener(eventName, this.input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
          this.value = this.input.value;
        });
      }
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {object} The object for chaining.
   */
  handleNativeEvents(option) {
    if (this.input) {
      const events = ['change', 'focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
      events.forEach((evt) => {
        if (option === 'remove') {
          const handler = this.eventHandlers?.handledEvents?.get(evt);
          if (handler && handler.target === this.input) {
            this.eventHandlers.removeEventListener(evt, this.input);
          }
        } else {
          this.eventHandlers.addEventListener(evt, this.input, (e) => {
            /**
             * Trigger event on parent and compose the args
             * will fire `trigger + nativeEvent` as triggerclick, triggerchange etc.
             * @private
             * @param  {object} elem Actual event
             * @param  {string} value The updated input element value
             */
            this.eventHandlers.dispatchEvent(`trigger${e.type}`, this, {
              detail: {
                elem: this,
                nativeEvent: e,
                value: this.value
              }
            });
          });
        }
      });
    }
    return this;
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    if (this.value === null) {
      this.value = '';
    }
    this.eventHandlers = new IdsEventsMixin();

    this.handleInputChangeEvent();
    this.handleNativeEvents();
  }

  /**
   * Set `autoselect` attribute
   * @param {boolean} value If true will set `autoselect` attribute
   */
  set autoselect(value) {
    if (value) {
      const val = this.stringToBool(value);
      this.setAttribute(props.AUTOSELECT, val);
    } else {
      this.removeAttribute(props.AUTOSELECT);
    }
    this.handleAutoselect();
  }

  get autoselect() { return this.getAttribute(props.AUTOSELECT); }

  /**
   * Set `clearable` attribute
   * @param {boolean} value If true will set `clearable` attribute
   */
  set clearable(value) {
    if (value) {
      const val = this.stringToBool(value);
      this.setAttribute(props.CLEARABLE, val);
    } else {
      this.removeAttribute(props.CLEARABLE);
    }
    this.handleClearable();
  }

  get clearable() { return this.getAttribute(props.CLEARABLE); }

  /**
   * Set `dirty-tracker` attribute
   * @param {boolean} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = this.stringToBool(value);
    if (value) {
      this.setAttribute(props.DIRTY_TRACKER, val);
    } else {
      this.removeAttribute(props.DIRTY_TRACKER);
    }
    this.input = this.shadowRoot.querySelector(`#${ID}`);
    this.labelEl = this.shadowRoot.querySelector(`[for="${ID}"]`);
    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  /**
   * Set `disabled` attribute
   * @param {boolean} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = this.stringToBool(value);
    if (value) {
      this.setAttribute(props.DISABLED, val);
    } else {
      this.removeAttribute(props.DISABLED);
    }
    this.setInputState(props.DISABLED);
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the `label-font-size` of input label
   * @param {string} value of the `label-font-size` property
   */
  set labelFontSize(value) {
    const labelText = this.shadowRoot.querySelector(`[for="${ID}"] ids-text`) || document.createElement('div');
    if (value) {
      this.setAttribute(props.LABEL_FONT_SIZE, value);
      labelText.setAttribute(props.FONT_SIZE, value);
      return;
    }
    this.removeAttribute(props.LABEL_FONT_SIZE);
    labelText.removeAttribute(props.FONT_SIZE);
  }

  get labelFontSize() { return this.getAttribute(props.LABEL_FONT_SIZE); }

  /**
   * Set the `label` text of input label
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const labelText = this.shadowRoot.querySelector(`[for="${ID}"] ids-text`) || document.createElement('div');
    if (value) {
      this.setAttribute(props.LABEL, value);
      labelText.innerHTML = value;
      return;
    }
    this.removeAttribute(props.LABEL);
    labelText.innerHTML = '';
  }

  get label() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Set the `placeholder` of input
   * @param {string} value of the `placeholder` property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(props.PLACEHOLDER, value);
      return;
    }
    this.removeAttribute(props.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(props.PLACEHOLDER); }

  /**
   * Set the `readonly` of input
   * @param {boolean} value If true will set `readonly` attribute
   */
  set readonly(value) {
    const val = this.stringToBool(value);
    if (value) {
      this.setAttribute(props.READONLY, val);
    } else {
      this.removeAttribute(props.READONLY);
    }
    this.setInputState(props.READONLY);
  }

  get readonly() { return this.getAttribute(props.READONLY); }

  /**
   * Set the size of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value) {
    const size = SIZES[value];
    this.setAttribute(props.SIZE, size || SIZES.default);
    this.input?.classList.remove(...Object.values(SIZES));
    this.input?.classList.add(size || SIZES.default);
  }

  get size() { return this.getAttribute(props.SIZE) || SIZES.default; }

  /**
   * Set the `text-align` of input
   * @param {string} value [left, center, right]
   */
  set textAlign(value) {
    const input = this.input || this.shadowRoot.querySelector(`[id="${ID}"]`);
    const textAlign = TEXT_ALIGN[value];
    this.setAttribute(props.TEXT_ALIGN, textAlign || TEXT_ALIGN.default);
    input?.classList.remove(...Object.values(TEXT_ALIGN));
    input?.classList.add(textAlign || TEXT_ALIGN.default);
  }

  get textAlign() { return this.getAttribute(props.TEXT_ALIGN) || TEXT_ALIGN.default; }

  /**
   * Set the triggerfield of input
   * @param {boolean} value If true will set `triggerfield` attribute
   */
  set triggerfield(value) {
    if (value) {
      const val = this.stringToBool(value);
      this.setAttribute(props.TRIGGERFIELD, val);
    } else {
      this.removeAttribute(props.TRIGGERFIELD);
    }
    this.input?.classList[this.triggerfield ? 'add' : 'remove']('has-triggerfield');
  }

  get triggerfield() { return this.getAttribute(props.TRIGGERFIELD); }

  /**
   * Set the type of input
   * @param {string} value [text, password, number, email]
   */
  set type(value) {
    if (TYPES[value]) {
      this.setAttribute(props.TYPE, TYPES[value]);
      return;
    }
    this.setAttribute(props.TYPE, TYPES.default);
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set `validate` attribute
   * @param {string} value The `validate` attribute
   */
  set validate(value) { // this.handleValidation();
    if (value) {
      this.setAttribute(props.VALIDATE, value);
    } else {
      this.removeAttribute(props.VALIDATE);
    }
    this.input = this.shadowRoot.querySelector(`#${ID}`);
    this.labelEl = this.shadowRoot.querySelector(`[for="${ID}"]`);
    this.handleValidation();
  }

  get validate() { return this.getAttribute(props.VALIDATE); }

  /**
   * Set the `value` attribute of input
   * @param {string} val the value property
   */
  set value(val) {
    const input = this.shadowRoot.querySelector(`[id="${ID}"]`);
    const v = val || '';
    this.setAttribute(props.VALUE, v);
    if (input) {
      input.value = v;
    }
  }

  get value() { return this.getAttribute(props.VALUE); }
}

export default IdsInput;
