import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '.../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '.../ids-mixins';
import { scss } from '../ids-base';

import styles from './ids-tag.scss';

/**
 * IDS Completion Chart Component
 * @type {IdsCompletionChart}
 * @inherits IdsElement
 * @mixes @IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part chart - the chart element
 * @part icon - the icon element
 */
@customElement('ids-completion-chart')
@scss(styles)
class IdsCompletionChart extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element
   */
  connectedCallback() {
    this.#handleEvents();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR,
      attributes.SIZE,
      attributes.VALUE,
      attributes.TOTAL,
      // attributes.COMPLETED-LABEL,
      // attributes.ERROR-LABEL,
      // attributes.ICON
    ];
  }

  /**
   * Create the template for the ocntents
   * @returns {string} The template
   */
  template() {
    return '<div class="ids-completion-chart" part="chart"><slot></slot></div>';
  }

  /**
   * Establish internal event handlers
   * @private
   * @return {object} The object for chaining
   */
  #handleEvents() {
    return this;
  }
}

export default IdsCompletionChart;