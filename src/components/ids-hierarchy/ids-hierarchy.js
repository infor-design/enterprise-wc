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
  IdsEventsMixin,
} from '../../mixins';

// Import Styles
import styles from './ids-hierarchy.scss';
import IdsHierarchyItem from './ids-hierarchy-item';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchy}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-hierarchy')
@scss(styles)
class IdsHierarchy extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.SELECTED];
  }

  /**
   * ids-hierarchy `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.#selectItem();
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  template() {
    return `<slot></slot>`;
  }

  /**
   * Selects the current hierarchy item
   * and deselects all other items
   * @private
   * @returns {void}
   */
  #selectItem() {
    this.onEvent('itemselect', this, (e) => {
      e.stopPropagation();
      const items = this.querySelectorAll('ids-hierarchy-item');
      items.forEach((item) => {
        item.removeAttribute(attributes.SELECTED);
        item.setAttribute('aria-selected', false);
      });
      requestAnimationFrame(() => {
        e.target.setAttribute(attributes.SELECTED, true);
        e.target.setAttribute('aria-selected', true);
      });
    });
  }
}

export default IdsHierarchy;
