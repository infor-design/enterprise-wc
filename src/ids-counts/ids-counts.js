import {
  IdsElement,
  customElement,
  scss,
  props,
  mix,
  stringUtils
} from '../ids-base/ids-element';

// Import Theme Mixin
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

// @ts-ignore
import IdsText from '../ids-text/ids-text';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

// @ts-ignore
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
  static get properties() {
    return [props.COLOR, props.COMPACT, props.HREF, props.MODE, props.VERSION];
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
    this.setAttribute(props.COLOR, value);
  }

  get color() { return this.getAttribute(props.COLOR); }

  /**
   * Set the compact attribute
   * @param {string | boolean} value true or false. Component will
   * default to regular size if this property is ommitted.
   */
  set compact(value) {
    this.setAttribute(props.COMPACT, value === 'true' ? 'true' : 'false');
  }

  get compact() { return this.getAttribute(props.COMPACT); }

  /**
   * Set the href attribute
   * @param {string} value The href link
   */
  set href(value) {
    this.setAttribute(props.HREF, value);
  }

  get href() { return this.getAttribute(props.HREF); }
}

export { IdsCounts };
