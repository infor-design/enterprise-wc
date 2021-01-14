import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
// @ts-ignore
import styles from './ids-accordion.scss';

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
