import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

import styles from './ids-separator.scss';

/**
 * IDS Separator Component
 */
@customElement('ids-separator')
@scss(styles)
class IdsSeparator extends IdsElement {
  constructor() {
    super();
  }

  template() {
    let tagName = 'div';
    if (this.parentNode?.tagName === 'IDS-MENU-GROUP') {
      tagName = 'li';
    }
    return `<${tagName} class="ids-separator"></${tagName}>`;
  }
}

export default IdsSeparator;
