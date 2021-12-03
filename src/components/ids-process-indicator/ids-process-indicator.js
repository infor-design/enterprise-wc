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
    this.#calculateProgressLine();

    requestAnimationFrame(() => {
      const lastStep = this.querySelector('ids-process-step:last-child');
      const containerWidth = this.getBoundingClientRect().width;
      const lastStepWidth = lastStep.getBoundingClientRect().width;
      // const lineWidth = `${containerWidth - lastStepWidth}px`
      const lineWidth = `calc(100% - ${lastStepWidth}px)`
      this.container.style.setProperty('--line-width', lineWidth);
    });
  }

  static get attributes() {
    return [
      ...super.attributes,
    ];
  }

  #calculateProgressLine() {
    requestAnimationFrame(() => {
      const steps = this.querySelectorAll('ids-process-step');

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
        <span class="progress-line"></span>
        </span>
        <span class="step-container">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

export default IdsProcessIndicator;
