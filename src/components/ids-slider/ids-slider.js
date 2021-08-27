import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core/ids-element';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../../mixins';

import { IdsStringUtils } from '../../utils';

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
const DEFAULT_COLOR = '#0072ed'; // TODO: change to ids-status-primary

/**
 * IDS Slider Component
 * @type {IdsSlider}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-slider')
@scss(styles)
class IdsSlider extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin, IdsLocaleMixin) {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.slider = this.container.querySelector('.slider');
    this.trackArea = this.container.querySelector('.track-area');
    this.progressTrack = this.container.querySelector('.track-progress');
    this.track = this.container.querySelector('.track');

    this.thumb = this.container.querySelector('.thumb');
    this.thumbDraggable = this.container.querySelector('.thumb-draggable');
    this.thumbShadow = this.container.querySelector('.thumb-shadow');
    this.tooltip = this.container.querySelector('.tooltip');
    this.tooltipText = this.container.querySelector('.tooltip .text');
    this.tickContainer = this.container.querySelector('.tick-container');
    
    if (this.type === 'double') {
      this.thumbSecondary = this.container.querySelector('.thumb.secondary');
      this.thumbDraggableSecondary = this.container.querySelector('.thumb-draggable.secondary');
      this.thumbShadowSecondary = this.container.querySelector('.thumb-shadow.secondary');
      this.tooltipSecondary = this.container.querySelector('.tooltip.secondary')
      this.tooltipTextSecondary = this.container.querySelector('.tooltip.secondary .text.secondary');
    } else if (this.type !== 'double') {
      this.container.querySelector('.thumb-draggable.secondary').remove();
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
      attributes.COLOR,
      attributes.LABEL,
      attributes.MIN,
      attributes.MAX,
      attributes.STEP_NUMBER,
      attributes.TOOLTIP,
      attributes.TYPE,
      // attributes.VALUE,
      'valuea',
      'valueb',
      attributes.VERTICAL,
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
            <ids-draggable hidden tabindex="1" class="thumb-draggable" axis="${this.vertical ? 'y' : 'x'}" parent-containment>
              <div hidden class="thumb-shadow"></div>
              <div class="thumb">
                <div class="tooltip">
                  <ids-text class="text">${this.valuea ?? DEFAULT_VALUE}</ids-text>
                  <div class="pin"></div>
                </div>
              </div>
            </ids-draggable>
            <ids-draggable hidden tabindex="2" class="thumb-draggable secondary" axis="${this.vertical ? 'y' : 'x'}" parent-containment>
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
            <div class="tick-container">
              <span class="tick"></span>
              <span class="tick"></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  set vertical(value) {
    const val = IdsStringUtils.stringToBool(value);
    console.log('vertical is true: ' + val);
    val ? this.setAttribute(attributes.VERTICAL, val) : this.removeAttribute(attributes.VERTICAL);
    if (val) {
      this.container.classList.add('vertical'); // div w/ class ids-slider
      this.slider.classList.add('vertical');
      this.progressTrack.classList.add('vertical');
      this.track.classList.add('vertical');
      this.trackArea.classList.add('vertical');
      this.tickContainer.classList.add('vertical');
    }
  }

  get vertical() {
    return this.getAttribute(attributes.VERTICAL) || false;
  }

  set isRtl(value) {
    // console.log('setting rtl to ' + value);
    if (value !== this._isRtl) {
      this._isRtl = value;
     
      this.trackBounds = this.#calculateBounds();
      this.#moveThumb();
      this.#updateProgressBar();
      this.type === 'double' && this.#moveThumb('secondary');
    }
  }

  get isRtl() {
    return this._isRtl;
  }

  #addRtlListener() {
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      const isRtl = this.locale.isRTL(e.detail.language.name);
      this.isRtl = isRtl;
    });
  }

  #updateToolTip(value, primaryOrSecondary) {
    let tooltipText = this.tooltipText;
    let type = 'primary';

    if (primaryOrSecondary === 'secondary') {
      tooltipText = this.tooltipTextSecondary;
      type = 'secondary';
    }

    tooltipText.innerHTML = Math.ceil(value);

    if(this.type !== 'step') {
      this.#hideTooltip(false, type)
    }
  }
  
  #updateProgressBar() {
    // TODO: add vertical settings
    if (this.type === 'single' || this.type === 'step') {
      this.slider.style.setProperty("--percentStart", 0);
      this.slider.style.setProperty("--percentEnd", this.percent);
      // console.log('setting slider --percentEnd to : ' + this.percent)
    } else if (this.type === 'double') {
        this.slider.style.setProperty("--percentStart", Math.min(this.percentb, this.percent));
        this.slider.style.setProperty("--percentEnd", Math.max(this.percentb, this.percent));
        const direction = this.vertical ? 'top' : this.isRtl ? 'right' : 'left';
        this.progressTrack.style.setProperty(direction, `${Math.min(this.percent, this.percentb)}%`)
    }
  }

  set labels(array) {
    this._labels = array;
    this.#setStepLabels();
  }

  get labels() {
    return this._labels;
  }

  #setStepLabels() {
    if (this.type !== 'step') return;

    const labels = this.labels;
    const stepNumber = this.stepNumber;

    // check to make sure labels length is equal to step number
    if (labels.length === stepNumber) {
      // check amount of label elements -- add or remove 
      let labelElements = this.container.querySelectorAll('.label');
      const ticks = this.container.querySelectorAll('.tick');
      if (labelElements.length !== stepNumber) {
        const x = Math.abs(stepNumber - labelElements.length);
        for(let i = 0; i < x; i++) {
          labelElements.length > stepNumber 
          ? this.container.querySelector('.label').remove()
          : ticks[ticks.length - 1 - i].insertAdjacentHTML('afterbegin', '<ids-text label class="label"></ids-text>');
        }
        // grab fresh label elements group
        labelElements = this.container.querySelectorAll('.label');
      }
      // set the innerHTML for each label in the array
      if (labels.length === labelElements.length) {
        labelElements.forEach((x, i) => {
          // set innerHTML of whatever div element attached to tick 
          x.innerHTML = labels[i];
          this.vertical && x.classList.add('vertical'); // add vertical styles
        })
      } else {
        // TODO: throw error
        console.log('label array size must match amt of label elements');
      }
    } else {
      // TODO: throw error
      console.log('label array size must match step number')
    }
  }

  set stepNumber(value) {
    if (this.type === 'step') {
      // must have at least 2 steps
      if (value >= 2) {
        this.setAttribute('step-number', value);
        const stepLength = this.container.querySelectorAll('.tick').length;
        if (stepLength !== this.stepNumber) {
          const x = Math.abs(stepLength - this.stepNumber);
          for (let i = 0; i < x; i++) {
            // remove or add ticks
            stepLength > this.stepNumber ? this.container.querySelector('.tick').remove() : this.container.querySelector('.tick:last-child').insertAdjacentHTML('afterend', '<span class="tick"></span>');
          }
        }
      }
    } else {
      this.removeAttribute('step-number');
    }
  }

  get stepNumber() { return parseInt(this.getAttribute('step-number')) || 2; }

  set percentb(value) {
    this._percentb = value;
    this.#updateProgressBar();
    this.#updateToolTip(this.#calcValueFromPercent(value), 'secondary');
  }
  
  get percentb() {
    // undefined values will go to else block for isNaN but not Number.isNaN
    if (!isNaN(this._percentb)) {
      return this._percentb;
    } else {
      return (this.valueb - this.min) / (this.max - this.min) * 100;
    }
  }
  
  set percent(value) {
    this._percent = value;
    this.#updateProgressBar();
    this.#updateToolTip(this.#calcValueFromPercent(value));
  }
  
  get percent() { 
    // undefined values will go to else block for isNaN but not Number.isNaN
    if (!isNaN(this._percent)) {
      // console.log('returning this._percent: ' + this._percent)
      return this._percent;
    } else {
      return (this.valuea - this.min) / (this.max - this.min) * 100;
    }
  }

  #withinBounds(value) {
    return parseFloat(value) >= this.min && parseFloat(value) <= this.max;
  }

  set valueb(value) {
    if (this.#withinBounds(value)) { 
      this.setAttribute('valueb', value);
      this.percentb = (this.valueb - this.min) / (this.max - this.min) * 100;
      this.#updateToolTip(value, 'secondary');
      this.#moveThumb('secondary');
    } else {
      if (value < this.min) {
        this.setAttribute('valueb', this.min);
      } else if (value > this.max) {
        this.setAttribute('valueb', this.max)
      } else {
        this.setAttribute('valueb', DEFAULT_VALUE_SECONDARY)
      }
    }
  }
  
  get valueb() { 
    const b = this.getAttribute('valueb')
    if (b === null || b === '' || Number.isNaN(b)) {
      return DEFAULT_VALUE_SECONDARY;
    } else {
      return parseFloat(this.getAttribute('valueb')); 
    }
  }
  
  
  set valuea(value) {
    if (this.#withinBounds(value)) {
      this.setAttribute('valuea', value);
      this.percent = (this.valuea - this.min) / (this.max - this.min) * 100;
      this.#updateToolTip(value);
      this.#moveThumb();
    } else {
      if (value < this.min) {
        this.setAttribute('valuea', this.min);
      } else if (value > this.max) {
        this.setAttribute('valuea', this.max)
      } else {
        this.setAttribute('valuea', DEFAULT_VALUE);
      }
    }
  }
  
  get valuea() { 
    const a = this.getAttribute('valuea');
    // console.log('valuea: ' + a);
    if (a === null || a === '' || Number.isNaN(a)) {
      // // TODO: check why it's NaN
      // console.log('entered if statement')
      // console.log(a === null )
      // console.log(a === '' )
      // console.log(Number.isNaN(a)) 
      // console.log('returning DEFAULT_VALUE: ' + DEFAULT_VALUE)
      return DEFAULT_VALUE;
    } else {
      return parseFloat(this.getAttribute('valuea')); 
    }
  }

  set min(value) {
    this.setAttribute(attributes.MIN, value || DEFAULT_MIN);
    console.log('setting the min to : ' + value)
  }
  
  get min() { return parseFloat(this.getAttribute(attributes.MIN)) || DEFAULT_MIN; }
  
  set max(value) {
    // TODO: this would probably break if max was set to 0
    // should also check if '' null or NaN
    console.log('setting the max to : ' + value)
    this.setAttribute(attributes.MAX, value || DEFAULT_MAX);
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
    
    if (this.type === 'double' && this.thumbShadowSecondary && this.thumbSecondary) {
      this.thumbShadowSecondary.style.setProperty('background-color', rgbaString);
      this.thumbShadowSecondary.style.setProperty('border', `1px ${color} solid`);
      this.thumbSecondary.style.setProperty('background-color', color);
    }
  }

  #hideTooltip(value, primaryOrSecondary) {
    if (primaryOrSecondary === 'secondary' && this.tooltipSecondary) {
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
    
  #calculateUIFromClick(x, y) {
    const top = this.trackBounds.TOP;
    const bottom = this.trackBounds.BOTTOM;
    const left = this.trackBounds.LEFT;
    const right = this.trackBounds.RIGHT;

    // console.log('calculateUIFromClick()');
    // console.log(this.trackBounds);

    
    const clickedTrackArea = this.#wasCursorInBoundingBox(x, y, top, bottom, left, right);
    
    if (clickedTrackArea) {
      const mousePos = this.vertical ? y : x;
      const startPos = this.vertical ? top : this.isRtl ? right : left;
      const endPos = this.vertical ? bottom : this.isRtl ? left : right;

      const percent = this.#calcPercentFromMousePos(mousePos, startPos, endPos, this.thumbDraggable.clientWidth);
      const value = this.#calcValueFromPercent(percent);
      // console.log('percent: ' + percent);
      // // console.log('value: ' + value);
      
      if (this.type === 'double') {
        let thumbPos = 0;
        let thumbPosSecondary = 0;
        // TODO: shorten to ternaries
        if (this.vertical) {
          thumbPos = this.thumbDraggable.getBoundingClientRect().y;
          thumbPosSecondary = this.thumbDraggableSecondary.getBoundingClientRect().y;
        } else {
          thumbPos = this.thumbDraggable.getBoundingClientRect().x;
          thumbPosSecondary = this.thumbDraggableSecondary.getBoundingClientRect().x;
        }
        if (Math.abs(mousePos - thumbPos) < Math.abs(mousePos - thumbPosSecondary)) {
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

        // snap to the value interval closest to click
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
      let thumbDraggable = this.thumbDraggable;
      let percent = this.percent;
      
      // secondary values
      if (primaryOrSecondary === 'secondary' && this.type === 'double') {
        thumbDraggable = this.thumbDraggableSecondary;
        percent = this.percentb;
      }
     
      // console.log('moveThumb percent: ' + percent);
      // console.log('moving thumb with percent of : ' + percent);
      let pxTranslate = this.vertical ? this.#calcTranslateFromPercent(this.trackBounds.TOP, this.trackBounds.BOTTOM, percent) : this.#calcTranslateFromPercent(this.trackBounds.LEFT, this.trackBounds.RIGHT, percent);
      
      if (this.vertical) {
        thumbDraggable.style.transform=`translate(0px, ${pxTranslate}px)`;
      } else {
        if (this.isRtl) { xTranslate = xTranslate * - 1; }
        thumbDraggable.style.transform = `translate(${pxTranslate}px, 0px)`;
      }
      console.log('translated thumb by ' + pxTranslate);
    }
    
  }

  // based on percent, calculate that numerical value between min and max
  #calcValueFromPercent(percent) {
    return (percent / 100 * (this.max - this.min)) + (this.min);
  }

  // based on percent, calculate how much the thumb should translate on the X-axis
  #calcTranslateFromPercent(aStart, aEnd, percent) {
    let translate = 0;
    // TODO: merge code -- test for both
    if (this.vertical) {
      const editedRange = aEnd - aStart - this.thumbDraggable.clientHeight; // minus thumb height bc it overshoots
      let yCoord = Math.ceil(percent) / 100 * editedRange;
      yCoord -= (editedRange / 2); // needs to translate negative and positive; translate by 0px is in the middle for vertical
      translate = yCoord;
    } else {
      const editedRange = aEnd - aStart - this.thumbDraggable.clientWidth;
      let xCoord = Math.ceil(percent) / 100 * editedRange;
      xCoord -= editedRange / 2;
      translate = xCoord;
    }
    return translate;
  }

  // based on mouse click, figure out the percent of progress
  #calcPercentFromMousePos(a, aStart, aEnd, thumbWidth) {
    let percent = 0;
    // allow bigger hit areas for clicking the ends of the slider to round to 0 or 100, since the thumb takes up considerable space
    if (Math.abs(a - aEnd) > (Math.abs(aStart - aEnd)  - thumbWidth/2)) {
      percent = 0;
    }
    else if (Math.abs(a - aStart) > (Math.abs(aEnd - aStart) - thumbWidth/2)) {
      percent = 100;
    } else {
      percent = (Math.abs(a - aStart) - thumbWidth/2) / (Math.abs(aEnd - aStart) - thumbWidth/2) * 100;
    }
    // console.log('calcPercentFromClick()');
    // console.log('percent is: ' + percent);
    return percent;
  }

  #addEventListeners() {
    // CHECK IF RTL    
    this.#addRtlListener();

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

  #calculateBounds() {
    console.log('this.slider.offsetTop: ' + this.slider.offsetTop) // 117
    console.log('this.slider.offsetLeft: ' + this.slider.offsetLeft) // 285
    console.log('this.trackArea.offsetTop: ' + this.trackArea.offsetTop) // 0
    console.log('this.trackArea.offsetLeft: ' + this.trackArea.offsetLeft) // -12
    console.log('this.trackArea.clientWidth: ' + this.trackArea.clientWidth) // 24
    console.log('this.trackArea.clientHeight: ' + this.trackArea.clientHeight) // 24

    const left = this.slider.offsetLeft + this.trackArea.offsetLeft;
    const top = this.slider.offsetTop + this.trackArea.offsetTop;
    const vertical = {
      TOP: top,
      LEFT: left, // might work for both horizontal and left
      BOTTOM: this.slider.offsetTop + this.trackArea.clientHeight, // diff for vert
      RIGHT: left + this.trackArea.clientWidth,
    };
    const horizontal = {
      TOP: top, // top 0
      BOTTOM: this.slider.offsetTop - this.trackArea.offsetTop, // bottom 1
      LEFT: this.slider.offsetLeft, // left 2 // TODO: test with var left
      RIGHT: this.slider.offsetLeft + this.trackArea.clientWidth, // right 3 
    };

    return this.vertical ? vertical : horizontal;
  }

  #postRenderInitialization() {
    window.onload = () => {
      // init the this.trackBounds when render paint finishes
      this.trackBounds = this.#calculateBounds();

      this.thumbDraggable.setAttribute('axis', `${this.vertical ? 'y' : 'x'}`)
      this.type === 'double' && this.thumbDraggableSecondary.setAttribute('axis', `${this.vertical ? 'y' : 'x'}`)
      
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
        this.progressTrack.style.removeProperty('transition'); // for now don't use transitions for double range slider on prog bar
      }
      
      // init custom colors
      this.#updateColor();
      this.#updateProgressBar();

      // init labels
      if (this.type === 'step') {
        this.labels = [...Array(this.stepNumber).keys()];
      } else {
        this.container.querySelector('.tick:last-child').insertAdjacentHTML('afterbegin', `<ids-text label class="label ${this.vertical && 'vertical'}">${this.max}</ids-text>`);
        this.container.querySelector('.tick:first-child').insertAdjacentHTML('afterbegin', `<ids-text label class="label ${this.vertical && 'vertical'}">${this.min}</ids-text>`);
      }
    }
  }

  #addResizeObserver() {
    // update this.trackBounds with new values when window size changes
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          // console.log(entry.target.className)
          
          this.trackBounds = this.#calculateBounds(); 

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
  
      if (this.type !== 'step') {
        this.#hideTooltip(!idsSliderSelected);
        this.type === 'double' && this.#hideTooltip(!idsSliderSelected, 'secondary');
      }
  
      // console.log(event.target.name);
      console.log(event.clientX + ', ' + event.clientY);
      this.#calculateUIFromClick(event.clientX, event.clientY);
    });
  }

  #addDragEvents(primaryOrSecondary) {
    let obj = {};
    
    if (this.type === 'double' && primaryOrSecondary === 'secondary') {
      const secondary = {
        thumbDraggable: this.thumbDraggableSecondary,
        thumbDraggableOther: this.thumbDraggable,
        type: 'secondary',
      };

      obj = secondary;
    } else {
      const primary = {
        thumbDraggable: this.thumbDraggable,
        thumbDraggableOther: this.thumbDraggableSecondary,
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
      this.type !== 'step' && this.#hideTooltip(false);

      const [left, right, top, bottom] = [this.trackBounds.LEFT, this.trackBounds.RIGHT, this.trackBounds.TOP, this.trackBounds.BOTTOM];

      const [x, y] = [e.detail.mouseX, e.detail.mouseY];
      console.log('x, y: ' + x + ', ' + y)
      // let percent = 0;

      const mousePos = this.vertical ? y : x;
      const startPos = this.vertical ? top : this.isRtl ? right : left;
      const endPos = this.vertical ? bottom : this.isRtl ? left : right;

      const percent = this.#calcPercentFromMousePos(mousePos, startPos, endPos, obj.thumbDraggable.clientWidth);

      this.#hideThumbShadow(true, obj.type);

      this.type === 'double' && swapZIndex();
      // only set the percent -- because changing the value causes the moveThumb() to fire like crazy 
      // -- dragging becomes jittery because moveThumb() sets translate at the same time dragging sets translate
      obj.type === 'secondary' ? this.percentb = percent : this.percent = percent;
    });
    
    this.onEvent('ids-dragstart', obj.thumbDraggable, () => {
      obj.thumbDraggable.style.removeProperty('transition'); //disable transitions while dragging, doesn't quite work... css default style doesn't get removed
      this.progressTrack.style.removeProperty('transition');
      obj.thumbDraggable.blur();
      this.type === 'double' && obj.thumbDraggableOther.blur();
    });
    
    this.onEvent('ids-dragend', obj.thumbDraggable, (e) => {
      obj.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease 0s');
      this.type !== 'double' && this.progressTrack.style.setProperty('transition', 'width 0.2s ease');
      obj.thumbDraggable.focus();
      // to ensure that after dragging, the value is updated..
      //  this is the roundabout solution to prevent the firing of moveThumb() every single ids-drag event
      // i don't really like this roundabout cause we're setting everything else BUT the value, which we save for the end...
      // but I can't think of anything better atm
      const freshPercent = obj.type === 'secondary' ? this.percentb : this.percent;
      const calcValue = this.#calcValueFromPercent(freshPercent);
      obj.type === 'secondary' ? this.valueb = calcValue : this.value = calcValue;
    });
    
    this.onEvent('focus', obj.thumbDraggable, () => {
      // console.log(obj.type + ' is focused')
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
          case "ArrowDown":
          case "ArrowRight":
            this.#increaseValue(attribute);
            break;
          case "ArrowUp":
          case "ArrowLeft":
            this.vertical && this.#decreaseValue(attribute);
            break;
        }
      }
    });
  }

  #decreaseValue(attributeName) {
    const value = this.getAttribute(attributeName);
    if (this.type === 'step') {
      this.setAttribute(attributeName, value - (this.max / (this.stepNumber - 1)));
    }
    else {
      // need to round so we don't get stuck between decimals
      this.setAttribute(attributeName, Math.ceil(value) - 1);
    } 
  }
  
  #increaseValue(attributeName) {
    const value = this.getAttribute(attributeName);
    if (this.type === 'step') {
      this.setAttribute(attributeName, value + (this.max / (this.stepNumber - 1)));
    } else {
      this.setAttribute(attributeName, Math.floor(value) + 1);
    }
  }
}

export default IdsSlider;
