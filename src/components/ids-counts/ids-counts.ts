import { customElement, scss, } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-count-base';
import '../ids-text/ids-text';
import '../ids-hyperlink/ids-hyperlink';

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
export default class IdsCounts extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#textProperties();
  }

  #textProperties() {
    this.querySelectorAll('[count-value]').forEach((value: any) => { value.fontSize = stringToBool(this.compact) ? 40 : 48; });
    this.querySelectorAll('[count-text]').forEach((text: any) => { text.fontSize = 16; });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR,
      attributes.COMPACT,
      attributes.HREF,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
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
  set color(value: string) {
    if (this.href) this.container.setAttribute('color', '');
    const color = value[0] === '#' ? value : `var(--ids-color-status-${value})`;
    this.container.style.color = color;
    this.querySelectorAll('ids-text').forEach((node: any) => {
      node.color = 'unset';
      node.shadowRoot.querySelector('span').style.color = value;
    });
    this.setAttribute(attributes.COLOR, value);
  }

  get color(): string { return this.getAttribute(attributes.COLOR); }

  /**
   * Set the compact attribute
   * @param {string | boolean} value true or false. Component will
   * default to regular size if this property is ommitted.
   */
  set compact(value: string | boolean) {
    this.setAttribute(attributes.COMPACT, value === 'true' ? 'true' : 'false');
  }

  get compact(): string | boolean { return this.getAttribute(attributes.COMPACT); }

  /**
   * Set the href attribute
   * @param {string} value The href link
   */
  set href(value: string) {
    this.setAttribute(attributes.HREF, value);
  }

  get href(): string { return this.getAttribute(attributes.HREF); }
}
