import {
  customElement,
  scss,
} from '../../core/ids-decorators';

import { attributes } from '../../core/ids-attributes';
import Base from './ids-swaplist-item-base';
import styles from './ids-swaplist-item.scss';

/**
 * IDS SwapList Component
 * @type {IdsSwapListItem}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-swaplist-item')
@scss(styles)
export default class IdsSwapListItem extends Base {
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
      attributes.DRAGGING,
      'over',
      'dragging'
    ];
  }
}
