import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import styles from './ids-label.scss';

/**
 * IDS Label Component
 */
@customElement('ids-label')
@scss(styles)
class IdsLabel extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['font-size', 'type'];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const tag = this.type || 'span';
    return `<${tag} class="ids-label${this.fontSize ? ` ids-text-${this.fontSize}` : ''}"><slot></slot></${tag}>`;
  }

  /**
   * Rerender the component template
   * @private
   */
  rerender() {
    this.shadowRoot.innerHTML = this.template();
  }

  /**
   * Set the font size/style of the label with a class.
   * @param {string} value The font size in the font scheme i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    if (value) {
      this.setAttribute('font-size', value);
      this.container.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute('font-size');
    this.container.className = '';
    this.container.classList.add('ids-label');
  }

  get fontSize() { return this.getAttribute('font-size'); }

  /**
   * Set the type of object it is (h1-h6, label, span (default))
   * @param {string} value The font size in the font scheme i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set type(value) {
    if (value) {
      this.setAttribute('type', value);
      this.rerender();
      return;
    }

    this.removeAttribute('type');
    this.rerender();
  }

  get type() { return this.getAttribute('type'); }
}

export default IdsLabel;
