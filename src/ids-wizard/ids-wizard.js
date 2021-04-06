import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import clsx from 'clsx';
import IdsWizardStep from './ids-wizard-step';
// @ts-ignore
import cssStyles from './ids-wizard.scss';

/**
 * IDS Wizard Component
 * @type {IdsWizard}
 * @inherits IdsElement
 */
@customElement('ids-wizard')
class IdsWizard extends IdsElement {
  constructor() {
    super({ cssStyles });
  }

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
    for (const [i, c] of [...this.children].entries()) {
      const isCurrentStep = (this.stepNumber - 1) === i;
      const clickable = c.getAttribute('clickable');
      const label = c.innerText;
      const className = clsx(
        isCurrentStep && 'current-step',
        clickable && 'clickable'
      );
      const classNameStr = className ? ` className=${className}` : '';

      wizardStepHtml += (
        `<div${classNameStr}>
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
