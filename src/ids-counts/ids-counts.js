import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base/ids-element';

// Import Theme Mixin
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

// @ts-ignore
import IdsText from '../ids-text/ids-text';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';

// @ts-ignore
import styles from './ids-counts.scss';

// Boilerplate text for ShadowDOM tags
const textTags = {
  text: '<ids-text class="message-text"><slot name="text"></slot></ids-text>',
  value1: '<ids-text class="message-text" font-size=',
  value2: '><slot name="value"></slot></ids-text>'
};

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
    const numSize = () => String(this.getAttribute('compact') === 'true' ? 32 : 40);
    const href = this.getAttribute('href');

    return `
      ${href ? `<ids-hyperlink part="link" class="ids-counts message-text" href=${href || '#'} mode=${this.mode}>` : `<a class="ids-counts" mode=${this.mode}>`}
      ${textTags.value1}${numSize()}${textTags.value2}${textTags.text}
      ${href ? `</ids-hyperlink>` : `</a>`}
    `;
  }

  /**
   * Set the color of the tag
   * @param {string} value The color value. This can be omitted.
   * base (blue), caution, danger, success, warning, or a hex code with the "#"
   */
  set color(value) {
    const colors = new Set(['base', 'caution', 'danger', 'success', 'warning']);
    if (value[0] === '#') {
      this.container.style.color = value;
      this.setAttribute(props.COLOR, value);
      return;
    }
    const color = colors.has(value) ? `var(--ids-color-status-${value})` : '';
    this.container.style.color = color;
    this.setAttribute(props.COLOR, color);
  }

  get color() { return this.getAttribute(props.COLOR); }

  /**
   * Set the compact attribute
   * @param {string} value true or false. Component will
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
    this.setAttribute(props.HREF, value || '#');
  }

  get href() { return this.getAttribute(props.HREF); }
}

export { IdsCounts };
