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
const statuses = ['cancelled', 'started', 'done'];

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
    const val = value.toLowerCase();

    if (statuses.includes(val)) {
      this.setString(attributes.STATUS, val);

      let idsIcons = this.container.querySelectorAll('ids-icon');
      idsIcons.forEach((icon) => icon.remove());

      if (val === 'cancelled') {
        this.container.querySelector('.step').insertAdjacentHTML('beforeend', `<ids-icon icon="" size="small"></ids-icon>`);
        this.container.querySelector('ids-icon').style.display = 'flex';
        this.container.querySelector('ids-icon').style.justifyContent = 'center';
        this.container.querySelector('ids-icon').style.transform = 'translate(0, 4px)';
        this.container.querySelector('.step').style.height = '18px';
        this.container.querySelector('.step').style.width = '18px';
        this.container.querySelector('ids-icon').setAttribute('icon', 'close');
        this.container.querySelector('ids-icon').style.color = 'white';
        this.container.querySelector('.step').style.backgroundColor = 'red';
        this.container.querySelector('.step').style.border = '0px';
      } else if (val === 'done') {
        this.container.querySelector('.step').style.border = '2px solid blue';
        this.container.querySelector('.step').style.backgroundColor = 'blue';
      } else if (val === 'started') {
        this.container.querySelector('.step').style.border = '2px solid blue';
        this.container.querySelector('.step').style.backgroundColor = 'white';
      }
    }
  }

  get status() { return this.getString(attributes.STATUS, 'empty status'); }

}

export default IdsProgressStep;
