import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

// Import Utils
import Base from './ids-pager-base';

import IdsPagerButton from './ids-pager-button';
import IdsPagerInput from './ids-pager-input';
import IdsPagerNumberList from './ids-pager-number-list';

import styles from './ids-pager.scss';

// { attribute: DISABLED, component: IdsPagerInput, targetAttribute: PARENT_DISABLED },
// { attribute: DISABLED, component: IdsPagerButton, targetAttribute: PARENT_DISABLED },
// { attribute: DISABLED, component: IdsPagerInput, targetAttribute: PARENT_DISABLED },
// { attribute: DISABLED, component: IdsPagerNumberList, targetAttribute: PARENT_DISABLED },
// { attribute: PAGE_NUMBER, component: IdsPagerInput },
// { attribute: PAGE_NUMBER, component: IdsPagerNumberList },
// { attribute: PAGE_NUMBER, component: IdsPagerButton },
// { attribute: PAGE_SIZE, component: IdsPagerNumberList },
// { attribute: PAGE_SIZE, component: IdsPagerButton },
// { attribute: PAGE_SIZE, component: IdsPagerInput },
// { attribute: TOTAL, component: IdsPagerInput },
// { attribute: TOTAL, component: IdsPagerNumberList },
// { attribute: TOTAL, component: IdsPagerButton }

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container the overall ids-pager container
 */
@customElement('ids-pager')
@scss(styles)
export default class IdsPager extends Base {
  constructor() {
    super();
  }

  get elements() {
    return {
      buttons: {
        first: this.querySelector('ids-pager-button[first]'),
        previous: this.querySelector('ids-pager-button[previous]'),
        next: this.querySelector('ids-pager-button[next]'),
        last: this.querySelector('ids-pager-button[last]'),
      },
      input: this.querySelector('ids-pager-input'),
      slots: {
        start: this.container.querySelector('.pager-section.start slot'),
        middle: this.container.querySelector('.pager-section.middle slot'),
        end: this.container.querySelector('.pager-section.end slot'),
      }
    };
  }

  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.MODE,
      attributes.TOTAL, // has to be in this order
      attributes.PAGE_SIZE,
      attributes.PAGE_NUMBER,
      attributes.VERSION
    ];
  }

  template() {
    return (
      `<div class="ids-pager">
        <section class="pager-section start"><slot name="start"></slot></section>
        <section class="pager-section middle" role="navigation"><slot></slot></section>
        <section class="pager-section end"><slot name="end"></slot></section>
      </div>`
    );
  }

  connectedCallback() {
    this.onEvent('pagenumberchange', this, (e) => {
      this.pageNumber = e.detail.value;
    });

    super.connectedCallback?.();
  }

  /**
   * Sync children with the given attribute
   * @param {string} attribute attribute to sync
   * @param {string} value value to sync
   * @private
   */
  #syncChildren(attribute, value) {
    const input = this.querySelector('ids-pager-input');
    if (input) {
      input.setAttribute(attribute, value);
    }
    const list = this.querySelector('ids-pager-number-list');
    if (list) {
      list.setAttribute(attribute, value);
    }
    this.querySelectorAll('ids-pager-button')?.forEach((button) => {
      button.setAttribute(attribute, value);
    });
  }

  /**
   * @param {boolean} value Whether or not to disable the pager overall
   */
  set disabled(value) {
    const isTruthy = stringToBool(value);

    if (isTruthy && !this.hasAttribute(attributes.DISABLED)) {
      this.setAttribute(attributes.DISABLED, '');
      this.#syncChildren(attributes.PARENT_DISABLED, true);
    } else if (!isTruthy && this.hasAttribute(attributes.DISABLED)) {
      this.removeAttribute(attributes.DISABLED);
      this.#syncChildren(attributes.PARENT_DISABLED, false);
    }
  }

  /**
   * @returns {boolean} Whether or not the pager overall is disabled
   */
  get disabled() {
    return this.hasAttribute(attributes.DISABLED);
  }

  /** @param {string|number} value The number of items shown per page */
  set pageSize(value) {
    let nextValue = parseInt(value);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue < 1) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value);
    }
    this.setAttribute(attributes.PAGE_SIZE, nextValue);
    this.#syncChildren(attributes.PAGE_SIZE, nextValue);
    this.#keepPageNumberInBounds();
  }

  /** @returns {string|number} The number of items shown per page */
  get pageSize() {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /** @param {string|number} value A 1-based index for the page number displayed */
  set pageNumber(value) {
    let nextValue = Number.parseInt(value);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else {
      const pageCount = Math.ceil(this.total / this.pageSize);
      nextValue = Math.min(nextValue, pageCount);
    }

    this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    this.#syncChildren(attributes.PAGE_NUMBER, nextValue);
  }

  /** @returns {string|number} value A 1-based-index for the page number displayed */
  get pageNumber() {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount() {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.ceil(this.total / this.pageSize)
      : null;
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
    this.#syncChildren(attributes.TOTAL, nextValue);
    this.#keepPageNumberInBounds();
  }

  /**
   * @returns {string|number} The number of items for pager is tracking
   */
  get total() {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  #keepPageNumberInBounds() {
    let nextValue = parseInt(this.getAttribute(attributes.PAGE_NUMBER));

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else if (nextValue > this.pageCount) {
      nextValue = this.pageCount;
    }

    if (parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue) {
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    }
  }
}
