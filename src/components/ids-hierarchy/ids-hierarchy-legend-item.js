import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-hierarchy-legend-item-base';

import styles from './ids-hierarchy-legend-item.scss';

/**
 * IDS Hierarchy Legend Item Component
 * @type {IdsHierarchyLegendItem}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 */
@customElement('ids-hierarchy-legend-item')
@scss(styles)
export default class IdsHierarchyLegendItem extends Base {
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

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.TEXT
    ];
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

  template() {
    return `
      <div class="ids-hierarchy-legend-item">
        <ids-text>${this.text}</ids-text>
      </div>
    `;
  }

  /**
   * Set the value of the text attribute
   * @param {string} value the value of the attribute
   */
  set text(value) {
    if (value) {
      this.setAttribute('text', value);
    } else {
      this.removeAttribute('text');
    }
  }

  /**
   * @returns {string|undefined} containing value of the text attribute
   */
  get text() {
    return this.getAttribute('text');
  }
}
