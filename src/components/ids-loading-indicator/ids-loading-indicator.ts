import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getPercentageTextHtml, getInnerIndicatorHtml } from './ids-loading-indicator-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-loading-indicator.scss';
import IdsOverlay from '../ids-modal/ids-overlay';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS Loading Indicator Component
 * @type {IdsLoadingIndicator}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the loader svg container element
 * @part progress - the percentage complete or active part of indeterminate section
 * @part circle - the "circle" area, which includes percentage and what 100% would cover on
 * indeterminate
 * @part percentage-text - the percentage text shown (when flag is set)
 */
@customElement('ids-loading-indicator')
@scss(styles)
export default class IdsLoadingIndicator extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#updateProgress();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.ALIGN,
      attributes.CONTAINED,
      attributes.GENERATIVE_AI,
      attributes.INLINE,
      attributes.LINEAR,
      attributes.OVERLAY,
      attributes.PERCENTAGE_VISIBLE,
      attributes.PROGRESS,
      attributes.STICKY,
      attributes.TYPE,
      attributes.VISIBLE
    ];
  }

  /**
   * Return the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    let type = 'circular';

    if (this.hasAttribute(attributes.STICKY)) {
      type = 'sticky';
    }

    if (this.hasAttribute(attributes.LINEAR)) {
      type = 'linear';
    }

    if (this.hasAttribute(attributes.GENERATIVE_AI)) {
      type = 'generative-ai';
    }

    if (this.hasAttribute(attributes.CONTAINED)) {
      type = 'contained';
    }

    return getInnerIndicatorHtml({
      progress: this.progress,
      percentageVisible: this.percentageVisible,
      inline: this.inline,
      type,
      slotted: this.classList.contains('slot-loading-indicator'),
    });
  }

  /**
   * @returns {boolean} value Flag indicating whether or not this component
   * will be nested as a sub-part of another component (e.g. input);
   * renders a smaller variant.
   */
  get inline() {
    return this.hasAttribute(attributes.INLINE);
  }

  /**
   * @param {boolean} value Flag indicating whether or not this component
   * will be nested as a sub-part of another component (e.g. input);
   * renders a smaller variant.
   */
  set inline(value: string | boolean) {
    const isTruthy = stringToBool(value);

    if (isTruthy) {
      this.setAttribute(attributes.INLINE, '');
    }

    if (!isTruthy) {
      this.removeAttribute(attributes.INLINE);
    }
  }

  /**
   * @returns {number|undefined} the percentage completed for the indicator;
   * if not specified, the indicator is set into indeterminate mode (e.g. no specific
   * progress with an animation)
   */
  get progress() {
    const value = this.getAttribute(attributes.PROGRESS);

    return value !== null ? parseInt(value) : undefined;
  }

  /**
   * @param {number|undefined} value Represents the percentage completed for the indicator;
   * if not specified, the indicator is set into indeterminate mode (e.g. no specific
   * progress with an animation)
   */
  set progress(value: any) {
    const hasValue = !Number.isNaN(Number.parseFloat(value));
    if (hasValue) {
      this.setAttribute(attributes.PROGRESS, String(parseFloat(value)));

      this.shadowRoot?.querySelector('svg')?.classList.remove('indeterminate');
      this.shadowRoot?.querySelector('svg')?.classList.add('determinate');
    } else {
      this.removeAttribute(attributes.PROGRESS);
    }

    this.#updateProgress();
  }

  /**
   * Update current animation progress
   * @private
   */
  #updateProgress() {
    if (this.progress !== undefined && !Number.isNaN(this.progress)) {
      this.shadowRoot?.querySelector('svg')?.style.setProperty('--progress', this.type === 'circular' ? `${this.progress}px` : this.progress);
    } else {
      this.shadowRoot?.querySelector('svg')?.style.removeProperty('--progress');
    }

    this.#updatePercentageVisible();
  }

  /**
   * @param {boolean|string} value Flags the indicator as being an sticky indicator
   * type; causes the indicator to stick to the top of the innermost IdsElement parent
   * and span it horizontally. If set, will unflag this indicator with any other
   * flag types set.
   */
  set sticky(value: boolean | string) {
    this.#onUpdateTypeFlag(attributes.STICKY, stringToBool(value));
  }

  /**
   * @returns {boolean|string} value Flags the indicator as being an sticky indicator
   * type; causes the indicator to stick to the top of the innermost IdsElement parent
   * and span it horizontally. If set, will unflag this indicator with any other
   * flag types set.
   */
  get sticky() {
    return this.hasAttribute(attributes.STICKY);
  }

  /**
   * Flags the indicator as being an contained indicator relative to nearest parent
   * @param {string | boolean} value true if the indicator should be contained
   */
  set contained(value: string | boolean) {
    this.#onUpdateTypeFlag(attributes.CONTAINED, stringToBool(value));
  }

  /**
   * @returns {boolean} Flags the indicator as being a
   * contained indicator relative to nearest parent
   */
  get contained() {
    return this.hasAttribute(attributes.CONTAINED);
  }

  /**
   * @param {boolean} value Whether the percentage text should be visible
   * (not applicable to `sticky` loading indicators).
   */
  set percentageVisible(value: boolean) {
    const isTruthy = stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.PERCENTAGE_VISIBLE)) {
      this.setAttribute(attributes.PERCENTAGE_VISIBLE, '');
    } else if (!isTruthy && this.hasAttribute(attributes.PERCENTAGE_VISIBLE)) {
      this.removeAttribute(attributes.PERCENTAGE_VISIBLE);
    }

    this.#updatePercentageVisible();
  }

  /**
   * @returns {boolean} Whether the percentage text should be visible
   * (not applicable to `sticky` loading indicators).
   */
  get percentageVisible() {
    return this.hasAttribute(attributes.PERCENTAGE_VISIBLE);
  }

  /**
   * Set the amount visible
   */
  #updatePercentageVisible(): void {
    const percentageEl = this.shadowRoot?.querySelector('[part="percentage-text"]');

    if (percentageEl) {
      percentageEl.remove();
    }

    if (this.percentageVisible && (this.type !== 'sticky')) {
      const template = document.createElement('template');
      template.innerHTML = getPercentageTextHtml({ type: this.type, progress: this.progress });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
  }

  /**
   * Get the current overlay setting
   * @returns {boolean} true if an overlay is used
   */
  get overlay(): boolean {
    return stringToBool(this.getAttribute(attributes.OVERLAY));
  }

  /**
   * Set the overlay state between visible and not visible
   * @param {boolean} val can be set to true to show the overlay
   */
  set overlay(val) {
    const booleanValue = stringToBool(val);
    if (booleanValue) this.setAttribute(attributes.OVERLAY, '');
    else this.removeAttribute(attributes.OVERLAY);
    this.#refreshOverlay(booleanValue);
  }

  /**
   * Set the overlay state between visible and not visible
   * @param {boolean} visible can be set to true to show the overlay
   */
  #refreshOverlay(visible: boolean) {
    const overlay = this.shadowRoot?.querySelector<IdsOverlay>('ids-overlay');
    if (visible) {
      overlay?.setAttribute('visible', 'true');
    } else {
      overlay?.removeAttribute('visible');
    }
  }

  /**
   * Stop and hide the loading indicator
   */
  stop(): void {
    this.setAttribute('stopped', '');
  }

  /**
   * Re start the loading indicator
   */
  start(): void {
    this.removeAttribute('stopped');
  }

  /**
   * @param {boolean} value Flags the indicator as a linear indicator type;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  set linear(value: string | boolean) {
    this.#onUpdateTypeFlag(attributes.LINEAR, stringToBool(value));
  }

  /**
   * @returns {boolean} value Flags the indicator as a linear indicator type;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  get linear() {
    return this.hasAttribute(attributes.LINEAR);
  }

  /**
   * Set the animation to Gen AI
   * @param {string} value can be center to center to center align the loader
   */
  set generativeAi(value: boolean) {
    const val = stringToBool(value);
    if (val) {
      this.shadowRoot?.querySelector('.ai-loading-indicator')?.remove();
      this.setAttribute(attributes.GENERATIVE_AI, '');
      this.render(true);
      if (this.shadowRoot?.querySelectorAll('.ai-loading-indicator')?.length === 2) this.shadowRoot?.querySelector('.ai-loading-indicator')?.remove();
    } else {
      this.shadowRoot?.querySelector('.ai-loading-indicator')?.remove();
      this.removeAttribute(attributes.GENERATIVE_AI);
      this.render(true);
    }
  }

  get generativeAi(): boolean {
    return stringToBool(this.getAttribute(attributes.GENERATIVE_AI));
  }

  /**
   * Set the alignment between normal and center
   * @param {string} value can be center to center to center align the loader
   */
  set align(value: string) {
    if (value === 'center') {
      this.setAttribute(attributes.ALIGN, 'center');
    } else {
      this.removeAttribute(attributes.ALIGN);
    }
  }

  get align() {
    return this.getAttribute(attributes.ALIGN) || 'normal';
  }

  /**
   * @returns {'circular'|'linear'|'sticky'} type The type of loading indicator
   */
  get type() {
    return this.#type || 'circular';
  }

  /**
   * type-flag set based on attributes
   * @type {'circular'|'linear'|'sticky'}
   */
  #type: string | undefined;

  /**
   * updates type based on attribute setter passed
   * @param {*} attribute attribute of flag set
   * @param {*} value value of attribute passed to flag
   */
  #onUpdateTypeFlag(attribute: string, value: boolean | string): void {
    const isTruthy = stringToBool(value);

    if (isTruthy) {
      if (this.#type !== attribute) {
        if (this.#type && this.hasAttribute(this.#type)) {
          this.removeAttribute(this.#type);
        }

        this.#type = attribute;
        if (!this.hasAttribute(attribute)) {
          this.setAttribute(attribute, '');
        }
        this.render(true);
      }

      if (!this.hasAttribute(attribute)) {
        this.setAttribute(attribute, '');
      }
    }

    if (!isTruthy) {
      if (this.hasAttribute(attribute)) {
        this.removeAttribute(attribute);
      }

      if (this.#type === attribute) {
        this.#type = undefined;
        this.render(true);
      }
    }
  }
}
