import {
  IdsElement,
  customElement,
  scss
} from '../../core';

import IdsDrawer from '../ids-drawer';
import styles from './ids-app-menu.scss';

import '../ids-accordion/ids-accordion';
import '../ids-icon';
import '../ids-text/ids-text';

/**
 * IDS App Menu Component
 * @type {IdsAppMenu}
 * @inherits IdsDrawer
 * @part avatar - the user avatar
 * @part accordion - the accordion root element
 */
@customElement('ids-app-menu')
@scss(styles)
class IdsAppMenu extends IdsDrawer {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.edge = 'start';
    this.type = 'app-menu';
    this.#refreshAccordions();
  }

  static get attributes() {
    return [...super.attributes];
  }

  // Slots:
  // - Avatar
  // - Roles (Accordion)
  // - Header Nav (Toolbar)
  // - Searchfield
  // - Content (Accordion)
  // - Footer Nav (Toolbar)
  template() {
    return `<div class="ids-drawer ids-app-menu type-app-menu">
      <div class="ids-app-menu-user">
        <slot name="avatar"></slot>
        <slot name="username"></slot>
      </div>
      <div class="ids-app-menu-header">
        <slot name="header"></slot>
      </div>
      <div class="ids-app-menu-search">
        <slot name="search"></slot>
      </div>
      <div class="ids-app-menu-content">
        <slot></slot>
      </div>
      <div class="ids-app-menu-footer">
        <slot name="footer"></slot>
      </div>
      <div class="ids-app-menu-branding">
        <ids-icon icon="logo" size="large"></ids-icon>
      </div>
    </div>`;
  }

  #refreshAccordions() {
    const accordions = [...this.querySelectorAll('ids-accordion')];
    accordions.forEach((acc) => {
      acc.colorVariant = 'app-menu';
    });
  }
}

export default IdsAppMenu;
