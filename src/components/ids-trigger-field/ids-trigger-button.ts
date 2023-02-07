import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsButton from '../ids-button/ids-button';

import styles from './ids-trigger-button.scss';

/**
 * IDS Trigger Button Component
 * @type {IdsTriggerButton}
 * @inherits IdsButton
 * @mixes IdsFieldHeightMixin
 */
@customElement('ids-trigger-button')
@scss(styles)
export default class IdsTriggerButton extends IdsFieldHeightMixin(IdsButton) {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.INLINE,
      attributes.INHERIT_COLOR,
      attributes.READONLY,
      attributes.TABBABLE,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.inline = stringToBool(this.getAttribute(attributes.INLINE));
  }

  /**
   * Figure out the classes
   * @private
   * @readonly
   * @returns {Array<string>} containing classes used to identify this button prototype
   */
  get protoClasses(): Array<string> {
    return ['ids-trigger-button'].concat(super.protoClasses);
  }

  /**
   * Set if the trigger field is tabbable
   * @param {boolean|string} value True of false depending if the trigger field is tabbable
   */
  set tabbable(value: boolean | string) {
    const isTabbable = stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');

    if (isTabbable) {
      this.setAttribute(attributes.TABBABLE, '');
      if (button) button.tabIndex = 0;
      return;
    }

    this.removeAttribute(attributes.TABBABLE);
    if (button) button.tabIndex = -1;
  }

  get tabbable(): boolean { return stringToBool(this.getAttribute(attributes.TABBABLE)); }

  /**
   * Set the trigger button to readonly color
   * @param {boolean|string} value True of false depending if the trigger button is readonly
   */
  set readonly(value: boolean | string) {
    const isReadonly = stringToBool(value);
    const button = this.shadowRoot?.querySelector('button');
    if (isReadonly) {
      this.setAttribute(attributes.READONLY, '');
      if (button) button.tabIndex = -1;
      return;
    }
    if (button) button.tabIndex = this.tabbable ? 0 : -1;
    this.removeAttribute(attributes.READONLY);
  }

  get readonly(): boolean { return stringToBool(this.getAttribute(attributes.READONLY)); }

  /**
   * @readonly
   * @returns {string} containing an optional "border" class to apply to this button
   */
  get inlineCssClass(): string {
    return this?.slot === 'trigger-start' ? 'inline-start' : 'inline-end';
  }

  /**
   * @param {boolean} val true if this trigger button should display "inline" instead of having its own full border
   */
  set inline(val: boolean | string) {
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
  get inline(): boolean { return stringToBool(this.getAttribute(attributes.INLINE)); }

  #setBorderClass() {
    this.button?.classList.add('style-inline', this.inlineCssClass);
  }

  #removeBorderClass() {
    this.button?.classList.remove('style-inline', this.inlineCssClass);
  }

  /**
   * @param {boolean} val true if this trigger button should inherit a parent component's text color for use internally
   */
  set inheritColor(val: boolean | string) {
    if (stringToBool(val)) {
      this.setAttribute(attributes.INHERIT_COLOR, '');
      this.button?.classList.add('inherit-color');
    } else {
      this.removeAttribute(attributes.INHERIT_COLOR);
      this.button?.classList.remove('inherit-color');
    }
  }

  /**
   * @returns {boolean} true if this trigger button inherits a parent component's text color for use internally
   */
  get inheritColor(): boolean {
    return this.hasAttribute(attributes.INHERIT_COLOR);
  }
}
