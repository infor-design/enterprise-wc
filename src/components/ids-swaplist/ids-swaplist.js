import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swaplist-base';
import IdsCard from '../ids-card/ids-card';
import IdsButton from '../ids-button/ids-button';

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
      <ids-card>
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
        <slot></slot>
      </div>
    `;
  }
}
