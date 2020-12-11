import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsExampleMixin } from '../ids-base/ids-example-mixin';
import styles from './ids-accordion-header.scss';
import { props } from '../ids-base/ids-constants';

// Default Icons
const DEFAULT_ICON_OFF = 'caret-down';

/**
 * IDS Tag Component
 */
@customElement('ids-accordion-header')
@scss(styles)
@mixin(IdsEventsMixin)
@mixin(IdsExampleMixin)
class IdsAccordionHeader extends IdsElement {
  constructor() {
    super();
  }

  /**
   * ExpandedArea `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() { }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [];
  }

  /**
   * Inner template contents
   * @private
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion-header">
        <slot></slot>
        <ids-icon icon=${DEFAULT_ICON_OFF}></ids-icon>
      </div>
    `;
  }
}

export default IdsAccordionHeader;
