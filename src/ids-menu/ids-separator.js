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
    return `<li class="ids-separator"></li>`;
  }
}

export default IdsSeparator;
