import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

type Constraints = IdsConstructor<EventsMixinInterface>;

const noop = (...params: any) => params;

/**
 * Adds the capability for custom elements to participate in a native form submission and validation.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFormInputMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  /**
   * ElementInternals adds the capability for custom elements to participate in a form submission.
   * To use this feature, we must declare that a custom element is associated with forms as follows:
   * @see https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
   */
  static formAssociated = true;

  #internals: ElementInternals;

  constructor(...args: any[]) {
    super(...args);
    this.#internals = this.attachInternals?.();

    if (this.#internals) {
      this.#internals.ariaLabel = this.name || 'default aria label';
    }
  }

  /**
   * @returns {Array<string>} IdsInput component observable attributes
   */
  static get attributes() {
    return [
      ...(superclass as any).attributes,
      ...attributes.NAME,
      ...attributes.VALUE,
    ];
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get formInput(): HTMLInputElement | HTMLTextAreaElement | null {
    return this.shadowRoot?.querySelector<HTMLInputElement>(`input`) ?? null;
  }

  /**
   * React to attributes changing on the web-component
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue || !this.formInput) return;

    if (name === attributes.VALUE) {
      if (!this.formInput) return;
      const processedValue = this.getAttribute(attributes.VALUE) ?? '';

      // NOTE: formInput.setAttribute('value') sets the default value and formInput.value sets current value
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#gecko_notes
      this.formInput?.setAttribute?.(name, processedValue);
      this.formInput.value = processedValue;

      this.formInput?.dispatchEvent?.(new CustomEvent('change', {
        bubbles: true,
        composed: false,
        detail: {
          elem: this,
          value: processedValue,
        },
      }));
    } else if (stringToBool(newValue)) {
      this.formInput?.setAttribute?.(name, newValue || '');
    } else {
      this.formInput?.removeAttribute?.(name);
    }
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#ariaDefaults();

    this.offEvent('change.native', this.formInput);
    this.onEvent('change.native', this.formInput, (e: Event) => {
      this.#handleInputEvent(e);
      this.#handleChangeEvent(e);
    });

    this.offEvent('input.native', this.formInput);
    this.onEvent('input.native', this.formInput, (e: Event) => this.#handleInputEvent(e));
  }

  #ariaDefaults() {
    const label = this.getAttribute(attributes.LABEL) ?? this.#internals?.ariaLabel ?? '';
    this.formInput?.setAttribute('aria-label', label);
  }

  #handleChangeEvent(e: Event) {
    const value = this.value;

    // If value is null, the element won't participate in form submission.
    this.#internals?.setFormValue?.(value);

    if (e instanceof CustomEvent) {
      e.stopPropagation();
    }

    this.triggerEvent(`change.${this.name ?? 'ids-form-input-mixin'}`, this, {
      bubbles: true,
      composed: false,
      detail: {
        elem: this,
        value,
        nativeEvent: e,
      }
    });
  }

  #handleInputEvent(e: Event) {
    const value = this.value;

    // If value is null, the element won't participate in form submission.
    this.#internals?.setFormValue?.(value);
    const inputWrapper = ((e.target as HTMLElement)?.getRootNode() as ShadowRoot)?.host;

    if (inputWrapper) {
      try {
        (inputWrapper as HTMLInputElement).value = value;
      } catch (err) {
        inputWrapper.setAttribute?.(attributes.VALUE, value);
      }
    }

    this.triggerEvent(`input.${this.name ?? 'ids-form-input-mixin'}`, this, {
      bubbles: true,
      composed: false,
      detail: {
        elem: this,
        value,
        nativeEvent: e,
      }
    });
  }

  get form() { return this.#internals?.form; }

  get type() { return this.localName; }

  get value(): string {
    // NOTE: input.getAttribute('value') returns default, so input.value should be used current value
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#gecko_notes
    return this.formInput?.value ?? this.formInput?.getAttribute?.(attributes.VALUE) ?? '';
  }

  set value(value: string) {
    if (value === this.value) return;

    // NOTE: this.setAttribute() will trigger IdsFormInputMixin.attributeChangedCallback()
    this.setAttribute(attributes.VALUE, value ?? '');
  }

  /**
   * @see https://developer.mozilla.org/docs/Web/API/ElementInternals/validity
   * @see ElementInternals.validity
   * @returns {ValidityState} - Returns the ValidityState object for internals's target element.
   */
  get validity(): ValidityState { return this.#internals?.validity; }

  /**
   * @see https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage
   * @see ElementInternals.validationMessage
   * @returns {string} - error message that would be shown to the user
   */
  get validationMessage(): string { return this.#internals?.validationMessage; }

  /**
   * @see https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate
   * @see ElementInternals.willValidate()
   * @returns {boolean} - true if internals's target element will be validated when the form is submitted
   */
  get willValidate(): boolean { return this.#internals?.willValidate; }

  /**
   * @see https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity
   * @see ElementInternals.checkValidity()
   * @returns {boolean} - true if internals's target element has no validity problems
   */
  checkValidity(): boolean { return this.#internals?.checkValidity?.(); }

  /**
   * @see https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity
   * @see ElementInternals.reportValidity()
   * @returns {boolean} - true if internals's target element has no validity problems
   */
  reportValidity(): boolean { return this.#internals?.reportValidity?.(); }

  /**
   * Called when the associated form-element changes to the form param.
   * ElementInternals.form returns the associated from element.
   * @param {ElementInternals['form']} form - this elements parent form element
   */
  formAssociatedCallback(form: ElementInternals['form']) {
    // @see https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
    noop(form);
  }

  /**
   * Called when the form is being reset (e.g. user pressed input[type=reset] button).
   * Custom element should clear whatever value set by the user.
   */
  formResetCallback() {}

  /**
   * Called when the disabled state of the element changes.
   * @param {boolean} isDisabled - is disabled
   */
  formDisabledCallback(isDisabled: boolean) {
    // @see https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
    noop(isDisabled);
  }

  /**
   * Called when the browser is trying to restore element’s value using the state param,
   * in which case the reason param is "restore".
   *
   * Also called when the browser is trying to fulfill autofill on behalf of user,
   * in which case the reason param is "autocomplete".
   *
   * In the case of "restore", state is a string, File,
   * or FormData object previously set as the second argument to setFormValue.
   * @param {File|string|FormData|null} state - the form element's state
   * @param {string} reason - "restore" or "autocomplete"
   */
  formStateRestoreCallback(state: File | string | FormData | null, reason: 'restore' | 'autocomplete') {
    // @see https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
    noop(state, reason);
  }
};

export default IdsFormInputMixin;
