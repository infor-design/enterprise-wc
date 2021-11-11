import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import { IdsEventsMixin, IdsThemeMixin } from '../../mixins';
import { IdsStringUtils } from '../../utils';

import styles from './ids-card.scss';

/**
 * IDS Card Component
 * @type {IdsCard}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part card - the card element
 * @part header - the header element
 * @part content - the card content element
 */
@customElement('ids-card')
@scss(styles)
class IdsCard extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUTO_FIT,
      attributes.AUTO_HEIGHT,
      attributes.OVERFLOW
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-card" part="card">
        <div class="ids-card-header" part="header">
          <slot name="card-header"></slot>
        </div>
        <div class="ids-card-content ${this.overflow === 'hidden' ? 'overflow-hidden' : ''}" part="content">
          <slot name="card-content"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Set the card to auto fit to its parent size
   * @param {boolean|null} value The auto fit
   */
  set autoFit(value) {
    if (IdsStringUtils.stringToBool(value)) {
      this.setAttribute(attributes.AUTO_FIT, value);
      return;
    }
    this.removeAttribute(attributes.AUTO_FIT);
  }

  get autoFit() { return this.getAttribute(attributes.AUTO_FIT); }

  /**
   * Set the card to auto height
   * @param {boolean|null} value The height can be auto to contents
   */
  set autoHeight(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (IdsStringUtils.stringToBool(value)) {
      this.setAttribute('auto-height', val);
      return;
    }
    this.removeAttribute('auto-height');
  }

  get autoHeight() { return this.getAttribute(attributes.AUTO_HEIGHT); }

  /**
   * Set how the container overflows, can be hidden or auto (default)
   * @param {string | null} [value=null] css property for overflow
   */
  set overflow(value) {
    if (value === 'hidden') {
      this.container.querySelector('.ids-card-content').classList.add('overflow-hidden');
      this.setAttribute(attributes.OVERFLOW, value);
    } else {
      this.container.querySelector('.ids-card-content').classList.remove('overflow-hidden');
      this.removeAttribute(attributes.OVERFLOW);
    }
  }

  get overflow() { return this.getAttribute(attributes.OVERFLOW); }
}

export default IdsCard;
