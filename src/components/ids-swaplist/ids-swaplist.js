import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swaplist-base';
import IdsCard from '../ids-card/ids-card';
import IdsButton from '../ids-button/ids-button';
import IdsListView from '../ids-list-view/ids-list-view';

import styles from './ids-swaplist.scss';

/**
 * IDS SwapList Component
 * @type {IdsSwapList}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */

@customElement('ids-swaplist')
@scss(styles)
export default class IdsSwapList extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    const l = this.container.querySelector('ids-list-view');
    l.defaultTemplate = this.defaultTemplate;
    l.sortable = true;
    l.data = [
      {
        "id":1,
        "productId":"7439937961",
        "productName":"Steampan Lid",
        "inStock":true,
        "units":"9",
        "unitPrice":23,
        "color":"Green"
     },
     {
        "id":2,
        "productId":"3672150959",
        "productName":"Coconut - Creamed, Pure",
        "inStock":true,
        "units":"588",
        "unitPrice":18,
        "color":"Yellow"
     },
     {
        "id":3,
        "productId":"8233719404",
        "productName":"Onions - Red",
        "inStock":false,
        "units":"68",
        "unitPrice":58,
        "color":"Green"
     },
     {
        "id":4,
        "productId":"2451410442",
        "productName":"Pasta - Fusili Tri - Coloured",
        "inStock":true,
        "units":"02",
        "unitPrice":24,
        "color":"Crimson"
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
      attributes.COUNT
    ];
  }

  set count(value) {
    const val = parseInt(value);
    // if val is not nan
    this.setAttribute(attributes.COUNT, val);
    // else set it to the default (2)
  }

  get count() {
    const val = this.getAttribute(attributes.COUNT);
    return parseInt(val);
  }

  cardTemplate() {
    const arr = Array(this.count).fill(0);

    return arr.map(() => `
      <ids-card auto-fit>
        <div slot="card-header">
          INSERT TITLE
          <ids-button>
            ICON
          </ids-button>
        </div>
        <div slot="card-content">
          <ids-list-view>
          </ids-list-view>
        </div>
      </ids-card>
    `).join('');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-swaplist">
        ${this.cardTemplate()}
      </div>
    `;
  }
}
