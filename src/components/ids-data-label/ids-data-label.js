/* eslint-disable no-nested-ternary */
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-data-label-base';
import styles from './ids-data-label.scss';
import IdsText from '../ids-text/ids-text';

/**
 * IDS Data Label Component
 * @type {IdsDataLabel}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 */
@customElement('ids-data-label')
@scss(styles)
export default class IdsDataLabel extends Base {
  constructor() {
    super();

    this.state = {
      labelClass: 'top-positioned',
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get attributes() {
    return [attributes.LABEL, attributes.LABEL_POSITION, attributes.MODE, attributes.VERSION];
  }

  /**
   * Create the Template for the contents
   *
   * @returns {string} The template
   */
  template() {
    return `
      <div class="${this.labelClass}">
        <ids-text class="label" font-size="16">${this.label}${this.colon}</ids-text>
        <ids-text class="description" font-size="16"><slot></slot></ids-text>
      </div>
    `;
  }

  /**
   * Sets to label
   * @param {string} value label string
   */
  set label(value) {
    if (value) {
      this.setAttribute(attributes.LABEL, value);
    }
  }

  get label() { return this.getAttribute(attributes.LABEL); }

  /**
   * Sets to label
   * @param {string} value label string
   */
  set labelPosition(value) {
    if (value) {
      this.setAttribute(attributes.LABEL_POSITION, value);
    }
  }

  get labelPosition() { return this.getAttribute(attributes.LABEL_POSITION); }

  /**
   * @returns {string} css class for data-label
   */
  get labelClass() {
    if (this.labelPosition) {
      return `${this.labelPosition}-positioned`;
    }
    return 'top-positioned';
  }

  /**
   * @returns {string} css class for data-label
   */
  get colon() {
    return this.labelPosition === 'left' ? ':' : '';
  }
}
