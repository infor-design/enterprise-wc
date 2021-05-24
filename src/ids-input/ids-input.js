import {
  IdsElement,
  customElement,
  mix,
  scss,
  props,
  stringUtils
} from '../ids-base';

import styles from './ids-input.scss';

// Supporting components
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsClearableMixin,
  IdsDirtyTrackerMixin,
  IdsMaskMixin,
  IdsValidationMixin,
  IdsThemeMixin,
  IdsTooltipMixin
} from '../ids-mixins';

// Properties observed by the Input
const INPUT_PROPS = [
  props.AUTOSELECT,
  props.BG_TRANSPARENT,
  props.CLEARABLE,
  props.CLEARABLE_FORCED,
  props.COMPACT,
  props.DIRTY_TRACKER,
  props.DISABLED,
  props.FIELD_HEIGHT,
  props.LABEL,
  props.LABEL_REQUIRED,
  props.MODE,
  props.PLACEHOLDER,
  props.SIZE,
  props.READONLY,
  props.TEXT_ALIGN,
  props.TEXT_ELLIPSIS,
  props.TRIGGERFIELD,
  props.TYPE,
  props.VALIDATE,
  props.VALIDATION_EVENTS,
  props.VALUE,
  props.VERSION
];

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

// Setting defaults field-heights
const FIELD_HEIGHTS = {
  default: 'md',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
};

// Setting defaults text-align
const TEXT_ALIGN = {
  default: 'left',
  left: 'left',
  center: 'center',
  right: 'right'
};

const appliedMixins = [
  IdsEventsMixin,
  IdsClearableMixin,
  IdsKeyboardMixin,
  IdsDirtyTrackerMixin,
  IdsMaskMixin,
  IdsThemeMixin,
  IdsValidationMixin,
  IdsTooltipMixin
];

/**
 * IDS Input Component
 * @type {IdsInput}
 * @inherits IdsElement
 * @mixes IdsClearableMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsMaskMixin
 * @mixes IdsValidationMixin
 * @mixes IdsThemeMixin
 * @mixes IdsTooltipMixin
 * @part input - the input element
 * @part label - the label element
 */
@customElement('ids-input')
@scss(styles)
class IdsInput extends mix(IdsElement).with(...appliedMixins) {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * @returns {Array<string>} IdsInput component observable properties
   */
  static get properties() {
    return [...super.properties, ...INPUT_PROPS];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();
    this.handleEvents();
    this.handleAutoselect();
    this.handleClearable();
    this.handleDirtyTracker();
    // @ts-ignore
    this.handleValidation();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    if (!this.state || !this.state?.id) {
      this.state = { id: 'ids-input-id' };
    }

    // Input
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    const type = ` type="${this.type || TYPES.default}"`;
    let inputClass = `ids-input-field ${this.textAlign}`;
    inputClass += stringUtils.stringToBool(this.triggerfield) ? ' has-triggerfield' : '';
    inputClass += stringUtils.stringToBool(this.bgTransparent) ? ' bg-transparent' : '';
    inputClass += stringUtils.stringToBool(this.textEllipsis) ? ' text-ellipsis' : '';
    inputClass = ` class="${inputClass}"`;
    let inputState = stringUtils.stringToBool(this.readonly) ? ' readonly' : '';
    inputState = stringUtils.stringToBool(this.disabled) ? ' disabled' : inputState;
    let containerClass = `ids-input${inputState} ${this.size} ${this.fieldHeight}`;
    containerClass += stringUtils.stringToBool(this.compact) ? ' compact' : '';

    const labelHtml = !this.label ? '' : (
      `<label for="${this.state.id}" class="label-text">
        <ids-text part="label" label="true" color-unset>${this.label}</ids-text>
      </label>`
    );

    return `
      <div class="${containerClass}">
        ${labelHtml}
        <div class="field-container">
          <input part="input" id="${this.state.id}"${type}${inputClass}${placeholder}${inputState} />
        </div>
      </div>
    `;
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get input() {
    return this.shadowRoot?.querySelector(`#${this.state.id}`);
  }

  /**
   * @readonly
   * @returns {HTMLLabelElement} the inner `label` element
   */
  get labelEl() {
    return this.shadowRoot?.querySelector(`[for="${this.state.id}"]`);
  }

  /**
   * Set input state for disabled or readonly
   * @private
   * @param {string} prop The property.
   * @returns {void}
   */
  setInputState(prop) {
    if (prop === props.READONLY || prop === props.DISABLED) {
      const msgNodes = [].slice.call(this.shadowRoot.querySelectorAll('.validation-message'));
      const options = {
        prop1: prop,
        prop2: prop !== props.READONLY ? props.READONLY : props.DISABLED,
        val: stringUtils.stringToBool(this[prop])
      };
      if (options.val) {
        this.input?.removeAttribute(options.prop2);
        this.container?.classList?.remove?.(options.prop2);
        this.container?.querySelector?.('ids-text')?.removeAttribute(options.prop2);
        msgNodes.forEach((x) => x.classList.remove(options.prop2));

        this.input?.setAttribute(options.prop1, 'true');
        this.container.classList.add(options.prop1);
        this.container?.querySelector?.('ids-text')?.setAttribute?.(options.prop1, 'true');
        msgNodes.forEach((x) => x.classList.add(options.prop1));
      } else {
        this.input?.removeAttribute(options.prop1);
        this.container.classList.remove(options.prop1);
        this.container.querySelector('ids-text')?.removeAttribute(options.prop1);
        msgNodes.forEach((x) => x.classList.remove(options.prop1));
      }
    }
  }

  /**
   * Set the label text
   * @private
   * @param {string} value of label
   * @returns {void}
   */
  setLabelText(value) {
    const labelText = this.shadowRoot.querySelector(`[for="${this.state.id}"] ids-text`);
    if (labelText) {
      labelText.innerHTML = value || '';
    }
  }

  /**
   * Get field height css class name with prefix
   * @private
   * @param {string} val The given value
   * @returns {string} css class name with prefix
   */
  fieldHeightClass(val) {
    return `field-height-${val || FIELD_HEIGHTS.default}`;
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
  handleInputFocusEvent(option = '') {
    const eventName = 'focus';
    if (option === 'remove') {
      const handler = this?.handledEvents?.get(eventName);
      if (handler && handler.target === this.input) {
        this.offEvent(eventName, this.input);
      }
    } else {
      this.onEvent(eventName, this.input, () => {
        setTimeout(() => { // safari has delay
          this.input?.select();
        }, 1);
      });
    }
  }

  /**
   * Handle input change event
   * @private
   * @returns {void}
   */
  handleInputChangeEvent() {
    const eventName = 'change.input';
    this.onEvent(eventName, this.input, () => {
      this.value = this.input.value;
    });
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleNativeEvents() {
    const events = ['change.input', 'focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (/** @type {any} */ e) => {
        /**
         * Trigger event on parent and compose the args
         * will fire nativeEvents.
         * @private
         * @param  {object} elem Actual event
         * @param  {string} value The updated input element value
         */
        this.triggerEvent(e.type, this, {
          detail: {
            elem: this,
            nativeEvent: e,
            value: this.value
          }
        });
      });
    });
    return this;
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.handleNativeEvents();
    this.handleInputChangeEvent();
  }

  /**
   * When set the input will select all text on focus
   * @param {boolean|string} value If true will set `autoselect` attribute
   */
  set autoselect(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.AUTOSELECT, val.toString());
    } else {
      this.removeAttribute(props.AUTOSELECT);
    }
    this.handleAutoselect();
  }

  get autoselect() { return this.getAttribute(props.AUTOSELECT); }

  /**
   * When set the input will add css class `bg-transparent`
   * @param {boolean|string} value If true will set `bg-transparent` attribute
   */
  set bgTransparent(value) {
    const val = stringUtils.stringToBool(value);
    const className = 'bg-transparent';
    if (val) {
      this.setAttribute(props.BG_TRANSPARENT, val.toString());
      this.input?.classList.add(className);
    } else {
      this.removeAttribute(props.BG_TRANSPARENT);
      this.input?.classList.remove(className);
    }
  }

  get bgTransparent() { return this.getAttribute(props.BG_TRANSPARENT); }

  /**
   * When set the input will add css class `text-ellipsis`
   * @param {boolean|string} value If true will set `text-ellipsis` attribute
   */
  set textEllipsis(value) {
    const val = stringUtils.stringToBool(value);
    const className = 'text-ellipsis';
    if (val) {
      this.setAttribute(props.TEXT_ELLIPSIS, val.toString());
      this.input?.classList.add(className);
    } else {
      this.removeAttribute(props.TEXT_ELLIPSIS);
      this.input?.classList.remove(className);
    }
  }

  get textEllipsis() { return this.getAttribute(props.TEXT_ELLIPSIS); }

  /**
   * When set the input will add a clearable x button
   * @param {boolean|string} value If true will set `clearable` attribute
   */
  set clearable(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.CLEARABLE, val.toString());
    } else {
      this.removeAttribute(props.CLEARABLE);
    }
    this.handleClearable();
  }

  get clearable() { return this.getAttribute(props.CLEARABLE); }

  /**
   * When set the input will force to add a clearable x button on readonly and disabled
   * @param {boolean|string} value If true will set `clearable-forced` attribute
   */
  set clearableForced(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.CLEARABLE_FORCED, val.toString());
    } else {
      this.removeAttribute(props.CLEARABLE_FORCED);
    }
    this.handleClearable();
  }

  get clearableForced() { return this.getAttribute(props.CLEARABLE_FORCED); }

  /**
   *  Set the compact height
   * @param {boolean|string} value If true will set `compact` attribute
   */
  set compact(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.COMPACT, val.toString());
      this.container?.classList.add(props.COMPACT);
    } else {
      this.removeAttribute(props.COMPACT);
      this.container?.classList.remove(props.COMPACT);
    }
  }

  get compact() { return this.getAttribute(props.COMPACT); }

  /**
   *  Set the dirty tracking feature on to indicate a changed field
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(props.DIRTY_TRACKER);
    }
    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(props.DIRTY_TRACKER); }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, 'true');
    } else {
      this.removeAttribute(props.DISABLED);
    }
    this.setInputState(props.DISABLED);
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Set the `label` text of input label
   * @param {string} value of the `label` text property
   */
  set label(value) {
    if (value) {
      this.setAttribute(props.LABEL, value.toString());
    } else {
      this.removeAttribute(props.LABEL);
    }
    this.setLabelText(value);
  }

  get label() { return this.getAttribute(props.LABEL) || ''; }

  /**
   * Set `label-required` attribute
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.LABEL_REQUIRED, val.toString());
    } else {
      this.removeAttribute(props.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired() { return this.getAttribute(props.LABEL_REQUIRED); }

  /**
   * Set the `placeholder` of input
   * @param {string} value of the `placeholder` property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(props.PLACEHOLDER, value);
      this.input?.setAttribute(props.PLACEHOLDER, value);
      return;
    }
    this.removeAttribute(props.PLACEHOLDER);
    this.input?.removeAttribute(props.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(props.PLACEHOLDER); }

  /**
   * Set the input to readonly state
   * @param {boolean|string} value If true will set `readonly` attribute
   */
  set readonly(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.READONLY, val.toString());
    } else {
      this.removeAttribute(props.READONLY);
    }
    this.setInputState(props.READONLY);
  }

  get readonly() { return this.getAttribute(props.READONLY); }

  /**
   * Set the fieldHeight (height) of input
   * @param {string} value [xs, sm, mm, md, lg]
   */
  set fieldHeight(value) {
    const fieldHeight = FIELD_HEIGHTS[value];
    const heightClasses = Object.values(FIELD_HEIGHTS).map((h) => this.fieldHeightClass(h));
    this.container?.classList.remove(...heightClasses);
    if (fieldHeight) {
      this.setAttribute(props.FIELD_HEIGHT, fieldHeight);
      this.container?.classList.add(this.fieldHeightClass(fieldHeight));
    } else {
      this.removeAttribute(props.FIELD_HEIGHT);
    }
  }

  get fieldHeight() { return this.fieldHeightClass(this.getAttribute(props.FIELD_HEIGHT)); }

  /**
   * Set the size (width) of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value) {
    const size = SIZES[value];
    this.setAttribute(props.SIZE, size || SIZES.default);
    this.container?.classList.remove(...Object.values(SIZES));
    this.container?.classList.add(size || SIZES.default);
  }

  get size() { return this.getAttribute(props.SIZE) || SIZES.default; }

  /**
   * Sets the text alignment
   * @param {string} value [left, center, right]
   */
  set textAlign(value) {
    const textAlign = TEXT_ALIGN[value] || TEXT_ALIGN.default;
    this.setAttribute(props.TEXT_ALIGN, textAlign);
    this.input?.classList.remove(...Object.values(TEXT_ALIGN));
    this.input?.classList.add(textAlign);
  }

  get textAlign() { return this.getAttribute(props.TEXT_ALIGN) || TEXT_ALIGN.default; }

  /**
   * Set to true if the input is a triggr field
   * @param {boolean|string} value If true will set `triggerfield` attribute
   */
  set triggerfield(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.TRIGGERFIELD, val.toString());
    } else {
      this.removeAttribute(props.TRIGGERFIELD);
    }
    this.input?.classList[this.triggerfield ? 'add' : 'remove']('has-triggerfield');
  }

  get triggerfield() { return this.getAttribute(props.TRIGGERFIELD); }

  /**
   * Sets the input type
   * @param {string} value [text, password, number, email]
   */
  set type(value) {
    const type = TYPES[value];
    if (type) {
      this.setAttribute(props.TYPE, type);
      this.input.setAttribute(props.TYPE, type);
      return;
    }
    this.setAttribute(props.TYPE, TYPES.default);
    this.input.setAttribute(props.TYPE, TYPES.default);
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(props.VALIDATE, value);
    } else {
      this.removeAttribute(props.VALIDATE);
    }
    this.handleValidation();
  }

  get validate() { return this.getAttribute(props.VALIDATE); }

  /**
   * Set `validation-events` attribute
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(props.VALIDATION_EVENTS, value);
    } else {
      this.removeAttribute(props.VALIDATION_EVENTS);
    }
    this.handleValidation();
  }

  get validationEvents() { return this.getAttribute(props.VALIDATION_EVENTS); }

  /**
   * Set the `value` attribute of input
   * @param {string} val the value property
   */
  set value(val) {
    let v = val || '';

    // If a mask is enabled, use the conformed value.
    // If no masking occurs, simply use the provided value.
    if (this.mask) {
      v = this.processMaskFromProperty(val) || v;
    }

    this.setAttribute(props.VALUE, v);
    if (this.input?.value !== v) {
      this.input.value = v;
      ['focus', 'blur', 'focus'].forEach((m) => this.input[m]());
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  get value() {
    return this.input?.value || '';
  }
}

export default IdsInput;
