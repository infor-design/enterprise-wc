import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

import styles from './ids-menu-group.scss';

/**
 * IDS Menu Group Component
 */
@customElement('ids-menu-group')
@scss(styles)
class IdsMenuGroup extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.refresh();
  }

  template() {
    let describedBy = '';
    if (this.header?.id) {
      describedBy = ` aria-labelledby="${this.header.id}"`;
    }

    return `<ul class="ids-menu-group" role="group" ${describedBy}><slot></slot></ul>`;
  }

  refresh() {
    if (this.header?.id) {
      this.container.setAttribute('aria-labelledby', `${this.header.id}`);
    } else {
      this.container.removeAttribute('aria-labelledby');
    }
  }

  /**
   * @readonly
   * @returns {Array<HTMLElement>} all available menu items in this group
   */
  get items() {
    return Array.from(this.querySelectorAll('ids-menu-item, .ids-menu-item'));
  }

  /**
   * Gets this groups descriptive header, if one is defined.
   * @returns {HTMLElement} containing a menu
   */
  get header() {
    const inlineHeader = this.querySelector('ids-menu-header');
    const preceedingHeader = this.previousElementSibling?.tagName === 'IDS-MENU-HEADER' && this.previousElementSibling;
    return inlineHeader || preceedingHeader;
  }
}

export default IdsMenuGroup;
