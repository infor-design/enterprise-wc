import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsElement from '../../core/ids-element';
import Base from './ids-color-base';

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
export default class IdsColor extends Base {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string>} this component's observable attributes
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MODE,
      attributes.HEX,
      attributes.VERSION
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-color" tabindex="0" part="color">
        <ids-icon class="color-check" icon="check" size="xsmall" part="hex"></ids-icon>
      </div>`;
  }

  /** @param {string} h The hex code color to use */
  set hex(h) {
    this.setAttribute('hex', h.toString());
    this.container.style.backgroundColor = h.toString();
  }

  /** @returns {string} The hex code being used */
  get hex() {
    return this.getAttribute('hex') || '#000000';
  }
}
