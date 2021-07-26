import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-progress-chart.scss';

/**
 * IDS Progress Chart Component
 * @type {IdsProgressChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-progress-chart')
@scss(styles)
class IdsProgressChart extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    this.#handleEvents();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR,
      attributes.SIZE, // small or normal
      attributes.TOTAL, // integer amt for whole bar (?)
      attributes.VALUE, // curent progress value
      attributes.LABEL,
      'completed-label',
      // error-label
      // icon
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
    <div class="ids-progress-chart" part="chart">
      <div class="labels">
        ${this.label && `<ids-text class="label-main">${this.label}</ids-test>` }
        <slot></slot>
        <ids-text class="label-completed">${this.completedLabel} </ids-text>
        <ids-text class="label-value">${this.value ? this.value : ''} </ids-text>
        <ids-text class="label-total">${this.total}</ids-text>
      </div>
      <div class="progress-bar">
        <div class="bar-total">
          <div class="bar-current"></div>
        </div>
      </div>
    </div>`;
  }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value) {
    if (value) {
      this.setAttribute('color', value);

      const prop = value.substr(0, 1) === '#' ? value : `var(--ids-color-status-${value === 'error' ? 'danger' : value})`;

      const bar = this.container.querySelector('.bar-current');
      bar.style.backgroundColor = prop;

      // TODO: this label's color doesn't get set for some reason
      const completedLabel = this.container.querySelector('.label-completed');
      completedLabel.style.color = prop;

      const icon = this.container.querySelector('slot');
      icon.style.color = prop;
    }
  }

  get color() { return this.getAttribute('color'); }

  set label(value) {
    if (value) {
      this.setAttribute('label', value);

      return;
    }

    this.setAttribute('label', '');
  }

  get label() { return this.getAttribute('label'); }

  set value(value) {
    const prop = parseInt(value);
    let percentage = 10;

    if (prop > 0 && prop <= this.total) {
      this.setAttribute('value', prop);
      percentage = Math.floor((prop / this.total) * 100);
    } else {
      // default progress is 10%
      this.setAttribute('value', '10%');
    }

    const bar = this.container.querySelector('.bar-current');
    bar.style.width = `${percentage}%`;
  }

  get value() { return this.getAttribute('value'); }

  set total(value) {
    if (value) {
      this.setAttribute('total', value);

      return;
    }
    this.removeAttribute('total');
  }

  get total() { return this.getAttribute('total'); }

  set completedLabel(value) {
    if (value) {
      this.setAttribute('completed-label', value);
      return;
    }
    this.removeAttribute('completed-label');
  }

  get completedLabel() { return this.getAttribute('completed-label'); }

  set size(value) {
    if (value) {
      this.setAttribute('size', value);
      const bar = this.container.querySelector('.progress-bar');
      bar.style.minHeight = value === 'small' ? '10px' : '28px';
      return;
    }
    this.removeAttribute('size');
  }

  get size() { return this.getAttribute('size'); }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  #appendIcon(iconName) {
    const icon = this.querySelector(`[icon="${iconName}"]`);
    if (!icon) {
      const labels = this.querySelector('.label-main');
      labels.insertAdjacentHTML('afterend', `<ids-icon part="icon" icon="${iconName}" size="small" class="ids-icon"></ids-icon>`);
      labels.backgroundColor = '#FF0000';
      this.#handleEvents();
    }
  }

  /**
   * Check if an icon exists if not add it
   * @param {string} iconName The icon name to check
   * @private
   */
  #removeIcon(iconName) {
    const icon = this.querySelector(`[icon="${iconName}]`);
    if (icon) {
      icon.remove();
    }
  }

  #handleEvents() {
    return this;
  }
}

export default IdsProgressChart;
