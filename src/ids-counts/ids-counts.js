import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-counts.scss';

// Boilerplate text for ShadowDOM tags
const textTags = {
  text: '<div text><slot name="text"></slot></div>',
  value1: '<div compact=',
  value2: '><slot name="value"></slot></div>'
};

/**
 * IDS Counts Component
 * @type {IdsCounts}
 * @inherits IdsElement
 */
@customElement('ids-counts')
@scss(styles)
class IdsCounts extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.COLOR, props.COMPACT, props.HREF];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const numSize = () => String(this.getAttribute('compact') === 'true');
    const href = this.getAttribute('href');

    return `
      ${href ? `<a class="ids-counts" href=${this.getAttribute('href') || '#'}>` : `<span class="ids-counts">`}
      ${href
      ? `${textTags.value1}${numSize()}${textTags.value2}${textTags.text}`
      : `${textTags.text}${textTags.value1}${numSize()}${textTags.value2}`}
      ${href ? '</a>' : '</span>'}
    `;
  }

  /**
   * Set the color of the tag
   * @param {string} value The color value, this can be not provided,
   * base (blue), caution, danger, success, warning, or a hex code with the "#"
   */
  set color(value) {
    const colors = new Set(['base', 'caution', 'danger', 'success', 'warning']);
    if (value[0] === '#') {
      this.container.style.color = value || '';
      return;
    }
    this.container.style.color = colors.has(value) ? `var(--ids-color-status-${value})` : 'text-azure-60()';
  }

  /**
   * Set the compact attribute
   * @param {string} value true or false. Component will
   * default to regular size if this property is ommitted.
   */
  set compact(value) {
    this.setAttribute('compact', value === 'true' ? 'true' : 'false');
  }

  /**
   * Set the href attribute
   * @param {string} value The href link
   */
  set href(value) {
    this.setAttribute('href', value || '#');
  }
}

export { IdsCounts };
