import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, buildClassAttrib } from '../../utils/ids-string-utils/ids-string-utils';
import { getPercentageTextHtml, getInnerIndicatorHtml } from './ids-loading-indicator-attributes';
import Base from './ids-loading-indicator-base';
import styles from './ids-loading-indicator.scss';

/**
 * IDS Loading Indicator Component
 * @type {IdsLoadingIndicator}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the loader svg container element
 * @part progress - the percentage complete or active part of indeterminate section
 * @part overall - the "overall" area, which includes percentage and what 100% would cover on
 * indeterminate
 * @part percentage-text - the percentage text shown (when flag is set)
 */
@customElement('ids-loading-indicator')
@scss(styles)
export default class IdsLoadingIndicator extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.LINEAR,
      attributes.MODE,
      attributes.PERCENTAGE_VISIBLE,
      attributes.PROGRESS,
      attributes.STICKY,
      attributes.TYPE,
      attributes.VERSION
    ];
  }

  /**
   * Return the Template for the contents
   * @returns {string} The template
   */
  template() {
    let type = 'circular';

    if (this.hasAttribute(attributes.STICKY)) {
      type = 'sticky';
    }

    if (this.hasAttribute(attributes.LINEAR)) {
      type = 'linear';
    }

    return getInnerIndicatorHtml({
      progress: this.progress,
      percentageVisible: this.percentageVisible,
      inline: this.inline,
      type
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
  set inline(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.INLINE)) {
      this.setAttribute(attributes.INLINE, '');
    }

    if (!isTruthy && this.hasAttribute(attributes.INLINE)) {
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
  set progress(value) {
    const hasValue = !Number.isNaN(Number.parseFloat(value));
    if (hasValue) {
      this.setAttribute(attributes.PROGRESS, parseFloat(value));
      this.shadowRoot.querySelector('svg')?.style?.setProperty?.('--progress', value);
    } else {
      this.removeAttribute(attributes.PROGRESS);
      this.shadowRoot.querySelector('svg')?.style?.removeProperty?.('--progress');
    }

    this.updatePercentageVisible();
  }

  /**
   * @param {boolean|string} value Flags the indicator as being an sticky indicator
   * type; causes the indicator to stick to the top of the innermost IdsElement parent
   * and span it horizontally. If set, will unflag this indicator with any other
   * flag types set.
   */
  set sticky(value) {
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
   * @param {boolean} value Whether the percentage text should be visible
   * (not applicable to `sticky` loading indicators).
   */
  set percentageVisible(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.PERCENTAGE_VISIBLE)) {
      this.setAttribute(attributes.PERCENTAGE_VISIBLE, '');
    } else if (!isTruthy && this.hasAttribute(attributes.PERCENTAGE_VISIBLE)) {
      this.removeAttribute(attributes.PERCENTAGE_VISIBLE);
    }

    this.updatePercentageVisible();
  }

  /**
   * @returns {boolean} Whether the percentage text should be visible
   * (not applicable to `sticky` loading indicators).
   */
  get percentageVisible() {
    return this.hasAttribute(attributes.PERCENTAGE_VISIBLE);
  }

  updatePercentageVisible() {
    const percentageEl = this.shadowRoot.querySelector('[part="percentage-text"]');

    if (percentageEl) {
      percentageEl.remove();
    }

    if (this.percentageVisible && (this.type !== 'sticky')) {
      const template = document.createElement('template');
      template.innerHTML = getPercentageTextHtml({ type: this.type, progress: this.progress });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  /**
   * @param {boolean} value Flags the indicator as a linear indicator type;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  set linear(value) {
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
   * @returns {'circular'|'linear'|'sticky'} type The type of loading indicator
   */
  get type() {
    return this.#type || 'circular';
  }

  /**
   * type-flag set based on attributes
   * @type {'circular'|'linear'|'sticky'}
   */
  #type;

  /**
   * updates type based on attribute setter passed
   * @param {*} attribute attribute of flag set
   * @param {*} value value of attribute passed to flag
   */
  #onUpdateTypeFlag(attribute, value) {
    const isTruthy = stringToBool(value);

    if (isTruthy) {
      if (this.#type !== attribute) {
        if (this.#type && this.hasAttribute(this.#type)) {
          this.removeAttribute(this.#type);
        }

        this.#type = attribute;
        this.render();
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
      }
    }
  }
}
