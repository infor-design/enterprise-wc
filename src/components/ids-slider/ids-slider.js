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
  'step'
];

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_TYPE = TYPES[0];
const DEFAULT_COLOR = 'base';

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
  slider;

  trackArea;

  progressTrack;

  track;

  tickContainer;

  thumb;

  thumbDraggable;

  thumbShadow;

  tooltip;

  tooltipText;

  tooltipPin;

  // DOUBLE only
  thumbSecondary;

  thumbDraggableSecondary;

  thumbShadowSecondary;

  tooltipSecondary;

  tooltipTextSecondary;

  tooltipPinSecondary;

  constructor() {
    super();
  }

  connectedCallback() {
    this.slider = this.container.querySelector('.slider');
    this.trackArea = this.container.querySelector('.track-area');
    this.progressTrack = this.container.querySelector('.track-progress');
    this.track = this.container.querySelector('.track');
    this.tickContainer = this.container.querySelector('.tick-container');

    this.thumb = this.container.querySelector('.thumb');
    this.thumbDraggable = this.container.querySelector('.thumb-draggable');
    this.thumbShadow = this.container.querySelector('.thumb-shadow');
    this.tooltip = this.container.querySelector('.tooltip');
    this.tooltipText = this.container.querySelector('.tooltip .text');
    this.tooltipPin = this.container.querySelector('.tooltip .pin');

    if (this.type === 'double') {
      this.thumbSecondary = this.container.querySelector('.thumb.secondary');
      this.thumbDraggableSecondary = this.container.querySelector('.thumb-draggable.secondary');
      this.thumbShadowSecondary = this.container.querySelector('.thumb-shadow.secondary');
      this.tooltipSecondary = this.container.querySelector('.tooltip.secondary');
      this.tooltipTextSecondary = this.container.querySelector('.tooltip.secondary .text.secondary');
      this.tooltipPinSecondary = this.container.querySelector('.tooltip .pin.secondary');
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
      attributes.MIN,
      attributes.MAX,
      attributes.STEP_NUMBER,
      attributes.TYPE,
      attributes.VALUE,
      attributes.VALUE_SECONDARY,
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
          <div class="track-area">
            <ids-draggable hidden tabindex="1" class="thumb-draggable" axis="${this.vertical ? 'y' : 'x'}" parent-containment>
              <div hidden class="thumb-shadow"></div>
              <div class="thumb">
                <div class="tooltip">
                  <ids-text class="text">${this.value}</ids-text>
                  <div class="pin"></div>
                </div>
              </div>
            </ids-draggable>
            <ids-draggable hidden tabindex="2" class="thumb-draggable secondary" axis="${this.vertical ? 'y' : 'x'}" parent-containment>
              <div hidden class="thumb-shadow secondary"></div>
              <div class="thumb secondary">
                <div class="tooltip secondary">
                  <ids-text class="text secondary">${this.valueSecondary}</ids-text>
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
    val ? this.setAttribute(attributes.VERTICAL, val) : this.removeAttribute(attributes.VERTICAL);
    if (val) {
      this.container.classList.add('vertical');
      this.slider.classList.add('vertical');
      this.progressTrack.classList.add('vertical');
      this.track.classList.add('vertical');
      this.trackArea.classList.add('vertical');
      this.tickContainer.classList.add('vertical');
      this.tooltip.classList.add('vertical');
      this.type === 'double' && this.tooltipSecondary.classList.add('vertical');
      this.tooltipPin.classList.add('vertical');
      this.type === 'double' && this.tooltipPinSecondary.classList.add('vertical');
    }
  }

  get vertical() {
    return this.getAttribute(attributes.VERTICAL) || false;
  }

  set isRtl(value) {
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

    if (this.type !== 'step') {
      this.#hideTooltip(false, type);
    }
  }

  #updateProgressBar() {
    if (this.type === 'single' || this.type === 'step') {
      this.slider.style.setProperty('--percentStart', 0);
      this.slider.style.setProperty('--percentEnd', this.percent);
    } else if (this.type === 'double') {
      const minPercent = Math.min(this.percent, this.percentSecondary);
      const maxPercent = Math.max(this.percent, this.percentSecondary);
      this.slider.style.setProperty('--percentStart', minPercent);
      this.slider.style.setProperty('--percentEnd', maxPercent);

      const startPos = this.vertical ? this.trackBounds.TOP : this.trackBounds.LEFT;
      const endPos = this.vertical ? this.trackBounds.BOTTOM : this.trackBounds.RIGHT;
      const notCentered = true;
      let trans = this.#calcTranslateFromPercent(startPos, endPos, minPercent, notCentered);
      if (this.isRtl) { trans *= -1; }
      const transString = this.vertical ? `translate(0, ${trans}px)` : `translate(${trans}px, 0)`;
      this.progressTrack.style.transform = transString;
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
        for (let i = 0; i < x; i++) {
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
        });
      } else {
        // TODO: throw error
        // console.log('label array size must match amt of label elements');
      }
    } else {
      // set labels to be empty
      let labelElements = this.container.querySelectorAll('.label');
      labelElements.forEach((x) => {
        x.innerHTML = '';
      })
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

  set percentSecondary(value) {
    this._percentSecondary = value;
    this.#updateProgressBar();
    this.#updateToolTip(this.#calcValueFromPercent(value), 'secondary');
  }

  get percentSecondary() {
    // we need all these checks so that it still works with 0
    if (Number.isNaN(this._percentSecondary) || typeof this._percentSecondary === 'undefined' || this._percentSecondary === null || this._percentSecondary === '') {
      // calculate on the fly if not a valid number
      return ((this.valueSecondary - this.min) / (this.max - this.min)) * 100;
    }
    return this._percentSecondary;
  }

  set percent(value) {
    this._percent = value;
    this.#updateProgressBar();
    this.#updateToolTip(this.#calcValueFromPercent(value));
  }

  get percent() {
    if (Number.isNaN(this._percent) || typeof this._percent === 'undefined' || this._percent === null || this._percent === '') {
      return ((this.value - this.min) / (this.max - this.min)) * 100;
    }
    return this._percent;
  }

  #withinBounds(value) {
    return parseFloat(value) >= this.min && parseFloat(value) <= this.max;
  }

  set valueSecondary(value) {
    if (this.#withinBounds(value)) {
      this.setAttribute(attributes.VALUE_SECONDARY, value);
      this.percentSecondary = ((this.valueSecondary - this.min) / (this.max - this.min)) * 100;
      this.#updateToolTip(value, 'secondary');
      this.#moveThumb('secondary');
    } else if (value < this.min) {
      this.setAttribute(attributes.VALUE_SECONDARY, this.min);
    } else {
      this.setAttribute(attributes.VALUE_SECONDARY, this.max);
    }
  }

  get valueSecondary() {
    const b = this.getAttribute(attributes.VALUE_SECONDARY);
    if (b === null || b === '' || Number.isNaN(b)) {
      return this.max;
    }
    return parseFloat(this.getAttribute(attributes.VALUE_SECONDARY));
  }

  set value(value) {
    if (this.#withinBounds(value)) {
      this.setAttribute(attributes.VALUE, value);
      this.percent = ((this.value - this.min) / (this.max - this.min)) * 100;
      this.#updateToolTip(value);
      this.#moveThumb();
    } else if (value > this.max) {
      this.setAttribute(attributes.VALUE, this.max);
    } else {
      this.setAttribute(attributes.VALUE, this.min);
    }
  }

  get value() {
    const a = this.getAttribute(attributes.VALUE);
    if (a === null || a === '' || Number.isNaN(a)) {
      return this.min;
    }
    return parseFloat(this.getAttribute(attributes.VALUE));
  }

  set min(value) {
    const val = parseFloat(value);
    if (val >= this.max || val === null || val === '' || Number.isNaN(val)) {
      this.setAttribute(attributes.MIN, DEFAULT_MIN);
    } else {
      this.setAttribute(attributes.MIN, val);
    }
  }

  get min() {
    return parseFloat(this.getAttribute(attributes.MIN)) || DEFAULT_MIN;
  }

  set max(value) {
    const val = parseFloat(value);
    if (val <= this.min || val === null || val === '' || Number.isNaN(val)) {
      this.setAttribute(attributes.MAX, this.min + DEFAULT_MAX);
    } else {
      this.setAttribute(attributes.MAX, val);
    }
  }

  get max() {
    const val = parseFloat(this.getAttribute(attributes.MAX));
    if (val <= this.min || val === null || val === '' || Number.isNaN(val)) {
      return DEFAULT_MAX;
    }
    return val;
  }

  set type(value) {
    if (value && TYPES.includes(value)) {
      this.setAttribute(attributes.TYPE, value);
    } else {
      this.setAttribute(attributes.TYPE, DEFAULT_TYPE);
    }
  }

  get type() { return this.getAttribute(attributes.TYPE) || DEFAULT_TYPE; }

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

    let colorString = color;

    if (color.substring(0, 1) !== '#') {
      if (color.includes('error') || color.includes('warning') || color.includes('caution') || color.includes('base') || color.includes('success')) {
        colorString = `var(--ids-color-status-${color === 'error' ? 'danger' : color})`;
      }
    }

    ticks.forEach((tick) => {
      tick.style.setProperty('background-color', colorString);
    });
    this.thumb.style.setProperty('background-color', colorString);
    const rgbString = window.getComputedStyle(this.thumb).backgroundColor;
    // have to specify opacity in background-color, otherwise the opacity affects the ring border
    const rgbaString = `${rgbString.slice(0, 3)}a${rgbString.slice(3, rgbString.length - 1)}, 0.1)`;
    this.thumbShadow.style.setProperty('background-color', rgbaString);
    this.thumbShadow.style.setProperty('border', `1px ${colorString} solid`);
    this.progressTrack.style.setProperty('background-color', colorString);

    if (this.type === 'double' && this.thumbShadowSecondary && this.thumbSecondary) {
      this.thumbShadowSecondary.style.setProperty('background-color', rgbaString);
      this.thumbShadowSecondary.style.setProperty('border', `1px ${colorString} solid`);
      this.thumbSecondary.style.setProperty('background-color', colorString);
    }
  }

  #hideTooltip(value, primaryOrSecondary) {
    if (primaryOrSecondary === 'secondary' && this.tooltipSecondary) {
      this.tooltipSecondary.style.opacity = value ? 0 : 1;
    } else {
      this.tooltip.style.opacity = value ? 0 : 1;
    }
  }

  #hideThumbShadow(value, primaryOrSecondary) {
    let thumbShadow = this.thumbShadow;

    if (primaryOrSecondary === 'secondary' && this.thumbShadowSecondary) {
      thumbShadow = this.thumbShadowSecondary;
    }

    value ? thumbShadow.setAttribute('hidden', '') : thumbShadow.removeAttribute('hidden');
  }

  #wasCursorInBoundingBox(x, y, top, bottom, left, right) {
    return y >= top && y < bottom && x > left && x < right;
  }

  #calculateUIFromClick(x, y) {
    const top = this.trackBounds.TOP;
    const bottom = this.trackBounds.BOTTOM;
    const left = this.trackBounds.LEFT;
    const right = this.trackBounds.RIGHT;

    const clickedTrackArea = this.#wasCursorInBoundingBox(x, y, top, bottom, left, right);

    // TODO: fix the bug where both thumbs move when clicking too close to the other thumb
    this.clickFromDrag = false;

    if (clickedTrackArea) {
      const mousePos = this.vertical ? y : x;
      const startPos = this.vertical ? top : left;
      const endPos = this.vertical ? bottom : right;

      const percent = this.#calcPercentFromMousePos(mousePos, startPos, endPos, this.thumbDraggable.clientWidth);
      const value = this.#calcValueFromPercent(percent);

      if (this.type !== 'step') {
        const thumbPos = this.vertical
          ? this.thumbDraggable.getBoundingClientRect().y
          : this.thumbDraggable.getBoundingClientRect().x;
          
          let thumbDraggable = this.thumbDraggable;
          let valueAttribute = 'value';
          let primaryOrSecondary = 'primary';
          
          if (this.type === 'double') {
            const thumbPosSecondary = this.vertical
              ? this.thumbDraggableSecondary.getBoundingClientRect().y
              : this.thumbDraggableSecondary.getBoundingClientRect().x;

            if (Math.abs(mousePos - thumbPos) > Math.abs(mousePos - thumbPosSecondary)) {
              // cursor is closer to second thumb
              thumbDraggable = this.thumbDraggableSecondary;
              valueAttribute = 'valueSecondary';
              primaryOrSecondary = 'secondary';
            }
          }

        this.#hideTooltip(false, primaryOrSecondary);
        this[valueAttribute] = value;
        thumbDraggable.focus();
      } else {
        const arr = [];

        for (let i = 0; i < this.stepNumber; i++) {
          arr[i] = (this.max / (this.stepNumber - 1)) * i;
        }
        const differences = arr.map((val) => Math.abs(val - ((percent / 100) * this.max)));

        let min = differences[0];
        let minIndex = 0;

        for (let i = 0; i < differences.length; i++) {
          if (differences[i] < min) {
            min = differences[i];
            minIndex = i;
          }
        }
        // snap to the value interval closest to click
        this.value = arr[minIndex];
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

    if (this.trackBounds) {
      let thumbDraggable = this.thumbDraggable;
      let percent = this.percent;

      // secondary values
      if (primaryOrSecondary === 'secondary' && this.type === 'double') {
        thumbDraggable = this.thumbDraggableSecondary;
        percent = this.percentSecondary;
      }

      // console.log('moveThumb percent: ' + percent);
      // console.log('moving thumb with percent of : ' + percent);
      const startPos = this.vertical ? this.trackBounds.TOP : this.trackBounds.LEFT;
      const endPos = this.vertical ? this.trackBounds.BOTTOM : this.trackBounds.RIGHT;
      let trans = this.#calcTranslateFromPercent(startPos, endPos, percent);

      if (this.isRtl) { trans *= -1; }
      const transString = this.vertical ? `translate(0, ${trans}px)` : `translate(${trans}px, 0)`;
      thumbDraggable.style.transform = transString;
    }
  }

  // based on percent, calculate that numerical value between min and max
  #calcValueFromPercent(percent) {
    return ((percent / 100) * (this.max - this.min)) + (this.min);
  }

  // based on percent, calculate how much the thumb should translate on the X-axis
  #calcTranslateFromPercent(aStart, aEnd, percent, notCentered) {
    // minus thumb height bc it overshoots
    const editedRange = Math.abs(aEnd - aStart) - this.thumbDraggable.clientHeight;
    let coord = (Math.ceil(percent) / 100) * editedRange;
    // needs to translate negative & positive; translate by 0px is in the middle for vertical slider
    coord = !notCentered ? coord - (editedRange / 2) : coord;

    return coord;
  }

  // based on mouse click, figure out the percent of progress
  #calcPercentFromMousePos(a, aStart, aEnd, thumbWidth) {
    let percent = 0;
    // allow bigger hit areas for controlling thumb
    if (Math.abs(a - aEnd) > (Math.abs(aStart - aEnd) - thumbWidth / 2)) {
      percent = 0;
    } else if (Math.abs(a - aStart) > (Math.abs(aEnd - aStart) - thumbWidth / 2)) {
      percent = 100;
    } else {
      percent = ((Math.abs(a - aStart) - thumbWidth / 2) / (Math.abs(aEnd - aStart) - thumbWidth / 2)) * 100;
    }
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
    // console.log('this.slider.offsetTop: ' + this.slider.offsetTop) // 117
    // console.log('this.slider.offsetLeft: ' + this.slider.offsetLeft) // 285
    // console.log('this.trackArea.offsetTop: ' + this.trackArea.offsetTop) // 0
    // console.log('this.trackArea.offsetLeft: ' + this.trackArea.offsetLeft) // -12
    // console.log('this.trackArea.clientWidth: ' + this.trackArea.clientWidth) // 24
    // console.log('this.trackArea.clientHeight: ' + this.trackArea.clientHeight) // 24

    const LEFT = this.slider.offsetLeft + this.trackArea.offsetLeft;
    const RIGHT = LEFT + this.trackArea.clientWidth;
    const TOP = this.slider.offsetTop + this.trackArea.offsetTop;
    const BOTTOM = TOP + this.trackArea.clientHeight;

    const bounds = {
      LEFT,
      RIGHT,
      TOP,
      BOTTOM,
    };

    return bounds;
  }

  #postRenderInitialization() {
    window.onload = () => {
      // init the this.trackBounds when render paint finishes
      this.trackBounds = this.#calculateBounds();

      this.thumbDraggable.setAttribute('axis', `${this.vertical ? 'y' : 'x'}`);
      this.type === 'double' && this.thumbDraggableSecondary.setAttribute('axis', `${this.vertical ? 'y' : 'x'}`);

      // update initial position of thumb now that bounds have been initialized
      this.#moveThumb();
      this.type === 'double' && this.#moveThumb('secondary');

      // set the transition styles
      if (!this.thumbDraggable.style.transition && !this.progressTrack.style.transition) {
        this.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease');
        !this.vertical && this.progressTrack.style.setProperty('transition', 'width 0.2s ease, transform 0.2s ease');
      }
      if (this.type === 'double' && this.thumbDraggableSecondary && !this.thumbDraggableSecondary.style.transition) {
        this.thumbDraggableSecondary.style.setProperty('transition', 'transform 0.2s ease');
      }

      // init custom colors
      this.#updateColor();
      this.#updateProgressBar();

      // init labels
      if (this.type === 'step') {
        const arr = [];
        for (let i = 0; i < this.stepNumber; i++) {
          // rounds floats to 1st decimal
          arr[i] = Math.round(((this.max / (this.stepNumber - 1)) * i) * 10) / 10;
        }
        this.labels = arr;
      } else {
        this.container.querySelector('.tick:last-child').insertAdjacentHTML('afterbegin', `<ids-text label class="label ${this.vertical && 'vertical'}">${this.max}</ids-text>`);
        this.container.querySelector('.tick:first-child').insertAdjacentHTML('afterbegin', `<ids-text label class="label ${this.vertical && 'vertical'}">${this.min}</ids-text>`);
      }
    };
  }

  #addResizeObserver() {
    // update thumb positions and trackBounds with new values when window size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
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
      // console.log('click event fired')
      const idsSliderSelected = event.target.name === 'ids-slider';

      if (this.type !== 'step') {
        this.#hideTooltip(!idsSliderSelected);
        this.type === 'double' && this.#hideTooltip(!idsSliderSelected, 'secondary');
      }

      // console.log(event.clientX + ', ' + event.clientY);
      this.#calculateUIFromClick(event.clientX, event.clientY);
    });
  }

  #addDragEvents(primaryOrSecondary) {
    const d = this.type === 'double' && primaryOrSecondary === 'secondary';
    const obj = {
      thumbDraggable: d ? this.thumbDraggableSecondary : this.thumbDraggable,
      thumbDraggableOther: d ? this.thumbDraggable : this.thumbDraggableSecondary,
      primaryOrSecondary: d ? 'secondary' : 'primary',
      valueAttribute: d ? 'valueSecondary' : 'value',
      percentAttribute: d ? 'percentSecondary' : 'percent'
    };

    const swapZIndex = () => {
      if (obj.thumbDraggableOther) {
        obj.thumbDraggableOther.style.zIndex = 50;
        obj.thumbDraggable.style.zIndex = 51;
      }
    };

    // Listen for drag event on draggable thumb
    this.onEvent('ids-drag', obj.thumbDraggable, (e) => {
      this.type !== 'step' && this.#hideTooltip(false);

      const {
        LEFT,
        RIGHT,
        TOP,
        BOTTOM
      } = this.trackBounds;
      const [x, y] = [e.detail.mouseX, e.detail.mouseY];

      const mousePos = this.vertical ? y : x;
      const startPos = this.vertical ? TOP : LEFT;
      const endPos = this.vertical ? BOTTOM : RIGHT;

      const percent = this.#calcPercentFromMousePos(
        mousePos,
        startPos,
        endPos,
        obj.thumbDraggable.clientWidth
      );

      this.#hideThumbShadow(true, obj.primaryOrSecondary);

      this.type === 'double' && swapZIndex();
      // only set the percent--because changing the value causes the moveThumb() to fire like crazy
      this[obj.percentAttribute] = percent;
    });

    this.onEvent('ids-dragstart', obj.thumbDraggable, () => {
      obj.thumbDraggable.style.removeProperty('transition');
      this.progressTrack.style.removeProperty('transition');
      obj.thumbDraggable.blur();
      this.type === 'double' && obj.thumbDraggableOther.blur();
    });

    this.onEvent('ids-dragend', obj.thumbDraggable, () => {
      // console.log('ids-dragend, clickFromDrag is true')
      // this.clickFromDrag = true;
      obj.thumbDraggable.style.setProperty('transition', 'transform 0.2s ease 0s');
      !this.vertical && this.progressTrack.style.setProperty('transition', 'width 0.2s ease, transform 0.2s ease');
      obj.thumbDraggable.focus();
      // to ensure that after dragging, the value is updated only after dragging has ended..
      // this is the roundabout solution to prevent the firing of moveThumb() every ids-drag event
      const freshPercent = obj.primaryOrSecondary === 'secondary' ? this.percentSecondary : this.percent;
      const calcValue = this.#calcValueFromPercent(freshPercent);
      this[obj.valueAttribute] = calcValue;
    });

    this.onEvent('focus', obj.thumbDraggable, () => {
      if (this.type === 'double') {
        swapZIndex();
        obj.thumbDraggableOther.blur();
      }
      this.#hideThumbShadow(false, obj.primaryOrSecondary);
    });

    this.onEvent('blur', obj.thumbDraggable, () => {
      this.#hideThumbShadow(true, obj.primaryOrSecondary);
    });
  }

  #addKeyboardEvents() {
    this.onEvent('keydown', document, (event) => {
      if (document.activeElement.name === 'ids-slider') {
        let primaryOrSecondary = '';

        if (this.type === 'double') {
          // check if focus is on b or a
          if (this.thumbShadow.hasAttribute('hidden')) {
            primaryOrSecondary = 'secondary';
          }
        }

        switch (event.key) {
        case 'ArrowUp':
          this.#increaseValue(primaryOrSecondary);
          break;
        case 'ArrowDown':
          this.#decreaseValue(primaryOrSecondary);
          break;
        case 'ArrowRight':
          this.isRtl
            ? this.#decreaseValue(primaryOrSecondary)
            : this.#increaseValue(primaryOrSecondary);
          break;
        case 'ArrowLeft':
          this.isRtl
            ? this.#increaseValue(primaryOrSecondary)
            : this.#decreaseValue(primaryOrSecondary);
          break;
        default:
          break;
        }
      }
    });
  }

  #decreaseValue(primaryOrSecondary) {
    if (this.type === 'step') {
      this.value -= (this.max / (this.stepNumber - 1));
    } else if (this.type === 'double' && primaryOrSecondary === 'secondary') {
      this.valueSecondary = Math.ceil(this.valueSecondary) - 1;
    } else {
      this.value = Math.ceil(this.value) - 1;
    }
  }

  #increaseValue(primaryOrSecondary) {
    if (this.type === 'step') {
      this.value += (this.max / (this.stepNumber - 1));
    } else if (this.type === 'double' && primaryOrSecondary === 'secondary') {
      this.valueSecondary = Math.ceil(this.valueSecondary) + 1;
    } else {
      this.value = Math.ceil(this.value) + 1;
    }
  }
}

export default IdsSlider;
