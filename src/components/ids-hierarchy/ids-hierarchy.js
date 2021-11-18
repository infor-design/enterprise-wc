import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-hierarchy-base';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchy}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-hierarchy')
export default class IdsHierarchy extends Base {
  constructor() {
    super();
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
