import {
  attributes,
  customElement,
  IdsElement,
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
 * @inherits IdsHierarchy
 */
@customElement('ids-hierarchy-item')
@scss(styles)
class IdsHierarchyItem extends IdsHierarchy {
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
    return this.renderHierarchy(
      `
        <li>
          <div>Leaf</div>
        </li>
      `
    );
  }
}

export default IdsHierarchyItem;
