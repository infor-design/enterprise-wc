import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsMenuHeader from './ids-menu-header';
import IdsMenuItem from './ids-menu-item';
import IdsElement from '../../core/ids-element';

import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { MENU_GROUP_SELECT_TYPES } from './ids-menu-attributes';

import styles from './ids-menu-group.scss';

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Menu Group Component
 * @type {IdsMenuGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-menu-group')
@scss(styles)
export default class IdsMenuGroup extends Base {
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
    return `<div class="ids-menu-group" role="none"><slot></slot></div>`;
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.setAttribute(htmlAttributes.ROLE, 'group');
    this.refresh();
  }

  /**
   * @returns {void}
   */
  #attachEventHandlers() {
    // Listen for `selected` events from child menu items.
    // Single-select groups will force deselection of other items in the group.
    this.onEvent('selected', this, (e: any) => {
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
    const header = this.header;
    if (header) {
      if (this.header?.id) {
        this.setAttribute(htmlAttributes.ARIA_LABELLED_BY, `${this.header.id}`);
        this.removeAttribute(htmlAttributes.ARIA_LABEL);
      } else {
        this.setAttribute(htmlAttributes.ARIA_LABEL, `${this.header?.textContent}`);
        this.removeAttribute(htmlAttributes.ARIA_LABELLED_BY);
      }
    } else {
      this.setAttribute(htmlAttributes.ARIA_LABEL, this.#getGeneratedLabel());
      this.removeAttribute(htmlAttributes.ARIA_LABELLED_BY);
    }
  }

  #getGeneratedLabel() {
    const str = this.localeAPI?.translate('MenuGroup') || '';
    return str.replace('{0}', this.items.length);
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
   * @returns {Array<IdsMenuItem>} [Array<IdsMenuItem>] all available menu items in this group
   */
  get items(): Array<IdsMenuItem> {
    return [...this.children].filter((e) => e.matches('ids-menu-item')) as Array<IdsMenuItem>;
  }

  /**
   * Sets/Remove an alignment CSS class
   * @private
   * @returns {void}
   */
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
  get header(): IdsMenuHeader | null {
    const prevHeader = this.previousElementSibling;
    if (prevHeader && prevHeader instanceof IdsMenuHeader) return prevHeader;
    return this.querySelector<IdsMenuHeader>('ids-menu-header');
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
    const trueVal = stringToBool(val);
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
  deselectAllExcept(keptItems: any) {
    const keptItemsArr: any = [].concat(keptItems);
    this.items.forEach((item: any) => {
      if (!keptItemsArr.includes(item) && item.selected) {
        item.deselect();
      }
    });
  }
}
