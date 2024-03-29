import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchy}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-hierarchy')
export default class IdsHierarchy extends IdsEventsMixin(IdsElement) {
  constructor() {
    super();
  }

  /**
   * ids-hierarchy `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#selectItem();
  }

  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Selects the current hierarchy item
   * and deselects all other items
   * @private
   * @returns {void}
   */
  #selectItem() {
    this.onEvent('itemselect', this, (e: any) => {
      e.stopPropagation();
      const items = this.querySelectorAll('ids-hierarchy-item');
      items.forEach((item: any) => {
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
