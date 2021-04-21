import {
  IdsElement,
  customElement,
  scss,
  mix
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
 *
 * @part step-label the label element of a step
 * @part step-marker the marker element of a step
 * @part path-segment the line segment between markers
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

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['step-number', 'clickable'];
  }

  /**
   * whether or not a step is clickable
   * @param {number} stepNumber the step number to check
   * @returns {boolean} whether or not the step is clickable
   */
  isStepClickable(stepNumber) {
    const stepEl = this.children[stepNumber - 1];

    return (
      (this.stepNumber !== stepNumber)
      && (
        (!this.clickable && (stepEl.getAttribute('clickable') !== 'false'))
        || stepEl.getAttribute('clickable') !== 'false'
      )
    );
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    let stepsBarInnerHtml = '';
    let stepLabelsInnerHtml = '';

    // iterate through ids-wizard-step
    // lightDOM to create shadowDOM markup

    // @ts-ignore
    const stepIndex = this.stepNumber - 1;

    for (const [i, stepEl] of [...this.children].entries()) {
      const isCurrentStep = stepIndex === i;
      const isVisitedStep = i <= stepIndex;

      const isClickable = this.isStepClickable(i + 1);
      const label = stepEl.textContent;

      // --------------------- //
      // construct bar steps   //
      // ===================== //

      let markerClassName = 'step-marker';
      markerClassName += isCurrentStep ? ' current' : '';
      markerClassName += isVisitedStep ? ' visited' : '';
      markerClassName += isClickable ? ' clickable' : '';

      const pathSegmentHtml = (i >= this.children.length - 1) ? '' : (
        `<div
          class="path-segment${stepIndex <= i ? '' : ' visited'}
          part="path-segment""
        ></div>`
      );

      const hrefUrl = this.hrefUrls?.[i];
      let anchorAttribsHtml = `name="#${label}" aria-label="${label}"`;
      anchorAttribsHtml += !isClickable ? '' : ` href="#${hrefUrl}"`;

      stepsBarInnerHtml += (
        `<a
          class="${markerClassName}"
          step-number="${i + 1}"
          part="step-marker"
          ${anchorAttribsHtml}
        >
          <div class="step-marker-node">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" />
            </svg>
            ${ !isCurrentStep ? '' : (
              `<svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" />
              </svg>`) }
          </div>
        </a>
        ${pathSegmentHtml}`
      );

      // --------------------- //
      // construct labels      //
      // ===================== //

      // @ts-ignore

      let labelClassName = 'step-label';
      labelClassName += isVisitedStep ? ' visited' : '';
      labelClassName += isClickable ? ' clickable' : '';

      stepLabelsInnerHtml += (
        `<a
          class="${labelClassName}"
          step-number=${i + 1}
          part="step-label"
          ${anchorAttribsHtml}>
          <ids-text
            overflow="ellipsis"
            size=18
            font-weight="${isCurrentStep ? 'bold' : 'normal'}"
            color="unset"
          >${label}
          </ids-text>
        </a>`
      );
    }

    return (
      `<div class="ids-wizard" step-count="${this.children.length}">
        <div class="marker-bar">
          ${stepsBarInnerHtml}
        </div>
        <div class="step-labels">
          ${stepLabelsInnerHtml}
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
    const stepNumber = parseInt(this.getAttribute('step-number'));

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
    const isValueTruthy = value !== 'false';
    this.setAttribute('clickable', isValueTruthy);
  }

  get clickable() {
    return this.getAttribute('clickable');
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

  rendered = () => {
    /* istanbul ignore next */
    if (!this.shouldUpdateCallbacks) {
      return;
    }

    // stop observing changes before updating DOM
    this.stepObserver.disconnect();

    // query through all steps and add click callbacks
    for (let stepNumber = 1; stepNumber <= this.children.length; stepNumber++) {
      if (!this.isStepClickable(stepNumber)) {
        continue;
      }
      const stepMarker = this.shadowRoot.querySelector(
        `.step-marker[step-number="${stepNumber}"]`
      );
      const stepLabel = this.shadowRoot.querySelector(
        `.step-label[step-number="${stepNumber}"]`
      );

      const onClickStep = () => {
        this.stepNumber = `${stepNumber}`;
      };

      this.offEvent(`click.step-marker.${stepNumber}`);
      this.offEvent(`click.step-label.${stepNumber}`);
      this.onEvent(`click.step-marker.${stepNumber}`, stepMarker, onClickStep);
      this.onEvent(`click.step-label.${stepNumber}`, stepLabel, onClickStep);
    }

    // set up observer for monitoring if a child element changed
    // @ts-ignore
    this.stepObserver.observe(this, {
      childList: true,
      attributes: true,
      subtree: true
    });

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
