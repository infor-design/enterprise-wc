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

const TYPES = [
  'single',
  'double',
  'step',
  'vertical'
]

const DEFAULT_VALUE = 50;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_TYPE = TYPES[0];

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
      'valueb',
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
        <div class="tooltip">
          <ids-text class="text">${this.value ?? DEFAULT_VALUE}</ids-text>
          <div class="pin"></div>
        </div>
        <input class="slider" type="range" min="${this.min ?? DEFAULT_MIN}" max="${this.max ?? DEFAULT_MAX}" value="${this.value ?? DEFAULT_VALUE}">
        <div class="tooltip second">
          <ids-text class="text">${this.valueb ?? DEFAULT_MAX}</ids-text>
          <div class="pin"></div>
        </div>
        <input class="slider second" type="range" min="${this.min ?? DEFAULT_MIN}" max="${this.max ?? DEFAULT_MAX}" value="${this.valueb ?? DEFAULT_MAX}">
        <span class="range"></span>
        <div class="tick-container end">
          <span class="tick"></span>
        </div>
        <div class="tick-container start">
          <span class="tick"></span>
        </div>
        <ids-text label class="label min">${this.min ?? DEFAULT_MIN}</ids-text>
        <ids-text label class="label max">${this.max ?? DEFAULT_MAX}</ids-text>
      </div>
    </div>`;
  }

  set valueb(value) {
    this.setAttribute('valueb', value || DEFAULT_MAX);

    const range = this.max - this.min
    
    const percentB = (this.valueb - this.min) * 100 / range;
    const tooltipPos = -10 - (percentB * 0.2);
    // const progress = (this.valueb - this.valuea) / range;
    const percentA = (this.value - this.min) * 100 / range;

    console.log('percentB: ' + percentB);
    console.log('percentA: ' + percentA);
    
    // binding
    this.container.querySelector('.slider:nth-of-type(2)').setAttribute('value', this.valueb);
    
    // this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percent", percentB);

    // progress color track
    this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percentStart", Math.min(percentB, percentA));
    this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percentEnd", Math.max(percentB, percentA));

    // tooltip positioning
    this.container.querySelector('.tooltip:nth-of-type(2)').style.setProperty("--percent", percentB);
    this.container.querySelector('.tooltip:nth-of-type(2)').style.setProperty("--pos", tooltipPos);
    
    this.container.querySelector('.tooltip:nth-of-type(2) .text').innerHTML = this.valueb;
  }
  
  get valueb() { return this.getAttribute('valueb') || DEFAULT_MAX; }
  
  set value(value) {
    this.setAttribute(attributes.VALUE, value || DEFAULT_VALUE);

    const percentA = (this.value - this.min) * 100 / (this.max - this.min);
    const tooltipPos = -10 - (percentA * 0.2);

    this.container.querySelector('.slider:nth-of-type(1)').setAttribute('value', this.value);

    if(this.type === 'single') {
      this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentStart", 0);
      this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentEnd", percentA);
    } else if (this.type === 'double') {
      const percentB = (this.valueb - this.min) * 100 / (this.max - this.min);
      this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentStart", Math.min(percentB, percentA));
    }
    this.container.querySelector('.tooltip:nth-of-type(1)').style.setProperty("--percent", percentA);
    this.container.querySelector('.tooltip:nth-of-type(1)').style.setProperty("--pos", tooltipPos);

    this.container.querySelector('.tooltip:nth-of-type(1) .text').innerHTML = this.value;
  }

  get value() { return this.getAttribute(attributes.VALUE) || DEFAULT_VALUE; }

  set min(value) {
    this.setAttribute(attributes.MIN, value || DEFAULT_MIN);
    this.container.querySelector('.label').innerHTML = this.min;
  }

  get min() { return this.getAttribute(attributes.MIN) || DEFAULT_MIN; }

  set max(value) {
    this.setAttribute(attributes.MAX, value || DEFAULT_MAX);
    // this.container.querySelector('.label').innerHTML = this.max;
  }

  get max() { return this.getAttribute(attributes.MIN) || DEFAULT_MAX; }

  set type(value) {
    console.log('type is ' + value);
    if (value && TYPES.includes(value)) {
      console.log('valid type');
      this.setAttribute(attributes.TYPE, value);
      if (value === 'single') {
        this.container.querySelector('.tooltip:nth-of-type(2)').remove();
        this.container.querySelector('.slider:nth-of-type(2)').remove();
      }
    } else {
      this.setAttribute(attributes.TYPE, DEFAULT_TYPE);
    }
  }
  
  get type() { return this.getAttribute(attributes.TYPE)}

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value) {
    this.setAttribute(attributes.COLOR, value);
    // this.#updateColor();
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  set hideTooltip(value) {
    if (!value) {
      this.container.querySelector('.tooltip').style.opacity = 1;
    } else {
      this.container.querySelector('.tooltip').style.opacity = 0;
    }
  }

  set hideTooltipB(value) {
    if (!value) {
      this.container.querySelector('.tooltip:nth-of-type(2)').style.opacity = 1;
    } else {
      this.container.querySelector('.tooltip:nth-of-type(2)').style.opacity = 0;
    }
  }

  #handleEvents() {

    this.onEvent('input', this.container.querySelector('.slider:nth-of-type(1)'), () => {
      const val = this.container.querySelector('.slider:nth-of-type(1)').value;
      this.setAttribute('value', val);
      this.hideTooltip = false;
      this.container.querySelector('.tooltip:nth-of-type(1)').style.zIndex = 2;
      this.container.querySelector('.tooltip:nth-of-type(2)').style.zIndex = 1;
    })
    
    this.onEvent('input', this.container.querySelector('.slider:nth-of-type(2)'), () => {
      const val = this.container.querySelector('.slider:nth-of-type(2)').value;
      this.setAttribute('valueb', val);
      this.hideTooltipB = false;
      this.container.querySelector('.tooltip:nth-of-type(2)').style.zIndex = 2;
      this.container.querySelector('.tooltip:nth-of-type(1)').style.zIndex = 1;
    })

    this.onEvent('click', this.container.querySelector('.slider'), () => {
      this.hideTooltip = false;
      this.hideTooltipB = false;
    })

    window.addEventListener('click', () => {
      const idsSliderSelected = document.activeElement.name === 'ids-slider';

      this.hideTooltip = !idsSliderSelected;
      this.hideTooltipB = !idsSliderSelected;

      if (idsSliderSelected) {
        this.container.querySelector('.slider:hover').style.removeProperty('box-shadow')
        this.container.querySelector('.slider').style.setProperty('--hover-shadow', 'rgb(0 114 237 / 10%) 0px 0px 0px 8px')
        this.container.querySelector('.slider').style.setProperty('--focus-shadow', 'rgb(0 114 237 / 10%) 0px 0px 0px 8px')
      } else {
        this.container.querySelector('.slider').style.setProperty('--focus-shadow', '');
        this.container.querySelector('.slider').style.setProperty('--hover-shadow', '0 2px 5px rgb(0 0 0 / 20%)');
      }
    })
    return this;
  }
}

export default IdsSlider;
