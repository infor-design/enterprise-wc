import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import { IdsEventsMixin, IdsThemeMixin } from '../../mixins';

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
    return [attributes.AUTO_HEIGHT, attributes.MODE, attributes.VERSION];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-card" part="card">
      <div class="ids-card-header" part="header">
        <slot name="card-header"></slot>
      </div>
      <div class="ids-card-content" part="content">
        <slot name="card-content"></slot>
      </div>
    </div>`;
  }

  /**
   * Set the card to auto height
   * @param {boolean | null} value The height can be auto to contents
   */
  set autoHeight(value) {
    if (value) {
      this.setAttribute('auto-height', value);
      this.container.classList.add(`ids-card-auto-height`);
      return;
    }

    this.container.classList.remove(`ids-card-auto-height`);
    this.removeAttribute('auto-height');
  }

  get autoHeight() { return this.getAttribute('auto-height'); }
}

export default IdsCard;
