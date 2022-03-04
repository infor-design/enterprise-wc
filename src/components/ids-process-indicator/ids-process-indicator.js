import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-process-indicator-base';
import IdsProcessStep from './ids-process-step/ids-process-step';
import IdsAlert from '../ids-alert/ids-alert';

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

  #activeStepLabel;

  connectedCallback() {
    // set the active step label for xs heading
    requestAnimationFrame(() => {
      let activeStepLabel = 'None';
      const steps = this.querySelectorAll('ids-process-step');
      if (steps.length > 1) {
        let i = 0;
        for (const step of steps) {
          if (step.status === 'started') {
            activeStepLabel = step.label === 'empty label' ? `${i + 1}` : step.label;
            break;
          }
          i++;
        }
        this.container.querySelector('.xs-header .label').innerHTML = activeStepLabel;
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
