import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import Base from './ids-hierarchy-legend-base';

import styles from './ids-hierarchy-legend.scss';

/**
 * IDS Hierarchy Legend Component
 * @type {IdsHierarchyLegend}
 * @inherits IdsElement
 */
@customElement('ids-hierarchy-legend')
@scss(styles)
export default class IdsHierarchyLegend extends Base {
  constructor() {
    super();
  }

  /**
   * ids-hierarchy-legend `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  template() {
    return `
      <div class="ids-hierarchy-legend">
        <slot class="legend" part="legend"></slot>
      </div>
    `;
  }
}
