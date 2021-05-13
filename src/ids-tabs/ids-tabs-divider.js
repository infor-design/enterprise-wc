import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import styles from './ids-tabs-divider.scss';

/* istanbul ignore next */
/**
 * IDS TabGroupDivider Component
 *
 * @type {IdsTabsDivider}
 * @inherits IdsElement
 * @part container - the tab container itself
 */
@customElement('ids-tabs-divider')
@scss(styles)
class IdsTabsDivider extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    return (`<div class="ids-tabs-divider"></div>`);
  }

  connectedCallback() {
    this.setAttribute('role', 'presentation');
  }
}

export default IdsTabsDivider;
