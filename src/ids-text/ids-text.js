import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-text.scss';

/**
 * IDS Text Component
 * @type {IdsText}
 * @inherits IdsElement
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
    this.shadowRoot?.querySelector('.ids-text')?.remove();
    template.innerHTML = this.template();
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  /**
   * Set the font size/style of the text with a class.
   * @param {string | null} value The font size in the font scheme
   * i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    const elem = this.shadowRoot?.querySelector('span');
    const existingClass = elem?.classList && [...elem.classList].find(
      (c) => /\s?ids-text-[0-9]+(\s|$)/.test(c)
    );

    // @ts-ignore
    elem?.classList.remove(existingClass);

    if (value) {
      this.setAttribute(props.FONT_SIZE, value);
      elem?.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(props.FONT_SIZE);
  }

  get fontSize() { return this.getAttribute(props.FONT_SIZE); }

  /**
   * Set the type of element it is (h1-h6, span (default))
   * @param {string | null} value  The type of element
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
   * Set `audible` string (screen reader only text)
   * @param {string | null} value The `audible` attribute
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
