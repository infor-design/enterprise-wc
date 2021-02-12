import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-accordion-header.scss';

// Default Icons
const DEFAULT_ICON_OFF = 'caret-down';

/**
 * IDS Accordion Header Component
 */
@customElement('ids-accordion-header')
@scss(styles)
class IdsAccordionHeader extends mix(IdsElement) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion-header" tabindex="0">
        <slot></slot>
        <ids-icon icon=${DEFAULT_ICON_OFF}></ids-icon>
      </div>
    `;
  }
}

export default IdsAccordionHeader;
