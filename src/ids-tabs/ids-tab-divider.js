import {
  IdsElement,
  customElement,
  scss
} from '../../core/ids-element';

<<<<<<< HEAD:src/components/ids-tabs/ids-tabs-divider.js
import { IdsEventsMixin } from '../../mixins';
import styles from './ids-tabs-divider.scss';
=======
import { IdsEventsMixin } from '../ids-mixins';
import styles from './ids-tab-divider.scss';
>>>>>>> 42125a29... remove ids-tab' shadowDOM, +ids-tab-content & boilerplate, fix attrib-provider (main merge mistake?), misc:src/ids-tabs/ids-tab-divider.js

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
