import { attributes } from '../../core/ids-attributes';
import IdsDataSource from '../../core/ids-data-source';

import '../../components/ids-pager/ids-pager';
import '../../components/ids-button/ids-button';
import '../../components/ids-menu-button/ids-menu-button';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsConstructor } from '../../core/ids-element';
import type IdsPager from '../../components/ids-pager/ids-pager';

const PAGINATION_TYPES = {
  NONE: 'none',
  CLIENT_SIDE: 'client-side',
  SERVER_SIDE: 'server-side',
  STANDALONE: 'standalone',
} as const;

type PaginationTypes = typeof PAGINATION_TYPES[keyof typeof PAGINATION_TYPES];

interface PaginationHandler {
  onPagingReload?(reloadEventType: string): void;
}

type Constraints = IdsConstructor<EventsMixinInterface & PaginationHandler>;

/**
/**
 * A mixin that adds pager functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPagerMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  /** Reference to the user-provided IdsPager component */
  #pager: any;

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

  constructor(...args: any[]) {
    super(...args);
  }

  /**
   * Set the internal IdsPager component
   * @param {HTMLElement} pager The pager dom element
   */
  set pager(pager: any) {
    this.#pager = pager;

    const pageNumber = Math.max(this.pageNumber || 1, 1);
    const pageSize = Math.max(this.pageSize || 0, 1);

    this.datasource.pageSize = pageSize;
    if (this.pagination !== PAGINATION_TYPES.STANDALONE) this.pager.innerHTML = this.pagerTemplate();
    this.pager.total = this.datasource.total;
    this.pager.pageNumber = pageNumber;
    this.pager.pageSize = pageSize;

    this.#attachEventListeners();
  }

  /**
   * Get the internal IdsPager component
   * @returns {HTMLElement} the pager dom element
   */
  get pager(): IdsPager {
    return this.#pager || this.querySelector('ids-pager') || document.createElement('ids-pager');
  }

  /**
   * Return the attributes we handle as getters/setters
   * @private
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.PAGINATION,
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PAGE_TOTAL,
    ];
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) {
      return;
    }

    const shouldReload = [
      attributes.PAGE_NUMBER,
      attributes.PAGE_SIZE,
      attributes.PAGE_TOTAL,
      attributes.PAGINATION,
    ].includes(name);

    if (shouldReload && typeof this.onPagingReload === 'function') {
      this.onPagingReload(name);
    }
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * @private
   */
  connectedCallback() {
    super.connectedCallback?.();
    this.#attachPager();
  }

  pagerTemplate() {
    const pageSize = Math.max(this.pageSize || 0, 1);
    return `
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
      <ids-pager-dropdown slot="end" page-size="${pageSize}"></ids-pager-dropdown>
    `;
  }

  /**
   * @param {number} pageNumber - a page number to start with
   * @param {number} pageSize - number of items to return
   * @returns {Array} the paginated data
   * @see IdsDataSource.paginate()
   */
  paginate(pageNumber = 1, pageSize = 10) {
    return this.datasource.paginate(pageNumber, pageSize);
  }

  /**
   * Sets the pagination attribute
   * @param {string} value - none|client-side|standalone
   */
  set pagination(value: PaginationTypes) { this.setAttribute(attributes.PAGINATION, value); }

  /**
   * Gets the pagination attribute
   * @returns {PaginationTypes} default is "none"
   */
  get pagination(): PaginationTypes {
    return this.getAttribute(attributes.PAGINATION) as PaginationTypes || PAGINATION_TYPES.NONE;
  }

  /**
   * Set the page-number attribute
   * @param {number} value - new the page-number
   */
  set pageNumber(value: number) {
    this.setAttribute(attributes.PAGE_NUMBER, String(value));
    this.pager.pageNumber = value;
    this.datasource.pageNumber = value;
  }

  /**
   * Get the page-number attribute
   * @returns {number} - the current page-number
   */
  get pageNumber(): number { return parseInt(this.getAttribute(attributes.PAGE_NUMBER) || '') || this.pager.pageNumber || 1; }

  /**
   * Set the page-size attribute
   * @param {number} value - new the page-size
   */
  set pageSize(value: number) {
    this.setAttribute(attributes.PAGE_SIZE, String(value));
    this.pager.pageSize = Number(value);
    this.datasource.pageSize = Number(value);
  }

  /**
   * Get the page-size attribute
   * @returns {number} - the current page-size
   */
  get pageSize() { return parseInt(this.getAttribute(attributes.PAGE_SIZE) || '') || this.pager.pageSize || 1; }

  /**
   * Set the page-total attribute
   * @param {number} value - new the page-total
   */
  set pageTotal(value) {
    this.setAttribute(attributes.PAGE_TOTAL, String(value));
    this.pager.total = value;
    this.datasource.total = value;
  }

  /**
   * Get the page-total attribute
   * @returns {number} - the current page-total
   */
  get pageTotal(): number {
    return parseInt(this.getAttribute(attributes.PAGE_TOTAL) || '') || this.datasource.total;
  }

  /**
   * Appends IdsPager to this.shadowRoot if pagination is enabled.
   * @private
   */
  #attachPager() {
    if (!this.pagination || this.pagination === PAGINATION_TYPES.NONE) {
      this.pager.remove();
      return;
    }

    if (this.pagination === PAGINATION_TYPES.STANDALONE) {
      return;
    }

    const nestedPager = this.querySelector('ids-pager') || this.shadowRoot?.querySelector('ids-pager');
    if (!nestedPager) {
      const currentPager = this.pager;
      this.pager = currentPager;
      this.container?.after(this.pager);
    }
  }

  #attachEventListeners() {
    this.offEvent('pagenumberchange', this.pager);
    this.onEvent('pagenumberchange', this.pager, (event: CustomEvent) => {
      this.pageNumber = Number(event.detail.value);
    });

    this.offEvent('pagesizechange', this.pager);
    this.onEvent('pagesizechange', this.pager, (event: CustomEvent) => {
      this.pageSize = Number(event.detail.value);
    });
  }
};

export default IdsPagerMixin;
