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
   * Template helper function for creating ShadowDOM tags
   * @returns {number} the font size
   */
  get numSize() {
    return this.getAttribute('short') ? 32 : 40;
  }

  static get properties() {
    return [props.COLOR];
  }

  /**
   * Template helper function for creating ShadowDOM tags
   * @param {string | boolean} disabled the disabled attribute or false
   * @returns {object} Object containing the outer HTML to be rendered
   */
  generateTags(disabled) {
    return {
      openingTag: disabled ? '<span>' : `<a href=${this.getAttribute('href') || '#'}>`,
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
    const { openingTag, closingTag, innerTags } = this.generateTags(this.getAttribute('disabled') || false);

    return `
      ${openingTag}
      ${innerTags}
      ${closingTag}
    `;
  }
}

export { IdsCounts };
