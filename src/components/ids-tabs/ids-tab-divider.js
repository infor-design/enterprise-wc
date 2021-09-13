import {
  IdsElement,
  customElement,
  scss
} from '../../core';

import { IdsEventsMixin } from '../../mixins';
import styles from './ids-tab-divider.scss';

/* istanbul ignore next */
/**
 * IDS TabGroupDivider Component
 *
 * @type {IdsTabDivider}
 * @inherits IdsElement
 * @part container - the tab container itself
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
    return `<div class="ids-tab-divider"></div>`;
  }

  connectedCallback() {
    this.setAttribute('role', 'presentation');
  }
}

export default IdsTabDivider;
