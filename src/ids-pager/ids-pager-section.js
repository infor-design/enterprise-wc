import {
  IdsElement,
  customElement,
  attributes,
  scss
} from '../ids-base';
import styles from './ids-pager-section.scss';

/**
 * IDS PagerSection Component
 * @type {IdsPagerSection}
 * @inherits IdsElement
 */
@customElement('ids-pager-section')
@scss(styles)
export default class IdsPagerSection extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<slot></slot>`;
  }

  static get attributes() {
    return [attributes.ALIGN];
  }

  /**
   * @type {boolean|string} value whether this section is
   * at the start/left of the pager (e.g. 1/3 or 1/2 sections);
   * position is flipped in RTL mode
   */
  set align(value) {
    if (value !== null) {
      if (value === 'start') {
        this.classList.add('start');
        this.classList.remove('end');
      }

      if (value === 'end') {
        this.classList.add('end');
        this.classList.remove('start');
      }

      if (this.getAttribute(attributes.ALIGN) !== value) {
        this.setAttribute(attributes.ALIGN, value);
      }
    }

    if (value === null) {
      this.classList.remove('start');
      this.classList.remove('end');

      if (this.hasAttribute(attributes.ALIGN)) {
        this.removeAttribute(attributes.ALIGN);
      }
    }
  }
}
