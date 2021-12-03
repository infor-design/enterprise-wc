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

const statuses = ['cancelled', 'started', 'done'];

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
      console.log(this.parentElement.getBoundingClientRect())
      if (parentElement.tagName === 'IDS-PROCESS-INDICATOR') {
        const parentWidth = parentElement.getBoundingClientRect().width;
        const stepAmount = parentElement.querySelectorAll('ids-process-step').length;
        const stepWidth = parentWidth / stepAmount;
        this.container.style.setProperty('--step-width', stepWidth);
      }
    })
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
        <ids-text part="label" class="label">
        ${this.label}
        </ids-text>
        <span class="step"></span>
          <div class="details">
            <slot></slot>
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

  /**
   * Sets the label for the step
   * @param {string} value The step name
   */
  set label(value) {
    this.setString(attributes.LABEL, value);
  }

  get label() {
    return this.getString(attributes.LABEL);
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

  get status() {
    return this.getString(attributes.STATUS, '');
  }
}

export default IdsProcessStep;
