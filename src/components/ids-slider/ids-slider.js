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

const DEFAULT_VALUE = 0;
const DEFAULT_VALUE_SECONDARY = 75;
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
    this.progressTrack = this.container.querySelector('.track-progress');

    this.thumb = this.container.querySelector('.thumb');
    this.thumbDraggable = this.container.querySelector('.thumb-draggable');
    this.thumbShadow = this.container.querySelector('.thumb-shadow');
    this.tooltip = this.container.querySelector('.tooltip:nth-of-type(1)');
    this.tooltipText = this.container.querySelector('.tooltip:nth-of-type(1) .text');
    
    if (this.type === 'double') {
      this.thumbSecondary = this.container.querySelector('.thumb:nth-of-type(2)');
      this.thumbDraggableSecondary = this.container.querySelector('.thumb-draggable:nth-of-type(2)');
      this.thumbShadowSecondary = this.container.querySelector('.thumb-shadow.secondary');
      this.tooltipSecondary = this.container.querySelector('.tooltip.secondary')
      this.tooltipTextSecondary = this.container.querySelector('.tooltip.secondary .text.secondary');
    } else if (this.type !== 'double') {
      this.container.querySelector('.thumb-draggable:nth-of-type(2)').remove();
    }

    if (this.type === 'step') {
      this.tickContainerStep = this.container.querySelector('.tick-container.step');
      this.container.querySelector('.tick-container.end').remove();
      this.container.querySelector('.tick-container.start').remove();
    } else {
      this.container.querySelector('.tick-container.step').remove();
    }

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
      'percentb',
      attributes.STEP_NUMBER,
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
              <div hidden class="thumb-shadow"></div>
              <div class="thumb">
                <div class="tooltip">
                  <ids-text class="text">${this.valuea ?? DEFAULT_VALUE}</ids-text>
                  <div class="pin"></div>
                </div>
              </div>
            </ids-draggable>
            <ids-draggable hidden tabindex="2" class="thumb-draggable secondary" axis="x" parent-containment>
              <div hidden class="thumb-shadow secondary"></div>
              <div class="thumb secondary">
                <div class="tooltip secondary">
                  <ids-text class="text secondary">${this.valueb ?? DEFAULT_VALUE_SECONDARY}</ids-text>
                  <div class="pin secondary"></div>
                </div>
              </div>
            </ids-draggable>
          </div>
          <div class="track">
          <div class="track-progress"></div>
            <div class="tick-container end">
              <span class="tick"></span>
            </div>
            <div class="tick-container start">
              <span class="tick"></span>
            </div>
            <div class="tick-container step">
              <span class="tick"></span>
              <span class="tick"></span>
            </div>
          </div>
          <ids-text label class="label min">${this.min ?? DEFAULT_MIN}</ids-text>
          <ids-text label class="label max">${this.max ?? DEFAULT_MAX}</ids-text>
        </div>
      </div>
    `;
  }

  #updateToolTip(value, primaryOrSecondary) {
    if (this.type === 'step') {
      this.tooltipText.innerHTML = Math.ceil(value);
    } else {
     if (primaryOrSecondary === 'secondary') {
       this.#hideTooltip(false, 'secondary');
      //  const tooltipTextSecondary = this.container.querySelector('.tooltip.secondary .text.secondary');
       this.tooltipTextSecondary.innerHTML = Math.ceil(value);
     } else {
       this.#hideTooltip(false);
       this.tooltipText.innerHTML = Math.ceil(value);
     }
    }
  }
  
  #updateProgressBar() {
    if (this.type === 'single' || this.type === 'step') {
      this.slider.style.setProperty("--percentStart", 0);
      this.slider.style.setProperty("--percentEnd", this.percent);

    } else if (this.type === 'double') {
        this.slider.style.setProperty("--percentStart", Math.min(this.percentb, this.percent));
        this.slider.style.setProperty("--percentEnd", Math.max(this.percentb, this.percent));
        this.progressTrack.style.setProperty('left', `${Math.min(this.percent, this.percentb)}%`)
    }
  }

  #setStepLabels(array) {
    // set innerHTML of whatever div element attached to tick 
  }

  set stepNumber(value) {
    if (this.type === 'step') {
      // must have at least 2 steps
      if (value >= 2) {
        this.setAttribute('step-number', value);
        const stepLength = this.container.querySelectorAll('.tick').length;
        // check that step number equals amount of ticks in the slider
        if (stepLength !== this.stepNumber) {
          const x = Math.abs(stepLength - this.stepNumber);
          for (let i = 0; i < x; i++) {
            // remove
            stepLength > this.stepNumber ? this.container.querySelector('.tick').remove() : this.container.querySelector('.tick').insertAdjacentHTML('afterend', '<span class="tick"></span>');
          }
        }
      }
    }
  }

  get stepNumber() { return parseInt(this.getAttribute('step-number')) || 2; }

  set percentb(value) {
    this.setAttribute('percentb', value);
    this.#updateProgressBar();
    this.#updateToolTip(this.#calcValueFromPercent(value), 'secondary');
  }

  get percentb() { 
    if (this.getAttribute('percentb')) {
      return this.getAttribute('percentb');
    } else {
      if (this.#withinBounds(this.valueb)) {
        return (this.valueb - this.min) / (this.max - this.min) * 100;
      } else {
        return 0;
      }
    }
  }
  set percent(value) {
    this.setAttribute('percent', value);
    this.#updateProgressBar();
    this.#updateToolTip(this.#calcValueFromPercent(value));
  }

  get percent() { 
    if (this.getAttribute('percent')) {
      return this.getAttribute('percent');
    } else {
      if (this.#withinBounds(this.valuea)) {
        return (this.valuea - this.min) / (this.max - this.min) * 100;
      } else {
        return 0;
      }
    }
  }

  #withinBounds(value) {
    return parseFloat(value) >= this.min && parseFloat(value) <= this.max;
  }

  set valueb(value) {
    if (this.#withinBounds(value)) {
      this.setAttribute('valueb', value);
      this.setAttribute('percentb', (this.valueb - this.min) / (this.max - this.min) * 100);
      this.#updateToolTip(value, 'secondary');
      this.#moveThumb('secondary');
    } else {
      if (value < this.min) {
        this.setAttribute('valueb', this.min);
      } else if (value > this.max) {
        this.setAttribute('valueb', this.max)
      }
    }
  }
  
  get valueb() { 
    const b = this.getAttribute('valueb')
    if (b === null || b === '' || Number.isNaN(parseFloat(b))) {
      return DEFAULT_VALUE_SECONDARY;
    } else {
      return parseFloat(this.getAttribute('valueb')); 
    }
  }

  
  set valuea(value) {
    if (this.#withinBounds(value)) {
      this.setAttribute('valuea', value);
      this.setAttribute('percent', (this.valuea - this.min) / (this.max - this.min) * 100);
      this.#updateToolTip(value);
      this.#moveThumb();
    } else {
      if (value < this.min) {
        this.setAttribute('valuea', this.min);
      } else if (value > this.max) {
        this.setAttribute('valuea', this.max)
      }
    }
  }

  get valuea() { 
    const a = this.getAttribute('valueb')
    if (a === null || a === '' || Number.isNaN(parseFloat(a))) {
      return DEFAULT_VALUE;
    } else {
      return parseFloat(this.getAttribute('valuea')); 
    }
  }

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
    } else {
      this.setAttribute(attributes.TYPE, DEFAULT_TYPE);
    }
  }
  
  get type() { return this.getAttribute(attributes.TYPE) || DEFAULT_TYPE }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value) {
    this.setAttribute(attributes.COLOR, value);
  }

  get color() { return this.getAttribute(attributes.COLOR) || DEFAULT_COLOR; }

  #updateColor() {
    const color = this.color;
    const ticks = this.container.querySelectorAll('.tick');
    ticks.forEach((tick) => {
      tick.style.setProperty('background-color', color);
    });
    this.thumb.style.setProperty('background-color', color);
    const rgbString = window.getComputedStyle(this.thumb).backgroundColor;
    // have to specify opacity in background-color, otherwise the opacity affects the ring border
    const rgbaString = rgbString.slice(0, 3) + 'a' + rgbString.slice(3, rgbString.length-1) + ', 0.1)';
    this.thumbShadow.style.setProperty('background-color', rgbaString);
    this.thumbShadow.style.setProperty('border', `1px ${color} solid`);
    this.progressTrack.style.setProperty('background-color', color);
    
    if (this.type === 'double' && this.thumbShadowSecondary) {
      this.thumbShadowSecondary.style.setProperty('background-color', rgbaString);
      this.thumbShadowSecondary.style.setProperty('border', `1px ${color} solid`);
      this.thumbSecondary.style.setProperty('background-color', color);
    }
  }

  #hideTooltip(value, primaryOrSecondary) {
    if (primaryOrSecondary ==='secondary' && this.tooltipSecondary) {
      this.tooltipSecondary.style.opacity = value ? 0 : 1;
    }
     else {
      this.tooltip.style.opacity = value ? 0 : 1;
    }
  }
  
  // TODO: when hide shadow is false, set the z-index to be higher than the other, when type === 'double' -- this is for when you use arrow keys and they overlap
  #hideThumbShadow(value, primaryOrSecondary) {
    if (primaryOrSecondary === 'secondary' && this.thumbShadowSecondary) {
      value ? this.thumbShadowSecondary.setAttribute('hidden', '') : this.thumbShadowSecondary.removeAttribute('hidden');
    } else {
      value ? this.thumbShadow.setAttribute('hidden', '') : this.thumbShadow.removeAttribute('hidden');
    }
  }

  #wasCursorInBoundingBox(x, y, top, bottom, left, right) {
    return y >= top && y < bottom && x > left && x < right;
  }
    
  #calculateUIFromClick(event) {
    const [x, y] = [event.clientX, event.clientY];
    const top = this.trackBounds.TOP;
    const bottom = this.trackBounds.BOTTOM;
    const left = this.trackBounds.LEFT;
    const right = this.trackBounds.RIGHT;

    const clickedTrackArea = this.#wasCursorInBoundingBox(x, y, top, bottom, left, right);

    if (clickedTrackArea) {

      const percent = this.#calcPercentFromX(x, left, right, this.thumbDraggable.clientWidth);
      const value = this.#calcValueFromPercent(percent);
      
      if (this.type === 'double') {
        const thumbX = this.thumbDraggable.getBoundingClientRect().x;
        const thumbXSecondary = this.thumbDraggableSecondary.getBoundingClientRect().x;
        if (Math.abs(x - thumbX) < Math.abs(x - thumbXSecondary)) {
          // focus on the thumb a
          this.#hideTooltip(false, 'primary');
          this.valuea = value;
          this.thumbDraggable.focus();
        } else {
          // focus on thumb b
          this.#hideTooltip(false, 'secondary');
          this.valueb = value;
          this.thumbDraggableSecondary.focus();
        }
      } else if (this.type === 'single' || this.type === 'vertical') {
        this.#hideTooltip(false);
        this.valuea = value;
        this.thumbDraggable.focus();
        
      } else if (this.type === 'step') {
        const arr = [];
        
        for (let i = 0; i < this.stepNumber; i++) {
          arr[i] = (100 / (this.stepNumber - 1)) * i;
        }
        
        const differences = arr.map((x) => Math.abs(x - percent))
        
        let min = differences[0];
        let minIndex = 0;

        for (let i = 0; i < differences.length; i++) {
          if (differences[i] < min) {
            min = differences[i];
            minIndex = i;
          }
        }
        
        this.valuea = arr[minIndex];
        this.thumbDraggable.focus();
      }

    } else {
      // blur both if clicked outside of hit area
      this.thumbDraggable.blur();
      this.type === 'double' && this.thumbDraggableSecondary && this.thumbDraggableSecondary.blur();
    }
  }

  #moveThumb(primaryOrSecondary) {
    // check to make sure trackBounds have been initialized
    
    if (this.trackBounds && this.trackBounds.LEFT && this.trackBounds.RIGHT) {
      // console.log('trackbounds.LEFT: ' + this.trackBounds.LEFT);
      // console.log('trackbounds.RIGHT: ' + this.trackBounds.RIGHT);
      // console.log('dir: ' + this.container.getAttribute('dir'));
      let thumbDraggable = this.thumbDraggable;
      let percent = this.percent;
      
      // secondary values
      if (primaryOrSecondary === 'secondary' && this.type === 'double') {
        thumbDraggable = this.thumbDraggableSecondary;
        percent = this.percentb;
      }
      
      // console.log('moving thumb with percent of : ' + percent);
      const xTranslate = this.#calcTranslateFromPercent(this.trackBounds.LEFT, this.trackBounds.RIGHT, percent);
      thumbDraggable.style.transform = `translate(${xTranslate}px, 0px)`;
      // console.log('translated thumb by ' + xTranslate);
    }
    
  }

  // based on percent, calculate that numerical value between min and max
  #calcValueFromPercent(percent) {
    return (percent / 100 * (this.max - this.min)) + (this.min);
  }

  // based on percent, calculate how much the thumb should translate on the X-axis
  #calcTranslateFromPercent(xStart, xEnd, percent) {
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
  #calcPercentFromX(x, xStart, xEnd, thumbWidth) {
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
    // INIT AFTER CSS LOADS
    this.#postRenderInitialization();

    // RESIZE OBSERVER for when window size changes
    this.#addResizeObserver().observe(this.trackArea);

    // DRAGGABLE EVENTS
    this.#addDragEvents();
    this.type === 'double' && this.#addDragEvents('secondary');
    
    // KEYBOARD EVENTS
    this.#addKeyboardEvents();

    // CLICK EVENTS
    this.#addClickEvents();

    return this;
  }

  #postRenderInitialization() {
    window.onload = () => {
      // init the this.trackBounds when render paint finishes
      this.trackBounds = {
        TOP: this.slider.offsetTop + this.trackArea.offsetTop, // top 0
        BOTTOM: this.slider.offsetTop - this.trackArea.offsetTop, // bottom 1
        LEFT: this.slider.offsetLeft, // left 2
        RIGHT: this.slider.offsetLeft + this.trackArea.clientWidth, // right 3
      };

      // update initial position of thumb now that bounds have been initialized
      this.#moveThumb();
      this.type === 'double' && this.#moveThumb('secondary');
      
      // set the transition styles
      if (!this.thumbDraggable.style.transition && !this.progressTrack.style.transition) {
        this.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease');
        this.progressTrack.style.setProperty('transition', 'width 0.2s ease');
      }
      if (this.type === 'double' && this.thumbDraggableSecondary && !this.thumbDraggableSecondary.style.transition) {
        this.thumbDraggableSecondary.style.setProperty('transition', 'transform 0.2s ease');
      }
      
      // init custom colors
      this.#updateColor();
      this.#updateProgressBar();
    }
  }

  #addResizeObserver() {
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

          this.#moveThumb();
          this.type === 'double' && this.#moveThumb('secondary');
        }
      }
    });

    return resizeObserver;
  }
  
  #addClickEvents() {
    this.onEvent('click', window, (event) => {
      const idsSliderSelected = event.target.name === 'ids-slider';
      // console.log('idsSliderSelected: ' + idsSliderSelected);
  
      this.#hideTooltip(!idsSliderSelected);
      this.type === 'double' && this.#hideTooltip(!idsSliderSelected, 'secondary');
  
      // console.log(event.target.name);
      // console.log(event.clientX + ', ' + event.clientY);
      this.#calculateUIFromClick(event);
    });
  }

  #addDragEvents(primaryOrSecondary) {
    let obj = {};
    
    if (this.type === 'double' && primaryOrSecondary === 'secondary') {
      const secondary = {
        thumbDraggable: this.thumbDraggableSecondary,
        thumbDraggableOther: this.thumbDraggable,
        percentAttribute: 'percentb',
        valueAttribute: 'valueb',
        type: 'secondary',
      };

      obj = secondary;
    } else {
      const primary = {
        thumbDraggable: this.thumbDraggable,
        thumbDraggableOther: this.thumbDraggableSecondary,
        percentAttribute: 'percent',
        valueAttribute: 'valuea',
        type: 'primary',
      };

      obj = primary;
    }

    const swapZIndex = () => {
      if (obj.thumbDraggableOther) {
        obj.thumbDraggableOther.style.zIndex = 50;
        obj.thumbDraggable.style.zIndex = 51;
      }
    }

    // TODO: make all these onEvents modular for both single/double thumbDraggables
    // Listen for drag event on draggable thumb
    this.onEvent('ids-drag', obj.thumbDraggable, (e) => {
      this.#hideTooltip(false);

      const percent = this.#calcPercentFromX(e.detail.mouseX, this.trackBounds.LEFT, this.trackBounds.RIGHT, obj.thumbDraggable.clientWidth);
      const value = this.#calcValueFromPercent(percent);
      this.#hideThumbShadow(true, obj.type);

      this.type === 'double' && swapZIndex();
      // only set the percent -- because changing the value causes the moveThumb() to fire like crazy 
      // -- dragging becomes jittery because moveThumb() sets translate at the same time dragging sets translate
      this.setAttribute(obj.percentAttribute, percent);
    });
    
    this.onEvent('ids-dragstart', obj.thumbDraggable, () => {
      obj.thumbDraggable.style.removeProperty('transition'); //disable transitions while dragging, doesn't quite work... css default style doesn't get removed
      this.progressTrack.style.removeProperty('transition');
      obj.thumbDraggable.blur();
      this.type === 'double' && obj.thumbDraggableOther.blur();
    });
    
    this.onEvent('ids-dragend', obj.thumbDraggable, (e) => {
      obj.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease 0s');
      this.progressTrack.style.setProperty('transition', 'width 0.2s ease');
      obj.thumbDraggable.focus();
      // to ensure that after dragging, the value is updated..
      //  this is the roundabout solution to prevent the firing of moveThumb() every single ids-drag event
      // i don't really like this roundabout cause we're setting everything else BUT the value, which we save for the end...
      // but I can't think of anything better atm
      const freshPercent = this.getAttribute(obj.percentAttribute);
      const calcValue = this.#calcValueFromPercent(freshPercent);
      this.setAttribute(obj.valueAttribute, calcValue);
    });
    
    this.onEvent('focus', obj.thumbDraggable, () => {
      if (this.type === 'double') {
        swapZIndex();
        obj.thumbDraggableOther.blur();
      }
        this.#hideThumbShadow(false, obj.type);
    });

    this.onEvent('blur', obj.thumbDraggable, () => {
      this.#hideThumbShadow(true, obj.type);
    });
  }

  #addKeyboardEvents() {
    this.onEvent('keydown', document, (event) => {
      if (document.activeElement.name === 'ids-slider') {
        // check if focus is on b or a
        // .. wonder if there's a better way to do this? maybe store hidden state in class variable?
        let value = '';
        let attribute = '';

        if (this.type === 'double') {
          if (this.thumbShadow.hasAttribute('hidden')) {
            attribute = 'valueb'
            value = this.valueb;
          } else if (this.thumbShadowSecondary && this.thumbShadowSecondary.hasAttribute('hidden')) {
            attribute = 'valuea'
            value = this.valuea;
          }
        } else {
          attribute = 'valuea';
          value = this.valuea;
        }
        switch (event.key) {
          // TODO: might need to swap for RTL
          case "ArrowLeft":
            if (this.type === 'step') {
              this.setAttribute(attribute, value - (this.max / (this.stepNumber - 1)));
            }
            else {
              // need to round so we don't get stuck between decimals
              this.setAttribute(attribute, Math.ceil(value) - 1);
            }
            break;
          case "ArrowRight":
            if (this.type === 'step') {
              this.setAttribute(attribute, value + (this.max / (this.stepNumber - 1)));
            } else {
              console.log('stepping right')
              console.log(Math.floor(value) + 1);
              this.setAttribute(attribute, Math.floor(value) + 1);
            }
            break;
        }
      }
    });
  }
}

export default IdsSlider;
