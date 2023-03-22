import { customElement, scss, } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-text/ids-text';
import '../ids-hyperlink/ids-hyperlink';

import styles from './ids-counts.scss';
import type IdsText from '../ids-text/ids-text';

/**
 * IDS Counts Component
 * @type {IdsCounts}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part link - the link element
 */
@customElement('ids-counts')
@scss(styles)
export default class IdsCounts extends IdsEventsMixin(IdsElement) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#textProperties();
    if (this.color) this.color = this.getAttribute(attributes.COLOR);
  }

  #textProperties() {
    this.querySelectorAll<IdsText>('[count-value]').forEach((value) => { value.setAttribute(attributes.FONT_SIZE, this.compact ? '40' : '48'); });
    this.querySelectorAll<IdsText>('[count-text]').forEach((text) => { text.setAttribute(attributes.FONT_SIZE, '16'); });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR,
      attributes.COMPACT,
      attributes.HREF
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      ${this.href ? `<ids-hyperlink part="link" text-decoration="none" class="ids-counts message-text" href=${this.href}>` : `<a class="ids-counts">`}
      <slot></slot>
      ${this.href ? `</ids-hyperlink>` : `</a>`}
    `;
  }

  /**
   * Set the color of the counts
   * @param {string} value The color value. This can be omitted.
   * base (blue), caution, danger, success, warning, or a hex code with the "#"
   */
  set color(value: string | null) {
    if (this.href) this.container?.setAttribute('color', '');

    if (value) {
      const color = value[0] === '#' ? value : `var(--ids-color-status-${value})`;
      this.container?.style.setProperty('color', color);
      this.setAttribute(attributes.COLOR, value);
    } else {
      this.container?.style.removeProperty('color');
      this.removeAttribute(attributes.COLOR);
    }

    this.querySelectorAll<IdsText>('ids-text').forEach((node) => {
      node.color = 'unset';
      node.shadowRoot?.querySelector('span')?.style.setProperty('color', value);
    });
  }

  get color(): string | null { return this.getAttribute(attributes.COLOR); }

  /**
   * Set the compact attribute
   * @param {string | boolean} value true or false. Component will
   * default to regular size if this property is ommitted.
   */
  set compact(value: string | boolean) {
    this.setAttribute(attributes.COMPACT, stringToBool(value) ? 'true' : 'false');
  }

  get compact(): boolean {
    return stringToBool(this.getAttribute(attributes.COMPACT));
  }

  /**
   * Set the href attribute
   * @param {string} value The href link
   */
  set href(value: string | null) {
    if (value) {
      this.setAttribute(attributes.HREF, value);
    } else {
      this.removeAttribute(attributes.HREF);
    }
  }

  get href(): string | null { return this.getAttribute(attributes.HREF); }
}
