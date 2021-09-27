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

      /* istanbul ignore next */
      const idsIcons = this.container.querySelectorAll('ids-icon');
      /* istanbul ignore if */
      if (idsIcons.length > 0) {
        idsIcons.forEach((icon) => icon.remove());
      }

      /* istanbul ignore else */
      if (val === 'cancelled') {
        this.container.querySelector('.step').insertAdjacentHTML('beforeend', `<ids-icon icon="" size="xsmall"></ids-icon>`);
        this.container.querySelector('ids-icon').style.display = 'flex';
        this.container.querySelector('ids-icon').style.justifyContent = 'center';
        this.container.querySelector('ids-icon').style.transform = 'translate(0, 4px)';
        this.container.querySelector('.step').style.height = '18px';
        this.container.querySelector('.step').style.width = '18px';
        this.container.querySelector('ids-icon').setAttribute('icon', 'close');
        this.container.querySelector('ids-icon').style.color = 'var(--bg-color)';
        this.container.querySelector('.step').style.backgroundColor = 'var(--cancelled-color)';
        this.container.querySelector('.step').style.border = '0px';
      } else if (val === 'done') {
        this.container.querySelector('.step').style.border = '2px solid var(--primary-color)';
        this.container.querySelector('.step').style.backgroundColor = 'var(--primary-color)';
      } else if (val === 'started') {
        this.container.querySelector('.step').style.border = '2px solid var(--active-color)';
        this.container.querySelector('.step').style.backgroundColor = 'var(--bg-color)';
      }
    }
  }

  get status() {
    return this.getString(attributes.STATUS, '');
  }
}

export default IdsProcessStep;
