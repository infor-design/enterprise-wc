// Import Base and Decorators
import pathData from 'ids-identity/dist/theme-new/icons/empty/path-data.json';
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-empty-message-base';
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';

import styles from './ids-empty-message.scss';

/**
 * IDS Empty Message Component
 * @type {IdsEmptyMessage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
@customElement('ids-empty-message')
@scss(styles)
export default class IdsEmptyMessage extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    this.#attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters and setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ICON
    ];
  }

  iconData() {
    return pathData[this.icon];
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-empty-message" part="container">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" aria-hidden="true">${this.iconData()}</svg>
        <div class="label">
          <slot name="label"></slot>
        </div>
        <div class="description">
          <slot name="description"></slot>
        </div>
        <div class="button">
          <slot name="button"></slot>
        </div>
      </div>
    </div>`;
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    return this;
  }

  get icon() { return this.getAttribute(attributes.ICON); }

  set icon(value) {
    const svgIcon = this.shadowRoot.querySelector('svg');
    if (value && pathData[value]) {
      svgIcon.style.display = '';
      this.setAttribute(attributes.ICON, value);
      svgIcon.innerHTML = this.iconData();
    } else {
      this.removeAttribute(attributes.ICON);
      svgIcon.style.display = 'none';
    }
  }
}
