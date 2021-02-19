import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
// @ts-ignore
import styles from './ids-block-grid-item.scss';

@customElement('ids-block-grid-item')
@scss(styles)
class IdsBlockgridItem extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<slot></slot>`;
  }
}

export default IdsBlockgridItem;
