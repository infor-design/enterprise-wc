import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../ids-base';

import styles from './ids-accordion-header.scss';
import { IdsThemeMixin, IdsEventsMixin } from '../ids-mixins';

// Default Icons
const DEFAULT_ICON_OFF = 'caret-down';

/**
 * IDS Accordion Header Component
 * @type {IdsAccordionHeader}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part header - the accordion header root element
 * @part icon - the accordion header icon element
 */
@customElement('ids-accordion-header')
@scss(styles)
class IdsAccordionHeader extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [attributes.MODE, attributes.VERSION];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion-header" tabindex="0" part="header">
        <slot></slot>
        <ids-icon icon=${DEFAULT_ICON_OFF} part="icon"></ids-icon>
      </div>
    `;
  }
}

export default IdsAccordionHeader;
