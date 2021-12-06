import {
  IdsElement,
  customElement,
  scss,
  mix,
} from '../../core';

// Import Mixins
import {
  IdsThemeMixin
} from '../../mixins';

import styles from './ids-process-indicator.scss';
import IdsProcessStep from './ids-process-step';

/**
 * IDS Process Indicator Component
 * @type {IdsProcessIndicator}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 */
@customElement('ids-process-indicator')
@scss(styles)
class IdsProcessIndicator extends mix(IdsElement).with(IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
  }

  static get attributes() {
    return [
      ...super.attributes,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-process-indicator">
        <span class="step-container">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

export default IdsProcessIndicator;
