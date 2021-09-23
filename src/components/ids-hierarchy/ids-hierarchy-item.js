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
  IdsEventsMixin
} from '../../mixins';

// Import Styles
import styles from './ids-hierarchy-item.scss';
import IdsHierarchy from './ids-hierarchy';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchyItem}
 * @inherits IdsElement
 */
@customElement('ids-hierarchy-item')
@scss(styles)
class IdsHierarchyItem extends mix(IdsElement).with(IdsEventsMixin) {
  // States: selected, expanded, collapsed
  // Types: root, expandable, nested

  constructor() {
    super();
  }

  connectedCallback() {
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [];
  }

  template() {
    return `
      <div class="ids-hierarchy-item">
        <div class="leaf">
          <span class="avatar">
            <slot name="avatar"></slot>
          </span>
          <div class="details">
            <slot name="heading"></slot>
            <slot name="subheading"></slot>
            <slot name="micro"></slot>
          </div>
          <ids-icon icon="caret-down" part="icon-btn"></ids-icon>
        </div>
        <slot></slot>
      </div>
    `;
  }
}

export default IdsHierarchyItem;
