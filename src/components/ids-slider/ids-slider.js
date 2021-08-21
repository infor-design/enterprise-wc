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
    console.log('type is: ' + this.type);
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
          </div>
          <ids-text label class="label min">${this.min ?? DEFAULT_MIN}</ids-text>
          <ids-text label class="label max">${this.max ?? DEFAULT_MAX}</ids-text>
        </div>
      </div>
    `;
  }

  updateToolTip(value, primaryOrSecondary) {
    if (primaryOrSecondary) {
      this.#hideTooltip(false, primaryOrSecondary);

      if (primaryOrSecondary === 'primary') {
        tooltipText.innerHTML = Math.ceil(value);
        
      } else if (primaryOrSecondary === 'secondary') {
        const tooltipTextSecondary = this.container.querySelector('.tooltip.secondary .text.secondary');
        tooltipTextSecondary.innerHTML = Math.ceil(value);

      }
    } else {
      // default behavior
      this.#hideTooltip(false);
      this.tooltipText.innerHTML = Math.ceil(value);
    }
  }
  
  updateProgressBar() {
    if (this.type === 'single') {
    //   console.log('type is single')
      this.slider.style.setProperty("--percentStart", 0);
      this.slider.style.setProperty("--percentEnd", this.percent);

    } else if (this.type === 'double') {
        this.slider.style.setProperty("--percentStart", Math.min(this.percentb, this.percent));
        this.slider.style.setProperty("--percentEnd", Math.max(this.percentb, this.percent));
        this.progressTrack.style.setProperty('left', `${Math.min(this.percent, this.percentb)}%`)
    }
  }

  set percentb(value) {
    this.setAttribute('percentb', value);
    this.updateProgressBar();
    this.updateToolTip(this.calcValueFromPercent(value), 'secondary');
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
    this.updateProgressBar();
    this.updateToolTip(this.calcValueFromPercent(value));
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
    return value >= this.min && value <= this.max;
  }

  set valueb(value) {
    if (this.#withinBounds(value)) {
      console.log('valueb: ' + value);
      this.setAttribute('valueb', value);
      console.log('set attribute to ' + this.getAttribute('valueb'));
      console.log('percent b is: ')
      this.setAttribute('percentb', (this.valueb - this.min) / (this.max - this.min) * 100);
      this.updateToolTip(value, 'secondary');
      this.moveThumb('secondary'); // change name to updateThumbPosition() ? 
    } else {
      if (value < this.min) {
        this.setAttribute('valueb', this.min);
      } else if (value > this.max) {
        this.setAttribute('valueb', this.max)
      }
    }
  }
  
  get valueb() { return this.getAttribute('valueb') || DEFAULT_MAX; }
  
  set valuea(value) {
    // console.log('setting valuea: ' + value);
    if (this.#withinBounds(value)) {
      this.setAttribute('valuea', value);
      this.setAttribute('percent', (this.valuea - this.min) / (this.max - this.min) * 100);
      this.updateToolTip(value);
      this.moveThumb(); // change name to updateThumbPosition() ? 
    } else {
      if (value < this.min) {
        this.setAttribute('valuea', this.min);
      } else if (value > this.max) {
        this.setAttribute('valuea', this.max)
      }
    }
  }

  get valuea() { return this.getAttribute('valuea') || DEFAULT_VALUE; }

  // OK 
  set min(value) {
    this.setAttribute(attributes.MIN, value || DEFAULT_MIN);
    this.container.querySelector('.label.min').innerHTML = this.min;
  }

  // OK
  get min() { return parseFloat(this.getAttribute(attributes.MIN)) || DEFAULT_MIN; }

  // OK
  set max(value) {
    this.setAttribute(attributes.MAX, value || DEFAULT_MAX);
    this.container.querySelector('.label.max').innerHTML = this.max;
  }

  // OK
  get max() { return parseFloat(this.getAttribute(attributes.MAX)) || DEFAULT_MAX; }

  // TODO:
  set type(value) {
    if (value && TYPES.includes(value)) {
      this.setAttribute(attributes.TYPE, value);

      if (value !== 'double') {
        if (this.thumbDraggableSecondary) {
          this.container.querySelector('.thumb-draggable:nth-of-type(2)').remove();
        }
      }
      // TODO: add it back in, in case user wants to change type through console
    } else {
      this.setAttribute(attributes.TYPE, DEFAULT_TYPE);
    }
  }
  
  get type() { return this.getAttribute(attributes.TYPE)}

  // TODO:
  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value) {
    this.setAttribute(attributes.COLOR, value);
    // this.#updateColor();
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  #hideTooltip(value, primaryOrSecondary) {
    if (primaryOrSecondary && this.type === 'double') {
      if (primaryOrSecondary === 'primary') {
        this.tooltip.style.opacity = value ? 0 : 1;
      }
      else if (primaryOrSecondary ==='secondary') {
        this.tooltipSecondary.style.opacity = value ? 0 : 1;
      }
    } else {
      // default if 2nd param is not included
      this.tooltip.style.opacity = value ? 0 : 1;
    }
  }
  
  // TODO: when hide shadow is false, set the z-index to be higher than the other, when type === 'double' -- this is for when you use arrow keys and they overlap
  #hideThumbShadow(value, primaryOrSecondary) {
    let thumbShadow = this.thumbShadow;

    if (primaryOrSecondary && primaryOrSecondary === 'secondary') {
      thumbShadow = this.thumbShadowSecondary;
    }

    value ? thumbShadow.setAttribute('hidden', '') : thumbShadow.removeAttribute('hidden');
  }

  wasCursorInBoundingBox(x, y, top, bottom, left, right) {
    return y >= top && y < bottom && x > left && x < right;
  }
    
  calculateUI(event) {
    const [x, y] = [event.clientX, event.clientY];
    const top = this.trackBounds.TOP;
    const bottom = this.trackBounds.BOTTOM;
    const left = this.trackBounds.LEFT;
    const right = this.trackBounds.RIGHT;

    const clickedTrackArea = this.wasCursorInBoundingBox(x, y, top, bottom, left, right);

    // for single
    if (clickedTrackArea) {

      
      // if double, check where if mouse is closer to thumb a/b
      // move thumb a/b if so
      
      // this.#hideTooltipB = false;
      
      const percent = this.calcPercentFromX(x, left, right, this.thumbDraggable.clientWidth);
      const value = this.calcValueFromPercent(percent);
      
      if (this.type === 'double') {
        const thumbX = this.thumbDraggable.getBoundingClientRect().x;
        const thumbXSecondary = this.thumbDraggableSecondary.getBoundingClientRect().x;
        if (Math.abs(x - thumbX) < Math.abs(x-thumbXSecondary)) {
          // focus on the thumb a
          // console.log('closer thumb a')
          this.#hideTooltip(false, 'primary');
          this.valuea = value;
          this.thumbDraggable.focus();
        } else {
          // focus on thumb b
          // console.log('closer thumb b')
          this.#hideTooltip(false, 'secondary');
          this.valueb = value;
          this.thumbDraggableSecondary.focus();
        }
      } else {
        // default; duplicate code
        this.#hideTooltip(false);
        this.valuea = value;
        this.thumbDraggable.focus();

      }

    } else {
      // blur both if clicked outside of hit area
      this.thumbDraggable.blur();
      if (this.type === 'double') {
        this.thumbDraggableSecondary.blur();
      }
    }
  }

  moveThumb(primaryOrSecondary) {
    // check to make sure trackBounds have been initialized
    
    if (this.trackBounds && this.trackBounds.LEFT && this.trackBounds.RIGHT) {
      // default values
      let thumbDraggable = this.thumbDraggable;
      let percent = this.percent;
      
      // secondary values
      if (primaryOrSecondary && primaryOrSecondary === 'secondary' && this.type === 'double') {
        thumbDraggable = this.thumbDraggableSecondary;
        percent = this.percentb;
        console.log('moving thumb b')
      }
      
      console.log('moving thumb with percent of : ' + percent);
      const xTranslate = this.calcTranslateFromPercent(this.trackBounds.LEFT, this.trackBounds.RIGHT, percent);
      thumbDraggable.style.transform = `translate(${xTranslate}px, 0px)`;
      console.log('translated thumb by ' + xTranslate);
    }
    
    // TODO: do this for secondary thumb if type === double
  }

  // OK - Modular for SINGLE & DOUBLE
  // based on percent, calculate that numerical value between min and max
  calcValueFromPercent(percent) {
    return (percent / 100 * (this.max - this.min)) + (this.min);
  }

  // OK - Modular for SINGLE & DOUBLE
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

  // OK - Modular for SINGLE & DOUBLE
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
    window.onload = () => {
      // init the this.trackBounds when render paint finishes
      this.trackBounds = {
        TOP: this.slider.offsetTop + this.trackArea.offsetTop, // top 0
        BOTTOM: this.slider.offsetTop - this.trackArea.offsetTop, // bottom 1
        LEFT: this.slider.offsetLeft, // left 2
        RIGHT: this.slider.offsetLeft + this.trackArea.clientWidth, // right 3
      };

      // SINGLE
      if (this.type === 'single' || this.type === 'double') {
        // update initial position of thumb now that bounds have been initialized
        this.moveThumb();
        
        // set the transition styles
        if (!this.thumbDraggable.style.transition && !this.progressTrack.style.transition) {
          this.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease');
          this.progressTrack.style.setProperty('transition', 'width 0.2s ease');
        }
        
      }
      
      // DOUBLE
      if (this.type ==='double') {
        // update initial position of thumb 2 
        this.moveThumb('secondary');
        // set transition styles
        if (!this.thumbDraggableSecondary.style.transition && !this.progressTrack.style.transition) {
          this.thumbDraggableSecondary.style.setProperty('transition', 'transform 0.2s ease');
          this.progressTrackSecondary.style.setProperty('transition', 'width 0.2s ease');
        }
        // TODO: moveThumb for secondary thumb
        // TODO: set transition styles for secondary thumb
      }

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

          if (this.type === 'double') {
            this.moveThumb('secondary');
          }
        }
      }
    });

    resizeObserver.observe(this.trackArea);

    const primary = {
      thumbDraggable: 'thumbDraggable',
      percent: 'percent',
      value: 'valuea',
      type: 'primary',
    };

    // TODO: make all these onEvents modular for both single/double thumbDraggables
    // Listen for drag event on draggable thumb
    this.onEvent('ids-drag', this.thumbDraggable, (e) => {
      this.#hideTooltip(false);

      const percent = this.calcPercentFromX(e.detail.mouseX, this.trackBounds.LEFT, this.trackBounds.RIGHT, this.thumbDraggable.clientWidth);
      const value = this.calcValueFromPercent(percent);
      if (this.type === 'double' && this.thumbDraggableSecondary) {
        this.thumbDraggableSecondary.style.zIndex = 50;
      }
      this.thumbDraggable.style.zIndex = 51;
      // only set the percent -- because changing the value causes the moveThumb() to fire like crazy 
      // -- dragging becomes jittery because moveThumb() sets translate at the same time dragging sets translate
      this.percent = percent;
    });
    this.onEvent('ids-drag', this.thumbDraggableSecondary, (e) => {
      this.#hideTooltip(false);

      const percent = this.calcPercentFromX(e.detail.mouseX, this.trackBounds.LEFT, this.trackBounds.RIGHT, this.thumbDraggableSecondary.clientWidth);
      const value = this.calcValueFromPercent(percent);
      this.thumbDraggable.style.zIndex = 50;
      this.thumbDraggableSecondary.style.zIndex = 51;
      // only set the percent -- because changing the value causes the moveThumb() to fire like crazy 
      // -- dragging becomes jittery because moveThumb() sets translate at the same time dragging sets translate
      this.percentb = percent;
    });

    this.onEvent('ids-dragstart', this.thumbDraggable, () => {
      this.thumbDraggable.style.removeProperty('transition'); //disable transitions while dragging, doesn't quite work... css default style doesn't get removed
      this.progressTrack.style.removeProperty('transition');
      this.thumbDraggable.blur();
    });
    this.onEvent('ids-dragstart', this.thumbDraggableSecondary, () => {
      this.thumbDraggableSecondary.style.removeProperty('transition'); //disable transitions while dragging, doesn't quite work... css default style doesn't get removed
      this.progressTrack.style.removeProperty('transition');
      this.thumbDraggableSecondary.blur();
    });

    this.onEvent('ids-dragend', this.thumbDraggable, (e) => {
      this.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease 0s');
      this.progressTrack.style.setProperty('transition', 'width 0.2s ease');
      this.thumbDraggable.focus();
      // to ensure that after dragging, the value is updated..
      //  this is the roundabout solution to prevent the firing of moveThumb() every single ids-drag event
      // i don't really like this roundabout cause we're setting everything else BUT the value, which we save for the end...
      // but I can't think of anything better atm
      this.valuea = this.calcValueFromPercent(this.percent);
    });
    this.onEvent('ids-dragend', this.thumbDraggableSecondary, (e) => {
      this.thumbDraggableSecondary.style.setProperty('transition', 'transform 0.2s ease 0s');
      this.progressTrack.style.setProperty('transition', 'width 0.2s ease');
      this.thumbDraggableSecondary.focus();
      // to ensure that after dragging, the value is updated..
      //  this is the roundabout solution to prevent the firing of moveThumb() every single ids-drag event
      // i don't really like this roundabout cause we're setting everything else BUT the value, which we save for the end...
      // but I can't think of anything better atm
      this.valueb = this.calcValueFromPercent(this.percentb);
    });
    
    this.onEvent('focus', this.thumbDraggable, () => {
      this.#hideThumbShadow(false, 'primary');
    });

    this.onEvent('blur', this.thumbDraggable, () => {
      this.#hideThumbShadow(true, 'primary');
    });
    this.onEvent('focus', this.thumbDraggableSecondary, () => {
      this.#hideThumbShadow(false, 'secondary');
    });

    this.onEvent('blur', this.thumbDraggableSecondary, () => {
      this.#hideThumbShadow(true, 'secondary');
    });
    
    this.onEvent('keydown', document, (event) => {
      if (document.activeElement.name === 'ids-slider') {
        // check if focus is on b or a
        // .. wonder if there's a better way to do this? maybe store hidden state in class variable?
        let value = '';
        let attribute = '';
        if (this.thumbShadow.hasAttribute('hidden')) {
          attribute = 'valueb'
          value = this.valueb;
          console.log('value is b')
        } else if (this.thumbShadowSecondary.hasAttribute('hidden')) {
          attribute = 'valuea'
          value = this.valuea;
          console.log('value is a')
        }
        switch (event.key) {
          // TODO: might need to swap for RTL
          case "ArrowLeft":
            // need to round so we don't get stuck between decimals
            this.setAttribute(attribute, Math.ceil(value) - 1);
            break;
          case "ArrowRight":
            this.setAttribute(attribute, Math.floor(value) + 1);
            break;
        }
      }
    });

    // Listen for click events
    // check if click landed on ids-slider or outside of it
    this.onEvent('click', window, (event) => {
      const idsSliderSelected = event.target.name === 'ids-slider';
      // console.log('idsSliderSelected: ' + idsSliderSelected);

      this.#hideTooltip(!idsSliderSelected);
      this.#hideTooltip(!idsSliderSelected, 'secondary');

      // TODO: if double
      // this.#hideTooltipB = !idsSliderSelected;

      // console.log(event.target.name);
      // console.log(event.clientX + ', ' + event.clientY);
      this.calculateUI(event);
    });
    
    return this;
  }
}

export default IdsSlider;
