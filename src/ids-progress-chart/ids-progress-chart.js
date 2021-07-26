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
      attributes.SIZE, // small or large
      attributes.TOTAL,
      attributes.PROGRESS,
      attributes.LABEL,
      attributes.LABEL_PROGRESS,
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
        <ids-text class="label-progress">${this.progressLabel} </ids-text>
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

      const completedLabel = this.container.querySelector('.label-progress');
      completedLabel.style.color = (prop.includes('warning') || prop.includes('caution') || prop.includes('danger')) && prop;

      const icon = this.container.querySelector('slot');
      icon.style.color = prop;
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
  set progress(value) {
    const prop = parseInt(value);
    let percentage = 10;

    if (prop > 0 && prop <= this.total) {
      this.setAttribute('progress', prop);
      percentage = Math.floor((prop / this.total) * 100);
    } else {
      // default progress is 10%
      this.setAttribute('progress', '10%');
    }

    const bar = this.container.querySelector('.bar-current');
    bar.style.width = `${percentage}%`;
  }

  get progress() { return this.getAttribute('progress'); }

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
  set progressLabel(value) {
    if (value) {
      this.setAttribute('label-progress', value);
      return;
    }
    this.setAttribute('label-progress', '');
  }

  get progressLabel() { return this.getAttribute('label-progress'); }

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
      // this.#handleEvents();
    }
  }

  /**
   * Check if an icon exists if so, remove it
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
