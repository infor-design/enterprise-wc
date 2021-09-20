import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-process-indicator.scss';
import IdsProcessStep from './ids-process-step';

// TODO: might not need IdsEventsMixin

/**
 * IDS Process Indicator Component
 * @type {IdsProgressIndicator}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */

@customElement('ids-process-indicator')
@scss(styles)
class IdsProgressIndicator extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
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
      ...super.attributes
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-process-indicator">
        <span class="line">
          <span class="step-container">
            <slot></slot>
          </span>
        </span>
      </div>
    `;
  }
}

export default IdsProgressIndicator;
