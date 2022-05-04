import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-process-indicator-base';
import './ids-process-step';
import '../ids-alert/ids-alert';

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
    this.#setActiveStepLabel();
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
    ];
  }

  /**
   * Set the active step label for xs heading
   * @private
   * @returns {void}
   */
  #setActiveStepLabel(): void {
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
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
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
