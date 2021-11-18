import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import Base from './ids-pager-base';
import IdsInput from '../ids-input/ids-input';
import IdsText from '../ids-text/ids-text';
import IdsPagerSection from './ids-pager-section';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-pager-input.scss';

/**
 * IDS PagerInput Component
 *
 * @type {IdsPagerInput}
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @inherits IdsElement
 * @part container ids-pager-button container
 */
@customElement('ids-pager-input')
@scss(styles)
export default class IdsPagerInput extends Base {
  constructor() {
    super();
  }

  template() {
    const pageCountShown = this.pageCount !== null ? this.pageCount : 'N/A';
    const idsTextAttribs = `label ${this.disabledOverall ? ' disabled' : ''}`;

    return (
     `<ids-text ${idsTextAttribs}>Page</ids-text>&nbsp;
      <ids-input
        value="${parseInt(this.pageNumber)}"
        text-align="center"
        ${this.disabled ? 'disabled' : ''}
      ></ids-input>
      <ids-text ${idsTextAttribs}>&nbsp;of&nbsp;
        <span class="page-count">${pageCountShown}</span>
      </ids-text>`
    );
  }

  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.PAGE_NUMBER,
      attributes.PARENT_DISABLED,
      attributes.TOTAL,
      attributes.PAGE_SIZE
    ];
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('ids-input');
    this.input.input.setAttribute('aria-label', 'Input for page number');

    this.onEvent('change', this.input, () => {
      const inputPageNumber = parseInt(this.input.input.value);

      if (inputPageNumber !== this.pageNumber) {
        if (!Number.isNaN(inputPageNumber)) {
          this.triggerEvent('pagenumberchange', this, {
            bubbles: true,
            detail: { elem: this, value: inputPageNumber }
          });
        } else {
          this.input.value = this.pageNumber;
        }
      }
    });

    // when leaving user focus, input should adjust itself
    // to the page number already provided by the pager

    this.onEvent('blur', this.input, () => {
      if (this.input.value !== `${this.pageNumber}`) {
        this.input.value = this.pageNumber;
      }
    });

    this.listen('Enter', this.input, () => {
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    if (!this.hasAttribute(attributes.PAGE_NUMBER)) {
      this.setAttribute(attributes.PAGE_NUMBER, 1);
    }

    // give parent a chance to reflect attributes

    window.requestAnimationFrame(() => {
      this.#updatePageCountShown();
    });

    super.connectedCallback?.();
  }

  /** @param {string|number} value The number of items to show per page */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(this.getAttribute(attributes.PAGE_SIZE)) !== nextValue) {
      this.setAttribute(attributes.PAGE_SIZE, nextValue);
    }

    this.#updatePageCountShown();
  }

  /** @returns {string|number} The number of items shown per page */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /** @param {string|number} value A 1-based page number shown */
  set pageNumber(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else if (Number.parseInt(value) <= 1) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(nextValue) !== parseInt(this.input?.input.value)) {
      if (this.input) {
        this.input.value = nextValue;
      }
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
      this.#updatePageCountShown();
    }
  }

  /** @returns {string|number} value A 1-based page number displayed */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /** @param {string|number} value The number of items to track */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
    } else if (Number.parseInt(value) <= 0) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(attributes.TOTAL, nextValue);
    this.#updatePageCountShown();
  }

  /** @returns {string|number} The number of items for pager is tracking */
  get total() {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount() {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.floor(this.total / this.pageSize)
      : null;
  }

  /** @param {boolean|string} value Whether or not to disable input at app-specified-level */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether the input is disabled
   * for nav reasons
   */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {string|boolean} value A flag indicating if the input is disabled
   * through parent pager's disabled attribute
   */
  set parentDisabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.PARENT_DISABLED, '');
    } else {
      this.removeAttribute(attributes.PARENT_DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} A flag indicating whether button is disabled
   * via parent pager's disabled attribute
   */
  get parentDisabled() {
    return this.hasAttribute(attributes.PARENT_DISABLED);
  }

  /**
   * @returns {string|boolean} Whether the functionality overall is disabled based on
   * a combination of other available disabled fields
   */
  get disabledOverall() {
    return (this.hasAttribute(attributes.DISABLED)
      || this.hasAttribute(attributes.PARENT_DISABLED)
    );
  }

  /** Updates text found in page-count within ids-text span */
  #updatePageCountShown() {
    const pageCountShown = (this.pageCount === null) ? 'N/A' : this.pageCount;
    this.shadowRoot.querySelector('span.page-count').textContent = pageCountShown;
  }

  /**
   * Update visible button disabled state
   * based on parentDisabled and disabled attribs
   */
  #updateDisabledState() {
    const idsTextEls = this.shadowRoot.querySelectorAll('ids-text');

    if (this.disabledOverall) {
      this.input.setAttribute(attributes.DISABLED, '');

      for (const el of idsTextEls) {
        el.setAttribute(attributes.DISABLED, '');
      }
    } else {
      this.input.removeAttribute(attributes.DISABLED);

      for (const el of idsTextEls) {
        el.removeAttribute(attributes.DISABLED);
      }
    }
  }
}
