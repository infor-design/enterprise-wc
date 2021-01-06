import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import styles from './ids-accordion.scss';
import { props } from '../ids-base/ids-constants';

/**
 * IDS Tag Component
 */
@customElement('ids-accordion')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsExampleMixin)
class IdsAccordion extends IdsElement {
  constructor() {
    super();
  }

  /**
   * ExpandedArea `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {}

  /**
   * Inner template contents
   * @private
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion">
        <slot></slot>
      </div>
    `;
  }
}

export default IdsAccordion;
