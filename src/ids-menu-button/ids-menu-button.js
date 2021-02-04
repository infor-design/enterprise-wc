import {
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';

// @ts-ignore
import { IdsButton, BUTTON_PROPS } from '../ids-button/ids-button';
import { IdsDomUtilsMixin as domUtils } from '../ids-base/ids-dom-utils-mixin';

import IdsIcon from '../ids-icon/ids-icon';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

// @ts-ignore
import styles from '../ids-button/ids-button.scss';

// Property names
const MENU_BUTTON_PROPS = [
  'dropdown-icon',
  props.ID,
  props.MENU
];

/**
 * IDS Toggle Button Component
 */
@customElement('ids-menu-button')
@scss(styles)
class IdsMenuButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * @returns {Array} containing configurable properties on this component
   */
  static get properties() {
    return BUTTON_PROPS.concat(MENU_BUTTON_PROPS);
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    this.configureMenu();
    this.handleEvents();
    IdsButton.prototype.connectedCallback.apply(this);
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    IdsButton.prototype.handleEvents.apply(this);

    // On the Popup Menu's `beforeshow` event, set the menu's size to the Menu Button's
    this.eventHandlers.addEventListener('beforeshow', this.menuEl, () => {
      this.resizeMenu();
    });
  }

  /**
   * @returns {string[]} containing CSS classes that will be added to the buttons
   */
  get protoClasses() {
    return ['ids-menu-button'];
  }

  /**
   * @param {string} val referencing an icon string name to use
   */
  set dropdownIcon(val) {
    const trueVal = domUtils.isTrueBooleanAttribute(val);
    const iconName = (typeof val === 'string' && val.length) ? `${val}` : 'dropdown';
    const icon = this.dropdownIconEl;
    if (trueVal) {
      if (!icon) {
        this.container.insertAdjacentHTML('beforeend', `<ids-icon icon="${iconName}" class="ids-icon dropdown-icon"></ids-icon>`);
      } else {
        icon.icon = iconName;
      }
    } else if (icon) {
      icon.remove();
    }
  }

  /**
   * @returns {string} containing the type of icon being displayed as the Dropdown Icon
   */
  get dropdownIcon() {
    return this.dropdownIconEl?.icon;
  }

  /**
   * @returns {IdsIcon|null} the decorative dropdown icon element
   */
  get dropdownIconEl() {
    return this.container.querySelector('ids-icon:not([slot])');
  }

  /**
   * @returns {string} an ID selector string matching a menu
   */
  get menu() {
    return this.getAttribute('menu');
  }

  /**
   * @param {string} val an ID selector string
   */
  set menu(val) {
    this.setAttribute('menu', `${val}`);
    this.configureMenu();
  }

  /**
   * @readonly
   * @returns {IdsPopupMenu} element if one is present
   */
  get menuEl() {
    return this.parentElement.querySelector(`ids-popup-menu[id="${this.menu}"]`);
  }

  /**
   * @returns {void}
   */
  configureMenu() {
    this.resizeMenu();
    this.menuEl.popup.arrowTarget = this.dropdownIconEl || this;
    this.menuEl.popup.arrow = 'bottom';
    this.menuEl.trigger = 'click';
    this.menuEl.target = this;
  }

  /**
   * @returns {void}
   */
  resizeMenu() {
    this.menuEl.popup.container.style.minWidth = `${this.button.clientWidth}px`;
  }
}

export default IdsMenuButton;
