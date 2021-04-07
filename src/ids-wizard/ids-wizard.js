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

    for (const [i, stepEl] of [...this.children].entries()) {
      // @ts-ignore
      const stepIndex = parseInt(this.stepNumber) - 1;
      const isCurrentStep = stepIndex === i;
      const isVisitedStep = i <= stepIndex;

      const isClickable = stepEl.getAttribute('clickable');
      // @ts-ignore
      const label = stepEl.innerText;

      const className = clsx(
        'ids-wizard-step',
        isCurrentStep && 'current-step',
        isVisitedStep && 'visited-step',
        isClickable && 'clickable'
      );

      const classNameStr = className ? ` class="${className}"` : '';

      const pathFromPrev = ((i > 0)
        ? `<div
            class="path-segment from-prev${(i - 1) < stepIndex ? ' visited' : ''}"
          ></div>` : ''
      );
      const pathToNext = ((i < this.children.length - 1)
        ? `<div
            class="to-next path-segment ${ i < stepIndex ? ' visited' : ''}"
          ></div>` : ''
      );

      wizardStepHtml += (
        `<div${classNameStr}>
          <div class="path-layer">
            ${pathFromPrev}
            ${pathToNext}
            <svg class="path-node" viewBox="0 0 24 24">
              <circle
                cx="12" cy="12" r="8"
              />
              ${ !isCurrentStep ? '' : (
                `<circle
                  cx="12" cy="12" r="11"
                />`) }
            </svg>
          </div>
          <div class="step-label">
            <ids-text font-size="18" font-weight=${isCurrentStep ? 'bold' : 'normal'}>${label}</ids-text>
          </div>
        </div>`
      );
    }

    return (
      `<div class="ids-wizard">
        ${wizardStepHtml}
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
