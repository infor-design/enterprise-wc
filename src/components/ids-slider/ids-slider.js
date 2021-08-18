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
      // attributes.VALUE,
      'valuea',
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
        <div class="slider">
          <div class="tooltip">
            <div class="pin"></div>
          </div>
          <div class="track-area">
            <ids-draggable axis="x" parent-containment>
              <div class="thumb"></div>
            </ids-draggable>
          </div>
          <div class="track"></div>
          <div class="tick-container end">
            <span class="tick"></span>
          </div>
          <div class="tick-container start">
            <span class="tick"></span>
          </div>
          <ids-text label class="label min">${this.min ?? DEFAULT_MIN}</ids-text>
          <ids-text label class="label max">${this.max ?? DEFAULT_MAX}</ids-text>
        </div>
      </div>
    `;
  }

  updateUI() {
    console.log('updating UI');

    const range = this.max - this.min;

    // if (this.type === 'single') {
    //   console.log('type is single')
      
    //   this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentStart", 0);
    //   this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentEnd", percentA);
    // }
    
    // if (this.type === 'double') {
    //   console.log('type is double')
    //   const percentB = (this.valueb - this.min) / range * 100;
    //   const percentA = (this.valuea - this.min) / range * 100;
      
    //   const tooltipPosA = -10 - (percentA * 0.2);
    //   const tooltipPosB = -10 - (percentB * 0.2);
      
    //   console.log('percentB: ' + percentB);
    //   console.log('percentA: ' + percentA);
  
    //   // A
    //   this.container.querySelector('.slider:nth-of-type(1)').setAttribute('value', this.valuea);
    
    //   this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentStart", Math.min(percentB, percentA));
    //   this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentEnd", Math.max(percentB, percentA));
    
    //   this.container.querySelector('.tooltip:nth-of-type(1)').style.setProperty("--percent", percentA);
    //   this.container.querySelector('.tooltip:nth-of-type(1)').style.setProperty("--pos", tooltipPosA);
    
    //   this.container.querySelector('.tooltip:nth-of-type(1) .text').innerHTML = this.valuea;
      
    //   // B
    //   // binding
    //   this.container.querySelector('.slider:nth-of-type(2)').setAttribute('value', this.valueb);
      
    //   // progress color track
    //   this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percentStart", Math.min(percentB, percentA));
    //   this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percentEnd", Math.max(percentB, percentA));
    
    //   // tooltip positioning
    //   this.container.querySelector('.tooltip:nth-of-type(2)').style.setProperty("--percent", percentB);
    //   this.container.querySelector('.tooltip:nth-of-type(2)').style.setProperty("--pos", tooltipPosB);
      
    //   this.container.querySelector('.tooltip:nth-of-type(2) .text').innerHTML = this.valueb;
    // }
    
  }

  set valueb(value) {
    this.setAttribute('valueb', value || DEFAULT_MAX);
    this.updateUI();
  }
  
  get valueb() { return this.getAttribute('valueb') || DEFAULT_MAX; }
  
  set valuea(value) {
    this.setAttribute('valuea', value || DEFAULT_VALUE);
    this.updateUI();
  }

  get valuea() { return this.getAttribute('valuea') || DEFAULT_VALUE; }

  set min(value) {
    this.setAttribute(attributes.MIN, value || DEFAULT_MIN);
    this.container.querySelector('.label .min').innerHTML = this.min;
  }

  get min() { return this.getAttribute(attributes.MIN) || DEFAULT_MIN; }

  set max(value) {
    this.setAttribute(attributes.MAX, value || DEFAULT_MAX);
    this.container.querySelector('.label .max').innerHTML = this.max;
  }

  get max() { return this.getAttribute(attributes.MIN) || DEFAULT_MAX; }

  set type(value) {
    if (value && TYPES.includes(value)) {
      this.setAttribute(attributes.TYPE, value);

      // if (value === 'single') {
      //   this.container.querySelector('.tooltip:nth-of-type(2)').remove();
      //   this.container.querySelector('.slider:nth-of-type(2)').remove();
      // }
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

  set hideTooltipA(value) {
      // this.container.querySelector('.tooltip:nth-of-type(1)').style.opacity = value ? 0 : 1;
  }

  set hideTooltipB(value) {
      // this.container.querySelector('.tooltip:nth-of-type(2)').style.opacity = value ? 0 : 1;
  }

  #handleEvents() {

    // when dragging thumb, show tool tip, change value(s)
    // when ids-slider clicked, show tool tip
    // when clicked outside, hide tool tip
    

    // check if click landed on ids-slider or outside of it
    window.addEventListener('click', (event) => {
      const idsSliderSelected = document.activeElement.className === 'ids-slider';
      console.log('ids-slider was clicked: ');
      console.log(document.activeElement);

      console.log(event.clientX + ", " + event.clientY)
      console.log(event.pageX + ", " + event.pageY)
    //   // tooltip styling for single and double
    //   if (this.type === 'single' || this.type === 'double')
    //   this.hideTooltipA = !idsSliderSelected;

    //   if (this.type === 'double') {
    //     this.hideTooltipB = !idsSliderSelected;
    //   }

    //   // shadow styles for single
    //   if (this.type === 'single') {
    //     if (idsSliderSelected) {
    //       this.container.querySelector('.slider:hover').style.removeProperty('box-shadow')
    //       this.container.querySelector('.slider').style.setProperty('--hover-shadow', 'rgb(0 114 237 / 10%) 0px 0px 0px 8px')
    //       this.container.querySelector('.slider').style.setProperty('--focus-shadow', 'rgb(0 114 237 / 10%) 0px 0px 0px 8px')
    //     } else {
    //       this.container.querySelector('.slider').style.setProperty('--focus-shadow', '');
    //       this.container.querySelector('.slider').style.setProperty('--hover-shadow', '0 2px 5px rgb(0 0 0 / 20%)');
    //     }
    //   }
    })
    return this;
  }
}

export default IdsSlider;
