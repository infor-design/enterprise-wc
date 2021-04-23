import {
  IdsElement, customElement,
  props, scss, mix
} from '../ids-base/ids-element';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
// @ts-ignore
import IdsText from '../ids-text/ids-text';
// @ts-ignore
import styles from './ids-wizard.scss';

/**
 * maps objects to href sets;
 * this lets us know that we shouldn't re-use
 * a link with a similar label when constructing them
 */
const hrefsAssignedSet = new Set();

/**
 * IDS Wizard Component
 * @type {IdsWizard}
 * @inherits IdsElement
 * @part wizard - the overall wizard container
 * @part step - a step on the wizard
 * @part path-segment - the line between a step and another
 */
@customElement('ids-wizard')
@scss(styles)
class IdsWizard extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
    this.updateHrefUrls();
  }

  shouldUpdateCallbacks = true;

  /**
   * stored to prevent re-calling encodeUri(label)
   */
  hrefUrls = [];

  stepObserver = new MutationObserver((mutations) => {
    for (const { type } of mutations) {
      // @ts-ignore
      if (type === 'childList') {
        this.shouldUpdateCallbacks = true;
        this.updateHrefUrls();
        this.render();
      }
    }
  });

  resizeObserver = new ResizeObserver((entries) => {
    const [entry] = entries;
    const { width } = Array.isArray(entry.contentRect)
      ? [entry.contentRect]
      : entry.contentRect;
  });

  /**
   * fits and resizes all labels to fit
   * within the space available
   */
  fitAndSizeElements() {
    // Approach: check that each label is not overlapping
    // each other. If they are, then recursively resize
    // them to be width - 8px; they will self-align via
    // CSS in between reflows

    }
  };

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.STEP_NUMBER, props.CLICKABLE];
  }

  /**
   * whether or not a step is clickable
   * @private
   * @param {number} stepNumber the step number to check
   * @returns {boolean} whether or not the step is clickable
   */
  isStepClickable(stepNumber) {
    const stepEl = this.children[stepNumber - 1];

    return (
      (this.stepNumber !== stepNumber)
      && (
        (!this.clickable && (stepEl.getAttribute(props.CLICKABLE) !== 'false'))
        || stepEl.getAttribute(props.CLICKABLE) !== 'false'
      )
    );
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template() {
    let stepsHtml = '';

    // iterate through ids-wizard-step
    // lightDOM to create shadowDOM markup

    // @ts-ignore
    const stepIndex = this.stepNumber - 1;

    for (const [i, stepEl] of [...this.children].entries()) {
      const isCurrentStep = stepIndex === i;
      const isVisitedStep = i <= stepIndex;

      const isClickable = this.isStepClickable(i + 1);
      const label = stepEl.textContent;

      let stepClassName = 'step';
      stepClassName += isCurrentStep ? ' current' : '';
      stepClassName += isVisitedStep ? ' visited' : '';
      stepClassName += isClickable ? ' clickable' : '';

      const pathSegmentHtml = (i >= this.children.length - 1) ? '' : (
        `<div
          class="path-segment${stepIndex <= i ? '' : ' visited'}
          part="path-segment"
        ></div>`
      );

      const stepLabelHtml = (
        `<div
          class="step-label"
          step-number=${i + 1}
        >
          <ids-text
            overflow="ellipsis"
            size=18
            font-weight="${isCurrentStep ? 'bold' : 'normal'}"
            color="unset"
          >${label}
          </ids-text>
        </div>`
      );

      const hrefUrl = this.hrefUrls?.[i];
      let anchorAttribsHtml = `name="#${label}" aria-label="${label}"`;
      anchorAttribsHtml += !isClickable ? '' : ` href="#${hrefUrl}"`;

      stepsHtml += (
        `<a
          class="${stepClassName}"
          part="step"
          step-number="${i + 1}"
          tab-index="0"
          ${anchorAttribsHtml}
        >
          <div
            class="step-marker"
            tab-index="-1"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" />
            </svg>
            ${ !isCurrentStep ? '' : (
              `<svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" />
              </svg>`) }
          </div>
          ${stepLabelHtml}
        </a>
        ${pathSegmentHtml}`
      );
    }

    return (
      `<div class="ids-wizard" step-count="${this.children.length}">
        <div class="steps">
          ${stepsHtml}
        </div>
      </div>`
    );
  }

  /**
   * Get the step number
   * @returns {number|string} step number (1-based)
   */
  get stepNumber() {
    // @ts-ignore
    const stepNumber = parseInt(this.getAttribute(props.STEP_NUMBER));

    if (Number.isNaN(stepNumber)) {
      return -1;
    }

    return stepNumber;
  }

  /**
   * Set the step number
   * @param {number|string} value step number (1-based)
   */
  set stepNumber(value) {
    if (Number.isNaN(Number(value))) {
      throw new Error('ids-wizard: Invalid step number provided');
    }

    // @ts-ignore
    const v = parseInt(value);
    if (v <= 0) {
      throw new Error('ids-wizard: step number should be > 0');
    } else if (v > this.children.length) {
      throw new Error('ids-wizard: step number should be below step-count');
    }

    this.setAttribute('step-number', v);
  }

  set clickable(value) {
    this.setAttribute(props.CLICKABLE, value !== 'false');
  }

  get clickable() {
    return this.getAttribute(props.CLICKABLE);
  }

  /**
   * Handle Setting changes of observed properties
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue !== newValue) {
      switch (name) {
      case 'clickable':
      case 'step-number': {
        this.shouldUpdateCallbacks = true;
        this.render();
        break;
      }
      /* istanbul ignore next */
      default: break;
      }
    }
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered = () => {
    /* istanbul ignore next */
    if (!this.shouldUpdateCallbacks) {
      return;
    }

    // stop observing changes before updating DOM
    this.stepObserver.disconnect();
    this.resizeObserver.disconnect();

    // query through all steps and add click callbacks
    for (let stepNumber = 1; stepNumber <= this.children.length; stepNumber++) {
      if (!this.isStepClickable(stepNumber)) {
        continue;
      }
      const stepEl = this.shadowRoot.querySelector(
        `.step[step-number="${stepNumber}"]`
      );

      const onClickStep = () => {
        this.stepNumber = `${stepNumber}`;
      };

      this.offEvent(`click.step.${stepNumber}`);
      this.onEvent(`click.step.${stepNumber}`, stepEl, onClickStep);
    }

    // set up observer for monitoring if a child element changed
    // @ts-ignore
    this.stepObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: true
    });

    this.resizeObserver.observe(this.container);

    this.shouldUpdateCallbacks = false;
  };

  /**
   * updates hrefUrls at select points
   * so we don't need to recalculate
   * when setting clickable or step number
   * again; also allows us to easily run
   * calculations to use unique-but-meaningful
   * links
   *
   * @private
   */
  updateHrefUrls() {
    this.hrefUrls = [...this.children].map((el, i) => {
      let urlHash = encodeURI(el.textContent);
      let collisionCount;

      // if an href was already used, and it isn't
      // used by this component's children,
      // then increase the number in href hash

      while (
        (this.hrefUrls?.[i] !== urlHash)
        && hrefsAssignedSet.has?.(urlHash)
      ) {
        collisionCount = collisionCount ? (collisionCount + 1) : 1;
        urlHash = `${encodeURI(el.textContent)}-${collisionCount}`;
      }

      hrefsAssignedSet.add(urlHash);

      return urlHash;
    });
  }
}

export default IdsWizard;
