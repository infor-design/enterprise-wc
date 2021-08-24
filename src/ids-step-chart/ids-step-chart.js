import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import IdsColor from '../ids-color/ids-color';
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import styles from './ids-step-chart.scss';

/**
 * IDS Step Chart Component
 * @type {IdsStepChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part icon - slot for completed message icons
 */

@customElement('ids-step-chart')
@scss(styles)
class IdsStepChart extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
    this.internalStepsInProgress = [];
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.#handleEvents();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [

      attributes.COLOR,
      attributes.COMPLETED_LABEL,
      attributes.LABEL,
      attributes.PROGRESS_COLOR,
      attributes.STEP_NUMBER,
      attributes.VALUE
    ];
  }

  get color() { return this.getAttribute(attributes.COLOR); }

  set color(value) {
    /* istanbul ignore else */
    if (value) {
      this.setAttribute('color', value);

      this.container.querySelectorAll(`.complete`).forEach((completedStep) => {
        completedStep.setAttribute('color', value);
      });
    }
  }

  get completedLabel() { return this.getAttribute(attributes.COMPLETED_LABEL); }

  set completedLabel(value) {
    this.setAttribute('completed-label', value);
    this.container.querySelector('.completed-label').innerHTML = `${value}`;
  }

  get label() { return this.getAttribute(attributes.LABEL); }

  set label(value) {
    this.setAttribute('label', value);
    this.container.querySelector('.label').innerHTML = `${value}`;
  }

  get progressColor() { return this.getAttribute(attributes.PROGRESS_COLOR); }

  set progressColor(value) {
    this.setAttribute('progress-color', value);
    this.container.querySelectorAll(`.in-progress`).forEach((element) => {
      element.setAttribute('color', value);
    });
  }

  get stepNumber() { return parseInt(this.getAttribute(attributes.STEP_NUMBER)); }

  set stepNumber(value) {
    this.setAttribute('step-number', value);
    this.container.innerHTML = this.template();
    this.#updateColor();
  }

  get stepsInProgress() {
    return this.internalStepsInProgress;
  }

  set stepsInProgress(value) {
    this.internalStepsInProgress = value.map(Number);
    this.#updateColor();
  }

  get value() { return parseInt(this.getAttribute(attributes.VALUE)); }

  set value(value) {
    this.setAttribute('value', value);
    this.#updateColor();
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Custom Element `attributeChangedCallback` implementation
   * @param {string} name The name of attribute changed
   * @param {any} oldValue The old value
   * @param {any} newValue The new value
   * @returns {void}
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name !== 'step-count') {
      this[name] = newValue;
    }
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #handleEvents() {
    return this;
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    let labelContainer = `<ids-text class="label" id="chart-label" font-size="16">${this.label}</ids-text>`;
    let rightContainer = ``;
    let stepChart = '';
    let stepDiv = '';
    let template = '';

    for (let i = 1; i <= this.stepNumber; i++) {
      let classes = 'step';
      let color = ``;

      if (this.internalStepsInProgress && this.internalStepsInProgress.length > 0
        && this.progressColor
        && this.internalStepsInProgress.includes(i)) {
        classes += ` in-progress`;
        color = `${this.progressColor}`;
      } else if (i <= this.value) {
        color = `${this.color}`;
        classes += ` complete`;
      } else {
        color = `graphite03`;
        classes += ` untouched`;
      }

      stepDiv += `<div class="${classes}" color="${color}" part="step"></div>`;
    }

    stepChart = `<div class="step-chart-container" part="step-chart"> ${stepDiv} </div>`;

    if (this.completedLabel) {
      rightContainer += `<ids-text class="completed-label" font-size="14">${this.completedLabel}</ids-text>`;
    } else {
      rightContainer += `<ids-text class="completed-label" font-size="14"></ids-text>`;
    }

    rightContainer += `<slot name="icon"></slot>`;

    labelContainer += `<div class="secondary-label">${rightContainer}</div>`;

    template = `<div class="ids-step-chart"><div class="step-label-container">${labelContainer}</div>${stepChart}</div>`;
    return template;
  }

  /**
   * updates the colors and classes of the step divs
   */
  #updateColor() {
    this.container.querySelectorAll(`.step`).forEach((element, index) => {
      element.className = '';
      if (this.internalStepsInProgress
        && this.internalStepsInProgress.length > 0
        && this.progressColor
        && this.internalStepsInProgress.includes(index + 1)) {
        element.classList.add(`step`, `in-progress`);
        element.setAttribute(`color`, `${this.progressColor}`);
      } else if (index <= this.value - 1) {
        element.setAttribute(`color`, `${this.color}`);
        element.classList.add(`step`, `complete`);
      } else {
        element.setAttribute(`color`, `graphite03`);
        element.classList.add(`step`, `untouched`);
      }
    });
  }
}

export default IdsStepChart;
