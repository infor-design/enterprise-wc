import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base/ids-element';

// Import Mixins
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

// @ts-ignore
import styles from './ids-text.scss';

/**
 * IDS Text Component
 * @type {IdsText}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part text - the text element
 */
@customElement('ids-text')
@scss(styles)
class IdsText extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TYPE, props.FONT_SIZE, props.AUDIBLE, props.MODE, props.VERSION];
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

    return `<${tag}${classList} mode="${this.mode}" version="${this.version}" part="text"><slot></slot></${tag}>`;
  }

  /**
   * Rerender the component template
   * @private
   */
  rerender() {
    const template = document.createElement('template');
    this.shadowRoot?.querySelector('.ids-text')?.remove();
    template.innerHTML = this.template();
    const elem = template.content.cloneNode(true);
    this.shadowRoot?.appendChild(elem);
    this.container = this.shadowRoot?.querySelector('.ids-text');
  }

  /**
   * Set the font size/style of the text with a class.
   * @param {string | null} value The font size in the font scheme
   * i.e. 10, 12, 16 or xs, sm, base, lg, xl
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
   * The text to audible (screen reader only)
   * @param {boolean} value True if audible
   */
  set audible(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.AUDIBLE, value);
      this.container.classList.add('audible');
      return;
    }
    this.removeAttribute(props.AUDIBLE);
    this.container.classList.remove('audible');
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }
}

export default IdsText;
