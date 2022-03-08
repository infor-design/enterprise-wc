import { attributes } from '../../core/ids-attributes';
import IdsDataSource from '../../core/ids-data-source';
import IdsButton from '../../components/ids-button/ids-button';
import IdsPager from '../../components/ids-pager/ids-pager';
import IdsMenuButton from '../../components/ids-menu-button/ids-menu-button';

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
const IdsPagerMixin = (superclass) => class extends superclass {
  /**
   * The internal IdsPager component
   * @private
   */
  #pager = new IdsPager();

  /**
   * Gets the internal IdsPager component
   * @returns {IdsPager} pager
   */
  get pager() { return this.#pager; }

  /**
   * Gets the internal IdsDataSource object
   * @returns {IdsDataSource} object
   */
  datasource = new IdsDataSource();

  constructor() {
    super();

    const pageNumber = Math.max(parseInt(this.pageNumber) || 1, 1);
    const pageSize = Math.max(parseInt(this.pageSize) || 0, 1);

    this.#pager.innerHTML = `
      <ids-pager-button first></ids-pager-button>
      <ids-pager-button previous></ids-pager-button>
      <ids-pager-input></ids-pager-input>
      <ids-pager-button next></ids-pager-button>
      <ids-pager-button last></ids-pager-button>
      <div slot="end">
        <ids-menu-button id="pager-size-menu-button" menu="pager-size-menu" role="button" dropdown-icon>
          <span slot="text">${pageSize} Records per page</span>
        </ids-menu-button>
        <ids-popup-menu id="pager-size-menu" target="#pager-size-menu-button" trigger="click">
          <ids-menu-group>
            <ids-menu-item icon="${pageSize === 5 ? 'check' : 'no-check'}" value="5">5</ids-menu-item>
            <ids-menu-item icon="${pageSize === 10 ? 'check' : 'no-check'}" value="10">10</ids-menu-item>
            <ids-menu-item icon="${pageSize === 25 ? 'check' : 'no-check'}" value="25">25</ids-menu-item>
            <ids-menu-item icon="${pageSize === 50 ? 'check' : 'no-check'}" value="50">50</ids-menu-item>
            <ids-menu-item icon="${pageSize === 100 ? 'check' : 'no-check'}" value="100">100</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </div>
    `;

    this.#pager.pageNumber = pageNumber;
    this.#pager.pageSize = pageSize;
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
  set pageNumber(value) {
    this.setAttribute(attributes.PAGE_NUMBER, value);
    this.pager.pageNumber = value;
    this.datasource.pageNumber = value;
  }

  /**
   * Get the page-number attribute
   * @returns {number} - the current page-number
   */
  get pageNumber() { return parseInt(this.getAttribute(attributes.PAGE_NUMBER) || this.pager.pageNumber) || 1; }

  /**
   * Set the page-size attribute
   * @param {number} value - new the page-size
   */
  set pageSize(value) {
    this.setAttribute(attributes.PAGE_SIZE, value);
    this.pager.pageSize = value;
    this.datasource.pageSize = value;

    const popupButton = this.pager.querySelector('ids-menu-button');
    popupButton.text = `${value} Records per page`;
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
   * Rerenders the IdsPager component
   * @private
   */
  rerender() {
    super.rerender?.();
    this.#attachPager();
  }

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
    const pager = this.shadowRoot?.querySelector('ids-pager');
    if (!this.pagination || this.pagination === PAGINATION_TYPES.NONE) {
      pager?.remove();
      return;
    }

    this.pager.total = this.datasource.total;
    this.datasource.pageSize = this.pageSize;

    this.offEvent('pagenumberchange', this.pager);
    this.onEvent('pagenumberchange', this.pager, ({ detail }) => {
      const shouldUpdate = [
        PAGINATION_TYPES.CLIENT_SIDE,
        PAGINATION_TYPES.SERVER_SIDE,
      ].includes(this.pagination);

      if (shouldUpdate) {
        this.pageNumber = detail.value;

        // TODO: find a better way/trigger to load results without rebuilding entire component
        this.rerender();
      }
    });

    if (pager) {
      pager.replaceWith(this.pager);
    } else {
      this.shadowRoot?.append(this.pager);
    }

    const popupMenu = this.pager.querySelector('ids-popup-menu');
    const popupMenuGroup = popupMenu.querySelector('ids-menu-group');

    popupMenu.popup.type = 'menu';
    popupMenuGroup.style.minWidth = '175px';
    popupMenuGroup.style.textAlign = 'left';

    this.offEvent('selected', popupMenu);
    this.onEvent('selected', popupMenu, (evt) => {
      const oldPageSize = this.pageSize;
      const newPageSize = evt.detail?.value || oldPageSize;
      if (newPageSize !== oldPageSize) {
        this.pageSize = newPageSize;
        popupMenu.querySelectorAll('ids-menu-item').forEach((item) => {
          item.icon = parseInt(item.value) === parseInt(newPageSize) ? 'check' : 'no-check';
        });

        this.rerender();
      }
    });
  }
};

export default IdsPagerMixin;
