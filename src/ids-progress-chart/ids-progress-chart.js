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

// Defaults
const DEFAULT_PROGRESS = 0;
const DEFAULT_TOTAL = 100;
const DEFAULT_COLOR = '#25af65';
const DEFAULT_SIZE = 'large';

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
      attributes.LABEL_PROGRESS,
      attributes.SIZE, // small or large
      attributes.TOTAL,
      attributes.PROGRESS,
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
        <ids-text class="label-progress">${this.progressLabel} </ids-text>
        <div class="label-end">
          <ids-text class="label-total">${this.totalLabel}</ids-text>
        </div>
      </div>
      <div class="bar">
        <div class="bar-total">
          <div class="bar-progress"></div>
        </div>
      </div>
    </div>`;
  }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value) {
    this.setAttribute(attributes.COLOR, value || DEFAULT_COLOR);
    this.updateUI(attributes.COLOR);
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  updateUI(setting) {
    if (setting === attributes.PROGRESS || setting === attributes.TOTAL) {
      const prog = parseFloat(this.progress) || DEFAULT_PROGRESS;
      const tot = parseFloat(this.total) || DEFAULT_TOTAL;
      // make sure that prog / tot doesn't exceed 1 -- will happen if prog > tot
      const percentage = Math.floor((prog / tot > 1 ? 1 : prog / tot) * 100);
      this.percentage = percentage;
      this.container.querySelector('.bar-progress').style.width = `${percentage}%`;
    }

    if (setting === attributes.SIZE) {
      const bar = this.container.querySelector('.bar');
      bar.style.minHeight = this.size === 'small' ? '10px' : '28px';
    }

    if (setting === attributes.COLOR) {
      let prop = this.color;

      if (this.color.includes('error') || this.color.includes('caution') || this.color.includes('warning') || this.color.includes('base') || this.color.includes('success')) {
        prop = `var(--ids-color-status-${this.color === 'error' ? 'danger' : this.color})`;

        // only color the icons and progress labels if it's error, caution, or warning
        if (this.color.includes('error') || this.color.includes('caution') || this.color.includes('warning')) {
          const completedLabel = this.container.querySelector('.label-progress');
          completedLabel.style.color = prop;

          const icon = this.container.querySelector('slot');
          icon.style.color = prop;
        }
      } else if (this.color.substr(0, 1) !== '#') {
        prop = `var(--ids-color-palette-${this.color})`;
      }

      const bar = this.container.querySelector('.bar-progress');
      bar.style.backgroundColor = prop;
    }
  }

  /**
   * Set the numeric value of progress that has been completed
   * @param {string} value The progress value, between 0 and the total
   */
  set progress(value) {
    const prop = (parseFloat(value) < 0 || Number.isNaN(parseFloat(value)))
      ? DEFAULT_PROGRESS
      : value;

    this.setAttribute(attributes.PROGRESS, prop);
    this.updateUI(attributes.PROGRESS);
  }

  get progress() { return this.getAttribute(attributes.PROGRESS); }

  /**
   * Set the total value of possible progress that can be completed
   * @param {string} value The total value, must be greater than or equal to the progress value
   */
  set total(value) {
    const prop = (parseFloat(value) < 0 || Number.isNaN(parseFloat(value)))
      ? DEFAULT_TOTAL
      : value;

    this.setAttribute(attributes.TOTAL, prop);
    this.updateUI(attributes.TOTAL);
  }

  get total() { return this.getAttribute(attributes.TOTAL); }

  /**
   * Set the label title of the bar
   * @param {string} value The title value, whatever you want to name the bar
   */
  set label(value) {
    this.setAttribute(attributes.LABEL, value || '');
  }

  get label() { return this.getAttribute(attributes.LABEL); }

  /**
   * Set the label of completed progress--useful for displaying units
   * @param {string} value The label for completed progress (i.e. 13 hours)
   */
  set progressLabel(value) {
    this.setAttribute(attributes.LABEL_PROGRESS, value || '');
  }

  get progressLabel() { return this.getAttribute(attributes.LABEL_PROGRESS); }

  /**
   * Set the label of total possible progress--useful for displaying units
   * @param {string} value The label for total progress (i.e. 26 hours)
   */
  set totalLabel(value) {
    this.setAttribute(attributes.LABEL_TOTAL, value || '');
  }

  get totalLabel() { return this.getAttribute(attributes.LABEL_TOTAL); }

  /**
   * Set the size of the progress bar (small, or large (default)
   * @param {string} value The size of the progress bar
   */
  set size(value) {
    const prop = value === 'small' ? value : DEFAULT_SIZE;
    this.setAttribute(attributes.SIZE, prop);
    this.updateUI(attributes.SIZE);
  }

  get size() { return this.getAttribute(attributes.SIZE); }

  #handleEvents() {
    return this;
  }
}

export default IdsProgressChart;
