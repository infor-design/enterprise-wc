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
    return '<span class="ids-progress-chart" part="tag"><slot></slot></span>';
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
      this.container.style.backgroundColor = prop;

      return;
    }

    this.removeAttribute('color');
    this.container.style.backgroundColor = '';
  }

  get color() { return this.getAttribute('color'); }
}

export default IdsProgressChart;
