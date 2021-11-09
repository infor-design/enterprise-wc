import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element'
import styles from './ids-block-grid-item.scss';

/**
 * IDS Block Grid Item Component
 * @type {IdsBlockgridItem}
 * @inherits IdsElement
 */
@customElement('ids-block-grid-item')
@scss(styles)
export default class IdsBlockgridItem extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<slot></slot>`;
  }
}
