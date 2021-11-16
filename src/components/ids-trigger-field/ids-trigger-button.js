import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsButton from '../ids-button/ids-button';
import styles from './ids-trigger-button.scss';

/**
 * IDS Trigger Button Component
 * @type {IdsTriggerButton}
 * @inherits IdsElement
 */
@customElement('ids-trigger-button')
@scss(styles)
export default class IdsTriggerButton extends IdsButton {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();

    // Trigger it the first time since we have no template
    if (stringToBool(this.readonly)) {
      this.readonly = true;
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.READONLY,
      attributes.TABBABLE
    ];
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');
    if (isTabbable) {
      this.setAttribute(attributes.TABBABLE, 'true');
      button.setAttribute(attributes.TABINDEX, '0');
      return;
    }
    this.setAttribute(attributes.TABBABLE, 'false');
    button.setAttribute(attributes.TABINDEX, '-1');
  }

  get tabbable() { return this.getAttribute(attributes.TABBABLE) || true; }

  /**
   * Set the trigger button to readonly color
   * @param {boolean|string} value True of false depending if the trigger button is readonly
   */
  set readonly(value) {
    const isReadonly = stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');
    if (isReadonly) {
      button.setAttribute(attributes.READONLY, 'true');
      button.setAttribute(attributes.TABINDEX, '-1');
      this.setAttribute(attributes.READONLY, 'true');
      return;
    }
    button.removeAttribute(attributes.READONLY);
    button.setAttribute(attributes.TABINDEX, this.tabbable ? '0' : '-1');
    this.removeAttribute(attributes.READONLY);
  }

  get readonly() {
    return stringToBool(this.getAttribute(attributes.READONLY)) || false;
  }
}
