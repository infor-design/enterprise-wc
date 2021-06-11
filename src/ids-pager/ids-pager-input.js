import {
  IdsElement,
  customElement,
  props,
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

    return (
     `<ids-text font-size="16">Page</ids-text>&nbsp;
      <ids-input
        value="${parseInt(this.pageNumber)}"
        ${this.disabled ? 'disabled' : ''}
      ></ids-input>
      <ids-text font-size="16">&nbsp;of&nbsp;
        <span class="page-count">${pageCountShown}</span>
      </ids-text>`
    );
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('ids-input');

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

    if (!this.hasAttribute(props.PAGE_NUMBER)) {
      this.setAttribute(props.PAGE_NUMBER, 1);
    }

    // give parent a chance to reflect properties

    window.requestAnimationFrame(() => {
      this.#updatePageCountShown();
    });

    super.connectedCallback?.();
  }

  static get properties() {
    return [
      props.PAGE_NUMBER,
      props.TOTAL,
      props.PAGE_SIZE
    ];
  }

  /**
   * @param {string|number} value number of items shown per-page
   */
  set pageSize(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to page-size');
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.PAGE_SIZE, nextValue);
  }

  /**
   * @returns {string|number} number of items shown per-page
   */
  get pageSize() {
    return parseInt(this.getAttribute(props.PAGE_SIZE));
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

      this.setAttribute(props.PAGE_NUMBER, nextValue);

      this.#updatePageCountShown();
    }
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return parseInt(this.getAttribute(props.PAGE_NUMBER));
  }

  /**
   * @param {string|number} value number of items to track
   */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value))) {
      console.error('ids-pager: non-numeric value sent to total');
      nextValue = 0;
    } else if (Number.parseInt(value) <= 0) {
      console.error('ids-pager: total cannot be <= 0');
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    this.setAttribute(props.TOTAL, nextValue);
    this.#updatePageCountShown();
  }

  get pageCount() {
    return this.total !== null
      ? Math.floor(parseInt(this.total) / parseInt(this.pageSize))
      : null;
  }

  /**
   * @returns {string|number} number of items for pager is tracking
   */
  get total() {
    return this.getAttribute(props.TOTAL);
  }

  set disabled(value) {
    if (stringToBool(value)) {
      this.setAttribute(props.DISABLED, '');
      this.input.setAttribute(props.DISABLED, '');
    } else {
      this.removeAttribute(props.DISABLED);
      this.input.removeAttribute(props.DISABLED);
    }
  }

  get disabled() {
    return stringToBool(this.getAttribute(props.DISABLED));
  }

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

  #updatePageCountShown() {
    const pageCountShown = (this.pageCount === null) ? 'N/A' : this.pageCount;
    this.shadowRoot.querySelector('span.page-count').textContent = pageCountShown;
  }
}
