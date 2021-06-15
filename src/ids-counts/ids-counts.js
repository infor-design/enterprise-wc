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

import IdsText from '../ids-text/ids-text';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

import styles from './ids-counts.scss';

/**
 * IDS Counts Component
 * @type {IdsCounts}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part link - the link element
 */
@customElement('ids-counts')
@scss(styles)
class IdsCounts extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#textProperties();
  }

  #textProperties() {
    this.querySelectorAll('[count-value]').forEach((value) => { value.fontSize = stringUtils.stringToBool(this.compact) ? 40 : 48; });
    this.querySelectorAll('[count-text]').forEach((text) => { text.fontSize = 16; });
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [attributes.COLOR, attributes.COMPACT, attributes.HREF, attributes.MODE, attributes.VERSION];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      ${this.href ? `<ids-hyperlink part="link" text-decoration="none" class="ids-counts message-text" href=${this.href} mode=${this.mode}>` : `<a class="ids-counts" mode=${this.mode}>`}
      <slot></slot>
      ${this.href ? `</ids-hyperlink>` : `</a>`}
    `;
  }

  /**
   * Set the color of the counts
   * @param {string} value The color value. This can be omitted.
   * base (blue), caution, danger, success, warning, or a hex code with the "#"
   */
  set color(value) {
    if (this.href) this.container.setAttribute('color', 'unset');
    const color = value[0] === '#' ? value : `var(--ids-color-status-${value})`;
    this.container.style.color = color;
    this.querySelectorAll('ids-text').forEach((node) => {
      node.color = 'unset';
      node.shadowRoot.querySelector('span').style.color = value;
    });
    this.setAttribute(attributes.COLOR, value);
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  /**
   * Set the compact attribute
   * @param {string | boolean} value true or false. Component will
   * default to regular size if this property is ommitted.
   */
  set compact(value) {
    this.setAttribute(attributes.COMPACT, value === 'true' ? 'true' : 'false');
  }

  get compact() { return this.getAttribute(attributes.COMPACT); }

  /**
   * Set the href attribute
   * @param {string} value The href link
   */
  set href(value) {
    this.setAttribute(attributes.HREF, value);
  }

  get href() { return this.getAttribute(attributes.HREF); }
}

export { IdsCounts };
