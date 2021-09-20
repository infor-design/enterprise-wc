import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../../mixins';

import styles from './ids-process-step.scss';

// TODO: might not need IdsEventsMixin

/**
 * IDS Process Step Component
 * @type {IdsProgressStep}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */

@customElement('ids-process-step')
@scss(styles)
class IdsProgressStep extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
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
          <ids-text class="label">${this.label}</ids-text>
          <div class="details">
            <slot></slot>
          </div>
      </div>
    `;
  }

  setString(attribute, value) {
    if (value) {
      this.setAttribute(attribute, value);
    } else {
      this.setAttribute(attribute, '');
    }
  }

  getString(attribute, defaultValue) {
    const result = this.getAttribute(attribute) || (defaultValue ?? '');;
    return result;
  }

  set label(value) {
    this.setString(attributes.LABEL, value);
  }

  get label() { return this.getString(attributes.LABEL, 'empty label'); }

  set status(value) {
    this.setString(attributes.STATUS, value);
    if (value === 'cancelled') {
      this.container.querySelector('.step').insertAdjacentHTML('beforeend', `<ids-icon icon="close" size="small"></ids-icon>`);
      this.container.querySelector('ids-icon').style.display = 'flex';
      this.container.querySelector('ids-icon').style.justifyContent = 'center';
      this.container.querySelector('ids-icon').style.transform = 'translate(0, 4px)';
      this.container.querySelector('ids-icon').style.color = 'white';
      this.container.querySelector('.step').style.backgroundColor = 'red';
      this.container.querySelector('.step').style.height = '18px';
      this.container.querySelector('.step').style.width = '18px';
    }
  }

  get status() { return this.getString(attributes.STATUS, 'empty status'); }

}

export default IdsProgressStep;
