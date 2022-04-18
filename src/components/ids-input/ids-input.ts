import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';

import Base from './ids-input-base';

import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-trigger-field/ids-trigger-button';
import {
  TYPES,
  SIZES,
  TEXT_ALIGN,
} from './ids-input-attributes';

import styles from './ids-input.scss';

let instanceCounter = 0;

// Setting defaults text-align
type IdsInputAlignment = 'left' | 'center' | 'right';

/**
 * IdsInput defines its template in a way that can be overridden by other
 * component types.
 */
type IdsInputTemplateVariables = {
  ariaLabel: string;
  capsLock: string;
  containerClass: string;
  inputClass: string;
  inputState: string;
  labelHtml: string;
  placeholder: string;
  showHide: string;
  type: string;
  value: string;
};

/**
 * IDS Input Component
 * @type {IdsInput}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
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
  colorVariants = ['alternate', 'alternate-formatter'];

  /**
   * @returns {Array<string>} IdsInput component observable attributes
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.ACTIVE,
      attributes.AUTOSELECT,
      attributes.BG_TRANSPARENT,
      attributes.CAPS_LOCK,
      attributes.CURSOR,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.LABEL_REQUIRED,
      attributes.ID,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.PASSWORD_VISIBLE,
      attributes.SIZE,
      attributes.READONLY,
      attributes.READONLY_BACKGROUND,
      attributes.REVEALABLE_PASSWORD,
      attributes.TABBABLE,
      attributes.TEXT_ALIGN,
      attributes.TEXT_ELLIPSIS,
      attributes.TYPE,
      attributes.VALUE,
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();

    this.#attachEventHandlers();

    if (this.hasAttribute(attributes.AUTOSELECT)) {
      this.handleAutoselect();
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    this.templateHostAttributes();
    const {
      ariaLabel,
      capsLock,
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
        ${capsLock}
      </div>
      ${this.autocomplete ? `
        <ids-popup
          type="dropdown"
          align="bottom, left"
          align-target="#${this.id}-input"
          part="popup"
        >
          <ids-list-box slot="content"></ids-list-box>
        </ids-popup>` : ''}
    </div>`;
  }

  /**
   * Uses current IdsInput state to set some attributes on its host element
   * @returns {void}
   */
  templateHostAttributes(): void {
    if (!this.id) {
      this.setAttribute?.(attributes.ID, `ids-input-${++instanceCounter}`);
    }
  }

  /**
   * Uses current IdsInput state to generate strings used in its template.
   * @returns {IdsInputTemplateVariables} containing template strings used for generating an IdsInput template
   */
  templateVariables(): IdsInputTemplateVariables {
    const attrs = {
      readonly: this.readonly ? 'readonly' : '',
      disabled: this.disabled ? 'disabled' : '',
      required: this.validate ? 'required' : '',
      noMargins: this.noMargins ? 'no-margins' : '',
    };

    const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
    const type = ` type="${this.isPasswordVisible ? 'text' : this.type || TYPES.default}"`;
    let inputClass = `ids-input-field ${this.textAlign}`;

    // Handle Password Fields
    const showHide = this.templateShowHide();
    const capsLock = this.templateCapsLock();

    inputClass += stringToBool(this.bgTransparent) ? ' bg-transparent' : '';
    inputClass += stringToBool(this.readonlyBackground) ? '' : ' readonly-background';
    inputClass += stringToBool(this.textEllipsis) ? ' text-ellipsis' : '';
    inputClass = ` class="${inputClass}"`;

    let inputState = stringToBool(this.readonly) ? ' readonly' : '';
    inputState = stringToBool(this.disabled) ? ' disabled' : inputState;

    let containerClass = `ids-input${inputState} ${this.size}`;
    containerClass += stringToBool(this.compact) ? ' compact' : '';
    containerClass += stringToBool(this.noMargins) ? ' no-margins' : '';

    const ariaLabel = this.hasAttribute(attributes.LABEL_STATE) && this.label ? `aria-label="${this.label}"` : '';
    const hiddenLabelCss = !this.label || this.hasAttribute(attributes.LABEL_HIDDEN) ? ' empty' : '';
    const labelHtml = `<label
      class="ids-label-text${hiddenLabelCss}"
      for="${this.id}-input"
      part="label"
      ${attrs.readonly}
      ${attrs.disabled}
      ${attrs.required}
    >
      <ids-text part="label" label ${attrs.disabled} color-unset>
        ${this.label}
      </ids-text>
    </label>`;

    const value = this.hasAttribute(attributes.VALUE) ? ` value="${this.getAttribute(attributes.VALUE)}" ` : '';

    return {
      ariaLabel,
      capsLock,
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

  /**
   * @readonly
   * @returns {boolean} true if this is a password field and the password should be shown as plain text
   */
  get isPasswordVisible(): boolean {
    return this.revealablePassword && this.type === TYPES.password;
  }

  templateShowHide(): string {
    return this.isPasswordVisible
      ? `<ids-button id="show-hide-password" class="show-hide-password" no-padding text="${this.passwordVisible ? 'HIDE' : 'SHOW'}"></ids-button>`
      : '';
  }

  templateCapsLock(): string {
    return this.isPasswordVisible
      ? `<ids-icon id="caps-lock-indicator" class="caps-lock-indicator" icon="capslock"></ids-icon>`
      : '';
  }

  set colorVariant(value: string | null) {
    super.colorVariant = value;
    if (this.clearable) {
      this.refreshClearableButtonStyles();
    }
  }

  get colorVariant(): string | null {
    return super.colorVariant;
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get input(): HTMLInputElement {
    return this.container?.querySelector(`input[part="input"]`);
  }

  /**
   * @readonly
   * @returns {HTMLElement} the caps lock indicator icon, if one exists
   */
  get capsLockIcon(): HTMLElement {
    return this.container.querySelector('#caps-lock-indicator');
  }

  /**
   * @readonly
   * @returns {HTMLElement} the element in this component's Shadow Root
   *  that wraps the input and any triggering elements or icons
   */
  get fieldContainer(): HTMLElement {
    return this.container.querySelector('.field-container');
  }

  /**
   * @readonly
   * @returns {HTMLLabelElement} the inner `label` element
   */
  get labelEl(): HTMLLabelElement {
    return (
      this.#labelEl
      || this.shadowRoot?.querySelector(`[for="${this.id}-input"]`)
    );
  }

  /**
   * @returns {boolean} indicates whether password reveal functionality is on or off
   */
  get revealablePassword(): boolean {
    return stringToBool(this.getAttribute(attributes.REVEALABLE_PASSWORD));
  }

  /**
   * sets whether password reveal functionality is available
   * @param {boolean | string} value boolean value sets whether reveal functionality is toggled on or off
   */
  set revealablePassword(value: boolean | string) {
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
  get capsLock(): boolean {
    return stringToBool(this.getAttribute(attributes.CAPS_LOCK));
  }

  /**
   * sets whether capslock indicatoris enabled or disabled
   * @param {boolean | string} value sets whether capslock indicator functionality is toggled on or off
   */
  set capsLock(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.CAPS_LOCK, 'true');
      this.#capsLockEventSetUp(true);
    } else {
      this.removeAttribute(attributes.CAPS_LOCK);
      this.#capsLockEventSetUp(false);
    }
  }

  /**
   * @returns {boolean} whether the password is currently visible
   */
  get passwordVisible(): boolean {
    return stringToBool(this.getAttribute(attributes.PASSWORD_VISIBLE));
  }

  /**
   * sets whether the password is currently visible
   * @param {boolean | string} value toggles the visibility of the password on or off
   */
  set passwordVisible(value: boolean | string) {
    const valueSafe = stringToBool(value);
    if (valueSafe !== this.passwordVisible) {
      if (valueSafe) {
        this.setAttribute(attributes.PASSWORD_VISIBLE, 'true');
      } else {
        this.setAttribute(attributes.PASSWORD_VISIBLE, 'false');
      }
    }

    this.#passwordVisibilityHandler();
  }

  /**
   * Set input state for disabled or readonly
   * @private
   * @param {string} prop The property.
   * @returns {void}
   */
  setInputState(prop: string): void {
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
        msgNodes.forEach((x: any) => x.classList.remove(options.prop2));

        this.input?.setAttribute(options.prop1, 'true');
        this.container.classList.add(options.prop1);
        this.container?.querySelector?.('ids-text')?.setAttribute?.(options.prop1, 'true');
        msgNodes.forEach((x: any) => x.classList.add(options.prop1));
      } else {
        this.input?.removeAttribute(options.prop1);
        this.container.classList.remove(options.prop1);
        this.container.querySelector('ids-text')?.removeAttribute(options.prop1);
        msgNodes.forEach((x: any) => x.classList.remove(options.prop1));
      }
    }
  }

  /**
   * Set the label text
   * @private
   * @param {string} value of label
   * @returns {void}
   */
  setLabelText(value: string): void {
    const labelEl = this.#labelEl || this.shadowRoot.querySelector(`[for="${this.id}-input"]`);
    if (labelEl) {
      labelEl.querySelector('ids-text').innerHTML = value || '';
      labelEl.classList[value ? 'remove' : 'add']('empty');
    }
  }

  /**
   * Handle autoselect
   * @private
   * @returns {void}
   */
  handleAutoselect(): void {
    if (this.autoselect) {
      this.handleInputFocusEvent();
    } else {
      this.handleInputFocusEvent('remove');
    }
  }

  /**
   * Handle input focus event
   * @private
   * @param {string | null} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleInputFocusEvent(option?: string | null): void {
    const eventName = 'focus';
    if (option === 'remove') {
      const handler = this?.handledEvents?.get(eventName);
      if (handler && handler.target === this.input) {
        this.offEvent(eventName, this.input);
      }
    } else {
      this.onEvent(eventName, this.input, () => {
        requestAnimationFrame(() => { // Safari has delay
          this.input?.select();
        });
      });
    }
  }

  /**
   * handles teardown and set up for capslock detection events
   * @param {boolean} value indicates whether to turn events on or off
   * @returns {void}
   */
  #capsLockEventSetUp(value: boolean): void {
    const updateCapsLockIcon = (e: any) => {
      if (this.capsLockIcon) {
        this.capsLockIcon.hidden = !e.getModifierState('CapsLock');
      }
    };

    if (value) {
      if (!this.capsLockIcon) {
        this.input.insertAdjacentHTML('afterend', this.templateCapsLock());
      }
      this.onEvent('keydown.capslock', this.container, updateCapsLockIcon);
      this.onEvent('keyup.capslock', this.container, updateCapsLockIcon);
      if (this.capsLockIcon) {
        this.capsLockIcon.hidden = true;
      }
    } else {
      this.offEvent('keydown.capslock', this.container);
      this.offEvent('keyup.capslock', this.container);
      this.capsLockIcon?.remove();
    }
  }

  /**
   * Setup event handlers that trigger on the host element during native events from the internal HTMLInputElement
   * These trigg
   * @private
   * @returns {this} The IdsInput API for chaining
   */
  #attachNativeEvents(): this {
    if (!this.input) {
      return this;
    }

    const events = ['focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      this.onEvent(evt, this.input, (e: any) => {
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
  #attachEventHandlers(): void {
    this.#attachNativeEvents();

    // If the internal input value is updated and a change event is triggered,
    // reflect that change on the WebComponent host element.
    this.onEvent('change.input', this.container, (e: any) => {
      this.triggeredByChange = true;
      this.value = this.input.value;
      this.triggerEvent('change', this, {
        bubbles: true,
        detail: {
          elem: this,
          nativeEvent: e,
          value: this.value
        }
      });
    });
  }

  /**
   * handles event set up and teardown for password indicator
   * @private
   * @param {boolean} value whether to toggle events on or off
   * @returns {void}
   */
  #togglePasswordEventSetUp(value: boolean): void {
    const showHidePasswordElem = this.shadowRoot.querySelector(`.show-hide-password`);
    if (value) {
      if (!showHidePasswordElem && this.isPasswordVisible) {
        const showHideButton: any = document.createElement('ids-button');
        showHideButton.text = this.passwordVisible ? 'HIDE' : 'SHOW';
        showHideButton.id = 'show-hide-password';
        showHideButton.classList.add('show-hide-password');
        showHideButton.noPadding = true;
        this.input.insertAdjacentElement('afterend', showHideButton);
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
  #passwordVisibilityHandler(): void {
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
   * When set the input will add a CSS class `is-active` that simulates the text input being "focused".
   * @param {boolean | string} value If true will set `text-ellipsis` attribute
   */
  set active(value: boolean | string) {
    const val = stringToBool(value);
    const className = 'is-active';
    if (val) {
      this.setAttribute(attributes.ACTIVE, val.toString());
      this.container.classList.add(className);
    } else {
      this.removeAttribute(attributes.ACTIVE);
      this.container.classList.remove(className);
    }
  }

  get active(): boolean { return stringToBool(this.hasAttribute(attributes.ACTIVE)); }

  /**
   * When set the input will select all text on focus
   * @param {boolean | string} value If true will set `autoselect` attribute
   */
  set autoselect(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.AUTOSELECT, val.toString());
    } else {
      this.removeAttribute(attributes.AUTOSELECT);
    }
    this.handleAutoselect();
  }

  get autoselect(): boolean { return stringToBool(this.getAttribute(attributes.AUTOSELECT)); }

  /**
   * When set the input will add css class `bg-transparent`
   * @param {boolean | string} value If true will set `bg-transparent` attribute
   */
  set bgTransparent(value: boolean | string) {
    const val = stringToBool(value);
    const className = 'bg-transparent';
    if (val) {
      this.setAttribute(attributes.BG_TRANSPARENT, val.toString());
      this.container.classList.add(className);
      this.input?.classList.add(className);
    } else {
      this.removeAttribute(attributes.BG_TRANSPARENT);
      this.container.classList.remove(className);
      this.input?.classList.remove(className);
    }
  }

  get bgTransparent(): boolean { return stringToBool(this.getAttribute(attributes.BG_TRANSPARENT)); }

  /**
   * When set the input will add css class `text-ellipsis`
   * @param {boolean | string} value If true will set `text-ellipsis` attribute
   */
  set textEllipsis(value: boolean | string) {
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

  get textEllipsis(): boolean { return stringToBool(this.getAttribute(attributes.TEXT_ELLIPSIS)); }

  /**
   * Sets input to disabled
   * @param {boolean | string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, 'true');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.setInputState(attributes.DISABLED);
  }

  get disabled(): boolean { return stringToBool(this.getAttribute(attributes.DISABLED)); }

  /**
   * internal reference to a label element a user provides
   */
  #labelEl: any;

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value: string) {
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

  get label(): string { return this.getAttribute(attributes.LABEL) || ''; }

  /**
   * Set `label-required` attribute
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value: string | boolean) {
    const isValid = typeof value !== 'undefined' && value !== null;
    const val = isValid ? stringToBool(value) : true;
    if (isValid) {
      this.setAttribute(attributes.LABEL_REQUIRED, val);
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
  }

  get labelRequired(): boolean {
    const value = this.getAttribute(attributes.LABEL_REQUIRED);
    return value !== null ? stringToBool(value) : true;
  }

  /**
   * Set the `placeholder` of input
   * @param {string} value of the `placeholder` property
   */
  set placeholder(value: string) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.input?.setAttribute(attributes.PLACEHOLDER, value);
      return;
    }
    this.removeAttribute(attributes.PLACEHOLDER);
    this.input?.removeAttribute(attributes.PLACEHOLDER);
  }

  get placeholder(): string { return this.getAttribute(attributes.PLACEHOLDER); }

  /**
   * Set the input to readonly state
   * @param {boolean | string} value If true will set `readonly` attribute
   */
  set readonly(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.READONLY, val.toString());
    } else {
      this.removeAttribute(attributes.READONLY);
    }
    this.setInputState(attributes.READONLY);
  }

  get readonly(): boolean { return stringToBool(this.getAttribute(attributes.READONLY)); }

  /**
   * @param {boolean | string} value If true, causes an IdsInput set to `readonly` to appear
   * to use its standard field background color instead of the "readonly" state color
   */
  set readonlyBackground(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.READONLY_BACKGROUND, val.toString());
      this.container.classList.add(attributes.READONLY_BACKGROUND);
    } else {
      this.removeAttribute(attributes.READONLY_BACKGROUND);
      this.container.classList.remove(attributes.READONLY_BACKGROUND);
    }
  }

  /**
   * @returns {boolean} true if this IdsInput should appear to use its standard
   * field background color instead of the "readonly" state color when set to `readonly`
   */
  get readonlyBackground(): boolean {
    return stringToBool(this.getAttribute(attributes.READONLY_BACKGROUND));
  }

  /**
   * Set the size (width) of input
   * @param {string} value [xs, sm, mm, md, lg, full]
   */
  set size(value: string) {
    const size = SIZES[value] || SIZES.default;
    this.setAttribute(attributes.SIZE, size);
    this.container?.classList.remove(...Object.values(SIZES));
    this.container?.classList.add(size);
  }

  get size(): string { return this.getAttribute(attributes.SIZE) || SIZES.default; }

  /**
   * Sets the text alignment
   * @param {IdsInputAlignment} value [left, center, right]
   */
  set textAlign(value: IdsInputAlignment) {
    const textAlign = TEXT_ALIGN[value] || TEXT_ALIGN.default;
    this.setAttribute(attributes.TEXT_ALIGN, textAlign);
    this.input?.classList.remove('left', 'center', 'right');
    this.input?.classList.add(textAlign);
  }

  get textAlign(): IdsInputAlignment { return this.getAttribute(attributes.TEXT_ALIGN) || TEXT_ALIGN.default; }

  /**
   * Sets the input type
   * @param {string} value [text, password, number, email]
   */
  set type(value: string) {
    const type = TYPES[value];
    if (type) {
      this.setAttribute(attributes.TYPE, type);
      this.input.setAttribute(attributes.TYPE, type);
      return;
    }
    this.setAttribute(attributes.TYPE, TYPES.default);
    this.input.setAttribute(attributes.TYPE, TYPES.default);
  }

  get type(): string { return this.getAttribute(attributes.TYPE); }

  /**
   * Set the `value` attribute of input
   * @param {string} val the value property
   */
  set value(val: string) {
    let v = typeof val === 'string' && val.length ? val : '';
    const currentValue = this.getAttribute(attributes.VALUE) || '';

    // If a mask is enabled, use the conformed value.
    // If no masking occurs, simply use the provided value.
    if (this.mask) {
      v = this.processMaskFromProperty(val) || v;
    }

    if (this.input && this.input?.value !== v) {
      this.input.value = v;
      if (!this.triggeredByChange) {
        this.input?.dispatchEvent(new Event('change', { bubbles: true }));
      }
      this.triggeredByChange = false;
    }

    if (currentValue !== v) {
      this.setAttribute(attributes.VALUE, v);
    }
  }

  get value(): string {
    return this.input?.value || '';
  }

  /**
   * set the id of the input, which will also determine the
   * input id for labels at #${id}-input
   *
   * @param {string} value id
   */
  set id(value: string) {
    if (value !== '') {
      this.setAttribute(attributes.ID, value);
      this.input?.setAttribute(attributes.ID, `${value}-input`);
    }
  }

  get id(): string {
    return this.getAttribute(attributes.ID);
  }

  /**
   * Set the css cursor property to something other than text
   * @param {string} value the css cursor value
   */
  set cursor(value: string) {
    this.setAttribute(attributes.CURSOR, value);
    this.input.style.cursor = value;
  }

  get cursor(): string {
    return this.getAttribute(attributes.CURSOR);
  }

  /**
   * Sets the no margins attribute
   * @param {boolean | string} n string value from the no margins attribute
   */
  set noMargins(n: boolean | string) {
    if (stringToBool(n)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      this.container.classList.add('no-margins');
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    this.container.classList.remove('no-margins');
  }

  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Overrides the standard "blur" behavior to instead tell the inner HTMLInput element to blur.
   */
  blur(): void {
    this.input.blur();
  }

  /**
   * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
   */
  focus(): void {
    this.input.focus();
  }
}
