import {
  IdsElement,
  customElement,
  props,
  scss
} from '../ids-base';
import { IdsInput } from '../ids-input/ids-input';
import { IdsText } from '../ids-text/ids-text';
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
export default class IdsPagerInput extends IdsElement {
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
    super.connectedCallback?.();

    if (!this.hasAttribute(props.PAGE_NUMBER)) {
      this.setAttribute(props.PAGE_NUMBER, 0);
    }

    this.input = this.shadowRoot.querySelector('ids-input');
    this.#updatePageCountShown();
  }

  static get properties() {
    return [props.PAGE_NUMBER, props.TOTAL, props.PAGE_SIZE];
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
    return this.getAttribute(props.PAGE_SIZE);
  }

  /**
   * @param {string|number} value 1-based page number shown
   */
  set pageNumber(value) {
    let nextValue;

    if (Number.isNaN(Number.parseInt(value))) {
      nextValue = 0;
      console.error('ids-pager: non-numeric value sent to pageNumber');
    } else if (Number.parseInt(value) <= 0) {
      nextValue = 0;
    } else {
      nextValue = Number.parseInt(value);
    }

    if (parseInt(nextValue) !== parseInt(this.input?.value)) {
      this.setAttribute(props.PAGE_NUMBER, nextValue);
      if (this.input) { this.input.value = nextValue; }

      this.#updatePageCountShown();
    }
  }

  /**
   * @returns {string|number} value 1-based page number displayed
   */
  get pageNumber() {
    return this.getAttribute(props.PAGE_NUMBER);
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
    console.log('this.total ->', this.total);
    console.log('this.pageSize ->', this.pageSize);
    return this.total !== null
      ? Math.floor(parseInt(this.total) / parseInt(this.pageSize))
      : null;
  }

  #updatePageCountShown() {
    const pageCountShown = (this.pageCount === null) ? 'N/A' : this.pageCount;
    this.shadowRoot.querySelector('span.page-count').textContent = pageCountShown;
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
}
