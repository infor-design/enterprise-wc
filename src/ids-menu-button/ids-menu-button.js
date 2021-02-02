import {
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';

// @ts-ignore
import { IdsButton, BUTTON_PROPS } from '../ids-button/ids-button';
// @ts-ignore
import IdsIcon from '../ids-icon/ids-icon';
import IdsPopupMenu from '../ids-popup-menu/ids-popup-menu';

// @ts-ignore
import styles from '../ids-button/ids-button.scss';

// Property names
const MENU_BUTTON_PROPS = [
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
    IdsButton.prototype.connectedCallback.apply(this);
  }

  /**
   * @returns {string[]} containing CSS classes that will be added to the buttons
   */
  get protoClasses() {
    return ['ids-menu-button'];
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
    this.menuEl.popup.arrow = 'bottom';
    this.menuEl.trigger = 'click';
    this.menuEl.target = this;
  }
}

export default IdsMenuButton;
