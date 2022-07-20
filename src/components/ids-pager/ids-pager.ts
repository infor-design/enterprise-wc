import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

// Import Utils
import Base from './ids-pager-base';

import './ids-pager-button';
import './ids-pager-input';
import './ids-pager-number-list';

import styles from './ids-pager.scss';

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

  get elements(): any {
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

  static get attributes(): Array<string> {
    return [
      attributes.DISABLED,
      attributes.MODE,
      attributes.TOTAL, // has to be in this order
      attributes.PAGE_COUNT,
      attributes.PAGE_SIZE,
      attributes.PAGE_NUMBER,
      attributes.VERSION
    ];
  }

  template(): string {
    return (
      `<div class="ids-pager">
        <section class="pager-section start"><slot name="start"></slot></section>
        <section class="pager-section middle" role="navigation"><slot></slot></section>
        <section class="pager-section end"><slot name="end"></slot></section>
      </div>`
    );
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.onEvent('pagenumberchange', this, (event: CustomEvent) => {
      const newPageNumber = Number(event.detail.value);
      const oldPageNumber = Number(this.pageNumber);
      if (newPageNumber !== oldPageNumber) {
        this.pageNumber = newPageNumber;
      }
    });
  }

  /**
   * Sync children with the given attribute
   * @param {string} attribute attribute to sync
   * @param {string} value value to sync
   * @private
   */
  #syncChildren(attribute: any, value: any): void {
    const input = this.querySelector('ids-pager-input');
    if (input) {
      input.setAttribute(attribute, value);
    }
    const list = this.querySelector('ids-pager-number-list');
    if (list) {
      list.setAttribute(attribute, value);
    }
    this.querySelectorAll('ids-pager-button')?.forEach((button: HTMLButtonElement) => {
      button.setAttribute(attribute, value);
    });
  }

  /**
   * @param {boolean} value Whether or not to disable the pager overall
   */
  set disabled(value: boolean) {
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
  get disabled(): boolean {
    return this.hasAttribute(attributes.DISABLED);
  }

  /** @param {number} value The number of items shown per page */
  set pageSize(value: number) {
    let nextValue = parseInt(value as any);

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue < 1) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value as any);
    }
    this.setAttribute(attributes.PAGE_SIZE, nextValue);
    this.#syncChildren(attributes.PAGE_SIZE, nextValue);
    this.#keepPageNumberInBounds();
  }

  /** @returns {number} The number of items shown per page */
  get pageSize(): number {
    return parseInt(this.getAttribute(attributes.PAGE_SIZE));
  }

  /** @param {number} value A 1-based index for the page number displayed */
  set pageNumber(value: number | string) {
    let nextValue = Number.parseInt((value as any));

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

  /** @returns {number} value A 1-based-index for the page number displayed */
  get pageNumber(): number {
    return parseInt(this.getAttribute(attributes.PAGE_NUMBER));
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount(): number | null {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.ceil(this.total / this.pageSize)
      : null;
  }

  /** @param {number} value The number of items to track */
  set total(value) {
    let nextValue;
    if (Number.isNaN(Number.parseInt(value as any))) {
      nextValue = 1;
    } else if (Number.parseInt(value as any) <= 0) {
      nextValue = 1;
    } else {
      nextValue = Number.parseInt(value as any);
    }

    this.setAttribute(attributes.TOTAL, nextValue);
    this.#syncChildren(attributes.TOTAL, nextValue);
    this.#keepPageNumberInBounds();
  }

  /**
   * @returns {number} The number of items for pager is tracking
   */
  get total(): number {
    return parseInt(this.getAttribute(attributes.TOTAL));
  }

  #keepPageNumberInBounds(): void {
    let nextValue = parseInt(this.getAttribute(attributes.PAGE_NUMBER));

    if (Number.isNaN(nextValue)) {
      nextValue = 1;
    } else if (nextValue <= 1) {
      nextValue = 1;
    } else if (this.pageCount && nextValue > this.pageCount) {
      nextValue = this.pageCount;
    }

    if (parseInt(this.getAttribute(attributes.PAGE_NUMBER)) !== nextValue) {
      this.setAttribute(attributes.PAGE_NUMBER, nextValue);
    }
  }
}
