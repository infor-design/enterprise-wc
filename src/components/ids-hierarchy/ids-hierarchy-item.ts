import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import Base from './ids-hierarchy-item-base';

import styles from './ids-hierarchy-item.scss';

/**
 * IDS Hierarchy Item Component
 * @type {IdsHierarchyItem}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-hierarchy-item')
@scss(styles)
export default class IdsHierarchyItem extends Base {
  /** store the previous "selected" value to prevent double firing events */
  #prevSelected = false;

  constructor() {
    super();
    this.expander = this.shadowRoot?.querySelector('[part="icon-btn"]');
    this.dropdownMenu = this.querySelector('[part="icon-menu"]');
    this.leaf = this.shadowRoot?.querySelector('[part="leaf"]');
    this.nestedItemContainer = this.shadowRoot?.querySelector('[part="nested-items"]');
  }

  /**
   * ids-hierarchy-item `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.#prevSelected = false;
    this.#hasNestedItems();
    this.#attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR,
      attributes.EXPANDED,
      attributes.ROOT_ITEM,
      attributes.SELECTED
    ];
  }

  template(): string {
    return `
      <div class="ids-hierarchy-item">
        <div class="leaf" part="leaf">
          <div class="leaf-inside">
            <span class="avatar">
              <slot name="avatar"></slot>
            </span>
            <div class="details">
              <slot name="heading"></slot>
              <slot name="subheading"></slot>
              <slot name="micro"></slot>
            </div>
            <div part="actions">
              <slot name="menu"></slot>
              <ids-button part="icon-btn" id="icon-only-button-default">
                <span class="audible">Default Button</span>
                <ids-icon slot="icon" icon="caret-down"></ids-icon>
              </ids-button>
            </div>
          </div>
        </div>
        <div class="sub-level"><slot part="nested-items"></slot></div>
      </div>
    `;
  }

  /**
   * Set the value of the expanded attribute
   * @param {string | null} value the value of the attribute
   */
  set expanded(value: string | null) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.EXPANDED, true);
    } else {
      this.removeAttribute?.(attributes.EXPANDED);
    }
  }

  /**
   * @returns {string | null} containing value of the expanded attribute
   */
  get expanded(): string | null {
    return this.getAttribute(attributes.EXPANDED);
  }

  /**
   * Set the value of the selected attribute
   * @param {string | boolean} value the value of the attribute
   */
  set selected(value: string | boolean) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.SELECTED, true);
      this.setAttribute('tabindex', '0');
      if (!this.#prevSelected) {
        this.triggerEvent('itemselect', this, { bubbles: true });
      }
    } else {
      this.removeAttribute(attributes.SELECTED);
      this.setAttribute('tabindex', '-1');
    }

    this.#prevSelected = isValueTruthy;
  }

  /**
   * @returns {string | boolean} containing value of the selected attribute
   */
  get selected(): string | boolean {
    return this.hasAttribute(attributes.SELECTED);
  }

  /**
   * Set the value of the root attribute
   * @param {string | null} value the value of the attribute
   */
  set rootItem(value: string | null) {
    const isValueTruthy = stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.ROOT_ITEM, true);
    } else {
      this.removeAttribute(attributes.ROOT_ITEM);
    }
  }

  /**
   * @returns {string | null} containing value of the root attribute
   */
  get rootItem(): string | null {
    return this.getAttribute(attributes.ROOT_ITEM);
  }

  get color(): string {
    return this.getAttribute(attributes.COLOR);
  }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value: string) {
    this.setAttribute(attributes.COLOR, value);

    let color = value;
    if (this.color.substring(0, 1) !== '#') {
      color = `var(--ids-color-palette-${this.color})`;
    }

    const item = this.container.querySelector('.leaf-inside');
    const avatar = this.container.querySelector('.avatar');
    item.style.borderLeftColor = color;
    avatar.style.borderColor = color;
  }

  /**
   * Sets the value of the expanded attribute
   * @private
   * @param {string} expanded the value of the expanded attribute.
   * @returns {void}
   */
  #expandCollapse(expanded: string | null) {
    if (expanded) {
      this.setAttribute(attributes.EXPANDED, false);
    } else {
      this.setAttribute(attributes.EXPANDED, true);
    }
  }

  /**
   * Check for nested items and assign css class
   * @private
   * @returns {void}
   */
  #hasNestedItems() {
    const nestedItems = this.container?.querySelector('[part="nested-items"]');
    const hasNestedItems = !!nestedItems?.assignedElements().length;
    if (hasNestedItems) {
      this.container.classList.add('has-nested-items');
    }
  }

  /**
   * Sets up event listeners
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.onEvent('click', this.expander, () => {
      this.#expandCollapse(this.expanded);
    });

    if (this.dropdownMenu) {
      this.onEvent('click', this.dropdownMenu, () => {
        const allLeafs = document.querySelectorAll('ids-hierarchy-item');
        allLeafs.forEach((l) => {
          const elem = l.shadowRoot?.querySelector('.leaf') as HTMLElement;
          elem.style.zIndex = '100';
        });

        const leafElement = this.shadowRoot?.querySelector('.leaf');
        leafElement.style.zIndex = 1000;
      });
    }

    this.onEvent('touchend', this.expander, (e: any) => {
      if (e.touches && e.touches.length > 0) {
        this.#expandCollapse(this.expanded);
      }
    }, {
      passive: true
    });

    this.onEvent('click', this.leaf, () => {
      this.setAttribute(attributes.SELECTED, true);
    });

    this.onEvent('touchstart', this.leaf, () => {
      this.setAttribute(attributes.SELECTED, true);
    });
  }
}
