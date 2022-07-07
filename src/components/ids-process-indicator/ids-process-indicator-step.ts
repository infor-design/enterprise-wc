import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-process-indicator-step-base';

import styles from './ids-process-indicator-step.scss';

const statuses = ['cancelled', 'started', 'done'];
const DEFAULT_LABEL = 'empty label';

/**
 * IDS Process Step Component
 * @type {IdsProcessStep}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part label
 */
@customElement('ids-process-indicator-step')
@scss(styles)
export default class IdsProcessStep extends Base {
  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    requestAnimationFrame(() => {
      const parentElement = this.parentElement;
      if (parentElement.tagName === 'IDS-PROCESS-INDICATOR') {
        const steps = this.parentElement.querySelectorAll('ids-process-indicator-step');
        const stepAmount = steps.length;

        const line = this.container.querySelector('.line');

        if (steps[stepAmount - 1] === this) {
          // reponsive styling for last step
          this.classList.add('last');
          // don't render the line for the last step
          line.setAttribute('hidden', '');
        } else if (this.status === 'started' || this.status === 'done') {
          // render the line, conditionally color it based on status
          line.style.setProperty('background-color', 'var(--ids-color-palette-azure-70)');
        }
      }

      this.#updateLabelVisibility();
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.LABEL,
      attributes.STATUS,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-process-indicator-step">
        <div class="line"></div>
        <ids-text part="label" hidden class="label">
          ${this.label}
        </ids-text>
        <span class="step"></span>
        <div class="details">
          <slot name="detail"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Set the string attribute
   * @param {string} attribute attribute name
   * @param {string} value attribute value
   * @private
   * @returns {void}
   */
  #setString(attribute: string, value: string) {
    if (value) {
      this.setAttribute(attribute, value);
    }
  }

  /**
   * Hide the step
   * @param {HTMLElement} element html element
   * @private
   * @returns {void}
   */
  #hide(element: HTMLElement) {
    element.style.setProperty('visibility', 'hidden');
  }

  /**
   * show the step
   * @param {HTMLElement} element html element
   * @private
   * @returns {void}
   */
  #show(element: HTMLElement) {
    element.style.removeProperty('visibility');
  }

  /**
   * Set the step label visibility
   * @private
   * @returns {void}
   */
  #updateLabelVisibility(): void {
    const labelEl = this.#getLabelElement();
    if (this.label === DEFAULT_LABEL) {
      this.#hide(labelEl);
    } else {
      this.#show(labelEl);
    }
  }

  /**
   * Get the label element
   * @returns {HTMLElement} the element
   * @private
   */
  #getLabelElement(): HTMLElement {
    return this.container.querySelector('.label');
  }

  /**
   * Sets the label for the step
   * @param {string} value The step name
   */
  set label(value: string) {
    const val = value || DEFAULT_LABEL;
    this.#setString(attributes.LABEL, val);
    this.#getLabelElement().innerHTML = val;
    this.#updateLabelVisibility();
  }

  get label(): string {
    return this.getAttribute(attributes.LABEL) || (DEFAULT_LABEL ?? '');
  }

  /**
   * Sets the status for the step which determines the icon
   * @param {string} value The step status
   */
  set status(value: string) {
    const val = value.toLowerCase();

    if (statuses.includes(val)) {
      this.#setString(attributes.STATUS, val);

      const idsIcons = this.container.querySelectorAll('ids-icon');
      if (idsIcons.length > 0) {
        idsIcons.forEach((icon: HTMLElement) => icon.remove());
      }

      if (val === 'cancelled') {
        this.container.querySelector('.step').insertAdjacentHTML('beforeend', `<ids-icon icon="close" size="xsmall"></ids-icon>`);
      }
    }
  }

  get status(): string {
    const status = this.getAttribute(attributes.STATUS);
    return statuses.includes(status) ? status : '';
  }
}
