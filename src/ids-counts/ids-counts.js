import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import IdsText from '../ids-text/ids-text';

// @ts-ignore
import styles from './ids-counts.scss';

// Boilerplate text for ShadowDOM tags
const textTags = {
  text: '<ids-text font-size="16"><slot name="text"></slot></ids-text>',
  value1: '<ids-text font-size=',
  value2: '><slot name="value"></slot></ids-text>'
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
    return [props.COLOR];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const numSize = () => (this.getAttribute('compact') !== 'false' ? 32 : 40);
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
   * secondary (white), error, success, danger, caution or a hex code with the #
   */
  set color(value) {
    const colors = new Set(['base', 'caution', 'danger', 'success', 'warning']);
    if (value[0] === '#') {
      this.container.style.color = value || '';
      return;
    }
    this.container.style.color = colors.has(value) ? `var(--ids-color-status-${value})` : 'text-azure-60()';
  }
}

export { IdsCounts };
