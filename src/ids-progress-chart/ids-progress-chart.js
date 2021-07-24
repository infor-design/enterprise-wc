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
      // completed-label
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
        ${this.completedLabel && `<ids-text class="label-completed">${this.completedLabel} </ids-text>` }
        ${this.value && `<ids-text class="label-value">${this.value} </ids-text>` }
        ${this.total && `<ids-text class="label-total">${this.total}</ids-text>` }
      </div>
      <div class="progress-bar">
        <div part="barcolor" class="bar-total">
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

      // check if the color param starts with #, else use some ids-color-status (not sure what error or danger is tho)
      const prop = value.substr(0, 1) === '#' ? value : `var(--ids-color-status-${value === 'error' ? 'danger' : value})`;
      
      // TODO: figure out how to grab the .bar-current to set its background color
      const progressChart = document.getElementsByClassName('.ids-progress-chart');
      // const progressBar = progressChart.querySelector('.progress-bar');
      // const progressBarCurrent = progressBar.querySelector('.bar-current');
      // this.progressBarCurrent.style.backgroundColor = prop;
      // this.container.style.backgroundColor = prop;
      // progressChart.style.backgroundColor = prop;

      return;
    }

    this.removeAttribute('color');
    this.container.style.backgroundColor = '';
  }

  get color() { return this.getAttribute('color'); }

  set label(value) {
    if (value) {
      this.setAttribute('label', value);

      return;
    }

    // TODO: why does this still show null? 
    this.removeAttribute('label');
  }

  get label() { return this.getAttribute('label'); }

  set value(value) {
    if (value) {
      this.setAttribute('value', value);

      return;
    }
    this.removeAttribute('value');
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
