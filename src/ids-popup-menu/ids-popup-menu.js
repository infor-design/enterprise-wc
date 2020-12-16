import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';

import IdsMenu from '../ids-menu/ids-menu';
import IdsPopup from '../ids-popup/ids-popup';

import styles from './ids-popup-menu.scss';

/**
 * IDS PopupMenu Component
 */
@customElement('ids-popup-menu')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsPopupMenu extends IdsMenu {
  constructor() {
    super();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const hasIconsClass = this.itemIcons.length ? ' has-icons' : '';

    return `<ids-popup class="ids-popup-menu" type="menu">
      <nav class="ids-menu${hasIconsClass}" role="menu" slot="content">
        <slot></slot>
      </nav>
    </ids-popup>`;
  }

  /**
   * @returns {void}
   */
  connectedCallBack() {
    IdsMenu.prototype.connectedCallBack.apply(this);
  }

  /**
   * Sets up event handlers used in this menu.
   * @private
   * @returns {void}
   */
  handleEvents() {
    IdsMenu.prototype.handleEvents.apply(this);

    this.eventHandlers.addEventListener('selected', this, () => {
      this.hide();
    });
  }

  /**
   * @readonly
   * @returns {IdsPopup} reference to the inner Popup component
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * Hides this menu and any of its submenus.
   * @returns {void}
   */
  hide() {
    this.hidden = true;
    this.container.classList.remove('is-expanded');

    // Hide the Ids Popup
    this.popup.visible = false;

    // Hide all submenus
    this.hideSubmenus();
  }

  /**
   * @returns {void}
   */
  show() {
    this.hidden = false;
    this.container.classList.add('is-expanded');

    // @TODO change this logic if Popup accepts HTMLElement
    if (this.parentMenuItem && !this.popup.alignTarget) {
      this.popup.alignTarget = this.parentMenuItem;
      this.popup.align = 'right, top';
    }

    // Hide any "open" submenus (in the event the menu is already open and being positioned)
    this.hideSubmenus();

    // Show this popup
    this.popup.visible = true;
  }

  /**
   * Hides any "open" submenus within this menu structure
   * @returns {void}
   */
  hideSubmenus() {
    const submenus = this.submenus;
    if (submenus) {
      submenus.forEach((submenu) => {
        if (!submenu.hidden) {
          submenu.hide();
        }
      });
    }
  }
}

export default IdsPopupMenu;
