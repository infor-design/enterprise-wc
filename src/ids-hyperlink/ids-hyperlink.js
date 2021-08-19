import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix,
  stringUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-hyperlink.scss';

const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 60, 72];

/**
 * IDS Hyperlink Component
 * @type {IdsHyperlink}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part link - the link element
 */
@customElement('ids-hyperlink')
@scss(styles)
class IdsHyperlink extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!(this.getAttribute('role'))) this.setAttribute('role', 'link');
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR,
      attributes.DISABLED,
      attributes.HREF,
      attributes.FONT_SIZE,
      attributes.FONT_WEIGHT,
      attributes.MODE,
      attributes.TARGET,
      attributes.TEXT_DECORATION,
      attributes.VERSION
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<a class="ids-hyperlink" part="link"><slot></slot></a>`;
  }

  /**
   * Set the link href
   * @param {string} value Set the link's href to some link
   */
  set href(value) {
    if (value) {
      this.setAttribute(attributes.HREF, value);
      this.container.setAttribute(attributes.HREF, value);
      return;
    }
    this.removeAttribute(attributes.HREF);
    this.container.removeAttribute(attributes.HREF);
  }

  get href() { return this.getAttribute(attributes.HREF); }

  /**
   * Set the link target attribute
   * @param {string} value Set the link's href to some link
   */
  set target(value) {
    if (value) {
      this.setAttribute(attributes.TARGET, value);
      this.container.setAttribute(attributes.TARGET, value);
      return;
    }
    this.removeAttribute(attributes.TARGET);
    this.container.removeAttribute(attributes.TARGET);
  }

  get target() { return this.getAttribute(attributes.TARGET); }

  /**
   * Set the link text decoration styling
   * @param {string} value If 'none', removes text decoration, If hover then just on hover it
   * is shown.
   */
  set textDecoration(value) {
    if (value?.toLowerCase() === 'none') {
      this.setAttribute(attributes.TEXT_DECORATION, value);
      this.container.classList.add('ids-text-decoration-none');
      return;
    }
    if (value?.toLowerCase() === 'hover') {
      this.setAttribute(attributes.TEXT_DECORATION, value);
      this.container.classList.add('ids-text-decoration-hover');
      return;
    }
    this.removeAttribute(attributes.TEXT_DECORATION);
    this.container.classList.remove('ids-text-decoration-none');
    this.container.classList.remove('ids-text-decoration-hover');
  }

  get textDecoration() { return this.getAttribute(attributes.TEXT_DECORATION); }

  /**
   * Set the text to disabled color.
   * @param {boolean} value True if disabled
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, value);
      this.container.setAttribute(attributes.DISABLED, value);
      this.container.setAttribute('tabindex', '-1');
      return;
    }
    this.removeAttribute(attributes.DISABLED);
    this.container.removeAttribute(attributes.DISABLED);
    this.container.removeAttribute('tabindex');
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   *
   * If set to "unset", color can be controlled by parent container
   * @param {string | null} value  "unset" or undefined/null
   */
  set color(value) {
    if (value === 'unset') {
      this.setAttribute(attributes.COLOR, value);
      this.container.classList.add('ids-hyperlink-color-unset');
    } else {
      this.removeAttribute(attributes.COLOR);
      this.container.classList.remove('ids-hyperlink-color-unset');
    }
  }

  get color() {
    return this.getAttribute(attributes.COLOR);
  }

  /**
   * Set the font size/style of the text with a class.
   * @param {string | null} value The font size in the font scheme
   * i.e. 10, 12, 16 or xs, sm, base, lg, xl
   */
  set fontSize(value) {
    fontSizes.forEach((size) => this.container?.classList.remove(`ids-text-${size}`));

    if (value) {
      this.setAttribute(attributes.FONT_SIZE, value);
      this.container?.classList.add(`ids-text-${value}`);
      return;
    }

    this.removeAttribute(attributes.FONT_SIZE);
  }

  get fontSize() { return this.getAttribute(attributes.FONT_SIZE); }

  /**
   * Adjust font weight; can be either "bold" "lighter" or not present
   * since font supports 300, 400, 600
   * @param {string | null} value (if bold)
   */
  set fontWeight(value) {
    this.container?.classList.remove('bold', 'lighter');

    if (value === 'bold' || value === 'lighter') {
      this.setAttribute(attributes.FONT_WEIGHT, value);
      this.container?.classList.add(value);
      return;
    }

    this.removeAttribute(attributes.FONT_WEIGHT);
  }

  get fontWeight() {
    return this.getAttribute(attributes.FONT_WEIGHT);
  }
}

export default IdsHyperlink;
