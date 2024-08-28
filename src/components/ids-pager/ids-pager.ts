import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

import './ids-pager-button';
import './ids-pager-dropdown';
import './ids-pager-input';
import './ids-pager-number-list';

import type IdsPagerDropdown from './ids-pager-dropdown';

import styles from './ids-pager.scss';

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container the overall ids-pager container
 */
@customElement('ids-pager')
@scss(styles)
export default class IdsPager extends IdsEventsMixin(IdsElement) {
  readonly DEFAULT_STEP = 3;

  readonly DEFAULT_PAGE_SIZE = 10;

  sizes = [5, 10, 25, 50, 100];

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
        start: this.container?.querySelector('.pager-section.start slot'),
        middle: this.container?.querySelector('.pager-section.middle slot'),
        end: this.container?.querySelector('.pager-section.end slot'),
      },
      dropdowns: this.querySelectorAll('ids-pager-dropdown')
    };
  }

  static get attributes(): Array<string> {
    return [
      attributes.DISABLED,
      attributes.STEP,
      attributes.TOTAL, // has to be in this order
      attributes.TYPE,
      attributes.PAGE_COUNT,
      attributes.PAGE_SIZE,
      attributes.PAGE_NUMBER
    ];
  }

  /**
   * React to attributes changing on the web-component
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    const shouldRerender = [
      attributes.DISABLED,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.STEP,
      attributes.TOTAL,
      attributes.TYPE,
    ].includes(name);
    const transformAttributes = {
      [attributes.DISABLED]: attributes.PARENT_DISABLED,
    };

    if (shouldRerender) {
      if (oldValue !== newValue) {
        this.connectedCallback();
        this.#syncChildren(transformAttributes[name] ?? name, newValue);
      }
    }
  }

  template(): string {
    switch (this.type) {
      case 'list': return this.templatePagerList();
      default: return this.templatePagerButtons();
    }
  }

  templatePagerButtons(): string {
    return `
      <div class="ids-pager">
        <section class="pager-section start"><slot name="start"></slot></section>
        <section class="pager-section middle" role="navigation"><slot></slot></section>
        <section class="pager-section end"><slot name="end"></slot></section>
      </div>
    `;
  }

  /**
   * Set the pager template for listview
   * @returns {string} the default pager template for list-view
   */
  templatePagerList(): string {
    return `
      <div class="ids-pager">
        <ids-pager-button label="Previous page" previous></ids-pager-button>
        <ids-pager-number-list
          label="Page {num} of {total}"
          page-number="${this.pageNumber}"
          page-size="${this.pageSize}"
          total="${this.total}"
          step="${this.step}"
        >
        </ids-pager-number-list>
        <ids-pager-button label="Next page" next></ids-pager-button>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.offEvent('pagenumberchange', this);
    this.onEvent('pagenumberchange', this, (event: CustomEvent) => {
      const val = stringToNumber(event.detail.value);
      if (!Number.isNaN(val) && val !== this.pageNumber) {
        this.pageNumber = Number(event.detail.value);
      }
    });

    this.offEvent('pagesizechange', this);
    this.onEvent('pagesizechange', this, (event: CustomEvent) => {
      this.pageSize = Number(event.detail.value);
    });
  }

  /**
   * Sync children with the given attribute
   * @param {string} attribute attribute to sync
   * @param {string|boolean} value value to sync
   * @private
   */
  #syncChildren(attribute: string, value: string | boolean): void {
    const pagerChildSelectors = [
      'ids-pager-input',
      'ids-pager-number-list',
      'ids-pager-button',
      'ids-pager-dropdown',
    ].join(', ');

    const pagerChildren = [
      ...(this.shadowRoot?.querySelectorAll<HTMLElement>(pagerChildSelectors) || []),
      ...this.querySelectorAll<HTMLElement>(pagerChildSelectors),
    ];

    pagerChildren.forEach((element: HTMLElement) => {
      element.setAttribute(attribute, String(value));
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
    const val = this.isValidPageSize(value);
    this.setAttribute(attributes.PAGE_SIZE, String(val));
    this.#keepPageNumberInBounds();
  }

  /** @returns {number} The number of items shown per page */
  get pageSize(): number {
    return this.isValidPageSize(this.getAttribute(attributes.PAGE_SIZE));
  }

  /**
   * Sets page sizes
   * @param {number[]} sizes array of page sizes
   */
  set pageSizes(sizes: number[]) {
    sizes = sizes.filter((n, idx) => !Number.isNaN(Number(n)) && sizes.indexOf(n) === idx);
    sizes = sizes.length ? sizes : this.sizes;
    sizes.sort((a, b) => a - b);
    this.sizes = sizes;
    this.elements.dropdowns.forEach((elem: IdsPagerDropdown) => elem.updatePageSizes(sizes));
  }

  /**
   * Gets page sizes
   * @returns {number[]} array of page sizes
   */
  get pageSizes(): number[] {
    return this.sizes;
  }

  /**
   * Check given page size value, if not a number return default
   * @private
   * @param {number | string | null} value The value
   * @returns {number} Given value or default
   */
  isValidPageSize(value?: number | string | null): number {
    const val = stringToNumber(value);
    return !Number.isNaN(val) && val > 0 ? val : this.DEFAULT_PAGE_SIZE;
  }

  /** @param {number} value A 1-based index for the page number displayed */
  set pageNumber(value: number | string) {
    const pageNumber = this.pageNumber;
    const pageCount = this.pageCount;
    let val = stringToNumber(value);
    if (val !== pageNumber || (pageNumber < 1) || (pageCount && pageCount < pageNumber)) {
      if (Number.isNaN(val) || val < 1) val = 1;
      else if (pageCount) val = Math.min(val, pageCount);
      this.setAttribute(attributes.PAGE_NUMBER, String(val));
    }
  }

  /** @returns {number} value A 1-based-index for the page number displayed */
  get pageNumber(): number {
    return Math.max(parseInt(this.getAttribute(attributes.PAGE_NUMBER) ?? '') || 1, 1);
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount(): number | null {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.max(Math.ceil(this.total / this.pageSize), 1)
      : null;
  }

  /**
   * Set the number of step for page number list
   * @param {number|string} value The number of steps
   */
  set step(value: number | string) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val)) {
      this.setAttribute(attributes.STEP, String(val));
      return;
    }
    this.removeAttribute(attributes.STEP);
  }

  /** @returns {number|string} value The number of steps */
  get step(): number | string {
    const val = stringToNumber(this.getAttribute(attributes.STEP));
    return (!Number.isNaN(val)) ? val : this.DEFAULT_STEP;
  }

  /** @param {number} value The number of items to track */
  set total(value) {
    let val = stringToNumber(value);
    if (Number.isNaN(val) || val < 1) val = 0;
    this.setAttribute(attributes.TOTAL, String(val));
    this.#keepPageNumberInBounds();
  }

  /** @returns {number} The number of items the pager is tracking */
  get total(): number {
    return stringToNumber(this.getAttribute(attributes.TOTAL));
  }

  /** @param {number} value The number of items to track */
  set type(value: 'buttons' | 'list') {
    this.setAttribute(attributes.TYPE, value);
  }

  /**
   * @returns {'buttons' | 'list'} Type of pager that should be displayed
   */
  get type(): 'buttons' | 'list' {
    return this.getAttribute(attributes.TYPE) as 'buttons' | 'list';
  }

  /**
   * Sync to refresh, must be called with related component reference as: `this.pager?.sync?.apply(this)`
   * @param {object} this The related component reference
   * @returns {void}
   */
  sync(this: any): void {
    const props = ['total', 'pageNumber', 'pageSize'];
    const isValid = (v: any) => typeof v !== 'undefined' && v !== null;

    props.forEach((prop) => {
      const pager: any = this.pager;
      const ds: any = this.datasource;
      const isValidProps = isValid(pager?.[prop]) && isValid(ds?.[prop]);
      if (this.initialized && isValidProps && pager[prop] !== ds[prop]) {
        pager[prop] = ds[prop];
      }
    });
  }

  #keepPageNumberInBounds(): void {
    const attrVal = Number.parseInt(this.getAttribute(attributes.PAGE_NUMBER) ?? '');
    let val = attrVal;
    if (Number.isNaN(val) || val <= 1) val = 1;
    else if (this.pageCount && val > this.pageCount) val = this.pageCount;

    // Dropdowns
    this.elements.dropdowns.forEach((d: IdsPagerDropdown) => {
      if (d.pageSize !== this.pageSize) d.pageSize = this.pageSize;
    });

    if (val !== attrVal && !Number.isNaN(attrVal)) this.setAttribute(attributes.PAGE_NUMBER, String(val));
  }
}
