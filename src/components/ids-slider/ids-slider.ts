import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import { colorNameToRgba, statusToIDSColor } from '../../utils/ids-color-utils/ids-color-utils';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-slider.scss';
import IdsDraggable from '../ids-draggable/ids-draggable';
import IdsText from '../ids-text/ids-text';

type IdsSliderType = 'single' | 'range' | 'step';

type IdsSliderTrackBounds = {
  BOTTOM: number;
  LEFT: number;
  RIGHT: number;
  TOP: number;
};

const TYPES = [
  'single',
  'range',
  'step'
];

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_TYPE = TYPES[0];
const DEFAULT_TRACKER_BOUNDS = {
  BOTTOM: NaN,
  LEFT: NaN,
  RIGHT: NaN,
  TOP: NaN
};

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Slider Component
 * @type {IdsSlider}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 */
@customElement('ids-slider')
@scss(styles)
export default class IdsSlider extends Base {
  DEFAULT_MIN = DEFAULT_MIN;

  DEFAULT_MAX = DEFAULT_MAX;

  DEFAULT_TYPE = DEFAULT_TYPE;

  #trackBounds: IdsSliderTrackBounds = DEFAULT_TRACKER_BOUNDS;

  #label = '';

  #labelSecondary = '';

  #labels: string[] = [];

  #isRTL = false;

  #mouseHover = false;

  #percent = NaN;

  #percentSecondary = NaN;

  slider?: HTMLElement | null;

  trackArea?: HTMLElement | null;

  progressTrack?: HTMLElement | null;

  track?: HTMLElement | null;

  tickContainer?: HTMLElement | null;

  thumb?: HTMLElement | null;

  thumbDraggable?: IdsDraggable | null;

  thumbShadow?: HTMLElement | null;

  tooltip?: HTMLElement | null;

  tooltipText?: IdsText | null;

  tooltipPin?: HTMLElement | null;

  firstTick?: HTMLElement | null;

  lastTick?: HTMLElement | null;

  thumbSecondary?: HTMLElement | null;

  thumbDraggableSecondary?: IdsDraggable | null;

  thumbShadowSecondary?: HTMLElement | null;

  thumbSecondaryDraggable: any;

  tooltipSecondary?: HTMLElement | null;

  tooltipTextSecondary?: IdsText | null;

  tooltipPinSecondary?: HTMLElement | null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.slider = this.container?.querySelector('.slider');
    this.trackArea = this.container?.querySelector('.track-area');
    this.progressTrack = this.container?.querySelector('.track-progress');
    this.track = this.container?.querySelector('.track');
    this.tickContainer = this.container?.querySelector('.tick-container');

    this.#mouseHover = false;
    this.thumb = this.container?.querySelector('.thumb');
    this.thumbDraggable = this.container?.querySelector('.thumb-draggable');
    this.thumbShadow = this.container?.querySelector('.thumb-shadow');
    this.tooltip = this.container?.querySelector('.tooltip');
    this.tooltipText = this.container?.querySelector('.tooltip .text');
    this.tooltipPin = this.container?.querySelector('.tooltip .pin');
    this.lastTick = this.container?.querySelector('.tick:last-child');
    this.firstTick = this.container?.querySelector('.tick:first-child');

    if (this.type === 'range') {
      this.thumbSecondary = this.container?.querySelector('.thumb.secondary');
      this.thumbDraggableSecondary = this.container?.querySelector('.thumb-draggable.secondary');
      this.thumbShadowSecondary = this.container?.querySelector('.thumb-shadow.secondary');
      this.tooltipSecondary = this.container?.querySelector('.tooltip.secondary');
      this.tooltipTextSecondary = this.container?.querySelector('.tooltip.secondary .text.secondary');
      this.tooltipPinSecondary = this.container?.querySelector('.tooltip .pin.secondary');
    } else {
      this.container?.querySelector('.thumb-draggable.secondary')?.remove();
    }

    this.#attachEventListeners();
    this.#attachUIStyles();
    this.#attachARIA();
    this.#setVertical();
    this.#setStepNumber();
    this.#setStepLabels();

    // @TODO find a better way to apply animation/transition rules after the component loads (#698)
    setTimeout(() => {
      this.#toggleAnimations(true);
    }, 300);
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      attributes.COLOR,
      attributes.DISABLED,
      attributes.LABEL,
      attributes.LABEL_SECONDARY,
      attributes.MIN,
      attributes.MAX,
      attributes.READONLY,
      attributes.STEP_NUMBER,
      attributes.SHOW_TOOLTIP,
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

  template(): string {
    const disabledClass = this.disabled ? ' disabled' : '';
    const readonlyClass = this.readonly ? ' readonly' : '';
    const draggableTabIndex = (!disabledClass.length) ? '0' : '-1';

    return `
      <div class="ids-slider${disabledClass}${readonlyClass}">
        <div class="slider">
          <div class="track-area">
            <ids-draggable tabindex="${draggableTabIndex}" class="thumb-draggable" axis="${this.vertical ? 'y' : 'x'}" parent-containment>
              <div class="thumb-shadow"></div>
              <div class="thumb">
                <div class="tooltip">
                  <ids-text class="text">${this.value}</ids-text>
                  <div class="pin"></div>
                </div>
              </div>
            </ids-draggable>
            <ids-draggable tabindex="${draggableTabIndex}" class="thumb-draggable secondary" axis="${this.vertical ? 'y' : 'x'}" parent-containment>
              <div class="thumb-shadow secondary"></div>
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

  /**
   * Controls Slider disabled state
   * @param {boolean | string} value If true, will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      if (this.readonly) this.readonly = false;
      this.setAttribute(attributes.DISABLED, '');
      this.container?.classList.add(attributes.DISABLED);
      this.thumbDraggable?.setAttribute(attributes.DISABLED, 'true');
      this.thumbDraggable?.setAttribute(attributes.TABINDEX, '-1');
      this.#updateTooltipDisplay(true);
      if (this.type === 'range') {
        this.thumbDraggableSecondary?.setAttribute(attributes.DISABLED, 'true');
        this.thumbDraggableSecondary?.setAttribute(attributes.TABINDEX, '-1');
        this.#updateTooltipDisplay(true, 'secondary');
      }
    } else {
      this.removeAttribute(attributes.DISABLED);
      this.container?.classList.remove(attributes.DISABLED);
      this.thumbDraggable?.setAttribute(attributes.DISABLED, 'false');
      this.thumbDraggable?.setAttribute(attributes.TABINDEX, '0');
      if (this.type === 'range') {
        this.thumbDraggableSecondary?.setAttribute(attributes.DISABLED, 'false');
        this.thumbDraggableSecondary?.setAttribute(attributes.TABINDEX, '0');
      }
    }
    this.#updateColor();
  }

  /**
   * @returns {boolean} true if the slider is disabled
   */
  get disabled(): boolean {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * Controls Slider readonly state
   * @param {boolean | string} value If true, will set `readonly` attribute
   */
  set readonly(value: boolean | string) {
    const val = stringToBool(value);
    if (val) {
      if (this.disabled) this.disabled = false;
      this.setAttribute(attributes.READONLY, '');
      this.container?.classList.add(attributes.READONLY);
      this.thumbDraggable?.setAttribute(attributes.DISABLED, 'true');
      if (this.type === 'range') {
        this.thumbDraggableSecondary?.setAttribute(attributes.DISABLED, 'true');
        this.#updateTooltipDisplay(true, 'secondary');
      }
    } else {
      this.removeAttribute(attributes.READONLY);
      this.container?.classList.remove(attributes.READONLY);
      this.thumbDraggable?.setAttribute(attributes.DISABLED, 'false');
      if (this.type === 'range') this.thumbDraggableSecondary?.setAttribute(attributes.DISABLED, 'false');
    }
    this.#updateColor();
  }

  /**
   * @returns {boolean} true if the slider is readonly
   */
  get readonly(): boolean {
    return this.hasAttribute(attributes.READONLY);
  }

  /**
   * Modifies the primary Slider thumb's label contents
   * @param {string} value the label text contents
   */
  set label(value: string) {
    const safeValue = stripHTML(value);
    const currentValue = this.#label;
    if (safeValue !== currentValue) {
      if (safeValue.length) {
        this.#label = safeValue;
        this.setAttribute(attributes.LABEL, safeValue);
      } else {
        this.#label = '';
        this.removeAttribute(attributes.LABEL);
      }
      this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_LABEL, `${this.#label}`);
    }
  }

  /**
   * @returns {string} the primary Slider thumb's label contents
   */
  get label(): string {
    return this.#label || stripHTML(this.getAttribute(attributes.LABEL) ?? '');
  }

  /**
   * Modifies the primary Slider thumb's label contents
   * @param {string} value the label text contents
   */
  set labelSecondary(value: string) {
    const safeValue = stripHTML(value);
    const currentValue = this.#labelSecondary;
    if (safeValue !== currentValue) {
      if (safeValue.length) {
        this.#labelSecondary = safeValue;
        this.setAttribute(attributes.LABEL_SECONDARY, safeValue);
      } else {
        this.#labelSecondary = '';
        this.removeAttribute(attributes.LABEL_SECONDARY);
      }
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_LABEL, `${this.#labelSecondary}`);
    }
  }

  /**
   * @returns {string} the primary Slider thumb's label contents
   */
  get labelSecondary(): string {
    return this.#labelSecondary || stripHTML(this.getAttribute(attributes.LABEL_SECONDARY) ?? '');
  }

  /**
   * Set the orientation of the slider
   * @param {boolean} value Whether the orientation is vertical or horizontal
   */
  set vertical(value: boolean) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.VERTICAL, 'true');
    } else {
      this.removeAttribute(attributes.VERTICAL);
    }
    this.#setVertical();
  }

  /**
   * @returns {boolean} true if the slider is vertical
   */
  get vertical() {
    return this.hasAttribute(attributes.VERTICAL);
  }

  #setVertical() {
    if (this.vertical) {
      this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_ORIENTATION, 'vertical');
      if (this.type === 'range') this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_ORIENTATION, 'vertical');
      this.container?.classList.add('vertical');
      this.slider?.classList.add('vertical');
      this.progressTrack?.classList.add('vertical');
      this.track?.classList.add('vertical');
      this.trackArea?.classList.add('vertical');
      this.tickContainer?.classList.add('vertical');
      this.tooltip?.classList.add('vertical');
      if (this.type === 'range') this.tooltipSecondary?.classList.add('vertical');
      this.tooltipPin?.classList.add('vertical');
      if (this.type === 'range') this.tooltipPinSecondary?.classList.add('vertical');
    } else {
      this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_ORIENTATION, 'horizontal');
      if (this.type === 'range') this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_ORIENTATION, 'horizontal');
    }
  }

  /**
   * Keep track of RTL
   * @param {boolean} value Whether or not RTL is in effect
   */
  set isRTL(value: boolean) {
    if (value !== this.isRTL) {
      this.#isRTL = value;
      this.#moveThumb();
      this.#updateProgressBar();
      if (this.type === 'range') this.#moveThumb('secondary');
    }
  }

  /**
   * @returns {boolean} true if the slider is displayed in RTL mode
   */
  get isRTL(): boolean {
    if (typeof this.#isRTL === 'undefined') this.#isRTL = false;
    return this.#isRTL;
  }

  /**
   * Handle Languages Changes
   */
  onLanguageChange = () => {
    const isRTL = this.localeAPI.isRTL();
    this.isRTL = isRTL;
  };

  /**
   * Helper method to update the UI of the tooltip and its text
   * @private
   * @param {number} value the text the tooltip should display
   * @param {string} primaryOrSecondary which tooltip to update
   */
  #updateTooltip(value?: number, primaryOrSecondary?: string): void {
    let tooltipText = this.tooltipText;
    let type = 'primary';

    if (primaryOrSecondary === 'secondary') {
      tooltipText = this.tooltipTextSecondary;
      type = 'secondary';
    }

    if (tooltipText) tooltipText.innerHTML = String(Math.ceil(Number(value)));

    if (this.type !== 'step') {
      this.#updateTooltipDisplay(false, type);
    }
  }

  /**
   * Helper method to update the UI of the progress track bar
   * @private
   */
  #updateProgressBar(): void {
    if (this.type !== 'range') {
      this.slider?.style.setProperty('--percentStart', '0');
      this.slider?.style.setProperty('--percentEnd', String(this.percent));
    } else {
      const minPercent = Math.min(this.percent, this.percentSecondary);
      const maxPercent = Math.max(this.percent, this.percentSecondary);
      this.slider?.style.setProperty('--percentStart', String(minPercent));
      this.slider?.style.setProperty('--percentEnd', String(maxPercent));

      if (this.#trackBounds) {
        const {
          TOP,
          BOTTOM,
          LEFT,
          RIGHT
        } = this.#trackBounds;

        const startPos = this.vertical ? BOTTOM : LEFT;
        const endPos = this.vertical ? TOP : RIGHT;
        const centered = false;
        let trans = this.#calcTranslateFromPercent(startPos, endPos, minPercent, centered);
        if (this.vertical || this.isRTL) { trans *= -1; }
        const transString = this.vertical ? `translate(0, ${trans}px)` : `translate(${trans}px, 0)`;
        this.progressTrack?.style.setProperty('transform', transString);
      }
    }
  }

  /**
   * Set the labels to display on each step/tick mark (only applicable to step sliders)
   * @param {Array<string>} array the list of labels to set
   */
  set labels(array) {
    this.#labels = array;
    this.#setStepLabels();
  }

  get labels(): Array<string> {
    return this.#labels || [];
  }

  /**
   * Helper method to update the labels on the UI according to stepNumber and labels
   * @private
   */
  #setStepLabels(): void {
    if (this.type !== 'step') return;

    const labels = this.labels;
    const labelsLength = labels?.length || 0;
    const stepNumber = this.stepNumber;

    // check to make sure labels length is equal to step number

    if (labelsLength === stepNumber) {
      // check amount of label elements -- add or remove accordingly
      let labelElements = this.container?.querySelectorAll('.label') || [];
      const labelElementsLength = labelElements.length || 0;
      const ticks = this.container?.querySelectorAll('.tick') || [];

      if (labelElements && labelElementsLength !== stepNumber) {
        const x = Math.abs(stepNumber - labelElementsLength);
        const labelAttr = !this.disabled ? ' label' : '';

        for (let i = 0; i < x; i++) {
          if (ticks && labelElements && labelElementsLength < stepNumber) {
            ticks[ticks.length - 1 - i]?.insertAdjacentHTML('afterbegin', `<ids-text${labelAttr} class="label"></ids-text>`);
          }
        }
        // grab fresh label elements group
        labelElements = this.container?.querySelectorAll('.label') || [];
      }
      // set the innerHTML for each label in the array

      if (labels && labelsLength === labelElementsLength) {
        labelElements?.forEach((x: { innerHTML: any; classList: { add: (arg0: string) => any; }; }, i: number) => {
          x.innerHTML = this.vertical ? labels[labelsLength - 1 - i] : labels[i];
          if (this.vertical) x?.classList.add('vertical'); // add vertical styles
        });
      }
    } else {
      // set labels to be empty
      const labelElements = this.container?.querySelectorAll('.label');
      labelElements?.forEach((x: { innerHTML: string; }) => {
        x.innerHTML = '';
      });
    }
  }

  /**
   * Helper method for setLabels and initialization of labels
   * @returns {Array} An array the size of stepNumber with numerical intervals between the min and max
   */
  #generateNumericalLabels(): Array<any> {
    const arr = [];
    for (let i = 0; i < this.stepNumber; i++) {
      // rounds floats to 1st decimal
      arr[i] = Math.round(((this.max / (this.stepNumber - 1)) * i) * 10) / 10;
    }
    return arr;
  }

  /**
   * Sets the interval between slider ticks (only applicable to step sliders)
   * @param {string | number | any} value the amount of steps
   */
  set stepNumber(value: string | number | any) {
    if (this.type === 'step') {
      // must have at least 2 steps
      if (parseInt(value) >= 2) {
        this.setAttribute(attributes.STEP_NUMBER, value);
      }
    } else {
      this.removeAttribute(attributes.STEP_NUMBER);
    }

    this.#setStepNumber();
  }

  /**
   * @returns {number} the interval between slider ticks
   */
  get stepNumber(): number { return parseInt(this.getAttribute(attributes.STEP_NUMBER) ?? '') || 2; }

  #setStepNumber() {
    if (this.type === 'step') {
      if (this.stepNumber >= 2) {
        const stepLength = this.container?.querySelectorAll('.tick').length ?? 0;

        if (stepLength !== this.stepNumber) {
          const x = Math.abs(stepLength - this.stepNumber);
          for (let i = 0; i < x; i++) {
            // remove or add ticks accordingly
            if (stepLength > this.stepNumber) {
              this.container?.querySelector('.tick')?.remove();
            } else {
              this.container?.querySelector('.tick:last-child')?.insertAdjacentHTML('afterend', `<span class="tick"></span>`);
            }
          }
        }
      }
      this.labels = this.#generateNumericalLabels();
    }
  }

  /**
   * Sets the secondary slider thumb value based on percentage (range slider only)
   * @param {number | string} value the secondary thumb value as a percentage
   */
  set percentSecondary(value: number | string) {
    this.#percentSecondary = Number(value);
    this.#updateProgressBar();
    this.#updateTooltip(this.#calcValueFromPercent(this.#percentSecondary), 'secondary');
  }

  /**
   * @returns {number} the secondary thumb value as a percentage (range slider only)
   */
  get percentSecondary(): number {
    // we need all these checks so that it still works with 0
    if (Number.isNaN(this.#percentSecondary) || typeof this.#percentSecondary === 'undefined' || this.#percentSecondary === null || (this.#percentSecondary as any) === '') {
      // calculate on the fly if not a valid number
      return ((this.valueSecondary - this.min) / (this.max - this.min)) * 100;
    }
    return this.#percentSecondary;
  }

  /**
   * Sets the primary slider thumb value based on percentage
   * @param {number | string} value the secondary thumb value as a percentage
   */
  set percent(value: number | string) {
    this.#percent = Number(value);
    this.#updateProgressBar();
    this.#updateTooltip(this.#calcValueFromPercent(this.#percent));
  }

  /**
   * @returns {number} the primary thumb value as a percentage
   */
  get percent(): number {
    if (Number.isNaN(this.#percent) || typeof this.#percent === 'undefined' || this.#percent === null || (this.#percent as any) === '') {
      return ((this.value - this.min) / (this.max - this.min)) * 100;
    }
    return this.#percent;
  }

  /**
   * Sanitizes a value to be applied to the slider, and doesn't allow the value
   * to pass beyond the min/max values.
   * @private
   * @param {string | number | any} value incoming value to set
   * @param {boolean} secondary true if this value represents the secondary slider thumb (range slider only)
   * @returns {number} the corrected slider number
   */
  #sanitizeValue(value: string | number | any, secondary?: boolean): number {
    const fixedValue = parseFloat(value);
    if (fixedValue <= this.min) {
      return this.min;
    }
    if (fixedValue >= this.max) {
      return this.max;
    }
    if (this.type === 'range') {
      if (!secondary && fixedValue >= this.valueSecondary) {
        return this.valueSecondary;
      }
      if (secondary && fixedValue <= this.value) {
        return this.value;
      }
    }
    return fixedValue;
  }

  /**
   * Set the secondary value of the slider (range slider only)
   * @param {string} value The secondary input value
   */
  set valueSecondary(value: string | number | any) {
    if (this.readonly || this.disabled) return;

    const newValue = this.#sanitizeValue(value, true);

    this.setAttribute(attributes.VALUE_SECONDARY, `${newValue}`);
    this.percentSecondary = ((newValue - this.min) / (this.max - this.min)) * 100;
    this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUENOW, `${newValue}`);
    this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUETEXT, `${newValue}`);
    if (this.type === 'range') {
      this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUEMIN, `${newValue}`);
    }
    this.#updateTooltip(newValue, 'secondary');
    this.#moveThumb('secondary');
    this.#triggerChangeEvent(newValue, 'secondary');
  }

  /**
   * @returns {number} the secondary slider value (range slider only)
   */
  get valueSecondary(): number {
    const b = this.getAttribute(attributes.VALUE_SECONDARY);
    if (b === null || b === '' || Number.isNaN(b)) {
      return this.max;
    }

    return parseFloat(this.getAttribute(attributes.VALUE_SECONDARY) ?? '');
  }

  /**
   * Set the primary value of the slider
   * @param {string} value The primary input value
   */
  set value(value: string | number | any) {
    if (this.readonly || this.disabled) return;

    const currentValue = parseFloat(this.getAttribute(attributes.VALUE) ?? '') || this.min;
    const newValue = this.#sanitizeValue(value);

    if (currentValue !== newValue) {
      this.setAttribute(attributes.VALUE, `${newValue}`);
      this.percent = ((newValue - this.min) / (this.max - this.min)) * 100;
      this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUENOW, `${newValue}`);
      this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUETEXT, `${newValue}`);
      if (this.type === 'range') {
        this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUEMIN, `${newValue}`);
      }
      this.#updateTooltip(newValue, 'primary');
      this.#moveThumb('primary');
      this.#triggerChangeEvent(newValue, 'primary');
    }
  }

  /**
   * @returns {number} the primary slider value
   */
  get value(): number {
    const a = this.getAttribute(attributes.VALUE);
    if (a === null || a === '' || Number.isNaN(a)) {
      return this.min;
    }
    return parseFloat(this.getAttribute(attributes.VALUE) ?? '');
  }

  /**
   * Triggers a Change Event
   * @param {string | number | any } value the value of the slider handle
   * @param {string} [thumb] the slider thumb causing the change
   */
  #triggerChangeEvent(value: string | number | any, thumb?: undefined | string): void {
    this.triggerEvent('change', this, {
      bubbles: true,
      detail: {
        elem: thumb === 'secondary' ? this.thumbSecondaryDraggable : this.thumbDraggable,
        percent: thumb === 'secondary' ? this.percentSecondary : this.percent,
        value
      }
    });
  }

  /**
   * Sets the minimum-possible value of the slider
   * @param {string} value The desired minimum
   */
  set min(value: string | number | any) {
    const val: any = parseFloat(value);
    if (val >= this.max || val === null || val === '' || Number.isNaN(val)) {
      this.setAttribute(attributes.MIN, String(DEFAULT_MIN));
    } else {
      this.setAttribute(attributes.MIN, val);
    }
  }

  /**
   * @returns {number} the minimum value possible that can be set on slider thumbs
   */
  get min(): number {
    return parseFloat(this.getAttribute(attributes.MIN) ?? '') || DEFAULT_MIN;
  }

  /**
   * Sets the maximum-possible value of the slider
   * @param {string} value The desired max
   */
  set max(value: string | number | any) {
    const val: any = parseFloat(value);
    if (val <= this.min || val === null || val === '' || Number.isNaN(val)) {
      this.setAttribute(attributes.MAX, String(this.min + DEFAULT_MAX));
    } else {
      this.setAttribute(attributes.MAX, val);
    }
  }

  /**
   * @returns {number} the maximum value possible that can be set on slider thumbs
   */
  get max(): number {
    const val: any = parseFloat(this.getAttribute(attributes.MAX) ?? '');
    if (val <= this.min || val === null || val === '' || Number.isNaN(val)) {
      return DEFAULT_MAX;
    }
    return val;
  }

  /**
   * Sets the slider type
   * @param {IdsSliderType} value The type of slider
   */
  set type(value: IdsSliderType) {
    if (value && TYPES.includes(value)) {
      this.setAttribute(attributes.TYPE, value);
    } else {
      this.setAttribute(attributes.TYPE, DEFAULT_TYPE);
    }
    this.container?.classList[value === 'range' ? 'add' : 'remove']('range');
  }

  /**
   * @returns {IdsSliderType} the slider type
   */
  get type(): IdsSliderType {
    return (this.getAttribute(attributes.TYPE) || DEFAULT_TYPE) as IdsSliderType;
  }

  /**
   * Enables a tooltip displaying thumb values when either thumb is focused
   * @param {boolean | string} value true if the thumb should display tooltips
   */
  set showTooltip(value: boolean | string | null) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.TOOLTIP, `${value}`);
    } else {
      this.removeAttribute(attributes.TOOLTIP);
    }
  }

  /**
   * @returns {boolean} true if the thumb will display tooltips
   */
  get showTooltip(): boolean {
    return this.hasAttribute(attributes.TOOLTIP);
  }

  /**
   * Set the color of the bar
   * @param {string} value The color, this can be a hex code with the #, a native css color, or an ids-status color
   */
  set color(value: string) {
    this.setAttribute(attributes.COLOR, value);
    this.#updateColor();
  }

  /**
   * @returns {string} the specified color value
   */
  get color(): string { return this.getAttribute(attributes.COLOR) || ''; }

  /**
   * @private
   * @returns {boolean} true if this slider should have a custom color applied
   */
  #shouldApplyColor(): boolean {
    return !this.readonly && !this.disabled;
  }

  /**
   * Updates the thumb and tick colors on the slider based on the `color` attribute and other settings
   * @private
   */
  #updateColor(): void {
    let color;
    if (this.#shouldApplyColor()) {
      color = this.color;
    }

    const ticks = this.container?.querySelectorAll<HTMLElement>('.tick') || [];

    if (color) {
      let colorString = color;
      if (color.substring(0, 1) !== '#') {
        colorString = statusToIDSColor(color);
      }
      const rgbaColor = colorNameToRgba(colorString, 0.1);

      ticks?.forEach((tick: { children: HTMLCollection, style: CSSStyleDeclaration }) => {
        tick?.style.setProperty('background-color', colorString);
        tick?.children[0]?.setAttribute('label', '');
      });
      this.thumb?.style.setProperty('background-color', colorString);
      this.thumbShadow?.style.setProperty('background-color', rgbaColor);
      this.thumbShadow?.style.setProperty('border', `1px ${colorString} solid`);
      this.progressTrack?.style.setProperty('background-color', colorString);
      if (this.type === 'range' && this.thumbShadowSecondary && this.thumbSecondary) {
        this.thumbShadowSecondary?.style.setProperty('background-color', rgbaColor);
        this.thumbShadowSecondary?.style.setProperty('border', `1px ${colorString} solid`);
        this.thumbSecondary?.style.setProperty('background-color', colorString);
      }
    } else {
      ticks?.forEach((tick: { children: HTMLCollection, style: CSSStyleDeclaration }) => {
        tick?.style.removeProperty('background-color');
        if (!this.readonly) {
          tick.children[0]?.removeAttribute('label');
        } else {
          tick.children[0]?.setAttribute('label', '');
        }
      });
      this.thumb?.style.removeProperty('background-color');
      this.thumbShadow?.style.removeProperty('background-color');
      this.thumbShadow?.style.removeProperty('border');
      this.progressTrack?.style.removeProperty('background-color');
      if (this.type === 'range' && this.thumbShadowSecondary && this.thumbSecondary) {
        this.thumbShadowSecondary?.style.removeProperty('background-color');
        this.thumbShadowSecondary?.style.removeProperty('border');
        this.thumbSecondary?.style.removeProperty('background-color');
      }
    }
  }

  /**
   * Hide/show the tooltip of the value
   * @private
   * @param {boolean} hide whether or not to hide it
   * @param {primaryOrSecondary} primaryOrSecondary which tooltip to hide
   */
  #updateTooltipDisplay(hide: boolean, primaryOrSecondary?: string): void {
    if (!this.showTooltip) {
      hide = true;
    }
    if (primaryOrSecondary === 'secondary' && this.tooltipSecondary) {
      this.tooltipSecondary.style.setProperty('opacity', hide ? '0' : '1');
    } else {
      this.tooltip?.style.setProperty('opacity', hide ? '0' : '1');
    }
  }

  /**
   * Hide/show the spotlight/box-shadow of the thumb
   * @private
   * @param {boolean} hide whether or not to hide it
   * @param {string} primaryOrSecondary which thumb to hide
   */
  #updateThumbShadow(hide: boolean, primaryOrSecondary: string): void {
    let thumbShadow = this.thumbShadow;

    if (primaryOrSecondary === 'secondary' && this.thumbShadowSecondary) {
      thumbShadow = this.thumbShadowSecondary;
    }

    if (hide) {
      thumbShadow?.classList.remove('active');
    } else {
      thumbShadow?.classList.add('active');
    }
  }

  /**
   * Helper method to calculate the percentage of slider from mouse click; not a pure function
   * @private
   * @param {number} x coordinate of mouse click
   * @param {number} y coordinate of mouse click
   * @returns {number} the percent
   */
  #calcPercentFromClick(x: number, y: number): number {
    this.#refreshTrackBounds();
    const {
      TOP,
      BOTTOM,
      LEFT,
      RIGHT
    } = this.#trackBounds;

    const mousePos = this.vertical ? y : x;
    const horizontalStart = this.isRTL ? RIGHT : LEFT;
    const horizontalEnd = this.isRTL ? LEFT : RIGHT;
    const startPos = this.vertical ? BOTTOM : horizontalStart;
    const endPos = this.vertical ? TOP : horizontalEnd;

    const percent = this.#calcPercentFromRange(mousePos, startPos, endPos);

    return percent;
  }

  /**
   * Perform the calculations to update the UI and value(s)/percent(s) accordingly
   * @private
   * @param {number} x coordinate of mouse click
   * @param {number} y coordnate of mouse click
   * @param {number} labelValueClicked if label was clicked or not
   * @param {string} primaryOrSecondary string representing the primary/secondary label for range sliders
   */
  #calculateUIFromClick(x: number, y: number, labelValueClicked?: number, primaryOrSecondary?: string): void {
    if (this.type !== 'step') {
      let value = labelValueClicked ?? this.#calcValueFromPercent(this.#calcPercentFromClick(x, y));

      const thumbPos = this.vertical
        ? this.thumbDraggable?.getBoundingClientRect().y
        : this.thumbDraggable?.getBoundingClientRect().x;

      let thumbDraggable = this.thumbDraggable;
      let valueAttribute = 'value';

      if (this.type === 'range') {
        const thumbPosSecondary = this.vertical
          ? this.thumbDraggableSecondary?.getBoundingClientRect().y
          : this.thumbDraggableSecondary?.getBoundingClientRect().x;

        // figure out which thumb is closer to the click location
        const mousePos = this.vertical ? y : x;

        if (Math.abs(mousePos - (thumbPos ?? NaN)) > Math.abs(mousePos - (thumbPosSecondary ?? NaN))) {
          thumbDraggable = this.thumbDraggableSecondary;
          valueAttribute = 'valueSecondary';
          primaryOrSecondary = 'secondary';
        }

        // Correct the placement of the thumb if it goes beyond the opposite thumb's value
        if (primaryOrSecondary === 'primary' && value > this.valueSecondary) {
          value = (this.valueSecondary - 1);
        } else if (primaryOrSecondary === 'secondary' && value < this.value) {
          value = (this.value + 1);
        }
      }

      if (value !== (this as any)[valueAttribute]) {
        (this as any)[valueAttribute] = value;
      } else {
        this.#moveThumb(primaryOrSecondary);
        this.#triggerChangeEvent(value, primaryOrSecondary);
      }

      thumbDraggable?.focus();
    } else {
      // for step sliders, snap to the closest interval
      const arr = [];

      for (let i = 0; i < this.stepNumber; i++) {
        arr[i] = (this.max / (this.stepNumber - 1)) * i;
      }

      const passedValue = labelValueClicked || this.#calcPercentFromClick(x, y);
      const differences = arr.map((val) => Math.abs(val - ((passedValue / 100) * this.max)));

      let min = differences[0];
      let minIndex = 0;

      for (let i = 0; i < differences.length; i++) {
        if (differences[i] < min) {
          min = differences[i];
          minIndex = i;
        }
      }

      const targetValue = arr[minIndex];
      this.percent = targetValue;
      if (targetValue !== this.value) {
        this.value = targetValue;
      } else {
        this.#moveThumb('primary');
        this.#triggerChangeEvent(targetValue, 'primary');
      }

      this.thumbDraggable?.focus();
    }
  }

  /**
   * Translate the thumb(s) according to the percent values
   * @private
   * @param {string} primaryOrSecondary which thumb to move
   */
  #moveThumb(primaryOrSecondary?: string) {
    this.#refreshTrackBounds();

    let thumbDraggable = this.thumbDraggable;
    let percent = this.percent;

    // secondary values
    if (primaryOrSecondary === 'secondary' && this.type === 'range') {
      thumbDraggable = this.thumbDraggableSecondary;
      percent = this.percentSecondary;
    }

    const {
      TOP,
      BOTTOM,
      LEFT,
      RIGHT
    } = this.#trackBounds;

    const startPos = this.vertical ? BOTTOM : LEFT;
    const endPos = this.vertical ? TOP : RIGHT;
    const centered = true;
    let trans = this.#calcTranslateFromPercent(startPos, endPos, percent, centered);

    if (this.vertical || this.isRTL) { trans *= -1; }
    const transString = this.vertical ? `translate(0, ${trans}px)` : `translate(${trans}px, 0)`;
    thumbDraggable?.style.setProperty('transform', transString);
  }

  /**
   * Calculate the true value based on the percent value
   * @private
   * @param {number} percent the percent value to convert to numerical value btw min and max
   * @returns {number} the calculated value
   */
  #calcValueFromPercent(percent: number): number {
    return ((percent / 100) * (this.max - this.min)) + (this.min);
  }

  /**
   * Calculate the pixels to translate thumb(s) or progress track based on percent value
   * @private
   * @param {number} nStart the starting x or y coordinate of the slider
   * @param {number} nEnd the ending x or y coordinate of the slider
   * @param {number} percent the percent/location of the thumb relative to the slider
   * @param {boolean} centered whether or not the thumb(s) or progress track is centered or not
   * if notCentered is true, it will translate from 0
   * if notCentered is false, it will translate negatively and positively with 0 being the center
   * @returns {number} coordinates or the amount of pixels to translate by
   */
  #calcTranslateFromPercent(nStart: number, nEnd: number, percent: number, centered: boolean): number {
    // minus thumb height bc it overshoots
    const editedRange = Math.abs(nEnd - nStart) - (this.thumbDraggable?.clientWidth ?? NaN);
    let coord = (Math.ceil(percent) / 100) * editedRange;
    coord = centered ? coord - (editedRange / 2) : coord;

    return coord;
  }

  /**
   * Calculate the percent value based on mouse click location
   * @private
   * @param {number} n the mouse x or y coordinate
   * @param {number} nStart the starting x or y coordinate of the slider
   * @param {number} nEnd the ending x or y coordinate of the slider
   * @returns {number} the percent/location of the thumb relative to the slider
   */
  #calcPercentFromRange(n: number, nStart: number, nEnd: number): number {
    const thumbWidth = this.thumbDraggable?.clientWidth ?? NaN;
    let percent = 0;
    // allow bigger hit areas for controlling thumb
    const range = Math.abs(nStart - nEnd) - thumbWidth / 2;
    const endDelta = Math.abs(n - nEnd);
    const startDelta = Math.abs(n - nStart);
    if (endDelta > range) {
      percent = 0;
    } else if (startDelta > range) {
      percent = 100;
    } else {
      percent = ((startDelta - thumbWidth / 2) / (range - thumbWidth / 2)) * 100;
    }
    return percent;
  }

  /**
   * Attaches all necessary event listeners
   * @private
   */
  #attachEventListeners(): void {
    this.#attachResizeObserver();
    this.#attachDragEventListeners();
    if (this.type === 'range') this.#attachDragEventListeners('secondary');
    this.#attachFocusListeners();
    this.#attachKeyboardListeners();
    this.#attachClickListeners();
  }

  /**
   * Calculates the x,y coordinates of the bounding box of the clickable track area
   * @private
   * @returns {IdsSliderTrackBounds} The track area boundaries
   */
  #calculateTrackBounds(): IdsSliderTrackBounds {
    if (!this.trackArea) return DEFAULT_TRACKER_BOUNDS;

    const rect = this.trackArea.getBoundingClientRect();
    const LEFT = rect.left + window.scrollX;
    const TOP = rect.top + window.scrollY;
    const RIGHT = LEFT + this.trackArea.clientWidth;
    const BOTTOM = TOP + this.trackArea.clientHeight;

    const bounds = {
      LEFT,
      RIGHT,
      TOP,
      BOTTOM,
    };

    return bounds;
  }

  /**
   * @private
   * @param {boolean} toggleOn true if slider elements should be animated
   */
  #toggleAnimations(toggleOn: boolean): void {
    this.container?.classList[toggleOn ? 'add' : 'remove']('animated');
  }

  /**
   * Sets initial slider styles and element placement
   * @private
   */
  #attachUIStyles(): void {
    // init UI styles
    this.#updateProgressBar();
    this.#moveThumb();
    if (this.type === 'range') this.#moveThumb('secondary');
    this.#updateColor();

    // init base min/max labels
    if (this.firstTick && this.lastTick) {
      const maxTick = this.vertical ? this.firstTick : this.lastTick;
      const minTick = this.vertical ? this.lastTick : this.firstTick;

      minTick.innerHTML = `<ids-text label class="label${this.vertical ? ' vertical' : ''}">${this.min}</ids-text>`;
      maxTick.innerHTML = `<ids-text label class="label${this.vertical ? ' vertical' : ''}">${this.max}</ids-text>`;
    }
  }

  /**
   * Attaches ARIA attributes to some slider elements
   * @private
   */
  #attachARIA(): void {
    this.setAttribute(htmlAttributes.ROLE, 'none');
    this.thumbDraggable?.setAttribute(htmlAttributes.ROLE, 'slider');
    this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_ORIENTATION, this.vertical ? 'vertical' : 'horizontal');
    this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUEMIN, `${this.min}`);
    this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUEMAX, `${this.max}`);
    this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUENOW, `${this.value}`);
    this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_VALUETEXT, `${this.value}`);
    this.thumbDraggable?.setAttribute(htmlAttributes.ARIA_LABEL, `${this.label}`);

    if (this.type === 'range') {
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ROLE, 'slider');
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_ORIENTATION, this.vertical ? 'vertical' : 'horizontal');
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUEMIN, `${this.min}`);
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUEMAX, `${this.max}`);
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUENOW, `${this.valueSecondary}`);
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_VALUETEXT, `${this.valueSecondary}`);
      this.thumbDraggableSecondary?.setAttribute(htmlAttributes.ARIA_LABEL, `${this.labelSecondary}`);
    }
  }

  /**
   * Recalculates and updates the track bounds
   * @private
   */
  #refreshTrackBounds(): void {
    this.#trackBounds = this.#calculateTrackBounds();
  }

  /**
   * Checks if the window changes sizes and updates UI accordingly
   * @private
   */
  #attachResizeObserver(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          this.#refreshTrackBounds();
          this.#updateProgressBar();
          this.#moveThumb();
          if (this.type === 'range') this.#moveThumb('secondary');
        }
      }
    });

    if (this.trackArea) resizeObserver.observe(this.trackArea);
  }

  /**
   * Add event listeners for clicking the track area
   * @private
   */
  #attachClickListeners(): void {
    this.onEvent('click', this.container, (event: { target: { className: any; innerHTML: string; }; clientX: number; clientY: number; }) => {
      if (this.disabled || this.readonly) {
        return;
      }

      const className = event.target.className;
      const clickedIdsSlider = className.includes('ids-slider');
      const clickedLabel = className.includes('label');
      const clickedTrackArea = className.includes('track-area');

      if (clickedIdsSlider || clickedLabel || clickedTrackArea) {
        if (clickedTrackArea || clickedIdsSlider) {
          this.#calculateUIFromClick(event.clientX, event.clientY);
        } else {
          const labelValueClicked = parseFloat(event.target.innerHTML);
          this.#calculateUIFromClick(event.clientX, event.clientY, labelValueClicked);
        }
      }
    });

    this.onEvent('click', document, (event: any) => {
      if (event.target !== this && !this.disabled) {
        this.#updateTooltipDisplay(true);
        if (this.type === 'range') this.#updateTooltipDisplay(true, 'secondary');
      }
    });
  }

  /**
   * Add event listeners for dragging the slider thumbs
   * @private
   * @param {string} primaryOrSecondary the primary or secondary thumb
   */
  #attachDragEventListeners(primaryOrSecondary?: string): void {
    const d = this.type === 'range' && primaryOrSecondary === 'secondary';
    const obj = {
      thumbDraggable: d ? this.thumbDraggableSecondary : this.thumbDraggable,
      thumbDraggableOther: d ? this.thumbDraggable : this.thumbDraggableSecondary,
      primaryOrSecondary: d ? 'secondary' : 'primary',
      valueAttribute: d ? 'valueSecondary' : 'value',
      percentAttribute: d ? 'percentSecondary' : 'percent'
    };

    const swapZIndex = () => {
      if (obj.thumbDraggableOther) {
        obj.thumbDraggableOther?.style.setProperty('z-index', '50');
        obj.thumbDraggable?.style.setProperty('z-index', '51');
      }
    };

    // Listen for drag event on draggable thumb
    this.onEvent('drag', obj.thumbDraggable, (e: { detail: { mouseX: any; mouseY: any; }; }) => {
      if (this.type !== 'step') this.#updateTooltipDisplay(false);

      const [x, y] = [e.detail.mouseX, e.detail.mouseY];
      const percent = this.#calcPercentFromClick(x, y);

      if (this.type === 'range') swapZIndex();
      // only set the percent--because changing the value causes the moveThumb() to fire like crazy
      (this as any)[obj.percentAttribute] = percent;

      // Expose this event externally
      this.triggerEvent('ids-slider-drag', this, {
        bubbles: true,
        detail: {
          elem: obj.thumbDraggable,
          mouseX: e.detail.mouseX,
          mouseY: e.detail.mouseY,
          percent,
          value: this.#calcValueFromPercent(percent)
        }
      });
    });

    this.onEvent('dragstart', obj.thumbDraggable, () => {
      this.#toggleAnimations(false);
      this.#updateThumbShadow(true, obj.primaryOrSecondary);
      this.#updateThumbShadow(true, obj.primaryOrSecondary === 'secondary' ? 'primary' : 'secondary');
    });

    this.onEvent('dragend', obj.thumbDraggable, (e: CustomEvent) => {
      this.#toggleAnimations(true);
      obj.thumbDraggable?.focus();
      // to ensure that after dragging, the value is updated only after dragging has ended..
      // this is the roundabout solution to prevent the firing of moveThumb() every ids-drag event
      const freshPercent = obj.primaryOrSecondary === 'secondary' ? this.percentSecondary : this.percent;
      this.#calculateUIFromClick(e.detail.mouseX, e.detail.mouseY, freshPercent, obj.primaryOrSecondary);
      this.#updateThumbShadow(false, obj.primaryOrSecondary);
    });
  }

  /**
   * Add event listeners for arrow keys to move thumbs
   * @private
   */
  #attachKeyboardListeners(): void {
    this.onEvent('keydown', this, (event: { code: string; preventDefault: () => void; target: { name: string; }; key: any; }) => {
      if (this.readonly || this.disabled) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.code) > -1) {
        event.preventDefault();

        // Disables animation on non-step sliders when using keys
        if (this.type !== 'step') this.#toggleAnimations(false);
      }

      if (event.target.name === 'ids-slider') {
        let primaryOrSecondary = '';

        if (this.type === 'range') {
          // check if focus is on b or a
          if (this.thumbShadowSecondary?.classList.contains('active')) {
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
            if (this.isRTL) this.#decreaseValue(primaryOrSecondary);
            else this.#increaseValue(primaryOrSecondary);
            break;
          case 'ArrowLeft':
            if (this.isRTL) this.#increaseValue(primaryOrSecondary);
            else this.#decreaseValue(primaryOrSecondary);
            break;
          default:
            break;
        }
      }
    });

    this.onEvent('keyup', this, (event: { code: string; preventDefault: () => void; target: { name: string; }; key: any; }) => {
      if (this.readonly || this.disabled) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.code) > -1) {
        event.preventDefault();

        // Re-enables animation on non-step sliders when using keys
        if (this.type !== 'step') this.#toggleAnimations(true);
      }
    });
  }

  /**
   * Attaches events to the component related to focusin/focusout behavior
   * @private
   */
  #attachFocusListeners(): void {
    this.onEvent('mouseenter', this, () => {
      this.#mouseHover = true;
    });

    this.onEvent('mouseleave', this, () => {
      this.#mouseHover = false;
    });

    // FOCUS/BLUR EVENTS
    this.onEvent('focusin', this.container, (e: FocusEvent) => {
      if (!this.disabled && this.shadowRoot?.activeElement) {
        this.#updateTooltipDisplay(false);
        const target = e.target instanceof HTMLElement && e.target;

        if (target && target?.classList.contains('secondary')) {
          this.#updateThumbShadow(false, 'secondary');
          this.#updateThumbShadow(true, 'primary');
        } else {
          this.#updateThumbShadow(false, 'primary');
          if (this.type === 'range') {
            this.#updateThumbShadow(true, 'secondary');
          }
        }

        if (this.type === 'range') {
          this.#updateTooltipDisplay(false, 'secondary');
        }
      }
    });

    this.onEvent('focusout', this.container, () => {
      if (!this.shadowRoot?.activeElement && !this.#mouseHover) {
        this.#updateTooltipDisplay(true);
        this.#updateThumbShadow(true, 'primary');
        if (this.type === 'range') {
          this.#updateTooltipDisplay(true, 'secondary');
          this.#updateThumbShadow(true, 'secondary');
        }
      }
    });
  }

  /**
   * Helper method for arrow key actions
   * @private
   * @param {string} primaryOrSecondary the primary or secondary value
   */
  #decreaseValue(primaryOrSecondary: string): void {
    switch (this.type) {
      case 'step':
        this.value -= (this.max / (this.stepNumber - 1));
        break;
      case 'range':
        if (primaryOrSecondary === 'secondary') {
          this.valueSecondary = Math.max(Math.ceil(this.valueSecondary) - 1, this.value);
        } else {
          this.value = Math.max(Math.ceil(this.value) - 1, this.min);
        }
        break;
      default:
        this.value = Math.ceil(this.value) - 1;
    }
  }

  /**
   * Helper method for arrow key actions
   * @private
   * @param {string} primaryOrSecondary the primary or secondary value
   */
  #increaseValue(primaryOrSecondary: string): void {
    switch (this.type) {
      case 'step':
        this.value += (this.max / (this.stepNumber - 1));
        break;
      case 'range':
        if (primaryOrSecondary === 'secondary') {
          this.valueSecondary = Math.min(Math.ceil(this.valueSecondary) + 1, this.max);
        } else {
          this.value = Math.min(Math.ceil(this.value) + 1, this.valueSecondary);
        }
        break;
      default:
        this.value = Math.ceil(this.value) + 1;
    }
  }
}
