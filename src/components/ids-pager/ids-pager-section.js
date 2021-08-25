import {
  IdsElement,
  customElement,
  attributes,
  scss
} from '../../core';
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
   * Indicates whether this section is
   * at the start/left of the pager (e.g. 1/3 or 1/2 sections);
   * position is flipped in RTL mode
   *
   * @type {boolean|string}
   */
  set align(value) {
    switch (value) {
    case 'start':
    case 'end': {
      this.classList[value === 'start' ? 'add' : 'remove']('start');
      this.classList[value === 'start' ? 'remove' : 'add']('end');

      if (this.getAttribute(attributes.ALIGN) !== value) {
        this.setAttribute(attributes.ALIGN, value);
      }
      break;
    }

    default: {
      this.classList.remove('end');
      this.classList.remove('start');

      if (this.hasAttribute(attributes.ALIGN)) {
        this.removeAttribute(attributes.ALIGN);
      }
      break;
    }
    }
  }
}
