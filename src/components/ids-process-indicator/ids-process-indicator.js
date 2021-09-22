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
        })

        const n = lastStatusStep;
        const percent = 100 / (steps.length - 1) * n;
        console.log('setting percent: ' + percent);
        this.container.querySelector('.progress-line').style.setProperty('--percentEnd', `${percent}%`);
      }
    })
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
            <span class="progress-line"></span>
            <slot></slot>
          </span>
          </span>
      </div>
    `;
  }
}

export default IdsProgressIndicator;
