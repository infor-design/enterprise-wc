import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-accordion.scss';
// @ts-ignore
import IdsAccordionHeader from './ids-accordion-header';
// @ts-ignore
import IdsAccordionPanel from './ids-accordion-panel';
// @ts-ignore
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';
// @ts-ignore
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

/**
 * IDS Accordion  Component
 * @type {IdsAccordion}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part accordion - the accordion root element
 */
@customElement('ids-accordion')
@scss(styles)
class IdsAccordion extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.MODE, props.VERSION];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion" part="accordion">
        <slot></slot>
      </div>
    `;
  }
}

export default IdsAccordion;
