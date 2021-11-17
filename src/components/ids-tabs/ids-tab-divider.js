import { IdsElement, customElement, scss } from '../../core/ids-decorators';
import Base from './ids-tab-divider-base';

import styles from './ids-tab-divider.scss';

/**
 * IDS Tab Divider Component
 * @type {IdsTabDivider}
 * @inherits IdsElement
 * @part divider - the tab divider
 */
@customElement('ids-tab-divider')
@scss(styles)
export default class IdsTabDivider extends Base {
  constructor() {
    super();
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return `<div class="ids-tab-divider" part="divider"></div>`;
  }

  connectedCallback() {
    this.setAttribute('role', 'presentation');
  }
}
