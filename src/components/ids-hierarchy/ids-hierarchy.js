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
  IdsAttributeProviderMixin,
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
class IdsHierarchy extends mix(IdsElement).with(
    IdsEventsMixin,
  ) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.VALUE];
  }

  connectedCallback() {
    super.connectedCallback?.();

    /* istanbul ignore next */
    this.onEvent('itemselect', this, (e) => {
      e.stopPropagation();
      const items = this.querySelectorAll('ids-hierarchy-item');
      items.forEach((item) => {
        item.removeAttribute('selected');
        item.setAttribute('aria-selected', false);
      });
      e.target.setAttribute('selected', true);
      e.target.setAttribute('aria-selected', true);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  template() {
    return `<slot></slot>`;
  }
}

export default IdsHierarchy;
