import {
  IdsElement,
  customElement,
  scss
} from '../../core';

import { IdsEventsMixin } from '../../mixins';
import styles from './ids-tab-divider.scss';

/**
 * IDS Tab Divider Component
 * @type {IdsTabDivider}
 * @inherits IdsElement
 * @part divider - the tab divider
 */
@customElement('ids-tab-divider')
@scss(styles)
class IdsTabDivider extends IdsElement {
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

export default IdsTabDivider;
