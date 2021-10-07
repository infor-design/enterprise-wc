import {
  attributes,
  customElement,
  IdsElement,
  mix,
  scss
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Import Mixins
import {
  IdsColorVariantMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

// Import Styles
import styles from './ids-hierarchy-item.scss';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchyItem}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-hierarchy-item')
@scss(styles)
class IdsHierarchyItem extends mix(IdsElement).with(
    IdsColorVariantMixin,
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  /** store the previous "selected" value to prevent double firing events */
  #prevSelected = false;

  constructor() {
    super();
    this.expander = this.shadowRoot?.querySelector('[part="icon-btn"]');
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
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = [
    'full-time',
    'part-time',
    'contractor',
    'open-position'
  ];

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.EXPANDED,
      attributes.SELECTED,
      attributes.VALUE,
      attributes.ID
    ];
  }

  template() {
    return `
      <div class="ids-hierarchy-item">
        <div class="leaf" part="leaf">
          <span class="avatar">
            <slot name="avatar"></slot>
          </span>
          <div class="details">
            <slot name="heading"></slot>
            <slot name="subheading"></slot>
            <slot name="micro"></slot>
          </div>
          <ids-button part="icon-btn" id="icon-only-button-default">
            <span class="audible">Default Button</span>
            <ids-icon slot="icon" icon="caret-down"></ids-icon>
          </ids-button>
        </div>
        <div class="sub-level"><slot part="nested-items"></slot></div>
      </div>
    `;
  }

  /**
   * Set the value of the expanded attribute
   * @param {string} value the value of the attribute
   */
  set expanded(value) {
    const isValueTruthy = IdsStringUtils.stringToBool(value);
    if (isValueTruthy) {
      this.setAttribute(attributes.EXPANDED, true);
    } else {
      this.removeAttribute?.(attributes.EXPANDED);
    }
  }

  /**
   * @returns {string|undefined} containing value of the expanded attribute
   */
  get expanded() {
    return this.getAttribute(attributes.EXPANDED);
  }

  /**
   * Set the value of the selected attribute
   * @param {string} value the value of the attribute
   */
  set selected(value) {
    const isValueTruthy = IdsStringUtils.stringToBool(value);
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
   * @returns {string|undefined} containing value of the selected attribute
   */
  get selected() {
    return this.hasAttribute(attributes.SELECTED);
  }

  /**
   * Sets the value of the expanded attribute
   * @private
   * @param {string} expanded the value of the expanded attribute.
   * @returns {void}
   */
  #expandCollapse(expanded) {
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

    this.onEvent('touchstart', this.expander, (e) => {
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

export default IdsHierarchyItem;
