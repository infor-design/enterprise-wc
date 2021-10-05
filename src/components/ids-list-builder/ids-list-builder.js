import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-list-builder.scss';
import IdsListView from '../ids-list-view';
import IdsCard from '../ids-card';

/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */

@customElement('ids-list-builder')
@scss(styles)
class IdsListBuilder extends mix(IdsListView).with(IdsEventsMixin, IdsThemeMixin) {
  // listView;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.virtualScroll = true;

    this.data = [
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
      {
        id: 1,
        productId: '7439937961',
        productName: 'Steampan Lid',
        inStock: true,
        units: '9',
        unitPrice: 23,
        color: 'Green'
      },
    ];
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      // attributes.DATA
    ];
  }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  // set data(value) {
  //   // this.datasource.data = value || [];
  //   // this.render(true);
  //   console.log(value);

  //   if (this.listView) {
  //     this.listView.data = value;
  //   }
  // }

  // get data() { 
  //   // return this?.datasource?.data || [];
  //   return this.listView?.data || [];
  // }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    console.log(super.template())
    return `
      <div class="ids-list-builder">
        <ids-card>
          <div slot="card-header">
            <ids-text font-size="20" type="h2">Card Title One</ids-text>
          </div>
          <div slot="card-content">
            ${super.template()} 
          </div>
        </ids-card>
        <slot></slot>
      </div>
    `;
  }
}

export default IdsListBuilder;
