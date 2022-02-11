import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import Base from './ids-input-base';

import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import {
  TYPES,
  SIZES,
  FIELD_HEIGHTS,
  TEXT_ALIGN
} from './ids-input-attributes';

import styles from './ids-input.scss';

let instanceCounter = 0;

/**
 * IDS Input Component
 * @type {IdsInput}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsClearableMixin
 * @mixes IdsColorVariantMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsMaskMixin
 * @mixes IdsValidationMixin
 * @mixes IdsThemeMixin
 * @mixes IdsTooltipMixin
 * @part container - the overall container
 * @part field-container - the container for the input
 * @part input - the input element
 * @part label - the label element
 */
@customElement('ids-input')
@scss(styles)
export default class IdsInput extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

  /**
   * @returns {Array<string>} IdsInput component observable attributes
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTOSELECT,
      attributes.BG_TRANSPARENT,
      attributes.CAPS_LOCK,
      attributes.CLEARABLE,
      attributes.CLEARABLE_FORCED,
      attributes.COMPACT,
      attributes.CURSOR,
      attributes.DISABLED,
      attributes.FIELD_HEIGHT,
      attributes.LABEL,
      attributes.LABEL_HIDDEN,
      attributes.LABEL_REQUIRED,
      attributes.ID,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.PASSWORD_VISIBLE,
      attributes.SIZE,
      attributes.READONLY,
      attributes.REVEALABLE_PASSWORD,
      attributes.TABBABLE,
      attributes.TABINDEX,
      attributes.TEXT_ALIGN,
      attributes.TEXT_ELLIPSIS,
      attributes.TRIGGERFIELD,
      attributes.TYPE,
      attributes.VALUE,
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();

    this.#attachEventHandlers();

    if (this.hasAttribute(attributes.AUTOSELECT)) {
      this.handleAutoselect();
    }

    this.#setLabelHidden(this.hasAttribute(attributes.LABEL_HIDDEN));
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    this.templateHostAttributes();
    const {
      ariaLabel,
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      showHide,
      type,
      value
    } = this.templateVariables();

    return `<div class="${containerClass}" part="container">
      ${labelHtml}
      <div class="field-container" part="field-container">
        <input
          part="input"
          id="${this.id}-input"
          ${type}${inputClass}${placeholder}${inputState}
          ${ariaLabel}
          ${value}
          ></input>
        ${showHide}
      </div>
    </div>`;
  }

  /**
   * Uses current IdsInput state to set some attributes on its host element
   * @returns {void}
   */
  templateHostAttributes() {
    if (!this.id) {
      this.setAttribute?.(attributes.ID, `ids-input-${++instanceCounter}`);
    }
  }

  /**
   * Uses current IdsInput state to generate strings used in its template.
   * @returns {object} containing template strings used for generating an IdsInput template
   */
  templateVariables() {
    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    let type = ` type="${this.type || TYPES.default}"`;
    let inputClass = `ids-input-field ${this.textAlign}`;
    let showHide = ``;
    if (this.revealablePassword && this.type === TYPES.password) {
      showHide = `<ids-button text="${this.passwordVisible ? 'HIDE' : 'SHOW'}" id="show-hide-password" class="show-hide-password"></ids-button>`;
      type = `  type="${this.passwordVisible ? 'text' : this.type}"`;
    }

    inputClass += stringToBool(this.bgTransparent) ? ' bg-transparent' : '';
    inputClass += stringToBool(this.textEllipsis) ? ' text-ellipsis' : '';
    inputClass += stringToBool(this.triggerfield) ? ' has-triggerfield' : '';
    inputClass = ` class="${inputClass}"`;

    let inputState = stringToBool(this.readonly) ? ' readonly' : '';
    inputState = stringToBool(this.disabled) ? ' disabled' : inputState;

    let containerClass = `ids-input${inputState} ${this.size} ${this.fieldHeight}`;
    containerClass += stringToBool(this.compact) ? ' compact' : '';
    containerClass += stringToBool(this.noMargins) ? ' no-margins' : '';

    const ariaLabel = this.getAttribute(attributes.LABEL_HIDDEN) && this.label ? `aria-label="${this.label}"` : '';
    const hiddenLabelCss = !this.label || this.getAttribute(attributes.LABEL_HIDDEN) ? ' empty' : '';
    const labelHtml = `<label for="${this.id}-input" class="ids-label-text${hiddenLabelCss}">
        <ids-text part="label" label="true" color-unset>${this.label}</ids-text>
      </label>`;
    const value = this.hasAttribute(attributes.VALUE) ? ` value="${this.getAttribute(attributes.VALUE)}" ` : '';

    return {
      ariaLabel,
      containerClass,
      inputClass,
      inputState,
      labelHtml,
      placeholder,
      showHide,
      type,
      value
    };
  }

  set colorVariant(value) {
    super.colorVariant = value;
    this.clearable && this.refreshClearableButtonStyles();
  }

  get colorVariant() {
    return super.colorVariant;
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get input() {
    return this.container.querySelector(`input[part="input"]`);
  }

  /**
   * @readonly
   * @returns {HTMLElement} the element in this component's Shadow Root
   *  that wraps the input and any triggering elements or icons
   */
  get fieldContainer() {
    return this.container.querySelector('.field-container');
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
   * @returns {boolean} indicates whether password reveal functionality is on or off
   */
  get revealablePassword() {
    return stringToBool(this.getAttribute(attributes.REVEALABLE_PASSWORD));
  }

  /**
   * sets whether password reveal functionality is available
   * @param {boolean|string} value boolean value sets whether reveal functionality is toggled on or off
   */
  set revealablePassword(value) {
    const valueSafe = stringToBool(value);
    if (this.type === TYPES.password) {
      if (valueSafe) {
        this.setAttribute(attributes.REVEALABLE_PASSWORD, 'true');
        this.#togglePasswordEventSetUp(true);
      } else {
        this.setAttribute(attributes.REVEALABLE_PASSWORD, 'false');
        this.#togglePasswordEventSetUp(false);
      }
    } else {
      this.removeAttribute(attributes.REVEALABLE_PASSWORD);
    }
  }

  /**
   * @returns {boolean} indicates whether the capslock indicator is enabled or disabled
   */
  get capsLock() {
    return stringToBool(this.getAttribute(attributes.CAPS_LOCK));
  }

  /**
   * sets whether capslock indicatoris enabled or disabled
   * @param {boolean|string} value sets whether capslock indicator functionality is toggled on or off
   */
  set capsLock(value) {
    if (stringToBool(value)) {
      this.#capsLockEventSetUp(true);
      this.setAttribute(attributes.CAPS_LOCK, 'true');
    } else {
      this.#capsLockEventSetUp(false);
      this.removeAttribute(attributes.CAPS_LOCK);
    }
  }

  /**
   * @returns {boolean} whether the password is currently visible
   */
  get passwordVisible() {
    return stringToBool(this.getAttribute(attributes.PASSWORD_VISIBLE));
  }

  /**
   * sets whether the password is currently visible
   * @param {boolean|string} value toggles the visibility of the password on or off
   */
  set passwordVisible(value) {
    const valueSafe = stringToBool(value);
    if (valueSafe !== this.passwordVisible) {
      valueSafe
        ? this.setAttribute(attributes.PASSWORD_VISIBLE, 'true')
        : this.setAttribute(attributes.PASSWORD_VISIBLE, 'false');
    }

    this.#passwordVisibilityHandler();
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
        val: stringToBool(this[prop])
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
    const labelEl = this.#labelEl || this.shadowRoot.querySelector(`[for="${this.id}-input"]`);
    if (labelEl) {
      labelEl.querySelector('ids-text').innerHTML = value || '';
      labelEl.classList[value ? 'remove' : 'add']('empty');
    }
  }

  #labelHidden = false;

  /**
   * @param {boolean} value Flags a label's text as not displayed explicitly in the label element
   * */
  set labelHidden(value) {
    const newValue = stringToBool(value);
    const currentValue = this.#labelHidden;

    if (newValue !== currentValue) {
      if (newValue) {
        this.setAttribute(attributes.LABEL_HIDDEN, '');
      } else {
        this.removeAttribute(attributes.LABEL_HIDDEN);
      }
      this.#labelHidden = newValue;
      this.#setLabelHidden(newValue);
    }
  }

  /**
   * @returns {boolean} Flag indicating whether a label's text is not displayed
   * explicitly in the component
   */
  get labelHidden() {
    return this.#labelHidden;
  }

  #setLabelHidden(doHide = false) {
    if (doHide) {
      this.#hideLabel();
      this.input.setAttribute('aria-label', this.label);
    } else {
      this.#showLabel();
      this.input.removeAttribute('aria-label');
    }
  }

  #hideLabel() {
    this.setLabelText('');
  }

  #showLabel() {
    const existingLabel = this.shadowRoot.querySelector('label');
    if (!existingLabel) {
      this.fieldContainer.insertAdjacentHTML('beforebegin', `<label for="${this.id}-input" class="ids-label-text">
        <ids-text part="label" label="true" color-unset>${this.label}</ids-text>
      </label>`);
    } else {
      this.setLabelText(this.label);
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
   * handles teardown and set up for capslock detection events
   * @param {boolean} value indicates whether to turn events on or off
   * @returns {void}
   */
  #capsLockEventSetUp(value) {
    const indicatorDiv = this.shadowRoot.querySelector('.inline-indicators');
    let capsLockIndicator = indicatorDiv.querySelector('#caps-lock-indicator');
    if (value) {
      this.offEvent('keyup.capslock', this.input);
      this.onEvent('keyup.capslock', this.input, (event) => {
        capsLockIndicator = indicatorDiv.querySelector('#caps-lock-indicator');
        if (event.getModifierState('CapsLock') && !capsLockIndicator) {
          indicatorDiv.innerHTML += '<ids-icon id="caps-lock-indicator" class="caps-lock-indicator" icon="capslock"></ids-icon>';
        } else if (event.getModifierState('CapsLock') && capsLockIndicator) {
          capsLockIndicator.style.display = '';
        } else if (capsLockIndicator && !event.getModifierState('CapsLock')) {
          capsLockIndicator.style.display = 'none';
        }
      });
    } else {
      this.offEvent('keyup.capslock', this.input);
      capsLockIndicator?.remove();
    }
  }

  /**
   * Handle input change event
   * @private
   * @returns {void}
   */
  #attachInputChangeEvent() {
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
  #attachNativeEvents() {
    if (!this.input) {
      return this;
    }

    const events = ['change.input', 'focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (e) => {
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
  #attachEventHandlers() {
    this.#attachNativeEvents();
    this.#attachInputChangeEvent();
  }

  /**
   * handles event set up and teardown for password indicator
   * @private
   * @param {boolean} value whether to toggle events on or off
   * @returns {void}
   */
  #togglePasswordEventSetUp(value) {
    const showHidePasswordElem = this.shadowRoot.querySelector(`.show-hide-password`);
    const inputContainer = this.shadowRoot.querySelector('.inline-indicators');
    if (value) {
      if (!showHidePasswordElem && this.revealablePassword && this.type === TYPES.password) {
        const showHideButton = document.createElement('ids-button');
        showHideButton.text = this.passwordVisible ? 'HIDE' : 'SHOW';
        showHideButton.id = 'show-hide-password';
        showHideButton.classList.add('show-hide-password');
        inputContainer.prepend(showHideButton);
        this.input.type = `${this.passwordVisible ? 'text' : this.type}`;
      }
      this.onEvent('click.showhidepassword', showHidePasswordElem, () => {
        this.passwordVisible = !this.passwordVisible;
        this.#passwordVisibilityHandler();
      });
    } else {
      this.offEvent('click.showhidepassword', showHidePasswordElem);
      this.input.type = this.type;
      showHidePasswordElem?.remove();
    }
  }

  /**
   * toggles the visibility of the password by changing field type
   * @private
   */
  #passwordVisibilityHandler() {
    const passwordButton = this.shadowRoot.querySelector(`.show-hide-password`);
    const passwordField = this.shadowRoot.querySelector(`.ids-input-field`);
    if (passwordButton) {
      if (this.passwordVisible) {
        passwordButton.text = 'HIDE';
        passwordField.type = 'text';
      } else {
        passwordButton.text = 'SHOW';
        passwordField.type = 'password';
      }
    }
  }

  /**
   * @readonly
   * @returns {boolean} true if this input resides inside trigger-field
   */
  get hasParentTriggerField() {
    return this.parentElement?.tagName === 'IDS-TRIGGER-FIELD';
  }

  /**
   * When set the input will select all text on focus
   * @param {boolean|string} value If true will set `autoselect` attribute
   */
  set autoselect(value) {
    const val = stringToBool(value);
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
    const val = stringToBool(value);
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
    const val = stringToBool(value);
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
    const val = stringToBool(value);
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
    const val = stringToBool(value);
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
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.COMPACT, val.toString());
      this.container?.classList.add(attributes.COMPACT);
    } else {
      this.removeAttribute(attributes.COMPACT);
      this.container?.classList.remove(attributes.COMPACT);
    }

    if (this.hasParentTriggerField) {
      this.container?.classList.add('no-margin-bottom');
    } else {
      this.container?.classList.remove('no-margin-bottom');
    }
  }

  get compact() { return this.getAttribute(attributes.COMPACT); }

  /**
   * Sets input to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.setInputState(attributes.DISABLED);
  }

  get disabled() { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * internal reference to a label element a user provides
   */
  #labelEl;

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value) {
    const newValue = stripHTML(value);
    const currentValue = this.label;

    if (newValue !== currentValue) {
      if (value) {
        this.setAttribute(attributes.LABEL, value.toString());
      } else {
        this.removeAttribute(attributes.LABEL);
      }
      this.setLabelText(value);
    }
  }

  get label() { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Set `label-required` attribute
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value) {
    const isValid = typeof value !== 'undefined' && value !== null;
    const val = isValid ? stringToBool(value) : true;
    if (isValid) {
      this.setAttribute(attributes.LABEL_REQUIRED, val);
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired() {
    const value = this.getAttribute(attributes.LABEL_REQUIRED);
    return value !== null ? stringToBool(value) : true;
  }

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
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.READONLY, val.toString());
    } else {
      this.removeAttribute(attributes.READONLY);
    }
    this.setInputState(attributes.READONLY);
  }

  get readonly() { return stringToBool(this.getAttribute(attributes.READONLY)); }

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

    if (this.hasParentTriggerField) {
      this.container?.classList.add('no-margin-bottom');
    } else {
      this.container?.classList.remove('no-margin-bottom');
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
    const val = stringToBool(stringToBool(value));
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
    if (this.input && this.input?.value !== v) {
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
    if (value !== '') {
      this.setAttribute(attributes.ID, value);
      this.input?.setAttribute(attributes.ID, `${value}-input`);
    }
  }

  get id() {
    return this.getAttribute(attributes.ID);
  }

  /**
   * Set the css cursor property to something other than text
   * @param {string} value the css cursor value
   */
  set cursor(value) {
    this.setAttribute(attributes.CURSOR, value);
    this.input.style.cursor = value;
  }

  get cursor() {
    return this.getAttribute(attributes.CURSOR);
  }

  /**
   * Sets the no margins attribute
   * @param {string} n string value from the no margins attribute
   */
  set noMargins(n) {
    if (stringToBool(n)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      this.container.classList.add('no-margins');
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    this.container.classList.remove('no-margins');
  }

  get noMargins() {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Set if the input and buttons are tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    if (stringToBool(value) !== this.getAttribute(attributes.TABBABLE)) {
      const isTabbable = stringToBool(value);
      const inputs = this.shadowRoot?.querySelectorAll(`#${this.id}-input, ids-button, ids-trigger-button`);
      if (isTabbable) {
        this.setAttribute(attributes.TABBABLE, 'true');
        inputs.forEach((input) => {
          input.setAttribute(attributes.TABINDEX, '0');
        });
        return;
      }
      this.setAttribute(attributes.TABBABLE, 'false');
      inputs.forEach((input) => {
        input.setAttribute(attributes.TABINDEX, '-1');
      });
    }
  }

  /**
   * get whether the input currently allows tabbing.
   * @returns {boolean} true or false depending on whether the input is currently tabbable
   */
  get tabbable() {
    return stringToBool(this.getAttribute(attributes.TABBABLE) || true);
  }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   */
  focus() {
    this.input.focus();
  }
}
