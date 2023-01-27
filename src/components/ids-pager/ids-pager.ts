import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';

import './ids-pager-button';
import './ids-pager-dropdown';
import './ids-pager-input';
import './ids-pager-number-list';

import type IdsPagerDropdown from './ids-pager-dropdown';

import styles from './ids-pager.scss';

const Base = IdsThemeMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Pager Component
 * @type {IdsPager}
 * @inherits IdsElement
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
      attributes.MODE,
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

    if (shouldRerender) {
      if (oldValue !== newValue) {
        this.connectedCallback();
      }

      this.#syncChildren(name, newValue);
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
      this.pageNumber = Number(event.detail.value);
    });

    this.offEvent('pagesizechange', this);
    this.onEvent('pagesizechange', this, (event: CustomEvent) => {
      this.pageSize = Number(event.detail.value);
    });
  }

  /**
   * Sync children with the given attribute
   * @param {string} attribute attribute to sync
   * @param {string} value value to sync
   * @private
   */
  #syncChildren(attribute: any, value: any): void {
    const pagerChildSelectors = [
      'ids-pager-input',
      'ids-pager-number-list',
      'ids-pager-button',
    ].join(', ');

    const pagerChildren = [
      ...(this.shadowRoot?.querySelectorAll<HTMLElement>(pagerChildSelectors) || []),
      ...this.querySelectorAll<HTMLElement>(pagerChildSelectors),
    ];

    pagerChildren.forEach((element: HTMLElement) => {
      element.setAttribute(attribute, value);
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
    let val = Number.parseInt(value as any);
    if (Number.isNaN(val) || val < 1) val = 1;
    this.setAttribute(attributes.PAGE_SIZE, String(val));
    this.#keepPageNumberInBounds();
  }

  /** @returns {number} The number of items shown per page */
  get pageSize(): number {
    return Math.max(parseInt(this.getAttribute(attributes.PAGE_SIZE) ?? '') || 1, 1);
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

    this.setAttribute(attributes.PAGE_NUMBER, String(nextValue));
  }

  /** @returns {number} value A 1-based-index for the page number displayed */
  get pageNumber(): number {
    return Math.max(parseInt(this.getAttribute(attributes.PAGE_NUMBER) ?? '') || 1, 1);
  }

  /** @returns {number|null} The calculated pageCount using total and pageSize */
  get pageCount(): number | null {
    return (this.total !== null && !Number.isNaN(this.total))
      ? Math.ceil(this.total / this.pageSize)
      : null;
  }

  /**
   * Set the number of step for page number list
   * @param {number|string} value The number of steps
   */
  set step(value: number | string) {
    this.setAttribute(attributes.STEP, String(value));
  }

  /** @returns {number|string} value The number of steps */
  get step(): number | string {
    return Number(this.getAttribute(attributes.STEP)) || 0;
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

    this.setAttribute(attributes.TOTAL, String(nextValue));
    this.#keepPageNumberInBounds();
  }

  /** @returns {number} The number of items the pager is tracking */
  get total(): number {
    return Math.max(parseInt(this.getAttribute(attributes.TOTAL) ?? '') || 1, 1);
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

  #keepPageNumberInBounds(): void {
    const attrVal = Number.parseInt(this.getAttribute(attributes.PAGE_NUMBER) ?? '');
    let val = attrVal;
    if (Number.isNaN(val) || val <= 1) val = 1;
    else if (this.pageCount && val > this.pageCount) val = this.pageCount;

    // Dropdowns
    this.elements.dropdowns.forEach((d: IdsPagerDropdown) => {
      if (d.pageSize !== this.pageSize) d.pageSize = this.pageSize;
    });

    if (val !== attrVal) this.setAttribute(attributes.PAGE_NUMBER, String(val));
  }
}
