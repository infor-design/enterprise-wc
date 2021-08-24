import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Mixins
import { IdsEventsMixin } from '../../mixins';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Styles
import styles from './ids-menu-group.scss';

// Menu Selection Types
const MENU_GROUP_SELECT_TYPES = [
  'none',
  'single',
  'multiple'
];

/**
 * IDS Menu Group Component
 * @type {IdsMenuGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-menu-group')
@scss(styles)
class IdsMenuGroup extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      attributes.KEEP_OPEN,
      attributes.SELECT
    ];
  }

  template() {
    return `<ul class="ids-menu-group" role="group"><slot></slot></ul>`;
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    this.handleEvents();
    this.refresh();
  }

  /**
   * @returns {void}
   */
  handleEvents() {
    // Listen for `selected` events from child menu items.
    // Single-select groups will force deselection of other items in the group.
    this.onEvent('selected', this, (/** @type {any} */ e) => {
      const item = e.target.closest('ids-menu-item');
      if (this.select === 'single') {
        this.deselectAllExcept(item);
      }
    });
  }

  /**
   * Updates some attributes after changes to the component are made.
   * @private
   * @returns {void}
   */
  refresh() {
    if (this.header?.id) {
      this.setAttribute('aria-labelledby', `${this.header.id}`);
    } else {
      this.removeAttribute('aria-labelledby');
    }
  }

  /**
   * @readonly
   * @returns {HTMLElement} the `IdsMenu` or `IdsPopupMenu` parent node.
   */
  get menu() {
    return this.parentElement;
  }

  /**
   * @readonly
   * @returns {Array<any>} [Array<IdsMenuItem>] all available menu items in this group
   */
  get items() {
    return [...this.children].filter((e) => e.matches('ids-menu-item'));
  }

  /**
   * References all icons that describe menu item contents (ignores dropdown/check icons)
   * @readonly
   * @returns {Array<HTMLElement>} list of items
   */
  get itemIcons() {
    const icons = [];
    this.items.forEach((item) => {
      if (item.iconEl) {
        icons.push(item.iconEl);
      }
    });
    return icons;
  }

  /**
   * Sets/Remove an alignment CSS class
   * @private
   * @returns {void}
   */
  // @TODO: TypeScript Compiler complains about this because the method is actually called from
  // the menu item.
  updateIconAlignment() {
    this.items.forEach((item) => {
      // NOTE: Sometimes the group invokes before the items, making item methods inaccessible.
      // Items run this method internally on their first run.
      if (typeof item.decorateForIcon === 'function') {
        item.decorateForIcon();
      }
    });
  }

  /**
   * Gets this groups descriptive header, if one is defined.
   * @readonly
   * @returns {any} [IdsMenuHeader] containing a menu
   */
  get header() {
    return this.previousElementSibling?.tagName === 'IDS-MENU-HEADER' && this.previousElementSibling;
  }

  /**
   * @returns {string|undefined} containing the type of selection this group allows
   */
  get select() {
    return this.getAttribute(attributes.SELECT);
  }

  /**
   * @param {string|undefined} val the type of selection to set this group
   */
  set select(val) {
    let trueVal = `${val}`;
    if (MENU_GROUP_SELECT_TYPES.indexOf(trueVal) === -1) {
      trueVal = MENU_GROUP_SELECT_TYPES[0];
    }

    // Sync the attribute
    switch (trueVal) {
    case 'none':
      this.removeAttribute(attributes.SELECT);
      break;
    default:
      this.setAttribute(attributes.SELECT, trueVal);
    }

    this.updateSelectability();
  }

  /**
   * @returns {boolean} true if selection of an item within this group should
   * cause the parent menu to close
   */
  get keepOpen() {
    return this.hasAttribute(attributes.KEEP_OPEN);
  }

  /**
   * @param {boolean} val true if the menu should close when an item in this group is selected
   */
  set keepOpen(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    if (trueVal) {
      this.setAttribute(attributes.KEEP_OPEN, `${val}`);
    } else {
      this.removeAttribute(attributes.KEEP_OPEN);
    }
  }

  /**
   * Forces items in the group to re-render the checkmark/checkbox to be in-sync with
   * the group's `select` property.
   * @private
   * @returns {void}
   */
  updateSelectability() {
    this.items.forEach((item) => {
      // NOTE: Sometimes the group invokes before the items, making item methods inaccessible.
      // Items run this method internally on their first run.
      if (typeof item.detectSelectability === 'function') {
        item.detectSelectability();
      }
    });
  }

  /**
   * Causes all menu items except for those provided to become deselected.
   * @param {HTMLElement|Array<HTMLElement>} keptItems a single item or list of items
   * whose selection will be ignored.
   * @returns {void}
   */
  deselectAllExcept(keptItems) {
    const keptItemsArr = [].concat(keptItems);
    this.items.forEach((item) => {
      if (!keptItemsArr.includes(item) && item.selected) {
        item.deselect();
      }
    });
  }
}

export default IdsMenuGroup;
