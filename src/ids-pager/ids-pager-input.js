import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix
} from '../ids-base';
import { IdsInput } from '../ids-input/ids-input';
import { IdsText } from '../ids-text/ids-text';
import { IdsEventsMixin, IdsKeyboardMixin } from '../ids-mixins';
import IdsPagerSection from './ids-pager-section';
import styles from './ids-pager-input.scss';
import { stringToBool } from '../ids-base/ids-string-utils';

/**
 * IDS PagerInput Component
 *
 * @type {IdsPagerInput}
 * @inherits IdsElement
 * @part container ids-pager-button container
 */
@customElement('ids-pager-input')
@scss(styles)
export default class IdsPagerInput extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin
  ) {
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

    this.onEvent('change', this.input, (e) => {
      this.onRegisterInputValue(e.target.input.value);
    });

    // when leaving user focus, input should adjust itself
    // to the page number provided by the pager

    this.onEvent('blur', this.input, () => {
      if (this.input.value !== `${this.pageNumber}`) {
        this.input.value = this.pageNumber;
      }
    });

    this.listen('Enter', this.input, (e) => {
      this.onRegisterInputValue(e.target.input.value);
    });

    if (!this.hasAttribute(attributes.PAGE_NUMBER)) {
      this.setAttribute(attributes.PAGE_NUMBER, 1);
    }

    // give parent a chance to reflect properties

    window.requestAnimationFrame(() => {
      this.#updatePageCountShown();
    });

    super.connectedCallback?.();
  }

  /**
   * @param {string|number} value number of items shown per-page
   */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to page-size');
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(attributes.PAGE_SIZE, nextValue);
  }

  /**
   * @returns {string|number} number of items shown per-page
   */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /**
   * @param {string|number} value 1-based page number shown
   */
  set pageNumber(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 1;
      console.error('ids-pager: non-valid-numeric value sent to pageNumber');
    } else if (Number.parseInt(value) <= 1) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(nextValue) !== parseInt(this.input?.input.value)) {
      this.input.value = nextValue;

      this.setAttribute(attributes.PAGE_NUMBER, nextValue);

      this.#updatePageCountShown();
    }
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /**
   * @param {string|number} value number of items to track
   */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to total');
      nextValue = 1;
    } else if (Number.parseInt(value) <= 0) {
      console.error('ids-pager: total cannot be <= 0');
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(attributes.TOTAL, nextValue);
    this.#updatePageCountShown();
  }

  /**
   * @returns {number|null} the calculated pageCount using total and pageSize
   */
  get pageCount() {
    return this.total !== null
      ? Math.floor(parseInt(this.total) / parseInt(this.pageSize))
      : null;
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get total() {
    return this.getAttribute(attributes.TOTAL);
  }

  /**
   * @param {boolean|string} value whether to disable input at app-specified-level
   */
  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.DISABLED, '');
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.#updateDisabledState();
  }

  /**
   * @returns {string|boolean} flag indicating whether button is disabled
   * for nav reasons
   */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  /**
   * @param {string|boolean} value flag indicating if button is disabled
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
   * @returns {string|boolean} flag indicating whether button is disabled
   * via parent pager's disabled attribute
   */
  get parentDisabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  get disabledOverall() {
    return (this.hasAttribute(attributes.DISABLED)
      || this.hasAttribute(attributes.PARENT_DISABLED)
    );
  }

  /**
   * callback to run when input value changes
   * @param {*} value input value being registered
   */
  onRegisterInputValue(value) {
    const inputPageNumber = parseInt(value);

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
  }

  /**
   * updates text found in page-count within ids-text span
   */
  #updatePageCountShown() {
    const pageCountShown = (this.pageCount === null) ? 'N/A' : this.pageCount;
    this.shadowRoot.querySelector('span.page-count').textContent = pageCountShown;
  }

  /**
   * update visible button disabled state
   * based on parentDisabled and disabled attribs
   */
  #updateDisabledState() {
    if (this.disabledOverall) {
      this.input.setAttribute(attributes.DISABLED, '');
    } else {
      this.input.removeAttribute(attributes.DISABLED);
    }
  }
}
