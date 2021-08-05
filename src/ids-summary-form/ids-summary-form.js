import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-summary-form.scss';

/**
 * IDS Summary Form Component
 * @type {IdsSummaryForm}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-summary-form')
@scss(styles)
class IdsSummaryForm extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      // TODO: insert attributes here
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-summary-form">
        <slot name="label" class="labelSlot"></slot>
        <slot name="data" class="dataSlot"></slot>
      </div>`;
  }

  // set get color

  // set get font size
}

export default IdsSummaryForm;
