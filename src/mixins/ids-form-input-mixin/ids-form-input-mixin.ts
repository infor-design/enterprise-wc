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
    if (oldValue === newValue) return;

    this.formInput?.setAttribute?.(name, newValue);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#ariaDefaults();

    this.offEvent('change.native', this.formInput);
    this.onEvent('change.native', this.formInput, (e: Event) => this.#handleInputEvent(e));

    this.offEvent('input.native', this.formInput);
    this.onEvent('input.native', this.formInput, (e: Event) => this.#handleInputEvent(e));
  }

  #ariaDefaults() {
    const label = this.getAttribute(attributes.LABEL) ?? this.#internals?.ariaLabel ?? '';
    this.formInput?.setAttribute('aria-label', label);
  }

  #handleInputEvent(e: Event) {
    const value = this.value;
    this.#internals?.setFormValue?.(value);

    const inputWrapper = (this.getRootNode() as ShadowRoot)?.host;
    if (inputWrapper) {
      (inputWrapper as HTMLInputElement).value = value;
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

  get value(): string { return this.formInput?.getAttribute?.(attributes.VALUE) ?? ''; }

  set value(value: string) {
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
