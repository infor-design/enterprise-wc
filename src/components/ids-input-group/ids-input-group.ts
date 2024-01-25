import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import { IdsInputInterface } from '../ids-input/ids-input-attributes';
import styles from './ids-input-group.scss';

type IdsValidateInput = IdsInputInterface & HTMLElement & {
  isFormComponent?: boolean;
  hideErrorMessage(toHide: boolean): void;
  validationMessageElems?: Array<HTMLElement>;
};

export type IdsGroupValidationRule = {
  /** The localized message text */
  message: string;

  /** The method to check validation logic, return true if is valid */
  check: (inputComponents: any[]) => boolean;
};

/**
 * IDS Input Group Component
 * @type {IdsInputGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-input-group')
@scss(styles)
export default class IdsInputGroup extends IdsEventsMixin(IdsElement) {
  #groupRule: IdsGroupValidationRule | null = null;

  #slottedInputs: Array<IdsValidateInput> = [];

  #validateTimeout = NaN;

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

  #attachEventHandlers(): void {
    this.onEvent('slotchange', this.container?.querySelector('slot'), () => {
      const slot = this.container?.querySelector<HTMLSlotElement>('slot');
      const slottedElements = (slot?.assignedElements() as IdsValidateInput[]) || [];
      this.#slottedInputs = slottedElements.filter((elem) => elem.isFormComponent);
      this.#configureInputs();
    });

    const inputGroupContainer = this.container?.querySelector('#input-group-container');
    this.onEvent('focusout', inputGroupContainer, () => this.#validate());
    this.onEvent('change', inputGroupContainer, () => this.#validate());
  }

  #configureInputs() {
    this.#slottedInputs.forEach((input) => {
      // Hide individual input error messages
      input.hideErrorMessage(true);
      // Margin is applied to group container instead
      input.setAttribute('no-margins', '');
    });
  }

  #validate() {
    const messageContainer = this.container?.querySelector<HTMLElement>('#group-message-container');
    if (!messageContainer || !this.#slottedInputs.length) return;

    cancelAnimationFrame(this.#validateTimeout);
    this.#validateTimeout = requestAnimationFrame(() => {
      const inputErrors = this.#getInputErrorMessages();

      if (inputErrors.length) {
        const firstError = inputErrors[0] as Element;
        firstError?.toggleAttribute('hidden', false);
        messageContainer?.replaceChildren(firstError as Node);
        return;
      }

      if (!this.isGroupValid()) {
        messageContainer.innerHTML = `<ids-text id="group-validation-message">
          <ids-icon icon="alert"></ids-icon>
          ${this.#groupRule?.message}
        </ids-text>`;
        return;
      }

      messageContainer.innerHTML = '';
    });
  }

  /**
   * Queries any error message elems from each input component
   * @returns {HTMLElement[]} error message elements
   */
  #getInputErrorMessages(): HTMLElement[] {
    return this.#slottedInputs
      .map((input) => input.validationMessageElems || [])
      .flat()
      .map((elem) => elem.cloneNode(true) as HTMLElement);
  }

  /**
   * Set group validation rule
   * @param {IdsGroupValidationRule} rule group rule
   */
  addGroupValidationRule(rule: IdsGroupValidationRule): void {
    this.#groupRule = rule;
    this.#validate();
  }

  /**
   * Checks group rule validation
   * @returns {boolean} return true if group rule validates
   */
  isGroupValid(): boolean {
    if (this.#groupRule === null) return true;
    return !!this.#groupRule.check(this.#slottedInputs);
  }
}
