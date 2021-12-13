import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-process-indicator-base';
import IdsProcessStep from './ids-process-step/ids-process-step';

import styles from './ids-process-indicator.scss';

/**
 * IDS Process Indicator Component
 * @type {IdsProcessIndicator}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 */
@customElement('ids-process-indicator')
@scss(styles)
export default class IdsProcessIndicator extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#calculateProgressLine();
  }

  static get attributes() {
    return [
      ...super.attributes,
    ];
  }

  #calculateProgressLine() {
    window.requestAnimationFrame(() => {
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
          <span class="step-container">
            <span class="progress-line"></span>
            <slot></slot>
          </span>
          </span>
      </div>
    `;
  }
}
