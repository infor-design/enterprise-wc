import { attributes } from '../../core/ids-attributes';
import IdsDataSource from '../../core/ids-data-source';

import '../../components/ids-pager/ids-pager';
import '../../components/ids-button/ids-button';
import '../../components/ids-menu-button/ids-menu-button';

const PAGINATION_TYPES = {
  NONE: 'none',
  CLIENT_SIDE: 'client-side',
  SERVER_SIDE: 'server-side',
  STANDALONE: 'standalone',
};

/**
/**
 * A mixin that adds pager functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsPagerMixin = (superclass: any): any => class extends superclass {
  /** Reference to the user-provided IdsPager component */
  #pager: any;

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

  constructor() {
    super();
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
    this.pager.innerHTML = this.pagerTemplate();
    this.pager.total = this.datasource.total;
    this.pager.pageNumber = pageNumber;
    this.pager.pageSize = pageSize;

    const popupMenu: any = this.pager.querySelector('ids-popup-menu');
    if (popupMenu) {
      const popupMenuGroup = popupMenu.querySelector('ids-menu-group');

      if (popupMenu.popup) {
        popupMenu.popup.type = 'menu';
      }

      if (popupMenuGroup) {
        popupMenuGroup.style.minWidth = '175px';
        popupMenuGroup.style.textAlign = 'left';
      }
    }

    this.#attachEventListeners();
  }

  /**
   * Get the internal IdsPager component
   * @returns {HTMLElement} the pager dom element
   */
  get pager(): any {
    return this.#pager || this.querySelector('ids-pager') || document.createElement('ids-pager');
  }

  /**
   * Return the attributes we handle as getters/setters
   * @private
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
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
    ].includes(name);

    if (shouldReload) {
      this.connectedCallback();
    }
  }

  pagerTemplate() {
    const pageSize = Math.max(this.pageSize || 0, 1);
    return `
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
      <div slot="end">
        <ids-menu-button id="pager-size-menu-button" menu="pager-size-menu" role="button" dropdown-icon>
          <span slot="text">${pageSize} Records per page</span>
        </ids-menu-button>
        <ids-popup-menu id="pager-size-menu" target="#pager-size-menu-button" trigger-type="click">
          <ids-menu-group select="single">
            <ids-menu-item value="5">5</ids-menu-item>
            <ids-menu-item value="10">10</ids-menu-item>
            <ids-menu-item value="25">25</ids-menu-item>
            <ids-menu-item value="50">50</ids-menu-item>
            <ids-menu-item value="100">100</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </div>
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
  set pagination(value) { this.setAttribute(attributes.PAGINATION, value); }

  /**
   * Gets the pagination attribute
   * @returns {string} default is "none"
   */
  get pagination() { return this.getAttribute(attributes.PAGINATION) || PAGINATION_TYPES.NONE; }

  /**
   * Set the page-number attribute
   * @param {number} value - new the page-number
   */
  set pageNumber(value: number) {
    this.setAttribute(attributes.PAGE_NUMBER, value);
    this.pager.pageNumber = value;
    this.datasource.pageNumber = value;
  }

  /**
   * Get the page-number attribute
   * @returns {number} - the current page-number
   */
  get pageNumber(): number { return parseInt(this.getAttribute(attributes.PAGE_NUMBER) || this.pager.pageNumber) || 1; }

  /**
   * Set the page-size attribute
   * @param {number} value - new the page-size
   */
  set pageSize(value: number) {
    this.setAttribute(attributes.PAGE_SIZE, value);
    this.pager.pageSize = Number(value);
    this.datasource.pageSize = Number(value);

    const popupButton: any = this.pager.querySelector('ids-menu-button');
    if (popupButton) popupButton.text = `${value} Records per page`;
  }

  /**
   * Get the page-size attribute
   * @returns {number} - the current page-size
   */
  get pageSize() { return parseInt(this.getAttribute(attributes.PAGE_SIZE) || this.pager.pageSize) || 1; }

  /**
   * Set the page-total attribute
   * @param {number} value - new the page-total
   */
  set pageTotal(value) {
    this.setAttribute(attributes.PAGE_TOTAL, value);
    this.pager.total = value;
    this.datasource.total = value;
  }

  /**
   * Get the page-total attribute
   * @returns {number} - the current page-total
   */
  get pageTotal() { return parseInt(this.getAttribute(attributes.PAGE_TOTAL)) || this.datasource.total; }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * @private
   */
  connectedCallback() {
    super.connectedCallback?.();
    this.#attachPager();
  }

  /**
   * Appends IdsPager to this.shadowRoot if pagination is enabled.
   * @private
   */
  #attachPager() {
    if (this.pagination && this.pagination !== PAGINATION_TYPES.NONE) {
      this.pager.remove();
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

    const popupMenu: any = this.pager.querySelector('ids-popup-menu');
    if (popupMenu) {
      this.offEvent('selected', popupMenu);
      this.onEvent('selected', popupMenu, (evt: CustomEvent) => {
        const oldPageSize = this.pageSize;
        const newPageSize = evt.detail?.value || oldPageSize;
        if (newPageSize !== oldPageSize) {
          this.pageSize = newPageSize;

          this.triggerEvent('pagenumberchange', this.pager, {
            bubbles: true,
            detail: {
              elem: this.pager,
              value: this.pageNumber,
            }
          });
        }
      });
    }
  }
};

export default IdsPagerMixin;
