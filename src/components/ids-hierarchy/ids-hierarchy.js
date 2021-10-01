import {
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
 * @mixes IdsElement
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
    return ['items'];
  }

  connectedCallback() {}

  template() {
    return `<slot></slot>`;
  }

  set items(value) {
    if (value) {
      this.setAttribute('items', value);
    }
  }

  get items() {
    return this.getAttribute('items');
  }
}

export default IdsHierarchy;
