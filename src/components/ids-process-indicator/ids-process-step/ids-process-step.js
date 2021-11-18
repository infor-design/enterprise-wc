import { customElement, scss } from '../../../core/ids-decorators';
import { attributes } from '../../../core/ids-attributes';
import Base from './ids-process-step-base';

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
export default class IdsProcessStep extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
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
        <span class="step">
        </span>
          <ids-text part="label" class="label">${this.label}</ids-text>
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
