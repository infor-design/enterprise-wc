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
      attributes.LABEL,
      attributes.LABEL_TOTAL,
      attributes.LABEL_VALUE,
      attributes.SIZE, // small or large
      attributes.TOTAL,
      attributes.VALUE,
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
        <ids-text class="label-main">${this.label}</ids-test>
        <slot></slot>
        <ids-text class="label-value">${this.valueLabel} </ids-text>
        <div class="label-end">
          <ids-text class="label-total">${this.totalLabel}</ids-text>
        </div>
      </div>
      <div class="progress-bar">
        <div class="bar-total">
          <div class="bar-value"></div>
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

      let prop = value;

      if (value.includes('error') || value.includes('caution') || value.includes('warning') || value.includes('base') || value.includes('success')) {
        prop = `var(--ids-color-status-${value === 'error' ? 'danger' : value})`;

        // only color the icons and progress labels if it's error, caution, or warning
        if (value.includes('error') || value.includes('caution') || value.includes('warning')) {
          const completedLabel = this.container.querySelector('.label-value');
          completedLabel.style.color = prop;

          const icon = this.container.querySelector('slot');
          icon.style.color = prop;
        }
      } else if (value.substr(0, 1) !== '#') {
        prop = `var(--ids-color-palette-${value})`;
      }

      const bar = this.container.querySelector('.bar-value');
      bar.style.backgroundColor = prop;
    }
  }

  get color() { return this.getAttribute('color'); }

  /**
   * Set the label title of the bar
   * @param {string} value The title value, whatever you want to name the bar
   */
  set label(value) {
    if (value) {
      this.setAttribute('label', value);

      return;
    }

    this.setAttribute('label', '');
  }

  get label() { return this.getAttribute('label'); }

  /**
   * Set the numeric value of progress that has been completed
   * @param {string} value The progress value, between 0 and the total
   */
  set value(value) {
    const prop = parseInt(value);
    let percentage = 10;

    if (prop > 0 && prop <= this.total) {
      this.setAttribute('value', prop);
      percentage = Math.floor((prop / this.total) * 100);
    } else {
      this.setAttribute('value', '0%');
    }

    const bar = this.container.querySelector('.bar-value');
    bar.style.width = `${percentage}%`;
  }

  get value() { return this.getAttribute('value'); }

  /**
   * Set the total value of possible progress that can be completed
   * @param {string} value The total value, must be greater than or equal to the progress value
   */
  set total(value) {
    if (value) {
      this.setAttribute('total', value);

      return;
    }
    this.removeAttribute('total');
  }

  get total() { return this.getAttribute('total'); }

  /**
   * Set the label of completed progress--useful for displaying units
   * @param {string} value The label for completed progress (i.e. 13 hours)
   */
  set valueLabel(value) {
    if (value) {
      this.setAttribute('label-value', value);
      return;
    }
    this.setAttribute('label-value', '');
  }

  get valueLabel() { return this.getAttribute('label-value'); }

  /**
   * Set the label of total possible progress--useful for displaying units
   * @param {string} value The label for total progress (i.e. 26 hours)
   */
  set totalLabel(value) {
    if (value) {
      this.setAttribute('label-total', value);
      return;
    }
    this.setAttribute('label-total', '');
  }

  get totalLabel() { return this.getAttribute('label-total'); }


  /**
   * Set the size of the progress bar (small, or large (default)
   * @param {string} value The size of the progress bar
   */
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

  #handleEvents() {
    return this;
  }
}

export default IdsProgressChart;
