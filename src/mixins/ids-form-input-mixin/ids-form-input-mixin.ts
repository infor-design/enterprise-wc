import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { LocaleHandler, LocaleMixinInterface } from '../ids-locale-mixin/ids-locale-mixin';

type Constraints = IdsConstructor<EventsMixinInterface & LocaleMixinInterface & LocaleHandler>;

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsFormInputMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  #internals = this.attachInternals() as any;

  static formAssociated = true;

  constructor(...args: any[]) {
    super(...args);
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

    this.formInput?.addEventListener?.('input', (e: Event) => {
      this.#internals.setFormValue(this.value);
      this.triggerEvent(`input.${this.name ?? 'ids-form-input-mixin'}`, this, {
        bubbles: true,
        detail: {
          elem: this,
          value: this.value,
          nativeEvent: e,
        }
      });
    });
  }

  /**
   * @readonly
   * @returns {HTMLInputElement} the inner `input` element
   */
  get formInput(): HTMLInputElement | undefined | null {
    return this.container?.querySelector<HTMLInputElement>(`input`);
  }

  get form() { return this.#internals.form; }

  get name() { return this.getAttribute(attributes.NAME); }

  get type() { return this.localName; }

  get value() { return this.formInput?.getAttribute?.(attributes.VALUE) ?? ''; }
  // get value() { return this.formInput?.value ?? ''; }

  set value(value: string) { this.formInput?.setAttribute?.(attributes.VALUE, value); }

  get validity() { return this.#internals.validity; }

  get validationMessage() { return this.#internals.validationMessage; }

  get willValidate() { return this.#internals.willValidate; }

  checkValidity() { return this.#internals.checkValidity(); }

  reportValidity() { return this.#internals.reportValidity(); }
};

export default IdsFormInputMixin;
