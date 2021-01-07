import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import styles from './ids-accordion.scss';
import { IdsAccordionPanel } from './ids-accordion-panel';
import { IdsAccordionHeader } from './ids-accordion-header';

/**
 * IDS Tag Component
 */
@customElement('ids-accordion')
@scss(styles)
class IdsAccordion extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {}

  /**
   * Inner template contents
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
