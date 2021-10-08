import {
  customElement,
  IdsElement,
  scss
} from '../../core';

// Import Styles
import styles from './ids-hierarchy-legend.scss';

/**
 * IDS Hierarchy Component
 * @type {IdsHierarchyLegend}
 * @inherits IdsElement
 */
@customElement('ids-hierarchy-legend')
@scss(styles)
class IdsHierarchyLegend extends IdsElement {
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

export default IdsHierarchyLegend;
