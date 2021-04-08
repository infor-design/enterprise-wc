import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-text.scss';

const CSSClassRegexps = {
  FONT_SIZE: /^ids-text-[0-9]+$/,
  FONT_WEIGHT: /^(?:normal|bold|bolder)$/
};

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
    return [
      props.TYPE,
      props.FONT_SIZE,
      props.FONT_WEIGHT,
      props.AUDIBLE,
      'overflow'
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const tag = this.type || 'span';
    let classList = 'ids-text';
    classList += (this.overflow === 'ellipsis') ? ' ellipsis' : '';
    classList += this.audible ? ' audible' : '';
    classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';

    // @ts-ignore
    switch (this.fontWeight) {
    case 'bold':
    case 'bolder': {
      classList += ` ${this.fontWeight}`;
      break;
    }
    default: {
      break;
    }
    }

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
      (c) => CSSClassRegexps.FONT_SIZE.test(c)
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
   * Adjust font weight; can be either "normal", "bold" or "bolder"
   * @param {string} [value='normal'] font weight
   */
  set fontWeight(value) {
    let hasValue = false;

    switch (value) {
    case 'bold':
    case 'bolder':
      hasValue = true;
      break;
    default:
      break;
    }
    const elem = this.shadowRoot?.querySelector('span');

    const existingClass = elem?.classList && [...elem.classList].find(
      (c) => CSSClassRegexps.FONT_WEIGHT.test(c)
    );

    // @ts-ignore
    elem?.classList.remove(existingClass);

    if (hasValue) {
      this.setAttribute(props.FONT_WEIGHT, value || 'normal');
      // @ts-ignore
      elem?.classList.add(value);
      return;
    }

    this.removeAttribute(props.FONT_WEIGHT);
  }

  get fontWeight() {
    return this.getAttribute(props.FONT_WEIGHT) || 'normal';
  }

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
      return;
    }
    this.removeAttribute(props.AUDIBLE);
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }

  get overflow() {
    return this.getAttribute('overflow') || 'ellipsis';
  }

  /**
   * Set how content overflows; can specify 'ellipsis' or 'clip'
   * @param {string} [value='ellipsis'] how content is overflow
   */
  set overflow(value) {
    const elem = this.shadowRoot?.querySelector('span');
    this.setAttribute('overflow', value || 'ellipsis');

    if (value === 'none' || value === 'clip') {
      elem?.classList.remove('ellipsis');
    } else if (!elem?.classList.contains('ellipsis')) {
      elem?.classList.add('ellipsis');
    }
  }
}

export default IdsText;
