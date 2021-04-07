import clsx from 'clsx';
import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import IdsWizardStep from './ids-wizard-step';
// @ts-ignore
import styles from './ids-wizard.scss';

/**
 * IDS Wizard Component
 * @type {IdsWizard}
 * @inherits IdsElement
 */
@customElement('ids-wizard')
@scss(styles)
class IdsWizard extends IdsElement {
  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['step-number'];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    let wizardStepHtml = '';

    // iterate through ids-wizard-step
    // lightDOM to create shadowDOM markup

    // @ts-ignore
    const stepIndex = parseInt(this.stepNumber) - 1;

    for (const [i, stepEl] of [...this.children].entries()) {
      const isCurrentStep = stepIndex === i;
      const isVisitedStep = i <= stepIndex;

      wizardStepHtml += (
        `<div class="ids-wizard-step">
          <div class="step-node">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" />
            </svg>
            ${ !isCurrentStep ? '' : (
              `<svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" />
              </svg>`) }
          </div>
        </div>`
      );

      if (i < this.children.length - 1) {
        wizardStepHtml += (
          `<div class="path-segment${
            stepIndex <= i ? '' : ' visited'
          }">
          </div>`
        );
      }
    }

    return (
      `<div class="ids-wizard">
        <div class="bar">
          ${wizardStepHtml}
        </div>
      </div>`
    );
  }

  rerenderTemplate() {
    const template = document.createElement('template');
    const html = this.template();
    template.innerHTML = html;
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Get the step number
   * @returns {number|string} step number (1-based)
   */
  get stepNumber() {
    // @ts-ignore
    return parseInt(this.getAttribute('step-number'));
  }

  /**
   * Set the step number
   * @param {number|string} value step number (1-based)
   */
  set stepNumber(value) {
    if (Number.isNaN(Number(value))) {
      throw new Error('ids-wizard: Invalid step number provided');
    }

    // @ts-ignore
    const v = parseInt(value);
    if (v < 0) {
      throw new Error('ids-wizard: step number should be > 0');
    } else if (v > this.children.length) {
      throw new Error('ids-wizard: step number should be below step-count');
    }

    this.render();
  }
}

export { IdsWizardStep };
export default IdsWizard;
