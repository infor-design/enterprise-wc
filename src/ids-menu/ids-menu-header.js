import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

import styles from './ids-menu-header.scss';

/**
 * IDS Menu Header Component
 */
@customElement('ids-menu-header')
@scss(styles)
class IdsMenuHeader extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<li class="ids-menu-header" role="heading"><slot></slot></li>`;
  }
}

export default IdsMenuHeader;
