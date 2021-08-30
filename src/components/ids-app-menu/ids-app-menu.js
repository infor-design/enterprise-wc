import {
  IdsElement,
  customElement,
  mix,
  scss
} from '../../core';
import { IdsKeyboardMixin } from '../../mixins';
import { IdsDOMUtils } from '../../utils';
import IdsDrawer from '../ids-drawer';
import styles from './ids-app-menu.scss';

// Supporting Components
import '../ids-accordion';
import '../ids-button';
import '../ids-icon';
import '../ids-text';
import '../ids-toolbar';

/**
 * IDS App Menu Component
 * @type {IdsAppMenu}
 * @inherits IdsDrawer
 * @part avatar - the user avatar
 * @part accordion - the accordion root element
 */
@customElement('ids-app-menu')
@scss(styles)
class IdsAppMenu extends mix(IdsDrawer).with(IdsKeyboardMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.edge = 'start';
    this.type = 'app-menu';
    this.#refreshVariants();
    this.#handleKeys();
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

  #refreshVariants() {
    const accordions = [...this.querySelectorAll('ids-accordion')];
    accordions.forEach((acc) => {
      acc.colorVariant = 'app-menu';
    });

    const btns = [...this.querySelectorAll('ids-button')];
    btns.forEach((btn) => {
      btn.colorVariant = 'alternate';
    });
  }

  /**
   * Sets up app-menu level keystrokes
   * @returns {void}
   */
  #handleKeys() {
    // If the escape key is pressed while an element
    // inside the App Menu is focused, close the App Menu.
    this.listen(['Escape'], this, (e) => {
      if (IdsDOMUtils.getClosest(e.target, 'ids-app-menu').isEqualNode(this) && this.visible) {
        this.hide();
      }
    });
  }
}

export default IdsAppMenu;
