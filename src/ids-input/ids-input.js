import {
  IdsElement,
  customElement,
  mix,
  scss,
  attributes,
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
const INPUT_ATTRIBUTES = [
  attributes.AUTOSELECT,
  attributes.BG_TRANSPARENT,
  attributes.CLEARABLE,
  attributes.CLEARABLE_FORCED,
  attributes.COMPACT,
  attributes.DIRTY_TRACKER,
  attributes.DISABLED,
  attributes.FIELD_HEIGHT,
  attributes.LABEL,
  attributes.LABEL_HIDDEN,
  attributes.LABEL_REQUIRED,
  attributes.ID,
  attributes.MODE,
  attributes.PLACEHOLDER,
  attributes.SIZE,
  attributes.READONLY,
  attributes.TEXT_ALIGN,
  attributes.TEXT_ELLIPSIS,
  attributes.TRIGGERFIELD,
  attributes.TYPE,
  attributes.VALIDATE,
  attributes.VALIDATION_EVENTS,
  attributes.VALUE,
  attributes.VERSION
];

// Types
const TYPES = {
  default: 'text',
  text: 'text',
  password: 'password',
  number: 'number',
  email: 'email',
  color: 'color'
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

let instanceCounter = 0;

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
 * @part container - the overall container
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
  static get attributes() {
    return [...super.attributes, ...INPUT_ATTRIBUTES];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();

    this.handleEvents();
    this.handleClearable();
    this.handleDirtyTracker();
    // @ts-ignore
    this.handleValidation();

    /* istanbul ignore next */
    if (this.hasAttribute(attributes.AUTOSELECT)) {
      this.handleAutoselect();
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    if (!this.id) {
      this.setAttribute?.(attributes.ID, `ids-input-${++instanceCounter}`);
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

    const labelHtml = !this.label || this.getAttribute(attributes.LABEL_HIDDEN) ? '' : (
      `<label for="${this.id}-input" class="ids-label-text">
        <ids-text part="label" label="true" color-unset>${this.label}</ids-text>
      </label>`
    );

    return (
      `<div class="${containerClass}" part="container">
        ${labelHtml}
        <div class="field-container">
          <input
            part="input"
            id="${this.id}-input"
            ${type}${inputClass}${placeholder}${inputState}
            ${this.getAttribute(attributes.LABEL_HIDDEN) && this.label ? `aria-label="${this.label}"` : ''}
            ${this.hasAttribute(attributes.VALUE) ? ` value="${this.getAttribute(attributes.VALUE)}" ` : ''}
            ></input>
        </div>
      </div>`
    );
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get input() {
    return this.shadowRoot?.querySelector(`#${this.id}-input`);
  }

  /**
   * @readonly
   * @returns {HTMLLabelElement} the inner `label` element or
   * reference to what was last provided by setLabelElement
   */
  get labelEl() {
    return (
      this.#labelEl
      || this.shadowRoot?.querySelector(`[for="${this.id}-input"]`)
    );
  }

  /**
   * setter for label element; since reflected attributes
   * cannot be non serializable refs
   * @param {HTMLElement} el element representing the label
   */
  setLabelElement(el) {
    this.#labelEl = el;
  }

  /**
   * Set input state for disabled or readonly
   * @private
   * @param {string} prop The property.
   * @returns {void}
   */
  setInputState(prop) {
    if (prop === attributes.READONLY || prop === attributes.DISABLED) {
      const msgNodes = [].slice.call(this.shadowRoot.querySelectorAll('.validation-message'));
      const options = {
        prop1: prop,
        prop2: prop !== attributes.READONLY ? attributes.READONLY : attributes.DISABLED,
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
    if (this.#labelEl) {
      this.#labelEl.innerHTML = value || '';
      return;
    }

    const labelEl = this.shadowRoot.querySelector(`[for="${this.id}-input"] ids-text`);
    if (labelEl) {
      labelEl.innerHTML = value || '';
    }
  }

  /**
   * @param {boolean} value Flags a label's text as not displayed explicitly in the label element
   * */
  set labelHidden(value) {
    if (stringUtils.stringToBool(value)) {
      this?.setAttribute(attributes.LABEL_HIDDEN, true);
      const existingLabel = this.shadowRoot.querySelector('label');
      if (existingLabel) {
        existingLabel.remove();
      }

      this.input?.setAttribute?.('aria-label', this.label);
    } else {
      this?.removeAttribute(attributes.LABEL_HIDDEN);

      /* istanbul ignore else */
      if (this.input) {
        this.input?.removeAttribute('aria-label');

        const labelTemplate = document.createElement('template');
        labelTemplate.innerHTML = (
          `<label for="${this.id}-input" class="ids-label-text">
            <ids-text part="label" label="true" color-unset>${this.label}</ids-text>
          </label>`
        );
        this.container.insertBefore(
          labelTemplate.content.childNodes[0],
          this.container.querySelector('field-container')
        );
      }
    }
  }

  /**
   * @returns {boolean} Flag indicating whether a label's text is not displayed
   * explicitly in the component
   */
  get labelHidden() {
    return this.getAttribute(attributes.LABEL_HIDDEN);
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
      this.setAttribute(attributes.AUTOSELECT, val.toString());
    } else {
      this.removeAttribute(attributes.AUTOSELECT);
    }
    this.handleAutoselect();
  }

  get autoselect() { return this.getAttribute(attributes.AUTOSELECT); }

  /**
   * When set the input will add css class `bg-transparent`
   * @param {boolean|string} value If true will set `bg-transparent` attribute
   */
  set bgTransparent(value) {
    const val = stringUtils.stringToBool(value);
    const className = 'bg-transparent';
    if (val) {
      this.setAttribute(attributes.BG_TRANSPARENT, val.toString());
      this.input?.classList.add(className);
    } else {
      this.removeAttribute(attributes.BG_TRANSPARENT);
      this.input?.classList.remove(className);
    }
  }

  get bgTransparent() { return this.getAttribute(attributes.BG_TRANSPARENT); }

  /**
   * When set the input will add css class `text-ellipsis`
   * @param {boolean|string} value If true will set `text-ellipsis` attribute
   */
  set textEllipsis(value) {
    const val = stringUtils.stringToBool(value);
    const className = 'text-ellipsis';
    if (val) {
      this.setAttribute(attributes.TEXT_ELLIPSIS, val.toString());
      this.input?.classList.add(className);
    } else {
      this.removeAttribute(attributes.TEXT_ELLIPSIS);
      this.input?.classList.remove(className);
    }
  }

  get textEllipsis() { return this.getAttribute(attributes.TEXT_ELLIPSIS); }

  /**
   * When set the input will add a clearable x button
   * @param {boolean|string} value If true will set `clearable` attribute
   */
  set clearable(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CLEARABLE, val.toString());
    } else {
      this.removeAttribute(attributes.CLEARABLE);
    }
    this.handleClearable();
  }

  get clearable() { return this.getAttribute(attributes.CLEARABLE); }

  /**
   * When set the input will force to add a clearable x button on readonly and disabled
   * @param {boolean|string} value If true will set `clearable-forced` attribute
   */
  set clearableForced(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.CLEARABLE_FORCED, val.toString());
    } else {
      this.removeAttribute(attributes.CLEARABLE_FORCED);
    }
    this.handleClearable();
  }

  get clearableForced() { return this.getAttribute(attributes.CLEARABLE_FORCED); }

  /**
   *  Set the compact height
   * @param {boolean|string} value If true will set `compact` attribute
   */
  set compact(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.COMPACT, val.toString());
      this.container?.classList.add(attributes.COMPACT);
    } else {
      this.removeAttribute(attributes.COMPACT);
      this.container?.classList.remove(attributes.COMPACT);
    }
  }

  get compact() { return this.getAttribute(attributes.COMPACT); }

  /**
   *  Set the dirty tracking feature on to indicate a changed field
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringUtils.stringToBool(value);

    if (val) {
      this.setAttribute(attributes.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(attributes.DIRTY_TRACKER);
    }
    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(attributes.DIRTY_TRACKER); }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.setInputState(attributes.DISABLED);
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * internal reference to a label element a user provides
   */
  #labelEl;

  /**
   * Set the `label` text of input label
   * @param {string} value of the `label` text property
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value.toString());
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    this.setLabelText(value);
  }

  get label() { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Set `label-required` attribute
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value) {
    const val = stringUtils.stringToBool(value);

    if (val) {
      this.setAttribute(attributes.LABEL_REQUIRED, val.toString());
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired() { return this.getAttribute(attributes.LABEL_REQUIRED); }

  /**
   * Set the `placeholder` of input
   * @param {string} value of the `placeholder` property
   */
  set placeholder(value) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.input?.setAttribute(attributes.PLACEHOLDER, value);
      return;
    }
    this.removeAttribute(attributes.PLACEHOLDER);
    this.input?.removeAttribute(attributes.PLACEHOLDER);
  }

  get placeholder() { return this.getAttribute(attributes.PLACEHOLDER); }

  /**
   * Set the input to readonly state
   * @param {boolean|string} value If true will set `readonly` attribute
   */
  set readonly(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.READONLY, val.toString());
    } else {
      this.removeAttribute(attributes.READONLY);
    }
    this.setInputState(attributes.READONLY);
  }

  get readonly() { return this.getAttribute(attributes.READONLY); }

  /**
   * Set the fieldHeight (height) of input
   * @param {string} value [xs, sm, mm, md, lg]
   */
  set fieldHeight(value) {
    const fieldHeight = FIELD_HEIGHTS[value];
    const heightClasses = Object.values(FIELD_HEIGHTS).map((h) => this.fieldHeightClass(h));
    this.container?.classList.remove(...heightClasses);
    if (fieldHeight) {
      this.setAttribute(attributes.FIELD_HEIGHT, fieldHeight);
      this.container?.classList.add(this.fieldHeightClass(fieldHeight));
    } else {
      this.removeAttribute(attributes.FIELD_HEIGHT);
    }
  }

  get fieldHeight() { return this.fieldHeightClass(this.getAttribute(attributes.FIELD_HEIGHT)); }

  /**
   * Set the size (width) of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value) {
    const size = SIZES[value];
    this.setAttribute(attributes.SIZE, size || SIZES.default);
    this.container?.classList.remove(...Object.values(SIZES));
    this.container?.classList.add(size || SIZES.default);
  }

  get size() { return this.getAttribute(attributes.SIZE) || SIZES.default; }

  /**
   * Sets the text alignment
   * @param {string} value [left, center, right]
   */
  set textAlign(value) {
    const textAlign = TEXT_ALIGN[value] || TEXT_ALIGN.default;
    this.setAttribute(attributes.TEXT_ALIGN, textAlign);
    this.input?.classList.remove(...Object.values(TEXT_ALIGN));
    this.input?.classList.add(textAlign);
  }

  get textAlign() { return this.getAttribute(attributes.TEXT_ALIGN) || TEXT_ALIGN.default; }

  /**
   * Set to true if the input is a triggr field
   * @param {boolean|string} value If true will set `triggerfield` attribute
   */
  set triggerfield(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.TRIGGERFIELD, val.toString());
    } else {
      this.removeAttribute(attributes.TRIGGERFIELD);
    }
    this.input?.classList[this.triggerfield ? 'add' : 'remove']('has-triggerfield');
  }

  get triggerfield() { return this.getAttribute(attributes.TRIGGERFIELD); }

  /**
   * Sets the input type
   * @param {string} value [text, password, number, email]
   */
  set type(value) {
    const type = TYPES[value];
    if (type) {
      this.setAttribute(attributes.TYPE, type);
      this.input.setAttribute(attributes.TYPE, type);
      return;
    }
    this.setAttribute(attributes.TYPE, TYPES.default);
    this.input.setAttribute(attributes.TYPE, TYPES.default);
  }

  get type() { return this.getAttribute(attributes.TYPE); }

  /**
   * Sets the validation check to use
   * @param {string} value The `validate` attribute
   */
  set validate(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value);
    } else {
      this.removeAttribute(attributes.VALIDATE);
    }
    this.handleValidation();
  }

  get validate() { return this.getAttribute(attributes.VALIDATE); }

  /**
   * Set `validation-events` attribute
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value);
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
    }
    this.handleValidation();
  }

  get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS); }

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

    this.setAttribute(attributes.VALUE, v);
    if (this.input?.value !== v) {
      this.input.value = v;
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  get value() {
    return this.input?.value || '';
  }

  /**
   * set the id of the input, which will also determine the
   * input id for labels at #${id}-input
   *
   * @param {string} value id
   */
  set id(value) {
    this.setAttribute(attributes.ID, value);
    this.input?.setAttribute(attributes.ID, `${value}-input`);
  }

  get id() {
    return this.getAttribute(attributes.ID);
  }
}

export default IdsInput;
