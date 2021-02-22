import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-menu-header.scss';

/**
 * IDS Menu Header Component
 * @type {IdsMenuHeader}
 * @inherits IdsElement
 */
@customElement('ids-menu-header')
@scss(styles)
class IdsMenuHeader extends IdsElement {
  constructor() {
    super();
  }

  template() {
    return `<div class="ids-menu-header"><slot></slot></div>`;
  }
}

export default IdsMenuHeader;
