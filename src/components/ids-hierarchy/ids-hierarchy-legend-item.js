import {
  customElement,
  mix,
  IdsElement,
  scss,
  attributes,
} from '../../core';

// Import Styles
import styles from './ids-hierarchy-legend-item.scss';

// Import Mixins
import {
  IdsColorVariantMixin,
} from '../../mixins';

/**
 * IDS Hierarchy Legend Item Component
 * @type {IdsHierarchyLegendItem}
 * @inherits IdsElement
 */
@customElement('ids-hierarchy-legend-item')
@scss(styles)
class IdsHierarchyLegendItem extends mix(IdsElement).with(IdsColorVariantMixin) {
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

export default IdsHierarchyLegendItem;
