import {
  IdsElement,
  customElement,
  scss,
  props,
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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.COLOR,
      props.DISABLED,
      props.HREF,
      props.FONT_SIZE,
      props.FONT_WEIGHT,
      props.MODE,
      props.TARGET,
      props.TEXT_DECORATION,
      props.VERSION
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
      this.setAttribute(props.HREF, value);
      this.container.setAttribute(props.HREF, value);
      return;
    }
    this.removeAttribute(props.HREF);
    this.container.removeAttribute(props.HREF);
  }

  get href() { return this.getAttribute(props.HREF); }

  /**
   * Set the link target attribute
   * @param {string} value Set the link's href to some link
   */
  set target(value) {
    if (value) {
      this.setAttribute(props.TARGET, value);
      this.container.setAttribute(props.TARGET, value);
      return;
    }
    this.removeAttribute(props.TARGET);
    this.container.removeAttribute(props.TARGET);
  }

  get target() { return this.getAttribute(props.TARGET); }

  /**
   * Set the link text decoration styling
   * @param {string} value If 'none', removes text decoration, If hover then just on hover it
   * is shown.
   */
  set textDecoration(value) {
    if (value?.toLowerCase() === 'none') {
      this.setAttribute(props.TEXT_DECORATION, value);
      this.container.classList.add('ids-text-decoration-none');
      return;
    }
    if (value?.toLowerCase() === 'hover') {
      this.setAttribute(props.TEXT_DECORATION, value);
      this.container.classList.add('ids-text-decoration-hover');
      return;
    }
    this.removeAttribute(props.TEXT_DECORATION);
    this.container.classList.remove('ids-text-decoration-none');
    this.container.classList.remove('ids-text-decoration-hover');
  }

  get textDecoration() { return this.getAttribute(props.TEXT_DECORATION); }

  /**
   * Set the text to disabled color.
   * @param {boolean} value True if disabled
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, value);
      this.container.setAttribute(props.DISABLED, value);
      this.container.setAttribute('tabindex', '-1');
      return;
    }
    this.removeAttribute(props.DISABLED);
    this.container.removeAttribute(props.DISABLED);
    this.container.removeAttribute('tabindex');
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   *
   * If set to "unset", color can be controlled by parent container
   * @param {string | null} value  "unset" or undefined/null
   */
  set color(value) {
    if (value === 'unset') {
      this.setAttribute(props.COLOR, value);
      this.container.classList.add('ids-hyperlink-color-unset');
    } else {
      this.removeAttribute(props.COLOR);
      this.container.classList.remove('ids-hyperlink-color-unset');
    }
  }

  get color() {
    return this.getAttribute(props.COLOR);
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
    this.container?.classList.remove('bold', 'bolder');

    if (value === 'bold' || value === 'bolder') {
      this.setAttribute(props.FONT_WEIGHT, value);
      this.container?.classList.add(value);
      return;
    }

    this.removeAttribute(props.FONT_WEIGHT);
  }

  get fontWeight() {
    return this.getAttribute(props.FONT_WEIGHT);
  }
}

export default IdsHyperlink;
