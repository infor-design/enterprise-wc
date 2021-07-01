import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  stringUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-loading-indicator.scss';

const { stringToBool, buildClassAttrib } = stringUtils;

const getInnerIndicatorHtml = ({
  progress,
  type,
  percentageVisible,
  inline
}) => {
  const isDeterminate = !Number.isNaN(parseInt(progress));

  switch (type) {
  case attributes.STICKY:
  case attributes.LINEAR: {
    const overallYOffset = `y="${type === 'sticky' ? '0' : '12.5'}%"`;

    const classStr = buildClassAttrib(
      'linear-indicator',
      type === 'sticky' && 'sticky',
      `${!isDeterminate ? 'in' : ''}determinate`
    );

    return (
      `<svg xmlns="http://www.w3.org/2000/svg" ${classStr} part="container">
        <rect width="100%" height="75%" ${overallYOffset} class="overall" part="overall" />
        <rect width="100%" height="100%" class="progress" part="progress" />
      </svg>
      ${(percentageVisible && type !== 'sticky') ? (
        `<div class="progress-percentage ${type}" part="percentage-text">
          <ids-text font-size="14" font-weight="bold" color="unset" label>
            ${progress}<span class="percentage">%</span></ids-text>
        </div>`
      ) : ''
      }`
    );
  }
  // circular
  default: {
    const classStr = buildClassAttrib(
      'circular-indicator',
      `${!isDeterminate ? 'in' : ''}determinate`,
      inline && 'inline'
    );

    return (
      `<svg viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" ${classStr} part="container">
        <circle cx="50" cy="50" r="45" stroke-width="${inline ? 8 : 4}" class="overall" part="overall" />
        <circle cx="50" cy="50" r="45" stroke-width="${inline ? 18 : 7}" class="progress" part="progress" />
      </svg>
      ${percentageVisible ? (
        `<div class="progress-percentage" part="percentage-text">
          <ids-text font-size="14" font-weight="bold" color="unset" label>
            ${progress}
          </ids-text>
          <ids-text font-size="10" font-weight="bold" color="unset" label>
            <span class="percentage">%</span>
          </ids-text>
        </div>`
      ) : ''}`
    );
  }
  }
};

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
export default class IdsLoadingIndicator extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin
  ) {
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
      attributes.STICKY,
      attributes.LINEAR,
      attributes.MODE,
      attributes.PROGRESS,
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

    /* istanbul ignore else */
    if (isTruthy && !this.hasAttribute(attributes.PERCENTAGE_VISIBLE)) {
      this.setAttribute(attributes.PERCENTAGE_VISIBLE, '');
    } else if (!isTruthy && this.hasAttribute(attributes.PERCENTAGE_VISIBLE)) {
      this.removeAttribute(attributes.PERCENTAGE_VISIBLE);
    }
  }

  /**
   * @returns {boolean} Whether the percentage text should be visible
   * (not applicable to `sticky` loading indicators).
   */
  get percentageVisible() {
    return this.hasAttribute(attributes.PERCENTAGE_VISIBLE);
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
