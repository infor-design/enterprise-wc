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
    this.slider = this.container.querySelector('.slider');
    this.trackArea = this.container.querySelector('.track-area');
    this.thumb = this.container.querySelector('.thumb');
    this.thumbDraggable = this.container.querySelector('.thumb-draggable');
    // this.toolTipText = this.container.querySelector('.tooltip .text');

    this.#addEventListeners();
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
      attributes.PERCENT,
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
          <input hidden value="${this.valuea ?? DEFAULT_VALUE}" min="${this.min ?? DEFAULT_MIN}" max="${this.max ?? DEFAULT_MAX}"></input>
          <div class="track-area">
            <ids-draggable hidden tabindex="1" class="thumb-draggable" axis="x" parent-containment>
              <div class="thumb-shadow"></div>
              <div class="thumb">
                <div class="tooltip">
                  <ids-text class="text">${this.valuea ?? DEFAULT_VALUE}</ids-text>
                  <div class="pin"></div>
                </div>
              </div>
            </ids-draggable>
          </div>
          <div class="track">
            <div class="tick-container end">
              <span class="tick"></span>
            </div>
            <div class="tick-container start">
              <span class="tick"></span>
            </div>
          </div>
          <ids-text label class="label min">${this.min ?? DEFAULT_MIN}</ids-text>
          <ids-text label class="label max">${this.max ?? DEFAULT_MAX}</ids-text>
        </div>
      </div>
    `;
  }

  updateToolTip(value) {
    // console.log('updateToolTip() w value : ' + value);
    this.container.querySelector('.tooltip:nth-of-type(1) .text').innerHTML = Math.ceil(value);
    // this.container.querySelector('.tooltip:nth-of-type(1) .text').innerHTML = Math.ceil(this.valuea);
    //   this.container.querySelector('.tooltip:nth-of-type(2) .text').innerHTML = this.valueb;
    
  }
  
  updateProgressBar() {
    const range = this.max - this.min;
    // console.log('updating UI');
    // this.moveThumb();

    // if (this.type === 'single') {
    //   console.log('type is single')
      
      this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentStart", 0);
      this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentEnd", this.percent);
    // }
    
    // if (this.type === 'double') {
    //   console.log('type is double')
    //   const percentB = (this.valueb - this.min) / range * 100;
      // const percentA = (Math.ceil(this.valuea) - this.min) / range * 100;
      
      // const tooltipPosA = -10 - (percentA * 0.01);
      // const tooltipPosA = -12 - (percentA * 0.16);
    //   const tooltipPosB = -10 - (percentB * 0.2);
      
    //   console.log('percentB: ' + percentB);
    //   console.log('percentA: ' + percentA);
  
    //   // A
    //   this.container.querySelector('.slider:nth-of-type(1)').setAttribute('value', this.valuea);
    
    //   this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentStart", Math.min(percentB, percentA));
    //   this.container.querySelector('.slider:nth-of-type(1)').style.setProperty("--percentEnd", Math.max(percentB, percentA));
    
      // this.container.querySelector('.tooltip:nth-of-type(1)').style.setProperty("--percent", percentA);
      // this.container.querySelector('.tooltip:nth-of-type(1)').style.setProperty("--pos", tooltipPosA);
    
      
    //   // B
    //   // binding
    //   this.container.querySelector('.slider:nth-of-type(2)').setAttribute('value', this.valueb);
      
    //   // progress color track
    //   this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percentStart", Math.min(percentB, percentA));
    //   this.container.querySelector('.slider:nth-of-type(2)').style.setProperty("--percentEnd", Math.max(percentB, percentA));
    
    //   // tooltip positioning
    //   this.container.querySelector('.tooltip:nth-of-type(2)').style.setProperty("--percent", percentB);
    //   this.container.querySelector('.tooltip:nth-of-type(2)').style.setProperty("--pos", tooltipPosB);
      
    // }
    
  }

  set percent(value) {
    this.setAttribute('percent', value);
    this.updateProgressBar();
    this.updateToolTip(this.calcValueFromPercent(value));
  }

  get percent() { return this.getAttribute('percent') || (this.valuea - this.min) / (this.max - this.min) * 100; }

  set valueb(value) {
    this.setAttribute('valueb', value || DEFAULT_MAX);
    // this.updateProgressBar();
  }
  
  get valueb() { return this.getAttribute('valueb') || DEFAULT_MAX; }
  
  set valuea(value) {
    if (value <= this.max && value >= this.min) {
      this.setAttribute('valuea', value || DEFAULT_VALUE);
      this.setAttribute('percent', (this.valuea - this.min) / (this.max - this.min) * 100);
      // this.updateToolTip(value);
      this.moveThumb(); // change name to updateThumbPosition() ? 
    }
  }

  get valuea() { return this.getAttribute('valuea') || DEFAULT_VALUE; }

  set min(value) {
    this.setAttribute(attributes.MIN, value || DEFAULT_MIN);
    this.container.querySelector('.label.min').innerHTML = this.min;
  }

  get min() { return parseFloat(this.getAttribute(attributes.MIN)) || DEFAULT_MIN; }

  set max(value) {
    this.setAttribute(attributes.MAX, value || DEFAULT_MAX);
    this.container.querySelector('.label.max').innerHTML = this.max;
  }

  get max() { return parseFloat(this.getAttribute(attributes.MAX)) || DEFAULT_MAX; }

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
    console.log('hiding tool tip: '+ value);
      this.container.querySelector('.tooltip:nth-of-type(1)').style.opacity = value ? 0 : 1;
  }

  set hideTooltipB(value) {
      // this.container.querySelector('.tooltip:nth-of-type(2)').style.opacity = value ? 0 : 1;
    }

    wasCursorInBoundingBox(x, y, top, bottom, left, right) {
      return y >= top && y < bottom && x > left && x < right;
    }
    
    calculateUI(x, y) {  
    this.thumbDraggable.style.transition = 'transform 0.2s ease 0s';

    const top = this.trackBounds.TOP;
    const bottom = this.trackBounds.BOTTOM;
    const left = this.trackBounds.LEFT;
    const right = this.trackBounds.RIGHT;

    const clickedTrackArea = this.wasCursorInBoundingBox(x, y, top, bottom, left, right);

    // for single
    if (clickedTrackArea) {
      console.log('track area hit');
      this.hideTooltipA = false;
      const percent = this.calcPercentFromX(x, left, right, this.thumbDraggable.clientWidth);
      const value = this.calcValueFromPercent(percent);

      this.setAttribute('valuea', value);

      this.thumbDraggable.focus();
    } 
  }

  moveThumb() {
    // check to make sure trackBounds have been initialized
    if (this.trackBounds && this.trackBounds.LEFT && this.trackBounds.RIGHT) {
      const xTranslate = this.calcTranslateFromPercent(this.trackBounds.LEFT, this.trackBounds.RIGHT, this.percent);
      this.thumbDraggable.style.transform = `translate(${xTranslate}px, 0px)`;
    }
  }

  // based on percent, calculate that numerical value between min and max
  calcValueFromPercent(percent) {
    return (percent / 100 * (this.max - this.min)) + (this.min);
  }

  // based on percent, calculate how much the thumb should translate on the X-axis
  calcTranslateFromPercent(xStart, xEnd, percent) {
    const xCoord = Math.ceil(percent) / 100 * (xEnd - xStart);
    // the higher the number, the smoother the thumb will match the right position when moving towards 100% 
    const refinement = 100;
    // this is to account for the fact that the top left corner of the thumb gets translated
    // --thus it will be outside of the track if we translate it to the last pixel
    // .16 because the thumb is 16 pixels large
    const xPos = refinement*(percent * -.16/refinement);
    const xTranslate = xCoord + xPos;
    return xTranslate;
  }

  // based on mouse X click, figure out the percent of progress
  calcPercentFromX(x, xStart, xEnd, thumbWidth) {
    let percent = 0;
    // allow bigger hit areas for clicking the ends of the slider to round to 0 or 100, since the thumb takes up considerable space
    if (x - xStart < thumbWidth/2) {
      percent = 0;
    }
    else if (x - xStart > xEnd - thumbWidth/2 - xStart) {
      percent = 100;
    } else {
      percent = (x - xStart - thumbWidth/2) / (xEnd - thumbWidth/2 - xStart) * 100;
    }
    return percent;
  }

  #addEventListeners() {
    // init the this.trackBounds upon window load 
    window.onload = () => {
      this.trackBounds = {
        TOP: this.slider.offsetTop + this.trackArea.offsetTop, // top 0
        BOTTOM: this.slider.offsetTop - this.trackArea.offsetTop, // bottom 1
        LEFT: this.slider.offsetLeft, // left 2
        RIGHT: this.slider.offsetLeft + this.trackArea.clientWidth, // right 3
      };
      console.log('window.onload()')
      console.log(this.trackBounds);

      // update thumb now that bounds have been initialized
      this.moveThumb();
    }

    // update this.trackBounds with new values when window size changes
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          // console.log(entry.target.className)
          
          this.trackBounds = {
            TOP: this.slider.offsetTop + this.trackArea.offsetTop, // top 0
            BOTTOM: this.slider.offsetTop - this.trackArea.offsetTop, // bottom 1
            LEFT: this.slider.offsetLeft, // left 2
            RIGHT: this.slider.offsetLeft + this.trackArea.clientWidth, // right 3
          };
          // console.log('resizeObserver()')
          // console.log(this.trackBounds);
          this.moveThumb();
        }
      }
    });

    // don't think i need both of them...
    resizeObserver.observe(this.trackArea);
    // resizeObserver.observe(this.slider);


    // Listen for drag event on draggable thumb
    this.onEvent('ids-drag', this.thumbDraggable, (e) => {
      this.hideTooltipA = false;

      const percent = this.calcPercentFromX(e.detail.mouseX, this.trackBounds.LEFT, this.trackBounds.RIGHT, this.thumbDraggable.clientWidth);
      const value = this.calcValueFromPercent(percent);
      this.updateToolTip(value);
      // only set the percent -- because changing the value causes the moveThumb() to fire like crazy 
      // -- dragging becomes jittery because moveThumb() sets translate at the same time dragging sets translate
      this.setAttribute('percent', percent);
    });

    this.onEvent('ids-dragstart', this.thumbDraggable, () => {
      this.thumbDraggable.style.removeProperty('transition'); //disable transitions while dragging, doesn't quite work... css default style doesn't get removed
      this.thumbDraggable.blur();
    })
    this.onEvent('ids-dragend', this.thumbDraggable, (e) => {
      this.thumbDraggable.style.transition = 'transform 0.2s ease 0s';
      this.thumbDraggable.focus();
      // to ensure that after dragging, the value is updated..
      //  this is the roundabout solution to prevent the firing of moveThumb() every single ids-drag event
      // i don't really like this roundabout cause we're setting everything else BUT the value, which we save for the end...
      // but I can't think of anything better atm
      this.setAttribute('valuea', this.calcValueFromPercent(this.percent));
    })
    
    this.onEvent('focus', this.thumbDraggable, () => {
      this.container.querySelector('.thumb-shadow').removeAttribute('hidden');
    })
    this.onEvent('blur', this.thumbDraggable, () => {
      this.container.querySelector('.thumb-shadow').setAttribute('hidden', '');
    })
    
    // Listen for click events
    // check if click landed on ids-slider or outside of it
    this.onEvent('click', window, (event) => {
      const idsSliderSelected = event.target.name === 'ids-slider';
      console.log('idsSliderSelected: ' + idsSliderSelected);
      this.hideTooltipA = !idsSliderSelected;
      // console.log(event.target.name);
      // console.log(event.clientX + ', ' + event.clientY);
      this.calculateUI(event.clientX, event.clientY);

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
