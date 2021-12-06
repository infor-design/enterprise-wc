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

  #activeStepLabel;

  connectedCallback() {
    // set the active step label for xs heading
    requestAnimationFrame(() => {
      let activeStep;

      const steps = this.querySelectorAll('ids-process-step');
      if (steps) {
        for (const step of steps) {
          if (step.status === 'started') {
            activeStep = step;
            break;
          }
        }
        this.container.querySelector('.xs-header .label').innerHTML = activeStep.label;
      }
    });
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
        <div class="xs-header">
          <ids-text>Current: </ids-text>
          <ids-text class="label" font-weight="bold"></ids-text>
        </div>
        <slot></slot>
      </span>
    </div>
    `;
  }
}

export default IdsProcessIndicator;
