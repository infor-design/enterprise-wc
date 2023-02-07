import { customElement, scss } from '../../core/ids-decorators';
import '../../mixins/ids-events-mixin/ids-events-mixin';
import '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-tab-divider.scss';

/**
 * IDS Tab Divider Component
 * @type {IdsTabDivider}
 * @inherits IdsElement
 * @part divider - the tab divider
 */
@customElement('ids-tab-divider')
@scss(styles)
export default class IdsTabDivider extends IdsElement {
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
    this.setAttribute('role', 'separator');
  }
}
