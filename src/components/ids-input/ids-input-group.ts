import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import { IdsValidationErrorMessage, ValidationMixinInterface } from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import { IdsInputInterface } from './ids-input-attributes';
import styles from './ids-input-group.scss';

type IdsValidateInput = IdsInputInterface & ValidationMixinInterface & HTMLElement;

export type IdsGroupValidationRule = {
  /** The localized message text */
  message: string;

  /** The method to check validation logic, return true if is valid */
  check: (input: any) => boolean;
};

const Base = IdsEventsMixin(IdsElement);

@customElement('ids-input-group')
@scss(styles)
export default class IdsInputGroup extends Base {
  #groupRule: IdsGroupValidationRule | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  static getAttributes(): Array<string> {
    return [];
  }

  template(): string {
    return `<div class="ids-input-group">
      <div id="input-group-container"><slot></slot></div>
      <div id="group-message-container"></div>
    </div>`;
  }

  get slottedInputs(): Array<IdsValidateInput> {
    const slot = this.container?.querySelector('slot');
    const slottedInputs = slot?.assignedElements() as Array<IdsValidateInput>;

    return slottedInputs || [];
  }

  get messageContainer(): HTMLElement {
    return this.container!.querySelector('#group-message-container');
  }

  #attachEventHandlers(): void {
    this.onEvent('slotchange', this.container?.querySelector('slot'), () => {
      this.slottedInputs.forEach((input) => { input.hideErrorMessage(true); });
    });

    this.onEvent('change', this.container?.querySelector('#input-group-container'), () => {
      requestAnimationFrame(() => {
        console.log('change');
        this.#renderGroupMessage();
      });
    });
  }

  #validateGroup(): boolean {
    const passFail = this.#groupRule?.check(this.slottedInputs);
    return !!passFail;
  }

  #createGroupErrorMessage(): string {
    return `<ids-text id="group-validation-message">
      <ids-icon icon="alert"></ids-icon>
      ${this.#groupRule?.message}
    </ids-text>`;
  }

  #renderGroupMessage() {
    const inputErrors = this.#getInputErrorMessages();
    const hasErrors = !!inputErrors.length;

    if (hasErrors) {
      const firstError = inputErrors[0] as Element;
      firstError?.toggleAttribute('hidden', false);
      this.messageContainer.replaceChildren(firstError as Node);
    } else if (!this.#validateGroup()) {
      this.messageContainer.innerHTML = this.#createGroupErrorMessage();
    } else {
      this.messageContainer.innerHTML = '';
    }
  }

  #getInputErrorMessages(): HTMLElement[] {
    return this.slottedInputs
      .map((input) => input.validationMessageElems || [])
      .flat()
      .map((elem) => elem.cloneNode(true) as HTMLElement);
  }

  /**
   * Add validation rule/s. Overrides IdsValidationMixin method().
   * @param {IdsGroupValidationRule} rule incoming rule/s settings
   * @returns {void}
   */
  addGroupValidationRule(rule: IdsGroupValidationRule): void {
    this.#groupRule = rule;
  }
}
