import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../../mixins';

import styles from './ids-process-step.scss';
import { IdsStringUtils } from '../../../utils/ids-string-utils';

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

@customElement('ids-process-step')
@scss(styles)
class IdsProcessStep extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();

    requestAnimationFrame(() => {
      const parentElement = this.parentElement;
      if (parentElement.tagName === 'IDS-PROCESS-INDICATOR') {
        const steps = this.parentElement.querySelectorAll('ids-process-step');
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

      this.updateLabelVisibility();
    });
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
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
  template() {
    return `
      <div class="ids-process-step">
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

  setString(attribute, value) {
    if (value) {
      this.setAttribute(attribute, value);
    }
  }

  getString(attribute, defaultValue) {
    const result = this.getAttribute(attribute) || (defaultValue ?? '');
    return result;
  }

  hide(element) {
    element.style.setProperty('visibility', 'hidden');
  }

  show(element) {
    element.style.removeProperty('visibility');
  }

  updateLabelVisibility() {
    const labelEl = this.getLabelElement();
    if (this.label === DEFAULT_LABEL) {
      this.hide(labelEl);
    } else {
      this.show(labelEl);
    }
  }

  getLabelElement() {
    return this.container.querySelector('.label');
  }

  /**
   * Sets the label for the step
   * @param {string} value The step name
   */
  set label(value) {
    const val = value || DEFAULT_LABEL;
    this.setString(attributes.LABEL, val);
    this.getLabelElement().innerHTML = val;
    this.updateLabelVisibility();
  }

  get label() {
    return this.getString(attributes.LABEL, DEFAULT_LABEL);
  }

  get status() {
    const status = this.getAttribute(attributes.STATUS);
    return statuses.includes(status) ? status : '';
  }

  /**
   * Sets the status for the step which determines the icon
   * @param {string} value The step status
   */
  set status(value) {
    const val = value.toLowerCase();

    if (statuses.includes(val)) {
      this.setString(attributes.STATUS, val);

      const idsIcons = this.container.querySelectorAll('ids-icon');
      if (idsIcons.length > 0) {
        idsIcons.forEach((icon) => icon.remove());
      }

      if (val === 'cancelled') {
        this.container.querySelector('.step').insertAdjacentHTML('beforeend', `<ids-icon icon="close" size="xsmall"></ids-icon>`);
      }
    }
  }
}

export default IdsProcessStep;
