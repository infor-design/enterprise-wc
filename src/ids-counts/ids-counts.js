import {
  IdsElement,
  customElement,
  scss,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import IdsText from '../ids-text/ids-text';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';

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
   * Template helper function for creating ShadowDOM tags
   * @returns {number} the font size
   */
  get numSize() {
    return this.getAttribute('short') !== 'false' ? 32 : 40;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.COLOR, props.DISABLED];
  }

  /**
   * Template helper function for creating ShadowDOM tags
   * @returns {object} Object containing the outer HTML to be rendered
   */
  generateTags() {
    const disabled = this.getAttribute('disabled') ? ' disabled' : '';
    return {
      openingTag: disabled ? `<span class="ids-counts${disabled}>` : `<a class="ids-counts${disabled}" href=${this.getAttribute('href') || '#'}>`,
      closingTag: disabled ? '</span>' : '</a>',
      innerTags: disabled
        ? `${textTags.text}${textTags.value1}${this.numSize}${textTags.value2}`
        : `${textTags.value1}${this.numSize}${textTags.value2}${textTags.text}`
    };
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const { openingTag, closingTag, innerTags } = this.generateTags();

    return `
      ${openingTag}
      ${innerTags}
      ${closingTag}
    `;
  }

  /**
   * Set the color of the tag
   * @param {string} value The color value, this can be not provided,
   * secondary (white), error, success, danger, caution or a hex code with the #
   */
  set color(value) {
    const prop = value[0] === '#' ? value : `var(--ids-color-status-${value === 'error' ? 'danger' : value})`;
    this.container.style.color = prop || '';
  }

  /**
   * Sets to disabled
   * @param {boolean|string?} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, val.toString());
    } else {
      this.removeAttribute(props.DISABLED);
    }
  }
}

export { IdsCounts };
