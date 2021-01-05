import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import styles from './ids-card.scss';

/**
 * IDS Label Component
 */
@customElement('ids-card')
@scss(styles)
class IdsCard extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['auto-height'];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-card">
      <div class="ids-card-header">
        <slot name="card-header"></slot>
      </div>
      <div class="ids-card-content">
        <slot name="card-content"></slot>
      </div>
    </div>`;
  }

  /**
   * Set the height of the card
   * @param {string} value The height can be single, double, triple or auto
   */
  set autoHeight(value) {
    if (value) {
      this.setAttribute('auto-height', value);
      this.container.classList.add(`ids-card-auto-height`);
      return;
    }

    this.container.classList = '';
    this.removeAttribute('auto-height');
  }

  get autoHeight() { return this.getAttribute('auto-height'); }
}

export default IdsCard;
