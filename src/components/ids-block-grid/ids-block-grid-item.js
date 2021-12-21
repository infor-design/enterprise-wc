import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-block-grid-item-base';
import styles from './ids-block-grid-item.scss';

/**
 * IDS Block Grid Item Component
 * @type {IdsBlockgridItem}
 * @inherits IdsElement
 */
@customElement('ids-block-grid-item')
@scss(styles)
export default class IdsBlockgridItem extends Base {
  constructor() {
    super();
  }

  template() {
    return `<slot></slot>`;
  }
}
