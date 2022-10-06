import { attributes } from '../../core/ids-attributes';
import { IdsConstructor } from '../../core/ids-element';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import type { IdsLabelStateMode } from './ids-label-state-common';
import { IdsLabelStateAttributes, isLabelStateValid, isLabelRequiredValid } from './ids-label-state-common';
import { LabelStateHandler } from './ids-label-state-mixin';

interface LabelStateParentHandler {
  onLabelChange?(label: string | null): void;
  onLabelRequiredChange?(): void;
}

type Constraints = IdsConstructor<LabelStateParentHandler & LabelStateHandler>;

/**
 * A mixin that will pass down Label State features to an IdsInput/IdsTriggerField inside another component's shadow root
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsLabelStateParentMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  connectedCallback() {
    super.connectedCallback?.();
    if (this.hasAttribute(attributes.LABEL_STATE)) {
      this.labelState = this.getAttribute(attributes.LABEL_STATE) as IdsLabelStateMode;
    }
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      ...IdsLabelStateAttributes
    ];
  }

  /**
   * Set the `label` text
   * @param {string} value of the `label` text property
   */
  set label(value: string) {
    if (value !== null) {
      this.setAttribute(attributes.LABEL, value);
    } else {
      this.removeAttribute(attributes.LABEL);
    }
    if (typeof this.onLabelChange === 'function') this.onLabelChange(value);
  }

  get label(): string {
    return this.getAttribute(attributes.LABEL) ?? '';
  }

  /**
   * Sets the `label-state` attribute on the inner IdsDropDrown
   */
  set labelState(value: IdsLabelStateMode) {
    if (isLabelStateValid(value)) {
      if (value !== null) {
        this.setAttribute(attributes.LABEL_STATE, value);
      } else {
        this.removeAttribute(attributes.LABEL_STATE);
      }
      if (typeof this.onLabelStateChange === 'function') this.onLabelStateChange(value);
    }
  }

  get labelState(): IdsLabelStateMode {
    return this.getAttribute(attributes.LABEL_STATE) as IdsLabelStateMode;
  }

  /**
   * Set `label-required` attribute
   * @param {string} value The `label-required` attribute
   */
  set labelRequired(value: string | boolean) {
    const isValid = isLabelRequiredValid(value);
    if (isValid) {
      this.setAttribute(attributes.LABEL_REQUIRED, isValid.toString());
    } else {
      this.removeAttribute(attributes.LABEL_REQUIRED);
    }
    if (typeof this.onLabelRequiredChange === 'function') this.onLabelRequiredChange();
  }

  get labelRequired(): boolean {
    const value = this.getAttribute(attributes.LABEL_REQUIRED);
    return value !== null ? stringToBool(value) : true;
  }
};

export default IdsLabelStateParentMixin;
