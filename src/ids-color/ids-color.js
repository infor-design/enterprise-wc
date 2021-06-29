import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base/ids-element';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-color.scss';

/**
 * IDS Color
 * @type {IdsColor}
 * @inherits IdsElement
 * @part color - the color swatch element
 * @part check - the checkbox element
 */
@customElement('ids-color')
@scss(styles)
class IdsColor extends IdsElement {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string>} this component's observable attributes
   */
  static get attributes() {
    return [...attributes.MODE, attributes.HEX, attributes.VERSION];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-color" tabindex="0" part="color">
        <ids-icon class="color-check" icon="check" size="small" part="hex"></ids-icon>
      </div>`;
  }

  /** @param {string} h The hex code color to use */
  set hex(h) {
    this.setAttribute('hex', h.toString());
    this.container.style.backgroundColor = h.toString();
  }

  /** @returns {string} The hex code being used */
  get hex() {
    /* istanbul ignore next */
    return this.getAttribute('hex') || '#000000';
  }
}

export default IdsColor;
