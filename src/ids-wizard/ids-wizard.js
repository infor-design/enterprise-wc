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

    // iterate through lightDOM children
    // to compose step markup

    for (const [i, stepEl] of [...this.children].entries()) {
      const isCurrentStep = (this.stepNumber - 1) === i;
      const clickable = stepEl.getAttribute('clickable');
      const label = stepEl.innerText;

      const className = clsx(
        'ids-wizard-step',
        isCurrentStep && 'current-step',
        clickable && 'clickable'
      );
      const classNameStr = className ? ` class="${className}"` : '';

      /* left to center */
      const pathFromPrev = (i > 0) ? '<div class="path-segment from-prev"></div>' : '';

      /* center to right */
      const pathToNext = (i < this.children.length - 1) ? '<div class="to-next path-segment"></div>' : '';

      wizardStepHtml += (
        `<div${classNameStr}>
          <div class="path-layer">
            ${pathFromPrev}
            ${pathToNext}
            <svg class="path-node" viewBox="0 0 24 24">
              <circle
                cx="12" cy="12" r="12"
                stroke="transparent"
              />
            </svg>
          </div>
          ${label} ${isCurrentStep ? '&lt;' : ''}
        </div>`
      );
    }

    return (
      `<div class="ids-wizard">${wizardStepHtml}</div>`
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
   * @returns {number} step number (1-based)
   */
  get stepNumber() {
    return parseInt(this.getAttribute('step-number'), 10);
  }

  /**
   * Set the step number
   * @param {number} value step number (1-based)
   */
  set stepNumber(value = 1) {
    if (Number.isNaN(Number(value))) {
      throw new Error('ids-wizard: Invalid step number provided');
    }

    const v = parseInt(value, 10);
    if (v < 0) {
      throw new Error('ids-wizard: step number should be > 0');
    } else if (v > this.children.length) {
      throw new Error('ids-wizard: step number should be below step-count');
    }

    this.rerenderTemplate();
  }
}

export { IdsWizardStep };
export default IdsWizard;
