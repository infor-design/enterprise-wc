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

const DEFAULT_VALUE = 50;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

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
    this.container.querySelector('.slider').style.setProperty("--value", DEFAULT_VALUE);
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
        <div class="tooltip">${this.value ?? DEFAULT_VALUE}</div>
        <input type="range" min="${this.min ?? DEFAULT_MIN}" max="${this.max ?? DEFAULT_MAX}" value="${this.value ?? DEFAULT_VALUE}" class="slider">
        <span class="range"></span>
        <span class="tick end"></span>
        <span class="tick start"></span>
        <ids-text label class="label">${this.min ?? DEFAULT_MIN}</ids-text>
      </div>
    </div>`;
  }

  set value(value) {
    this.setAttribute(attributes.VALUE, value || DEFAULT_VALUE);
    this.container.querySelector('.slider').setAttribute('value', this.value);
    this.container.querySelector('.slider').style.setProperty("--value", this.value);
    this.container.querySelector('.tooltip').style.setProperty("--value", this.value);
    this.container.querySelector('.tooltip').innerHTML = this.value;
  }

  get value() { return this.getAttribute(attributes.VALUE); }

  set min(value) {
    this.setAttribute(attributes.MIN, value || DEFAULT_MIN);
    this.container.querySelector('.label').innerHTML = this.min;
  }

  get min() { return this.getAttribute(attributes.MIN); }

  set max(value) {
    this.setAttribute(attributes.MAX, value || DEFAULT_MAX);
    // this.container.querySelector('.label').innerHTML = this.max;
  }

  get min() { return this.getAttribute(attributes.MIN); }

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

    this.onEvent('input', this.container.querySelector('.slider'), () => {
      this.setAttribute(attributes.VALUE, this.container.querySelector('.slider').value);
    })

    this.onEvent('click', this.container.querySelector('.slider'), () => {
      console.log('slider clicked')
      // this.container.querySelector('.slider').style.setProperty("border", "10px solid red")
    })
    return this;
  }
}

export default IdsSlider;
