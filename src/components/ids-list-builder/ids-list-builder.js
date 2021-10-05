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

    // this.virtualScroll = true;

    // this.listView = document.querySelector('#list-view-1');
    // this.listView = document.querySelector('ids-list-view');

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
    console.log('this.defaultTemplate')
    console.log(this.defaultTemplate);
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
    // return `
    //   <div class="ids-list-builder">
    //     <ids-card>
    //       <div slot="card-header">
    //         <ids-text font-size="20" type="h2">Card Title One</ids-text>
    //       </div>
    //       <div slot="card-content">
    //         <ids-list-view id="list-view-1" virtual-scroll="true">
    //           <template>
    //             <ids-text font-size="16" type="h2">${this.data[0]?.productName}</ids-text>
    //             <ids-text font-size="12" type="span">Count: ${this.data[0]?.units}</ids-text>
    //             <ids-text font-size="12" type="span">Price: $ ${this.data[0]?.unitPrice}</ids-text>
    //           </template>
    //         </ids-list-view>
    //       </div>
    //     </ids-card>
    //     <slot></slot>
    //   </div>
    // `;
    let html = '';

    if (this?.data.length > 0) {
      if (this.virtualScroll !== 'true') {
        html = `
          <div class="ids-list-builder">
            <ids-card>
              <div slot="card-header">
                <ids-text font-size="20" type="h2">Card Title One</ids-text>
              </div>
              <div slot="card-content"
                <div class="ids-list-view" part="container">
                  <ul part="list">
        `;

        this.data.forEach((item) => {
          html += `
                    <li part="list-item">${this.itemTemplate(item)}</li>
          `;
        });

        html += `
                  </ul>
                </div>
              </div>
            </ids-card>
          </div>
        `;
      } else {
        html = `
          <div class="ids-list-builder">
            <ids-card>
              <div slot="card-header">
                <ids-text font-size="20" type="h2">Card Title One</ids-text>
              </div>
              <div slot="card-content">
                <ids-virtual-scroll height="310" item-height="75">
                  <div class="ids-list-view" part="container">
                    <ul slot="contents" part="list">
                    </ul>
                  </div>
                </ids-virtual-scroll>
              </div>
            </ids-card>
          </div>
        `;
      }
    } else {
      html = `<div class="ids-list-view"></div>`;
    }

    return html;
  }
}

export default IdsListBuilder;
