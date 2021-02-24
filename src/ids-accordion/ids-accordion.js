import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-accordion.scss';
// @ts-ignore
import IdsAccordionHeader from './ids-accordion-header';
// @ts-ignore
import IdsAccordionPanel from './ids-accordion-panel';

/**
 * IDS Accordion  Component
 * @type {IdsAccordion}
 * @inherits IdsElement
 */
@customElement('ids-accordion')
@scss(styles)
class IdsAccordion extends IdsElement {
  constructor() {
    super();
  }

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
