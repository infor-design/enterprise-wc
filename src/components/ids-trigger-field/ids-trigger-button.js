import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-trigger-button-base';

import styles from './ids-trigger-button.scss';

/**
 * IDS Trigger Button Component
 * @type {IdsTriggerButton}
 * @inherits IdsElement
 */
@customElement('ids-trigger-button')
@scss(styles)
export default class IdsTriggerButton extends Base {
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
      attributes.INLINE,
      attributes.READONLY,
      attributes.TABBABLE,
    ];
  }

  connectedCallback() {
    super.connectedCallback?.();
    if (this.getAttribute(attributes.INLINE)) {
      this.showBorder = true;
    }
    if (!this.hasAttribute(attributes.TABBABLE)) {
      this.tabbable = true;
    }
  }

  /**
   * Figure out the classes
   * @private
   * @readonly
   * @returns {Array} containing classes used to identify this button prototype
   */
  get protoClasses() {
    return ['ids-trigger-button'].concat(super.protoClasses);
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value) {
    const isTabbable = stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');

    if (isTabbable) {
      this.setAttribute(attributes.TABBABLE, '');
      button.tabIndex = 0;
      return;
    }

    this.removeAttribute(attributes.TABBABLE);
    button.tabIndex = -1;
  }

  get tabbable() { return stringToBool(this.getAttribute(attributes.TABBABLE)); }

  /**
   * Set the trigger button to readonly color
   * @param {boolean|string} value True of false depending if the trigger button is readonly
   */
  set readonly(value) {
    const isReadonly = stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');
    if (isReadonly) {
      this.setAttribute(attributes.READONLY, '');
      button.tabIndex = -1;
      return;
    }
    button.tabIndex = this.tabbable ? 0 : -1;
    this.removeAttribute(attributes.READONLY);
  }

  get readonly() { return stringToBool(this.getAttribute(attributes.READONLY)); }

  /**
   * @readonly
   * @returns {string} containing an optional "border" class to apply to this button
   */
  get inlineCssClass() {
    return this?.slot === 'trigger-start' ? 'inline-start' : 'inline-end';
  }

  /**
   * @param {boolean} val true if this trigger button should display "inline" instead of having its own full border
   */
  set inline(val) {
    const showsBorder = stringToBool(val);
    if (showsBorder) {
      this.setAttribute(attributes.INLINE, '');
      this.#setBorderClass();
    } else {
      this.removeAttribute(attributes.INLINE);
      this.#removeBorderClass();
    }
  }

  /**
   * @returns {boolean} true if this trigger button displays "inline" instead of having its own full border
   */
  get inline() { return this.getAttribute(attributes.INLINE); }

  #setBorderClass() {
    this.button.classList.add('style-inline', this.inlineCssClass);
  }

  #removeBorderClass() {
    this.button.classList.remove('style-inline', this.inlineCssClass);
  }
}
