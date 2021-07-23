import {
  customElement,
  scss
} from '../ids-base';

import { IdsButton } from '../ids-button/ids-button';
import { stringToBool } from '../ids-base/ids-string-utils';
import { attributes } from '../ids-base/ids-attributes';

import styles from '../ids-button/ids-button.scss';

/**
 * IDS Modal Button Component
 * @type {IdsModalButton}
 * @inherits IdsButton
 */
@customElement('ids-modal-button')
@scss(styles)
class IdsModalButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * @returns {Array} containing configurable properties on this component
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.CANCEL
    ];
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Figure out the classes
   * @private
   * @readonly
   * @returns {Array} containing classes used to identify this button prototype
   */
  get protoClasses() {
    return ['ids-modal-button'];
  }

  /**
   * @returns {boolean} true if the button is a cancel button
   */
  get cancel() {
    return this.hasAttribute(attributes.CANCEL);
  }

  /**
   * @param {boolean} val true if the button should be able to cancel the Modal
   */
  set cancel(val) {
    const isValueTruthy = stringToBool(val);
    if (isValueTruthy) {
      this.setAttribute(attributes.CANCEL, `${val}`);
    } else {
      this.removeAttribute(attributes.CANCEL);
    }
  }
}

export default IdsModalButton;
