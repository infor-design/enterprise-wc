import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import styles from './ids-text.scss';

/**
 * IDS Text Component
 */
@customElement('ids-text')
@scss(styles)
class IdsText extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TYPE, props.FONT_SIZE, props.AUDIBLE];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const tag = this.type || 'span';
    let classList = 'ids-text';
    classList += this.audible ? ' audible' : '';
    classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';
    classList = ` class="${classList}"`;

    return `<${tag}${classList}><slot></slot></${tag}>`;
  }

  /**
   * Rerender the component template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    this.shadowRoot.querySelector('.ids-text').remove();
    template.innerHTML = this.template();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Set the font size/style of the text with a class.
   * @param {string} value The font size in the font scheme i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    if (value) {
      this.setAttribute(props.FONT_SIZE, value);
      this.container.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(props.FONT_SIZE);
    this.container.className = '';
    this.container.classList.add('ids-text');
  }

  get fontSize() { return this.getAttribute(props.FONT_SIZE); }

  /**
   * Set the type of object it is (h1-h6, span (default))
   * @param {string} value The font size in the font scheme i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
      this.rerender();
      return;
    }

    this.removeAttribute(props.TYPE);
    this.rerender();
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set `audible` attribute
   * @param {string} value The `audible` attribute
   */
  set audible(value) {
    if (value) {
      this.setAttribute(props.AUDIBLE, value);
      this.rerender();
      return;
    }
    this.removeAttribute(props.AUDIBLE);
    this.rerender();
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }
}

export default IdsText;
