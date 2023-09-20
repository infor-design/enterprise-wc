import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFormInputMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  // @see https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/
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
      // TODO: remove call to formInput.setAttribute('value') and fix broken tests
      this.formInput?.setAttribute?.(name, processedValue);
      this.formInput.value = processedValue;

      this.formInput?.dispatchEvent?.(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          elem: this,
          value: processedValue,
        },
      }));
    } else {
      this.formInput?.setAttribute?.(name, newValue || '');
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
    this.#internals?.setFormValue?.(value);

    if (e instanceof CustomEvent) {
      e.stopPropagation();
    }

    this.triggerEvent(`change.${this.name ?? 'ids-form-input-mixin'}`, this, {
      bubbles: true,
      composed: true,
      detail: {
        elem: this,
        value,
        nativeEvent: e,
      }
    });
  }

  #handleInputEvent(e: Event) {
    const value = this.value;
    this.#internals?.setFormValue?.(value);

    const inputWrapper = (this.getRootNode() as ShadowRoot)?.host;
    if (inputWrapper) {
      try {
        (inputWrapper as HTMLInputElement).value = value;
      } catch (err) {
        inputWrapper.setAttribute?.(attributes.VALUE, value);
      }
    }

    this.triggerEvent(`input.${this.name ?? 'ids-form-input-mixin'}`, this, {
      bubbles: true,
      composed: true,
      detail: {
        elem: this,
        value,
        nativeEvent: e,
      }
    });
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get formInput(): HTMLInputElement | HTMLTextAreaElement | null {
    return this.shadowRoot?.querySelector<HTMLInputElement>(`input`) ?? null;
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

  get validity() { return this.#internals?.validity; }

  get validationMessage() { return this.#internals?.validationMessage; }

  get willValidate() { return this.#internals?.willValidate; }

  checkValidity() { return this.#internals?.checkValidity?.(); }

  reportValidity() { return this.#internals?.reportValidity?.(); }
};

export default IdsFormInputMixin;
