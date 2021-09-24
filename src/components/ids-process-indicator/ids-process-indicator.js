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
    super.connectedCallback();
    this.#calculateProgressLine();
  }

  #calculateProgressLine() {
    /* istanbul ignore next */
    window.requestAnimationFrame(() => {
      /* istanbul ignore next */
      const steps = this.querySelectorAll('ids-process-step');

      /* istanbul ignore next */
      if (steps.length >= 2) {
        let lastStatusStep = 0;

        steps.forEach((step, i) => {
          const status = step.getAttribute('status');

          if (status) {
            if (i > lastStatusStep) {
              lastStatusStep = i;
            }
          }
        });

        const n = lastStatusStep;
        const percent = (100 / (steps.length - 1)) * n;
        this.container.querySelector('.progress-line').style.setProperty('--percentEnd', `${percent}%`);
      }
    });
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
            <span class="progress-line"></span>
            <slot></slot>
          </span>
          </span>
      </div>
    `;
  }
}

export default IdsProcessIndicator;
