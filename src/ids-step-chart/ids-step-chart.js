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
      attributes.STEPS_IN_PROGRESS,
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

  get stepCount() { return parseInt(this.getAttribute(attributes.STEP_NUMBER)); }

  get stepsInProgress() {
    const inProgressSteps = this.getAttribute(attributes.STEPS_IN_PROGRESS);
    let inProgressStepArray = [];
    /* istanbul ignore else */
    if (inProgressSteps) {
      inProgressStepArray = inProgressSteps.split(',').map(Number);
    }
    return inProgressStepArray;
  }

  set stepsInProgress(value) {
    this.setAttribute('steps-in-progress', value);
    this.updateColor();
  }

  get value() { return parseInt(this.getAttribute(attributes.VALUE)); }

  set value(value) {
    this.setAttribute('value', value);
    this.updateColor();
  }

  updateColor() {
    this.container.querySelectorAll(`.step`).forEach((element, index) => {
      element.classes = `step`;

      if (this.stepsInProgress.length > 0
        && this.progressColor
        && this.stepsInProgress.includes(index + 1)) {
        element.classList.add(`in-progress`);
        element.setAttribute(`color`, `${this.progressColor}`);
      } else if (index <= this.value - 1) {
        element.setAttribute(`color`, `${this.color}`);
        element.classList.add(`complete`);
      } else {
        element.setAttribute(`color`, `graphite03`);
        element.classList.add(`untouched`);
      }
    });
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

    for (let i = 1; i <= this.stepCount; i++) {
      let classes = 'step';
      let color = ``;

      if (this.stepsInProgress.length > 0
        && this.progressColor
        && this.stepsInProgress.includes(i)) {
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
}

export default IdsStepChart;
