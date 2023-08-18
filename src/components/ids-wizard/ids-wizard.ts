import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import '../ids-text/ids-text';
import './ids-wizard-step';
import styles from './ids-wizard.scss';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Wizard Component
 * @type {IdsWizard}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part wizard - the overall wizard container
 * @part step - a step on the wizard
 * @part path-segment - the line between a step and another
 */
@customElement('ids-wizard')
@scss(styles)
export default class IdsWizard extends Base {
  private markerTemplate = `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" />
    </svg>
  `;

  constructor() {
    super();
  }

  /**
   * whether to update callbacks after
   * a render() event
   */
  shouldUpdateCallbacks = true;

  stepObserver = new MutationObserver((mutations) => {
    for (const { type } of mutations) {
      if (type === 'childList') {
        this.shouldUpdateCallbacks = true;
        this.render(true);
      }
    }
  });

  resizeObserver = new ResizeObserver(() => {
    this.fitAndSizeElements();
  });

  /**
   * fits and resizes all labels to fit
   * within the space available
   */
  fitAndSizeElements() {
    const labelEls: any[] = [];

    for (let i = 0; i < this.children.length; i++) {
      const labelEl = this.getStepEl(this, i + 1)?.children[1] as HTMLElement;

      if (labelEl) {
        labelEl.style.maxWidth = 'unset';
        labelEls.push(labelEl);
      }
    }

    requestAnimationFrame(() => {
      const stepRects = this.resizeStepLabelRects(this);
      for (let i = 0; i < stepRects.length; i++) {
        const { width } = stepRects[i];

        labelEls[i].style.maxWidth = `${width + 8}px`;
      }
    });
  }

  /**
   * Checks whether bounding box/rects retrieved
   * from elem's bounding box are colliding horizontally
   * @param {DOMRect} r1 elem1's bounding box
   * @param {DOMRect} r2 elem2's bounding box
   * @returns {boolean} whether there is collision on x-axis
   */
  areRectsHColliding(r1: DOMRect, r2: DOMRect): boolean {
    return (
      ((r1.left + r1.width) > r2.left)
      && ((r1.right - r1.width) < r2.right)
    );
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [attributes.STEP_NUMBER, attributes.CLICKABLE];
  }

  /**
   * whether or not a step is clickable
   * @private
   * @param {number} stepNumber the step number to check
   * @returns {boolean} whether or not the step is clickable
   */
  isStepClickable(stepNumber: number): boolean {
    const stepEl = this.children[stepNumber - 1];

    return (
      (!this.clickable && (stepEl.getAttribute(attributes.CLICKABLE) !== 'false'))
      || stepEl.getAttribute(attributes.CLICKABLE) !== 'false'
    );
  }

  /**
   * Select step and update UI
   */
  #selectStep() {
    const stepIndex = Math.max(0, Number(this.stepNumber) - 1);
    const stepElems = [...this.container!.querySelectorAll('.step')];

    for (let i = 0; i < stepElems.length; i++) {
      const step = stepElems[i];
      const isCurrentStep = stepIndex === i;
      const isVisitedStep = i <= stepIndex;
      const markerElem = step.querySelector('.step-marker');
      const labelElem = step.querySelector('.step-label');
      let markerTemplate = this.markerTemplate;
      markerTemplate += isCurrentStep ? this.markerTemplate : '';

      // if step is current selected
      if (isCurrentStep) {
        step.classList.add('current');
        labelElem?.querySelector('ids-text')?.setAttribute(attributes.FONT_WEIGHT, 'bold');
      } else {
        step.classList.remove('current');
        labelElem?.querySelector('ids-text')?.setAttribute(attributes.FONT_WEIGHT, 'normal');
      }

      // if step is visited
      if (isVisitedStep) {
        step.classList.add('visited');
        step.previousElementSibling?.classList.add('visited');
      } else {
        step.classList.remove('visited');
        step.previousElementSibling?.classList.remove('visited');
      }

      // update marker markup
      if (markerElem) {
        markerElem.innerHTML = markerTemplate;
      }
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} the template to render
   */
  template(): string {
    let stepsHtml = '';

    // iterate through ids-wizard-step
    // lightDOM to create shadowDOM markup

    const stepIndex = <number> this.stepNumber - 1;

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
        class="path-segment${stepIndex <= i ? '' : ' visited'}"
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

      stepsHtml += (
        `<a
        class="${stepClassName}"
        part="step"
        step-number="${i + 1}"
        tabindex="${isClickable ? '0' : '-1'}"'
      >
        <div class="step-marker">
          ${this.markerTemplate}
          ${!isCurrentStep ? '' : this.markerTemplate}
        </div>
        ${stepLabelHtml}
      </a>
      ${pathSegmentHtml}`
      );
    }

    return (
      `<div class="ids-wizard">
      <nav class="steps">
        ${stepsHtml}
      </nav>
    </div>`
    );
  }

  /**
   * Get the step number
   * @returns {number|string} step number (1-based)
   */
  get stepNumber(): number | string {
    const stepNumber = parseInt(this.getAttribute(attributes.STEP_NUMBER) ?? '');

    if (Number.isNaN(stepNumber)) {
      return -1;
    }

    return stepNumber;
  }

  /**
   * Set the step number
   * @param {number|string} value step number (1-based)
   */
  set stepNumber(value: number | string) {
    if (Number.isNaN(Number(value))) {
      throw new Error('ids-wizard: Invalid step number provided');
    }

    const v = parseInt(<string>value);
    if (v <= 0) {
      throw new Error('ids-wizard: step number should be > 0');
    } else if (v > this.children?.length) {
      throw new Error('ids-wizard: step number should be below step-count');
    }

    this.setAttribute('step-number', v.toString());
  }

  set clickable(value) {
    this.setAttribute(attributes.CLICKABLE, String(value !== 'false'));
  }

  get clickable() {
    return this.getAttribute(attributes.CLICKABLE);
  }

  connectedCallback() {
    super.connectedCallback();
    this.stepObserver.disconnect();
    this.#attachEventHandlers();

    // set up observer for monitoring if a child element changed
    this.stepObserver.observe(<any> this, {
      childList: true,
      attributes: true,
      subtree: true
    });
    this.rendered();
  }

  #onStepClick(stepElem: HTMLElement | null | undefined) {
    if (!stepElem) return;

    const stepNumber = Number(stepElem?.getAttribute('step-number') ?? NaN);

    if (!Number.isNaN(stepNumber) && this.isStepClickable(stepNumber)) {
      this.stepNumber = stepNumber;
      this.#selectStep();
    }
  }

  #attachEventHandlers() {
    this.offEvent('click.step', this.container);
    this.onEvent('click.step', this.container, (evt: MouseEvent) => {
      const stepElem = (evt.target as HTMLElement).closest<HTMLElement>('.step');
      this.#onStepClick(stepElem);
    });

    this.unlisten('Enter');
    this.listen('Enter', this.container, () => {
      const focusedElem = this.shadowRoot?.activeElement;
      const stepElem = focusedElem?.closest<HTMLElement>('.step');
      this.#onStepClick(stepElem);
    });
  }

  /**
   * Binds associated callbacks
   * old handlers when template refreshes
   */
  rendered() {
    if (!this.shouldUpdateCallbacks) {
      return;
    }

    // stop observing changes before updating DOM
    this.resizeObserver.disconnect();

    // set up observer for resize which prevents overlapping labels
    if (this.container) this.resizeObserver.observe(this.container);

    this.shouldUpdateCallbacks = false;
  }

  /**
   * retrieves a step marker element within
   * a wizard's shadow DOM
   * @param {*} wizardEl source Wizard
   * @param {*} stepNumber step number
   * @returns {HTMLElement} the step element
   */
  getStepEl(wizardEl: IdsWizard, stepNumber: number): IdsWizard | undefined | null {
    return wizardEl?.shadowRoot?.querySelector(`.step[step-number="${stepNumber}"]`);
  }

  /**
   * Recursively resize steps for an element so they don't collide;
   * (only pass the wizard element to args)
   * @param {Array} args the arguments; should be IdsWizard element as only
   * user-defined element
   * @returns {Array<DOMRect>} array of rects for step positioning/sizing
   */
  resizeStepLabelRects(...args: any): Array<DOMRect> {
    const w = args[0];
    const n = args[1] || 1;
    let rects = args[2] || [];
    let totalWidth = args[3] || -1;

    // if this is the initial run, populate the
    // rects array and grab total width
    if (totalWidth === -1) {
      const wizardRect = w.getBoundingClientRect();
      totalWidth = wizardRect.width;

      for (let i = 0; i < w.children.length; i++) {
        const [, labelEl] = this.getStepEl(w, i + 1)?.children ?? [];

        const labelRect = labelEl.getBoundingClientRect();
        const offsetRect = {
          width: labelRect.width,
          left: labelRect.left,
          right: labelRect.right
        };

        rects.push(offsetRect);
      }
    }

    if (rects.length <= 1) {
      return rects;
    }

    const r1 = rects[n - 1];
    const r2 = rects[n];

    while (this.areRectsHColliding(r1, r2)) {
      const isR1LeftAligned = n === 1;
      const isR2RightAligned = n === rects.length - 1;

      let r1Mult = Math.round((r1.width / r2.width) * 0.5);
      let r2Mult = Math.round((r2.width / r1.width) * 0.5);

      if (r1.width <= 16) { r1Mult = 0.01; }
      if (r2.width <= 16) { r2Mult = 0.01; }

      if (isR1LeftAligned) {
        r1Mult *= 0.5;
      }

      if (isR2RightAligned) {
        r2Mult *= 0.5;
      }

      // gradually subtract width

      r1.width -= 8 * r1Mult;
      r2.width -= 8 * r2Mult;

      if (isR1LeftAligned) {
        r1.right -= 8 * r1Mult;
        r2.right -= 4 * r2Mult;
        r2.left += 4 * r2Mult;
      }

      if (isR2RightAligned) {
        r2.left += 8 * r2Mult;
        r1.right -= 4 * r1Mult;
        r1.left += 4 * r1Mult;
      }

      if (!isR1LeftAligned) {
        r1.left += 4 * r1Mult;
        r1.right -= 4 * r1Mult;
      }

      if (!isR2RightAligned) {
        r2.left += 4 * r2Mult;
        r2.right -= 4 * r2Mult;
      }
    }

    // update rect refs after morphing them above
    rects[n - 1] = r1;
    rects[n] = r2;

    // recursive case
    if (n < rects.length - 1 && totalWidth) {
      rects = this.resizeStepLabelRects(w, n + 1, rects, totalWidth);
    }

    // pass back rect changes
    return rects;
  }
}
