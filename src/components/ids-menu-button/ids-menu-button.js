import {
  customElement,
  scss,
  attributes
} from '../../core';

// Import Utils
import { IdsStringUtils, IdsDOMUtils } from '../../utils';

// Import Dependencies
import { IdsButton } from '../ids-button';
import IdsIcon from '../ids-icon';
import IdsPopupMenu from '../ids-popup-menu';

// Import Styles
import styles from '../ids-button/ids-button.scss';

/**
 * IDS Menu Button Component
 * @type {IdsMenuButton}
 * @inherits IdsButton
 */
@customElement('ids-menu-button')
@scss(styles)
class IdsMenuButton extends IdsButton {
  constructor() {
    super();
  }

  /**
   * @returns {Array} containing configurable attributes on this component
   */
  static get attributes() {
    return [
      ...super.attributes,
      'formatter-width',
      attributes.DROPDOWN_ICON,
      attributes.ID,
      attributes.MENU
    ];
  }

  /**
   * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
   * @returns {void}
   */
  connectedCallback() {
    this.configureMenu();
    this.attachEventHandlers();
    IdsButton.prototype.connectedCallback.apply(this);
  }

  /**
   * @returns {void}
   */
  attachEventHandlers() {
    IdsButton.prototype.attachEventHandlers.apply(this);
  }

  /**
   * @returns {string[]} containing CSS classes that will be added to the buttons
   */
  get protoClasses() {
    const textSlot = this.querySelector('span:not(.audible), ids-text:not(.audible)');
    const iconSlot = this.querySelector('ids-icon[slot]')
      || this.querySelector('ids-icon');
    if (iconSlot && (!textSlot)) {
      return ['ids-menu-button', 'ids-icon-button'];
    }
    return ['ids-menu-button'];
  }

  /**
   * @param {string|undefined} val referencing an icon string name to use
   */
  set dropdownIcon(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
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
    this.setPopupArrow();
  }

  /**
   * @returns {string|undefined} containing the type of icon being displayed as the Dropdown Icon
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
   * @returns {string|null} an ID selector string matching a menu
   */
  get menu() {
    return this.getAttribute('menu');
  }

  /**
   * @param {string|null} val an ID selector string
   */
  set menu(val) {
    this.setAttribute('menu', `${val}`);
    this.configureMenu();
  }

  /**
   * @readonly
   * @returns {IdsPopupMenu | null} element if one is present
   */
  get menuEl() {
    // Check for a Shadow Root parent.
    // If none, use `document`
    const target = IdsDOMUtils.getClosestRootNode(this);
    return target.querySelector(`ids-popup-menu[id="${this.menu}"]`) || target.querySelector(`ids-action-sheet[id="${this.menu}"]`);
  }

  /**
   * @returns {void}
   */
  configureMenu() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.resizeMenu();
    this.setPopupArrow();
    this.menuEl.trigger = 'click';
    this.menuEl.target = this;

    // ====================================================================
    // Setup menu-specific event listeners, if they aren't already applied

    const hasBeforeShow = this?.handledEvents?.get('beforeshow');
    if (!hasBeforeShow) {
      // On the Popup Menu's `beforeshow` event, set the menu's size to the Menu Button's
      this.onEvent('beforeshow', this.menuEl, () => {
        this.resizeMenu();
      });
    }
  }

  /**
   * @returns {void}
   */
  resizeMenu() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.menuEl.popup.container.style.minWidth = `${this.button.clientWidth}px`;
  }

  /**
   * @returns {void}
   */
  setPopupArrow() {
    if (!this.menuEl || !this.menuEl.popup) {
      return;
    }
    this.menuEl.popup.arrowTarget = this.dropdownIconEl || this;
    this.menuEl.popup.arrow = 'bottom';
  }

  /**
   * Set the formatter width for menu button
   * @param {string | number} value The formatter width value
   */
  set formatterWidth(value) {
    let val = null;
    if (typeof value === 'number' && !Number.isNaN(value)) {
      val = `${value}px`;
    } else if (typeof value === 'string') {
      const last = parseInt(value.slice(-1), 10);
      if ((typeof last === 'number' && !Number.isNaN(last))) {
        val = `${value}px`;
      } else if (/(px|em|vw|vh|ch|%)$/g.test(value) && !Number.isNaN(parseInt(value, 10))) {
        this.container.classList[/%$/g.test(value) ? 'add' : 'remove']('formatter-width-percentage');
        val = value;
      }
    }
    const FORMATTER_WIDTH = 'formatter-width';
    if (val) {
      this.setAttribute(FORMATTER_WIDTH, value);
      this.container.classList.add(FORMATTER_WIDTH);
      this.container.style.minWidth = val;
    } else {
      this.removeAttribute(FORMATTER_WIDTH);
      this.container.classList.remove(FORMATTER_WIDTH);
      this.container.style.minWidth = '';
    }
  }
}

export default IdsMenuButton;
