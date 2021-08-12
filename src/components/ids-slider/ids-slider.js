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

import styles from './ids-slider.scss';

/**
 * IDS Slider Component
 * @type {IdsSlider}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-slider')
@scss(styles)
class IdsSlider extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
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
      attributes.TYPE,
      attributes.COLOR,
      attributes.TOOLTIP,
      attributes.VALUE,
      attributes.MIN,
      attributes.MAX,
      attributes.STEP,
      attributes.LABEL,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `
    <div class="ids-slider">
      <div class="slidecontainer">
        <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
        <span class="tick end"></span>
        <span class="tick start"></span>
      </div>
    </div>`;
  }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value) {
    this.setAttribute(attributes.COLOR, value);
    // this.#updateColor();
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  #handleEvents() {
    return this;
  }
}

export default IdsSlider;
