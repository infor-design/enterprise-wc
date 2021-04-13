import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';
import { IdsStringUtils } from '../ids-base/ids-string-utils';

// @ts-ignore
import styles from './ids-text.scss';

const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 60, 72];
const fontWeightClasses = ['bold', 'bolder'];

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
    classList += ((this.audible) || (this.audible === '')) ? ' audible' : '';
    classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';
    classList += (this.fontWeight === 'bold' || this.fontWeight === 'bolder')
      ? ` ${this.fontWeight}` : '';

    return `<${tag} class="${classList}"><slot></slot></${tag}>`;
  }

  /**
   * Set the font size/style of the text with a class.
   * @param {string | null} value The font size in the font scheme
   * i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    fontSizes.forEach((size) => this.container?.classList.remove(`ids-text-${size}`));

    if (value) {
      this.setAttribute(props.FONT_SIZE, value);
      this.container?.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(props.FONT_SIZE);
  }

  get fontSize() { return this.getAttribute(props.FONT_SIZE); }

  /**
   * Adjust font weight; can be either "bold" or "bolder"
   * @param {string | null} value (if bold)
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

    this.container?.classList.remove(...fontWeightClasses);

    if (hasValue) {
      // @ts-ignore
      this.setAttribute(props.FONT_WEIGHT, value);
      // @ts-ignore
      this.container?.classList.add(value);
      return;
    }

    this.removeAttribute(props.FONT_WEIGHT);
  }

  get fontWeight() {
    return this.getAttribute(props.FONT_WEIGHT);
  }

  /**
   * Set the type of element it is (h1-h6, span (default))
   * @param {string | null} value  The type of element
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
    } else {
      this.removeAttribute(props.TYPE);
    }

    this.render();
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set `audible` string (screen reader only text)
   * @param {string | null} value The `audible` attribute
   */
  set audible(value) {
    const isValueTruthy = IdsStringUtils.stringToBool(value);

    if (isValueTruthy && this.container && !this.container?.classList.contains('audible')) {
      this.container.classList.add('audible');
      // @ts-ignore
      this.setAttribute(props.AUDIBLE, value);
    }

    if (!isValueTruthy && this.container?.classList.contains('audible')) {
      this.container.classList.remove('audible');
      this.removeAttribute(props.AUDIBLE);
    }
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }

  get overflow() {
    return this.getAttribute('overflow');
  }

  /**
   * Set how content overflows; can specify 'ellipsis', or undefined/'none'
   * @param {string | null} [value=null] how content is overflow
   */
  set overflow(value) {
    const isEllipsis = value === 'ellipsis';

    if (isEllipsis) {
      this.container?.classList.add('ellipsis');
      this.setAttribute('overflow', 'ellipsis');
    } else {
      this.container?.classList.remove('ellipsis');
      this.removeAttribute('overflow');
    }
  }
}

export default IdsText;
