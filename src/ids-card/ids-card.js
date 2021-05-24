import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base';

import { IdsEventsMixin, IdsThemeMixin } from '../ids-mixins';

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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.AUTO_HEIGHT, props.MODE, props.VERSION];
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
   * Set the height of the card
   * @param {string | null} value The height can be single, double, triple or auto
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
